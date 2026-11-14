# Gaddielle → Willy: image handoff

<!-- CURRENT_WORK_PLAN -->
> **Data/reference record.** Preserve source facts, hashes and coordinate limits. Current work is [W2](../../TEAM_TASKS.md#w2); app-wide PWA lifecycle belongs to [W6](../../TEAM_TASKS.md#w6), not this image inventory.
<!-- /CURRENT_WORK_PLAN -->

The Angular foundation implements `ImageManifest` in `src/app/core/models.ts` and validates it in `validation.ts`. The integrated repository includes Gaddielle's prepared regional image and manifest. The coordinator has checked file dimensions/checksums and record compatibility, not independently verified an exact exploration AOI. Gaddielle owns future image-data changes.

## Files to deliver

1. One local image at `public/data/imagery/<filename>`.
2. `public/data/manifest.json` containing one `ImageManifest`.
3. Processing/provenance notes in `docs/data/`.
4. Emma supplies `public/data/markers.json` as a `ScienceMarker[]`; use `[]` only if no science records are ready, never fictional observations.

## Manifest requirements

| Field | Required value or meaning |
| --- | --- |
| schemaVersion | `1` |
| imageRef | Stable unique version for this exact prepared image and coordinate interpretation |
| assetPath | `data/imagery/<filename>` relative to application base; no leading slash, URL, `..`, query or fragment |
| width / height | Positive integer dimensions of the actual prepared file |
| coordinateSystem | `image-pixels-bottom-left` |
| source | `{title, url, credit}` with a real primary HTTPS source |
| observationDate | Verified nonempty date string, otherwise `null` |
| coverageStatus | `regional-context` unless exact AOI overlap has been verified, then `verified-aoi` |
| limitations | Array of nonempty strings documenting known gaps |
| calibration | When unverified: `{ "verified": false, "metersPerPixel": null, "sourceUrl": null, "method": null }` |

A verified calibration needs a positive finite metersPerPixel, real HTTPS sourceUrl and documented method for this exact raster. It enables planar distance only. It cannot enable elevation, slope or terrain assessment. Do not mark calibration verified simply to make a distance appear.

## Coordinate contract for Willy

- Origin bottom-left, x right, y up; bounds `0..width` and `0..height`.
- Leaflet `CRS.Simple`; map conversion `{x, y}` ↔ `[y, x]`.
- Image bounds `[[0, 0], [height, width]]`. Confirm corner alignment with the real image.
- Do not assume north-up, metric scale or geographic coordinates.
- Load the image URL with `new URL(manifest.assetPath, document.baseURI).href` so subpath deployment works.
- Compare the image's natural dimensions with the manifest. Show an error if they differ or the file fails to load. Service readiness means validated metadata, not successful image decoding.
- Markers, saved routes and observations must share imageRef. Version changes require deliberate data migration, not silently reusing pixels.

## Loading and failure behavior

The root calls `mission.initialize()` once. A missing manifest sets dataStatus to unavailable. Invalid/inaccessible metadata sets error. A valid manifest sets ready even if markers are absent/invalid; dataError explains missing science records and markers stays empty. The service never makes up source data.

Use unit-test fixtures to test bounds/conversion; synthetic fixtures under `src/app/core/` are not application assets. Do not copy them into public/data as scientific data.
