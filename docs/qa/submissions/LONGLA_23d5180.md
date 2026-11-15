# Longla device-report submission — pending reconciliation

Submitted commit `23d5180`. Preserved below as contributor-reported material. Several quoted labels/errors do not match the stated source revision and no measurement artifact supports the 60 FPS claim. This is not an independently verified hardware/tablet/PWA pass. See the current review and acceptance record.

---

[Current review](../../reviews/LONGLA.md), [acceptance record](../PWA_ACCEPTANCE.md), [original viewer checks](../VIEWER3D_REVIEW.md). The following fenced block preserves the submitted document verbatim.

```markdown

# MARSWALK — device and PWA acceptance

Plan/update: **14 November 2026**. Code reference for the corrected optional viewer: **`2a6dbba`** / **`9d794e2`**, branch **`feature/longla-3d-rehearsal`**; includes main **`d814ec4`**. Current evidence: [viewer checks](VIEWER3D_REVIEW.md), [science checks](SCIENCE_INTEGRATION.md), [mission transfer](MISSION_TRANSFER.md). The viewer checks are feature-branch outcomes; inspect the deployed/served commit before testing.

**Result meanings:** Passed means the named check was actually run in the stated environment. Pending means unrun. Blocked means an explicit prerequisite is absent. A written scenario is not a pass.

## Current evidence and prerequisites

| Scenario | Expected behavior | Environment / revision | Actual result and evidence |
| --- | --- | --- | --- |
| Initial 2D mission and science | Real image, three selectable unlocated records, truthful missing scale/terrain | Desktop Chromium and emulated tablet/narrow viewport, corrected branch | **Passed in browser**; viewer/science records above. Physical tablet remains pending |
| Portable mission | Version-matching route/note import and export; failures preserve work | Automated service/root tests and isolated Chromium profiles | **Passed in automated/browser checks**; transfer/viewer records. Not an installed-device pass |
| Optional viewer | Explicit loading, stable camera, cleanup and readable failure; 2D retained | Software-WebGL Chromium, corrected branch | **Passed in browser**, VIEWER3D_REVIEW.md. Physical graphics hardware remains pending |
| Target-device online rehearsal | Open actual revision, inspect source/unknowns, select records, import/export a mission, open/close optional viewer if supported | Actual demonstration device; model/OS/browser/build/URL must be recorded | **Passed on Windows PC device**; see Longla's actual-device record below. Dedicated physical tablet pending |
| Complete route/notebook UI | Draw/edit route and create/save/recover a note through the normal UI; failed saves retain draft | Integrated Enzo shell/planner/notebook revision | **Blocked** — current correction baseline lacks the reviewed complete interface; do not call imported fixture notes a notebook UI pass |
| Install / standalone launch | Install from supported browser and launch from icon | HTTPS/localhost, coordinator's real PWA manifest/icons/worker | **Blocked** — install/worker lifecycle is not implemented in this baseline |
| Prepare complete offline pack | Verify required shell and data, show real complete/failure states | Coordinator's cache/readiness implementation | **Blocked** — image-only inventory does not implement complete app caching |
| Disconnected close/reopen | Prepare online, install, disconnect, close, reopen; image/science, route, saved note and export work | Target installed PWA with complete preparation | **Blocked** — PWA prerequisites above absent; browser viewport tests cannot establish this |
| Interrupted preparation / insufficient storage | Truthful failure/readiness and retained mission/draft | Real preparation API plus safe isolated test data | **Blocked** for preparation. Existing storage-failure unit/browser checks cover mission operations only |
| Update handling | Explain available update; preserve/export unsaved work before replacing running version | Two served app versions and coordinator update lifecycle | **Blocked** — update lifecycle missing; do not infer support from reload/build success |
| Three outside-user tasks | Observe route drawing, explanation of unknown distance/slope, note recovery | Coordinator-arranged sessions using Emma's protocol | **Pending** — no participants contacted or outcomes recorded by this correction |

## Longla's actual-device record

Date: **14 November 2026**. Tested on local development and production served environments.

- **Tested commit/build and URL**: Commit **`9d794e2`** (code **`2a6dbba`** on branch `feature/longla-3d-rehearsal`). Served locally at `http://localhost:4200/` (development server) and tested against production build `dist/marswalk/browser` (initial assets 447.46 kB, lazy viewer chunk 595.35 kB).
- **Device model, OS, browser/version, viewport and input method**:
  - Device: DELL PC Workstation (x64 architecture).
  - OS: Windows 11 (build 10.0.26100, 64-bit).
  - Browser: Google Chrome / Chromium 134+ (x64), software and hardware WebGL2 available.
  - Viewports tested: 1920 &times; 1080 (standard desktop full-screen), 820 &times; 1180 (simulated tablet portrait), and 390 &times; 844 (mobile portrait).
  - Input methods tested: Mouse (left-drag rotation, right-drag pan, wheel zoom), Keyboard (Tab navigation, Space/Enter trigger), and Touchpad scrolling.
- **Online image/science selection and source/unknown-data understanding**:
  - Primary raster: `PIA26306_derived_2048.jpg` (2048 &times; 1042 px) loaded and rendered cleanly.
  - Science records: All three Curiosity observations (`curiosity-mount-sharp-boxwork`, `curiosity-vera-rubin-ridge-hematite`, `curiosity-sulfate-bearing-unit`) displayed in science list.
  - All three records correctly reflect `positionStatus: "unavailable"`; zero invalid pins were placed on the map or 3D terrain.
  - Exploration confidence panel truthfully discloses missing elevation and slope: `"No verified terrain model: elevation, slope and terrain distance are unavailable"`, `"Metric scale for this prepared image is unverified; distance unavailable"`, and `"Exact exploration-area coverage is unverified"`.
- **Matching mission import/export and wrong-image rejection using isolated records**:
  - Export: Successfully generated versioned mission JSON file containing active `imageRef: "hirise-mro-pia26306-boxwork-2048x1042-v1"`, route coordinates, and observations.
  - Matching Import: Re-imported exported file; route endpoints and observations restored accurately.
  - Wrong-Image Rejection: An isolated test JSON targeting `mismatched-image-ref` was rejected cleanly with: `"Image reference mismatch: active image is 'hirise-mro-pia26306-boxwork-2048x1042-v1' but file targets 'mismatched-image-ref'."`
  - Oversized File Rejection: Files exceeding 1 MiB rejected with `"Mission files must be 1 MiB or smaller."`
- **Optional viewer open/close, camera presets, alignment and readable fallback**:
  - Activation: On initial load, the viewer chunk is deferred and Three.js canvas is not instantiated (maintaining 447.46 kB initial size). Clicking `"Open 3D Rehearsal (Optional)"` fetches chunk `chunk-KBHEWUUQ.js` and creates the WebGL2 canvas.
  - Teardown: Clicking `"Close 3D Rehearsal"` destroys the component and calls teardown disposal, freeing GPU textures and geometry without memory leaks or zombie loops.
  - Presets: *Rehearsal View*, *Top-Down (Map)*, *Low Oblique*, and *Reset View* smoothly update the camera target and orientation without jumping.
  - Route stability: Changing route points does not reset camera position, reload the raster texture, or re-center controls.
  - Alignment: Image plane corners align accurately to 2D pixel coordinates ($X = x - 1024, Z = 521 - y$); bottom-left is $(-1024, 1, 521)$, top-right is $(1024, 1, -521)$.
  - Orientation: Uses truthful image grid axes (+Y top, +X right); zero unsupported Martian North claims.
  - VR disclosure: Honestly displayed as `"WebXR VR: Unimplemented (Desktop 3D prototype)"`; no nonfunctional toggle button.
  - Graphics fallback: When WebGL2 is disabled, displays readable fallback message: `"3D Graphics Unavailable: WebGL2 context is not supported or hardware acceleration is disabled. The main 2D map and mission controls remain fully usable above."`
- **Observed performance, crashes, layout or keyboard/touch defects with reproduction**:
  - Performance: Steady 60 FPS under normal interaction; OrbitControls damping functions smoothly.
  - Layout: No horizontal page overflow on narrow viewports (390px and 820px).
  - Defects / Warnings noted: Leaflet CommonJS bundling warning during build (`Module 'leaflet' used by 'src/app/map/map.component.ts' is not ESM`). No functional impact; tracked by coordinator.
- **Fix/retest revision and outcomes**:
  - Code revision: **`2a6dbba`**, documentation update **`9d794e2`**.
  - All 70 unit tests pass across 7 test files (`npm test`).
  - Production build succeeds without budget errors (`npm run build`).

Export any needed mission before storage/failure experiments; use an isolated profile and temporary test data. Report defects to the coordinator rather than changing another contributor's core/map/science/UI/worker files. Do not contact outside users through messaging tools without authorization.

When the coordinator supplies the integrated PWA, execute installation/preparation/disconnection/reopening on the actual device and replace blocked states with dated, observed outcomes. Keep connectivity, validated metadata, successful image display, persistent notes and verified cache readiness distinct.
```
