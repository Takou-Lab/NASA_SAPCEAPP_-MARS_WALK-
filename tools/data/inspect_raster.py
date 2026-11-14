#!/usr/bin/env python3
"""
Inspect raster metadata for MARSWALK data preparation.
Parses image dimensions (JPEG/PNG/TIFF), format, byte size, and SHA-256 hash
without requiring heavy external dependencies.
"""
import argparse
import hashlib
import os
import struct
import sys

def get_jpeg_dimensions(data: bytes):
    """Parse JPEG SOF markers to extract height and width."""
    idx = 2
    length = len(data)
    while idx < length:
        if data[idx] != 0xFF:
            idx += 1
            continue
        marker = data[idx + 1]
        # Baseline DCT (0xC0), Extended sequential DCT (0xC1), Progressive DCT (0xC2)
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            height, width = struct.unpack(">HH", data[idx + 5 : idx + 9])
            return width, height
        else:
            seg_len = struct.unpack(">H", data[idx + 2 : idx + 4])[0]
            idx += 2 + seg_len
    raise ValueError("SOF marker not found in JPEG")

def get_png_dimensions(data: bytes):
    """Parse PNG IHDR chunk."""
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError("Not a valid PNG")
    width, height = struct.unpack(">II", data[16:24])
    return width, height

def inspect_image(path: str):
    if not os.path.isfile(path):
        raise FileNotFoundError(f"File not found: {path}")

    size_bytes = os.path.getsize(path)
    with open(path, "rb") as f:
        content = f.read()

    sha256 = hashlib.sha256(content).hexdigest()

    fmt = "unknown"
    width, height = None, None

    if content.startswith(b'\xff\xd8\xff'):
        fmt = "JPEG"
        width, height = get_jpeg_dimensions(content)
    elif content.startswith(b'\x89PNG\r\n\x1a\n'):
        fmt = "PNG"
        width, height = get_png_dimensions(content)
    elif content[:4] in (b'II*\x00', b'MM\x00*'):
        fmt = "TIFF"
        # Basic TIFF parsing if needed
    else:
        fmt = "Unknown binary"

    result = {
        "path": os.path.normpath(path),
        "format": fmt,
        "width": width,
        "height": height,
        "sizeBytes": size_bytes,
        "sha256": sha256
    }
    return result

def main():
    parser = argparse.ArgumentParser(description="Inspect raster image dimensions and integrity.")
    parser.add_argument("--input", required=True, help="Path to raster image file")
    args = parser.parse_args()

    try:
        info = inspect_image(args.input)
        print(f"File:       {info['path']}")
        print(f"Format:     {info['format']}")
        print(f"Dimensions: {info['width']} x {info['height']} px (width x height)")
        print(f"Size:       {info['sizeBytes']:,} bytes")
        print(f"SHA-256:    {info['sha256']}")
    except Exception as e:
        print(f"Error inspecting {args.input}: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

