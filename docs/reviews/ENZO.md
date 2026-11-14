# Enzo branch review — changes required

Reviewed **14 November 2026**. Branch: `feat/enzo-ui-planner-notebook`. Tip: **`15b166656b78236c4b3462e274ac81eb583e33b6`**. Integration baseline: `main` at **`ee9f6ae860a76d96baa9eb80828d2a98c3fa9e6e`**.

**Verdict: keep the UI contribution, correct the integration and regressions on the same feature branch, then request re-review. Do not merge this revision or start another application/feature branch.**

The planner, confidence cards, notebook, theme and responsive layout are useful work. Unknown terrain/calibration are labeled unavailable; the UI does not falsely claim an installed or offline-ready PWA. The following concrete issues prevent approval.

## 1. High priority — port UI onto the existing foundation

The branch is based on the documentation-only commit `015c022`, before the shared Angular foundation. It introduces another bootstrap, dependency set, models, mission service and persistence implementation. A read-only merge preview reports **16 add/add conflicts**, including package/lock/config files, root assembly and shared core.

Evidence in the reviewed branch:

- `src/app/core/mission.service.ts:65–115` initializes itself through `initData()` instead of main's root-called, idempotent `initialize()`. It accepts a manifest based only on schemaVersion and accepts any marker array, losing main's runtime validation.
- `src/app/core/storage-helpers.ts:23–47` silently converts malformed route fields to null/empty arrays and accepts points without the active raster bounds. Reproduced malformed and out-of-bounds routes being accepted.
- `storage-helpers.ts:146–163` accepts observations with a conflicting inner imageRef, blank text, invalid date and out-of-bounds position. Default localStorage parameters also evaluate before the helper's try/catch.
- `src/app/planner/route-planner.component.ts:4` depends on the duplicate route helper instead of main's `routePoints` helper.

**Correction:** preserve `src/app/ui/`, `src/app/planner/` and `src/app/notebook/`, but reconcile with current main's models, MissionService, route/validation helpers, persistence behavior, package/lockfile and Leaflet dependency. Retarget planner imports to `routePoints` from `core/route`. Do not repair and retain a competing persistence system. UI theme state can live under `src/app/ui/` rather than expanding mission-core ownership.

Keep main's regression tests and image-readiness guard. Do not overwrite completed teammate code or reset away this UI work.

## 2. High priority — replace the placeholder with the real map

`src/app/ui/shell/shell.component.html:11–40` renders a decorative `map-placeholder`; the shell does not import or mount Willy's MapComponent. The branch's package file also omits Leaflet.

In Chromium with the real manifest and records supplied through intercepted requests, metadata reached Data Ready but there were **zero `app-map` elements** and one placeholder. A user cannot draw an actual route through this interface.

**Correction:** import the existing standalone MapComponent into ShellComponent and mount its actual selector once. Coordinate the minimal root shell mount while preserving the existing root's single `MissionService.initialize()` call. Remove the competing root-level map instance if the shell becomes its owner. Do not rebuild Willy's component or change the image bytes/reference.

## 3. High priority — production build depends on external fonts

`src/styles.scss:1` imports Google Fonts. Frozen-lockfile installation passed, but `npm run build` failed while fetching that stylesheet with HTTP **403** in this environment. This is a network-dependent font build failure, not a TypeScript test failure.

**Correction:** use a system-font stack or properly licensed local font assets. Preserve Leaflet's stylesheet and the desired theme variables. Do not merely disable font inlining while leaving required runtime fonts remote; essential PWA rendering must work without that external request. Rerun the actual production build.

## 4. High priority — unlocated science records cannot be opened

`src/app/ui/confidence-panel/confidence-panel.component.html:125` displays only an already-selected marker. No UI action selects a non-null science ID. All three real records have unavailable positions and therefore correctly produce no map pins.

In the browser check, none of the three record titles appeared as selectable context even after the records loaded.

**Correction:** list all contextual science records with accessible selection calling the existing `selectMarker(id)`. Show their sources, evidence type, limitations and unavailable location. Selecting a contextual record must not invent a position or change the route destination.

## 5. Medium priority — switching tabs loses observation drafts

The notebook draft is component-local (`notebook.component.ts:22`), while `shell.component.html:124–134` uses `@switch` to destroy the inactive panel.

Reproduced in Chromium:

1. Open Notebook and type an observation without saving.
2. Switch to Route Planner and return to Notebook.
3. The draft is empty.

Also reproduced after a simulated failed save: the draft initially remains, then disappears when switching tabs.

**Correction:** retain the notebook component while tabs change, or lift draft state into stable shell/UI ownership. Do not create another mission store. Test ordinary unsaved drafts and failed-save drafts across a round trip between tabs, and clear only on confirmed save or explicit user action.

## 6. Medium priority — clamp all sidebar resizing to the viewport

`src/app/ui/shell/shell.component.ts:135–150` permits a static 750px width through the keyboard; the pointer path uses `min(750, window.innerWidth - 280)`. Restored widths are also checked only against the static range.

Reproduced at an 820px Chromium viewport: pressing End expanded the sidebar beyond 740px and left less than 80px for the map workspace.

**Correction:** use a shared viewport-aware clamp for pointer, keyboard, reset, restored state and viewport changes. Preserve a usable map area on the target tablet size. Test End/arrow navigation and restoring a desktop width on a narrower viewport. Keep touch and keyboard behavior consistent.

## Verification performed

The branch was extracted into a separate temporary directory. Its source/lockfile were not changed; no worktree was created and no feature code was merged.

| Check | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Passed with the committed lockfile |
| `npm test -- --watch=false` | **47 tests passed** across 10 files |
| `npm run build` | **Failed**: external Google Fonts stylesheet returned 403 |
| Development server | Started successfully |
| Chromium with real manifest/records intercepted from main | Placeholder map and inaccessible science context reproduced |
| Chromium notebook/tab checks | Unsaved and failed-save drafts lost after tab switch |
| Chromium keyboard resizing at 820px width | End expanded sidebar beyond 740px, leaving less than 80px for the map |
| Read-only merge preview | 16 add/add conflicts; no actual branch merge performed |

The browser inspection blocked the external font request and used the development server to inspect UI behavior; it does not validate a production release, installed PWA or offline reopening. Scientific fixtures were supplied only to the temporary browser session, not committed as invented data.

## Repair order and completion gate

1. Preserve the current branch/UI and integrate current main without replacing the canonical core/dependencies.
2. Mount the real map once and wire the existing service/route helpers.
3. Remove the external font dependency and obtain a production build pass.
4. Add contextual science selection and preserve drafts across tab changes.
5. Unify sidebar clamps and add focused regression coverage.
6. Run main's existing regressions plus adapted UI tests and browser checks with real local data: draw route, inspect unlocated science, save/load, recover note, export, and retain draft on failure.
7. Push the corrected **same branch** and provide its commit for re-review. Count only tests that actually ran.

Only after those checks pass should the contribution be approved and a new assignment/branch be selected. Enzo's existing implementation should be adapted, not thrown away.

Full coding-agent handoff: [ENZO.md](../team/ENZO.md). Current project review: [REVIEW.md](../../REVIEW.md).
