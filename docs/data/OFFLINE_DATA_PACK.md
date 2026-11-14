# MARSWALK — Offline Image Data Package Inventory

## Purpose & Scope

This document provides a verified inventory of the local image assets and manifest required for the MARSWALK application runtime. 

> [!IMPORTANT]
> **Data Inventory Boundary:**
> This document is strictly an **image-data inventory**, not the complete offline PWA service worker asset pack or an independent claim of full PWA offline readiness. 
> The coordinator owns service-worker registration, offline asset caching strategy (`ngsw-config.json` or custom worker), and full end-to-end PWA lifecycle verification. Science records (`public/data/markers.json`) belong to Emma and are inventoried separately.

---

## 1. Required Runtime Image Assets

These files must be present locally under `public/data/` and deployed to `dist/marswalk/browser/data/` for the client application to load and display imagery offline without network access.

| Logical Role | Repository Path | Runtime App Path | Byte Size | SHA-256 Checksum | Dimensions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mission Manifest** | `public/data/manifest.json` | `data/manifest.json` | 1,200 bytes | `40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82` | — |
| **Active Map Texture** | `public/data/imagery/PIA26306_derived_2048.jpg` | `data/imagery/PIA26306_derived_2048.jpg` | 523,272 bytes (~511 KB) | `7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8` | 2048 × 1042 px |

### Total Required Runtime Image-Pack Size
- **Total Payload:** **524,472 bytes** (~512.2 KB / ~0.50 MB)
- **Caching Characteristic:** Highly optimized for tablet/mobile GPU memory and rapid offline service-worker precaching.

---

## 2. Archival Master Asset (Excluded from Runtime Caching)

The high-resolution uncropped master downloaded from NASA is preserved in the repository for provenance, reproducibility, and potential future multi-resolution tiling, but **should be excluded from client offline runtime caching** to prevent unnecessary memory and bandwidth consumption.

| Logical Role | Repository Path | Byte Size | SHA-256 Checksum | Dimensions | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Archival Master** | `public/data/imagery/PIA26306.jpg` | 2,658,965 bytes (~2.53 MB) | `c3a93d30db3daff7c964c1960d40493c72eb700b4e38d2ccfaabce255f617f5a` | 7488 × 3813 px | Archival only; not required in runtime pack |

---

## 3. Provenance & Source Attribution

- **Product Identity:** *HiRISE Views Mount Sharp's Boxwork*
- **Catalog Identifiers:** NASA Photojournal `PIA26306` / HiRISE Observation `PSP_001752_1750`
- **Provider:** NASA Jet Propulsion Laboratory (JPL) / University of Arizona HiRISE Operations Center
- **Primary Source Catalog:** `https://photojournal.jpl.nasa.gov/catalog/PIA26306`
- **PDS Master Archive:** `https://www.uahirise.org/PSP_001752_1750`
- **Acquisition Date:** `2006-12-10` (Local Mars Time: 15:41)
- **Credit:** `NASA/JPL-Caltech/University of Arizona`

---

## 4. Scientific Boundaries & Limitations

1. **Regional Context Only:**
   The image depicts the boxwork structures in the foothills of Mount Sharp, Gale Crater, but is an excerpted public visual release. It does not contain embedded geodetic tie-points or rover drive telemetry coordinates. Coverage status is therefore classified as `regional-context`.
2. **Uncalibrated Metric Scale:**
   `calibration.verified` is `false`. Nominal orbital resolutions (e.g. 25 cm/pixel for the full PDS product) do not apply to this resampled 2048x1042 derivative. Pixel distances cannot be converted to ground meters.
3. **No Digital Elevation Model (DEM):**
   `terrainStatus` remains `unavailable`. Visual brightness cannot be interpreted as surface elevation or slope.
4. **Offline Scope:**
   External hyperlinks (such as `source.url`) are bibliographic citations only and are not expected to resolve when offline.

---

## 5. Offline Verification Tool

The runtime image package can be verified independently without network access using the dedicated validation script:

### Prerequisite
Pillow is strictly required by the verification tool to perform full pixel buffer `.load()` decoding and reject truncated or corrupted files:
```bash
python -m pip install -r tools/data/requirements.txt
```

### Execution
```bash
python tools/data/verify_pack.py --manifest public/data/manifest.json --public-root public
```

Expected output:
- Confirms manifest schema compliance with `ImageManifest` (`CODING_AGENTS.md`).
- Fully decodes the raster via Pillow (`img.load()`), verifying pixel integrity and dimensions (2048 × 1042 px).
- Verifies manifest SHA-256 (`40381b96...`) and image SHA-256 (`7b814497...`).
- Exits code `0` on success, `1` on failure (in both text and `--json` modes).
