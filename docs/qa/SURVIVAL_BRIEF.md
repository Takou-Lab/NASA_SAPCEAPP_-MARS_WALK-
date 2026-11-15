# Mission objective, preparation and combined brief

Coordinator took over Emma Agent 1’s unclaimed survival-brief slice after the user said teammates had not resumed work. No Takou/Charles styling files were edited. New src/app/survival-brief is embedded as a collapsed disclosure inside the existing Route Planner survival time-budget card, keeping route controls and the map accessible.

## Implemented

- A free-text exploration objective, bounded to 1,000 characters.
- Four reversible, unchecked-by-default user declarations: life-support/supply limits reviewed, communications procedure agreed, return access/contingency identified, hazards/unknowns reviewed. These are declarations, not equipment telemetry, independent verification, or mission clearance.
- Reactive start/destination/waypoint and saved-observation summary; selected science source and position status. Removing a selected record yields an honest empty state.
- Explicit Save mission preparation, separate from route/notes and time assumptions. Image-specific key marswalk:preparation:v1:<imageRef>; automatic restoration on opening the planner. Invalid saved bytes are retained and protected from overwrite; failed storage retains entered state.
- Existing Download survival brief now combines objective, declarations, route, time scenario, selected scientific finding/source/limitations, actual saved observation text with timestamps/positions, image source/limits and snapshot timestamp. It is downloadable even when time estimates are unavailable, which is recorded explicitly. The TXT is not an importable mission JSON; Mission Transfer remains the route/notes interchange.

## Checks

274 Angular tests across 29 files; production build passes. New checks cover collapsed/unchecked defaults, true checkbox reversal, fresh-session objective/check restoration, invalid saved-record protection, blocked storage, selected-record removal, objective limits and exporting a draft with unavailable time estimates. Existing time/route/storage tests remain passing.

Real production browser at 390px with touch emulation: select a science record; enter an objective; check then uncheck life-support declaration; check communications and return plan; save preparation; draw real route and waypoint; calculate/download scenario; save a note; download a combined brief and assert exact objective, checked/unchecked declarations and observation text. Prepare full offline pack, terminate the browser, restart disconnected, open Planner: objective, both checkbox states, scenario assumptions and exact route/observations restore. No horizontal page overflow. Browser checks do not certify a physical phone or real expedition.

MissionService, mission JSON schema, scientific data, measured-terrain boundary and worker/build logic are unchanged. Existing shell stylesheet and Leaflet CommonJS warnings remain; budgets were not raised. Preparation is deliberately stored separately; save all edited sections and export mission JSON as well as the text brief before disconnecting.
