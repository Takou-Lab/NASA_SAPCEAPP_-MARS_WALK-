# Visual polish pass — Takou

15 November 2026, on `main` ff875d3 (runtime 38ad299). Styling only, inside the handed-over
files: `src/styles.scss`, `src/app/app.scss`, header, shell, mission-review, science-context,
exploration-confidence and image-passport stylesheets. No template, logic, data, worker,
dependency or budget change.

## Five main improvements

1. **One visual system.** Shared tokens in `src/styles.scss`: spacing (4/8/12/16/24), radius
   (6/8/12), type scale (11.5/12.5/14/15/17 px), `--control-h` (36 px with a precise pointer,
   44 px on touch screens), `--border-control` for meaningful control edges (≥ 3:1),
   `--mars-accent-text`/`--on-accent`, deeper neutral dark surfaces and paler light surfaces.
   3 px focus outline in both themes. Panels use the same scale for headings, padding and corners.
2. **Header in one row.** Brand, status pills (single scrolling row), layer toggles, theme
   and Export align in one 56 px row on desktop instead of two. Export is the one solid Mars-red
   action. On phones the duplicate header layer buttons are hidden (the map toolbar keeps the
   Imagery and Science-marker toggles), so brand and actions share one row and the pills scroll.
3. **Mission summary that supports the map.** Plain-case heading, compact numbered step pills
   instead of four heavy buttons, neutral summary cells, and the limitations disclosure as a quiet
   bar with an amber edge (amber reserved for limits).
4. **Clearer navigation.** Tabs keep their full labels and scroll instead of being cut; the
   selected tab uses a 3 px Mars-red bar plus bold text (not colour alone). Lighter footer;
   Collapse Panel and other controls share one height and border.
5. **Phone layout with more map.** Natural scrolling and positive map height are kept (one
   merged phone rule set instead of two overlapping ones). Visible map on first view at 390 × 844:
   **215 px → 359 px** (screenshot script) and **178 px → 323 px** in the smoke harness.

## Measurements (production build, Chrome 157 headless)

| Check | Before (ff875d3) | After |
| --- | --- | --- |
| Map top, 1440 × 900 | 398 px | 342 px |
| Map top, 390 × 844 | 629 px | 485 px |
| Horizontal overflow (1440 / 820 / 390, both themes) | 0 | 0 |
| Text contrast failures on the first screen, both themes (≈ 236 elements, WCAG 4.5:1 or 3:1 large) | 0 | 0 |
| Page errors | 0 | 0 |

The earlier token-level failures in my review (dark `--text-muted` 3.36:1, white on accent
3.67:1) were real values but those tokens were barely used on screen; they are now corrected
(`--text-muted` 6.22:1 on dark surface; accent buttons 5.26:1 dark, 5.18:1 light).

## Verification

- `npm test`: **26 files, 251 tests passed**.
- `npm run build`: passes. **The pre-existing `shell.component.scss` budget warning is gone**
  (generic viewer-toggle and deferred-state styles moved to the global sheet; the duplicated
  phone rules merged). Only the existing Leaflet CommonJS warning remains. Budgets unchanged.
- Smoke harness (`tools/qa/takou` on the QA branch) against this build: **9/9 passed**, 0 page or
  console errors, 0 failed requests: map placement with Reset View/Focus Route, science
  Previous/Next and filters, panel tabs, note save and failed-save draft retention, Save Route,
  export, bad imports rejected, offline pack, offline full restart with automatic restore,
  3D viewer open/close, 390 px layout.

Screenshots: `docs/design/takou-polish/before-*.png` and `after-*.png` (1440 × 900 both
themes, 820 × 1180 light, 390 × 844 both themes). Browser screenshots are not physical-device
certification.

## Known remaining issues

- The map image sits inside a dark letterbox in the map frame (map component, Willy's scope).
- The PWA "Install & offline" bar is styled inside `src/app/core/pwa-panel.component.ts`
  (coordinator scope) and still competes with the header.
- The Mission Briefing card (`src/app/mission-briefing/`) keeps its own uppercase label style.
- Exploration Confidence and Image Passport still nest cards inside a card; flattening them is
  the next step in this pass.
- 200 % zoom was not separately measured.
