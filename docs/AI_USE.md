# AI-Use Record — MARSWALK

<!-- CURRENT_WORK_PLAN -->
> **Evidence/credit record.** Current product stage and ownership follow [the team plan](../TEAM_TASKS.md). This alignment preserves prior source audits; it does not claim a new independent scientific verification.
<!-- /CURRENT_WORK_PLAN -->

## Scope of AI Assistance
- **Owned Files:** `public/data/markers.json`, `docs/SCIENCE.md`, `docs/SCIENCE_EVIDENCE.md`, `docs/DEMO_SCRIPT.md`, `docs/USABILITY.md`, `docs/PRESENTATION.md`, `docs/JUDGES_QA.md`, `docs/REFERENCES.md`, `docs/AI_USE.md`.
- **Use:**
  - Located accessible primary Curiosity mission blog records (`science.nasa.gov` WordPress REST API) after `jpl.nasa.gov/news/nasas-curiosity-rover-explores-a-spiderweb-on-mars/` returned `HTTP 403 Forbidden`.
  - Audited and narrowed all three `ScienceMarker` findings to match verified source text verbatim, separating observation, derivation, and interpretation.
  - Authored `docs/SCIENCE_EVIDENCE.md`, updated the 50–200 word English PWA summary in `docs/SCIENCE.md`, and created the 60-second internal rehearsal script in `docs/DEMO_SCRIPT.md`.
  - Prepared the three-user formative usability protocol in `docs/USABILITY.md` (with all session results marked `PENDING`) and appended near-term use-case framing and Enzo contextual-record handoff notes in `docs/SCIENCE.md`.
  - Authored the 7-slide internal presentation outline in `docs/PRESENTATION.md` and factual judges' Q&A reference in `docs/JUDGES_QA.md` aligned with reviewed revision `22e07ef` and `MAP_INTEGRATION.md`.
- **Verification & Review:**
  - Verified HTTP accessibility and extracted source passages for each retained NASA URL.
  - Kept `imageRef: "hirise-mro-pia26306-boxwork-2048x1042-v1"`, `position: null`, `positionStatus: "unavailable"`, and unverified Earth dates as `null`.
  - Validated `public/data/markers.json` against `ScienceMarker` in `src/app/core/models.ts` and `validMarkers` rules in `src/app/core/validation.ts`, and checked compatibility read-only against Gaddielle's `manifest.json`.


## Coordinator implementation and documentation assistance

AI assistance also supported the Angular integration, guarded mission transfer, science mounting, Longla viewer corrections and recorded automated/browser reviews. Exact source revisions and check scopes are in `docs/qa/` and `docs/reviews/`; counts are not aggregated across branches. The current work-plan alignment updates stale assignments and readiness language without changing source records or claiming a fresh independent scientific-source audit. Physical-device, installed-offline and outside-user outcomes remain pending where recorded.
