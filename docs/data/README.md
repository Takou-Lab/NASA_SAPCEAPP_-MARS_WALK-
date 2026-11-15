# MARSWALK — Data Preparation Documentation

<!-- CURRENT_WORK_PLAN -->
> **Data/reference record.** Preserve source facts, hashes and coordinate limits. Current work is [W2](../../TEAM_TASKS.md#w2); app-wide PWA lifecycle belongs to [W6](../../TEAM_TASKS.md#w6), not this image inventory.
<!-- /CURRENT_WORK_PLAN -->

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

## 2. Product Metadata Checklist & Qualified Claims

| Checklist Field | Primary Delivered Asset Details & Qualified Claims |
| :--- | :--- |
| **Product Identity** | **HiRISE Views Mount Sharp's Boxwork** (NASA Planetary Photojournal ID: `PIA26306` / HiRISE Observation ID: `PSP_001752_1750`) |
| **Provider** | NASA Jet Propulsion Laboratory (JPL) / University of Arizona HiRISE Operations Center |
| **Source URLs** | Primary Catalog: `https://photojournal.jpl.nasa.gov/catalog/PIA26306`<br>Direct Master Image: `https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia26/pia26306/PIA26306.jpg`<br>PDS Archive: `https://www.uahirise.org/PSP_001752_1750` |
| **Credit** | `NASA/JPL-Caltech/University of Arizona` |
| **Coverage & AOI Evidence** | **Qualified `regional-context`:** The image depicts the boxwork formations located in the lower foothills of Mount Sharp, Gale Crater (center coordinates of the source HiRISE observation `PSP_001752_1750`: Latitude -4.843° [4.843°S], Longitude 137.298°E). While Curiosity explored boxwork structures in this general region in 2024–2025, **no rover drive path or traverse telemetry is geodetically registered to pixel coordinates on this cropped visual derivative**. Therefore, coverage remains strictly regional visual context; claiming an exact verified AOI boundary or geodetic ground-control overlap is scientifically unsupported. |
| **Coordinates & CRS** | **Qualified `image-pixels-bottom-left`:** The source orbital observation was originally map-projected in Equirectangular projection, but this visual derivative is a cropped and resampled presentation product lacking embedded geodetic tags, GCPs, or a world file. It must be treated strictly as unprojected pixel space (`0 <= x <= 2048`, `0 <= y <= 1042`). Do not interpret pixel `(x, y)` as geographic coordinates or assume true north-up alignment without independent ground registration. Leaflet boundary conversion is `[y, x]`. |
| **Resolution & Scale** | **Qualified unverified:** The nominal 25 cm/pixel scale of the uncropped PDS map-projected master does **not** apply to this resampled 2048 × 1042 px derivative. Derivative pixel scale is uncalibrated. Master release dimensions: 7488 × 3813 px. Prepared web derivative: 2048 × 1042 px. |
| **Timing** | Acquisition Date: `2006-12-10` (Local Mars Time: 15:41). Retrieval Date: `2026-11-14`. |
| **Processing** | Original format: JPEG (2.65 MB, 7488 × 3813 px). Output format: JPEG (511 KB, 2048 × 1042 px, aspect-ratio preserving bicubic resampling via `tools/data/process_image.py`). |
| **Validity & Calibration** | Verification status: `calibration.verified = false`. `metersPerPixel = null`. `sourceUrl = null`. `method = null`. NoData: None in active visual frame. Intended use: 2D interactive waypoint planning and 3D flat context surface. Metric planar distances, elevations, and terrain slopes remain completely disabled. |

---

## 3. Delivered Local Assets

1. **Active Delivered Derivative (`public/data/imagery/PIA26306_derived_2048.jpg`):**
   - **Dimensions:** 2048 × 1042 pixels (width × height)
   - **Byte Size:** 523,272 bytes (~511 KB)
   - **SHA-256:** `7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8`
   - **imageRef:** `hirise-mro-pia26306-boxwork-2048x1042-v1`
   - **Runtime Path:** `data/imagery/PIA26306_derived_2048.jpg`

2. **Master High-Resolution Asset (`public/data/imagery/PIA26306.jpg`):**
   - **Dimensions:** 7488 × 3813 pixels (width × height)
   - **Byte Size:** 2,658,965 bytes (~2.53 MB)
   - **SHA-256:** `c3a93d30db3daff7c964c1960d40493c72eb700b4e38d2ccfaabce255f617f5a`
   - **Status:** Archival master retained for provenance and reproducibility; excluded from runtime caching.

3. **Active Manifest (`public/data/manifest.json`):**
   - Strictly conforms to `ImageManifest` interface in `docs/team/CODING_AGENTS.md`.
   - Byte Size: 1,200 bytes
   - SHA-256: `40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82`

---

## 4. Handoff Specifications for Willy (Angular Map — `src/app/map/`)

These specifications apply strictly while the committed image and manifest remain the inspected version:

- **Manifest Path:** `data/manifest.json` (relative to application base)
- **Active imageRef:** `hirise-mro-pia26306-boxwork-2048x1042-v1`
- **Asset Path:** `data/imagery/PIA26306_derived_2048.jpg`
- **Raster Dimensions:** Width `2048`, Height `1042`
- **Leaflet Coordinate System:** `L.CRS.Simple`
- **Leaflet Image Overlay Bounds:** `[[0, 0], [1042, 2048]]` (in `[y, x]` / `[lat, lng]` order)
- **Bottom-Left Pixel Convention:**
  - Origin `(0, 0)` is at the bottom-left corner of the raster image.
  - Coordinate range: `0 <= x <= 2048`, `0 <= y <= 1042`.
  - In Leaflet click listener:
    ```ts
    const point: Point = { x: Math.round(e.latlng.lng), y: Math.round(e.latlng.lat) };
    missionService.applyMapPoint(point);
    ```
- **Error & Dimension Validation Expectations:**
  - Load the image asset via `new URL(manifest.assetPath, document.baseURI).href`.
  - Compare the image element's decoded natural dimensions (`img.naturalWidth`, `img.naturalHeight`) with `manifest.width` (2048) and `manifest.height` (1042).
  - MapComponent owns its image-display error state (`imageDisplayState === 'error'`); core `dataStatus` reports metadata/data readiness and may remain `ready` when valid metadata exists. If the image fails to load or dimensions diverge from the manifest, display an explicit image-display error in MapComponent; do not alter or force a rendering failure into the core `dataStatus`, and do not silently rescale or invent coordinate bounds.
- **Calibration & Terrain Status:**
  - Calibration is unverified (`calibration.verified === false`). Do not derive metric distances.
  - Terrain is unavailable (`terrainStatus === 'unavailable'`). Do not compute elevation or slope.

---

## 5. Handoff Specifications for Longla (3D Rehearsal — `src/app/viewer3d/`)

- **Active imageRef:** `hirise-mro-pia26306-boxwork-2048x1042-v1`
- **Texture Asset Path:** `data/imagery/PIA26306_derived_2048.jpg`
- **Terrain Status:** `unavailable` (Visual Review fallback active). No measured DEM model is integrated in v1.
- **Surface Mesh:** Flat plane: `PlaneGeometry(2048, 1042)`.
- **Coordinate Transform from 2D Map to 3D Scene:**
  - `scene.position.x = mapPoint.x - (2048 / 2)`
  - `scene.position.y`: a display-only lift to prevent overlap, not elevation. The corrected viewer uses `DISPLAY_Y_OFFSET = 1` for lines/rings and additional geometry offsets for node/marker centers
  - `scene.position.z = (1042 / 2) - mapPoint.y`
- **Labeling:** Mark view clearly as **Prototype: 3D training view — No verified terrain; elevation unavailable**.

---

## 6. Offline Data Package & Tooling

1. **Inventory Document:**
   See [OFFLINE_DATA_PACK.md](OFFLINE_DATA_PACK.md) for full byte counts, SHA-256 hashes, and runtime vs. archival distinctions.
2. **Release Data & Cache Handoff:**
   See [RELEASE_DATA_HANDOFF.md](RELEASE_DATA_HANDOFF.md) for the complete runtime data inventory, production build copy comparison, and cache include/exclude guidance for the coordinator and offline verifier.
3. **Environmental Source Audit & Schema Proposal:**
   See [ENVIRONMENT_SOURCE_AUDIT.md](ENVIRONMENT_SOURCE_AUDIT.md) for the raw-source audit of Curiosity REMS and RAD observation samples, reviewable source rows, radiation feasibility evaluation, and version 1 schema proposal.
4. **Offline Package Verifier:**
   A dedicated read-only verification script is available under `tools/data/verify_pack.py`.
   Pillow is required for strict byte-level `.load()` pixel decoding:
   ```bash
   python -m pip install -r tools/data/requirements.txt
   python tools/data/verify_pack.py --manifest public/data/manifest.json --public-root public
   ```
