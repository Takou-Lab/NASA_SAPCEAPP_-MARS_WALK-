# MARSWALK — Current published submission review

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Review date: **14 November 2026 (Africa/Douala)**. Snapshot: main **`0043bae`** (documentation update on the same reviewed application), all seven advertised remote heads and four PR heads. Branch recheck for task alignment found no new submissions. This report covers published commits, not unseen local work. Detailed older reviews remain in `docs/reviews/` as labeled history.

## Current verdicts and next actions

| Contributor / branch | Published tip | Review result | Next action |
| --- | --- | --- | --- |
| Main integration | `0043bae` | Science/map/mission transfer integrated; Gaddielle index already merged. Angular source unchanged since recorded 51-test integration; fresh data suite passes 25 tests with R3 follow-up below | Preserve current work; finish Enzo integration, then real PWA lifecycle/device acceptance |
| Willy — `feature/willy-map-development` | `21cf6f0` | **Approved/integrated**, unchanged since navigation review | Continue guarded image-retry assignment; no newer retry submission advertised |
| Emma — `feature/emma-science-provenance` | `947ff1a` | **Accepted/integrated**, unchanged | Preserve research/protocol/presentation; no repeat assignment |
| Emma — `feature/emma-science-context-ui` | `4efcb5a` | **Approved/integrated/mounted**, unchanged; recorded 51-test/build/browser integration retained | Continue science discovery and transferred confidence/image-passport work on proposed evidence-workspace branch |
| Gaddielle — `feature/gaddielle-data-preparation` | `a53724a` | **25 tests and real index check pass; previous fixes complete. Already merged via PR #4. One additional browser-path compatibility correction required (R3)** | Same branch: reject encoded/whitespace paths that runtime rejects/browser normalizes; keep actual assets/index unchanged |
| Enzo — `feat/enzo-ui-planner-notebook` | `bcac915` | **57 tests/build and production mission checks pass; original functional defects closed. Final current-main integration required** | Same branch: resolve four root conflicts, preserve mission transfer, reuse Emma's accepted science component and rerun integrated checks |
| Royce / Longla — `feature/longla-3d-rehearsal` | `9d794e2` | **Corrections verified on feature branch**. Application code unchanged from tested `2a6dbba`: 70 tests/build and browser/resource/orientation checks retained; main feature integration pending | Actual-device QA; installation/offline checks stay blocked until real prerequisites exist |

A legacy local tracking reference for `Tablet-App` exists, but GitHub did not advertise that branch in this snapshot. It is not a new submission. The earlier comparison remains historical. No published evidence-workspace or image-retry branch was visible; absence does not establish whether local work is complete.

## Enzo — substantial corrections delivered

New review of **`bcac915`** closes duplicate foundation/storage, placeholder map, external fonts, draft loss and viewport-clamp findings. One real map and all three unlocated records work with actual local data. Actual route drawing/save/clear/load/export and notebook storage/error behavior passed in production Chromium.

The branch merged main only through `f65778d`; merging current main has four conflicts in root TS/HTML/SCSS/spec. Preserve current canonical core, mission JSON import/export and async guards, navigation and Emma's shared science component. His interim science list should be replaced with the accepted component; future evidence presentation remains Emma's assignment. Keep existing UI rather than restarting it. Build succeeds with initial/style warning overruns, below error thresholds; do not raise budgets.

[Full findings and completed-case evidence](docs/reviews/ENZO.md). [Ready-to-paste final integration prompt](docs/team/ENZO.md).

## Gaddielle — original fixes pass; one focused follow-up

New review of **`a53724a`** confirms canonical/literal path cases and strict schema/type/read-only failures are fixed. **25 tests pass**, and the current two-file index still verifies **524,472 bytes**. This code was already merged by PR #4; this review does not roll back or regenerate assets.

Temporary probes show generation/check still return success for `data/imagery/%2e%2e/texture.jpg`, a percent-encoded filename and a trailing-space filename. Browsers normalize these differently and runtime `validManifest()` rejects them. R3 aligns tool syntax with the existing runtime path contract, with negative regressions and unchanged outputs on failure. Keep all completed fixes; no new data, schema or worker work.

[Exact reproductions and correction](docs/reviews/GADDIELLE.md). [Ready-to-paste prompt](docs/team/GADDIELLE.md).

## Evidence and limits

Fresh checks for changed submissions:

- Gaddielle/main-identical tools: complete Python suite **25 passed**, real `--check` passed; additional negative probes used temporary copies only.
- Enzo isolated published branch: frozen install, **57 tests across 10 files**, production build passed; production Chromium verified real map/science, route persistence/export, exact draft retention after tabs/failed save, successful note save and keyboard/restored/narrow layout behavior.
- Enzo read-only merge preview: **four root conflicts**; no feature code merged by this review.
- Unchanged Emma/Willy/Longla sources were compared with accepted tested commits; their previous checks are retained rather than described as freshly rerun. Main Angular source is unchanged from `5203d60`; no unnecessary Angular rerun was used as new evidence.

Physical-device checks, outside-user sessions, installability, complete cache preparation and disconnected reopening remain unproven. No scientific sources were independently re-fetched in this technical review. No teammate implementation or feature branch was changed; review/assignment documents are the output.
