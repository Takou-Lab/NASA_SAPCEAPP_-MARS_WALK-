# Royce / Longla — corrections verified on feature branch

<!-- CURRENT_WORK_PLAN -->
> **Published-commit review record.** Current work and file ownership follow [the team plan](../../TEAM_TASKS.md); historical findings below are not new assignments.
<!-- /CURRENT_WORK_PLAN -->

Corrected code **`2a6dbbaf086fef072844888c8eb25a3e5e5552ca`**, branch **`feature/longla-3d-rehearsal`**, **14 November 2026**. The user asked the coordinator to implement the outstanding corrections for Longla. Main `d814ec4` is merged into the feature branch; feature integration into main remains pending.

## R1–R5 closure

| Finding | Correction and actual verification |
| --- | --- |
| R1 — older baseline / eager optional viewer | Reconciled current core/map/science/mission transfer; renderer/chunk only load after explicit Open. No viewer request/canvas at startup. Production initial assets 447.46 kB; lazy viewer 595.35 kB; no budget increases or style-budget warnings |
| R2 — camera reset / resource leaks | Image effect separated from route/markers; replaced and pending textures/helper resources disposed; stale callbacks ignored. Twelve real-WebGL route edits kept camera, texture and warmed GPU count 2 → 2 stable; close disposed the actual texture |
| R3 — silent image/graphics failures | Explicit loading/error states, decoded-dimension validation, guarded renderer initialization/context loss and visible fallback. Failed image/WebGL2/chunk probes preserved 2D use; automated regressions cover mismatched dimensions and late callbacks |
| R4 — geographic claims | Removed compass/north indicator and heading state; image orientation/scale limits and source/credit visible; all offsets described as display-only |
| R5 — simulated VR | Removed support/presenting toggles and Enter/Exit control; immersive VR explicitly unimplemented |

**70 tests passed across seven files** and the production build passed. Only the existing Leaflet CommonJS warning remains. Four production open/close cycles preserved route/notes/image; tablet/narrow viewport checks passed. Controlled four-color image samples confirmed rendered orientation against 2D; the diagnostic fixture was never committed as scientific data.

Full method/outcomes: [VIEWER3D_REVIEW.md](../qa/VIEWER3D_REVIEW.md). Remaining device/PWA gates: [PWA_ACCEPTANCE.md](../qa/PWA_ACCEPTANCE.md). Physical hardware, installed offline reopening and outside-user results remain unrun/blocked. This verification does not add terrain calibration or immersive VR.

## Next task

No repeat R1–R5 implementation. Longla's next work is independent actual-device online QA, defect recording and later installed/offline acceptance once the coordinator supplies that lifecycle. Keep the same feature branch and source history; do not expand terrain/VR or rewrite teammates' files. [Updated prompt](../team/LONGLA.md).

---

# Previous review — original `aedfd4d` findings

Reviewed branch: **`feature/longla-3d-rehearsal`**, commit **`aedfd4d1e0811af53c01615057b079c00dc9e311`**, **14 November 2026**. Integration reference: main **`9408070`**. Royce is the original-plan name for the 3D role documented as Longla in this repository.

**Verdict: changes required before integration.** Preserve the submitted viewer. No feature code was merged during this review.

## Useful work and checks that passed

- Standalone Three.js viewer, shared MissionService use, flat-image prototype/terrain-unavailable notices, camera presets, route order and coordinate helpers.
- The transform follows `X = x − width/2`, `Z = height/2 − y`; all four mathematical corner positions are covered. This does not by itself verify rendered texture orientation.
- **24 tests passed across five files**, including nine new viewer/transform tests. These are tests of the older branch baseline, not the current integrated application's 44-test suite.
- Frozen-lockfile `npm ci --no-audit --no-fund` and the production build passed. Initial output was **855.49 kB**, exceeding the 500 kB warning budget; viewer styling was **5.46 kB**, exceeding the 4 kB warning budget. Neither exceeded its error budget.
- In development Chromium with software WebGL and main's real data supplied as intercepted responses, the texture and route rendered without page errors. All three unlocated science records stayed unrendered as pins.

## R1 — reconcile with the integrated app and keep the viewer optional

The branch starts at foundation `55b3239`, before the mounted Leaflet map and delivered data. As pushed, `public/` contains only the favicon: the browser reports unavailable image data and shows the practice grid. This is an integration gap, not evidence that the delivered main image is missing.

A read-only merge preview against main `9408070` found a conflict in **`src/app/app.ts`**. Preserve main's MapComponent mount, single initialization, import/export UI and guards, canonical core, current dependencies and every accepted test. Do not replace the current app with the branch's older root or copy old foundation files over main.

For this correction, a narrow integration exception permits root TS/HTML/SCSS/spec and package/lockfile edits needed to reconcile and defer the viewer. Preserve existing dependency versions and lock entries. Keep optional Three.js loading/rendering behind explicit user activation so core PWA startup does not eagerly create a renderer or download the optional viewer. Do not raise bundle budgets to hide warnings. Review the final lazy chunk/build sizes; type declarations belong in devDependencies.

## R2 — preserve the camera and dispose replaced resources

Locations: component constructor effect, lines **71–83**; `rebuildTerrain`, lines **228–287**.

The combined effect rebuilds the terrain, reloads its texture, recreates the direction indicator and resets the camera whenever the route changes. Browser reproduction using the real 2048 × 1042 manifest:

1. Select Low Oblique. Camera position is approximately `(0, 512, 1843.2)`.
2. Apply a route point through the shared service.
3. Camera jumps to `(0, 1843.2, 1638.4)`; the texture UUID changes and the old texture emits no dispose event. Renderer texture count increased from 2 to 3 in the isolated run.

Separate image-driven terrain work from route/marker synchronization. Route edits and science changes must preserve the loaded texture and chosen view. Dispose replaced textures, geometry/materials and helper descendants, including removed practice grids and direction helpers. Reset hover/raycast references when their objects are removed. Clean teardown must cover loaded, replaced, failed and late-loading resources as well as animation, controls, observers and listeners.

Add behavioral regressions for route edits preserving camera/texture, replacement and teardown disposal, and stale asynchronous image callbacks. Keep tests focused on observable behavior/resource release.

## R3 — show truthful image and graphics failure states

Locations: `checkWebGLSupport` / `ngAfterViewInit`, lines **86–112**; texture loader, lines **252–263**; template viewport fallback.

- Blocking the JPEG request left a plane and normal source/coordinate UI with **no visible image error**. Metadata remained ready, correctly, but the viewer gave no indication that imagery had failed. Add local loading/error/ready state, validate natural dimensions against the manifest, and prevent location-specific overlays/readouts from suggesting a usable image before it displays. Show image failure explicitly without changing MissionService metadata readiness or another component's state.
- With WebGL1 available but WebGL2 disabled in the browser probe, preflight reported `webglAvailable: true`, no rendered canvas was appended and no fallback appeared. This Three.js renderer needs WebGL2. Catch renderer initialization failures, release partially created resources and show a readable fallback. The normal 2D mission must remain usable.
- On missing imagery/practice mode, label any practice coordinates as illustrative. Resolve image assets with the agreed document-base URL contract. Surface source link, credit and image limitations alongside the view.

Test missing/failed/wrong-dimension imagery, graphics initialization failure and component reopening. Include a real texture-corner comparison against 2D imagery; mathematical transform tests alone do not verify texture orientation.

## R4 — remove unsupported Martian-north claims

Locations: direction-helper creation, camera-heading comments and template compass title **“Camera Heading relative to Martian North (-Z)”** with N/S labels.

The active image explicitly has unverified orientation/geodetic alignment. Assigning scene −Z to verified Martian north is unsupported. Label the indicator in image/scene axes (for example, image +y), or remove it. Do not call the displayed angle a geographic heading. Preserve the explicit lack of verified scale, elevation and slope. Correct the display-offset description too: sphere/cone centers use radius/height offsets in addition to the +1 line/ring offset; none are terrain elevation.

## R5 — remove the simulated VR state

Locations: `toggleVR` and template Enter/Exit VR controls.

With browser capability detection mocked as supported, clicking **Enter VR** changed the button to **Exit VR** and set `isPresenting` true, but made **zero** `requestSession` calls; renderer XR was disabled and actual presenting was false. Capability detection is not a VR implementation.

VR is optional. For this release, remove the nonfunctional toggle and state clearly that immersive VR is not implemented. Do not add VR to close this review. Any later XR feature needs an actual session lifecycle and independent testing.

## Review method and limits

The pushed branch was extracted to an isolated temporary directory. Commands there:

```sh
NG_CLI_ANALYTICS=false npm_config_cache=/workspace/.npm-cache npm ci --no-audit --no-fund
NG_CLI_ANALYTICS=false npm test
NG_CLI_ANALYTICS=false npm run build
NG_CLI_ANALYTICS=false npm start -- --host 127.0.0.1 --port 8015
```

Playwright used Chromium with software WebGL. The unmodified branch first showed missing imagery. Subsequent focused viewer checks fulfilled manifest, markers and image requests with exact main files; this was a controlled integration probe, not an already merged app. Failure probes blocked imagery or WebGL2; the VR probe simulated support only. No physical tablet/headset, installation, offline reopening or actual outside-user session was validated. Production build success is recorded separately from development-browser behavior.

## Next action and ownership

Stay on **`feature/longla-3d-rehearsal`**. Merge latest main without reset/force push; preserve the viewer and fix R1–R5. Add meaningful regressions and record actual browser outcomes and remaining blockers in `docs/qa/VIEWER3D_REVIEW.md`. Create/update `docs/qa/PWA_ACCEPTANCE.md` with unrun installation/offline/device scenarios marked pending; do not fabricate results or implement the coordinator's worker.

Run the complete integrated test suite and production build, verify the main 2D mission before/after optional viewer activation and push the same feature branch for re-review. No main integration until the corrections pass. Exact agent prompt: [LONGLA.md](../team/LONGLA.md).
