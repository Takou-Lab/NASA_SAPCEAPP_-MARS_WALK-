# MARSWALK — Terrain Data Status (v1)

## Status: Unavailable (Visual Review Fallback Active)

As specified in `docs/team/CODING_AGENTS.md` (v1 schema: `terrainStatus: 'unavailable'`) and `docs/team/GADDIELLE.md`, no validated DEM contract exists for the version 1 application. Under project safety and scientific integrity rules:
- **No fictional height maps are generated.**
- **Image brightness is never interpreted as elevation.**
- The application activates the **visual review only** fallback mode.

## Sourced Authoritative Terrain Assets Identified

During the data-preparation terrain search, the following real NASA/HiRISE digital terrain model was identified covering this exact area of interest:

- **Product ID:** `DTEEC_001488_1750_001752_1750_U02`
- **Stereo Observation Pair:** `PSP_001488_1750` & `PSP_001752_1750`
- **Provider:** HiRISE Operations Center, Lunar and Planetary Laboratory, University of Arizona / NASA PDS
- **Repository Link:** [HiRISE DTM PSP_001488_1750](https://www.uahirise.org/dtm/PSP_001488_1750)
- **Direct PDS Product:** `DTEEC_001488_1750_001752_1750_U02.IMG` (360 MB)
- **Horizontal Resolution / Post Spacing:** 1.01 meters/pixel
- **Vertical Units:** Meters elevation relative to the Mars reference datum (areoid)
- **Projection:** Equirectangular (clon = 137.3°E, clat = -4.83°N)
- **Datum:** Mars 2000 ellipsoid

## Transform Guidance for Longla (3D Rehearsal Prototype)

For the version 1 Three.js rehearsal prototype (`src/app/viewer3d/`), Longla must follow the agreed coordinate mapping for the flat imagery plane:
- **Scene coordinates:**
  - `scene.X = x - (width / 2)`
  - `scene.Y = 0` (flat plane, labeled *No verified terrain; elevation unavailable*)
  - `scene.Z = (height / 2) - y`
- **Display offset:** Render routes and markers with a minimal Y offset (+1 to +2 units) above the plane solely to prevent z-fighting; this offset is not elevation.
- **Slope & Hazard Metrics:** Disabled until a formal v2 DEM contract and validated raster transform are implemented centrally.

