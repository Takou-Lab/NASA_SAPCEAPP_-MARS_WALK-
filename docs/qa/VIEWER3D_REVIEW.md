# Longla viewer — correction verification

Date: **14 November 2026**. Tested code: **`2a6dbbaf086fef072844888c8eb25a3e5e5552ca`**, branch **`feature/longla-3d-rehearsal`**. The coordinator implemented the corrections at the user's request, preserving Longla's viewer and merging main **`d814ec4`**. Feature-branch verification is complete; this document does not claim the viewer is integrated into main.

## Automated checks

```sh
NG_CLI_ANALYTICS=false npm_config_cache=/workspace/.npm-cache npm ci --no-audit --no-fund
NG_CLI_ANALYTICS=false npm test
NG_CLI_ANALYTICS=false npm run build
```

- **70 tests passed across seven files**, retaining the current main regressions and corner transforms. Fourteen viewer tests exercise lifecycle, camera/texture stability, source loading, failure/fallback, stale callbacks, cleanup, marker filtering and partial-route colors through an injectable graphics boundary.
- Production build passed: initial assets **447.46 kB**; optional viewer chunk **595.35 kB**. Initial and component-style budgets pass without changing their limits. The existing Leaflet CommonJS warning remains.
- The viewer is in a lazy chunk. Its Three.js renderer is not created on initial page load; closing the viewer destroys it. Type declarations are devDependencies. Existing application dependencies, core, map, science and source assets were preserved.

## Actual browser outcomes

Headless **Chromium 156.0.8078.79 on Linux**, with software WebGL through Playwright, serving the production build on local HTTP; development mode was used separately for graphics-state inspection. Real local imagery and science data were used unless explicitly identified as a controlled fixture.

| Check | Actual outcome |
| --- | --- |
| Startup before opening | No viewer chunk requested and no viewer canvas created; map and all three science records usable |
| Explicit open/close | Four production cycles succeeded; lazy chunk fetched once; one viewer canvas per open |
| Mission before/after cycles | Exported route, observations and image identical; no page errors in normal run |
| Tablet/narrow viewport | No horizontal page overflow at 820 × 1180 and 390 × 844 |
| WebGL2 disabled | Readable local graphics fallback; 2D image, science and mission export remained usable |
| Only the viewer's image request failed | Visible image error, unavailable image-coordinate readout and unchanged metadata readiness/2D mission |
| Lazy viewer chunk blocked | Readable load error while map/science stayed mounted; advise exporting before reloading to retry the download |
| Twelve route edits with real imagery | Camera and texture UUID unchanged; GPU texture count stayed **2 → 2** after one initial route warmed the renderer's material resources |
| Close after route edits | Actual loaded texture emitted disposal; no unlocated science pins rendered |
| Orientation | GPU framebuffer samples matched 2D raster samples in all four quadrants of a temporary four-color 2048 × 1042 diagnostic image |
| Direction / VR claims | No compass or geographic-heading claim; immersive VR explicitly unimplemented, with no Enter/Exit VR toggle |

The orientation fixture was supplied to isolated browser requests only. It was not committed, installed as science data or substituted into the real source pack. Bottom-left was blue `(40,40,220)`, bottom-right yellow `(220,220,40)`, top-left red `(220,40,40)` and top-right green `(40,220,40)`; rendered samples matched exactly. This checks raster orientation, not real geographic orientation or metric calibration.

Unit tests additionally cover wrong decoded dimensions, obsolete load success/failure, pending texture disposal, graphics initialization failure, context loss, removed practice-grid resources, partial-route colors and out-of-bounds/mismatched markers. They do not substitute for the browser outcomes above.

## Reproduce manually

1. Build and serve `dist/marswalk/browser`. Open the app and confirm the 2D map/science work before opening the optional viewer.
2. Import a version-matching mission, export it, open/close the viewer several times and export again. Compare route, observations and image fields, excluding export time.
3. Use Low Oblique, edit a route through the shared workflow and check that the view does not reset. Close/reopen and verify one working canvas.
4. In an isolated browser profile, disable WebGL2 or block only the viewer image/chunk request. Confirm truthful feedback and continued 2D use. Keep real user records intact.
5. Inspect imagery alignment from Top-Down; the view is a flat image, not measured terrain. Image axes do not imply geographic north.

## Remaining acceptance

Physical tablet behavior, performance on the demonstration hardware, PWA installation, verified cache preparation, disconnected reopening and actual outside-user sessions remain **unrun/blocked** as recorded in [PWA_ACCEPTANCE.md](PWA_ACCEPTANCE.md). No headset or immersive VR was tested. The next task is independent device QA, not terrain/VR expansion.
