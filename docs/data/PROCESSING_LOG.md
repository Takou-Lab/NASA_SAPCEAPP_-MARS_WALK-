# MARSWALK — Data Processing & Reproducibility Log

<!-- CURRENT_WORK_PLAN -->
> **Data/reference record.** Preserve source facts, hashes and coordinate limits. Current work is [W2](../../TEAM_TASKS.md#w2); app-wide PWA lifecycle belongs to [W6](../../TEAM_TASKS.md#w6), not this image inventory.
<!-- /CURRENT_WORK_PLAN -->

This document records the exact command-line steps executed to download, inspect, verify, and process the imagery and metadata delivered for MARSWALK.

## Environment

- **OS:** Windows 11 (64-bit)
- **Runtime:** Python 3.14.7 (standard library + Windows GDI+)
- **Workspace:** `c:\Users\WIN11\Desktop\NASA SPACE APPS`

---

## Step 1: Tool Installation & Dependency Declaration

Standalone command-line Python scripts placed in `tools/data/`:
- `tools/data/fetch_data.py`: Downloads assets over HTTPS with input validation.
- `tools/data/inspect_raster.py`: Inspects raster binary headers (dimensions, format, byte size, SHA-256).
- `tools/data/process_image.py`: Resamples raster images with aspect-ratio preservation and high-quality bicubic filtering.
- `tools/data/verify_pack.py`: Read-only offline package verifier that checks manifest compliance, file presence, dimensions, and checksums.

Dependencies:
- Python 3 standard library (`os`, `sys`, `urllib`, `argparse`, `hashlib`, `struct`, `ctypes`).
- Optional non-Windows dependency: Pillow (`PIL`).
- A `tools/data/requirements.txt` file is provided for the coordinator to integrate if non-Windows build pipelines require Pillow.

---

## Step 2: Download Master Orbital Imagery

Command executed:
```bash
python tools/data/fetch_data.py \
  --url https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia26/pia26306/PIA26306.jpg \
  --output public/data/imagery/PIA26306.jpg
```

Result:
- **Output:** `public/data/imagery/PIA26306.jpg`
- **File size:** 2,658,965 bytes (~2.53 MB)
- **Status:** HTTP 200 OK, full byte payload verified.

---

## Step 3: Inspect Raw Master Imagery

Command executed:
```bash
python tools/data/inspect_raster.py --input public/data/imagery/PIA26306.jpg
```

Output:
```text
File:       public\data\imagery\PIA26306.jpg
Format:     JPEG
Dimensions: 7488 x 3813 px (width x height)
Size:       2,658,965 bytes
SHA-256:    c3a93d30db3daff7c964c1960d40493c72eb700b4e38d2ccfaabce255f617f5a
```

---

## Step 4: Generate Web-Optimized Derivative

Command executed:
```bash
python tools/data/process_image.py \
  --input public/data/imagery/PIA26306.jpg \
  --output public/data/imagery/PIA26306_derived_2048.jpg \
  --max-width 2048 \
  --max-height 2048
```

Output:
```text
Image processing complete:
  Input:       public/data/imagery/PIA26306.jpg (7488 x 3813)
  Output:      public/data/imagery/PIA26306_derived_2048.jpg (2048 x 1042)
  Resampling:  HighQualityBicubic (GDI+)
  Output size: 523,272 bytes
  SHA-256:     7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8
```

Resampling details:
- **Filter:** HighQualityBicubic (GDI+ InterpolationMode 7, SmoothingMode 2).
- **Aspect ratio preserved:** Input ratio = 1.9638; output ratio = 1.9654 (integer pixel rounding).
- **NoData handling:** The image is continuous optical imagery with 0 NoData pixels within the framing.

> [!CAUTION]
> **Derivative Preservation:**
> The committed derivative file (`PIA26306_derived_2048.jpg`) must be kept unchanged. Different image libraries (such as Pillow vs. GDI+) produce differing JPEG compression bitstreams from identical inputs. Any regenerated file with altered bytes or coordinates would invalidate `imageRef` (`hirise-mro-pia26306-boxwork-2048x1042-v1`) and require a coordinated data migration across the team.

---

## Step 5: Verification of Derivative Dimensions & Readability

Command executed:
```bash
python tools/data/inspect_raster.py --input public/data/imagery/PIA26306_derived_2048.jpg
```

Output:
```text
File:       public\data\imagery\PIA26306_derived_2048.jpg
Format:     JPEG
Dimensions: 2048 x 1042 px (width x height)
Size:       523,272 bytes
SHA-256:    7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8
```

Integrity check with .NET image reader:
```powershell
Add-Type -AssemblyName System.Drawing
[System.Drawing.Image]::FromFile('public\data\imagery\PIA26306_derived_2048.jpg').Size
# Result: Width=2048, Height=1042
```

---

## Step 6: Manifest Validation

Command executed:
```bash
python -c "import json; m = json.load(open('public/data/manifest.json')); assert m['width'] == 2048 and m['height'] == 1042 and m['schemaVersion'] == 1; print('Manifest strictly verified')"
```

Output:
```text
Manifest strictly verified
```

---

## Step 7: Offline Package Verification

Prerequisite:
```bash
python -m pip install -r tools/data/requirements.txt
```

Command executed:
```bash
python tools/data/verify_pack.py --manifest public/data/manifest.json --public-root public
```

Output:
```text
======================================================================
MARSWALK Offline Image Package Verification
======================================================================
Manifest path:      public/data/manifest.json
Manifest size:      1,200 bytes
Manifest SHA-256:   40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82
Schema version:     1
imageRef:           hirise-mro-pia26306-boxwork-2048x1042-v1
Coverage status:    regional-context
Coordinate system:  image-pixels-bottom-left
Manifest dimensions:2048 x 1042 px
Calibration:        verified=False
----------------------------------------------------------------------
Image asset path:   public\data\imagery\PIA26306_derived_2048.jpg
Image size:         523,272 bytes
Image SHA-256:      7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8
Decoded dimensions: 2048 x 1042 px
Decoder used:       JPEG (standard library SOF decoder)
----------------------------------------------------------------------
Total required pack:524,472 bytes (0.50 MB)
======================================================================
RESULT: SUCCESS - All package files exist, decode cleanly, and match manifest specifications.
======================================================================
```
Exit code: `0`.
