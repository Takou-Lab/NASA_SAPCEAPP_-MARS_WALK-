# MARSWALK — Project purpose and delivery priorities

Updated: **14 November 2026**. This is the team's product charter and scope guide, not evidence that a feature already works or an official competition rulebook. Read it with [TEAM_TASKS.md](TEAM_TASKS.md), [the shared coding contract](docs/team/CODING_AGENTS.md) and your named brief.

## Why we exist

Help people rehearse a scientific exploration when communication and evidence are incomplete. MARSWALK brings a small Mars study area, sourced scientific context, a proposed route and field observations into one installable offline **Angular PWA**.

Our promise: **prepare an exploration, work offline, and understand the limits of the evidence.**

Future astronaut support is the long-term vision. The current prototype is for scientific learning, rehearsal and research into exploration workflows. It is not ready for operational astronaut or rover navigation.

## Real users and use cases

| User | Useful activity | Boundary |
| --- | --- | --- |
| Planetary-science students and educators | Explore genuine regional Mars imagery, inspect scientific interpretations and explain what remains unknown | Educational context does not establish route safety |
| Analogue mission teams | Rehearse preparation, observation recording and delayed/offline information workflows | Actual Earth field navigation would need separately validated local maps and requirements |
| Science outreach and research teams | Carry a curated, attributed study-area package without continuous connectivity | Exact dataset coverage and rights must be checked |
| Mission-planning researchers | Study how people make decisions with incomplete exploration information | Usefulness must be evaluated; this is not an operational planning certification |

These are target users to test with, not claims of existing customers or partnerships. Keep the hackathon focused on Mount Sharp boxwork regional context in Gale Crater. Do not expand into Earth mapping or a second product during this release.

## Our signature experience

The **Exploration Confidence Panel** explains what the current mission data supports, what it does not support, and why. It must remain useful even when the honest answer is unavailable.

For the currently delivered regional image and v1 contracts:

- Regional optical imagery is available on the data branch; exact exploration-area overlap remains unverified.
- Metric distance stays unavailable until calibration of the exact prepared raster is independently verified.
- Elevation, slope and terrain assessment are unavailable without validated aligned terrain data.
- Science records without verified positions remain readable contextual records, not invented map markers.
- A sketched route is a proposal for visual review. It is not an automatically optimized or approved route.

Reflect actual mission state: no image, incomplete route, selected data product, missing calibration and missing evidence. Show route-specific coverage only when verified coverage geometry supports that calculation. Do not add arbitrary confidence percentages, traffic-light safety classifications or inferred hazards.

## One complete mission

The essential release lets someone:

1. Install the app on the demonstration device and prepare the required local study-area data.
2. Inspect the real image, its source and its coverage limitations.
3. Read a sourced science record; a verified position is optional, never fabricated.
4. Sketch a start, destination and waypoints; undo, clear, save and recover the route.
5. Review what the confidence panel can and cannot assess.
6. Save a field observation locally; retain the typed draft if saving fails.
7. Close the installed app, disconnect the device and reopen the prepared mission.
8. Continue the essential workflow offline and export a versioned mission JSON with provenance and limitations.

Do not present an unrun step as complete. An unlocated science record must not block the mission by requiring a fictional destination marker; users may select a visual destination themselves.

## PWA acceptance criteria

- Production app is served through HTTPS for normal installation; supported localhost development is separate.
- Web app manifest has appropriate name, icons, start URL, scope and standalone display.
- Installation is tested on the target device/browser. Show a supported install action or accurate manual guidance.
- The production service worker prepares the built application shell and the explicitly required local mission assets.
- **Offline ready** means the essential asset set is present and verified, including the prepared image and bundled scientific summaries. Registration or network status alone is insufficient.
- Missing assets, failed preparation, incompatible data versions and available updates have truthful states. Do not discard unsaved observations during updates.
- Connectivity and offline-pack readiness are separate indicators.
- Close/reopen and full offline reload are tested after preparation. Recovered route, observations, confidence messages and JSON export work without network.
- External citation pages may need connectivity; the local record still includes its source and evidence summary.
- The offline pack is deliberately bounded. The archival master image, a large speculative DEM, whole-planet tiles and external websites are not automatically required cache assets.

## Data passports

Every displayed product has a readable provenance record: source and credit, product/image reference, observation date when verified, coverage, resolution when known, preparation steps, verification status and limitations. Gaddielle supplies imagery/processing evidence, Emmanuelle supplies scientific evidence, Enzo presents it, and the coordinator agrees any shared model/API extension.

Do not invent fields absent from inspected evidence. Preserve the prepared image's bottom-left pixel contract and version reference. Neither image brightness nor a scientific interpretation supplies measured terrain. A new derivative or coordinate interpretation requires deliberate versioning and handling of saved positions.

## Current priorities and team ownership

| Priority | Owner | Outcome |
| --- | --- | --- |
| Essential | Gaddielle | Stable image/manifest, qualified coverage claims, offline image-pack inventory, reproducible validation and Willy handoff |
| Essential | Emmanuelle (EMMA.md) | Claim-level citations, science evidence audit, honest product summary and user-test/demo scripts |
| Essential | Willy | Real local-image map, robust loading, route rendering and correct map-to-mission actions |
| Essential | Enzo | Tablet controls, readable confidence/data passports, contextual science list, notebook, recovery/export and PWA status UI |
| Essential | Coordinator (YOU.md) | Shared state, reviewed integration, confidence calculations, installation, complete verified offline pack and end-to-end release checks |
| Essential before optional 3D | Longla | Independent target-device/offline QA and support for usability observation, working with the coordinator |
| Optional after core acceptance | Longla | Labeled 3D rehearsal; VR only if time and verified behavior permit |

Keep existing role ownership and completed work. The Willy/Gaddielle swap remains in force. Use the personal briefs for exact files, agent prompts and checks.

## Evidence that people can use it

The coordinator arranges a small test with **three people outside the team**. Emmanuelle prepares the protocol and records anonymized outcomes in `docs/USABILITY.md`; Longla supports observation and device checks. Do not fabricate participants, timings or results.

Ask each person to:

1. Draw a proposed route using the map.
2. Explain whether its distance and slope are known, and point to the supporting message.
3. Save an observation and recover it after reopening the prepared app offline.

Record completion, misunderstandings and failures; record time only if measured. Fix the most common obstacle and report what changed. A three-person formative test is useful feedback, not proof of operational fitness. Do not contact anyone through messaging tools without the user's authorization.

## Work we will not expand into for this release

No automatic safe-route selection, real-time astronaut tracking, hazard prediction, helmet hardware, live Mars telemetry, new backend, account system or full DTN implementation. No artificial slope/chemistry to fill data gaps. 3D/VR cannot delay the installable offline 2D mission.

## Release and competition story

The next integration target is the complete 2D offline mission on the demonstration device. Preserve a working revision, then prioritize failures, usability and presentation. A build or unit-test pass alone does not establish installability or offline reopening.

Explain what the team added relative to existing tools without claiming Mars Trek or JMARS lacks terrain or route features. Demonstrate a focused explorer workflow, portable offline information and explicit uncertainty. Record NASA resources actually used, other sources/libraries, credits and AI assistance. Verify official submission requirements and deadline against the current event page; internal rehearsal lengths are not official submission limits.

Suggested pitch:

> MARSWALK packages real Mars imagery and scientific context into an offline exploration rehearsal. It helps users sketch a mission, document observations, and see which decisions the available evidence cannot support.

## Status when this charter was written

`main` has the Angular foundation, shared models/MissionService, validation, localStorage/export service functionality, Leaflet dependencies and an honest missing-data shell. The last foundation check passed 15 tests and a production build; production HTTP assets served. A headless browser attempt stalled and did not verify browser behavior.

Image and science contributions are on feature branches pending reviewed integration. Map/UI, installability and verified offline operation must be checked against the actual integration revision before being called complete. This charter and the updated assignments do not themselves implement those features.
