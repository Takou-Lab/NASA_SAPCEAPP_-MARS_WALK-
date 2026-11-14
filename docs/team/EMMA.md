# Emma — Science and Contextual Science UI

Emma uses **he/him**. Read [the accepted presentation review](../reviews/EMMA.md), [the new coding task](tasks/EMMA_SCIENCE_CONTEXT_UI.md), [SOUL.MD](../../SOUL.MD) and [the shared contract](CODING_AGENTS.md).

## Completed work — preserve it

Your science/evidence/demo work `8a947a4`, usability protocol `b0640d9` and presentation/Q&A `947ff1a` are delivered and integrated. The coordinator applied small current-readiness wording updates to the presentation without asking you to redo it. Real user sessions remain pending.

Do not repeat the research, protocol, presentation, data acquisition or project scaffolding. Unverified dates/positions, calibration and terrain remain unavailable. Source access/audit is distinct from independent verification of every scientific claim.

## New task — part of Enzo's UI work

You now own a standalone **contextual science list and selected-record details** component under `src/app/science/`. It lets people read all three records even though their map positions are unavailable.

Enzo keeps the shell, root integration, route controls, notebook, failed-save draft retention, theme/font/sidebar fixes and canonical-core reconciliation. He will import your reviewed component and remove duplicate selected-record UI as appropriate. Do not edit his files or mount your component in the root yourself.

After this integration is published, preserve local changes and create proposed branch **`feature/emma-science-context-ui`** from latest main in the existing checkout. Own:

- `src/app/science/science-context.component.ts`
- `src/app/science/science-context.component.html`
- `src/app/science/science-context.component.scss`
- `src/app/science/science-context.component.spec.ts`

## Exact interface

Implement standalone **ScienceContextComponent**, selector **`app-science-context`**, using the existing root-provided MissionService. Read `markers()`, `selectedMarkerId()`, `dataStatus()` and `dataError()`; use computed selection. Call only `selectMarker(id)` or `selectMarker(null)` for selection actions. Root already initializes data once.

Show loading/error/empty/no-selection states, readable selection buttons and record details: finding, evidence type, instrument/date or Unavailable, source/credit, position status and limitations. All current null-position records must remain selectable without invented pins or route destinations. Render content as plain text and label external links as requiring connectivity.

Do not fetch another dataset, access storage, duplicate mission state, change core/models/records, add dependencies, calculate missing metrics or implement PWA lifecycle. Follow [the detailed task](tasks/EMMA_SCIENCE_CONTEXT_UI.md) for UI states and acceptance checks.

## Learning, tests and handoff

Start with the list, then selection, then details. Explain signals, computed selection and bindings; follow learner checkpoints for this new code, not completed lessons.

Test unlocated records, selection/clear behavior, unchanged route/mode/observations/image, missing fields, loading/error/empty/removed-selection states and safe text rendering. Use synthetic fixtures in tests only. Run actual `npm test` and `npm run build`, plus supported keyboard/layout checks.

Commit/push only `feature/emma-science-context-ui`; that own-feature push is authorized. Give Enzo/coordinator the commit, selector/export, files, actual results and limits. No main merge, deployment, submission, environment publication or external messaging is included.

## Copy-paste coding-agent prompt

```text
You are Emma's Angular science-context coding tutor/agent. He uses he/him.
Read docs/team/tasks/EMMA_SCIENCE_CONTEXT_UI.md, docs/team/EMMA.md,
docs/reviews/EMMA.md, docs/team/CODING_AGENTS.md and SOUL.MD.

Science, protocol and presentation947ff1a are delivered and integrated.
Do not redo them or scaffold another Angular app. This is a bounded coding
slice transferred from Enzo so both people can work independently.

1. Preserve local changes. After this integration is published, create
   feature/emma-science-context-ui from latest main in the existing checkout.
2. Own only src/app/science/science-context.component.ts/.html/.scss/.spec.ts.
   Implement standalone ScienceContextComponent, selector app-science-context.
3. Inject existing MissionService. Read markers/selectedMarkerId/dataStatus/
   dataError. Compute selected record; use selectMarker(id/null) actions.
   Do not fetch data, initialize again, access storage or mutate routes.
4. List every contextual record, including null/unavailable positions.
   Use labeled native selection buttons with selected state and visible focus.
   Show selected finding, evidence type, instrument/date or Unavailable,
   source/credit, position status and limitations. Allow clearing selection.
5. Render text safely. Show loading/error/empty/no-selection states and
   handle a removed selected ID. External source pages require connectivity.
   Never invent pins, coordinates, metric distance or route destinations.
6. Test all three unlocated records, selection/clear, unchanged route/mode/
   notes/image, missing fields, state changes and plain-text rendering.
   Run actual tests/build and supported keyboard/tablet-layout checks.
7. Hand the reviewed component to Enzo/coordinator for shell integration.
   Enzo retains shell/planner/notebook/draft/font/sidebar work; don't edit
   those files or root/core/dependencies/records/PWA code yourself.

Teach one small slice at a time using the learner checkpoint. Commit/push
only the new feature branch and report commit/selector/files/results/limits.
No main merge, deployment, environment publication or external messaging.
```
