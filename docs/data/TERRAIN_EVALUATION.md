# MARSWALK — Terrain Evaluation & Search Report

<!-- CURRENT_WORK_PLAN -->
> **Data/reference record.** Preserve source facts, hashes and coordinate limits. Current work is [W2](../../TEAM_TASKS.md#w2); app-wide PWA lifecycle belongs to [W6](../../TEAM_TASKS.md#w6), not this image inventory.
<!-- /CURRENT_WORK_PLAN -->

## Executive Summary

- **Task:** Time-boxed search (1 hour) for overlapping digital elevation/terrain models covering the Mount Sharp boxwork formations in Gale Crater.
- **Outcome:** One candidate HiRISE stereo Digital Terrain Model (DTM) was identified in the NASA PDS catalog covering this general area (`DTEEC_001488_1750_001752_1750_U02`).
- **Integration Decision:** Reported as **`unavailable`** in the version 1 application (`terrainStatus: 'unavailable'`), activating the coordinator's visual-review fallback.
- **Rule Adherence:** No fictional height maps were generated; no elevation was inferred from image brightness.

---

## 1. Candidate Terrain Data Sources Evaluated

### Source 1: NASA/JPL Mars Trek Elevation Service
- **Access URL:** `https://trek.nasa.gov/mars/`
- **Layers Checked:** MOLA (Mars Orbiter Laser Altimeter) global DEM, HRSC-MOLA blended DEM.
- **Evaluation:**
  - Regional/global elevation datasets have coarse resolution (MOLA is ~463 m/pixel; blended HRSC-MOLA is ~200 m/pixel).
  - The boxwork ridges stand only 1 to 2 meters high and span ridges of tens of meters wide. Coarse regional DEMs smooth out the boxwork structures completely, providing no traversability or micro-topography utility for astronaut EVA route planning.
  - Interactive WCS endpoints on Trek require dynamic online tile streaming and geodetic reprojection that are incompatible with the offline v1 standalone architecture.

### Source 2: USGS Astrogeology Planetary GIS
- **Access URL:** `https://astrogeology-usgs.hub.arcgis.com/pages/interactive-maps-mars`
- **Layers Checked:** Gale Crater regional HRSC/CTX mosaics and elevation layers.
- **Evaluation:**
  - Standard GIS downloads are 16-bit or 32-bit regional GeoTIFFs covering large swaths of Gale Crater (>500 MB to 2 GB).
  - Similar to Mars Trek, regional DEMs fail to resolve the meter-scale ridges of the boxwork formation.

### Source 3: HiRISE Stereo Digital Terrain Model (DTM) — Archival Candidate Only
- **Product ID:** `DTEEC_001488_1750_001752_1750_U02`
- **Stereo Pair:**
  - Left Observation: `PSP_001488_1750`
  - Right Observation: `PSP_001752_1750` (Source observation of master imagery PIA26306)
- **Archive Catalog:** [HiRISE DTM PSP_001488_1750](https://www.uahirise.org/dtm/PSP_001488_1750)
- **PDS File:** `DTEEC_001488_1750_001752_1750_U02.IMG` (360 MB)
- **Nominal Resolution:** 1.01 meters/pixel post spacing
- **Vertical Units:** Elevation in meters relative to Mars reference datum (areoid)
- **Center Coordinates:** Latitude -4.83°N, Longitude 137.3°E
- **Projection:** Equirectangular projection
- **Coverage Qualification & Limitations:**
  - **No Co-Registration:** This DTM product has **not been downloaded into the project repository**, nor has its bounding box been mathematically aligned, cropped, or verified to register against the visual crop `PIA26306_derived_2048.jpg`.
  - **Archival Reference Only:** It is documented strictly as an identified external archive candidate for future work. It is **not** delivered as a verified mission asset.

---

## 2. Technical Reasons for v1 Terrain Unavailability

1. **Absence of DEM Contract in Shared Schema:**
   `docs/team/CODING_AGENTS.md` explicitly defines `terrainStatus: 'unavailable'` for the v1 schema. There is currently no shared TypeScript interface or binary parser for height maps, elevation grids, or terrain tiles.
2. **Payload Size vs. Offline Requirements:**
   The full PDS DTM image file is 360 MB uncompressed 32-bit floating-point data. Delivering a 360 MB raw raster directly to a client-side tablet browser without server-side tile streaming or quantized mesh tiling causes severe memory pressure and violates lightweight offline-pack criteria.
3. **Strict No-Fabrication Rule:**
   Per `docs/team/GADDIELLE.md` and `docs/team/LONGLA.md`, synthetic or procedural height maps must never be passed off as scientific mission data. Nor can image grayscale values be interpreted as elevation (since brightness reflects surface albedo, sun angle, and dust rather than true height).

---

## 3. Proposal for Version 2 DEM Contract

When the coordinator and team initiate the v2 terrain upgrade, the following contract and workflow are recommended:

1. **Preprocessing Pipeline (in `tools/data/`):**
   - Clip `DTEEC_001488_1750_001752_1750_U02.IMG` to the exact 2048x1042 bounding box of the active imagery derivative.
   - Encode elevation as a 16-bit grayscale PNG or Float32 raw array:
     ```
     elevation_meters = (pixel_value * scale_factor) + offset
     ```
   - Record NoData values (PDS default is typically `-32768.0` or `0xFFFFFFFF`) as explicit missing data rather than zero elevation.
2. **Proposed TypeScript Schema for v2 Manifest:**
   ```ts
   export interface TerrainManifest {
     schemaVersion: 2;
     terrainRef: string;
     assetPath: string; // e.g. "data/terrain/PIA26306_elevation.bin"
     format: 'float32-grid' | 'terrain-rgb-png';
     width: number;
     height: number;
     verticalUnits: 'meters';
     datum: 'Mars-2000-areoid';
     horizontalResolutionMeters: number;
     minElevationMeters: number;
     maxElevationMeters: number;
     noDataValue: number;
   }
   ```
3. **Longla 3D Transform:**
   - With an agreed terrain grid, Longla can construct a `PlaneGeometry(width, height, widthSegments, heightSegments)` and update vertex `position.y` from the elevation array multiplied by a documented vertical exaggeration factor (e.g. 1.0x to 2.0x).
