# MARSWALK — Improvements adopted from the Martian Map guide

Decision: **14 November 2026**. The user-supplied *Martian_Map_Guide.pdf* is a design reference. Its proposed features and illustrations are not evidence of delivered software or verified datasets.

The most useful idea is **one mission from preparation to field rehearsal**: prepare a route, carry it to another device, read the same context and keep observations. We retain Angular, the PWA goal, the current Gale Crater/Mount Sharp image and the team's existing work. The guide's Jezero example does not change our study region.

## Implemented now: portable mission files

The root application now exposes **Export mission**, a mission-file chooser and **Import selected mission**. Import warns that it replaces the route and saved observations; export current work before replacing it.

- The destination must already have the matching image version loaded. Mission JSON does not contain the image payload or install an offline pack.
- Files are limited to 1 MiB of UTF-8 JSON. The service checks schema version, exact imageRef, bounded route/observation coordinates, note identifiers and dates before changing state.
- Only route and observations are restored. Imagery, scientific records, calibration and assessment come from the active local data, even if the imported export contains those fields.
- Persistence must succeed before publishing the imported mission. Invalid files and storage failures preserve the current route, notes, undo history and existing saved mission.
- Successful import saves the replacement, clears undo history and preserves mode, layer visibility and science selection. Notes remain text, including unlocated notes.

Use the same file to move a prepared mission between desktop and tablet. Imported pixel coordinates retain their image identity; this is not geographic GeoJSON, a metric route or live astronaut navigation.

Implementation and checks: [shared contract](team/CODING_AGENTS.md) and [mission transfer verification](qa/MISSION_TRANSFER.md).

## Next release gate: the complete offline mission

Finish the existing shell/planner/notebook and science-component integration, then implement installation and verified caching of the required shell and data assets. Test preparation, route/note creation, transfer, close/reopen, explicit mission recovery and export with the network disconnected on the demonstration device. Record actual failures and fixes.

File transfer alone does not prove offline readiness. Neither worker registration, a passing build nor an image-only inventory establishes that the complete app can reopen disconnected. Keep this gate ahead of optional 3D/VR.

## Layers must answer real questions

Retain image provenance, coverage and evidence limitations alongside the route. Add geology, elevation or slope overlays only when a real compatible product has verified coverage, coordinates, units, resolution, legend and provenance. A regional science summary with an unavailable position belongs in contextual science access; it must not become a fabricated spatial layer or pin.

The current image has no verified metric calibration or terrain model. Distance, elevation and slope remain unavailable. Preserve the visual-review-only confidence message.

## Measured 3D requires aligned terrain

Before calling a view measured terrain, verify an actual Gale-area DTM against the imagery: overlap, horizontal reference, pixel mapping, elevation units, resolution, NoData handling and texture alignment. State vertical exaggeration and version any changed coordinate interpretation. A Jezero DTM does not describe Gale.

Preserve Royce/Longla's ongoing viewer slice. A ground plane or illustrative prototype can support interaction work when labeled clearly; image brightness must not be presented as measured elevation. VR remains optional after core acceptance.

## Handoff without restarting work

| Owner | Continue existing work | Guide-related acceptance |
| --- | --- | --- |
| Coordinator | Shared core, reviewed integration and PWA lifecycle | Portable import/export now; complete installed offline workflow next |
| Enzo | Correct existing shell/planner/notebook branch | Preserve mission transfer UI and service behavior while mounting the shell; avoid duplicate storage |
| Emma | Standalone contextual science component | All three unlocated records accessible, sourced and clearly distinguished from spatial evidence |
| Willy | Guarded image retry | Preserve imported route/notes and current navigation behavior |
| Gaddielle | Existing image-pack inventory assignment | Deterministic verified image inventory; no complete-app offline claim |
| Royce/Longla | Current slice, independent device QA, optional viewer | Record actual device outcomes; gate measured terrain claims on aligned DTM evidence |

These are acceptance clarifications, not replacement assignments or claims that later features are implemented. The strongest demonstration is a complete, honest mission that users can carry and recover, supported by visible scientific evidence.
