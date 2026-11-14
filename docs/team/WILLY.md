# Willy — Angular Map Developer

## Your mission

Build the interactive Mars map used to inspect imagery, select science targets and draw a proposed route. You own the map role after the Willy/Gaddielle swap. Use Angular and TypeScript.

Read [the team allocation](../../TEAM_TASKS.md) first. At the time these briefs were written, this repository contained documentation only. Paths below are proposed ownership areas, not existing implementation claims. Inspect the actual code before starting; reuse existing components if the app has since been added.

## Deliverables and ownership

- One map component, proposed under `src/app/map/`.
- Imagery display with loading, unavailable-data and error states.
- Layer visibility and route rendering connected to shared mission state.
- Clickable science markers showing Emma's verified provenance.
- Map event outputs for Enzo's start, destination and waypoint controls.

The coordinator owns shared models and state. Gaddielle owns data preparation. Do not independently change coordinate contracts or scientific metadata.

## Work in this order

1. Read the active Angular manifest and map code. Confirm the map library with the coordinator; preserve a working choice.
2. Agree on a single coordinate system with Gaddielle. Record bounds, coordinate order, orientation and image reference.
3. Create the map after its Angular container exists. Give the container an explicit height.
4. Load one verified image or usable Mars layer. Show its source and coverage limitations. A temporary fixture must be labeled as a demonstration.
5. Emit map clicks in the agreed coordinate format. Connect them to the current interaction mode instead of modifying another component directly.
6. Render the shared start, destination, ordered waypoints and route line.
7. Add science markers and toggles. Render external descriptions as text, not untrusted HTML.
8. Handle resize and cleanup: dispose of the map, event subscriptions and observers when the component is destroyed.

## Integration contract

- Ask the coordinator for shared point, route, marker and layer models before integration.
- For image pixels, do not assume north-up, meters or longitude/latitude. Leaflet image coordinates may need `[y, x]` conversion at the map boundary.
- For geographic data, check the Mars projection and longitude convention before rendering.
- Consume shared state and emit actions. Avoid a second route store inside the map.
- Give Enzo a short list of supported actions and map events; give Longla the same route/image reference used by the map.

## Checks before handoff

- The image fits its documented bounds and stays aligned when zooming or resizing.
- Start, destination and waypoints appear in the correct order.
- Switching inspect/draw modes does not leave unwanted click handlers active.
- A marker displays the correct source, instrument, date and position status.
- Layers toggle independently; missing products show an unavailable state.
- Reopening the component does not create duplicate maps or listeners.
- Run the repository's actual Angular build and relevant tests once those scripts exist.

## Fallback and completion

If online tiles are unavailable, use a verified local image with documented limitations. Do not invent georeferencing. Your part is complete when another teammate can select a target, draw a route and read a marker's sourced details on the integrated map.

## Learning and handoff

Be able to explain Angular component lifecycle, map events and coordinate conversion. Start with one image, then one click, then one route. Hand off changed files, commands run, a short interaction demo and remaining limitations. Tell the coordinator promptly if data or shared APIs block you.

## Copy-paste coding-agent prompt

Paste the following into your coding-agent session when starting your assigned work. Read the [shared contract](CODING_AGENTS.md) with it.

```text
You are Willy's coding tutor and implementation agent for MARSWALK.
Read docs/team/WILLY.md, docs/team/CODING_AGENTS.md and TEAM_TASKS.md.
Your role is Angular map development; Gaddielle owns data preparation.

1. Inspect Git status, the actual Angular files and package scripts. Do not
   assume the application or MissionService exists. If absent, report the
   coordinator dependency and do not generate a competing app or service.
2. Own src/app/map/map.component.ts, .html and .scss plus relevant map tests.
   Use a standalone MapComponent and inject the agreed MissionService.
   Ask the coordinator to add Leaflet and its TypeScript declarations if absent.
3. Initialize Leaflet CRS.Simple after the container exists. Read width,
   height and local assetPath from image(). Use bottom-left image pixels,
   bounds [[0,0],[height,width]], and [y,x] at the Leaflet boundary only.
4. Fit bounds when the active image reference changes. Show loading/error/
   unavailable states. Never attach fabricated geographic coordinates.
5. Use a rendering effect for route(), layers(), markers() and selection.
   Reuse/remove layers instead of rebuilding the map on every click.
   A map click calls applyMapPoint({x: lng, y: lat}); mode rules belong to
   MissionService. Clicking a marker calls selectMarker(id) without also
   adding a route point. Hide markers without a display position.
6. Draw route points in agreed order. Label illustrative marker positions.
   Display provenance using Angular text bindings; avoid raw popup HTML
   built from downloaded descriptions. Do not implement distance here.
7. Handle container resizing and dispose of Leaflet, event handlers and
   observers on destruction. Avoid browser-only work before the view exists.
8. Verify image bounds, click conversion, all route modes, layer toggles,
   marker selection, resize and teardown. Run actual build/relevant tests.

Keep shared APIs, package files and unrelated features with the coordinator.
Start with one image and one click, then integrate the route. Follow the
learner checkpoint in CODING_AGENTS.md. Report changed files, checks and
remaining data/API dependencies. Do not push or merge without authorization.
```
