# EMMA 2 — Mission Briefing QA & Integration Handoff

## 1. Branch & Commit
- **Branch**: `feature/emma-2-mission-briefing` (also pushed to `feature/emma-mission-briefing` for alias compatibility)
- **Owned Files**:
  - `src/app/mission-briefing/mission-briefing.component.ts`
  - `src/app/mission-briefing/mission-briefing.component.html`
  - `src/app/mission-briefing/mission-briefing.component.scss`
  - `src/app/mission-briefing/mission-briefing.component.spec.ts`
  - `docs/qa/EMMA_2_MISSION_BRIEFING.md`
- **Boundary Compliance**: Zero edits to `src/app/app.*`, `src/app/core/`, `src/app/ui/`, `src/app/map/`, `src/app/science/`, `src/app/evidence/`, `public/data/`, or package dependencies.

## 2. Selector & Coordinator Mount Recommendation
- **Component Class**: `MissionBriefingComponent` (standalone, `imports: []`)
- **Selector**: `<app-mission-briefing />`
- **Import Path**: `src/app/mission-briefing/mission-briefing.component`
- **Suggested Mount Location**:
  - Mount once inside the `Confidence & Data` panel top slot (`app-confidence-panel`) or via content projection in `app.html` (`<app-mission-briefing mission-briefing />`) above `app-exploration-confidence`, so first-time users immediately see the Mount Sharp boxwork question, orbital vs. rover evidence sources, and unlocated spatial limits before sketching a route.

## 3. Source-Backed Copy & Scientific Boundaries
- **Mission Question**: *"What evidence supports the interpretation that ancient groundwater helped form Mount Sharp's boxwork?"*
- **Orbital vs. Rover Evidence**:
  - Pulls active MRO / HiRISE image title, credit, `imageRef`, and validated HTTPS `source.url` from `mission.image()`.
  - Pulls Curiosity / MSL contextual records (`id`, `name`, `evidenceType`, `positionStatus`, `source.title`, `source.credit`, validated HTTPS `source.url`) dynamically from `mission.markers()`.
- **Explicit Limits**:
  - States that contextual science records have no verified pixel positions on this image (`positionStatus: unavailable`) and exact overlap with Vera Rubin Ridge or Glen Torridon is unverified.
  - States that no verified metric scale, DEM, slope, obstacle clearance, current route weather, or route safety rating is supplied.
  - Keeps primary findings distinct from user interpretations; makes no claim of present-day groundwater, unverified mineral percentages, or completion of planned rover measurements.

## 4. Truthful Reactive Checklist
- Computed purely from existing read-only `MissionService` signals:
  - `startAndDestination`: `route().start !== null && route().destination !== null`
  - `markerSelected`: `selectedMarkerId()` matches an existing record in `markers()`
  - `observationPresent`: `observations().length > 0`
- Includes explicit disclaimer that these three structural checks reflect in-memory state only and do not imply saving, exporting, `Load Route` recovery, offline pack preparation, or route safety.

## 5. Verification Results
- **Unit Tests (`src/app/mission-briefing/mission-briefing.component.spec.ts`)**: 6/6 passing (`npx ng test --watch=false --include src/app/mission-briefing/mission-briefing.component.spec.ts`).
  - Covers mission question and MRO/Curiosity source rendering, partial vs. complete route transitions, marker selection and removal from `markers()`, preexisting/imported observation disclaimer, `loading`/`error`/`unavailable`/empty states, `https:` URL sanitization, and zero mutations on `MissionService`.
- **Keyboard & Narrow Layout**:
  - Uses native `<details open>` / `<summary>` disclosures with visible `:focus-visible` outlines (`2px solid var(--mars-focus, #8bc8ff)`), `overflow-wrap: anywhere` for long source titles/IDs at `390px` width, and non-color-only text badges (`[Present]` / `[Missing]`).
