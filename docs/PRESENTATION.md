# MARSWALK — Internal Presentation Outline (7 Slides)

> **Notice:** This 7-slide outline and the accompanying 60-second rehearsal pacing in [DEMO_SCRIPT.md](DEMO_SCRIPT.md) are **internal team presentation choices**, not verified official NASA Space Apps Challenge submission limits. Author: Emma (he/him).

## Slide Overview

| Slide | Title | Feature Status | Reviewed Revision | Outstanding Artifact |
| --- | --- | --- | --- | --- |
| 1 | User Story & Purpose | `WORKING` (charter & summary) | `22e07ef` / `b0640d9` | Final pitch rehearsal recording (`PENDING`) |
| 2 | The Problem: Planning Under Incomplete Evidence | `WORKING` (data & terrain gap docs) | `22e07ef` / `8a947a4` | Verified local AOI tie-points / DEM (`PENDING / OUT OF V1 SCOPE`) |
| 3 | Fair Comparison: Mars Trek & JMARS vs. MARSWALK | `WORKING` (positioning & references) | `22e07ef` | None (claims checked against [SOUL.MD](../SOUL.MD)) |
| 4 | Sourced Orbital & Rover Data | `WORKING` (data pack & 3 records) | `b0640d9` / `f24f6fc` | Rover-to-orbital pixel tie-points (`PENDING`) |
| 5 | Exploration Confidence & Data Passports | `WORKING` (core service) / `IN CORRECTIVE REVIEW` (UI) | `f24f6fc` / `15b1666` | Integrated Confidence Panel screenshot (`PENDING`) |
| 6 | Actual Demo Evidence & Verified Baseline | `WORKING` (map, core, data) / `PENDING` (full UI, PWA) | `f24f6fc` / `22e07ef` | Full-UI & installed offline device screenshots (`PENDING`) |
| 7 | Honest Limitations & Next Steps | `PENDING` (UI integration, PWA offline, 3-user test) | `22e07ef` | Completed Enzo fixes, PWA reload QA & 3 user sessions (`PENDING`) |

---

## Detailed Slide Breakdown

### Slide 1 — User Story & Purpose
- **Message:** Help planetary-science students/educators, analogue mission teams, outreach groups, and mission-planning researchers rehearse a Mars exploration workflow when communication and surface evidence are incomplete—preparing a route, recording observations offline, and understanding what the data cannot prove. Operational astronaut navigation is a **long-term future vision**, not a capability of the current prototype.
- **Evidence / Implementation Reference:** [SOUL.MD](../SOUL.MD), [SCIENCE.md](SCIENCE.md) (Sections 4 & 6).
- **Reviewed Revision:** `22e07ef` (`main`), `b0640d9` (`feature/emma-science-provenance`).
- **Feature Status:** `WORKING` (charter, user framing, and 118-word English summary established).
- **Outstanding Artifact:** `PENDING` — Recorded voiceover/slide deck visuals after full UI integration.

### Slide 2 — The Problem: Planning Under Incomplete Evidence
- **Message:** Exploring the **Mount Sharp (*Aeolis Mons*)** boxwork formations in Gale Crater (`~5.4° S, 137.8° E`) involves orbital derivatives without verified pixel-to-meter calibration, no bundled local DEM for slope calculation, and rover science findings lacking verified pixel tie-points on the orbital image. Standard route lines can mislead planners if uncertainty is hidden.
- **Evidence / Implementation Reference:** [TERRAIN_EVALUATION.md](data/TERRAIN_EVALUATION.md), [SCIENCE.md](SCIENCE.md) (Sections 1–2), [public/data/manifest.json](../public/data/manifest.json).
- **Reviewed Revision:** `22e07ef` (`main`), `8a947a4` (`feature/emma-science-provenance`).
- **Feature Status:** `WORKING` (terrain gap documented; `calibration.verified: false`, `terrainStatus: "unavailable"`).
- **Outstanding Artifact:** `PENDING / OUT OF V1 SCOPE` — No validated aligned DEM or verified ground-control tie-points exist in v1.

### Slide 3 — Fair Comparison: Mars Trek & JMARS vs. MARSWALK
- **Message:** Existing NASA/planetary tools such as **NASA Mars Trek** and **JMARS** already provide rich global GIS layers, terrain profiles, and measurement tools. MARSWALK does not claim those tools lack terrain or route features; instead, MARSWALK contributes a lightweight, focused **Angular PWA rehearsal workflow** for a bounded study area that puts explicit evidence boundaries, contextual science provenance, and local observation export front and center.
- **Evidence / Implementation Reference:** [SOUL.MD](../SOUL.MD) ("Release and competition story"), [REFERENCES.md](REFERENCES.md).
- **Reviewed Revision:** `22e07ef` (`main`).
- **Feature Status:** `WORKING` (documented product positioning).
- **Outstanding Artifact:** None for slide text; avoid claiming unverified user partnerships.

### Slide 4 — Sourced Orbital & Rover Data
- **Message:** MARSWALK pairs a verified **2048 × 1042** local derivative of NASA/JPL/University of Arizona HiRISE observation `PIA26306` (`hirise-mro-pia26306-boxwork-2048x1042-v1`, 524,472-byte required image pack) with three audited Curiosity records (Mount Sharp boxwork ridges, Vera Rubin Ridge `'Ailsa Craig'`, and the Glen Torridon-to-sulfate transition). Every finding separates **Observation**, **Derivation**, and **Interpretation**, and all three keep `position: null` and `positionStatus: "unavailable"` rather than inventing map pins.
- **Evidence / Implementation Reference:** [public/data/manifest.json](../public/data/manifest.json), [public/data/markers.json](../public/data/markers.json), [SCIENCE_EVIDENCE.md](SCIENCE_EVIDENCE.md), [OFFLINE_DATA_PACK.md](data/OFFLINE_DATA_PACK.md).
- **Reviewed Revision:** `f24f6fc` / `22e07ef` (`main`), `b0640d9` (`feature/emma-science-provenance`).
- **Feature Status:** `WORKING` (3 records + real image manifest pass `MissionService` runtime validators and 4 Python verifier tests in `tools/data/test_verify_pack.py`).
- **Outstanding Artifact:** `PENDING` — Independent rover-to-orbital pixel tie-point verification (until then, records stay contextual).

### Slide 5 — Signature Experience: Exploration Confidence & Data Passports
- **Message:** MARSWALK's core contribution is telling the truth when data is missing. `assessRoute()` reports `distanceStatus: "unavailable"` (`planarDistanceMeters: null`) while `calibration.verified` is `false`, and `terrainStatus: "unavailable"` (visual review only) with explicit warnings—never fabricating confidence scores or `"SAFE"` labels. Contextual science records remain readable in the Data Passport / science list even without map coordinates.
- **Evidence / Implementation Reference:** [src/app/core/route.ts](../src/app/core/route.ts), [src/app/core/mission.service.ts](../src/app/core/mission.service.ts), [src/app/core/validation.ts](../src/app/core/validation.ts), [SCIENCE.md](SCIENCE.md) (Section 6).
- **Reviewed Revision:** `f24f6fc` (`main`), `15b1666` (`feat/enzo-ui-planner-notebook`, under corrective review in [docs/reviews/ENZO.md](reviews/ENZO.md)).
- **Feature Status:** `WORKING` (core `MissionService` & `assessRoute` logic) / `IN CORRECTIVE REVIEW` (Enzo's Confidence Panel, Data Passport, and contextual science UI).
- **Outstanding Artifact:** `PENDING` — Live UI screenshots of Enzo's integrated Confidence Panel and Data Passport after [docs/reviews/ENZO.md](reviews/ENZO.md) fixes pass.

### Slide 6 — Actual Demo Evidence & Verified Baseline
- **Message:** The integrated baseline already renders the real 2048 × 1042 HiRISE image inside a single mounted Leaflet `CRS.Simple` `<app-map>` component with readiness guards, drag/zoom, layer toggles, and error handling, backed by `MissionService` route state, `localStorage` persistence, and `marswalk-mission.json` export. Follow the 7-step internal pacing in [DEMO_SCRIPT.md](DEMO_SCRIPT.md), keeping working vs. pending steps transparent.
- **Evidence / Implementation Reference:** [DEMO_SCRIPT.md](DEMO_SCRIPT.md), [MAP_INTEGRATION.md](qa/MAP_INTEGRATION.md), [src/app/map/map.component.ts](../src/app/map/map.component.ts).
- **Reviewed Revision:** `f24f6fc` / `22e07ef` (`main`, 32 passing unit tests across 4 files, production `ng build` passing, one-time Playwright desktop 1366 × 1000 & tablet-sized 820 × 1180 smoke checks recorded in [MAP_INTEGRATION.md](qa/MAP_INTEGRATION.md)).
- **Feature Status:** `WORKING` (map mounting, data validation, core route/note state) / `PENDING` (route-mode UI controls, notebook/export UI buttons, PWA installation, offline cache).
- **Outstanding Artifact:** `PENDING` — Integrated full-UI screenshots, Reset View / Focus Route buttons (`feature/willy-map-development`), and installed-device offline reload capture.

### Slide 7 — Honest Limitations & Next Steps
- **Message:** MARSWALK is currently an installable Angular PWA **under development**. Before claiming a complete offline mission, the team is completing four concrete steps: (1) resolving Enzo's UI integration and local font issues (`feat/enzo-ui-planner-notebook`), (2) Willy's Reset View / Focus Route controls, (3) Coordinator's PWA manifest, service-worker caching, and physical-device offline reload verification, and (4) Coordinator-led formative usability sessions with three outside participants.
- **Evidence / Implementation Reference:** [REVIEW.md](../REVIEW.md), [NEXT_TASKS.md](../NEXT_TASKS.md), [USABILITY.md](USABILITY.md), [docs/reviews/ENZO.md](reviews/ENZO.md), [docs/reviews/GADDIELLE.md](reviews/GADDIELLE.md).
- **Reviewed Revision:** `22e07ef` (`main`).
- **Feature Status:** `PENDING` (UI integration, PWA service-worker caching, physical-device QA, and outside-user sessions).
- **Outstanding Artifact:** `PENDING` — Anonymized participant outcomes in [USABILITY.md](USABILITY.md), Data Passport wording fixes on `feature/gaddielle-data-preparation`, and production offline reload logs.
