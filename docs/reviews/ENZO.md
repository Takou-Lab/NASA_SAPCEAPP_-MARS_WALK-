# Enzo review — final shell integrated

## Verifier correction fc79cf8 — accepted

Reviewed 15 November 2026 against main 7f6ff5d. The genuine Uint8Array brand check and local copy resolve the cross-realm rejection without accepting DataView, strings, signed/clamped or wider typed arrays. Same/foreign-realm subarrays verify only their actual byte windows. Existing index/size/hash/UTF-8/identity/fail-closed/read-only checks are preserved.

**New integrated results:** `npm test` passes **193 tests across 17 files**, including all 49 verifier cases. `npm run build` and `npm run build -- --base-href /marswalk/` both pass full-pack verification, 18 assets each; initial 433.80 kB, unchanged budgets and Leaflet CommonJS warning. Root pack stays 2d175fcf490e (1,655,365 bytes), subpath 37d7e7239de0 (1,655,374 bytes): this verifier is not mounted or bundled into the current runtime. Linux coordinator checks close the integration gate; Enzo's missing local Windows Three.js install remains a local setup issue. These checks do not claim physical/device or new live-browser acceptance.

Previous c35b021 correction request below is closed by fc79cf8. Accepted scope is a pure image-payload verifier, not complete offline readiness or independent scientific validation. Coordinator owns any future composition into cache lifecycle; do not wire it into root/worker without agreement. No deployment occurred.

Next unblocked Enzo slice: simplify default confidence/evidence explanations in his owned templates and coordinate wording with Emma. Show route state/main limitation/next step first, keep detailed limitations and sources accessible, preserve unavailable metrics and no safety classification. Emma retains the three shared SCSS theme fixes. Environmental runtime work remains blocked on verified sources/schema. Continue presentation/mission story from actual capabilities; official challenge contents/deadline remain unverified. Preserve unpublished work and incorporate published main safely before the next slice.


## Current verifier review — corrections required (`c35b021`)

Reviewed 15 November 2026 against main `ac79be5`, using a temporary clean merge that was aborted after verification. The branch is published, but **not accepted or merged**. Existing integrated shell work below stays accepted.

- `npm test`: **176 passed, 11 failed / 187 tests**, 16 passing files and one failing file. All failures are in the new 43-test verifier suite. The existing 144 tests pass.
- `npx vitest run --environment node src/app/offline/image-payload-verifier.spec.ts`: **43 passed**. Node-only success does not establish Angular-suite compatibility.
- `npm run build` and `npm run build -- --base-href /marswalk/`: **both pass**, including full pack verification (18 assets each). Locked Three.js is available in the coordinator environment; no dependency change needed. These are Linux results, not Enzo's Windows results.

**Required fix:** `bytes instanceof Uint8Array` rejects the manifest bytes produced by TextEncoder in the integrated Angular/jsdom environment. Successful verification returns “The supplied asset reader did not return bytes” before hashing; corruption/manifest-identity checks also fail at the wrong stage. Resolve the realm/type mismatch using a justified byte-validation/normalization approach and/or consistent test fixtures. Do not accept strings, DataView or arbitrary typed arrays as byte payloads, and do not bypass SHA-256 or weaken failure assertions. Verify valid Uint8Array views/subarrays and rejection of invalid reader values; retain exact-size/hash/identity checks, read-only behavior and fail-closed results.

Continue `feature/enzo-image-payload-verifier`, preserve local work, and rerun the focused suite, full `npm test`, root build and `/marswalk/` build after correction. Record actual platform/results and remaining local registry blockers. Push a new commit for review. No deployment was performed. Finish this correction before environmental integration; use only separately reviewed scientific datasets.


<!-- CURRENT_WORK_PLAN -->
> **Published-commit review record.** Current work and file ownership follow [the team plan](../../TEAM_TASKS.md); historical findings below are not new assignments.
<!-- /CURRENT_WORK_PLAN -->

**15 November integration update:** latest `16a2e66` passes 81 isolated branch tests/build and is merged into **`b744b0b`**. The coordinator resolved root conflicts, replaced duplicate presentation with the reviewed shared panels and retained transfer/drafts/navigation. Final integration passes **131 Angular tests, 28 data tests, build and actual browser workflow checks**. [Evidence](../qa/FINAL_BRANCH_INTEGRATION.md). The older integration gate below is closed. The user subsequently swapped remaining tasks: Enzo now owns [image-payload verification](../team/tasks/ENZO_IMAGE_PAYLOAD_VERIFIER.md) and science/environment/AI/presentation follow-ups; Emma owns release UI work. [Current Enzo plan](../team/ENZO.md).

## Historical 14 November review — superseded where noted

Reviewed **14 November 2026 (Africa/Douala)**. Published tip **`bcac915644ec58853033879184773564f50bb738`** on **`feat/enzo-ui-planner-notebook`**, compared with main **`584f24b`**. Verdict: **retain the corrected UI; finish the bounded integration below before merging or starting a new task**.

## Previous findings closed

| Earlier finding | Verified result in `bcac915` |
| --- | --- |
| Duplicate mission foundation/storage | Canonical core/models/validators/route helpers retained from main; alternate route/storage helpers removed; theme stays under UI |
| Decorative map placeholder | One actual MapComponent mounted; real delivered JPEG and click-to-draw route work |
| External Google Fonts build failure | Removed network font import; frozen install and production build succeed |
| Inaccessible unlocated science | All three records selectable with source/limits; selection preserves route/notes. Replace this branch's interim list with the accepted shared science component during current-main integration |
| Draft loss on tabs / failed save | Notebook remains mounted; exact draft survives both cases. Successful save clears and exports the note |
| Keyboard/restored sidebar width | At 820px, End/ArrowLeft clamp to 520px and reserve 300px for the workspace. Reloaded width remains clamped |

**Do not repeat those fixes or rebuild the UI.** They are useful completed work.

## Historical integration gate — now closed

This revision merged main only through **`f65778d`**. Current main adds accepted map navigation, guarded mission-file transfer and Emma's mounted science component. A read-only merge preview against `584f24b` has **four conflicts**, all in root `src/app/app.ts`, `app.html`, `app.scss`, `app.spec.ts`. No feature code was merged during this review.

1. Preserve local work and merge latest main into the **same feature branch**, without reset or force push. Resolve the four root conflicts while preserving current canonical core, dependencies, source assets and every accepted regression.
2. Keep single `initialize()` and one actual map. Preserve main's file import/export capability, 1 MiB limit, asynchronous file-read guard, replacement warning, actual error feedback and `MissionService.importMission()` semantics. Make it reachable in the shell; do not simply replace the root with the older `<app-shell />` and lose transfer.
3. Use main's reviewed **ScienceContextComponent** (`app-science-context`) exactly once instead of the interim list/details in your confidence component. Do not edit Emma's files or implement her newly assigned discovery/confidence/image-passport components. Future evidence components are not yet implemented; retain truthful current warnings/provenance until reviewed replacements exist.
4. Preserve map Reset View/Focus Route, readiness checks, shared note/route recovery and drafts. Adapt root/shell tests to actual mounting without dropping current mission-import/science regressions. Run the full reconciled suite/build and repeat the normal route → science → note → save/load/export/import workflow.
5. Keep unsupported grid data labeled unavailable instead of offering an enabled control that implies a supplied grid. Remove the notebook placeholder's unverified `15m NW` example; use descriptive notes without invented distance/direction. These are small interface corrections inside your ownership.

The branch build passes with **547.84 kB** initial assets, exceeding the 500 kB warning budget; four component styles also exceed their warning budgets, all below error thresholds. Reduce avoidable duplication/styles during integration where practical; do not raise budgets or claim these warnings are failures. The existing Leaflet CommonJS warning remains.

## Actual verification

Isolated extraction of the published branch; no teammate files or branches changed:

```sh
NG_CLI_ANALYTICS=false npm_config_cache=/workspace/.npm-cache npm ci --no-audit --no-fund
NG_CLI_ANALYTICS=false npm test
NG_CLI_ANALYTICS=false npm run build
python3 -m http.server 8019 --bind 127.0.0.1 --directory dist/marswalk/browser
```

- **57 tests passed across 10 files**; production build passed with warnings above.
- Production Chromium: one real map, no placeholder; all three unlocated science records selectable without route/note mutation.
- Actual map clicks set start/waypoint/destination. Save → clear → load restores the route; export preserves unavailable metric distance.
- Exact unsaved draft survives a tab round trip and simulated storage failure plus tab round trip. Restoring storage and saving clears the draft and exports one note.
- Keyboard End/ArrowLeft at 820px reserves 300px of workspace. Restored width remains clamped; 390px viewport has no page overflow. Normal run had no page errors.

Browser checks used the branch's actual local data, not intercepted scientific fixtures. A controlled storage-failure shim was limited to temporary mission storage in an isolated profile. These checks do not prove current-main reconciliation, physical-device behavior, installation or disconnected reopening.

## Next action

Finish the integration gate on **`feat/enzo-ui-planner-notebook`**, then commit/push only that branch and provide the new commit, resolved conflicts and actual integrated checks. Do not start another task branch yet. [Updated prompt](../team/ENZO.md). Main integration, deployment and external messaging remain separate.

---

# Historical review — `15b1666` (superseded by the review above)

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

**Assignment update:** implementation of the contextual list/details is now transferred to Emma under `src/app/science/`. Enzo retains integration of her reviewed component and removal of duplicate selected-record UI. This finding remains open until that component is available and mounted; do not have both contributors implement the same feature.

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
