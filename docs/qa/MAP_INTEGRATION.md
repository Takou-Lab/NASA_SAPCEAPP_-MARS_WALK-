# Map integration verification — 14 November 2026

**Later navigation update:** `21cf6f0` adds Reset View/Focus Route and passes 38 tests, build and browser checks; see [Willy's navigation review](../reviews/WILLY.md). The baseline record and pending list below describe the earlier integration and are retained as historical evidence.

This integration combines Willy `094fce2`, Gaddielle `fe9cd58` and Emma `b0640d9`, preserving their commits. The coordinator mounted one standalone MapComponent in the root, kept source data unchanged, blocked route actions until valid imagery displays, and required Pillow for full image-package verification.

## Automated checks

- `npm test`: 32 tests passed across four files.
- `npm run build`: passed. Leaflet emits the existing CommonJS optimization warning; the bundle is within its configured budget.
- `PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_verify_pack.py' -v`: four tests passed. They cover real-image decoding, truncated images, missing Pillow and JSON failure exit status.
- Real image manifest and three science records pass the service's runtime validators together. All positions remain null/unavailable.
- Prepared image: 2048 × 1042 pixels; image pack: 524,472 bytes; image checksum remains `7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8`.

Root tests isolate Leaflet rendering with a component stub while exercising actual production JSON through the real MissionService. Map tests exercise renderer interactions through Leaflet mocks. These tests do not establish real browser behavior by themselves.

## Production browser smoke check

Served `dist/marswalk/browser` with Python's local HTTP server. Used Playwright with the installed system Chromium, separately from application dependencies, for a one-time browser check. Tested desktop 1366 × 1000 and tablet-sized 820 × 1180 viewports; the latter is a browser viewport check, not physical-tablet or touch-device certification.

Confirmed on both:

1. One map mounts and the real local JPEG decodes at manifest dimensions.
2. The service loads three contextual science records; no invented science-marker circles appear.
3. Zoom controls and drag panning change the viewport.
4. Imagery visibility toggles remove and restore the actual image layer.
5. Layout has no horizontal page overflow and the map has usable dimensions.
6. No uncaught browser runtime errors occurred.

Separate network interception cases confirmed an explicit, non-crashing state for a missing manifest, missing image, and image/manifest dimension mismatch. Browser assertions waited for Leaflet animation completion and Angular rendering before observing interaction outcomes.

To repeat manually: build/serve the production output, open the app in Chromium, perform the six checks above at both sizes, then use browser request blocking or isolated test data to exercise the three failure states without changing committed assets. Record a new revision and actual results; do not copy these outcomes into a later release report without retesting.

## Still pending

- Enzo's route-mode controls, science list and notebook/export interface. The mounted shell starts in inspect mode; route actions/rendering are tested at the component/service level.
- Willy's new Reset View and Focus Route buttons.
- PWA installation, service-worker preparation and full offline reopening on a physical demonstration device.
- 3D/VR and actual outside-user sessions.

This integration verifies map mounting and data compatibility. It does not claim a complete installed offline PWA or independently reverify every external scientific source.
