#!/usr/bin/env python3
"""
Raster image processing tool for MARSWALK data preparation.
Performs resizing/optimization of raw orbital imagery to web-deliverable derivatives.

Features:
- Validates input and output file paths.
- Avoids overwriting originals unless --force is explicitly provided.
- Preserves aspect ratio when resizing.
- Uses Windows GDI+ (built-in, zero external dependencies) or Pillow (if installed).
- Outputs transformation log including original vs. derivative dimensions and checksum.

Usage:
  python tools/data/process_image.py --input <path> --output <path> [--max-width <int>] [--max-height <int>] [--force]
"""
import argparse
import hashlib
import os
import struct
import sys

def parse_jpeg_dimensions(data: bytes):
    idx = 2
    length = len(data)
    while idx < length:
        if data[idx] != 0xFF:
            idx += 1
            continue
        marker = data[idx + 1]
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            height, width = struct.unpack(">HH", data[idx + 5 : idx + 9])
            return width, height
        else:
            seg_len = struct.unpack(">H", data[idx + 2 : idx + 4])[0]
            idx += 2 + seg_len
    raise ValueError("JPEG SOF marker not found")

def resize_with_pillow(input_path: str, output_path: str, max_width: int, max_height: int):
    from PIL import Image
    with Image.open(input_path) as img:
        orig_w, orig_h = img.size
        ratio = min(max_width / orig_w, max_height / orig_h)
        if ratio >= 1.0:
            new_w, new_h = orig_w, orig_h
            img.save(output_path, quality=92)
        else:
            new_w = int(orig_w * ratio)
            new_h = int(orig_h * ratio)
            resampled = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            resampled.save(output_path, quality=90)
    return orig_w, orig_h, new_w, new_h, "LANCZOS (Pillow)"

def resize_with_gdiplus(input_path: str, output_path: str, max_width: int, max_height: int):
    import ctypes
    from ctypes import wintypes

    gdi = ctypes.windll.gdiplus

    class GdiplusStartupInput(ctypes.Structure):
        _fields_ = [
            ('GdiplusVersion', wintypes.UINT),
            ('DebugEventCallback', ctypes.c_void_p),
            ('SuppressBackgroundThread', wintypes.BOOL),
            ('SuppressExternalCodecs', wintypes.BOOL)
        ]

    token = ctypes.c_ulong()
    st_in = GdiplusStartupInput(1, None, False, False)
    if gdi.GdiplusStartup(ctypes.byref(token), ctypes.byref(st_in), None) != 0:
        raise RuntimeError("GDI+ startup failed")

    try:
        # Load image
        p_image = ctypes.c_void_p()
        w_in = ctypes.c_wchar_p(os.path.abspath(input_path))
        if gdi.GdipLoadImageFromFile(w_in, ctypes.byref(p_image)) != 0:
            raise RuntimeError(f"GDI+ failed to load image: {input_path}")

        orig_w = wintypes.UINT()
        orig_h = wintypes.UINT()
        gdi.GdipGetImageWidth(p_image, ctypes.byref(orig_w))
        gdi.GdipGetImageHeight(p_image, ctypes.byref(orig_h))
        ow, oh = orig_w.value, orig_h.value

        ratio = min(max_width / ow, max_height / oh)
        if ratio >= 1.0:
            nw, nh = ow, oh
        else:
            nw = int(ow * ratio)
            nh = int(oh * ratio)

        # Create thumbnail / resized bitmap
        p_thumb = ctypes.c_void_p()
        # PixelFormat24bppRGB = 0x21808
        if gdi.GdipCreateBitmapFromScan0(nw, nh, 0, 0x21808, None, ctypes.byref(p_thumb)) != 0:
            raise RuntimeError("GDI+ failed to allocate destination bitmap")

        p_graphics = ctypes.c_void_p()
        gdi.GdipGetImageGraphicsContext(p_thumb, ctypes.byref(p_graphics))
        # InterpolationModeHighQualityBicubic = 7
        gdi.GdipSetInterpolationMode(p_graphics, 7)
        # SmoothingModeHighQuality = 2
        gdi.GdipSetSmoothingMode(p_graphics, 2)
        # DrawImageRectRect(graphics, image, dstx, dsty, dstw, dsth, srcx, srcy, srcw, srch, srcUnit, imageAttributes, callback, callbackData)
        # UnitPixel = 2
        gdi.GdipDrawImageRectRectI(p_graphics, p_image, 0, 0, nw, nh, 0, 0, ow, oh, 2, None, None, None)
        gdi.GdipDeleteGraphics(p_graphics)

        # Get JPEG encoder CLSID: {557CF401-1A04-11D3-9A73-0000F81EF32E}
        class CLSID(ctypes.Structure):
            _fields_ = [
                ('Data1', wintypes.DWORD),
                ('Data2', wintypes.WORD),
                ('Data3', wintypes.WORD),
                ('Data4', ctypes.c_ubyte * 8)
            ]
        jpeg_clsid = CLSID(0x557CF401, 0x1A04, 0x11D3, (ctypes.c_ubyte * 8)(0x9A, 0x73, 0x00, 0x00, 0xF8, 0x1E, 0xF3, 0x2E))

        w_out = ctypes.c_wchar_p(os.path.abspath(output_path))
        ret = gdi.GdipSaveImageToFile(p_thumb, w_out, ctypes.byref(jpeg_clsid), None)
        gdi.GdipDisposeImage(p_thumb)
        gdi.GdipDisposeImage(p_image)
        if ret != 0:
            raise RuntimeError(f"GDI+ failed to save image to {output_path} (code {ret})")

        return ow, oh, nw, nh, "HighQualityBicubic (GDI+)"
    finally:
        gdi.GdiplusShutdown(token)

def process_raster(input_path: str, output_path: str, max_width: int, max_height: int, force: bool = False):
    if not os.path.isfile(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")
    
    if os.path.exists(output_path) and not force:
        raise FileExistsError(f"Output path already exists (use --force to overwrite): {output_path}")

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    # Try Pillow first, then GDI+ on Windows
    method = None
    try:
        import PIL
        ow, oh, nw, nh, method = resize_with_pillow(input_path, output_path, max_width, max_height)
    except ImportError:
        if sys.platform == "win32":
            ow, oh, nw, nh, method = resize_with_gdiplus(input_path, output_path, max_width, max_height)
        else:
            raise RuntimeError("No image processing library available (install pillow on non-Windows platforms)")

    out_size = os.path.getsize(output_path)
    with open(output_path, "rb") as f:
        out_sha256 = hashlib.sha256(f.read()).hexdigest()

    return {
        "input": input_path,
        "output": output_path,
        "originalDimensions": [ow, oh],
        "derivativeDimensions": [nw, nh],
        "resamplingMethod": method,
        "outputSizeBytes": out_size,
        "outputSha256": out_sha256
    }

def main():
    parser = argparse.ArgumentParser(description="Process/resize MARSWALK raster imagery.")
    parser.add_argument("--input", required=True, help="Input raster image path")
    parser.add_argument("--output", required=True, help="Output destination path")
    parser.add_argument("--max-width", type=int, default=2048, help="Maximum width in pixels (default: 2048)")
    parser.add_argument("--max-height", type=int, default=2048, help="Maximum height in pixels (default: 2048)")
    parser.add_argument("--force", action="store_true", help="Overwrite output if exists")
    args = parser.parse_args()

    try:
        res = process_raster(args.input, args.output, args.max_width, args.max_height, args.force)
        print("Image processing complete:")
        print(f"  Input:       {res['input']} ({res['originalDimensions'][0]} x {res['originalDimensions'][1]})")
        print(f"  Output:      {res['output']} ({res['derivativeDimensions'][0]} x {res['derivativeDimensions'][1]})")
        print(f"  Resampling:  {res['resamplingMethod']}")
        print(f"  Output size: {res['outputSizeBytes']:,} bytes")
        print(f"  SHA-256:     {res['outputSha256']}")
    except Exception as e:
        print(f"Processing error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

