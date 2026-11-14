# MARSWALK — Image Data Passport

## Purpose & Scope

This Data Passport provides an authoritative, human-readable and machine-traceable provenance record for the primary raster imagery delivered to the MARSWALK Angular PWA. It is designed to support:

1. **Enzo's Data Passport Component (`src/app/ui/`):** Readable field-to-label mapping and display values for the UI.
2. **Exploration Confidence Panel:** Honest scientific boundaries distinguishing verified orbital evidence from unverified scales and missing terrain.
3. **Scientific Auditability:** Explicit attribution, acquisition timing, processing history, and SHA-256 cryptographic verification.

> [!IMPORTANT]
> **Data Scope & PWA Boundary:**
> This passport covers the **image raster assets and manifest** prepared by Gaddielle (`hirise-mro-pia26306-boxwork-2048x1042-v1`).
> - Science marker records (`public/data/markers.json`) belong to Emma and have independent scientific citations.
> - Angular Leaflet rendering and viewport controls belong to Willy (`src/app/map/`).
> - Offline PWA precaching, service worker lifecycle, and device installation belong to the coordinator. Package validation confirms local file integrity; it does not prove browser installation or full offline mission readiness.

---

## 1. Product Identity & Primary Provenance

| Passport Field | Verified Value | Source / Evidence |
| :--- | :--- | :--- |
| **Product Title** | HiRISE Views Mount Sharp's Boxwork | NASA Planetary Photojournal |
| **NASA Catalog ID** | `PIA26306` | NASA JPL Photojournal Catalog |
| **Observation ID** | `PSP_001752_1750` | University of Arizona HiRISE Operations Center |
| **Mission & Spacecraft** | Mars Reconnaissance Orbiter (MRO) | NASA Jet Propulsion Laboratory |
| **Instrument** | High Resolution Imaging Science Experiment (HiRISE) | Lunar and Planetary Laboratory, University of Arizona |
| **Provider** | NASA Jet Propulsion Laboratory (JPL) / University of Arizona HiRISE Operations Center | Primary publisher |
| **Primary Catalog URL** | `https://photojournal.jpl.nasa.gov/catalog/PIA26306` | Official public catalog entry |
| **PDS Master Archive URL** | `https://www.uahirise.org/PSP_001752_1750` | Planetary Data System archival repository |
| **Attribution / Credit** | `NASA/JPL-Caltech/University of Arizona` | Official mandatory attribution string |
| **Observation Date** | `2006-12-10` | Confirmed from orbital metadata (15:41 Mars Local Time) |
| **Retrieval Date** | `2026-11-14` | Local package ingestion date |

---

## 2. Geographic Coverage & Spatial Resolution

| Feature | Assessment & Status | Scientific Boundary |
| :--- | :--- | :--- |
| **Target Region** | Mount Sharp (Aeolis Mons), Gale Crater, Mars | Lower foothills exhibiting mineralized boxwork ridge networks. |
| **Orbital Center Coordinates** | Latitude: `-4.843°N` (`-4.843°`), Longitude: `137.298°E` | Center footprint of parent observation `PSP_001752_1750`. |
| **Coverage Classification** | `regional-context` | **Verified regional context only.** While NASA's Curiosity rover explored boxwork structures in Gale Crater in 2024–2025, no rover telemetry or traverse coordinates are geodetically tied to pixel coordinates on this cropped visual product. Exact exploration-area boundary overlap is unverified. |
| **Master Image Resolution** | Nominal 25 cm/pixel (orbital PDS product) | 7488 × 3813 px full release image. |
| **Active Derivative Resolution** | **Uncalibrated / Unknown** | Prepared 2048 × 1042 px derivative was resampled for web/tablet runtime performance. Orbital scale cannot be linearly scaled without ground control points. |
| **Metric Distance Calibration** | `verified: false` | `metersPerPixel = null`. Conversion of pixel distances to meters is disabled. |
| **Digital Elevation Model (DEM)** | `terrainStatus: 'unavailable'` | No aligned DEM is bundled in v1. Visual brightness does not indicate surface elevation, relief, or slope. |

---

## 3. Coordinate Contract & Leaflet Boundary

- **Active imageRef:** `hirise-mro-pia26306-boxwork-2048x1042-v1`
- **Asset Path:** `data/imagery/PIA26306_derived_2048.jpg`
- **Internal Coordinate System:** `image-pixels-bottom-left`
- **Dimensions:** Width = `2048` px, Height = `1042` px
- **Coordinate Bounds:** `0 <= x <= 2048`, `0 <= y <= 1042`
  - Origin `(0, 0)` is located at the bottom-left corner of the raster.
  - X increases rightward; Y increases upward.
- **Leaflet Boundary Mapping:**
  - Leaflet `CRS.Simple` uses `[y, x]` (`[lat, lng]`) ordering.
  - Image Overlay Bounds: `[[0, 0], [1042, 2048]]`.
  - Point conversion at map boundary: `{ x, y }` ↔ `[y, x]`.
- **Orientation:**
  - Perspective represents the published regional visual excerpt. True North-up orientation is unverified without projective georeferencing.

---

## 4. Processing Lineage & Asset Verification

```
[NASA Planetary Photojournal PIA26306]
             │
             ▼
[Archival Master: public/data/imagery/PIA26306.jpg]
  - Dimensions: 7488 × 3813 px
  - File Size:  2,658,965 bytes (~2.53 MB)
  - SHA-256:    c3a93d30db3daff7c964c1960d40493c72eb700b4e38d2ccfaabce255f617f5a
  - Role:       Archival master for provenance and tiling reproducibility; excluded from runtime caching
             │
             │ tools/data/process_image.py (bicubic resampling, quality 85, no subsampling)
             ▼
[Active Web Derivative: public/data/imagery/PIA26306_derived_2048.jpg]
  - Dimensions: 2048 × 1042 px
  - File Size:  523,272 bytes (~511 KB)
  - SHA-256:    7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8
  - Role:       Active client map texture precached for offline tablet use
             +
[Mission Manifest: public/data/manifest.json]
  - File Size:  1,200 bytes
  - SHA-256:    40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82
             │
             ▼
[Total Required Runtime Image Pack: 524,472 bytes (~0.50 MB)]
```

### Verification Tool & Regressions
- **Verification Script:** `tools/data/verify_pack.py`
  - Runs offline without network dependencies.
  - Hard-requires Pillow for full pixel buffer decoding (`img.load()`) with `ImageFile.LOAD_TRUNCATED_IMAGES = False`.
  - Rejects truncated, corrupted, or dimensionally divergent rasters with nonzero exit codes (`1`) in both text and `--json` modes.
  - Calculates and reports cryptographic SHA-256 hashes and file byte sizes for comparison with this inventory.
- **Regression Suite:** `tools/data/test_verify_pack.py` (4 unit tests passing: real decode, truncated rejection, missing Pillow handling, missing manifest handling).

---

## 5. UI Label & Field Mapping for Enzo (`src/app/ui/`)

When displaying the Data Passport in the user interface, Enzo should map the active `ImageManifest` fields to human-readable labels as detailed below:

| `ImageManifest` Path / Field | Recommended UI Label | Rendered Value for Current Asset | Display & Formatting Guidance |
| :--- | :--- | :--- | :--- |
| `source.title` | **Dataset Title** | HiRISE Views Mount Sharp's Boxwork (PIA26306 / PSP_001752_1750) | Prominent header or section title. |
| `source.credit` | **Credit & Attribution** | NASA/JPL-Caltech/University of Arizona | Plain text attribution notice. |
| `source.url` | **Catalog Reference** | `https://photojournal.jpl.nasa.gov/catalog/PIA26306` | External link; annotate that external URLs require connectivity and will not open offline. |
| `observationDate` | **Observation Date** | 2006-12-10 | Formatted calendar date. If `null`, display "Unavailable / Unrecorded". |
| `coverageStatus` | **Coverage Scope** | Regional Context | If `regional-context`, display with an informational/caution badge indicating lack of rover ground tie-points. |
| `imageRef` | **Product Version ID** | `hirise-mro-pia26306-boxwork-2048x1042-v1` | Monospace tag; indicates data versioning contract. |
| `width` × `height` | **Raster Dimensions** | 2048 × 1042 pixels | Numeric display with "px" unit. |
| `coordinateSystem` | **Coordinates** | Image Pixels (Bottom-Left Origin) | Technical metadata label; emphasizes unprojected pixel space. |
| `calibration.verified` | **Metric Scale** | Unverified (Pixel Scale Only) | If `false`, display: "Metric scale unavailable; distances cannot be measured in meters." |
| `limitations[]` | **Scientific Limitations** | Bulleted list of documented gaps | Display as an expandable list or callout box inside the Confidence Panel. |
| *(Derived / Documented)* | **Runtime Package Size** | 524,472 bytes (0.50 MB) | Helpful context for device storage and offline caching status. |
| *(Derived / Documented)* | **SHA-256 Checksum** | `7b814497...` (Image)<br>`40381b96...` (Manifest) | Collapsible technical verification details. |

---

## 6. Known Scientific Limitations for Exploration Confidence

The Exploration Confidence Panel must transparently communicate the following constraints to the user:

1. **Uncalibrated Metric Scale:**
   Because `calibration.verified` is `false`, planar distances along drawn routes cannot be calculated. The UI must state: *"Distance unavailable: metric calibration has not been independently verified for this raster."*
2. **Missing Terrain & Elevation:**
   Because `terrainStatus` is `unavailable`, slope analysis, elevation profiles, and 3D terrain relief are unavailable. The UI must state: *"Terrain unavailable: visual brightness does not provide surface elevation or slope."*
3. **No Direct Rover Georeferencing:**
   Curiosity's traverse through the boxwork formation is historical mission context; the visual raster lacks ground tie-points. Sketched routes are exploration rehearsal proposals, not operational rover plans.
4. **Offline Citation Limits:**
   All image data and manifest metadata are bundled locally. External hyperlinks (NASA Photojournal, HiRISE PDS) provide scientific provenance but require external internet access.

---

## 7. Central Schema Recommendations for Coordinator (v2 Contract Proposal)

To support richer Data Passport metadata in future releases without modifying `src/app/core/models.ts` unilaterally, the following optional fields are proposed for central coordinator review:

```typescript
// Proposed extensions for ImageManifest v2 (subject to coordinator approval)
export interface ImageManifestV2 extends ImageManifest {
  readonly targetBody?: 'Mars';
  readonly mission?: string;               // e.g. "Mars Reconnaissance Orbiter"
  readonly instrument?: string;            // e.g. "HiRISE"
  readonly catalogIdentifiers?: {
    readonly photojournalId?: string;      // e.g. "PIA26306"
    readonly observationId?: string;       // e.g. "PSP_001752_1750"
  };
  readonly nominalMasterResolution?: {
    readonly value: number;                // e.g. 0.25
    readonly unit: 'meters/pixel';
    readonly appliesToDerivative: boolean; // false
  };
  readonly footprintCenter?: {
    readonly latitude: number;             // e.g. -4.843
    readonly longitude: number;            // e.g. 137.298
    readonly coordinateSystem: 'planetocentric';
  };
  readonly packageBytes?: {
    readonly manifest: number;             // 1200
    readonly image: number;                // 523272
    readonly total: number;                // 524472
  };
}
```

*Implementation Note:* For release v1, Enzo and other components must strictly adhere to the existing `ImageManifest` interface in `src/app/core/models.ts`. These proposed extensions are documented here for future schema alignment.
