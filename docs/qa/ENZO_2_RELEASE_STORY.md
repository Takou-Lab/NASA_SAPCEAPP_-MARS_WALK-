# Release Story, Demonstration & QA Handoff — Enzo Agent 2

<!-- CURRENT_WORK_PLAN -->
> **Evidence and verification record.** Aligned **15 November 2026** for the release-story documentation slice following review corrections in [docs/reviews/ENZO.md](../reviews/ENZO.md).
<!-- /CURRENT_WORK_PLAN -->

## 1. Executive Summary & Ownership Boundaries

- **Assigned Contributor:** Enzo (Agent 2 — Release Story & Attribution).
- **Branch:** `feature/enzo-release-story`
- **Ownership Scope:**
  - `docs/PRESENTATION.md`
  - `docs/DEMO_SCRIPT.md`
  - `docs/JUDGES_QA.md`
  - `docs/SCIENCE.md`
  - `docs/REFERENCES.md`
  - `docs/AI_USE.md`
  - `docs/USABILITY.md` (preserved protocol with pending sessions)
  - `docs/qa/ENZO_2_RELEASE_STORY.md` (this verification handoff)
- **Non-Ownership & Independence:**
  - No edits to application runtime code (`src/app/`), coordinator configuration, package files, service workers, or data files (`public/data/`).
  - Agent 1's accepted pure image verifier (`fc79cf8`, merged in `7896e8b`) and ongoing confidence/evidence UI work remain strictly independent.
  - Emma's original authorship and completed research are fully preserved and credited.

---

## 2. Revision Distinction & Test Truthfulness

To prevent presentation misstatements, all documentation strictly separates the deployed public host from repository main:

| Environment | Specific Revision / Commit | Verified Scope & Evidence | Presenter / Citation Rule |
| --- | --- | --- | --- |
| **Public Live Deployment** | Commit **`b6669fb`** | Verified build pack `95d8b5f6ee7aba0a38e8e7758ada62be20a3f0ca61efd04adce0fc4cabb7a827`. Live at [https://marswalk-jet.vercel.app/](https://marswalk-jet.vercel.app/). Evidence: [VERCEL_PRODUCTION.md](VERCEL_PRODUCTION.md). | Cite commit **`b6669fb`** when demonstrating the live public URL. Do not cite main commit hashes for the public host. |
| **Main Baseline** | Commit **`f6567ca`** | 144 Angular unit tests, 11 worker tests, 33 data tests pass. Production bundle: 433.80 kB initial (Leaflet CommonJS warning remains). Evidence: [CONTINUITY_BASELINE.md](CONTINUITY_BASELINE.md). | Baseline anchor for cross-agent integration. |
| **Accepted Main Head** | Commit **`7896e8b`** | 193 Angular unit tests across 17 files, 11 worker tests, 52 data tests pass. Includes pure image verifier (`IMAGE_PAYLOAD_VERIFIER.md`) and data tooling (`ENVIRONMENT_SOURCE_AUDIT.md`). | Not yet deployed to public production. Automatic GitHub deployment is not connected. |
| **Feature Branch** | Branch **`feature/enzo-release-story`** | Six owned documentation files updated + this QA handoff. No application code changed. | Release-story documentation slice. |

> [!NOTE]
> HTTP 200 responses on build inventories prove that asset files exist on the server; they do not prove that a browser has populated its offline cache or can restart disconnected without network access.

---

## 3. Evidence-to-Claim Mapping

Every claim made across the updated presentation, demo, Q&A, and science files is directly mapped to durable repository evidence:

| Document & Section | Documented Claim | Supporting Repository Evidence | Truthful Operational Limitation |
| --- | --- | --- | --- |
| **`PRESENTATION.md`** (Slide 2, 4) | Active regional raster: `PIA26306` (`hirise-mro-pia26306-boxwork-2048x1042-v1`). | `public/data/manifest.json`, [DATA_PASSPORT.md](../data/DATA_PASSPORT.md) | Single orbital image frame. No AOI-scale geological map sheet or DEM is loaded. |
| **`PRESENTATION.md`** (Slide 4, 5) | Leaflet `CRS.Simple` map, route sketching, draft-resilient notes, versioned JSON export. | `src/app/map/`, `src/app/planner/`, `src/app/notebook/`, [FINAL_BRANCH_INTEGRATION.md](FINAL_BRANCH_INTEGRATION.md) | Enforces "Visual Review Only". Distance, elevation, slope, and safety ratings are strictly unavailable. |
| **`DEMO_SCRIPT.md`** (Step 6) | Disconnected reopening and note recovery. | `src/app/core/mission.service.ts`, [PWA_FOUNDATION.md](PWA_FOUNDATION.md) | **Explicit user action required:** Startup does *not* auto-reload routes. User must click **Load Route**. Royce's device note-persistence report remains open. |
| **`JUDGES_QA.md`** (Comparison) | Lightweight educational rehearsal vs. Mars Trek / JMARS. | [SOUL.MD](../../SOUL.MD), [REFERENCES.md](../REFERENCES.md) | Does not claim to replace global GIS platforms or provide mission-critical rover teleoperation. |
| **`JUDGES_QA.md`** (Data & AI) | 3 Curiosity science records readable without fake pins; no runtime AI. | `public/data/markers.json`, [SCIENCE_EVIDENCE.md](../SCIENCE_EVIDENCE.md), [AI_USE.md](../AI_USE.md) | Records carry `position: null`. AI tools used strictly for development/testing assistance; no runtime LLM inference. |
| **`SCIENCE.md`** (Section 3) | Sourced Curiosity records (Mount Sharp boxwork, Vera Rubin Ridge, Glen Torridon). | Primary NASA Science blogs (Sols 4804–4811, 2121, 3251–3253), [SCIENCE_EVIDENCE.md](../SCIENCE_EVIDENCE.md) | Distinguishes verified observation, derivation, and interpretation. Does not claim active surface water or rover trafficability. |
| **`REFERENCES.md`** (Fonts & Licenses) | System font stacks used exclusively; Angular (MIT), TypeScript (Apache-2.0). | `src/styles.scss`, `package.json`, installed `node_modules/typescript/LICENSE.txt` | No bundled `@font-face` files or external font downloads at runtime. |
| **`USABILITY.md`** (Session Log) | Formative 3-user usability evaluation protocol. | `docs/USABILITY.md` | **`PENDING (0 sessions conducted)`**. No outcomes, timings, or participant quotes are fabricated. |

---

## 4. Observed Demonstration Workflow & Fallback Procedure

The demo script in [docs/DEMO_SCRIPT.md](../DEMO_SCRIPT.md) was structured into a reproducible primary 2-minute sequence and a 45-second fallback:

1. **Pre-Demo Preparation:**
   - Open target release (e.g. `https://marswalk-jet.vercel.app/` for `b6669fb`, or local production server for main).
   - In header/drawer, click **Prepare offline**.
   - **Wait for verified full-pack readiness** before disconnecting network.
2. **Interactive Traverse & Science Inspection:**
   - Draw proposed traverse: **Start**, intermediate **Waypoints**, and **Destination**.
   - Inspect Curiosity contextual records; explain why they are displayed in the panel without map pins (`position: null`).
   - Explain that distance and slope are unavailable due to lack of calibration.
3. **Field Observations & Export:**
   - Type observation in **Notebook**; click **Save Observation** (confirm success badge).
   - In Route Planner, click **Save Route**; then click **Export** to inspect the downloaded mission JSON package.
4. **Disconnected Reopen & Explicit Load:**
   - Disconnect network and close browser tab.
   - Reopen application disconnected.
   - **Click "Load Route"** to restore persisted traverse, field observations, and mission JSON.
   - *Presenter Caution:* A DevTools offline reload is a development smoke test, not physical device acceptance. If network toggling cannot be safely demonstrated live, present the online workflow and cite the offline verification record.

---

## 5. Artifact & Screenshot Status

- **Screenshots:** Marked **PENDING**. Per team instructions, screenshots must be captured from an actually served release candidate rather than capturing unmerged local development features and mislabeling them as public production. Once the next release candidate is deployed, fresh high-resolution screenshots will be placed in `docs/demo/` with commit, URL, and viewport recorded.
- **Visual Design:** System fonts ensure zero render-blocking requests and full offline independence.

---

## 6. Blocked External Inputs & Pending Release Gates

The following items are outside the documentation slice and remain recorded as pending or blocked:

1. **Official Competition Requirements Gate:**
   - NASA Space Apps Challenge URL was provided: `https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/?tab=details`.
   - Automated retrieval is blocked (`HTTP 403 Forbidden` via environment proxy CONNECT).
   - Competition form fields, upload limits, video requirements, and exact timezone deadlines remain **unverified**. Coordinator owns official verification; no submission rules may be assumed.
2. **Outside-User Usability Testing:**
   - Three qualitative participant sessions in [docs/USABILITY.md](../USABILITY.md) remain **PENDING** awaiting coordinator arrangement.
3. **Physical Device & Launcher Acceptance:**
   - Standalone home-screen installation and touch validation on physical iOS/Android hardware remain pending coordinator/Longla testing.
   - Royce's physical device report notes an open observation regarding note persistence after device standby/process kill, which is under active investigation.
