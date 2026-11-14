# Emma — Contextual science UI, transferred from Enzo

## Scope and reason

Your presentation and Q&A were delivered at `947ff1a`; preserve them and the accepted science/protocol work. The coordinator will integrate minor wording updates for current readiness. Your next task is a small standalone Angular component that makes the three unlocated science records accessible. This transfers the missing science-context list/details from Enzo; it does not transfer his shell, planner, notebook, theme or core-integration work.

Use the existing checkout and canonical Angular foundation. Do not scaffold another app or recreate the evidence audit. Read [EMMA.md](../EMMA.md), [the shared contract](../CODING_AGENTS.md) and [SOUL.MD](../../../SOUL.MD).

## Branch and owned files

After this integration is published, preserve local changes and create `feature/emma-science-context-ui` from the latest main in the existing checkout. This is a proposed new task branch, not a branch already published.

Own only:

- `src/app/science/science-context.component.ts`
- `src/app/science/science-context.component.html`
- `src/app/science/science-context.component.scss`
- `src/app/science/science-context.component.spec.ts`

Implement standalone `ScienceContextComponent`, selector **`app-science-context`**. Use plain Angular and CSS/SCSS; no new packages. Root/shell mounting belongs to Enzo/coordinator after review. Do not edit their files, MissionService, shared models, map, source records, dependencies or PWA lifecycle.

## Existing API — do not invent another store

```ts
import { computed, inject } from '@angular/core';
import { MissionService } from '../core/mission.service';

// Inside the component:
readonly mission = inject(MissionService);
readonly selectedRecord = computed(() =>
  this.mission.markers().find(m => m.id === this.mission.selectedMarkerId()) ?? null
);
```

Read `markers()`, `selectedMarkerId()`, `dataStatus()` and `dataError()`. Selection calls `selectMarker(record.id)`; clearing calls `selectMarker(null)`. The root already initializes data once. Do not refetch files, modify routes, use localStorage or change the active image.

## Required behavior

1. Show a readable list of every loaded science record, including `position: null` / `positionStatus: 'unavailable'`.
2. Each record has an accessible native selection button, readable title and selected state such as `aria-pressed`.
3. Selecting a record shows finding, evidence type, instrument/date or Unavailable, source/credit, position status and limitations. Keep observation/interpretation labels honest.
4. Render note/finding text with Angular interpolation. Use validated source URLs with safe external-link attributes and explain that external pages need connectivity.
5. For current records, explicitly say the location is unavailable on this image. Never create a map pin, route endpoint, distance or geographic coordinate from the record's title or regional context.
6. Provide clear loading, error, empty-list and no-selection states. A missing selected ID must not crash when records change.
7. Keep the layout usable with tablet-sized panels, long titles and keyboard navigation. Use visible focus and readable touch targets.
8. Enzo will import this component in the shell/confidence area and replace his duplicate selected-record block as appropriate. Coordinate the placement with existing map details rather than implementing a second competing selection state.

## Tests and learning

Build one slice at a time: list, selection, then details and states. Explain signals, computed selection and template binding in plain language; follow the learner checkpoint before the first new substantive edit. Do not repeat completed research lessons.

Required tests:

- Three unlocated records remain listed and selectable.
- Selecting/clearing calls the existing service action and updates details.
- Selection leaves route, mode, observations and image reference unchanged.
- Missing instrument/date and unavailable positions are labeled correctly.
- Empty/loading/error and removed-selected-record cases render safely.
- Long/plain-text content is displayed as text, not injected HTML.

Use synthetic fixtures only in tests; do not alter production scientific records. Run `npm test` and `npm run build`; report actual counts and outcomes. Perform keyboard/layout checks where supported and distinguish them from a physical-device/PWA test.

## Done and handoff

Commit and push `feature/emma-science-context-ui`; that own-feature push is authorized. Give Enzo/coordinator the commit, export/selector, files, test results and known limitations. No main merge, deployment, competition submission or messaging tools are included. Component completion does not mean it is mounted on main or that offline PWA installation is ready.
