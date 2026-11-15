# Calibrated HiRISE crop — planar distance release

15 November 2026. User supplied a GeoTIFF generated locally from PSP_001752_1750_RED.JP2 and its copied PDS label. This replaces the active uncalibrated Photojournal derivative with a small traceable projected raster; it does not supply terrain or prove boxwork/science-target overlap.

## Inspected evidence and transform

Source preserved in data/imagery/calibrated-source/marswalk_crop.tif (5,074,741 bytes), copied user label adjacent. [Exact source/display hashes and parameters](evidence/CALIBRATED_CROP.json). TIFF is packed 10-bit unsigned grayscale with deflate; Pillow cannot open that encoding directly, so tifffile/imagecodecs decoded and inspected it successfully. Dependencies were installed in a separate /workspace/spatial-tools directory, not the app. Full source JP2 was downloaded on user's computer, not independently fetched by coordinator. Label paste is supplied text, not an authenticated raw archive download.

2048 × 2048 pixels; Mars equirectangular, projected meter units, spherical local radius 3,396,190 m, center longitude 180°, center latitude 0°. GeoTIFF scale 0.25 m × 0.25 m, upper-left edge E=-2,531,487.00 / N=-286,803.75. Lower-left N=-287,315.75; right edge E=-2,530,975.00. This matches the reported original grid and source window (13184,28284,2048,2048). No null/black pixels, decoded DN range 91–880.

At bottom-left-origin image edge coordinates (x,y), projected E=-2531487 + 0.25*x, N=-287315.75 + 0.25*y. Entire extent is 512 × 512 projected meters. This is image-plane scale validation against supplied metadata, not photogrammetric control-point validation or independent absolute positioning accuracy. Ground/geodesic differences and source uncertainty remain. Distance is explicitly projected planar, not terrain-following. Optical brightness does not determine elevation.

## Display preparation and identity

`python3 tools/data/prepare_calibrated_crop.py` with requirements-spatial.txt regenerates the display/manifest/marker image identities and evidence report. 2nd–98th percentile grayscale stretch, JPEG quality 90, **no geometric resampling**; same 2048² grid and 0.25 m spacing. Intensity conversion is for display, not temperature or reflectance science. Generator asserts CRS/scale/dimensions/tiepoint; preserve inputs and use exact hashes for review.

New imageRef **hirise-psp001752-red-center-2048-025m-v2**. Old manifest/records retained under data/imagery/archive-v1, old display asset retained in Git but excluded from new deploy/build. Raw spatial evidence excluded from Vercel upload and PWA runtime. Marker findings/sources/positions unchanged; only imageRef updated to keep regional records readable, not to assert geolocation. Scene contains visible relief/textural features; no geological classification, boxwork-target or obstacle verification is inferred from it.

Storage remains keyed by imageRef. No old mission is deleted or transformed. Old-image imports fail validation, because old pixels describe a different frame. Export from the old origin/version before moving to a new preview; preview origins themselves have separate storage. Do not silently re-label old route coordinates.

## App behavior and checks

Existing shared assessRoute now derives planar distance from admitted 0.25 m scale. Whole-width horizontal span 2048 px → 512 m; 300×400 px triangle →125 m; coincident endpoints →0 m. Missing endpoints stay unavailable. Terrain/slope/safety remain unavailable. Briefing/planner/mission summary no longer claim the active image is uncalibrated when it is calibrated.

New tests assert active raster validity/known lengths/zero and reject legacy mission identity. Updated fixed-byte fixtures describe new current index rather than old data. **237 Angular tests / 23 files, 54 data tests and production build/full-pack pass**. Initial 473.01 kB within unchanged warning budget; Leaflet CommonJS warning remains. Pack prefix e490cf570d50, 19 assets / 2,609,914 bytes, larger due detailed 512 m crop image. Original full JP2/GeoTIFF are not cached.

## Remaining boundaries

No aligned DTM, terrain-following route length, slope, obstacle clearance or route safety assessment. Regional Curiosity science and limited REMS excerpt are not observations at the route location. Existing source labels/scene interpretation need separate geologic review. No claim of operational astronaut navigation or completed survival-map objective. This is concrete progress from pixel-only sketch to calibrated planar route measurement.
