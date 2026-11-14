# AI-Use Record — MARSWALK

## Scope of AI Assistance
- **Owned Files:** `public/data/markers.json`, `docs/SCIENCE.md`, `docs/SCIENCE_EVIDENCE.md`, `docs/DEMO_SCRIPT.md`, `docs/REFERENCES.md`, `docs/AI_USE.md`.
- **Use:**
  - Located accessible primary Curiosity mission blog records (`science.nasa.gov` WordPress REST API) after `jpl.nasa.gov/news/nasas-curiosity-rover-explores-a-spiderweb-on-mars/` returned `HTTP 403 Forbidden`.
  - Audited and narrowed all three `ScienceMarker` findings to match verified source text verbatim, separating observation, derivation, and interpretation.
  - Authored `docs/SCIENCE_EVIDENCE.md`, updated the 50–200 word English PWA summary in `docs/SCIENCE.md`, and created the 60-second internal rehearsal script in `docs/DEMO_SCRIPT.md`.
- **Verification & Review:**
  - Verified HTTP accessibility and extracted source passages for each retained NASA URL.
  - Kept `imageRef: "hirise-mro-pia26306-boxwork-2048x1042-v1"`, `position: null`, `positionStatus: "unavailable"`, and unverified Earth dates as `null`.
  - Validated `public/data/markers.json` against `ScienceMarker` in `src/app/core/models.ts` and `validMarkers` rules in `src/app/core/validation.ts`, and checked compatibility read-only against Gaddielle's `manifest.json`.
