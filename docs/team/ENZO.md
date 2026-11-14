# Enzo — Angular Interface, Route Controls and Notebook

**Continue existing work:** preserve your current branch and completed results. Finish or hand off the small slice already underway; apply newly added charter tasks afterward. Do not restart the earlier assignment. See [the transition rule](../../SOUL.MD#apply-this-charter-without-restarting-work).

## Current priority — one understandable PWA mission

Read [SOUL.MD](../../SOUL.MD), [the team allocation](../../TEAM_TASKS.md) and [the shared coding contract](CODING_AGENTS.md). Build the tablet workspace for mission rehearsal, science learning and analogue-workflow research. The complete mission is imagery → science context → route sketch → uncertainty → saved observation → offline reopening → export.

The Angular foundation and MissionService are implemented on `main`; inspect the current app and reuse them. Installation and offline caching are still coordinator-owned work. Gaddielle's imagery and Emma's records are now integrated with Willy's mounted map. Reuse them; all science positions remain unavailable, so the contextual list must work without map pins.

## Deliverables and ownership

- Standalone layout/interface components under `src/app/ui/`.
- Route and mission controls under `src/app/planner/`.
- Notebook form and observation list under `src/app/notebook/`.
- A readable Exploration Confidence Panel and Data Passport view.
- Science context accessible as a list even when positions are unavailable.
- Interface states for installation and verified offline preparation once the coordinator supplies their integration contract.

Willy owns map rendering and map clicks. The coordinator owns shared state, persistence/export implementation, root assembly, package/config files and PWA lifecycle. Gaddielle and Emma own the evidence content. Do not create a second mission store, storage layer or service worker.

## Work in this order

1. Inspect the existing shell, models and actual MissionService methods. Coordinate component selectors with the coordinator for root assembly.
2. Build a responsive tablet-first layout with the map as the main workspace, readable side panels and large controls. Support keyboard focus and accessible labels.
3. Add inspect/start/destination/waypoint modes through `setMode()`, and layer controls through `setLayer()`. Display the active interaction mode.
4. Connect undo/clear, save/load and mission export to service methods. Show their real outcomes, not optimistic success badges.
5. Build the signature Exploration Confidence Panel from actual shared assessment state. Show available imagery, missing metric calibration, absent terrain and unverified location/coverage clearly. No numeric confidence score or SAFE label.
6. Show science records as a list/card view. A null-position record may be inspected but must not imply a located map target or silently set a route destination.
7. Add the notebook using shared persistence. Keep drafts after failed saves; render saved text as text. Do not infer observation position from the selected science record.
8. Build a Data Passport from supplied evidence: source/credit, observation date when known, image reference/dimensions, coverage, calibration and limitations. Surface verified processing/resolution information only when the coordinator-approved data supplies it; otherwise show unavailable or link to documented provenance. Do not invent model fields or infer georeferencing.
9. Integrate install guidance and distinct connectivity/offline-pack states after the coordinator defines the API. Until then, show offline preparation as not implemented/prepared; do not invent an offline signal or mark ready from `navigator.onLine`.

## PWA interaction requirements

- Installation availability varies by platform. Use the coordinator's actual install integration, or accurate browser-specific manual guidance when supplied; never show a fake successful install state.
- Connectivity and offline readiness are separate. A disconnected device may have a prepared pack; a connected device may have no verified pack.
- Readiness, update status, size and preparation progress must come from real coordinator-owned state, not fabricated percentages or timers.
- Explain that external source links can need internet while bundled science text remains available offline.
- Keep the essential workflow usable in standalone display without browser navigation controls.

## Persistence requirements

- Use `saveRoute()`, `loadRoute()`, `addObservation()` and `exportMission()`; do not call localStorage independently.
- `loadRoute()` restores validated route/observations and resets undo history. Give clear feedback for missing, corrupt or mismatched records.
- Keep draft text in the component and clear it only after a successful save. Whitespace-only notes fail validation.
- Use `addObservation(text, null)` for an unlocated note. Changing the image reference must not silently reuse old positions.
- Explain browser/origin-local storage and let users export their work.

## Acceptance checks

- A user can inspect science, draw/edit a route, understand missing distance/slope, save/load a note and export mission JSON through the integrated interface.
- Unlocated science records remain readable and are not presented as verified route destinations.
- The Confidence Panel and Data Passport distinguish known evidence, interpretation and unavailable data.
- Invalid storage and failed saves produce feedback without losing typed text. Notes never execute HTML.
- Tablet layout, keyboard operation, labels and visible focus work throughout the mission.
- Install and offline status accurately reflect the coordinator's implemented behavior. After caching is integrated, close the installed PWA, disconnect, reopen, recover the mission and repeat the workflow.
- Run actual tests/build and relevant UI checks. Record unrun or pending installation/offline scenarios separately.

## Learning and handoff

Explain the flow from a button click to MissionService to map/UI rendering. Implement one small interaction at a time using the learner checkpoint. Hand off components, selectors, state dependencies, commands/outcomes and remaining integration needs. Support three outside users attempting route drawing, explaining whether distance/slope are known, and saving/recovering an observation; the coordinator collects actual results rather than invented usability claims.

## Copy-paste coding-agent prompt

```text
You are Enzo's coding tutor and implementation agent for the MARSWALK PWA.
Read SOUL.MD, TEAM_TASKS.md, docs/team/ENZO.md and
docs/team/CODING_AGENTS.md.

Build an understandable tablet-first mission-rehearsal/science-learning
workflow. The Angular foundation and MissionService already exist on main.
Inspect real files/Git status, preserve work and reuse them. Own only
src/app/ui/, src/app/planner/ and src/app/notebook/ with relevant tests.
The coordinator owns root assembly, core APIs, package/config and the PWA
worker/install implementation; Willy owns Leaflet.

1. Implement standalone components with plain CSS/SCSS and Angular forms.
   Coordinate selectors and shared changes with the coordinator.
2. Inject MissionService. Modes call setMode(), layers call setLayer(),
   undo uses canUndo()/undoRoute(), clear uses clearRoute(). Do not keep
   another route store or manipulate Leaflet from UI components.
3. Display actual assessment() and its warnings in Exploration Confidence.
   Show derived planar distance only when available. State unavailable
   distance, terrain/slope and unverified coverage honestly. Never add a
   safety badge, invented hazard data or confidence percentage.
4. Show science records as accessible list/cards, including null-position
   records. Select through selectMarker(); do not invent a location or
   turn an unlocated science selection into a route destination.
5. Add Data Passport details using actual supplied source/credit, date,
   imageRef/dimensions, coverage/calibration and limitations. Show verified
   processing/resolution only when approved metadata provides it; otherwise
   use unavailable/documented provenance. Do not invent runtime fields.
6. Wire saveRoute()/loadRoute() outcomes and exportMission(). Add notebook
   draft text and call addObservation(text, null) for unlocated notes.
   Clear draft only after success. Preserve it on storage failure and
   render all saved text through interpolation. No independent localStorage.
7. Design distinct connectivity, install availability and offline-pack
   states. Integrate only the coordinator's actual forthcoming API; until
   then display not prepared/not implemented. Never infer offline readiness
   from connectivity, worker registration or simulated progress. Support
   standalone navigation and accurate platform install guidance.
8. Verify the complete mission, null-position science, unavailable metrics,
   storage failure, retained draft, keyboard use and tablet sizing. Run
   actual tests/build. After coordinator integration, test installed-app
   offline reopening, mission recovery and export; mark pending until run.
9. Support three outside-user tasks: sketch a route, explain whether its
   distance/slope are known, and save/recover an observation. Record actual
   issues for the coordinator; never invent user test success.

Follow the learner checkpoint in CODING_AGENTS.md. Report files, selectors,
commands/outcomes, acceptance scenario and remaining dependencies.
Do not push, merge or deploy without the user's authorization.
```
