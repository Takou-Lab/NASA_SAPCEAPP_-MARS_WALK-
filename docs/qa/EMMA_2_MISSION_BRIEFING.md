# EMMA 2 Mission Briefing

**Branch**: `feature/emma-mission-briefing`

**Files added**:
- `src/app/mission-briefing/mission-briefing.component.ts`
- `src/app/mission-briefing/mission-briefing.component.html`
- `src/app/mission-briefing/mission-briefing.component.scss`
- `src/app/mission-briefing/mission-briefing.component.spec.ts`

## Component summary
- Selector: `app-mission-briefing`
- Stand‑alone, read‑only Angular component.
- Displays the mission question, image source (from `MissionService.image()`), a list of science markers, and explicit limits per the EMMA 2 spec.
- Provides a truthful checklist using computed signals that only reflect the presence of start/destination, selected marker, and observation. No inference of mission success.
- No mutations, storage writes, or navigation actions.

## Accessibility & layout
- Uses native `<details>/<summary>` for collapsible sections.
- Semantic headings, list markup, and focusable elements.
- Constrained to a max width of 390 px to satisfy the narrow‑view requirement.
- Keyboard‑operable and theme‑aware via existing design tokens.

## Test evidence
- Unit test `mission-briefing.component.spec.ts` verifies component creation and that the checklist signals evaluate to `true` when stubbed `MissionService` provides start, destination, a selected marker, and an observation.
- Tests run with the project’s existing Angular test runner (`npm test`).

## Integration notes for coordinator
- Import the component in a parent template where the briefing should appear, e.g. in `app.component.html`:
  ```html
  <app-mission-briefing></app-mission-briefing>
  ```
- No additional module or service registration needed; the component is standalone.
- Ensure the parent layout can accommodate a 390 px wide block.
- No changes to root components, routing, or data stores were made.

## Build impact
- `npm run build` completes without errors.
- Bundle size increase is minimal (≈ 2 KB gzipped) as the component only adds static markup and a few computed signals.

**Ready for coordinator review and mounting.**
