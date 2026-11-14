#!/usr/bin/env python3
"""
Offline Image Package Verifier for MARSWALK.
Validates the data manifest against the shared contract, confirms the referenced
raster exists, verifies that it fully decodes cleanly (detecting truncated files
via Pillow's .load()), compares actual dimensions to the manifest, and calculates
file sizes and SHA-256 checksums.

This tool runs completely offline, performs read-only operations, and does not
modify or download any data.

Usage:
  python tools/data/verify_pack.py --manifest public/data/manifest.json --public-root public [--json]
"""
import argparse
import hashlib
import json
import os
import sys
import urllib.parse

def decode_and_verify_image(file_path: str):
    """
    Decodes the image and verifies its full integrity.
    Uses Pillow's .load() to fully decode pixel data and catch truncated or corrupted files.
    """
    try:
        from PIL import Image, ImageFile
    except ImportError as exc:
        raise RuntimeError(
            "Pillow is required for full image verification. Install it with: "
            "python -m pip install -r tools/data/requirements.txt"
        ) from exc

    # Header/end markers alone cannot establish that the pixel data is intact.
    ImageFile.LOAD_TRUNCATED_IMAGES = False
    with Image.open(file_path) as img:
        w, h = img.size
        img.load()
        return w, h, f"{img.format} (fully decoded via Pillow .load())"

def is_valid_https_url(url: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(url)
        return parsed.scheme == "https" and bool(parsed.netloc) and not parsed.username and not parsed.password
    except Exception:
        return False

def validate_manifest_schema(m: dict) -> list[str]:
    errors = []

    if not isinstance(m, dict):
        return ["Manifest root must be a JSON object"]

    if m.get("schemaVersion") != 1:
        errors.append(f"schemaVersion must be 1, found: {m.get('schemaVersion')}")

    image_ref = m.get("imageRef")
    if not isinstance(image_ref, str) or not image_ref.strip():
        errors.append("imageRef must be a non-empty string")

    coord_sys = m.get("coordinateSystem")
    if coord_sys != "image-pixels-bottom-left":
        errors.append(f"coordinateSystem must be 'image-pixels-bottom-left', found: {coord_sys}")

    cov_status = m.get("coverageStatus")
    if cov_status not in ("regional-context", "verified-aoi"):
        errors.append(f"coverageStatus must be 'regional-context' or 'verified-aoi', found: {cov_status}")

    width = m.get("width")
    if not isinstance(width, int) or isinstance(width, bool) or width <= 0:
        errors.append(f"width must be a positive integer, found: {width}")

    height = m.get("height")
    if not isinstance(height, int) or isinstance(height, bool) or height <= 0:
        errors.append(f"height must be a positive integer, found: {height}")

    asset_path = m.get("assetPath")
    if not isinstance(asset_path, str) or not asset_path.strip():
        errors.append("assetPath must be a non-empty string")
    else:
        parts = asset_path.split("/")
        if not asset_path.startswith("data/imagery/") or any(p in ("..", ".", "") for p in parts):
            errors.append(f"assetPath must be relative path starting with 'data/imagery/' without '..' or '.', found: {asset_path}")

    source = m.get("source")
    if not isinstance(source, dict):
        errors.append("source must be an object")
    else:
        if not isinstance(source.get("title"), str) or not source.get("title", "").strip():
            errors.append("source.title must be a non-empty string")
        url = source.get("url")
        if not isinstance(url, str) or not is_valid_https_url(url):
            errors.append(f"source.url must be a valid HTTPS URL, found: {url}")
        if not isinstance(source.get("credit"), str) or not source.get("credit", "").strip():
            errors.append("source.credit must be a non-empty string")

    limitations = m.get("limitations")
    if not isinstance(limitations, list) or not limitations or not all(isinstance(x, str) and x.strip() for x in limitations):
        errors.append("limitations must be a non-empty list of non-empty strings")

    obs_date = m.get("observationDate")
    if obs_date is not None and (not isinstance(obs_date, str) or not obs_date.strip()):
        errors.append("observationDate must be null or a non-empty string")

    cal = m.get("calibration")
    if not isinstance(cal, dict) or not isinstance(cal.get("verified"), bool):
        errors.append("calibration must be an object with boolean 'verified'")
    else:
        if not cal["verified"]:
            if cal.get("metersPerPixel") is not None or cal.get("sourceUrl") is not None or cal.get("method") is not None:
                errors.append("Unverified calibration must have null metersPerPixel, sourceUrl, and method")
        else:
            mpp = cal.get("metersPerPixel")
            if not isinstance(mpp, (int, float)) or mpp <= 0:
                errors.append(f"Verified calibration requires positive finite metersPerPixel, found: {mpp}")
            s_url = cal.get("sourceUrl")
            if not isinstance(s_url, str) or not is_valid_https_url(s_url):
                errors.append(f"Verified calibration requires a valid HTTPS sourceUrl, found: {s_url}")
            if not isinstance(cal.get("method"), str) or not cal.get("method", "").strip():
                errors.append("Verified calibration requires a non-empty method description")

    return errors

def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def verify_package(manifest_path: str, public_root: str) -> tuple[bool, dict]:
    results = {
        "success": False,
        "manifestPath": manifest_path,
        "publicRoot": public_root,
        "errors": [],
        "warnings": [],
        "manifest": None,
        "manifestBytes": None,
        "manifestSha256": None,
        "imagePath": None,
        "imageBytes": None,
        "imageSha256": None,
        "decodedDimensions": None,
        "decoder": None,
        "totalRequiredBytes": None,
    }

    # 1. Read manifest file
    if not os.path.isfile(manifest_path):
        results["errors"].append(f"Manifest file not found: {manifest_path}")
        return False, results

    try:
        with open(manifest_path, "rb") as f:
            manifest_content = f.read()
        results["manifestBytes"] = len(manifest_content)
        results["manifestSha256"] = hashlib.sha256(manifest_content).hexdigest()
        manifest_data = json.loads(manifest_content.decode("utf-8"))
        results["manifest"] = manifest_data
    except json.JSONDecodeError as e:
        results["errors"].append(f"Failed to parse manifest JSON: {e}")
        return False, results
    except Exception as e:
        results["errors"].append(f"Failed to read manifest: {e}")
        return False, results

    # 2. Validate manifest schema
    schema_errors = validate_manifest_schema(manifest_data)
    if schema_errors:
        results["errors"].extend(schema_errors)
        return False, results

    # 3. Resolve local image path
    asset_rel = manifest_data["assetPath"]
    resolved_image_path = os.path.normpath(os.path.join(public_root, asset_rel))
    results["imagePath"] = resolved_image_path

    if not os.path.isfile(resolved_image_path):
        results["errors"].append(f"Referenced image file does not exist: {resolved_image_path}")
        return False, results

    # 4. Check image size & sha256
    try:
        results["imageBytes"] = os.path.getsize(resolved_image_path)
        results["imageSha256"] = sha256_file(resolved_image_path)
        results["totalRequiredBytes"] = results["manifestBytes"] + results["imageBytes"]
    except Exception as e:
        results["errors"].append(f"Failed to compute image size/checksum: {e}")
        return False, results

    # 5. Decode image and compare dimensions (fully decoding with .load())
    try:
        dec_w, dec_h, decoder_name = decode_and_verify_image(resolved_image_path)
        results["decodedDimensions"] = (dec_w, dec_h)
        results["decoder"] = decoder_name
        
        expected_w = manifest_data["width"]
        expected_h = manifest_data["height"]

        if dec_w != expected_w or dec_h != expected_h:
            results["errors"].append(
                f"Dimension mismatch: manifest specifies {expected_w}x{expected_h}, but decoded image is {dec_w}x{dec_h}"
            )
            return False, results
    except Exception as e:
        results["errors"].append(f"Failed to decode image {resolved_image_path}: {e}")
        return False, results

    results["success"] = True
    return True, results

def main():
    parser = argparse.ArgumentParser(description="Verify MARSWALK offline image data package.")
    parser.add_argument("--manifest", default="public/data/manifest.json", help="Path to manifest.json")
    parser.add_argument("--public-root", default="public", help="Path to public directory root")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    args = parser.parse_args()

    success, res = verify_package(args.manifest, args.public_root)

    if args.json:
        print(json.dumps(res, indent=2))
        sys.exit(0 if success else 1)
    else:
        print("=" * 70)
        print("MARSWALK Offline Image Package Verification")
        print("=" * 70)
        print(f"Manifest path:      {res['manifestPath']}")
        if res['manifestBytes'] is not None:
            print(f"Manifest size:      {res['manifestBytes']:,} bytes")
            print(f"Manifest SHA-256:   {res['manifestSha256']}")
        if res.get('manifest'):
            m = res['manifest']
            print(f"Schema version:     {m.get('schemaVersion')}")
            print(f"imageRef:           {m.get('imageRef')}")
            print(f"Coverage status:    {m.get('coverageStatus')}")
            print(f"Coordinate system:  {m.get('coordinateSystem')}")
            print(f"Manifest dimensions:{m.get('width')} x {m.get('height')} px")
            print(f"Calibration:        verified={m.get('calibration', {}).get('verified')}")

        print("-" * 70)
        print(f"Image asset path:   {res.get('imagePath')}")
        if res.get('imageBytes') is not None:
            print(f"Image size:         {res['imageBytes']:,} bytes")
            print(f"Image SHA-256:      {res['imageSha256']}")
        if res.get('decodedDimensions'):
            w, h = res['decodedDimensions']
            print(f"Decoded dimensions: {w} x {h} px")
            print(f"Decoder used:       {res.get('decoder')}")

        if res.get('totalRequiredBytes') is not None:
            print("-" * 70)
            print(f"Total required pack:{res['totalRequiredBytes']:,} bytes ({res['totalRequiredBytes'] / (1024*1024):.2f} MB)")

        print("=" * 70)
        if success:
            print("RESULT: SUCCESS - All package files exist, decode cleanly, and match manifest specifications.")
            print("=" * 70)
            sys.exit(0)
        else:
            print("RESULT: FAILED - Package validation errors encountered:")
            for err in res["errors"]:
                print(f"  [ERROR] {err}")
            print("=" * 70)
            sys.exit(1)

if __name__ == "__main__":
    main()
