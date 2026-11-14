# Willy — Angular Map Developer

## Current priority — the offline exploration workspace

Read [SOUL.MD](../../SOUL.MD), [the team allocation](../../TEAM_TASKS.md) and [the shared coding contract](CODING_AGENTS.md). MARSWALK is an installable Angular PWA for mission rehearsal, science learning and analogue-workflow research. The map is part of one complete mission: inspect imagery and evidence, sketch a route, understand uncertainty, save a note, reopen offline and export.

The Angular foundation, shared models, MissionService, Leaflet and its declarations are already on `main`. Reuse them; do not create another app or state store. Gaddielle's real regional imagery and manifest are on her data branch pending integration. Inspect actual files and branch status before starting. You own map development after the Willy/Gaddielle swap.

## Deliverables and ownership

- A standalone map component under `src/app/map/`, with relevant map tests.
- Local imagery, pan/zoom, layer visibility, route rendering and selection events.
- Loading, missing-data, image-load and dimension-mismatch states.
- Clear regional-context and pixel-coordinate limitations.

The coordinator owns root assembly, core state, package files, service-worker caching and PWA installation. Enzo owns panels and controls; Gaddielle owns image preparation; Emmanuelle owns scientific evidence. Coordinate shared API changes instead of editing their work independently.

## Work in this order

1. Inspect the actual Angular files and the implemented MissionService API. Read [the image handoff](../data/IMAGE_CONTRACT.md) and [foundation handoff](WILLY_HANDOFF.md).
2. Create the Leaflet map after its container exists. Give the container an explicit height and use `CRS.Simple`.
3. Load `image().assetPath` relative to the application base, not the domain root. Confirm image decoding and natural width/height against the active manifest before presenting it as loaded.
4. Fit bounds when the image reference changes. Show honest loading/unavailable/error feedback and distinguish valid metadata from a successfully decoded image.
5. Convert map clicks into shared actions using the agreed pixel contract. Route rules belong to MissionService.
6. Render start, ordered waypoints and destination from shared route state. Update existing layers rather than reconstructing the map on every interaction.
7. Render only science markers with a position on the active image. Keep null-position records available through Enzo's science list, without assigning them invented coordinates.
8. Implement layer toggles, resize handling and complete destruction cleanup. Keep the map independent of live tile services so prepared local imagery can work offline.

## Coordinate and evidence contract

- Image origin: bottom-left; x increases right and y increases up.
- Bounds: `[[0, 0], [height, width]]`; convert `{x, y}` to Leaflet `[y, x]` only at the map boundary.
- Click conversion: `applyMapPoint({ x: event.latlng.lng, y: event.latlng.lat })`.
- Pixels are not longitude/latitude or meters. Do not assume north-up or attach a metric scale bar to uncalibrated imagery.
- A route is a visual sketch. Distance/calibration assessment belongs to core state; never calculate a separate map safety score.
- Current data is regional context; exact exploration-area coverage, calibration and terrain may remain unverified/unavailable.
- Clicking a located marker calls `selectMarker(id)` without also adding a route point. Label illustrative positions when any are explicitly supplied.
- Show descriptions through Angular text bindings; do not construct raw popup HTML from external content.

## Acceptance checks

- The prepared image matches its manifest dimensions and all four image corners align with the documented bounds.
- Failed image loads and incorrect dimensions show an error rather than a misleading blank or apparently ready map.
- Inspect/start/destination/waypoint modes affect shared state correctly; route ordering, undo and clear remain consistent.
- Null-position science records never appear at a guessed location. Their absence on the map does not remove their list entries.
- Layers toggle independently. Keyboard-accessible controls are coordinated with Enzo.
- Tablet resizing and repeated opening do not create duplicate maps, listeners or observers.
- Once coordinator-owned caching is integrated, close and reopen the installed PWA offline and repeat image viewing and route editing. Report pending offline verification until it is actually tested.
- Run `npm test`, `npm run build` and relevant existing checks. Record actual commands and outcomes.

## Learning and handoff

Start with one image and one click, then one route. Explain Angular lifecycle, coordinate conversion and map events. Follow the learner checkpoint in the shared contract. Hand off files, supported actions/events, an interaction demo and remaining limitations to the coordinator. Support the team's three outside-user checks by showing whether users can sketch a route and understand that its distance/slope may be unknown; never claim tests that were not run.

## Copy-paste coding-agent prompt

```text
You are Willy's coding tutor and implementation agent for MARSWALK.
Read SOUL.MD, TEAM_TASKS.md, docs/team/WILLY.md,
docs/team/CODING_AGENTS.md, docs/data/IMAGE_CONTRACT.md and
docs/team/WILLY_HANDOFF.md.

Your task is the local-image map for a tablet-first, installable Angular
PWA used for mission rehearsal and science learning. The Angular foundation,
MissionService, Leaflet and declarations already exist on main. Inspect
actual Git status/files and preserve work. Do not recreate the app.

1. Own src/app/map/ and relevant map tests. Implement a standalone
   MapComponent using inject(MissionService). Keep core/root/package/PWA
   changes with the coordinator; panels belong to Enzo.
2. Use Leaflet CRS.Simple after the view container exists. Load the real
   regional image when Gaddielle's data is integrated. If absent, show
   unavailable data; only use clearly synthetic fixtures in tests.
3. Resolve assetPath with new URL(manifest.assetPath, document.baseURI).
   Check actual image loading and natural dimensions against the manifest.
   Show failures or mismatches. Valid metadata alone is not a loaded image.
4. Use bottom-left image pixels, bounds [[0,0],[height,width]] and [y,x]
   at the Leaflet boundary. Emit applyMapPoint({x: lng, y: lat}). The shared
   service owns route modes, point validation and undo. Never assume metric
   scale, north-up or geographic coordinates.
5. Render shared route() in start/ordered-waypoints/destination order.
   Use effects for layers(), markers() and selection; reuse/remove layers
   without rebuilding the map on each click.
6. Do not position records with position:null. Enzo exposes those through
   a science list. A marker click selects without adding a route point.
   Label illustrative positions and render sourced text safely.
7. Show regional-context limits and support honest uncertainty. Do not add
   a metric scale bar, safety score or terrain inference from image pixels.
8. Handle resize and dispose map/listeners/observers on destruction.
   Keep runtime imagery local and compatible with the coordinator's cache;
   do not implement your own service worker or depend on live tiles.
9. Verify bounds, bad image/dimensions, modes, route rendering, null marker
   handling, resize and teardown. Run actual tests/build. After the PWA
   cache is integrated, verify reopening and route editing offline; do not
   report this before it works. Support the team's outside-user checks.

Follow the learner checkpoint in CODING_AGENTS.md. Report changed files,
commands/outcomes, one acceptance scenario and remaining dependencies.
Do not push, merge or deploy without the user's authorization.
```
