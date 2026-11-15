# MARSWALK — Judges' Q&A Reference

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Updated **15 November 2026** for current release baseline **`f6567ca`** and live Vercel deployment (**https://marswalk-jet.vercel.app/**). Use the actually demonstrated revision. This reference reflects true technical and scientific capabilities, not an assumed competition rubric.

## Who uses it, and why?

Target near-term users are planetary-science students, educators, science communicators, and analogue mission planning teams rehearsing decisions under incomplete evidence. MARSWALK provides a focused environment combining real orbital Mars imagery, readable rover science records, user-sketched traverse proposals, portable versioned notes/routes, and explicit uncertainty reporting. No operational astronaut navigation, commercial partnerships, or deployed mission control integrations are claimed.

## What data is real?

The active prepared imagery product is NASA Photojournal **PIA26306** (*HiRISE PSP_001752_1750*), credited to NASA/JPL-Caltech/University of Arizona. Three Curiosity rover records cite primary NASA science blogs and mission updates, detailing instruments (MAHLI, APXS, DRT, Navcam, CheMin, SAM), sol dates, findings, evidence classifications, and limitations in [SCIENCE_EVIDENCE.md](SCIENCE_EVIDENCE.md) and [REFERENCES.md](REFERENCES.md). The exact processed derivative has its own unique `imageRef` (`hirise-mro-pia26306-boxwork-2048x1042-v1`), SHA-256 digests, and documented bounds in [DATA_PASSPORT.md](data/DATA_PASSPORT.md).

These records represent contributor source audits. Schema validation and raster decoding verify payload integrity, not independent peer-reviewed geological reinterpretation.

## Why are there no science pins or metric distance on the map?

All three Curiosity science records carry `position: null` and `positionStatus: "unavailable"`. The **implemented science context list** keeps these findings fully accessible without fabricating coordinates on an orbital raster where rover-to-orbital tie-points are uncalibrated. Furthermore, the prepared raster has unverified metric calibration; pixel counts cannot be converted into meters without risking misleading scientific conclusions. The application has no validated Digital Elevation Model (DEM); image brightness is not topography. Consequently, metric distance, elevation change, slope, and trafficability safety are strictly labeled as **unavailable** ("Visual Review Only").

## How does it compare with Mars Trek or JMARS?

NASA's Mars Trek and Arizona State University's JMARS are comprehensive, professional planetary GIS platforms with extensive datasets, global projections, and elevation queries. MARSWALK does not claim to replace these tools or exceed their capabilities. Instead, MARSWALK provides a lightweight, focused, tablet-friendly mission planning and educational rehearsal interface that highlights data limitations and supports offline-resilient local notes and portable mission JSON files.

## What works now, and what remains?

| Stage | Truthful Implemented Capability |
| --- | --- |
| **Main Baseline `f6567ca`** | Full integrated Angular PWA: Leaflet `CRS.Simple` map with retry handling, contextual science filters, exploration confidence panel, data passport, tablet shell with resizable sidebar, route planner (start/waypoints/destination), draft-resilient observation notebook, guarded mission JSON import/export, dual dark/light themes, and opt-in flat 3D rehearsal viewer (Three.js). |
| **Automated Verification** | 136 Angular unit tests, 11 service worker tests, 28 data tests, and production build pass; pack verification passes with 18 hashed assets. Style budget warnings remain within allowed limits. |
| **Live Deployment** | Deployed on Vercel at **https://marswalk-jet.vercel.app/**. Anonymous inventory verifies asset delivery and caching. |
| **Pending Release Gates** | 1. Physical mobile device standalone launcher acceptance (tracked under W5 in [PWA_ACCEPTANCE.md](qa/PWA_ACCEPTANCE.md)).<br>2. Three outside-user qualitative usability sessions (protocol ready in [USABILITY.md](USABILITY.md); blocked pending coordinator arrangement).<br>3. Confirmation of official NASA Space Apps submission URL, form fields, and exact deadline. |

## Does it work offline or in VR?

The application is built as an installable Progressive Web App (PWA). The service worker caches required build artifacts and local datasets; browser offline reload and update checks pass in production builds. However, complete standalone home-screen acceptance on physical mobile hardware is currently pending. External NASA source links require internet connectivity. Immersive VR is **not implemented**; the 3D rehearsal view is an opt-in flat WebGL prototype and clearly states this limitation.

## How was AI used and credited?

AI coding assistants (including Antigravity, Claude, and Codex) were utilized under human supervision for code scaffolding, unit test implementation, refactoring, documentation alignment, and technical reviews. All architectural decisions, source citations, and scientific boundary rules were directed and audited by human team members. No live AI inference models or unauthorized external AI API endpoints are executed in the browser. See [AI_USE.md](AI_USE.md) for full disclosure.
