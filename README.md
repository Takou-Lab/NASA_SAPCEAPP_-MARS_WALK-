# MARSWALK

Read [SOUL.MD](SOUL.MD) for the product purpose and installable offline PWA goals. [Team assignments](TEAM_TASKS.md) and [personal agent briefs](docs/team/) describe the next work.

See [the published branch review](REVIEW.md) for accepted contributions and integration findings, and [NEXT_TASKS.md](NEXT_TASKS.md) for each contributor's next action. Completed work should not be restarted.

## Current integration

Willy's standalone Leaflet map is mounted in the Angular root with Gaddielle's prepared Mount Sharp boxwork image and Emma's three contextual science records. The image uses bottom-left pixels, not geographic coordinates or a verified metric scale.

- Available: real local-image display, pan/zoom, imagery/marker visibility, source/coverage information and basic Exploration Confidence warnings.
- Implemented in the map/service: start/destination/waypoint actions, route rendering, undo/clear, local mission persistence and JSON export.
- Pending UI: Enzo's route controls, contextual science list and notebook/export controls. The shell currently starts in inspect mode. All three science positions are unavailable, so they do not produce map pins.
- Pending PWA work: installation manifest/icons, service-worker preparation, verified offline readiness and installed-device reopening.
- Metric distance, elevation and slope remain unavailable. 3D/VR is optional later work.

## Development

Use Node `^22.22.3`, `^24.15.0` or `>=26.0.0` (validated with Node 24.22.1 and npm 11.9.0).

```sh
npm ci
npm start
npm test
npm run build
```

`npm test` runs once without watch. Production output is `dist/marswalk/browser`. Serve it for local browser checks:

```sh
python3 -m http.server 8000 --directory dist/marswalk/browser
```

In the cloud machine, set `npm_config_cache=/workspace/.npm-cache` if the default cache is not writable, and `NG_CLI_ANALYTICS=false` to disable analytics prompts. Servers must restart after environment restoration.

Leaflet currently emits a CommonJS optimization warning during the Angular build; the build remains within the configured bundle budget. Do not infer PWA installability/offline behavior from a successful build.

## Image package verification

Pillow is required to verify full pixel decoding; header-only checks cannot establish image integrity.

```sh
python -m pip install -r tools/data/requirements.txt
python tools/data/verify_pack.py --manifest public/data/manifest.json --public-root public --json
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_verify_pack.py' -v
```

The required image pack is 524,472 bytes (manifest plus prepared image). The archival master is not an essential offline-cache asset. See [the inventory](docs/data/OFFLINE_DATA_PACK.md) and [image contract](docs/data/IMAGE_CONTRACT.md).

## Shared contracts and persistence

The root calls `MissionService.initialize()` once. Components use readonly signals and service actions. Do not duplicate initialization or storage in features. See [the shared contract](docs/team/CODING_AGENTS.md).

Records are versioned and tied to the active imageRef. `loadRoute()` explicitly restores validated route and observations and resets undo history; initialization does not overwrite current work with storage. `addObservation()` persists before returning success, so callers must retain drafts on failure. Export contains provenance and limitations. Browser storage is isolated by origin.

Use [Willy's current brief](docs/team/WILLY.md) for the next map-navigation task. Root mounting is integrated and must not be repeated.

## Evidence and credits

See [science evidence](docs/SCIENCE_EVIDENCE.md), [references](docs/REFERENCES.md), [AI use](docs/AI_USE.md), and [integration checks](docs/qa/MAP_INTEGRATION.md). Imagery credit: NASA/JPL-Caltech/University of Arizona. Leaflet: BSD-2-Clause; Angular: MIT. See dependency packages for full licenses. Scientific source assertions are recorded in the data/science contributors' audits; runtime validation checks shape and consistency, not the truth of a scientific finding.
