# MARSWALK — device and PWA acceptance

Plan/update: **14 November 2026**. Code reference for the corrected optional viewer: **`2a6dbba`**, `feature/longla-3d-rehearsal`; includes main **`d814ec4`**. Current evidence: [viewer checks](VIEWER3D_REVIEW.md), [science checks](SCIENCE_INTEGRATION.md), [mission transfer](MISSION_TRANSFER.md). The viewer checks are feature-branch outcomes; inspect the deployed/served commit before testing.

**Result meanings:** Passed means the named check was actually run in the stated environment. Pending means unrun. Blocked means an explicit prerequisite is absent. A written scenario is not a pass.

## Current evidence and prerequisites

| Scenario | Expected behavior | Environment / revision | Actual result and evidence |
| --- | --- | --- | --- |
| Initial 2D mission and science | Real image, three selectable unlocated records, truthful missing scale/terrain | Desktop Chromium and emulated tablet/narrow viewport, corrected branch | **Passed in browser**; viewer/science records above. Physical tablet remains pending |
| Portable mission | Version-matching route/note import and export; failures preserve work | Automated service/root tests and isolated Chromium profiles | **Passed in automated/browser checks**; transfer/viewer records. Not an installed-device pass |
| Optional viewer | Explicit loading, stable camera, cleanup and readable failure; 2D retained | Software-WebGL Chromium, corrected branch | **Passed in browser**, VIEWER3D_REVIEW.md. Physical graphics hardware remains pending |
| Target-device online rehearsal | Open actual revision, inspect source/unknowns, select records, import/export a mission, open/close optional viewer if supported | Actual demonstration device; model/OS/browser/build/URL must be recorded | **Pending** — owner must run and record actual device observations |
| Complete route/notebook UI | Draw/edit route and create/save/recover a note through the normal UI; failed saves retain draft | Integrated Enzo shell/planner/notebook revision | **Blocked** — current correction baseline lacks the reviewed complete interface; do not call imported fixture notes a notebook UI pass |
| Install / standalone launch | Install from supported browser and launch from icon | HTTPS/localhost, coordinator's real PWA manifest/icons/worker | **Blocked** — install/worker lifecycle is not implemented in this baseline |
| Prepare complete offline pack | Verify required shell and data, show real complete/failure states | Coordinator's cache/readiness implementation | **Blocked** — image-only inventory does not implement complete app caching |
| Disconnected close/reopen | Prepare online, install, disconnect, close, reopen; image/science, route, saved note and export work | Target installed PWA with complete preparation | **Blocked** — PWA prerequisites above absent; browser viewport tests cannot establish this |
| Interrupted preparation / insufficient storage | Truthful failure/readiness and retained mission/draft | Real preparation API plus safe isolated test data | **Blocked** for preparation. Existing storage-failure unit/browser checks cover mission operations only |
| Update handling | Explain available update; preserve/export unsaved work before replacing running version | Two served app versions and coordinator update lifecycle | **Blocked** — update lifecycle missing; do not infer support from reload/build success |
| Three outside-user tasks | Observe route drawing, explanation of unknown distance/slope, note recovery | Coordinator-arranged sessions using Emma's protocol | **Pending** — no participants contacted or outcomes recorded by this correction |

## Longla's next actual-device record

Before optional viewer polish, fill this with observations from the target device. Do not enter placeholder successes.

- Tested commit/build and URL: **Pending**
- Device model, OS, browser/version, viewport and input method: **Pending**
- Online image/science selection and source/unknown-data understanding: **Pending**
- Matching mission import/export and wrong-image rejection using isolated records: **Pending**
- Optional viewer open/close, camera presets, alignment and readable fallback: **Pending**
- Observed performance, crashes, layout or keyboard/touch defects with reproduction: **Pending**
- Fix/retest revision and outcomes: **Pending**

Export any needed mission before storage/failure experiments; use an isolated profile and temporary test data. Report defects to the coordinator rather than changing another contributor's core/map/science/UI/worker files. Do not contact outside users through messaging tools without authorization.

When the coordinator supplies the integrated PWA, execute installation/preparation/disconnection/reopening on the actual device and replace blocked states with dated, observed outcomes. Keep connectivity, validated metadata, successful image display, persistent notes and verified cache readiness distinct.
