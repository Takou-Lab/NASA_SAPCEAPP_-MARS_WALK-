# MARSWALK — Team Tasks

Framework: **Angular and TypeScript**. Region: **Mount Sharp boxwork formations, Gale Crater, Mars**; exact area of interest still needs verification.

This allocation follows the supplied Full Team Plan, with **Willy and Gaddielle (Gaddiel/Daddiel) swapped**. Team names follow the latest project context: Longla takes the 3D role listed as Royce in the PDF, and YOU denotes the coordinator role listed as Dinang. This is a task plan, not a claim that features or datasets already exist.

## Task overview

| Person | Responsibility | Deliverable |
| --- | --- | --- |
| Willy | Angular map and map interactions | Map with layer toggles and clickable sourced markers |
| Gaddielle | Imagery and terrain data | Verified data files and documented coverage, coordinates and limitations |
| Emma | Science, provenance and presentation | Three verified observations, references and submission text |
| Enzo | Interface, route drawing and notebook | Tablet layout, drawable route and locally saved observations |
| Longla | 3D rehearsal and optional VR | Labeled prototype showing the route and markers |
| YOU — coordinator | Integration, assessment and offline operation | Integrated mission flow, confidence panel and tested offline pack |

## Willy — Angular map

- Build one map component and coordinate its events with Enzo's route controls.
- Load a verified Mars Trek layer if usable; integrate Gaddielle's prepared imagery when available.
- Add layer toggles and Emma's sourced science markers.
- Show source, instrument, date and location limitations when a marker is selected.
- Initialize the map after its container exists and clean it up when the component is destroyed.

**Done when:** the map displays the available imagery, layers can be toggled, and a marker opens its sourced details.

## Gaddielle — Imagery and terrain data

- Verify the selected boxwork area against actual NASA coverage and rover-location evidence.
- Inspect Mars Trek imagery and elevation coverage; give Willy usable layer details.
- Open one real image and, if available, one terrain product covering the area.
- Check coordinate conventions, alignment, units, resolution and NoData before integration.
- Record product IDs, source links, coverage, date, format, processing and gaps.
- Supply verified files and metadata to Willy and Longla.
- Time-box the terrain search to one hour; report unavailable terrain so the coordinator can use the visual-review fallback.

**Done when:** imagery and its limitations are documented, and terrain is either verified and aligned or explicitly recorded as unavailable.

## Emma — Science and references

- Check whether a suitable USGS geological map covers the chosen area and document its scale and legend.
- Collect three real Curiosity observations with instrument, date, finding and primary source.
- Supply coordinates only when verified; otherwise label positions as illustrative or unavailable.
- Maintain the data/library references and AI-use record.
- Draft the English project summary and presentation text; verify current official submission requirements separately.

**Done when:** three sourced observations, geological coverage information and the references list are ready.

## Enzo — Interface, route and notebook

- Build a tablet-friendly Angular layout with clear controls and a side panel.
- Connect start, destination and waypoint controls to Willy's map.
- Add undo and clear actions, plus route save/load through the shared contracts.
- Show distance only when the active coordinate system has verified metric calibration; otherwise show it as unavailable.
- Add a data-sources panel and a notebook that saves observations locally.
- Preserve note text on storage failure and render notes as text.

**Done when:** a user can draw and edit a route, inspect its limitations and save an observation.

## Longla — 3D rehearsal and optional VR

- Build a small Three.js rehearsal prototype connected to the agreed route and marker format.
- Use verified aligned terrain and imagery if available; state vertical exaggeration.
- If terrain is unavailable, label any illustrative view clearly and do not present invented relief as measured terrain.
- Add optional WebXR support with fixed viewpoints or teleport movement.
- Label the feature **Prototype: 3D training view**.
- At Sunday 12:00 local time, use a recorded 3D walkthrough if VR remains incomplete.

**Done when:** the prototype shows the route and markers, with terrain provenance and limitations visible. VR is optional.

## YOU — Coordinator, assessment and integration

- Define shared data contracts and coordinate changes across components.
- Integrate small reviewed changes regularly and keep the Angular app runnable.
- Build the Exploration Confidence Panel: supported route information, data coverage, missing information and assessment limits.
- Use Mars-specific geographic distance calculations only for verified geographic coordinates; never apply Earth defaults or treat image pixels as longitude/latitude.
- Add offline preparation after the core mission flow works; verify required cached assets and a full offline reload.
- Coordinate local persistence and mission export with Enzo.
- Trigger the imagery-only **visual review only** fallback when verified terrain is unavailable.
- Check the complete demo, references, AI-use declaration and submission materials.

**Done when:** one integrated mission can select a target, draw a route, explain uncertainty, save/export observations and reopen its prepared assets offline.

## Shared checkpoints and rules

- **Day 1:** imagery, sourced markers and route drawing integrated.
- **Day 2 morning:** finish the notebook, offline workflow and available 3D prototype.
- **Sunday 12:00 local time:** feature freeze; remaining work is fixes, verification and presentation.
- Verify the actual competition submission deadline against the official event page.
- Never invent coordinates, measurements, coverage or safety classifications. Missing data remains unknown.
- Agree on coordinate and record contracts before integrating data. A local pixel route is not geographic GeoJSON.
- Keep scientific values labeled as measured, derived, interpreted or simulated.
- This is a research prototype, not a certified navigation or astronaut safety system.
- Angular is the selected framework. Choose the map library based on verified data and existing code; avoid an unnecessary framework or map rewrite.

Sources: the user-supplied **MARSWALK Full Team Plan.pdf**, the latest **MARSWALK — Project Context**, and the user's Angular choice and explicit Willy/Gaddielle assignment swap. Repository and implementation claims in those documents must be checked against actual code before being treated as current status.
