# AI-Use Record — MARSWALK

## Scope of AI Assistance
- **Files:** `public/data/markers.json`, `docs/SCIENCE.md`, `docs/REFERENCES.md`, `docs/AI_USE.md`.
- **Use:** An AI coding assistant was used to update `ScienceMarker[]` with the active manifest `imageRef` (`hirise-mro-pia26306-boxwork-2048x1042-v1`), ensure position coordinates remain `null` and `unavailable`, align instrument attributions with primary NASA mission releases, and clearly describe unfinished map and offline features as planned.
- **Verification & Review:**
  - `public/data/markers.json` validated against `validMarkers` schema and `ScienceMarker` interface in `src/app/core/models.ts` and `validation.ts`.
  - All source URLs verified against real, authoritative `jpl.nasa.gov`, `science.nasa.gov`, and `usgs.gov` entries.
  - No coordinates were fabricated.
