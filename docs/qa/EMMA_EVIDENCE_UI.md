# Emma science & evidence workspace — QA verification and integration handoff

**15 November current integration:** all submitted code is merged in `b744b0b`; 131 Angular tests, 28 data tests, build and browser checks pass. [Final evidence](FINAL_BRANCH_INTEGRATION.md). Counts/revisions below describe their earlier tested scopes.


Date: **14 November 2026**. Verified branch **`feature/emma-science-evidence-workspace`**, based on main commit **`584f24b`** (`584f24b994adaf53475efc173167fe11a83f77b1`). Emma uses he/him.

This audit covers the 12 Angular files in `src/app/science/` and `src/app/evidence/` present in the working tree before commit (`4` modified files in `src/app/science/`, `8` new untracked files in `src/app/evidence/`), plus the real `public/data/manifest.json` and `public/data/markers.json` served in the production build. Root, core, map, source-data, and package files (`src/app/app.*`, `src/app/core/*`, `src/app/map/*`, `public/data/*`, `package.json`) are untouched on this branch.

## Deliverable inventory and SCSS style sizes

| File                                                        | Role                                                                       | Notes / SCSS size                                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/app/science/science-context.component.ts`              | Standalone `ScienceContextComponent` (`app-science-context`)               | Live `recordBadge`, verified vs illustrative breakdown, search & filter signals, retained hidden selection |
| `src/app/science/science-context.component.html`            | Discovery controls, record list, retained details, error/empty states      | Native `<button type="button">`, labeled `<input>`/`<select>`, safe HTTPS links                            |
| `src/app/science/science-context.component.scss`            | Scoped component styles (`3,430` bytes)                                    | Under Angular's `4 kB` (`4,096 B`) `anyComponentStyle` warning budget                                      |
| `src/app/science/science-context.component.spec.ts`         | Behavioral unit tests (`12` tests)                                         | Retains all `7` accepted tests + `5` new discovery/filter/hidden-selection tests                           |
| `src/app/evidence/exploration-confidence.component.ts`      | Standalone `ExplorationConfidenceComponent` (`app-exploration-confidence`) | Reads only `dataStatus()`, `dataError()`, `image()`, `route()`, `assessment()`                             |
| `src/app/evidence/exploration-confidence.component.html`    | Read-only confidence summary, terrain/distance limits, warnings            | Visual review only; zero safety ratings, percentages, or `SAFE` output                                     |
| `src/app/evidence/exploration-confidence.component.scss`    | Scoped component styles (`3,050` bytes)                                    | Under Angular's `4 kB` (`4,096 B`) `anyComponentStyle` warning budget                                      |
| `src/app/evidence/exploration-confidence.component.spec.ts` | Behavioral unit tests (`7` tests)                                          | Covers state handling, route updates, derived `0 m`, coverage, deduplicated warnings, XSS, readonly        |
| `src/app/evidence/image-passport.component.ts`              | Standalone `ImagePassportComponent` (`app-image-passport`)                 | Reads only `image()`, `dataStatus()`, `dataError()`; uses shared `https()` helper                          |
| `src/app/evidence/image-passport.component.html`            | Provenance card for actual `ImageManifest` fields                          | Pixel dimensions, coordinate convention, coverage, calibration, limitations, terrain boundary              |
| `src/app/evidence/image-passport.component.scss`            | Scoped component styles (`3,120` bytes)                                    | Under Angular's `4 kB` (`4,096 B`) `anyComponentStyle` warning budget                                      |
| `src/app/evidence/image-passport.component.spec.ts`         | Behavioral unit tests (`6` tests)                                          | Covers manifest fields, loading/error/null states, `null` dates, calibration, no v2/byte totals, readonly  |

## Specification compliance audit

- **`ScienceContextComponent` (`app-science-context`)**:
  - Live `recordBadge` computes from `mission.markers()` (`3 records (0 located on image)` with shipped data), never counts `position === null` or `positionStatus === 'unavailable'`, and visibly distinguishes `verified` vs `illustrative` counts when located records exist without equating `located` with `verified`.
  - Case-insensitive search covers `name`, `finding`, `instrument`, and `source.title`; composes cleanly with `evidenceType` and `positionStatus` filters without mutating `markers()`.
  - Displays `Showing N of M`, a `Clear filters` control (resets filters only without clearing `selectedMarkerId` or touching route/mode/layers/observations/image), and a `.no-matches` state distinct from empty/loading/unavailable/error states.
  - Preserves selected record details when filters hide its list button, displays `.hidden-notice` with a `Clear filters` button, retains the missing-selected-ID fallback, uses native `<button type="button">` controls with `aria-pressed`, safe HTTPS links, and plain-text interpolation.
- **`ExplorationConfidenceComponent` (`app-exploration-confidence`)**:
  - Reads strictly `dataStatus()`, `dataError()`, `image()`, `route()`, and `assessment()`.
  - Clearly states **Visual review only** and that missing hazard/terrain information does not establish route safety; never invents safety scores, percentages, or a `SAFE` classification.
  - Displays read-only `start`, `destination`, and `waypoints` count without editing; shows derived planar distance only when `distanceStatus === 'derived'` and `planarDistanceMeters` is finite (accepting `0` as valid `0 m`), states its verified-calibration basis, and distinguishes planar distance from terrain-following distance.
  - Keeps metric distance unavailable when calibration is unverified, keeps elevation/slope/terrain distance unavailable even when planar distance is calibrated, notes that display offsets and image brightness are not elevation, distinguishes `verified-aoi` from `regional-context` and missing manifest, deduplicates warnings via `Set` while preserving full wording, handles `loading`/`unavailable`/`error`/`ready`+`dataError`/incomplete routes, and explicitly rejects PWA/offline readiness inference.
- **`ImagePassportComponent` (`app-image-passport`)**:
  - Reads strictly `image()`, `dataStatus()`, and `dataError()`.
  - Renders actual `ImageManifest` fields only (`source.title`, safe HTTPS `source.url` via `https()`, `source.credit`, connectivity note, `imageRef`, `width × height pixels` labeled **Pixel dimensions**, `coordinateSystem`, `observationDate || 'Unavailable'`, `coverageStatus`, `calibration`, `limitations`).
  - Contains no hardcoded byte totals (`524,472`), SHA-256 hashes, processing lineage, proposed v2 fields, or PWA cache readiness claims; states that a verified terrain product is not supplied, image brightness is not elevation, pixel dimensions are not spatial resolution, and manifest metadata does not prove map raster display or offline readiness.

## Automated checks

Executed directly in `c:\Users\TOUTENUN\Desktop\Project\Mars_Walk\NASA_SAPCEAPP_-MARS_WALK-` against the current working tree:

- `npx prettier --check src/app/science/* src/app/evidence/*`: **passed** (`All matched files use Prettier code style!`).
- `NG_CLI_ANALYTICS=false npm test`: **7 test files passed, 69 tests passed** (`0` failures, `0` skipped):
  - `src/app/core/mission.service.spec.ts`: `14` passed
  - `src/app/core/route.spec.ts`: `4` passed
  - `src/app/map/map.component.spec.ts`: `22` passed
  - `src/app/app.spec.ts`: `4` passed
  - `src/app/science/science-context.component.spec.ts`: `12` passed
  - `src/app/evidence/exploration-confidence.component.spec.ts`: `7` passed
  - `src/app/evidence/image-passport.component.spec.ts`: `6` passed
- `NG_CLI_ANALYTICS=false npm run build`: **passed**.
  - `main-GKOUWW46.js`: `433.10 kB` raw (`113.79 kB` estimated transfer)
  - `styles-53IXKEPT.css`: `11.31 kB` raw (`2.41 kB` estimated transfer)
  - Initial total: **`444.41 kB`** raw (`116.19 kB` estimated transfer), within the `500kB` initial warning budget.
  - Zero component-style budget warnings; only the pre-existing `leaflet` CommonJS optimization warning (`src/app/map/map.component.ts`).
  - Note: `app-exploration-confidence` and `app-image-passport` are not mounted in `src/app/app.html` on this branch, so the production bundle checks compilation/typechecking for them via specs and TypeScript, while `main-GKOUWW46.js` bundles the currently mounted `App` (`app-map` + `app-science-context`).

## Production-browser outcomes (`app-science-context`)

Served `dist/marswalk/browser` over local HTTP (`127.0.0.1`) and drove **Headless Chrome `157.0.8103.52` (`HeadlessChrome/157.0.0.0`, Windows 64-bit)** via Chrome DevTools Protocol against the real `manifest.json`, `markers.json`, and imagery:

| Scenario                                                                                     | Actual outcome                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial mount at `1366 × 1100`                                                               | Badge rendered `3 records (0 located on image)`, `Showing 3 of 3`, `Clear filters` disabled, no position breakdown line (`0` located), `3` native `<button type="button">` record buttons with `aria-pressed="false"`, `Focus Route` disabled, `0` overflow |
| Keyboard search (`boxwork`)                                                                  | Typing in `Search records` filtered live to `Showing 1 of 3` (`Mount Sharp Boxwork Ridges and Hollows`) and enabled `Clear filters`                                                                                                                         |
| Keyboard `Tab` + `Enter` on `Clear filters`                                                  | Visible focus ring (`3px solid rgb(240, 171, 125)`) reached `Clear filters`; `Enter` reset search to `""`, restored `Showing 3 of 3` and `3` buttons                                                                                                        |
| Filter `measured` + keyboard `Enter` select                                                  | Filtered to `Vera Rubin Ridge ('Pettegrove Point' / 'Ailsa Craig' Target)`, `Enter` set `aria-pressed="true"`, opened details, safe HTTPS link (`target="_blank"`, `rel="noopener noreferrer"`)                                                             |
| Hidden selected record (`derived` filter)                                                    | List filtered to `Glen Torridon...` (`Showing 1 of 3`); selected `Vera Rubin Ridge` details remained visible with `.hidden-notice` and `Clear filters` action                                                                                               |
| Tablet `820 × 1180` (with details + hidden notice open)                                      | `docScrollWidth: 805 <= 820`, `scScrollWidth: 739 <= 739` — zero page or component horizontal overflow                                                                                                                                                      |
| Narrow `320 px` panel inside `390 × 844` mobile viewport (with details + hidden notice open) | `docScrollWidth: 390 <= 390`, `scScrollWidth: 320 <= 320` — zero overflow; all buttons, search input, and selects rendered `>= 44 px` tall inside `320 px` bounds                                                                                           |
| Zero-match search (`zzznonexistent`) while selected                                          | Displayed `.no-matches` (`Showing 0 of 3`) rather than `.science-empty`, while keeping selected details and `.hidden-notice` accessible                                                                                                                     |
| Keyboard `Enter` on hidden-notice `Clear filters` + `Clear selection`                        | Restored all `3` buttons with `Vera Rubin Ridge` still `aria-pressed="true"` and `Focus Route` still disabled; `Enter` on `Clear selection` returned `.science-no-selection`                                                                                |
| Controlled failed `markers.json` request                                                     | Displayed `0 records (0 located on image)`, `role="alert"` banner `Science records could not be loaded or validated.`, `.science-empty` fallback, `0` fabricated buttons                                                                                    |
| Uncaught runtime exceptions (normal run)                                                     | `0` (`Runtime.exceptionThrown` count `0`)                                                                                                                                                                                                                   |

## Pending verification

- **PENDING — Runtime browser verification of `ExplorationConfidenceComponent` and `ImagePassportComponent` inside the integrated shell**: both components are verified here through standalone Angular component specs (13 total evidence unit tests against mocked `MissionService`) because `src/app/app.*` is untouched by Emma's branch. Once Enzo or the coordinator mounts them in the shell, run a production-browser check verifying live layout, contrast, keyboard focus, and narrow/tablet overflow for both panels.
- **PENDING — Physical-device checks**: real demonstration tablet touch, viewport behavior, font legibility, and hardware performance (only desktop/emulated Headless Chrome viewports ran).
- **PENDING — PWA installation and offline reopening**: service-worker registration, verified cache asset completeness, disconnected close/reopen, and offline export/recovery remain coordinator-owned and unrun.
- **PENDING — Outside-user usability sessions**: three-participant testing (`docs/USABILITY.md`) awaits the integrated offline PWA.

## Shell integration instructions for Enzo and Coordinator

Import the three standalone components (none accept or require `@Input()` properties, and none call `MissionService.initialize()`):

| Exported class                   | Selector                     | Import path from `src/app/app.ts`               | Import path from `src/app/ui/shell/shell.component.ts`                  |
| -------------------------------- | ---------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `ScienceContextComponent`        | `app-science-context`        | `'./science/science-context.component'`         | `'../../science/science-context.component'`         |
| `ExplorationConfidenceComponent` | `app-exploration-confidence` | `'./evidence/exploration-confidence.component'` | `'../../evidence/exploration-confidence.component'` |
| `ImagePassportComponent`         | `app-image-passport`         | `'./evidence/image-passport.component'`         | `'../../evidence/image-passport.component'`         |

### Placement guidance relative to `src/app/app.html`

1. **Keep a single `<app-science-context />` mount**:
   - `src/app/app.ts` already imports `ScienceContextComponent`, and `src/app/app.html` mounts `<app-science-context />` once (line 21, immediately after `<app-map />`). Keep exactly one instance when integrating Enzo's shell; do not duplicate science lists or detail views.
2. **Replace the temporary root confidence block with `<app-exploration-confidence />`**:
   - In `src/app/app.html`, lines 64–72 currently render a placeholder `<section aria-labelledby="assessment">...</section>` (`Exploration confidence`). Replace that temporary section with `<app-exploration-confidence />` (or mount `<app-exploration-confidence />` in the confidence slot of Enzo's shell while removing the placeholder section so there are never two confidence panels).
3. **Place `<app-image-passport />` in the Data Passport / image metadata area without duplicating manifest metadata**:
   - Place `<app-image-passport />` once in the shell's Data Passport / metadata drawer or section.
   - In `src/app/app.html`, lines 7–19 (`<section aria-labelledby="status">`) currently inline `image.source.title`, pixel dimensions, and `image.imageRef` alongside `Mission data` status/error messages. Avoid rendering a second competing manifest metadata block alongside `<app-image-passport />` (keep high-level `dataStatus()`/`dataError()` or shell status bar if needed, and let `<app-image-passport />` own the detailed `ImageManifest` provenance presentation).
4. **Shared state & lifecycle boundaries**:
   - Keep `MissionService.initialize()` called **once** at root (`src/app/app.ts` lines 20–22).
   - Do not create competing mission, confidence, or passport stores, and update root integration tests in `src/app/app.spec.ts` when replacing `app.html`'s temporary assessment section to assert `<app-exploration-confidence>` and `<app-image-passport>` render cleanly with the real `MissionService`.


## Later coordinator integration verification

The submission at `3b7b1c1` is approved and mounted in code `85561a6`. Both evidence panels now have real-service root and production-browser verification: 81 combined tests, production build and actual recovery/filter/metadata/layout checks pass. See [RECOVERY_EVIDENCE_INTEGRATION.md](RECOVERY_EVIDENCE_INTEGRATION.md). The earlier unmounted-panel status above records the contributor's original branch; it is not the current main integration state. Nested-shell import paths in the handoff table have been corrected to `../../science/` and `../../evidence/`. Physical/PWA/outside-user outcomes remain pending.
