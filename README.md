# MARSWALK

> **Live deployment update — 15 November:** https://marswalk-jet.vercel.app/ is public and passes production-origin browser offline restart/mission recovery checks. Source `b6669fb`; [deployment evidence](docs/qa/VERCEL_PRODUCTION.md), [Vercel runbook](docs/VERCEL_SETUP.md). Physical home-screen acceptance remains pending; automatic GitHub deployment is not connected. Earlier revision-scoped statements below retain their historical scope.


<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Read [SOUL.MD](SOUL.MD) for the product purpose and installable offline PWA goals. The six current work pieces and dependencies are defined in [TEAM_TASKS.md](TEAM_TASKS.md); [personal agent briefs](docs/team/) contain matching prompts.

See [the published branch review](REVIEW.md) for accepted contributions and integration findings, and [NEXT_TASKS.md](NEXT_TASKS.md) for each contributor's next action. Completed work should not be restarted.

Current PWA implementation **`8a4dadc`** retains all eight merged feature tips: **136 Angular tests, 11 worker tests, 28 data tests, production build and browser offline restart/update checks pass**. [Final integration evidence](docs/qa/FINAL_BRANCH_INTEGRATION.md). Production PWA installation assets, verified offline preparation and guarded updates are implemented; browser process-restart disconnected passes. Public hosting and physical home-screen installation remain pending. [PWA checks](docs/qa/PWA_FOUNDATION.md).

The [Martian Map guide improvements](docs/GUIDE_IMPROVEMENTS.md) retain Gale and existing assignments: portable mission files now, complete offline operation next, compatible science layers and verified terrain before measured 3D.

## Current integration

Willy's standalone Leaflet map is mounted in the Angular root with Gaddielle's prepared Mount Sharp boxwork image and Emma's three contextual science records. The image uses bottom-left pixels, not geographic coordinates or a verified metric scale.

- Available: real local-image display, pan/zoom, imagery/marker visibility, source/coverage information and basic Exploration Confidence warnings.
- Implemented in the map/service: start/destination/waypoint actions, route rendering, undo/clear, local mission persistence and JSON export.
- Available in the root: mission JSON export/import between devices with the same image version. Import validates route/notes and saves before replacing current work; maximum file size is 1 MiB.
- Available: Emma's selectable science list and sourced details, including all three unlocated records without fabricated map pins. The shell currently starts in inspect mode.
- Available: integrated route controls, save/load/undo/clear, notebook with retained draft on failed save, science search/evidence/location filters, dedicated confidence/passport panels and reachable Mission Transfer tab.
- PWA: production-only scoped worker, install manifest/icons, explicit full-pack preparation/verification and guarded updates. Actual target-device installation/standalone acceptance remains pending.
- Metric distance, elevation and slope remain unavailable. Main includes an explicitly opened, lazy-loaded flat 3D rehearsal tab; it supplies no measured terrain or immersive VR. See [viewer verification](docs/qa/VIEWER3D_REVIEW.md).

## Development

Use Node `^22.22.3`, `^24.15.0` or `>=26.0.0` (validated with Node 24.22.1 and npm 11.9.0).

```sh
npm ci
npm start
npm test
npm run test:pwa
npm run build
```

`npm test` runs once without watch. Production output is `dist/marswalk/browser`. Serve it for local browser checks:

```sh
python3 -m http.server 8000 --directory dist/marswalk/browser
```

In the cloud machine, set `npm_config_cache=/workspace/.npm-cache` if the default cache is not writable, and `NG_CLI_ANALYTICS=false` to disable analytics prompts. Servers must restart after environment restoration.

Production build passes below configured error budgets, with initial (595.20 kB versus 500 kB) and planner/notebook style warnings, plus the Leaflet CommonJS warning. The viewer is a separate lazy 595.60 kB chunk; budgets were not raised. Do not infer PWA installability/offline behavior from a successful build.

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

To transfer a mission, export it, open another device with the same image version, choose the downloaded JSON and select **Import selected mission**. Import replaces the route and notes; export the destination's current work first. Failed validation or storage preserves existing work. The mission file does not include imagery or install an offline pack. See [transfer verification](docs/qa/MISSION_TRANSFER.md).

Reset View, Focus Route and guarded image retry are approved/integrated. Emma's science discovery and confidence/image-passport components are mounted once in Enzo's integrated shell. The viewer loads only when explicitly opened and releases resources on leaving its tab. [Next work](NEXT_TASKS.md): install assets, release-data handoff, pure image-byte verification, release UI cleanup and real PWA lifecycle/device acceptance. Preserve completed contributions.

## Evidence and credits

See [science evidence](docs/SCIENCE_EVIDENCE.md), [references](docs/REFERENCES.md), [AI use](docs/AI_USE.md), and [integration checks](docs/qa/MAP_INTEGRATION.md). Imagery credit: NASA/JPL-Caltech/University of Arizona. Leaflet: BSD-2-Clause; Angular and Three.js: MIT. See dependency packages for full licenses. Scientific source assertions are recorded in the data/science contributors' audits; runtime validation checks shape and consistency, not the truth of a scientific finding.


The complete ordered remaining-work plan for each person, including deployment and final handoff, is now in their single named [personal MD file](docs/team/). See the [owner matrix and release gates](TEAM_TASKS.md#one-complete-remaining-work-file-per-person). These plans do not represent completed numerical-data, AI, immersive-VR or PWA implementation, and no deployment was executed by this documentation update.


## Prepare and use offline

Use the production build/localhost server above (or an actual HTTPS host), expand **Install & offline**, choose **Prepare offline** and wait for **Offline pack verified**. Save route/notes before closing. Install from the supported browser menu/action, then test disconnected reopening on your device. Use **Load saved route** explicitly to recover saved route/notes. Installation alone does not prepare data; browser storage can be cleared/evicted.

All required generated chunks, science and image data are checked against the build's byte lengths/SHA-256. Initial runtime pack is 17 assets/1,789,610 bytes; future builds may differ. The archival master and terrain documents are excluded from deployment output. Waiting updates prepare first and do not force-reload an open app; save/export and close other tabs before applying. [Deployment/base-path/rollback runbook](docs/DEPLOYMENT.md), [current lifecycle evidence](docs/qa/PWA_FOUNDATION.md). No public app was deployed by this source update.
