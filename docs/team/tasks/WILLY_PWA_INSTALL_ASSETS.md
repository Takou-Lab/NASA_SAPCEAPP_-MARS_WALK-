# Willy — PWA manifest and install icons

> Coordinator supplied starter assets and root wiring in `8a4dadc`. Willy now reviews/refines them and verifies actual launcher/host/device behavior. Preserve any unpublished local progress; do not regenerate duplicate assets. [Actual handoff](../../qa/PWA_INSTALL_ASSETS.md). The original specification below remains the asset contract.


Current piece **W1**, delegated from coordinator preparation after accepted image retry `02134f1`. Preserve map/navigation/retry; do not repeat them. This task supplies install assets. It does not implement or establish full offline readiness.

## Branch and exact deliverables

After the reviewed integration is published, preserve local work and create proposed **`feature/willy-pwa-install-assets`** from latest main if no task branch already exists. Keep the retry branch/history.

- `public/manifest.webmanifest`
- `public/icons/marswalk-192.png` — 192 × 192, purpose any
- `public/icons/marswalk-512.png` — 512 × 512, purpose any
- `public/icons/marswalk-maskable-512.png` — 512 × 512, purpose maskable
- Optional original vector/source file under `public/icons/` for reproducibility
- `docs/qa/PWA_INSTALL_ASSETS.md` — exact checks, source/author credits and coordinator handoff

Own these assets/document only. Do not edit `src/index.html`, root/components, Angular/package config, service worker, source imagery, shared models or teammates' files. No new dependency. The coordinator will wire discovery and test actual installation after review.

## Manifest contract

Use valid UTF-8 JSON with at least:

```json
{
  "name": "MARSWALK",
  "short_name": "MARSWALK",
  "description": "Mars exploration rehearsal with visible evidence limits.",
  "lang": "en",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#0b0e14",
  "theme_color": "#0b0e14",
  "icons": [
    { "src": "icons/marswalk-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icons/marswalk-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "icons/marswalk-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Keep paths relative to the manifest so root and `/marswalk/` hosting work. Do not hardcode a GitHub Pages owner/repository URL, absolute icon path or an app id without an agreed deployment identity. No backend, authentication, unrelated external app or fake readiness field.

## Icon requirements

Create a clear original MARSWALK mark, readable at launcher size; document authorship/tools and any licensed source. Do not use NASA's official seal/logotype as our app identity. The maskable icon must cover its entire square with an opaque background and keep essential artwork inside the centered safe circle of diameter 80% of the canvas. Do not just relabel an unsuitable transparent icon as maskable.

Use existing image/graphics tools without adding application dependencies. Full PNG decoding and actual dimensions must match manifest declarations. Preserve the scientific raster and its hashes.

## Checks and handoff

1. Parse the JSON, verify relative `start_url`/`scope` and all icon URLs under both a root manifest URL and a `/marswalk/manifest.webmanifest` URL.
2. Fully decode the PNGs, verify dimensions/alpha and inspect launcher-size and maskable safe-area appearance. Record actual outcomes and file byte sizes; no invented install result.
3. Run the real production build and serve its output. Confirm the manifest/icons are present and served at intended paths, including a controlled subpath serving check where available. Do not change build budgets or package files.
4. In the QA document, give the coordinator the exact `<link rel="manifest" href="manifest.webmanifest">` handoff and matching theme-color recommendation, assets/credits and remaining discovery/install/device checks. The link is a future coordinator edit, not permission to edit root/index yourself.

Commit/push only the assigned W1 feature branch (default above), reporting actual name/commit/assets/checks. No main merge, deployment, environment publication, submission or external messaging. Actual discovery/install/offline acceptance remains W6/W5 after review.
