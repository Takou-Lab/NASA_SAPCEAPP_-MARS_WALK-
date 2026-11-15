# MARSWALK — device and PWA acceptance

## Royce/Longla report 3af60d1 — received, device acceptance pending reconciliation

15 November 2026. Contributor reports Samsung / One UI 8.0 / Chrome 157.0.8103.50 home-screen installation and disconnected reopening, and a missing note. These are contributor observations, not coordinator-reproduced passes. Exact Samsung model, tested URL/source/pack, preparation confirmation, save feedback and whether notes were inspected after explicit Load Route are not recorded. Requested follow-up is in [Longla's plan](../team/LONGLA.md). Preserve the original report in Git commit 3af60d1; rows below retain its claimed outcomes with their provenance made explicit.

Current service saves observations with the route envelope; explicit Load Route restores both. Startup alone does not automatically restore it. A missing note before Load Route does not prove persisted data was lost. If it is still absent after successful load, treat it as a potential release blocker and capture before/after exports plus exact steps; do not dismiss a real device failure based on previous desktop tests. An unsaved text draft is distinct from a saved observation. No code fix or new physical pass is claimed here.


<!-- CURRENT_WORK_PLAN -->
> **Revision-scoped evidence/acceptance record.** Keep recorded counts/outcomes tied to their revisions; current assignments and dependencies are in [the work plan](../../TEAM_TASKS.md). Unrun device/offline checks remain pending or blocked.
<!-- /CURRENT_WORK_PLAN -->

Plan/update: **15 November 2026**. Current integrated application **`b744b0b`** includes shell/planner/notebook, all evidence panels, retry, guarded transfer and optional lazy viewer. [Final integration checks](FINAL_BRANCH_INTEGRATION.md) cover 131 Angular tests, 28 data tests/build/browser mission checks. Earlier [viewer](VIEWER3D_REVIEW.md), [science](SCIENCE_INTEGRATION.md) and [transfer](MISSION_TRANSFER.md) records retain their tested scopes.

Longla's latest [submitted device record](submissions/LONGLA_23d5180.md) is preserved as contributor-reported, **pending reconciliation**: some quoted strings differ from its stated source, browser version is inexact and no measurement artifact supports 60 FPS. Do not treat it as independently accepted physical-device or installed-PWA evidence. Reconcile it against the exact served build and actual hardware observations.

**Result meanings:** Passed means the named check was actually run in the stated environment. Pending means unrun. Blocked means an explicit prerequisite is absent. A written scenario is not a pass.

## Public host delivered

**https://marswalk-jet.vercel.app/** is live from `b6669fb`. Production-origin full-pack verification and complete browser-process restart disconnected pass, including route/note recovery/export and deferred 3D. [Actual provider/browser checks](VERCEL_PRODUCTION.md). Missing image/data/worker URLs correctly return 404. Physical home-screen installation and standalone/device acceptance still need Longla/Willy observations. Automatic GitHub deployment is not connected; record the actual deployed source rather than assuming every main commit is live.

## Current evidence and prerequisites

**PWA update:** code `8a4dadc`, tested in production Chromium 156.0.8078.79 Linux, includes real preparation/worker/update support. [Detailed current results](PWA_FOUNDATION.md), [deployment runbook](../DEPLOYMENT.md). Earlier `b744b0b` counts above remain historical. New checks: **136 Angular, 11 worker, 28 data tests** and root/subpath builds pass.

| Scenario | Actual result / remaining acceptance |
| --- | --- |
| Real image/science/route/notebook/transfer | **Passed production browser**; 3 records, drawn/saved route, saved note, recovery/export, previous guarded transfer regressions retained |
| Full runtime pack preparation | **Passed production browser**, 17 required assets/1,789,610 bytes, downloaded/hashed/stored/read-back checked before complete marker |
| Browser disconnected close/reopen | **Passed after complete browser-process restart** with persistent profile set disconnected before navigation; image/science, explicit route/note recovery/export and deferred 3D work |
| Install manifest/browser eligibility | Root/subpath manifest/icons and Chromium non-incognito diagnostics **pass with no errors**; not a launcher installation claim |
| Actual physical install/standalone launcher | **Contributor-reported; exact revision/model pending.** Installed on Samsung (One UI 8.0) – Chrome 157.0.8103.50 – LTE – 2026‑11‑15 10:00 UTC. Launcher icon added, app opens without address bar. |
| Physical installed disconnected close/reopen | **Contributor-reported; full mission recovery unconfirmed.** Offline test completed on Samsung (One UI 8.0) – Chrome 157.0.8103.50 – LTE – 2026‑11‑15 10:05 UTC. App launched from home‑screen while offline, UI loaded, map & planner functional, no errors. |
| Truncated download / missing cached essential | **Passed production browser**: failed preparation never marks partial ready; missing cache revokes ready and explicit repair retains mission |
| Storage quota / readback / interrupted network | **Passed worker harness tests** with real crypto; physical disk-pressure behavior remains pending |
| Update cancellation / multiple windows / explicit apply | **Passed two-artifact production browser checks**: cancellation retains exact unsaved draft, extra app window blocks activation, saved work recovers after accepted prepared reload |
| Failed update / natural activation after all clients close | **Passed production browser**: failed installation retains old prepared worker; valid waiting update already has complete pack, browser restart disconnected loads it |
| `/marswalk/` subpath and narrow layout | **Passed actual subpath production build/browser**, correct scope/relative paths, 390px no horizontal overflow and offline page reopening |
| Prior Longla device report | **Contributor-reported, pending reconciliation** as above; no newly invented hardware/FPS pass |
| Outside-user sessions | **Pending/unrun**; coordinator arranges using Emma's existing protocol, Enzo consolidates, Longla observes |

## Route / Note Save‑Close‑Reopen‑Load‑Export
| Scenario | Actual result / remaining acceptance |
| --- | --- |
| Route persists after offline reopen | ✅ Route reappeared when app was reopened offline. |
| Note persists after offline reopen | ❌ Note did **not** reappear after closing and reopening the app. |
| Load Route button works | ✅ Load Route successfully retrieved the saved route. |
| Export JSON file generated | ✅ Export produced **marswalk-mission-1.json**. |
| Defect observed | **Reported potential defect; not yet reproduced:** note did not reappear. Save success, explicit-load ordering and whether persisted data was lost require verification. |


The original PWA implementation did not itself deploy or establish physical-device acceptance. Public deployment was subsequently recorded above. This contributor report does not close device acceptance; no competition submission, verified environmental runtime dataset, runtime AI or immersive VR is claimed.

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

The integrated PWA is now supplied; execute installation/preparation/disconnection/reopening on the actual device and replace blocked states with dated, observed outcomes. Keep connectivity, validated metadata, successful image display, persistent notes and verified cache readiness distinct.
