# Willy — Angular Map Developer

## Current follow-up — publish, integrate and improve map navigation

Read [SOUL.MD](../../SOUL.MD), [the team allocation](../../TEAM_TASKS.md), [the shared coding contract](CODING_AGENTS.md) and [the image handoff](../data/IMAGE_CONTRACT.md). Preserve the map you already built; this assignment does not restart development.

### Previous work reported complete

You reported four files under `src/app/map/`: `map.component.ts`, `map.component.html`, `map.component.scss` and `map.component.spec.ts`. The report includes imagery, pan/zoom, route interactions/rendering, science-marker support and layer controls, with **26 tests and a production build passing**.

Those are your reported results. At the last remote check, `feature/willy-map-development` was not available in the selected GitHub repository, so the coordinator has not independently reviewed the source or reproduced those results. Publishing the existing branch is the first handoff step; do not regenerate the app or replace your completed map.

## New tasks in order

### 1. Publish the existing map branch

1. Inspect local Git status and preserve all current work.
2. Verify that `origin` points to `boscopatrick907-coder/NASA_SAPCEAPP_-MARS_WALK-`. If it points elsewhere, resolve the intended destination with the coordinator before pushing; do not silently rewrite an unrelated remote.
3. Commit any intended map changes still local, then publish the existing branch normally:

   ```sh
   git push -u origin feature/willy-map-development
   ```

4. Report the pushed commit and branch. Use no force push, reset, replacement project or duplicate feature branch. If the push is rejected, inspect the remote changes and preserve both contributions before resolving it.

### 2. Mount the existing map in the Angular root

For this task, you have a **narrow root-integration exception** in addition to ownership of `src/app/map/`:

- `src/app/app.ts`: import your existing standalone `MapComponent` and add it to the root component imports.
- `src/app/app.html`: mount its **actual declared selector exactly once** in the main workspace, preserving existing data-status and confidence content.
- `src/app/app.scss`: only the container sizing/layout needed to keep the map visible and responsive.
- `src/app/app.spec.ts`: verify the mounted component and honest missing-data shell, using the project's existing test approach.

Inspect your implementation and the latest root files before editing. Keep this integration change small. The coordinator retains ownership of core state, package/configuration files, PWA lifecycle and unrelated root behavior. Do not change shared APIs, copy another person's data files or add a second initialization/store. The root already calls `MissionService.initialize()` once.

Coordinate use of Gaddielle's prepared image and Emma's records with the coordinator's data integration. Missing data must show a usable unavailable/error state; a null-position science record remains available through Enzo's list without an invented map location.

### 3. Add map navigation polish where missing

Inspect existing controls first and reuse any equivalent behavior already implemented:

- **Reset View:** fit the active image bounds after panning or zooming away.
- **Focus Route:** fit the available ordered route points when at least two points exist. Disable the action when fewer than two points are available. Handle coincident points without excessive zoom.
- Use keyboard-accessible, clearly labeled buttons with touch-friendly targets inside the map component.
- These actions change only the viewport. They must preserve the route, interaction mode, observations and selected science record.
- Do not duplicate Enzo's start/destination/waypoint, notebook or mission save/load controls.

Keep Leaflet `CRS.Simple`, local imagery and the agreed image reference. Do not add external tiles, a metric scale bar, automatic routing or safety classifications.

## Ownership and interfaces

Own `src/app/map/` and relevant map tests, plus the limited root files above solely for mounting/sizing/testing the map. All other root behavior, `src/app/core/`, package files, data integration and installation/service-worker work remain with the coordinator. Enzo owns panels and route/notebook controls; Gaddielle owns imagery preparation; Emma owns science evidence.

Use the existing `MissionService` readonly signals and actions. Map points are bottom-left image pixels: x increases right, y increases up; bounds are `[[0, 0], [height, width]]`. Convert `{x, y}` ↔ Leaflet `[y, x]` only at the map boundary. Pixels do not establish meters, north-up orientation or geographic coordinates.

Runtime imagery must load relative to the application base. Check image decoding and natural dimensions against the manifest; valid metadata alone does not mean an image has loaded. Maintain regional-context and unavailable-calibration/terrain messages. Render only markers with a supplied position and matching image reference; never position records whose position is null.

## Acceptance checks for this follow-up

- The remote branch exists at the reported commit and contains the completed map files.
- The Angular root mounts one instance of the actual `MapComponent`; missing imagery does not crash the shell.
- Reset View fits the image and Focus Route fits the available route; disabled/no-image states work.
- Viewport actions leave route, mode, selected record and observations unchanged.
- Buttons work by keyboard and touch; resizing leaves the map usable.
- Relevant existing checks still cover bad/missing imagery, dimension mismatches, route modes, null-position markers and cleanup. Add only missing regression coverage for the new integration/navigation behavior.
- Run `npm test` and `npm run build`; report actual current counts and outcomes rather than copying the earlier 26-test result.
- Run a browser interaction check where the environment supports it. Report unrun or blocked checks separately.
- Installed/offline PWA behavior remains pending until the coordinator's caching/install work is integrated and tested on the target device. Tests/build alone do not establish that outcome.

Use clearly synthetic fixtures in tests only, never fabricated mission data in `public/data/`. Preserve the real derivative and its `imageRef`; your task does not require replacing the image.

## Completion and handoff

Commit and push only `feature/willy-map-development`, then give the coordinator the commit, root mounting changes, navigation behavior, test results and remaining integration dependencies. This assignment authorizes your own feature-branch push; do not merge/push `main`, deploy or contact teammates through tools without applicable authorization.

Follow the learner checkpoint for new substantive work. Explain one integration or viewport change at a time; do not repeat completed map lessons or claim the learner's understanding on their behalf.

## Copy-paste coding-agent prompt

```text
You are Willy's coding tutor and map-integration agent for MARSWALK.
Read SOUL.MD, TEAM_TASKS.md, docs/team/WILLY.md,
docs/team/CODING_AGENTS.md and docs/data/IMAGE_CONTRACT.md.

Willy reports the four map files completed, 26 tests passing and production
build passing. Preserve that work; do not rebuild the map or Angular app.
At the last remote check feature/willy-map-development was not available,
so those results have not yet been independently reproduced.

1. Inspect local Git status and completed map implementation. Verify origin
   is boscopatrick907-coder/NASA_SAPCEAPP_-MARS_WALK-. Preserve current work.
   Commit intended local changes, then publish the existing branch with:
   git push -u origin feature/willy-map-development
   No force push, reset, duplicate branch or silent unrelated-remote change.
2. Continue on that same branch. Inspect latest root files and the map's
   actual selector before integrating. Your narrow root exception permits
   src/app/app.ts/.html/.scss/.spec.ts only to import the standalone
   MapComponent, mount it once, size its container and test root mounting.
   Preserve existing status/confidence content. Keep core, unrelated root,
   package/PWA/config and data-file changes with their owners.
3. Reuse existing MissionService; root initializes it once. Missing image
   data must not crash the shell. Coordinate real asset/record integration
   with the coordinator; do not fabricate public/data fixtures or position
   Emma's unlocated records.
4. Inspect existing map navigation first. Add only missing equivalents of
   Reset View (fit image) and Focus Route (fit ordered shared route points,
   enabled only with at least two points; handle coincident points safely).
   Provide labeled keyboard/touch-friendly map-owned buttons. Viewport
   actions must not mutate route, mode, selected record or observations.
   Do not duplicate Enzo's route/notebook controls.
5. Preserve CRS.Simple, bottom-left pixels and [y,x] boundary conversion.
   Keep imagery local/base-relative; validate load and natural dimensions.
   No metric scale, invented coordinates, external tiles or safety score.
6. Add meaningful regression checks for root mounting, navigation enabled/
   disabled behavior and unchanged mission state. Keep existing relevant
   image-failure/dimension/mode/cleanup tests working. Use synthetic test
   fixtures only. Run npm test and npm run build and report actual counts.
7. Check browser interactions when available. Mark unavailable checks and
   installed/offline PWA verification pending until actually tested with
   the coordinator's implementation. A build/test pass is not PWA proof.

Follow learner checkpoints only for new work. Commit and push your own
feature/willy-map-development branch; that push is authorized here.
Report commit, changed files, checks, mounting selector and dependencies.
No main merge/push, deployment or messaging without applicable authority.
```
