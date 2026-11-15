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
import re
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


IMAGE_ASSET_PATTERN = re.compile(r"^data/imagery/[a-zA-Z0-9_./-]+$")


def validate_browser_asset_path(path: str, public_root: str, label: str) -> tuple[bool, str | None]:
    r"""
    Validates that a path matches the runtime validManifest browser-path syntax:
    - non-empty string without leading/trailing whitespace
    - no whitespace or control characters
    - no percent escapes (e.g. %2e%2e, %23)
    - no backslash (\), query string (?), fragment identifier (#), URL scheme (://) or authority (//)
    - no absolute path, empty, dot (.), or traversal (..) segments
    - for image assets: strictly matches ^data/imagery/[a-zA-Z0-9_./-]+$
    - for manifest: must be exactly 'data/manifest.json'
    - resolved target on disk must not escape public_root (including via symlinks)
    """
    if not isinstance(path, str) or not path.strip():
        return False, f"{label} path must be a non-empty string"
    if path != path.strip():
        return False, f"{label} path '{path}' contains leading or trailing whitespace"
    if any(c.isspace() or ord(c) < 32 or ord(c) == 127 for c in path):
        return False, f"{label} path '{path}' contains forbidden whitespace or control characters"
    if "%" in path:
        return False, f"{label} path '{path}' contains forbidden percent escapes"
    if "\\" in path:
        return False, f"{label} path '{path}' contains forbidden backslash"
    if "?" in path:
        return False, f"{label} path '{path}' contains forbidden query string"
    if "#" in path:
        return False, f"{label} path '{path}' contains forbidden fragment identifier"
    if "://" in path or path.startswith("//"):
        return False, f"{label} path '{path}' contains forbidden URL scheme or authority"
    if path.startswith("/"):
        return False, f"{label} path '{path}' must not be an absolute path"

    segments = path.split("/")
    if any(seg in ("", ".", "..") for seg in segments):
        return False, f"{label} path '{path}' contains empty, dot, or traversal segments"

    if label == "Manifest":
        if path != "data/manifest.json":
            return False, f"Manifest path must be exactly 'data/manifest.json', found '{path}'"
    else:
        if not IMAGE_ASSET_PATTERN.fullmatch(path):
            return False, (
                f"{label} path '{path}' violates runtime asset-path syntax "
                f"(must match ^data/imagery/[a-zA-Z0-9_./-]+$ without percent escapes, whitespace, or invalid characters)"
            )

    # Filesystem containment and symlink escape verification
    try:
        resolved_root = os.path.realpath(os.path.abspath(public_root))
        resolved_file = os.path.realpath(os.path.join(resolved_root, *segments))
        if os.path.commonpath([resolved_file, resolved_root]) != resolved_root:
            return False, f"{label} path '{path}' resolves outside public root '{public_root}'"
    except Exception:
        return False, f"{label} path '{path}' containment verification failed"

    return True, None


def validate_index_schema(data: any) -> tuple[bool, list[str]]:
    """
    Validates the complete v1 index JSON structure and strict scalar types
    prior to field value comparison:
    - Root must be a JSON object with exactly {"schemaVersion", "imageRef", "files", "totalBytes"}
    - schemaVersion must be integer 1 (strictly excluding boolean)
    - imageRef must be a non-empty string
    - totalBytes must be a positive integer (strictly excluding boolean/float)
    - files must be an array of exactly 2 objects with exact keys {"path", "bytes", "sha256"}
    - files[0].path must be 'data/manifest.json'
    - files[1].path must start with 'data/imagery/' and be a valid browser path
    - files[i].bytes must be positive integers (strictly excluding boolean/float)
    - files[i].sha256 must be a 64-character lowercase hexadecimal digest
    - totalBytes must equal sum(files[i].bytes)
    """
    errors: list[str] = []
    if not isinstance(data, dict):
        return False, [f"Root of index must be a JSON object, found {type(data).__name__}"]

    expected_root_keys = {"schemaVersion", "imageRef", "files", "totalBytes"}
    actual_root_keys = set(data.keys())
    if actual_root_keys != expected_root_keys:
        missing = expected_root_keys - actual_root_keys
        extra = actual_root_keys - expected_root_keys
        if missing:
            errors.append(f"Missing required root keys: {sorted(missing)}")
        if extra:
            errors.append(f"Unexpected extra root keys: {sorted(extra)}")

    # schemaVersion: integer 1, strictly not boolean
    sv = data.get("schemaVersion")
    if type(sv) is not int or isinstance(sv, bool) or sv != 1:
        errors.append(f"schemaVersion must be integer 1, found {type(sv).__name__} ({sv!r})")

    # imageRef: non-empty string
    ir = data.get("imageRef")
    if not isinstance(ir, str) or not ir.strip():
        errors.append(f"imageRef must be a non-empty string, found {type(ir).__name__} ({ir!r})")

    # totalBytes: integer > 0, strictly not boolean or float
    tb = data.get("totalBytes")
    if type(tb) is not int or isinstance(tb, bool) or tb <= 0:
        errors.append(f"totalBytes must be a positive integer, found {type(tb).__name__} ({tb!r})")

    # files: list of exactly 2 items
    files = data.get("files")
    if not isinstance(files, list):
        errors.append(f"files must be an array, found {type(files).__name__}")
    elif len(files) != 2:
        errors.append(f"files array must contain exactly 2 entries, found {len(files)}")
    else:
        expected_file_keys = {"path", "bytes", "sha256"}
        for idx, entry in enumerate(files):
            if not isinstance(entry, dict):
                errors.append(f"files[{idx}] must be a JSON object, found {type(entry).__name__}")
                continue

            entry_keys = set(entry.keys())
            if entry_keys != expected_file_keys:
                missing = expected_file_keys - entry_keys
                extra = entry_keys - expected_file_keys
                if missing:
                    errors.append(f"files[{idx}] missing required keys: {sorted(missing)}")
                if extra:
                    errors.append(f"files[{idx}] unexpected extra keys: {sorted(extra)}")

            p = entry.get("path")
            if not isinstance(p, str) or not p.strip():
                errors.append(f"files[{idx}].path must be a non-empty string, found {type(p).__name__}")
            elif (
                p != p.strip()
                or any(c.isspace() or ord(c) < 32 or ord(c) == 127 for c in p)
                or "%" in p
                or "\\" in p
                or "?" in p
                or "#" in p
                or "://" in p
                or p.startswith("//")
                or p.startswith("/")
                or any(s in ("", ".", "..") for s in p.split("/"))
            ):
                errors.append(f"files[{idx}].path '{p}' is not a valid app-relative browser path")
            elif idx == 0 and p != "data/manifest.json":
                errors.append(f"files[0].path must be 'data/manifest.json', found '{p}'")
            elif idx == 1 and not IMAGE_ASSET_PATTERN.fullmatch(p):
                errors.append(f"files[1].path '{p}' violates runtime asset-path syntax (^data/imagery/[a-zA-Z0-9_./-]+$)")

            b = entry.get("bytes")
            if type(b) is not int or isinstance(b, bool) or b <= 0:
                errors.append(f"files[{idx}].bytes must be a positive integer, found {type(b).__name__} ({b!r})")

            s = entry.get("sha256")
            if not isinstance(s, str) or len(s) != 64 or not all(c in "0123456789abcdef" for c in s):
                errors.append(f"files[{idx}].sha256 must be a 64-character lowercase hex digest, found {s!r}")

    if errors:
        return False, errors

    # Check payload ordering
    if files[0]["path"] != "data/manifest.json":
        errors.append(f"files[0].path must be 'data/manifest.json', found '{files[0]['path']}'")
    if not files[1]["path"].startswith("data/imagery/"):
        errors.append(f"files[1].path must start with 'data/imagery/', found '{files[1]['path']}'")

    # Check sum of declared files equals totalBytes
    sum_bytes = files[0]["bytes"] + files[1]["bytes"]
    if tb != sum_bytes:
        errors.append(f"totalBytes ({tb}) does not equal sum of file bytes ({sum_bytes})")

    return len(errors) == 0, errors


def build_index_data(manifest_path: str, public_root: str) -> tuple[bool, dict | None, list[str]]:
    """
    Validates manifest and image using verify_pack.verify_package and constructs
    the canonical image pack dictionary.
    Returns (success, index_dict, errors).
    """
    errors: list[str] = []

    # 1. Path confinement and manifest canonical naming
    if not is_path_contained(manifest_path, public_root):
        errors.append(f"Manifest path '{manifest_path}' is not contained within public root '{public_root}'.")
        return False, None, errors

    try:
        norm_manifest = os.path.normpath(manifest_path)
        norm_root = os.path.normpath(public_root)
        rel_manifest_path = os.path.relpath(norm_manifest, norm_root).replace("\\", "/")
    except Exception as exc:
        errors.append(f"Failed to resolve relative manifest path: {exc}")
        return False, None, errors

    if rel_manifest_path != "data/manifest.json":
        errors.append(
            f"Manifest relative path must be exactly 'data/manifest.json' under public root, found '{rel_manifest_path}'"
        )
        return False, None, errors

    valid_m, err_m = validate_browser_asset_path(rel_manifest_path, public_root, "Manifest")
    if not valid_m:
        errors.append(err_m)
        return False, None, errors

    # Pre-validate manifest JSON assetPath syntax against runtime rules before package decode
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest_json = json.load(f)
        if isinstance(manifest_json, dict) and "assetPath" in manifest_json:
            asset_path = manifest_json["assetPath"]
            valid_asset, err_asset = validate_browser_asset_path(asset_path, public_root, "Image asset")
            if not valid_asset:
                errors.append(err_asset)
                return False, None, errors
    except Exception:
        pass  # If manifest cannot be parsed as JSON, verify_pack will report that

    # 2. Run full verification via verify_pack
    valid, res = verify_pack.verify_package(manifest_path, public_root)
    if not valid or not res.get("success"):
        errors.extend(res.get("errors", ["Package validation failed"]))
        return False, None, errors

    manifest_data = res["manifest"]
    image_rel_path = manifest_data["assetPath"]
    resolved_image_path = res["imagePath"]

    # 3. Validate image asset path and confinement
    valid_img, err_img = validate_browser_asset_path(image_rel_path, public_root, "Image asset")
    if not valid_img:
        errors.append(err_img)
        return False, None, errors

    if not is_path_contained(resolved_image_path, public_root):
        errors.append(f"Referenced image '{resolved_image_path}' escapes public root '{public_root}'.")
        return False, None, errors

    # 4. Construct canonical v1 index structure
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

    # Write to a temporary file in the destination directory, flush/fsync, then rename atomically
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

    # Validate structural schema and scalar types first
    valid_schema, schema_errors = validate_index_schema(actual_data)
    if not valid_schema:
        errors.extend(schema_errors)
        return False, errors

    # Check payload values against computed expectation
    if actual_data["schemaVersion"] != expected_data["schemaVersion"]:
        errors.append(
            f"schemaVersion mismatch: expected {expected_data['schemaVersion']}, got {actual_data['schemaVersion']}"
        )

    if actual_data["imageRef"] != expected_data["imageRef"]:
        errors.append(
            f"imageRef mismatch: expected '{expected_data['imageRef']}', got '{actual_data['imageRef']}'"
        )

    if actual_data["totalBytes"] != expected_data["totalBytes"]:
        errors.append(
            f"totalBytes mismatch: expected {expected_data['totalBytes']}, got {actual_data['totalBytes']}"
        )

    for idx, (exp, act) in enumerate(zip(expected_data["files"], actual_data["files"])):
        for key in ("path", "bytes", "sha256"):
            if act[key] != exp[key]:
                errors.append(
                    f"Mismatch in files[{idx}].{key}: expected '{exp[key]}', got '{act[key]}'"
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
