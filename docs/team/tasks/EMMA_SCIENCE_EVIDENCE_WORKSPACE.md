# Emma — Science explorer and evidence panels

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W3](../../../TEAM_TASKS.md#w3).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

Assigned **14 November 2026**, after acceptance of science component **`4efcb5a`**. Emma uses he/him. This is a substantial follow-up in his own section plus an explicit transfer of **future read-only confidence and image Data Passport presentation** from Enzo. Preserve both contributors' delivered work.

Read [EMMA.md](../EMMA.md), [the accepted review](../../reviews/EMMA.md), [shared contract](../CODING_AGENTS.md), [SOUL.MD](../../../SOUL.MD) and [Gaddielle's Data Passport](../../data/DATA_PASSPORT.md). The current typed ImageManifest is authoritative for executable UI; richer proposed passport schemas are not implemented APIs.

## Branch and ownership

Preserve local work. If no follow-up branch exists, create proposed **`feature/emma-science-evidence-workspace`** from latest published main in the existing checkout; otherwise retain existing task work and synchronize safely. Keep `feature/emma-science-context-ui` and accepted history. Do not scaffold another application.

| Files | Deliverable |
| --- | --- |
| Existing `src/app/science/science-context.component.{ts,html,scss,spec.ts}` | Search, filters and live counts while retaining accepted record details |
| New `src/app/evidence/exploration-confidence.component.{ts,html,scss,spec.ts}` | Standalone `ExplorationConfidenceComponent`, selector `app-exploration-confidence` |
| New `src/app/evidence/image-passport.component.{ts,html,scss,spec.ts}` | Standalone `ImagePassportComponent`, selector `app-image-passport` |
| `docs/qa/EMMA_EVIDENCE_UI.md` | Actual regression/browser outcomes and precise shell integration instructions |

No root, `src/app/ui/`, planner, notebook, map, core, package, source-data, worker or global-theme edits. No new dependencies. Both new components inject existing MissionService, take no required inputs, initialize/fetch nothing and own no persistence. Enzo/coordinator imports them only after review. Do not import nonexistent future APIs.

Enzo retains shell/root integration, route controls, notebook/draft retention, local fonts, sidebar/layout fixes and eventual real PWA-status UI after the coordinator provides a lifecycle API. Preserve any confidence/source UI he already drafted as reference for integration; he should not develop a competing implementation or throw away his work.

## Slice 1 — live counts and accessible science discovery

Enhance the accepted component rather than recreating it:

1. Add a derived badge like **`3 records (0 located on image)`**. Derive from readonly `markers()` with `computed()`. Count all loaded records separately from filtered results. Located includes verified and illustrative supplied positions; it is not a claim that every location is verified. If positioned records exist, distinguish verified/illustrative counts visibly. Do not count unavailable/null positions.
2. Add a labeled case-insensitive text search across name, finding, instrument and source title, plus evidence-type and position-availability filters. Use signals for UI query/filter choices and computed filtered results. Do not mutate/filter MissionService arrays in place or store competing copies/counts.
3. Show **Showing N of M**, a clear-filters action and a useful no-match state. Distinguish no results from missing/failed science data. Clear filters must not clear mission selection or route.
4. Keep a selected record's details accessible when the filter hides its list button: explain that it is outside the current results and offer clearing filters. Preserve selection until the user explicitly clears/changes it. Retain the missing-selected-ID fallback.
5. Keep native keyboard controls, visible focus, touch targets, safe text, source credits and unavailable-position labels. No map pins, destinations or measurements are created by discovery actions.

### Answer to the computed-count variation

Inside the component, `computed` is already imported:

```ts
readonly recordBadge = computed(() => {
  const records = this.mission.markers();
  const located = records.filter(
    (record) => record.position !== null && record.positionStatus !== 'unavailable',
  ).length;
  return `${records.length} records (${located} located on image)`;
});
```

In the template:

```html
<p>{{ recordBadge() }}</p>
```

This relies on MissionService validating records against the active image. It automatically recomputes when `markers()` changes; there is no manually synchronized counter or effect. An illustrative position contributes to located, not verified. The shipped data yields **3 records (0 located on image)**.

## Slice 2 — Exploration Confidence presentation transferred from Enzo

Implement `ExplorationConfidenceComponent` using only `dataStatus()`, `dataError()`, `image()`, `route()` and `assessment()`.

- Clearly state **Visual review only** and explain that missing hazard/terrain information does not establish safety. Display the service's assessment warnings as text. Do not invent scores, percentages, categories or a SAFE result.
- Show whether start/destination are set and how many waypoints exist, without editing them. No copied route store, extra distance algorithm or route calculation belongs here.
- Show planar distance only from the service when its status is derived and the numeric value is available; **zero is a valid derived value**. State its verified-calibration basis and distinguish it from terrain-following distance.
- With the current unverified calibration, show metric distance unavailable. Elevation, slope and terrain distance remain unavailable even if a future compatible manifest enables planar distance. A route/imagery display offset is not elevation.
- Show exact-AOI coverage status distinctly from regional context. Handle image loading, missing metadata, errors and an incomplete route without crashing or claiming readiness.
- Preserve complete warning meaning; deduplicate identical text if useful. Do not derive PWA readiness from these signals or from browser online status.

## Slice 3 — Image Data Passport presentation transferred from Enzo

Implement `ImagePassportComponent` from the actual `ImageManifest` fields:

- Source title, safe HTTPS link and credit; imageRef; raster width × height labeled **pixel dimensions**, coordinate convention and coverage status.
- Observation date or Unavailable; calibration verification and, only when supplied/verified, meters per pixel, source URL and method; otherwise state that metric scale is unavailable.
- All recorded image limitations as plain text. Regional context does not establish exact boxwork-AOI overlap, north-up orientation or geodetic alignment.
- State that a verified terrain product is not supplied by the current contract. Never use image brightness as elevation or dimensions as spatial resolution.
- External source pages may need connectivity. Avoid hardcoded processing details, byte totals, hashes, proposed v2 fields or future pack APIs: they are not fields of ImageManifest. In particular, do not present 524,472 image-payload bytes as complete app/cache size or readiness.
- Loading, absent and invalid-metadata states must be readable. These metadata states do not prove successful image display in the map; preserve that distinction.

Use the existing shared HTTPS helper if needed. Do not change Gaddielle's assets or recreate her evidence audit. There is no new terrain/data acquisition assignment.

## Slice 4 — behavioral verification and integration handoff

Add tests that protect decisions users can make:

- Badge/filter results react to marker changes; all-null positions count zero. Synthetic verified/illustrative fixtures distinguish located from verified. Search/evidence/position filters compose, no-match/reset works and hidden selection remains readable.
- Discovery/selection/filter reset never changes route, mode, layers, observations or active image. Existing seven component tests remain passing.
- Confidence updates after route/assessment changes, renders unknowns honestly, handles missing/error/incomplete data, accepts derived zero and never invents terrain/safety results.
- Passport renders only available fields, marks null dates/calibration unavailable, keeps provenance/limitations visible, handles safe links and renders HTML-like content as text.
- Both evidence components consume readonly state without reinitializing, fetching, changing mission selection or writing storage.

Run the full `npm test` and production `npm run build`; report actual counts/results, preserving bundle budgets. Check keyboard selection/filtering, clear controls, focus and overflow at tablet size and a narrow panel. Record actual browser/revision/device information in `docs/qa/EMMA_EVIDENCE_UI.md`; label unrun physical-device/PWA/outside-user checks pending.

The handoff must name component exports/selectors and give imports/template placement for Enzo. He should mount the science component once, replace the current root confidence block with the reviewed confidence component when integrating, and avoid duplicate passport/detail panels. Emma does not make those shell/root edits.

## Finish and push

Work slice by slice with brief learning explanations, preserving accepted work. Complete all three UI deliverables and the behavioral handoff before calling the assignment done. Commit/push **only the assigned W3 task branch** (default `feature/emma-science-evidence-workspace`; report an existing local task name if different), then provide commit, files, selectors, test/build/browser evidence and remaining limitations for review. That normal feature-branch push is authorized. Main integration, deployment, environment publication, submission and external messaging remain separate.
