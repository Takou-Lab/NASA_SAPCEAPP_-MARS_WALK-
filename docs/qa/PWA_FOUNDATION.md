# PWA foundation — verified browser evidence

Date **15 November 2026**. Tested implementation **`8a4dadc`** follows integrated baseline `b744b0b` and assignment update `3879f3f`. Coordinator implemented this slice; it is not a new teammate submission. No public deployment, environment publication or competition submission was performed.

## Delivered behavior

- Production build generates a versioned full runtime pack and `service-worker.js`. App registers it at the actual document base only in production on secure contexts (HTTPS/localhost). Development mode does not register it.
- Install manifest with relative start/scope/icon URLs, 192/512 PNGs and opaque maskable PNG. Original geometric artwork/SVG supplied by coordinator for Willy's review, without NASA's logo/seal. PNGs decode at their declared sizes; artwork fits the maskable safe area.
- Root Install & offline panel exposes connection separately from preparation. Initial worker registration alone never claims ready. Prepare downloads exact expected assets, verifies size/SHA-256, writes a unique staging cache, reads back every asset and only then commits a complete marker.
- Current root pack: **17 assets, 1,789,610 bytes**, version `95d8b5f6ee7aba0a38e8e7758ada62be20a3f0ca61efd04adce0fc4cabb7a827`. This includes shell/styles/all generated chunks (including deferred 3D), image manifest/raster/index/science, favicon and install manifest/icons. The deferred viewer executes only after explicit opening; preparation intentionally downloads its chunk. Source SVG/license report/control inventory are not runtime essentials.
- Archival master and terrain documents are excluded from build output and pack. Existing imagery, imageRef, science/calibration/coordinates are unchanged. Image-only inventory remains **524,472 bytes**, distinct from full runtime pack.
- Current-version missing/corrupt cache entries revoke readiness. Failed download/hash/storage/readback never commits partial readiness and retains previous completed versions. Mission localStorage and drafts are not touched by the worker.
- Updates prepare/verify during worker installation before becoming waiting workers. Failure leaves the old worker/cache active. Waiting updates never force-reload an open app. Explicit apply requires a warning/confirmation and refuses multiple open app windows; save/export and close other tabs first. When all old tabs close, normal browser lifecycle may activate the already-prepared update safely.
- Full previous versions are retained for rollback. Browser storage eviction/clearing can still remove them; verify before disconnecting. There is no disk-persistence guarantee or automatic version-pruning UI.

## Automated checks actually run

```sh
NG_CLI_ANALYTICS=false npm test
npm run test:pwa
NG_CLI_ANALYTICS=false npm run build
NG_CLI_ANALYTICS=false npm run build -- --base-href /marswalk/
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/data -p 'test_*.py'
PYTHONDONTWRITEBYTECODE=1 python3 tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check
```

**136 Angular tests across 16 files**, **11 worker tests**, **28 Python tests** pass. Root and subpath production builds pass. Initial assets **595.20 kB**, lazy viewer **595.60 kB**; existing initial/planner/notebook style warning overruns and Leaflet CommonJS warning remain below error thresholds. Budgets/dependencies were not raised/added.

Worker tests cover cache-only integrity, missing/corrupt downloads, write/readback/storage failures, incomplete-stage cleanup, prior-version retention, scope isolation, explicit activation/multiple-window refusal and background update installation/natural activation requirements. These use a VM/cache harness with actual WebCrypto, not physical disk-pressure tests.

## Actual production browser checks

Playwright, Chromium **156.0.8078.79**, Linux; persistent profiles for process-restart/install diagnostics, software WebGL for viewer. HTTP localhost is a supported secure development context, not a public HTTPS deployment. Temporary test copies changed only HTML title to produce a second real pack; public scientific source files were untouched.

1. Explicit preparation caches/validates the complete runtime pack; master image excluded.
2. Actual map clicks create start/waypoint/destination, route saved, note saved/exported. Close the browser process, relaunch with the same profile disconnected **before navigation**, reopen image/science, explicitly Load saved route, recover exact route/notes and export. Deferred 3D also opens from cache offline.
3. Delete a cached science file: Verify reports missing data, readiness is revoked, explicit online repair succeeds without changing mission notes.
4. New build waits without reloading. Cancel update: exact unsaved notebook draft retained. Multiple app windows block activation. Save draft/close other window/apply: prepared new build reloads, saved records recover and offline reopening works.
5. Truncated network image: preparation fails with no completed cache; retry succeeds after source recovery.
6. Failed background update download: previous worker/verified pack remain usable. After successful waiting update and full browser close, relaunch disconnected loads the automatically activated, already-prepared version.
7. Actual `/marswalk/` build: correct worker scope/script and relative manifest/icons; prepare then close/reopen page disconnected at 390px, real imagery/science and no horizontal overflow.
8. Chromium manifest parsing and installability diagnostics return no errors in a persistent (non-incognito) profile. Private browsing itself blocks installation; it is not a manifest defect.

Evidence execution used local temporary browser scripts/results under `/tmp/marswalk-pwa-*` and `/tmp/marswalk-natural-update-*`; these are session artifacts, not permanent dependencies. This document retains the source revision, method and outcomes for handoff.

## Remaining acceptance

Actual public HTTPS hosting, target-device home-screen installation/standalone launch, physical storage-pressure/graphics behavior and outside-user sessions remain **pending**. No numerical environment dataset, runtime AI, immersive VR, verified metric calibration or terrain is introduced by this foundation. Enzo's separately assigned pure image verifier remains planned; this worker uses the generated full-build byte contract and does not invent or consume that future API.
