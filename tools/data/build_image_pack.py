#!/usr/bin/env python3
"""
Offline Image Package Indexer for MARSWALK.
Validates the local image payload via verify_pack.verify_package, computes
deterministic file inventories with SHA-256 checksums and exact byte sizes,
and produces or validates public/data/image-pack.json.

Usage:
  # Generate or update image-pack.json atomically:
  python tools/data/build_image_pack.py \
    --manifest public/data/manifest.json \
    --public-root public \
    --output public/data/image-pack.json

  # Read-only verification of existing index:
  python tools/data/build_image_pack.py \
    --manifest public/data/manifest.json \
    --public-root public \
    --output public/data/image-pack.json \
    --check
"""
import argparse
import json
import os
import sys
import tempfile

# Ensure tools/data is importable
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

import verify_pack


def is_path_contained(path: str, parent: str) -> bool:
    """Verifies that resolved path is strictly contained within resolved parent directory."""
    try:
        resolved_path = os.path.realpath(os.path.abspath(path))
        resolved_parent = os.path.realpath(os.path.abspath(parent))
        return os.path.commonpath([resolved_path, resolved_parent]) == resolved_parent
    except Exception:
        return False


def paths_alias(path1: str, path2: str) -> bool:
    """Checks whether two paths resolve to the same filesystem location."""
    try:
        if os.path.exists(path1) and os.path.exists(path2):
            return os.path.samefile(path1, path2)
        p1 = os.path.realpath(os.path.abspath(path1))
        p2 = os.path.realpath(os.path.abspath(path2))
        return p1 == p2
    except Exception:
        return False


def build_index_data(manifest_path: str, public_root: str) -> tuple[bool, dict | None, list[str]]:
    """
    Validates manifest and image using verify_pack.verify_package and constructs
    the canonical image pack dictionary.
    Returns (success, index_dict, errors).
    """
    errors: list[str] = []

    # 1. Path confinement checks
    if not is_path_contained(manifest_path, public_root):
        errors.append(f"Manifest path '{manifest_path}' is not contained within public root '{public_root}'.")
        return False, None, errors

    # Calculate app-base-relative manifest path
    rel_manifest_path = os.path.relpath(os.path.abspath(manifest_path), os.path.abspath(public_root)).replace("\\", "/")
    if rel_manifest_path.startswith("..") or rel_manifest_path.startswith("/"):
        errors.append(f"Manifest path resolves outside public root: '{rel_manifest_path}'")
        return False, None, errors

    # 2. Run full verification via verify_pack
    valid, res = verify_pack.verify_package(manifest_path, public_root)
    if not valid or not res.get("success"):
        errors.extend(res.get("errors", ["Package validation failed"]))
        return False, None, errors

    manifest_data = res["manifest"]
    image_rel_path = manifest_data["assetPath"]
    resolved_image_path = res["imagePath"]

    if not is_path_contained(resolved_image_path, public_root):
        errors.append(f"Referenced image '{resolved_image_path}' escapes public root '{public_root}'.")
        return False, None, errors

    # 3. Construct canonical v1 index structure
    manifest_bytes = res["manifestBytes"]
    manifest_sha256 = res["manifestSha256"]
    image_bytes = res["imageBytes"]
    image_sha256 = res["imageSha256"]
    total_bytes = manifest_bytes + image_bytes

    index_data = {
        "schemaVersion": 1,
        "imageRef": manifest_data["imageRef"],
        "files": [
            {
                "path": rel_manifest_path,
                "bytes": manifest_bytes,
                "sha256": manifest_sha256,
            },
            {
                "path": image_rel_path,
                "bytes": image_bytes,
                "sha256": image_sha256,
            },
        ],
        "totalBytes": total_bytes,
    }

    return True, index_data, []


def write_index_atomically(index_data: dict, output_path: str):
    """Writes index_data to output_path atomically with deterministic formatting and trailing newline."""
    output_dir = os.path.dirname(os.path.abspath(output_path))
    os.makedirs(output_dir, exist_ok=True)

    json_text = json.dumps(index_data, indent=2) + "\n"

    # Write to a temporary file in the same directory, then rename atomically
    temp_fd, temp_path = tempfile.mkstemp(prefix="image_pack_", suffix=".tmp", dir=output_dir)
    try:
        with open(temp_fd, "w", encoding="utf-8", newline="\n") as f:
            f.write(json_text)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_path, output_path)
    except Exception:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
        raise


def check_index(expected_data: dict, output_path: str) -> tuple[bool, list[str]]:
    """Compares existing index file with expected data in read-only mode."""
    errors: list[str] = []
    if not os.path.isfile(output_path):
        errors.append(f"Index file does not exist: '{output_path}'")
        return False, errors

    try:
        with open(output_path, "r", encoding="utf-8") as f:
            actual_data = json.load(f)
    except json.JSONDecodeError as exc:
        errors.append(f"Failed to parse existing index JSON: {exc}")
        return False, errors
    except Exception as exc:
        errors.append(f"Failed to read index file: {exc}")
        return False, errors

    # Check schemaVersion
    if actual_data.get("schemaVersion") != expected_data["schemaVersion"]:
        errors.append(
            f"schemaVersion mismatch: expected {expected_data['schemaVersion']}, got {actual_data.get('schemaVersion')}"
        )

    # Check imageRef
    if actual_data.get("imageRef") != expected_data["imageRef"]:
        errors.append(
            f"imageRef mismatch: expected '{expected_data['imageRef']}', got '{actual_data.get('imageRef')}'"
        )

    # Check files array
    actual_files = actual_data.get("files")
    expected_files = expected_data["files"]
    if not isinstance(actual_files, list) or len(actual_files) != len(expected_files):
        errors.append(
            f"File count mismatch: expected {len(expected_files)} files, got {len(actual_files) if isinstance(actual_files, list) else 'invalid'}"
        )
    else:
        for idx, (exp, act) in enumerate(zip(expected_files, actual_files)):
            if not isinstance(act, dict):
                errors.append(f"Entry {idx} in 'files' is not an object")
                continue
            for key in ("path", "bytes", "sha256"):
                if act.get(key) != exp[key]:
                    errors.append(
                        f"Mismatch in files[{idx}].{key}: expected '{exp[key]}', got '{act.get(key)}'"
                    )

    # Check totalBytes
    if actual_data.get("totalBytes") != expected_data["totalBytes"]:
        errors.append(
            f"totalBytes mismatch: expected {expected_data['totalBytes']}, got {actual_data.get('totalBytes')}"
        )

    return len(errors) == 0, errors


def main():
    parser = argparse.ArgumentParser(description="Build or check the MARSWALK offline image-pack index.")
    parser.add_argument("--manifest", default="public/data/manifest.json", help="Path to manifest.json")
    parser.add_argument("--public-root", default="public", help="Path to public directory root")
    parser.add_argument("--output", default="public/data/image-pack.json", help="Output path for image-pack.json")
    parser.add_argument("--check", action="store_true", help="Read-only mode: check existing index against current assets")
    args = parser.parse_args()

    manifest_path = os.path.normpath(args.manifest)
    public_root = os.path.normpath(args.public_root)
    output_path = os.path.normpath(args.output)

    # Alias check: output must not alias manifest
    if paths_alias(output_path, manifest_path):
        print(f"[ERROR] Output path '{output_path}' aliases manifest input '{manifest_path}'. Operation rejected.", file=sys.stderr)
        sys.exit(1)

    # Validate package and build index in memory
    success, index_data, errors = build_index_data(manifest_path, public_root)
    if not success or index_data is None:
        print("[ERROR] Failed to validate image package:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        sys.exit(1)

    # Check if output aliases the resolved image path
    image_rel = index_data["files"][1]["path"]
    resolved_image = os.path.normpath(os.path.join(public_root, image_rel))
    if paths_alias(output_path, resolved_image):
        print(f"[ERROR] Output path '{output_path}' aliases image input '{resolved_image}'. Operation rejected.", file=sys.stderr)
        sys.exit(1)

    if args.check:
        matched, check_errors = check_index(index_data, output_path)
        if matched:
            print(f"[SUCCESS] Image-pack index '{output_path}' matches active image package.")
            print(f"  imageRef:   {index_data['imageRef']}")
            print(f"  totalBytes: {index_data['totalBytes']:,} bytes ({index_data['totalBytes'] / 1024:.1f} KB)")
            for f in index_data["files"]:
                print(f"    - {f['path']} ({f['bytes']:,} bytes, sha256: {f['sha256'][:16]}...)")
            sys.exit(0)
        else:
            print(f"[ERROR] Image-pack index '{output_path}' is stale, missing, or mismatched:", file=sys.stderr)
            for err in check_errors:
                print(f"  - {err}", file=sys.stderr)
            sys.exit(1)
    else:
        try:
            write_index_atomically(index_data, output_path)
            print(f"[SUCCESS] Generated image-pack index: '{output_path}'")
            print(f"  imageRef:   {index_data['imageRef']}")
            print(f"  totalBytes: {index_data['totalBytes']:,} bytes ({index_data['totalBytes'] / 1024:.1f} KB)")
            for f in index_data["files"]:
                print(f"    - {f['path']} ({f['bytes']:,} bytes, sha256: {f['sha256'][:16]}...)")
            sys.exit(0)
        except Exception as exc:
            print(f"[ERROR] Failed to write image-pack index atomically: {exc}", file=sys.stderr)
            sys.exit(1)


if __name__ == "__main__":
    main()

