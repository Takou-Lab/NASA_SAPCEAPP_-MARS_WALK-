# MARSWALK — Judges' Q&A Reference

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Updated **15 November 2026**. Presenters and team members must cite the actual served revision:
- **Public Live Deployment:** [https://marswalk-jet.vercel.app/](https://marswalk-jet.vercel.app/) serves commit **`b6669fb`** (pack `95d8b5f6ee7aba0a38e8e7758ada62be20a3f0ca61efd04adce0fc4cabb7a827`).
- **Repository Main:** Baseline `f6567ca` (144 Angular / 11 worker / 33 data tests), advancing to `7896e8b` (193 Angular / 11 worker tests, 52 data tests). Main is ahead of public production; automatic deployment is not connected.

---

## Who uses it, and why?

Target near-term users are planetary-science students, educators, science communicators, and analogue exploration teams rehearsing mission decisions under incomplete evidence. MARSWALK provides a focused visual environment combining real orbital Mars imagery, readable rover science records, user-sketched traverse proposals, portable versioned notes/routes, and explicit uncertainty reporting. No operational astronaut navigation, commercial contracts, or active mission control integrations are claimed.

---

## What data is real?

The active prepared imagery product is NASA Photojournal **PIA26306** (*HiRISE PSP_001752_1750*), credited to NASA/JPL-Caltech/University of Arizona. Three Curiosity rover records cite primary NASA science blogs and mission updates, detailing instruments (MAHLI, APXS, DRT, Navcam, CheMin, SAM), sol dates, findings, evidence classifications, and limitations in [SCIENCE_EVIDENCE.md](SCIENCE_EVIDENCE.md) and [REFERENCES.md](REFERENCES.md). The processed derivative has a unique reference (`hirise-mro-pia26306-boxwork-2048x1042-v1`), SHA-256 digests, and documented bounds in [DATA_PASSPORT.md](data/DATA_PASSPORT.md).

These records represent contributor source audits against primary NASA mission releases. Schema validation and raster decoding verify payload integrity, not independent peer-reviewed geological reinterpretation.

---

## Why are there no science pins or metric distance on the map?

All three Curiosity science records carry `position: null` and `positionStatus: "unavailable"`. The science context list keeps these findings fully accessible without fabricating coordinates on an orbital raster where rover-to-orbital tie-points are uncalibrated. Furthermore, the prepared raster has unverified metric calibration; pixel counts cannot be converted into meters without risking misleading scientific conclusions. The application has no validated Digital Elevation Model (DEM); image brightness is not topography. Consequently, metric distance, elevation change, slope, and trafficability safety are strictly labeled as **unavailable** ("Visual Review Only").

---

## How does it compare with Mars Trek or JMARS?

NASA's Mars Trek and Arizona State University's JMARS are comprehensive planetary GIS platforms with extensive planetary datasets, global projections, and elevation queries. MARSWALK does not claim to replace these tools or exceed their capabilities. Instead, MARSWALK provides a lightweight, focused, tablet-friendly mission planning and educational rehearsal interface that highlights data limitations and supports offline-resilient local notes and portable mission JSON files.

---

## What works now, and what remains?

| Stage / Component | Status & Verified Capability | Evidence Reference |
| --- | --- | --- |
| **Live Host (`b6669fb`)** | Publicly accessible at `https://marswalk-jet.vercel.app/`. Serves verified pack `95d8b5f6ee7a`. Leaflet `CRS.Simple` map, contextual science, route planner, notes, export, and flat 3D viewer. | [VERCEL_PRODUCTION.md](qa/VERCEL_PRODUCTION.md) |
| **Main Baseline (`f6567ca`)** | 144 Angular unit tests, 11 worker tests, 33 data tests pass. Production build creates verified 18-asset pack (433.80 kB initial bundle). Leaflet CommonJS warning remains. | [CONTINUITY_BASELINE.md](qa/CONTINUITY_BASELINE.md) |
| **Accepted Verifier (`7896e8b`)** | Pure image-payload verifier accepted with genuine Uint8Array brand checks; 193 Angular tests pass. Not yet mounted into runtime UI. Coordinator environmental tooling has 52 data tests. | [IMAGE_PAYLOAD_VERIFIER.md](qa/IMAGE_PAYLOAD_VERIFIER.md) |
| **Offline Note Recovery** | Browser offline restart checks pass. Notes and routes save to local storage; reopening requires clicking **Load Route** to restore. Royce's physical device report notes an open issue regarding note persistence across device standby. | [PWA_ACCEPTANCE.md](qa/PWA_ACCEPTANCE.md) |
| **Pending Release Gates** | 1. Physical mobile device standalone launcher acceptance.<br>2. Three outside-user usability sessions (protocol ready in [USABILITY.md](USABILITY.md); 0 sessions conducted to date).<br>3. Official Space Apps challenge requirements (page access blocked by proxy 403; requirements unverified). | [RELEASE_PLAN.md](RELEASE_PLAN.md) |

---

## Does it work offline or in VR?

The application is built as an installable Progressive Web App (PWA). The service worker caches required build artifacts and local datasets; browser offline reload and update checks pass in production builds. However, complete standalone home-screen acceptance on physical mobile hardware is currently pending. External NASA source links require internet connectivity. Immersive VR is **not implemented**; the 3D rehearsal view is an opt-in flat WebGL prototype and clearly states this limitation.

---

## How was AI used and credited?

AI coding assistants (OpenAI Codex and Google Antigravity) were utilized under human supervision for code scaffolding, test suites, documentation drafting, and cross-chat reviews. All architectural decisions, source citations, and scientific boundary rules were directed and audited by human team members. No live AI inference models, LLMs, or unauthorized external AI API endpoints are executed at runtime. See [AI_USE.md](AI_USE.md) for full disclosure.
