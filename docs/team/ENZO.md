# Enzo — Angular Interface, Route Controls and Notebook

## Your mission

Build the tablet-friendly interface that connects the map, route planning, data sources and local observation notebook. Use Angular and TypeScript, keeping the mission flow understandable.

Read [the team allocation](../../TEAM_TASKS.md). The repository contained documentation only when these briefs were written. Proposed paths are ownership suggestions; inspect the actual app before adding or moving components.

## Deliverables and ownership

- Layout and interface components, proposed under `src/app/ui/` and `src/app/planner/`.
- Start, destination and waypoint controls, undo and clear actions.
- Source/coverage display using Emma and Gaddielle's metadata.
- Notebook form and observation list, proposed under `src/app/notebook/`.
- Local route/note persistence connected to coordinator-owned contracts.

Willy owns map rendering and click events. The coordinator owns mission state, assessment rules and export. Avoid creating competing stores in individual components.

## Work in this order

1. Inspect the current Angular shell and agree on shared actions and models with the coordinator.
2. Build a responsive layout: map as the main workspace, readable side panel and comfortably sized controls.
3. Add explicit inspect/start/destination/waypoint modes. Show which mode is active.
4. Connect map clicks through shared actions. Route order is start, ordered waypoints, destination.
5. Add undo and clear; make disabled states and empty-route messages clear.
6. Display the coordinator's route assessment. Show distance as unavailable when verified calibration is missing.
7. Add sources and coverage details without hiding missing-data messages.
8. Add a notebook form, save status and saved-note list. Connect note positions to the same image/data reference used by the route.
9. Add save/load controls using validated shared persistence helpers and connect mission export.

## Persistence requirements

- Coordinate schema version and image reference with the coordinator.
- Validate loaded records; handle corrupt or outdated saved data without crashing.
- Catch storage failures and keep unsaved note text visible.
- Render note content as plain text.
- Explain that browser records depend on origin; a different host/port may show different records.
- Do not silently reuse positions after the image or coordinate system changes.

## Checks before handoff

- Complete start → waypoint → destination using the integrated map.
- Undo and clear produce the expected shared route state.
- Controls work by keyboard and have labels and visible focus states.
- The layout remains usable on a tablet-sized viewport without covering essential map controls.
- Saving/reloading restores valid notes and routes for the same data reference.
- Missing calibration shows unavailable distance, not a fabricated number.
- Invalid stored JSON and storage failure produce understandable feedback; typed text survives a failed save.
- Source links and verification labels match the supplied records.
- Run actual project build and relevant tests once available.

## Fallback and completion

Prioritize route controls and a plain text notebook over decorative UI. Your part is complete when a user can draw/edit a proposed route, understand its assessment limits and save an observation. Hand off files, shared actions, interaction checks, persistence behavior and remaining issues.

## Learning focus

Be able to explain Angular binding, form validation and the path from a button click to shared state to map rendering. Build and explain one small interaction at a time.

## Copy-paste coding-agent prompt

Paste the following into your coding-agent session when starting your assigned work. Read the [shared contract](CODING_AGENTS.md) with it.

```text
You are Enzo's coding tutor and implementation agent for MARSWALK.
Read docs/team/ENZO.md, docs/team/CODING_AGENTS.md and TEAM_TASKS.md.
Own the Angular interface, route controls and notebook; Willy owns the map.

1. Inspect the real checkout and scripts. If Angular or the agreed core API
   is absent, report that dependency; do not scaffold another application.
2. Implement standalone components under src/app/ui/, src/app/planner/
   and src/app/notebook/. Use Angular forms and plain CSS/SCSS. Coordinate
   exported component selectors with the coordinator for root assembly.
3. Inject MissionService. Bind the active mode to inspect/start/destination/
   waypoint controls via setMode(). Layer checkboxes call setLayer().
   Undo uses canUndo()/undoRoute(); clear calls clearRoute(). Do not edit
   Leaflet objects or maintain another route array in a UI component.
4. Display assessment().planarDistanceMeters only when available and mark
   it as derived planar distance. Otherwise show Distance unavailable.
   Always display missing-data warnings. Never add a SAFE badge.
5. Call saveRoute()/loadRoute() and show their returned success/error.
   Show selected marker details from markers()/selectedMarkerId(), including
   position status, source, instrument, date and limitations.
6. Build an accessible notebook form. Keep draft text in the component;
   call addObservation(text, null) for an unlocated note. Do not infer a
   location from a selected target. Clear draft only after success.
   Show validation/storage feedback and render saved text with interpolation.
7. Connect export to exportMission(). Show source/coverage details from
   supplied models. Do not add independent localStorage calls.
8. Test mode changes, undo/clear, missing distance, note validation, failed
   storage feedback with retained draft, source display and keyboard use.
   Verify tablet layout and run the actual build/relevant tests.

Coordinate shared API changes with the coordinator. Follow the learner
checkpoint in CODING_AGENTS.md. Report files, checks, UI states and remaining
integration needs. Do not push or merge without authorization.
```
