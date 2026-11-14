# AI-Use Record — MARSWALK

## Scope of AI Assistance
- **Files:** `public/data/markers.json`, `docs/SCIENCE.md`, `docs/REFERENCES.md`, `docs/AI_USE.md`.
- **Use:** An AI coding assistant was used to structure the `ScienceMarker[]` JSON according to `docs/team/CODING_AGENTS.md`, draft the geological coverage notes, separate observations from interpretations, and draft the English project summary and demo text.
- **Verification & Review:**
  - All source URLs were checked against live `nasa.gov` / `usgs.gov` search results.
  - Unverified coordinates, dates, and `manifest.json` references were explicitly set to `null` / `"unavailable"` rather than fabricated.
  - JSON syntax and schema fields were validated against `ScienceMarker` in `docs/team/CODING_AGENTS.md`.
