# MARSWALK — Terrain Data Status (v1)

<!-- CURRENT_WORK_PLAN -->
> **Data/reference record.** Preserve source facts, hashes and coordinate limits. Current work is [W2](../../../TEAM_TASKS.md#w2); app-wide PWA lifecycle belongs to [W6](../../../TEAM_TASKS.md#w6), not this image inventory.
<!-- /CURRENT_WORK_PLAN -->

## Status: Unavailable (Visual Review Fallback Active)

As specified in `docs/team/CODING_AGENTS.md` (v1 schema: `terrainStatus: 'unavailable'`) and `docs/team/GADDIELLE.md`, no validated DEM contract exists for the version 1 application. Under project safety and scientific integrity rules:
- **No fictional height maps are generated.**
- **Image brightness is never interpreted as elevation.**
- The application activates the **visual review only** fallback mode.

## Candidate terrain product — metadata and overlap unverified

Contributor reports candidate `DTEEC_001488_1750_001752_1750_U02`, stereo pair `PSP_001488_1750` / `PSP_001752_1750`, catalog https://www.uahirise.org/dtm/PSP_001488_1750 . Catalog retrieval is HTTP 403 in the coordinator environment; original label/raster have not been independently inspected. This is a lead, not proof of exact AOI coverage.

Previously listed 360 MB size, 1.01 m/pixel, equirectangular parameters, vertical datum and complete overlap are **unverified contributor assertions**, not accepted runtime metadata. Do not use them for distance, elevation or slope. Sharing a parent observation does not prove alignment with our Photojournal derivative. [Calibration takeover and required source evidence](../../../docs/data/CALIBRATION_TAKEOVER.md).

## Transform Guidance for Longla (3D Rehearsal Prototype)

For the version 1 Three.js rehearsal prototype (`src/app/viewer3d/`), Longla must follow the agreed coordinate mapping for the flat imagery plane:
- **Scene coordinates:**
  - `scene.X = x - (width / 2)`
  - `scene.Y = 0` (flat plane, labeled *No verified terrain; elevation unavailable*)
  - `scene.Z = (height / 2) - y`
- **Display offset:** Render routes and markers with a minimal Y offset (+1 to +2 units) above the plane solely to prevent z-fighting; this offset is not elevation.
- **Slope & Hazard Metrics:** Disabled until a formal v2 DEM contract and validated raster transform are implemented centrally.

