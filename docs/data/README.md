# MARSWALK — Data Preparation Documentation

## 1. Overview & Ownership

- **Role:** Gaddielle (Data Preparation Agent)
- **Assigned Area of Interest:** Aeolis Mons (Mount Sharp) boxwork formations, Gale Crater, Mars
- **Owned Paths:**
  - `public/data/imagery/`
  - `public/data/terrain/`
  - `public/data/manifest.json`
  - `docs/data/`
  - `tools/data/`
- **Map & 3D Boundaries:** Willy owns map code (`src/app/map/`). Longla owns 3D viewer code (`src/app/viewer3d/`). Gaddielle provides validated data, metadata, and coordinates without modifying Angular components.

---

## 2. Product Metadata Checklist

| Checklist Field | Primary Delivered Asset Details |
| :--- | :--- |
| **Product Identity** | **HiRISE Views Mount Sharp's Boxwork** (NASA Planetary Photojournal ID: `PIA26306` / HiRISE Observation ID: `PSP_001752_1750`) |
| **Provider** | NASA Jet Propulsion Laboratory (JPL) / University of Arizona HiRISE Operations Center |
| **Source URLs** | Primary Catalog: `https://photojournal.jpl.nasa.gov/catalog/PIA26306`<br>Direct Master Image: `https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia26/pia26306/PIA26306.jpg`<br>PDS Archive: `https://www.uahirise.org/PSP_001752_1750` |
| **Credit** | `NASA/JPL-Caltech/University of Arizona` |
| **Coverage & AOI Evidence** | Mount Sharp lower foothill boxwork formations in Gale Crater. Center coordinates of source observation `PSP_001752_1750`: Latitude -4.843°N, Longitude 137.298°E. Curiosity traversed and investigated these exact boxwork ridge structures in 2024–2025. Coverage is classified as `regional-context` because this visual release is a cropped presentation product rather than a geocoded ortho-mosaic. |
| **Coordinates & CRS** | App Coordinate System: `image-pixels-bottom-left`. Bounds: `0 <= x <= 2048`, `0 <= y <= 1042`. Source MRO Map Projection: Equirectangular (clon=137.3°E, clat=-4.83°N), North-up in orbital projection. Leaflet boundary conversion: `[y, x]`. |
| **Resolution** | Original HiRISE map-projected scale: 25 cm/pixel (unprojected: 28 cm/pixel at 265.2 km altitude). Master release dimensions: 7488 x 3813 px. Prepared web derivative: 2048 x 1042 px. Derivative scale: unverified / uncalibrated. |
| **Timing** | Acquisition Date: `2006-12-10` (Local Mars Time: 15:41). Retrieval Date: `2026-11-14`. |
| **Processing** | Original format: JPEG (2.65 MB, 7488 x 3813 px). Output format: JPEG (511 KB, 2048 x 1042 px, bicubic resampling via `tools/data/process_image.py`). |
| **Validity & Calibration** | Verification status: `calibration.verified = false`. `metersPerPixel = null`. `sourceUrl = null`. `method = null`. NoData: None in active visual frame. Intended use: 2D interactive waypoint planning and 3D flat context surface. Metric planar distances and terrain slopes remain disabled. |

---

## 3. Delivered Local Assets

1. **Active Delivered Derivative (`public/data/imagery/PIA26306_derived_2048.jpg`):**
   - **Dimensions:** 2048 x 1042 pixels (width x height)
   - **Byte Size:** 523,272 bytes (~511 KB)
   - **SHA-256:** `7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8`
   - **imageRef:** `hirise-mro-pia26306-boxwork-2048x1042-v1`
   - **Local Asset Path:** `data/imagery/PIA26306_derived_2048.jpg`

2. **Master High-Resolution Asset (`public/data/imagery/PIA26306.jpg`):**
   - **Dimensions:** 7488 x 3813 pixels (width x height)
   - **Byte Size:** 2,658,965 bytes (~2.53 MB)
   - **SHA-256:** `c3a93d30db3daff7c964c1960d40493c72eb700b4e38d2ccfaabce255f617f5a`

3. **Active Manifest (`public/data/manifest.json`):**
   - Strictly conforms to `ImageManifest` interface in `docs/team/CODING_AGENTS.md`.

---

## 4. Handoff Specifications for Teammates

### Handoff to Willy (Angular Map Developer — `src/app/map/`)
- **Active imageRef:** `hirise-mro-pia26306-boxwork-2048x1042-v1`
- **Local Asset Path:** `data/imagery/PIA26306_derived_2048.jpg`
- **Raster Width:** `2048`
- **Raster Height:** `1042`
- **Leaflet CRS:** `CRS.Simple`
- **Leaflet Image Overlay Bounds:** `[[0, 0], [1042, 2048]]` (in `[y, x]` / `[lat, lng]` order)
- **App Coordinates:** `0 <= x <= 2048`, `0 <= y <= 1042` with origin at bottom-left
- **Click Emission Conversion:**
  ```ts
  // Inside Leaflet click listener:
  const point: Point = { x: Math.round(e.latlng.lng), y: Math.round(e.latlng.lat) };
  missionService.applyMapPoint(point);
  ```
- **Scale / Distance status:** Calibration is `verified: false`. Do not derive meters from pixels.

### Handoff to Longla (3D Rehearsal Developer — `src/app/viewer3d/`)
- **Active imageRef:** `hirise-mro-pia26306-boxwork-2048x1042-v1`
- **Texture Asset Path:** `data/imagery/PIA26306_derived_2048.jpg`
- **Terrain Status:** `unavailable` (Visual Review fallback active). No measured DEM model is integrated in v1.
- **Surface Mesh:** Flat plane with geometry `PlaneGeometry(2048, 1042)`
- **Coordinate Transform from 2D Map to 3D Scene:**
  - `scene.position.x = mapPoint.x - (2048 / 2)`
  - `scene.position.y = 0.5` (slight display lift above texture plane to prevent z-fighting; not elevation)
  - `scene.position.z = (1042 / 2) - mapPoint.y`
- **Labeling:** Mark view clearly as **Prototype: 3D training view — No verified terrain; elevation unavailable**.

### Handoff to Emma (Science & Provenance)
- Active raster shows the boxwork formations (ancient mineralized fracture fills in bedrock exposed by wind erosion) on the lower slopes of Mount Sharp studied by Curiosity.
- The observation date of the orbital base image is `2006-12-10` (`PSP_001752_1750`).
- Surface rover observations (e.g. at Nevado Sajama or drilling targets) can use illustrative marker positions using the active image bounds (`[0..2048, 0..1042]`) with `positionStatus: 'illustrative'`.

---

## 5. Tooling Reproducibility

Small, independent Python CLI tools are provided under `tools/data/` (requiring only Python 3 standard library; optional Pillow):

1. **`tools/data/fetch_data.py`:**
   ```bash
   python tools/data/fetch_data.py --url <HTTPS_URL> --output <OUTPUT_PATH>
   ```
2. **`tools/data/inspect_raster.py`:**
   ```bash
   python tools/data/inspect_raster.py --input <IMAGE_PATH>
   ```
3. **`tools/data/process_image.py`:**
   ```bash
   python tools/data/process_image.py --input <INPUT_PATH> --output <OUTPUT_PATH> --max-width 2048 --max-height 2048
   ```

