# Enzo — Final shell integration after functional corrections

## Latest reviewed delivery

**`feat/enzo-ui-planner-notebook`**, **`bcac915`**, is reviewed against main **`584f24b`**. **57 branch tests and production build pass**. Production browser checks confirm the real map, drawing/save/load/export, science selection, exact draft retention after normal/failed-save tab changes and viewport-aware sidebar resizing. [Full review](../reviews/ENZO.md).

The duplicate foundation, placeholder map, external font, draft-loss and resize defects are closed. Preserve your corrected UI and tests; do not repeat those tasks or start a new project.

## Current task — final reconciliation with published main

Stay on the **same feature branch**. Your revision merged main through `f65778d`; current main adds mission import, accepted navigation and Emma's mounted science component. A merge preview has **four root conflicts**: `src/app/app.ts`, `app.html`, `app.scss`, `app.spec.ts`.

1. Preserve local/unpushed work; fetch/merge latest main without reset/force push. Keep main core/models/validation/persistence, imageRef/assets, package/lockfile and accepted tests. Your shell/planner/notebook/theme stay intact.
2. Resolve root assembly with one `MissionService.initialize()` and one real map. Preserve Reset View/Focus Route and map image-readiness behavior. Do not restore the old root template or duplicate the map.
3. Preserve accessible mission JSON import/export, 1 MiB limit, async file-read guard, replacement warning and real operation feedback. Use current `MissionService.importMission(raw)`; no new storage layer or permissive parser. Make transfer reachable in your shell without discarding current functionality.
4. Replace the interim science list/details in your confidence section with accepted **ScienceContextComponent** (`app-science-context`) exactly once. Use main's component rather than copying/rebuilding it; adapt mocks/tests to its existing service signals. Selection must preserve route/mode/notes/image.
5. Emma now owns future `src/app/evidence/` read-only confidence/image-passport presentation and science discovery. Those future components are not implemented yet. Preserve your truthful current assessment/provenance until reviewed replacements exist, then integrate them; do not duplicate that future implementation or edit Emma's files.
6. Disable/label the unsupported grid control as unavailable. Replace the notebook placeholder's guessed `15m NW` example with neutral descriptive text. Do not change shared models or manufacture measurements.
7. Run the complete reconciled tests/build and production browser mission workflow. Retain current root import/science regressions and your working draft/resize checks. Review warning sizes without raising budgets.

## Ownership and evidence

Own `src/app/ui/`, planner and notebook, with the existing narrow root TS/HTML/SCSS/spec integration exception. No shared-core/source/dependency/worker changes are assigned. Keep the theme under UI. Root layout/content projection choices may be made within this scope as long as the working map/science/transfer and single initialization are preserved.

The submitted production bundle is 547.84 kB, and four component styles exceed warning limits while staying below error limits. Reduce duplication/avoidable styling as practical, not by changing budgets or removing necessary behavior. System/local fonts and Leaflet CSS must stay.

Verify actual map clicks for start/waypoint/destination; undo/clear/save/load; all three unlocated science records; note creation and save failure; draft across tabs; mission export/import and mismatched-file rejection; tablet keyboard/pointer/restored panel size. Report actual tested commit/browser, outcomes, warnings and remaining blockers. Installed PWA/offline reopening is still separate coordinator/device work.

## Completion and next review

Commit/push only **`feat/enzo-ui-planner-notebook`**; that correction push is authorized. Hand off commit, four root conflict resolutions, retained capabilities and actual integrated checks. No new branch/task until this final integration passes. No main merge/push, deployment, environment publication, submission or external messaging is included.

## Copy-paste coding-agent prompt

```text
You are Enzo's final MARSWALK shell-integration agent.
Read docs/team/ENZO.md, docs/reviews/ENZO.md, docs/team/CODING_AGENTS.md,
SOUL.MD and NEXT_TASKS.md. Continue feat/enzo-ui-planner-notebook.

bcac915 passes 57 branch tests/build and actual production mission checks.
The old duplicate-core, placeholder, font, draft and resize defects are
closed. Preserve your UI and tests; do not restart or repeat them.

1. Preserve local work; merge latest main without reset/force push. Resolve
   FOUR root conflicts: app.ts/html/scss/spec.ts. Keep canonical current core,
   validation/storage, package/lock/data and every accepted regression.
2. Keep one initialize and one actual map with accepted navigation/readiness.
   Preserve reachable mission import/export UI: 1 MiB limit, async selection
   guard, replacement warning and actual importMission results. No new store.
3. Use reviewed main ScienceContextComponent (app-science-context) exactly
   once instead of your interim science list/details. Keep unlocated records
   accessible without changing route/mode/notes/image; adapt child test mocks.
4. Emma owns future science discovery and evidence/confidence/image-passport
   presentation. Don't implement duplicates or import those future files
   before review. Keep current truthful warning/provenance behavior meanwhile.
5. Mark unsupported grid unavailable; replace guessed 15m NW notebook example
   with neutral descriptive text. No fabricated locations/scale/terrain.
6. Preserve draft and responsive-sidebar fixes. Run all reconciled tests,
   production build and real map/science/note/save-load/export-import/failure
   checks. Keep root import/science regressions and report actual outcomes.
   Do not raise budgets; note/reduce avoidable warning sizes as practical.

Own UI/planner/notebook plus narrow root integration only. No core, source,
dependency or PWA-worker rewrite. Commit/push only this same feature branch
(authorized), report commit/conflicts/checks/limits and request re-review.
No new task branch, main integration, deployment, publication or messaging.
```
