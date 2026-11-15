# W4 Release UI — Accessibility, Design Specification, and Verification

## Coordinator integration acceptance — 59e00e1

15 November 2026: merged with main 1f6c81a, 208 Angular tests pass; production build/full pack pass, initial 442.83 kB. Coordinator browser keyboard/disclosure/draft/error/save/export/transfer/mobile-both-theme and disconnected full-process recovery pass. [Full review and limits](../reviews/EMMA.md#phase-2-59e00e1--accepted-and-integrated). Existing viewport/contrast figures below are contributor-reported evidence. No deployment or physical-device/outside-user acceptance claimed.

Date: **15 November 2026**.  
Branch: **`feature/emma-release-ui`** (based on `origin/main` commit **`ac79be5`**).  
Commit SHA: **`bb599a9`** (and amended head).  
Scope: **W4 Phase 1 & Phase 2** (Emma, he/him — release accessibility, size cleanup, shared visual specification, header readiness clarity, environmental/PWA integration slots, and delegated light/dark SCSS fixes).

---

## 1. Scope, Deliverable Inventory, and File Ownership

Phase 1 (`cdd2417`) was accepted and integrated into `origin/main` at `be4ac2b`. Phase 2 delivers consistent professional design, truthful readiness indicators, coordinator mounting slots, and delegated SCSS theme repairs.

`git status --short` confirms strictly the 21 owned files were modified. Zero unowned core, app, map, 3D, root, package, or data files were touched, and zero `.ts`/`.html`/`.spec.ts` files under `science/` or `evidence/` were modified:

| Component / Path                       | Files modified                                                                                                                                                                                        | Phase 2 Deliverable & Role                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Header**                             | `src/app/ui/header/header.component.ts`<br>`src/app/ui/header/header.component.html`<br>`src/app/ui/header/header.component.scss`<br>`src/app/ui/header/header.component.spec.ts`                     | Injected `PwaService` read-only (zero duplicate action buttons); clarified metadata vs network vs offline pack states; added `.mission-meta` group with truthful `.status-info` for loaded metadata, `.status-neutral` for connection, and `.status-ready` strictly when offline pack is verified; conditional PWA status flags (`Install Available`, `Update Waiting`, error guidance).          |
| **Shell**                              | `src/app/ui/shell/shell.component.ts`<br>`src/app/ui/shell/shell.component.html`<br>`src/app/ui/shell/shell.component.scss`<br>`src/app/ui/shell/shell.component.spec.ts`                             | Reserved coordinator `<ng-content select="[pwa-status]"></ng-content>` slot; projected `<ng-content select="[environmental-context]"></ng-content>` into confidence panel; guarded `stopResize()` so `ngOnDestroy()` never writes to `localStorage` unless an active resize occurred; updated `.panel-toggle-btn` for WCAG 2.5.3 Label-in-Name consistency; added footer readiness boundary text. |
| **Confidence Panel**                   | `src/app/ui/confidence-panel/confidence-panel.component.html`<br>`src/app/ui/confidence-panel/confidence-panel.component.scss`                                                                        | Projected `[environmental-context]` and placed themed `.env-slot-card` with `Pending verified dataset` badge and explicit no-simulation notice between exploration confidence and science context.                                                                                                                                                                                                |
| **Route Planner**                      | `src/app/planner/route-planner.component.ts`<br>`src/app/planner/route-planner.component.html`<br>`src/app/planner/route-planner.component.scss`<br>`src/app/planner/route-planner.component.spec.ts` | Exposed `dataStatus`/`dataError`; added reactive `nextActionHint()` banner providing one clear next action per state; aligned action button `aria-label`s for WCAG 2.5.3 Label-in-Name; maintained `< 4 kB` SCSS.                                                                                                                                                                                 |
| **Notebook**                           | `src/app/notebook/notebook.component.ts`<br>`src/app/notebook/notebook.component.html`<br>`src/app/notebook/notebook.component.scss`<br>`src/app/notebook/notebook.component.spec.ts`                 | Exposed `dataStatus`/`dataError`; added reactive `nextActionHint()` banner and metadata state notices while preserving exact draft in editor; updated `.submit-btn` `aria-label` for WCAG 2.5.3 Label-in-Name; maintained `< 4 kB` SCSS.                                                                                                                                                          |
| **Science Context** (SCSS only)        | `src/app/science/science-context.component.scss`                                                                                                                                                      | Delegated styling exception: replaced hardcoded dark hex values with shared CSS variables (`--bg-card`, `--bg-surface`, `--text-primary`, `--text-secondary`, etc.) and scoped `:host` / `:host-context([data-theme='light'])` tokens (`--sc-accent`, `--sc-link`, `--sc-err`, `--sc-sel-bg`). Full light & dark theme contrast >= 4.5:1.                                                         |
| **Exploration Confidence** (SCSS only) | `src/app/evidence/exploration-confidence.component.scss`                                                                                                                                              | Delegated styling exception: replaced hardcoded dark colors with shared theme tokens and scoped `--ec-*` badge/error variables. Full light & dark theme contrast >= 4.5:1.                                                                                                                                                                                                                        |
| **Image Passport** (SCSS only)         | `src/app/evidence/image-passport.component.scss`                                                                                                                                                      | Delegated styling exception: replaced hardcoded dark colors with shared theme tokens and scoped `--ip-*` variables. Full light & dark theme contrast >= 4.5:1.                                                                                                                                                                                                                                    |

---

## 2. Shared Visual Specification (Willy, Enzo, Emma)

To guarantee aesthetic and systematic consistency across the application without introducing heavy external frameworks or fonts, all components adhere to the following shared specification:

### A. Color Palette & Semantic Tokens (from `src/styles.scss`)

- **Backgrounds**: `--bg-space` (viewport background), `--bg-surface` (workspace/header/table surface), `--bg-card` (elevated panels & cards), `--bg-card-hover` (interactive hover state).
- **Text**: `--text-primary` (`#f1f5f9` dark, `#0f172a` light — headers & key content), `--text-secondary` (`#94a3b8` dark, `#334155` light — labels, notes, metadata), `--text-muted` (`#64748b` — tertiary captions).
- **Accents**: `--mars-accent` (`#e05a47` dark, `#c2410c` light — primary mission branding & key actions), `--science-cyan` (`#06b6d4` dark, `#0284c7` light / `#0369a1` light text — science findings, raster tags, values).
- **Status Badges**:
  - _Loaded / Informational_: `--science-cyan` dot & border, cyan-tinted background (`.status-info`).
  - _Connection / Neutral_: `--text-secondary` dot & subtle border (`.status-neutral`).
  - _Verified / Success_: `--success-green` (`#10b981` dark, `#059669` light) dot & border, green-tinted background (`.status-ready`).
  - _Loading / Caution_: `--warning-amber` (`#f59e0b` dark, `#b45309` light) animated pulsing dot & amber border (`.status-loading`, `.badge-caution`).
  - _Error / Unavailable_: `--error-red` (`#ef4444` dark, `#dc2626` light) dot & border, red-tinted background (`.status-error`).

### B. Typography & Scale

- **Font Stack**: System UI (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) with monospace (`ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace`) for coordinates, dimensions, timestamps, and hashes.
- **Scale**:
  - Large headings (`h2`): `1.25rem` (`20px`), weight `700`, line-height `1.2`.
  - Section headings (`h3`): `1rem`–`1.1rem` (`16px`), weight `600`.
  - Body text: `14.5px` (`0.9rem`), line-height `1.5`, letter-spacing `-0.01em`.
  - Metadata labels & table text: `11px`–`12px`, weight `500`–`600`.
  - Badges & pills: `11px`–`12px`, padding `3px 8px` to `4px 10px`, border-radius `99px`.

### C. Spacing Scale & Density

- Base grid: `4px` / `8px` / `12px` / `14px` / `16px`.
- Card padding: `12px`–`14px` within sidebar panels; borders `1px solid var(--border-subtle)` with `border-radius: 8px` (`0.55rem`–`0.75rem`).
- Touch targets: All interactive elements (`button`, `input`, `select`, `textarea`, `.tab-btn`) maintain `min-height: 44px` and `min-width: 44px`.

### D. Focus & Accessibility

- Visible focus rings: `outline: 2px solid var(--border-focus)` (`#3b82f6` dark, `#2563eb` light) with `outline-offset: 2px` (or `-2px` for flush resizers and tabs).
- WCAG 2.5.3 (Label-in-Name): All button accessible names (`aria-label`) start with or contain their visible rendered text.

---

## 3. Coordinator Mounting Handoffs

1. **Relocating `<app-pwa-panel />`**:
   `src/app/ui/shell/shell.component.html` now reserves `<ng-content select="[pwa-status]"></ng-content>` immediately after `<app-header />`. The coordinator can relocate `<app-pwa-panel pwa-status />` from `src/app/app.html` into `app-shell` without duplicating action controls or breaking PWA service worker lifecycle management.
2. **Mounting Enzo's Environmental Panel**:
   `src/app/ui/shell/shell.component.html` projects `<ng-content select="[environmental-context]" environmental-context></ng-content>` into `<app-confidence-panel>`, which renders `<ng-content select="[environmental-context]"></ng-content>` alongside the clean `.env-slot-card` boundary. Once Enzo's component and schema are accepted, it mounts seamlessly into this reserved slot.

---

## 4. Automated Verification Results

All automated checks executed cleanly in `NASA_SAPCEAPP_-MARS_WALK-`:

- **Prettier Code Style**:
  `npx prettier --check` across all 21 modified files: **Passed** (`All matched files use Prettier code style!`).
- **Angular & Vitest Unit Tests**:
  `npm test` (`ng test --watch=false`): **16 test files passed, 158 tests passed** (`0` failures, `0` skipped).
- **PWA Service Worker Tests**:
  `npm run test:pwa` (`node --test tools/pwa/worker.test.mjs`): **11 tests passed** (`0` failures).
- **Production Build (`npm run build`)**:
  - `main-SU6BSXRL.js` (`main`): `427.80 kB` raw / `109.38 kB` transfer
  - `styles-2WTUZKL3.css` (`styles`): `13.85 kB` raw / `3.19 kB` transfer
  - **Initial total: `441.64 kB` raw / `112.57 kB` transfer** (Well below `500.00 kB` warning budget; `0` initial warnings).
  - Lazy chunks:
    - `chunk-ZWypTkfs.js` (`viewer3d-component`): `597.05 kB` raw / `123.01 kB` transfer
    - `chunk-aSKtI6ow.js` (`route-planner-component`): `15.54 kB` raw / `4.09 kB` transfer
    - `chunk-E4wwO4UG.js` (`notebook-component`): `13.68 kB` raw / `3.82 kB` transfer
  - Offline pack: **18 assets, 1,666,706 bytes**, version `882801080628`.
- **Component Stylesheet Budget Inspection (`anyComponentStyle`: 4 kB warning / 8 kB error)**:
  - `src/app/ui/header/header.component.scss`: `3,933 B` compiled (`3.93 kB`) — **Passed**
  - `src/app/ui/shell/shell.component.scss`: `3,925 B` compiled (`3.93 kB`) — **Passed**
  - `src/app/notebook/notebook.component.scss`: `3,595 B` compiled (`3.60 kB`) — **Passed**
  - `src/app/planner/route-planner.component.scss`: `3,379 B` compiled (`3.38 kB`) — **Passed**
  - `src/app/science/science-context.component.scss`: `3,251 B` compiled (`3.25 kB`) — **Passed**
  - `src/app/evidence/image-passport.component.scss`: `2,723 B` compiled (`2.72 kB`) — **Passed**
  - `src/app/evidence/exploration-confidence.component.scss`: `2,512 B` compiled (`2.51 kB`) — **Passed**
  - `src/app/ui/confidence-panel/confidence-panel.component.scss`: `1,004 B` compiled (`1.00 kB`) — **Passed**
  - **Total component budget warnings: 0**.

---

## 5. Live Headless Chrome CDP Verification (`HeadlessChrome/157.0.8103.52`)

Driven over HTTP against the production build in `dist/marswalk/browser`:

### A. Truthful Header Readiness Evaluation

- **Metadata loaded**: Renders `Metadata: Loaded` with `.status-info` (`rgb(6, 182, 212)` cyan border/dot). Never receives `.status-ready`.
- **Network connectivity**: Renders `Network: Online` with `.status-neutral` (`rgb(148, 163, 184)` subtle border/dot). Emulating offline network switches to `Network: Offline` with `.status-loading` (amber pulse). Never receives `.status-ready`.
- **Offline pack**: Prior to cache preparation, renders `Offline Pack: Not Prepared` with `.status-neutral`. Only receives `.status-ready` when the offline pack is actually verified.

### B. Dark & Light Theme Contrast Audit (WCAG AA >= 4.5:1)

Zero contrast failures (`contrastFailures: []`). All cards in `science-context`, `exploration-confidence`, and `image-passport` properly swap from dark `#1a222e` to light `rgb(248, 250, 252)` / `rgb(255, 255, 255)` with dark text:

| Element / Selector                                    | Dark theme (fg / bg / ratio)                             | Light theme (fg / bg / ratio)                            | Result  |
| ----------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | ------- |
| `app-header .metadata-pill`                           | `rgb(207, 250, 254)` / `rgb(23, 56, 71)` (**`12.22:1`**) | `rgb(12, 74, 110)` / `rgb(218, 236, 246)` (**`8.12:1`**) | Pass AA |
| `app-header .network-pill`                            | `rgb(241, 245, 249)` / `rgb(26, 34, 46)` (**`14.61:1`**) | `rgb(15, 23, 42)` / `rgb(248, 250, 252)` (**`17.06:1`**) | Pass AA |
| `app-header .action-btn`                              | `rgb(240, 171, 125)` / `rgb(51, 36, 40)` (**`7.60:1`**)  | `rgb(154, 52, 18)` / `rgb(248, 232, 226)` (**`6.14:1`**) | Pass AA |
| `app-header .layer-btn.active`                        | `rgb(6, 182, 212)` / `rgb(23, 56, 71)` (**`5.11:1`**)    | `rgb(3, 105, 161)` / `rgb(218, 236, 246)` (**`4.89:1`**) | Pass AA |
| `app-shell .tab-btn.active`                           | `rgb(255, 157, 144)` / `rgb(20, 26, 35)` (**`8.72:1`**)  | `rgb(154, 52, 18)` / `rgb(255, 255, 255)` (**`7.31:1`**) | Pass AA |
| `app-shell .footer-val`                               | `rgb(6, 182, 212)` / `rgb(20, 26, 35)` (**`7.20:1`**)    | `rgb(3, 105, 161)` / `rgb(255, 255, 255)` (**`5.93:1`**) | Pass AA |
| `app-shell .footer-boundary`                          | `rgb(148, 163, 184)` / `rgb(20, 26, 35)` (**`6.82:1`**)  | `rgb(51, 65, 85)` / `rgb(255, 255, 255)` (**`10.35:1`**) | Pass AA |
| `app-confidence-panel .env-slot-card p`               | `rgb(148, 163, 184)` / `rgb(26, 34, 46)` (**`6.82:1`**)  | `rgb(51, 65, 85)` / `rgb(248, 250, 252)` (**`10.35:1`**) | Pass AA |
| `app-confidence-panel .env-slot-badge`                | `rgb(240, 171, 125)` / `rgb(45, 34, 24)` (**`7.77:1`**)  | `rgb(154, 52, 18)` / `rgb(248, 232, 226)` (**`6.41:1`**) | Pass AA |
| `app-exploration-confidence .badge-caution`           | `rgb(253, 230, 138)` / `rgb(52, 49, 42)` (**`10.42:1`**) | `rgb(146, 64, 14)` / `rgb(248, 243, 233)` (**`6.41:1`**) | Pass AA |
| `app-exploration-confidence .metric-value`            | `rgb(241, 245, 249)` / `rgb(20, 26, 35)` (**`15.95:1`**) | `rgb(15, 23, 42)` / `rgb(255, 255, 255)` (**`17.85:1`**) | Pass AA |
| `app-science-context .record-badge`                   | `rgb(125, 211, 252)` / `rgb(20, 26, 35)` (**`10.48:1`**) | `rgb(3, 105, 161)` / `rgb(255, 255, 255)` (**`5.93:1`**) | Pass AA |
| `app-science-context .science-record-button.selected` | `rgb(241, 245, 249)` / `rgb(48, 38, 38)` (**`11.04:1`**) | `rgb(15, 23, 42)` / `rgb(247, 239, 237)` (**`14.85:1`**) | Pass AA |
| `app-science-context a`                               | `rgb(125, 211, 252)` / `rgb(20, 26, 35)` (**`10.48:1`**) | `rgb(3, 105, 161)` / `rgb(255, 255, 255)` (**`5.93:1`**) | Pass AA |
| `app-image-passport .external-link`                   | `rgb(125, 211, 252)` / `rgb(20, 26, 35)` (**`10.48:1`**) | `rgb(3, 105, 161)` / `rgb(255, 255, 255)` (**`5.93:1`**) | Pass AA |
| `app-image-passport .badge-caution`                   | `rgb(253, 230, 138)` / `rgb(45, 34, 24)` (**`11.45:1`**) | `rgb(146, 64, 14)` / `rgb(245, 232, 218)` (**`6.66:1`**) | Pass AA |
| `app-route-planner .next-step-banner`                 | `rgb(241, 245, 249)` / `rgb(36, 42, 54)` (**`9.44:1`**)  | `rgb(15, 23, 42)` / `rgb(235, 240, 245)` (**`6.24:1`**)  | Pass AA |
| `app-route-planner .mode-btn.active`                  | `rgb(255, 157, 144)` / `rgb(56, 42, 50)` (**`6.78:1`**)  | `rgb(154, 52, 18)` / `rgb(242, 228, 223)` (**`5.89:1`**) | Pass AA |
| `app-route-planner .mode-start.active`                | `rgb(110, 231, 183)` / `rgb(24, 57, 58)` (**`8.18:1`**)  | `rgb(6, 95, 70)` / `rgb(224, 240, 237)` (**`6.53:1`**)   | Pass AA |
| `app-route-planner .feedback-alert` (error)           | `rgb(252, 165, 165)` / `rgb(58, 39, 49)` (**`7.31:1`**)  | `rgb(153, 27, 27)` / `rgb(245, 229, 231)` (**`6.82:1`**) | Pass AA |
| `app-notebook .next-step-banner`                      | `rgb(241, 245, 249)` / `rgb(36, 42, 54)` (**`9.44:1`**)  | `rgb(15, 23, 42)` / `rgb(235, 240, 245)` (**`6.24:1`**)  | Pass AA |
| `app-notebook .submit-btn`                            | `rgb(15, 23, 42)` / `rgb(240, 171, 125)` (**`9.20:1`**)  | `rgb(255, 255, 255)` / `rgb(194, 65, 12)` (**`5.18:1`**) | Pass AA |
| `app-notebook .feedback-alert` (error)                | `rgb(252, 165, 165)` / `rgb(58, 39, 49)` (**`7.31:1`**)  | `rgb(153, 27, 27)` / `rgb(245, 229, 231)` (**`6.82:1`**) | Pass AA |

### C. Responsive Layout & Touch Targets

- Tested 50 states across 5 viewports (`1440×900`, `1280×800`, `1024×800`, `820×900`, and `390×844`) in both dark and light themes:
  - **`0` horizontal overflows** (`scrollWidth <= clientWidth` in all 50 checks).
  - **`0` undersized controls** (`>= 44px` across all W4-owned controls in all viewports).

### D. Workflows & Console Errors

- **`0` uncaught exceptions**, **`0` console errors**, **`0` HTTP network failures**.
- Key workflows verified: roving ARIA tablist (`ArrowRight`/`ArrowLeft`/`Home`/`End`), typing in `#obs-input` without tab interception, notebook draft retention across tab switches and `QuotaExceededError`, 3D rehearsal lazy load and complete teardown upon leaving tab.

---

## 6. Pending Work (Release Freeze & Deployment Responsibilities)

- **PENDING — W4 Phase 3 (Deployed interface verification)**: Acceptance checks on the public HTTPS host (`https://marswalk-jet.vercel.app/`) await coordinator deployment of this UI commit (the existing host runs older source `b6669fb`).
- **PENDING — Physical device & outside-user sessions**: Target Android/iOS standalone testing and three-participant usability protocol (`docs/USABILITY.md`) remain to be observed on physical hardware.
- **PENDING — Environmental data integration**: Enzo's environmental component mounting awaits verified PDS data schema agreement.
