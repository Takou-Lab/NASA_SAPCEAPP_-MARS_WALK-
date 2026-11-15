# Production build, hosting and rollback

PWA foundation source: **`8a4dadc`**. No host/account/production URL has been chosen or published by this implementation. Deployment and environment publication are separate actions from pushing GitHub code. [Actual checks and limits](qa/PWA_FOUNDATION.md).

## Reproducible build

From repository root, use a supported Node version (tested Node 24.22.1/npm 11.9.0):

```sh
npm ci
npm test
npm run test:pwa
npm run build
python3 -m http.server 8000 --directory dist/marswalk/browser
```

Open `http://localhost:8000/`. The Angular development server (`npm start`) deliberately disables worker registration. `npm run build` runs Angular then the full-pack generator; bypassing it with plain `ng build` does not generate a usable production worker/pack. Build-time verification rejects mismatched image-index bytes. New application dependencies were not needed.

For subpath hosting, supply the actual path with both leading/trailing slash:

```sh
npm run build -- --base-href /marswalk/
```

Host the contents of `dist/marswalk/browser` at `/marswalk/`. Rebuild with the real deployment path; `/marswalk/` is a tested example, not an assumed GitHub repository URL. The wrapper forwards Angular build flags. Verify actual document base, worker scope, manifest start/scope/icons and asset HTTP responses after deployment. Serving the correct build under the wrong path is not supported.

## Host requirements

- Static HTTPS hosting; no backend/login/API key is required by current app. Upload complete output, including generated `service-worker.js` and `offline-pack.json`. Never copy raw `public/` separately over the build.
- Root-relative versus subpath deployment must match the build. Preserve case-sensitive filenames. Serve worker/JS with JavaScript MIME, CSS/JSON/manifest/images with appropriate MIME. Worker scope stays within the actual app directory.
- Serve entry HTML, worker and control pack with revalidation/no-store rather than long-lived immutable caching. Fingerprinted JS/CSS may use immutable caching. Keep install manifest/icon changes revalidatable. Do not rewrite a missing worker/JSON/image request to HTML; navigation fallback, if configured, applies only to document navigation.
- Atomic artifact deployment is preferred: mixed versions fail byte verification. Keep the previous complete artifact and its URLs available during rollout where supported. Do not delete old hashed assets while old tabs may still use them.
- Archival `PIA26306.jpg` and terrain documents are excluded by build config. Required raster is `PIA26306_derived_2048.jpg`. External citations are not precached. Full pack currently includes deferred 3D code deliberately; future environment/AI/VR files require a reviewed inclusion/version decision in `tools/pwa/build-pack.mjs`.

## Preview and promotion checklist

1. Record Git commit, build command/base path, generated pack version, exact preview URL and provider settings. Run clean-profile first load; check console/network, real image, science, route, note, mission transfer and no missing assets.
2. Expand Install & offline; Prepare offline; wait for **Offline pack verified**, then Verify saved pack. Check failures remain recoverable. “Data Ready” in the existing header describes mission data, not this complete-pack state.
3. On the target supported device install from browser UI or offered Install action. Record browser/device/version and actual standalone behavior. Do not assume an install prompt exists or equate incognito diagnostics with normal installability.
4. Save route/note, disconnect, close/reopen from launcher, inspect image/science, explicitly load saved route, edit/save/recover/export. Browser source pages may need internet. Record actual outcomes in [PWA acceptance](qa/PWA_ACCEPTANCE.md).
5. Exercise two build versions safely: updates download/verify before waiting; no automatic reload while old tabs are open. Save/export drafts and close other app tabs before explicit apply. Natural activation after all old clients close uses the already-prepared pack. Test failed preparation/update with isolated data.
6. Promote only the tested complete artifact through the authorized release workflow. Recheck production URL/manifest/worker/data and actual mission. No hosting or competition submission has been executed merely by this checklist.

## Rollback and storage

Keep exact previous artifact/commit/base path and restore it atomically through the host. Existing tabs may keep their active worker until a normal safe update; do not promise immediate rollback to all installed clients. Deploy the restored build, check updates online and apply after saving/exporting, then verify again. The worker retains old completed caches, but does not expose a version-selection UI.

Do not advise users to clear browser site data casually: it can erase saved missions as well as caches. Export first. Browser eviction, private mode or user clearing can remove offline assets; verify preparation before relying on disconnection. Cache hashes establish correspondence to this build, not independent signatures, scientific correctness or terrain safety.
