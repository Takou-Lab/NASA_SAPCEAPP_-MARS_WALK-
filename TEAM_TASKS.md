# MARSWALK — Team Tasks

Product: **installable offline PWA built with Angular and TypeScript**. Region: **Mount Sharp boxwork formations, Gale Crater, Mars**; exact area of interest still needs verification.

Read [SOUL.MD](SOUL.MD) first for the product purpose, real users, complete offline mission and acceptance criteria. Education, mission rehearsal and analogue-workflow research are near-term use cases; operational astronaut navigation remains a long-term vision.

This allocation follows the supplied Full Team Plan, with **Willy and Gaddielle (Gaddiel/Daddiel) swapped**. Team names follow the latest project context: Longla takes the 3D role listed as Royce in the PDF, and YOU denotes the coordinator role listed as Dinang. This is a task plan, not a claim that features or datasets already exist.

## Coding-agent instructions

Each personal brief below includes a ready-to-paste agent prompt. Read [SOUL.MD](SOUL.MD) and the [shared coding contract](docs/team/CODING_AGENTS.md) first. The Angular foundation is already implemented; reuse it. The next work is reviewed data integration, the 2D mission, installability and verified offline operation.

**No restart:** teammates already working should preserve their current branch and finish or hand off their current small slice. New priorities guide the next phase; they do not reopen completed tasks. Emmanuelle's previous science assignment is delivered at `8a947a4` and awaits coordinator integration, not repeated research.

## Current follow-up assignments — 14 November 2026

The Angular foundation is on `main`. The last joint review of Gaddielle's imagery and Emmanuelle's science records passed image dimensions and shared record contracts, along with the foundation tests/build. These branches have not yet been merged into `main`; inspect newer branch revisions before integration. Scientific source support still requires review; schema validation alone does not verify a finding.

| Person | Continue on | Next deliverables |
| --- | --- | --- |
| [Gaddielle](docs/team/GADDIELLE.md#current-follow-up--offline-image-data-package) | `feature/gaddielle-data-preparation` | Offline image-pack inventory, offline verification tool, qualified metadata claims and Willy handoff |
| [Emmanuelle / Emma](docs/team/EMMA.md#current-follow-up--scientific-evidence-and-pwa-demo) | `feature/emma-science-provenance` | Previous audit, citations, summary and demo delivered at `8a947a4`; handoff now, usability protocol as a separate later task |

Read the **current follow-up** and updated copy-paste prompt in each named brief before continuing. Preserve completed branch work rather than restarting the initial assignment. These assignments include committing and pushing the respective feature branch; integration into `main` remains separate. Installation, service-worker implementation and full offline-app verification belong to the coordinator; an image-pack inventory alone does not establish PWA readiness.

### Full-team priorities

| Person | Current work | Acceptance evidence |
| --- | --- | --- |
| [Willy](docs/team/WILLY.md) | Real local-image map and route rendering | Image-load/dimension failures handled; pixel conversion and route modes correct; prepared imagery works offline after PWA integration |
| [Enzo](docs/team/ENZO.md) | Tablet mission UI, Confidence Panel, Data Passport, science list and notebook | Users understand missing distance/slope, unlocated records remain readable, failed saves retain drafts, recovery/export work |
| [Gaddielle](docs/team/GADDIELLE.md) | Offline image inventory/verifier and Data Passport | Actual file sizes/checksums/dimensions and provenance documented; whole-app readiness not implied |
| [Emmanuelle](docs/team/EMMA.md) | Completed science/evidence/demo handoff; later usability support | Preserve delivered `8a947a4`; address concrete integration findings, then record actual user-test outcomes when sessions occur |
| [Longla](docs/team/LONGLA.md) | Independent installed-device/offline QA first; optional 3D second | Recorded close/reopen/offline checks and observed usability issues; no untested VR claims |
| [YOU — coordinator](docs/team/YOU.md) | Review/integration, shared state, PWA install/cache/update lifecycle and release | Complete installed offline mission passes on the demonstration device; three outside-user sessions arranged and recorded |

The coordinator conducts the outside-user sessions, Emmanuelle maintains `docs/USABILITY.md`, and Longla supports observation and device testing. Work towards the next complete 2D offline mission before optional 3D/VR. These are assignment updates, not a claim that the features are implemented.

## Task overview

| Person | Responsibility | Deliverable |
| --- | --- | --- |
| [Willy](docs/team/WILLY.md) | Angular map and map interactions | Map with layer toggles and clickable sourced markers |
| [Gaddielle](docs/team/GADDIELLE.md) | Imagery and terrain data | Verified data files and documented coverage, coordinates and limitations |
| [Emmanuelle / Emma](docs/team/EMMA.md) | Science, provenance and presentation | Three sourced observations, evidence audit, references and submission text |
| [Enzo](docs/team/ENZO.md) | Interface, route drawing and notebook | Tablet layout, drawable route and locally saved observations |
| [Longla](docs/team/LONGLA.md) | Device/offline QA, then optional 3D/VR | Recorded checks first; labeled rehearsal prototype only after the core mission |
| [YOU — coordinator](docs/team/YOU.md) | Integration, assessment and installable offline PWA | Integrated mission flow, confidence panel and tested installed offline pack |

## Willy — Angular map

- Build one map component and coordinate its events with Enzo's route controls.
- Load a verified Mars Trek layer if usable; integrate Gaddielle's prepared imagery when available.
- Add layer toggles and Emma's sourced science markers.
- Show source, instrument, date and location limitations when a marker is selected.
- Initialize the map after its container exists and clean it up when the component is destroyed.

**Done when:** the map displays the available imagery, layers can be toggled, and route interactions work. Sourced science remains accessible through Enzo's list; marker interaction is required only for records with supplied display positions.

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

## Longla — Device/offline QA and optional 3D/VR

- First support the coordinator with installed-device/offline QA and outside-user observation as described in [Longla's current brief](docs/team/LONGLA.md). Defer optional 3D until the essential mission is accepted.
- After core acceptance, optionally build a small Three.js rehearsal prototype connected to the agreed route and marker format.
- Use verified aligned terrain and imagery if available; state vertical exaggeration.
- If terrain is unavailable, label any illustrative view clearly and do not present invented relief as measured terrain.
- Add optional WebXR support with fixed viewpoints or teleport movement.
- Label the feature **Prototype: 3D training view**.
- At the team's feature freeze, omit unfinished VR; a recording of a working optional 3D view is a fallback, not a core release requirement.

**Done when:** independent QA records actual installed-device/offline results, defects and affected retests. Optional 3D may show the shared route and any positioned markers with provenance and limitations; neither 3D nor VR blocks the core release.

## YOU — Coordinator, assessment and integration

- Follow [SOUL.MD](SOUL.MD): complete the installed offline mission before integrating optional 3D/VR. Reuse the implemented foundation and coordinate Data Passport/PWA state contracts before UI integration.
- Define shared data contracts and coordinate changes across components.
- Integrate small reviewed changes regularly and keep the Angular app runnable.
- Build the Exploration Confidence Panel: supported route information, data coverage, missing information and assessment limits.
- Use Mars-specific geographic distance calculations only for verified geographic coordinates; never apply Earth defaults or treat image pixels as longitude/latitude.
- Add offline preparation after the core mission flow works; verify required cached assets and a full offline reload.
- Coordinate local persistence and mission export with Enzo.
- Trigger the imagery-only **visual review only** fallback when verified terrain is unavailable.
- Check the complete demo, references, AI-use declaration and submission materials.

**Done when:** one integrated installed PWA can inspect science context, choose a visual destination, draw a route, explain uncertainty, save/recover/export observations and reopen its prepared assets offline.

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
