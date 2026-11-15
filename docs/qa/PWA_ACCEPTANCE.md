# MARSWALK — device and PWA acceptance

<!-- CURRENT_WORK_PLAN -->
> **Revision-scoped evidence/acceptance record.** Keep recorded counts/outcomes tied to their revisions; current assignments and dependencies are in [the work plan](../../TEAM_TASKS.md). Unrun device/offline checks remain pending or blocked.
<!-- /CURRENT_WORK_PLAN -->

Plan/update: **15 November 2026**. Current integrated application **`b744b0b`** includes shell/planner/notebook, all evidence panels, retry, guarded transfer and optional lazy viewer. [Final integration checks](FINAL_BRANCH_INTEGRATION.md) cover 131 Angular tests, 28 data tests/build/browser mission checks. Earlier [viewer](VIEWER3D_REVIEW.md), [science](SCIENCE_INTEGRATION.md) and [transfer](MISSION_TRANSFER.md) records retain their tested scopes.

Longla's latest [submitted device record](submissions/LONGLA_23d5180.md) is preserved as contributor-reported, **pending reconciliation**: some quoted strings differ from its stated source, browser version is inexact and no measurement artifact supports 60 FPS. Do not treat it as independently accepted physical-device or installed-PWA evidence. Reconcile it against the exact served build and actual hardware observations.

**Result meanings:** Passed means the named check was actually run in the stated environment. Pending means unrun. Blocked means an explicit prerequisite is absent. A written scenario is not a pass.

## Current evidence and prerequisites

| Scenario | Expected behavior | Environment / revision | Actual result and evidence |
| --- | --- | --- | --- |
| Initial 2D mission and science | Real image, three selectable unlocated records, truthful missing scale/terrain | Chromium 156.0.8078.79 Linux, integrated `b744b0b`; emulated tablet/narrow viewport | **Passed in browser**; viewer/science records above. Physical tablet remains pending |
| Portable mission | Version-matching route/note import and export; failures preserve work | Automated service/root tests and isolated Chromium profiles | **Passed in automated/browser checks**; transfer/viewer records. Not an installed-device pass |
| Optional viewer | Explicit loading, stable camera, cleanup and readable failure; 2D retained | Software-WebGL Chromium, integrated `b744b0b` | **Passed in browser**, VIEWER3D_REVIEW.md. Physical graphics hardware remains pending |
| Target-device online rehearsal | Open actual revision, inspect source/unknowns, select records, import/export a mission, open/close optional viewer if supported | Actual demonstration device; model/OS/browser/build/URL must be recorded | **Contributor-reported, pending reconciliation** — see preserved submission and clarification above; physical tablet remains pending |
| Complete route/notebook UI | Draw/edit route and create/save/recover a note through the normal UI; failed saves retain draft | Integrated Enzo shell/planner/notebook revision | **Passed in production browser** on `b744b0b`: actual route drawing/save/clear/undo, notebook draft retention on tabs/failed save, successful save/export and guarded transfer. Physical-device acceptance remains pending |
| Install / standalone launch | Install from supported browser and launch from icon | HTTPS/localhost, coordinator's real PWA manifest/icons/worker | **Blocked** — install/worker lifecycle is not implemented in this baseline |
| Prepare complete offline pack | Verify required shell and data, show real complete/failure states | Coordinator's cache/readiness implementation | **Blocked** — image-only inventory does not implement complete app caching |
| Disconnected close/reopen | Prepare online, install, disconnect, close, reopen; image/science, route, saved note and export work | Target installed PWA with complete preparation | **Blocked** — PWA prerequisites above absent; browser viewport tests cannot establish this |
| Interrupted preparation / insufficient storage | Truthful failure/readiness and retained mission/draft | Real preparation API plus safe isolated test data | **Blocked** for preparation. Existing storage-failure unit/browser checks cover mission operations only |
| Update handling | Explain available update; preserve/export unsaved work before replacing running version | Two served app versions and coordinator update lifecycle | **Blocked** — update lifecycle missing; do not infer support from reload/build success |
| Three outside-user tasks | Observe route drawing, explanation of unknown distance/slope, note recovery | Coordinator-arranged sessions using Emma's protocol | **Pending** — no participants contacted or outcomes recorded by this correction |

## Longla's next actual-device record

Reconcile the preserved report, then record observations from the integrated target-device build. Retain its contributor-reported history; do not enter placeholder successes.

- Tested commit/build and URL: **Pending**
- Device model, OS, browser/version, viewport and input method: **Pending**
- Online image/science selection and source/unknown-data understanding: **Pending**
- Matching mission import/export and wrong-image rejection using isolated records: **Pending**
- Optional viewer open/close, camera presets, alignment and readable fallback: **Pending**
- Observed performance, crashes, layout or keyboard/touch defects with reproduction: **Pending**
- Fix/retest revision and outcomes: **Pending**

Export any needed mission before storage/failure experiments; use an isolated profile and temporary test data. Report defects to the coordinator rather than changing another contributor's core/map/science/UI/worker files. Do not contact outside users through messaging tools without authorization.

When the coordinator supplies the integrated PWA, execute installation/preparation/disconnection/reopening on the actual device and replace blocked states with dated, observed outcomes. Keep connectivity, validated metadata, successful image display, persistent notes and verified cache readiness distinct.
