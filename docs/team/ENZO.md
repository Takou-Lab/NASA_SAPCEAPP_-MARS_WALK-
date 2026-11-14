# Enzo — Angular Interface, Route Controls and Notebook

## Current review — changes required before integration

Reviewed branch: **`feat/enzo-ui-planner-notebook`**, commit **`15b1666`**. Read [the detailed review](../reviews/ENZO.md), [published branch review](../../REVIEW.md), [SOUL.MD](../../SOUL.MD), [team allocation](../../TEAM_TASKS.md) and [shared contract](CODING_AGENTS.md).

Your UI, planner, notebook, themes and tests are useful work to preserve. **Do not restart or discard them.** The branch began from documentation commit `015c022`, before the shared Angular foundation was added. It therefore contains a second app/core implementation and a placeholder map. It is not ready to replace the integrated application.

The isolated branch suite passed **47 tests**. Its production build failed in the review environment when the external Google Fonts fetch returned **HTTP 403**. Passing those branch tests does not establish compatibility with main or a complete map workflow. The detailed review records browser observations and exact findings separately.

## Current task — port the UI onto the integrated foundation

Continue on the **same feature branch**. This is a corrective integration slice, not a new branch or a new feature project.

### 1. Preserve and synchronize

- Inspect Git status and preserve all local/unpushed work before syncing.
- Fetch the latest `main` and merge it into your branch without reset or force push. The reviewed baseline is `ee9f6ae`; newer published documentation may follow it.
- Expect 16 add/add conflicts from the parallel bootstrap. Preserve your useful UI files while retaining the canonical main foundation, dependencies and data.
- Keep main's `src/app/core/models.ts`, `mission.service.ts`, `route.ts`, `validation.ts`, persistence/export semantics and existing regression tests. Do not replace them with the branch's alternate route/storage helpers or service.
- Keep the integrated package declarations and lockfile, including Leaflet. Do not downgrade dependencies or regenerate a second Angular application.

### 2. Reconnect existing components

- Reuse standalone components under `src/app/ui/`, `src/app/planner/` and `src/app/notebook/`.
- In the planner, use `routePoints` from `src/app/core/route.ts` instead of the duplicate `getOrderedRoutePoints` helper.
- Components consume the existing MissionService readonly signals and actions. Root initialization remains a single call to `initialize()`; do not restore constructor-driven `initData()` or fetch data from rendering effects.
- Preserve main's runtime data validation, image reference, unavailable calibration/terrain and versioned mission records. UI components must not read/write mission localStorage independently or invent a second mission store.
- Keep theme preferences separate from mission state. Move the UI-only ThemeService under `src/app/ui/` and update its imports; do not replace or expand mission core to implement a theme.

### 3. Mount the real map and complete science access

Replace the shell's decorative map placeholder with the existing standalone **MapComponent**. Import its actual component and mount `<app-map>` exactly once. Reuse Willy's image loading, dimension checks, coordinate conversion, route rendering and readiness guard. Do not rewrite Leaflet or invent map positions.

For this integration only, you may change `src/app/app.ts`, `app.html`, `app.scss` and `app.spec.ts` narrowly to mount your shell, provide layout space and test the integrated root. Preserve the root's one-time MissionService initialization, actual data/error states and existing capabilities. If the shell owns MapComponent, remove the old root map mount rather than displaying two maps. All unrelated root/core/package/PWA changes remain coordinator-owned.

The three integrated science records have unavailable positions. Add an accessible contextual record list/card selector that calls `selectMarker(id)` and opens their evidence/details. It must work without map pins and must not set a route destination or manufacture coordinates.

### 4. Preserve drafts and usable layout

- Keep an unsaved or failed-save notebook draft when switching between Confidence, Planner and Notebook tabs. The current `@switch` destroys the notebook component; retain its UI state or its mounted component deliberately.
- Clear a draft only after `addObservation()` returns success. A storage error must preserve the exact typed draft, including after tab navigation. Render saved notes as text.
- Use one viewport-aware sidebar sizing rule for pointer resize, keyboard resize, restored preferences and viewport changes. Narrow layouts must leave the workspace usable; do not allow keyboard/restored widths to bypass the pointer clamp.
- Keep native controls keyboard-accessible with visible focus and readable tablet touch targets. Preserve the useful dark/light theme without allowing layout overflow.

### 5. Remove the external-font dependency

Remove the Google Fonts network import that blocks production building and introduces an external runtime dependency. Use system fonts or locally bundled fonts with appropriate licensing/credits. Do not bypass TLS verification or merely claim a successful build when the font fetch failed.

PWA installation, service-worker caching and verified offline readiness remain coordinator work. Do not create a competing worker, simulate preparation progress or infer readiness from `navigator.onLine`. Integrate future PWA UI only after the coordinator supplies its real API.

## Ownership and boundaries

Own the UI, planner and notebook directories and their tests, including UI-only theme state. The narrow root shell-mount exception above is limited to the current integration. Willy owns map implementation; Gaddielle and Emma own their data/evidence. Preserve their exact image/record references and source files. Shared API or dependency changes require coordinator agreement.

Use the actual existing methods: `setMode`, `setLayer`, `selectMarker`, `undoRoute`, `clearRoute`, `saveRoute`, `loadRoute`, `addObservation` and `exportMission`. Main's `loadRoute()` restores both route and observations and resets undo history. Surface real operation results rather than optimistic success messages.

## Acceptance checks before requesting review again

1. No unresolved merge markers; current main core, data, package/lock and existing regression coverage remain intact.
2. The shell mounts one actual map, loads the prepared image and lets planner controls change the shared route through real map clicks.
3. All three contextual science records can be selected and read despite null positions; selection does not modify route endpoints.
4. Draft text survives tab changes and storage failure. A valid save, mission save/load, recovered note and JSON export work through the canonical service.
5. Keyboard, pointer, restored sidebar width and viewport changes preserve a usable layout without horizontal page overflow at supported sizes.
6. Missing/invalid data and unavailable distance/slope remain explicit. No invented confidence scores, geographic coordinates or safety claims.
7. Run the existing main tests plus your meaningful UI regressions. Run a production build without external font access. Report actual commands, test counts and outcomes.
8. Exercise the integrated mission in a browser: image, route controls, context selection, note save/recovery/export, failed-save/tab draft retention, themes and responsive sidebar. Mark unrun device/PWA checks pending.

Installed offline reopening and outside-user sessions remain separate acceptance checks. Neither 47 isolated branch tests nor a build proves those outcomes.

## Handoff

Commit and push **only `feat/enzo-ui-planner-notebook`**, then provide the pushed commit, resolved conflicts, reused components, changed files, actual checks and remaining blockers. This corrective assignment authorizes that feature-branch push. Do not merge/push main, deploy, submit or contact others through messaging tools without applicable authorization.

Use learner checkpoints for the new correction slice, not to repeat completed UI lessons. Explain one component-to-service flow at a time and report understanding honestly.

## Copy-paste coding-agent prompt

```text
You are Enzo's UI integration and correction agent for MARSWALK.
Read docs/reviews/ENZO.md, REVIEW.md, SOUL.MD, TEAM_TASKS.md,
docs/team/ENZO.md and docs/team/CODING_AGENTS.md.

Reviewed feat/enzo-ui-planner-notebook commit15b1666 needs integration
corrections. Preserve its useful UI/planner/notebook/theme work and tests;
do not restart, reset or create another application/feature branch.
47 isolated branch tests passed; production build here failed fetching
Google Fonts with HTTP403. Do not represent that as an integrated pass.

1. Inspect Git status and preserve all local work. Fetch/merge latest main
   into the SAME feat/enzo-ui-planner-notebook branch. Resolve the parallel
   bootstrap conflicts without replacing main's integrated foundation.
2. Keep canonical main core/models/MissionService.initialize/route.ts/
   validation.ts, data references, versioned storage/export behavior and
   regression tests. Keep package/lock/dependencies including Leaflet.
   Do not retain alternate route/storage helpers as competing mission logic.
   Adapt planner to routePoints from core/route. Root initializes once.
3. Reuse your components under ui/, planner/ and notebook/. Keep the theme
   service UI-only under ui/, updating imports; no mission-core replacement
   or independent mission localStorage. Use existing readonly signals/actions.
4. Replace the shell placeholder with existing MapComponent exactly once.
   Preserve Willy's readiness guard, local image handling and coordinates.
   A narrow root exception permits app.ts/html/scss/spec.ts only to mount
   the shell, size it and test integration while preserving initialize().
   Do not leave an old root map mount alongside the shell's map.
5. Add a contextual science list for all3 actual records. selectMarker(id)
   opens source/evidence details even with position:null. Do not fabricate
   pins or turn context selection into a route destination.
6. Preserve notebook drafts across tab changes and failed saves. Current
   @switch teardown must not erase drafts. Clear only after confirmed
   addObservation success. Keep draft state UI-only, not another mission store.
7. Apply one viewport-aware sidebar rule to pointer, keyboard, restored
   widths and resize. Keep narrow/tablet layout usable, keyboard focus
   visible and touch controls readable. Preserve dark/light styling.
8. Remove the external Google Fonts import. Use system/local licensed fonts
   so production build and prepared UI do not depend on that network fetch.
   Do not disable TLS verification or invent successful build outcomes.
9. Preserve actual assessment warnings and unavailable metric/terrain data.
   Do not implement a separate worker or fabricate an offline readiness API;
   installation/cache lifecycle remains coordinator-owned.
10. Run baseline+UI tests and production build. Add meaningful regressions
    for tab/failed-save draft retention, unlocated record selection, canonical
    core integration, viewport sizing and single real-map mounting. Browser
    check image, route interaction, science, notes/recovery/export, failures,
    themes and responsive layout. Record actual results and pending checks.

Commit/push only feat/enzo-ui-planner-notebook and hand off the commit,
resolved conflicts, changed files, checks and remaining blockers. This
feature push is authorized; no main merge, deployment, submission or
messaging without applicable authorization. Keep completed work intact.
```
