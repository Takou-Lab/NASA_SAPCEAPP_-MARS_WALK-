# Willy — Angular Map Developer

**Published review:** `094fce2` is accepted and already integrated into reviewed main `f24f6fc`; no unmerged Willy commit was present. See [REVIEW.md](../../REVIEW.md) and [NEXT_TASKS.md](../../NEXT_TASKS.md). The existing Reset View/Focus Route assignment below remains the next task, not a correction to the original delivery.

## Current follow-up — Reset View and Focus Route

Read [SOUL.MD](../../SOUL.MD), [the team allocation](../../TEAM_TASKS.md), [the shared coding contract](CODING_AGENTS.md) and [the image handoff](../data/IMAGE_CONTRACT.md). Preserve your completed map; this assignment adds a small navigation improvement rather than restarting development.

## Completed contribution and integration boundary

Your four map files are published on **`feature/willy-map-development`** at **`094fce2`**. They implement imagery, pan/zoom, route rendering/interactions, positioned science markers and layer controls. The coordinator has reviewed the component and integrated it with the root application and delivered data in this integration revision. Your earlier report of 26 passing tests/build is historical; report new results from the actual follow-up revision.

**Root mounting is coordinator work in this integration. Do not mount another MapComponent or repeat the root-mount assignment.** Publication of the integration to `main` must be confirmed before updating your branch from it. A local integration in progress is not a published GitHub revision.

Continue on your existing feature branch. Preserve local work; after the coordinator publishes the integration, fetch and merge the latest `origin/main` into your branch without a reset or force push. Retain the coordinator's readiness guard that prevents map clicks from changing the route before valid imagery is displayed. Do not replace the integrated map with an older copy of your files.

## New tasks in order

### 1. Inspect existing navigation

Check your current implementation and the integrated revision for equivalent controls first. Reuse already working Reset View or route-focus behavior instead of adding duplicate buttons. Own only these map files for this follow-up:

- `src/app/map/map.component.ts`
- `src/app/map/map.component.html`
- `src/app/map/map.component.scss`
- `src/app/map/map.component.spec.ts`

Root assembly, shared core, data files, package/configuration files and service-worker/PWA work stay with the coordinator. Enzo owns start/destination/waypoint controls, notebook and mission save/load UI.

### 2. Add Reset View where missing

- Provide a clearly labeled **Reset View** button inside the map component.
- Fit the active image bounds `[[0, 0], [height, width]]` with suitable viewport padding.
- Enable it only when the active image has successfully loaded and matched its manifest, and mission data is ready. Disable it for missing, loading or failed imagery.
- Change only the viewport. Preserve route, mode, observations, selected science record and layer visibility.

### 3. Add Focus Route where missing

- Provide a clearly labeled **Focus Route** button inside the map component.
- Read available points from the actual shared `route()` signal in start → ordered waypoints → destination order. The existing pure route helper may be reused; do not create another route store.
- Enable it only when valid imagery is displayed and at least two route points are available. Fewer than two points means disabled.
- Fit the route's image-pixel bounds using `[y, x]` conversion and suitable padding. Handle coincident points with an explicit maximum zoom cap so a zero-size route cannot produce excessive zoom.
- Keep this as a visual framing action. Do not mutate mission state, add automatic routing or infer route distance/safety.

### 4. Make both actions usable on tablet and keyboard

Use native buttons, readable names, visible focus and touch-friendly targets. Check layout on tablet and narrower screens; controls must not cover essential route feedback. They must work without browser navigation controls and remain local-only for eventual offline use.

Do not duplicate Enzo's route/notebook controls, add external tile services, invent metric scale or position null-location science records. Keep Leaflet `CRS.Simple`, the existing base-relative image path, image reference, dimension checks and teardown behavior.

## Acceptance checks

- Reset View fits the active image after a pan/zoom and is disabled before valid imagery is displayed.
- Focus Route is disabled with zero/one point, works with two or more available points, and respects the zoom cap for coincident points.
- Viewport actions preserve route, mode, observations, selected record and layer visibility.
- Both buttons work by keyboard and touch with visible focus; resizing leaves them usable.
- Existing image load/error/dimension, coordinate conversion, marker, readiness-click and cleanup checks still pass.
- Add focused map tests for only the new or missing behaviors. Use clearly synthetic fixtures in tests; never add fictional mission data to `public/data/`.
- Run `npm test` and `npm run build` and report actual current counts/outcomes. A historical 26-test result must not be copied as a new result.
- Check actual browser interactions where supported. Report blocked or unrun checks separately. Installation and offline reopening remain coordinator-owned acceptance checks; a unit/build pass does not prove those outcomes.

## Completion and handoff

Commit and push **only `feature/willy-map-development`**. This assignment authorizes that feature-branch push; do not push or merge into `main`, deploy, alter data products or send messages to others through tools without applicable authorization.

Give the coordinator:

1. Branch and pushed commit.
2. Changed map files and whether equivalent controls already existed.
3. Reset/focus behavior, disabled states and chosen coincident-point zoom cap.
4. Commands, actual test counts/build outcomes and browser/device checks.
5. Remaining defects or integration dependencies, with reproduction steps.

Follow learner checkpoints for the new navigation slice only. Do not repeat completed map lessons or claim understanding on the learner's behalf.

## Copy-paste coding-agent prompt

```text
You are Willy's coding tutor and map-navigation agent for MARSWALK.
Read SOUL.MD, TEAM_TASKS.md, docs/team/WILLY.md,
docs/team/CODING_AGENTS.md and docs/data/IMAGE_CONTRACT.md.

The original map is published at 094fce2 on feature/willy-map-development.
Preserve it. The coordinator has mounted the component and integrated
imagery/science; do not repeat root mounting or recreate the map/app.

1. Inspect Git status and existing controls. Preserve current work.
   After the coordinator confirms the integration is published to main,
   fetch and merge the latest origin/main into your same feature branch.
   Do not reset, force-push, replace integrated files with older copies or
   remove the readiness guard that blocks clicks before imagery is ready.
2. Own only src/app/map/map.component.ts/.html/.scss/.spec.ts for this task.
   Keep root, core, data, package and PWA changes with the coordinator.
   Reuse existing equivalent navigation; do not add duplicate controls.
3. Add Reset View if absent: fit the active image bounds with padding.
   Enable only with ready mission data and successfully displayed imagery;
   missing/loading/failed imagery disables the action.
4. Add Focus Route if absent: read the actual shared route() signal in
   start/ordered-waypoints/destination order. Enable only with ready imagery
   and at least two points. Fit pixel bounds using [y,x] conversion; apply
   an explicit maxZoom cap for coincident points. Reuse existing helpers.
5. Both actions change only the viewport. Preserve route, mode, observations,
   selected science record and layer visibility. Use labeled native buttons,
   visible keyboard focus and touch-friendly responsive layout.
6. Do not duplicate Enzo's route/notebook/save controls. Preserve CRS.Simple,
   base-relative local imagery, imageRef, load/dimension checks and cleanup.
   No external tiles, metric scale, invented positions, safety scores or
   independent service worker.
7. Add focused map tests for image-reset bounds, no-image/loading/error
   disabled states, route focus with zero/one/two points, coincident-point
   zoom cap and unchanged mission state. Keep readiness-click and other
   relevant existing regressions passing. Use synthetic fixtures only.
8. Run npm test and npm run build. Report actual counts/results and browser
   interaction checks where supported. Mark unrun/offline installation
   checks pending rather than treating a build pass as PWA verification.

Follow learner checkpoints only for this new slice. Commit and push only
feature/willy-map-development; the feature-branch push is authorized.
Handoff branch/commit, files, behavior/zoom cap, commands/results, browser
checks and remaining blockers. No main merge/push, deployment or messaging
without applicable authorization.
```
