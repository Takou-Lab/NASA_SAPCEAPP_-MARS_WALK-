# Emma — Science Explorer and Evidence UI

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W3](../../TEAM_TASKS.md#w3).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

Emma uses **he/him**. Read [the accepted review](../reviews/EMMA.md), [the new detailed assignment](tasks/EMMA_SCIENCE_EVIDENCE_WORKSPACE.md), [SOUL.MD](../../SOUL.MD) and [the shared contract](CODING_AGENTS.md).

## Completed work — preserve it

Science/evidence/demo `8a947a4`, usability protocol `b0640d9`, presentation/Q&A `947ff1a` and **ScienceContextComponent `4efcb5a`** are accepted. The coordinator has mounted the science component with the real service/data; **51 integrated tests, production build and recorded browser checks pass**. Do not recreate these contributions. Real outside-user sessions and installed offline acceptance remain pending.

## New substantial assignment — your section plus Enzo's future evidence panels

Build **science discovery plus read-only Exploration Confidence and Image Data Passport UI**. The user explicitly transfers those future presentation components from Enzo. His existing shell/planner/notebook work stays intact.

1. Enhance `src/app/science/`: live computed record/located counts, text search, evidence/position filters, result count, clear filters and selected-record details that remain accessible when filtered out.
2. Create standalone **ExplorationConfidenceComponent** (`app-exploration-confidence`) under `src/app/evidence/exploration-confidence.component.{ts,html,scss,spec.ts}`. Read existing service assessment and route state; show actual limitations, unavailable terrain/scale and only supported derived planar distance. Do not calculate new metrics or safety scores.
3. Create standalone **ImagePassportComponent** (`app-image-passport`) under `src/app/evidence/image-passport.component.{ts,html,scss,spec.ts}`. Present actual ImageManifest source/credit, reference, pixel dimensions, coordinate convention, date, coverage, calibration and limitations. No invented fields, source facts, byte totals or offline readiness.
4. Add meaningful behavioral tests and `docs/qa/EMMA_EVIDENCE_UI.md` with actual checks plus Enzo's exact import/selector/placement handoff.

The [full specification](tasks/EMMA_SCIENCE_EVIDENCE_WORKSPACE.md) defines UI states, filters, null/zero distance behavior, safe links, ownership and acceptance. Complete the slices in order; preserve the accepted list/details and its tests.

## Branch and boundaries

Preserve local work. If this follow-up has not started, create proposed **`feature/emma-science-evidence-workspace`** from latest published main in the existing checkout. Keep any existing local task branch and synchronize safely instead of duplicating work. Keep the original science branch/history. Own only the existing four science files, the eight new evidence component files and the QA handoff document.

Enzo keeps `src/app/ui/`, planner, notebook/draft retention, shell/root assembly, font/sidebar fixes and future real PWA-status UI. He integrates your reviewed components without duplicating them. Preserve any related UI he already drafted as integration reference. Do not edit his files or root yourself.

Use readonly MissionService signals. No repeated initialize/fetch, separate mission store, storage access, model/core changes, dependencies, new data or worker. Missing positions, scale, terrain and exact-AOI verification remain unavailable.

## Answer — live count with computed()

```ts
readonly recordBadge = computed(() => {
  const records = this.mission.markers();
  const located = records.filter(
    (record) => record.position !== null && record.positionStatus !== 'unavailable',
  ).length;
  return `${records.length} records (${located} located on image)`;
});
```

```html
<p>{{ recordBadge() }}</p>
```

MissionService supplies validated records for the active image. Angular updates the badge when `markers()` changes; no separate counter/effect is needed. Located includes illustrative positions, which must remain distinguished from verified positions. Current data: **3 records (0 located on image)**.

## Checks and handoff

Retain all accepted tests. Verify composed filters, hidden selection, unchanged mission state, reactive warnings/distance, genuine unavailable fields, derived zero, safe text/links and loading/error states. Run `npm test` and `npm run build`; check keyboard and tablet/narrow-panel behavior where supported. Report actual revision/browser/device evidence; mark unrun physical-device/offline/user checks pending.

Commit/push only your W3 task branch (default **`feature/emma-science-evidence-workspace`**; preserve/report an existing local task branch); that own-feature push is authorized. Hand off commit, files, selectors, actual checks and remaining limits. No main integration, deployment, environment publication, submission or external messaging is included.

## Copy-paste coding-agent prompt

```text
You are Emma's MARSWALK science/evidence UI coding agent. He uses he/him.
Read docs/team/tasks/EMMA_SCIENCE_EVIDENCE_WORKSPACE.md,
docs/team/EMMA.md, docs/reviews/EMMA.md, docs/team/CODING_AGENTS.md
and SOUL.MD. Follow the detailed assignment rather than inventing APIs.

ScienceContextComponent 4efcb5a is accepted/mounted: 51 integrated tests,
build and recorded browser checks pass. Preserve earlier science/protocol/
presentation work and existing list/details/tests. Do not restart the app.

1. Preserve local work. If no evidence-workspace task branch exists, create
   proposed feature/emma-science-evidence-workspace from latest published
   main. Otherwise retain existing task work. Keep accepted science history.
2. Enhance only science component files: computed live counts, case-insensitive
   search, evidence/position filters, visible/total count, clear filters and
   selected details retained when a filter hides their button. Located is
   distinct from verified. Never change route/mode/layers/notes/image.
3. Build standalone ExplorationConfidenceComponent, selector
   app-exploration-confidence, in src/app/evidence/ with TS/HTML/SCSS/spec.
   Read MissionService assessment/route/data/image. Show Visual review only,
   real warnings, endpoint/waypoint state and supported planar distance.
   Null is unavailable, zero may be valid. No safety score or invented terrain.
4. Build standalone ImagePassportComponent, selector app-image-passport,
   in src/app/evidence/ with TS/HTML/SCSS/spec. Present actual manifest fields,
   safe source link/credit, imageRef, PIXEL dimensions, coordinates, date,
   coverage, calibration and limitations. Do not invent processing/schema/
   storage/offline fields or treat a pixel dimension as metric resolution.
5. Add behavioral regressions for discovery, filtered selection, unchanged
   mission state, reactive confidence, null/zero values, metadata failure
   states and safe text/links. Both evidence panels are readonly.
6. Run full tests/build and actual keyboard/tablet/narrow-panel checks.
   Record actual outcomes and selectors/import/placement instructions in
   docs/qa/EMMA_EVIDENCE_UI.md. Unrun device/offline/user checks stay pending.

This explicitly transfers future confidence/passport PRESENTATION from Enzo.
Enzo retains shell, planner, notebook/drafts, fonts/sidebar, root integration
and later real PWA-status UI. Preserve his work; don't edit his files.
Own only science/, the two evidence components and that QA handoff.
No root/core/data/package/worker edits, new dependencies, fetching/storage,
reinitialization or competing mission state. No fabricated measurements.
Teach one new slice at a time using the learner checkpoint.
Commit/push only the assigned W3 feature branch (authorized) and send its commit,
selectors, exact checks and limits for review. No main merge/push,
deployment, environment publication, submission or external messaging.
```
