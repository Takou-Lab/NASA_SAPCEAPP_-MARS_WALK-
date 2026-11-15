# AI-Use Record — MARSWALK

<!-- CURRENT_WORK_PLAN -->
> **Evidence/credit record.** Current product stage and ownership follow [the team plan](../TEAM_TASKS.md). This alignment preserves prior source audits; it does not claim a new independent scientific verification.
<!-- /CURRENT_WORK_PLAN -->

## Scope of AI Assistance

### 1. Presentation, Science Documentation & Attribution (Emma & Enzo)
- **Files Owned/Updated:** `docs/SCIENCE.md`, `docs/SCIENCE_EVIDENCE.md`, `docs/DEMO_SCRIPT.md`, `docs/USABILITY.md`, `docs/PRESENTATION.md`, `docs/JUDGES_QA.md`, `docs/REFERENCES.md`, `docs/AI_USE.md`, and `public/data/markers.json`.
- **Original Authorship (Emma):**
  - Located accessible primary Curiosity mission blog records (`science.nasa.gov` WordPress REST API) after `jpl.nasa.gov/news/nasas-curiosity-rover-explores-a-spiderweb-on-mars/` returned `HTTP 403 Forbidden`.
  - Audited and narrowed the three `ScienceMarker` findings in `public/data/markers.json` to match verified source text verbatim, separating observation, derivation, and interpretation.
  - Authored `docs/SCIENCE_EVIDENCE.md`, the initial 50–200 word English summary in `docs/SCIENCE.md`, the 60-second rehearsal script in `docs/DEMO_SCRIPT.md`, the initial 7-slide presentation outline in `docs/PRESENTATION.md`, and the judges' Q&A reference in `docs/JUDGES_QA.md`.
  - Prepared the three-user formative usability protocol in `docs/USABILITY.md` (with all session results marked `PENDING`).
- **Release-Story Handoff & Alignment (Enzo):**
  - Following the coordinator-approved assignment swap on 15 November 2026, Enzo took over the presentation, demo, Q&A, and attribution documents.
  - Aligned all documentation with verified baseline `f6567ca` and the live Vercel production deployment (`https://marswalk-jet.vercel.app/`).
  - Verified and locked active imageRef (`hirise-mro-pia26306-boxwork-2048x1042-v1`), draft-resilient mission planning, JSON transfer, and exact factual capabilities ("Visual Review Only", uncalibrated imagery, distance/elevation/slope/safety unavailable, flat opt-in 3D).
  - Explicitly preserved `PENDING` states for outside-user usability sessions, physical device tests, and official Space Apps submission requirements without fabrication.
  - Documented third-party software and typography licenses in `docs/REFERENCES.md`.

### 2. Engineering & Test Assistance Boundaries
- **AI Tooling Used:** Google Antigravity, OpenAI Codex, and Claude Code were utilized across contributor environments for development assistance, test scaffolding, documentation drafting, and cross-chat continuity.
- **Strictly Bounded Usage:**
  - **No Live Runtime AI:** MARSWALK contains **no** live client-side machine learning inference, no background LLM API calls, no secret backend proxy, and no autonomous rover navigation algorithms.
  - **Deterministic Client Execution:** All route rendering, waypoints, notes persistence, image-payload verification, and offline service worker caching operate purely deterministically on the client device.
  - **Candidate Pre-Generated Explanations (Phase 3 Planned):** Any future scientific explanation cards proposed in `public/data/science-explanations.json` are strictly pre-generated, peer-reviewed, source-grounded static JSON entries with explicit provenance metadata. They are never generated dynamically at runtime.

---

## Coordinator Implementation & Architecture Assistance

AI assistance (Codex / Antigravity) supported the Angular architecture integration, guarded mission transfer, science mounting, Longla viewer corrections, and recorded automated/browser reviews. Exact source revisions and check scopes are in `docs/qa/` and `docs/reviews/`; counts are not aggregated across branches. The current work-plan alignment updates stale assignments and readiness language without changing source records or claiming a fresh independent scientific-source audit. Physical-device, installed-offline, and outside-user outcomes remain pending where recorded.

---

## Coordinator PWA Foundation

Codex assisted implementation/review of the production worker, build-pack generation, lifecycle UI/service, tests, original geometric install artwork, and documentation in `8a4dadc`. The icon is original app artwork, not NASA branding. Real automated/browser outcomes and limitations are recorded in [PWA_FOUNDATION.md](qa/PWA_FOUNDATION.md). These development uses are not a runtime AI feature, independent scientific verification, or physical-device acceptance.

---

## Vercel Deployment Follow-Through

Codex assisted hosting configuration, actual CLI deployment, source/asset auditing, and production browser verification. The live app is recorded in [VERCEL_PRODUCTION.md](qa/VERCEL_PRODUCTION.md). Optional Vercel plugin/global-skills and MCP installation attempts failed on the managed read-only profile; they are not claimed installed or used as a runtime AI feature.
