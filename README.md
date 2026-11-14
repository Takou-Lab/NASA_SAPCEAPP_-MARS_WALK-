# MARSWALK

Start with [SOUL.MD](SOUL.MD) for the project's purpose, real use cases, installable offline PWA goals and acceptance criteria. The [team assignments](TEAM_TASKS.md) and [personal agent briefs](docs/team/) describe the current work. These plans do not mean PWA installation or offline caching is implemented yet.

Angular foundation for a research prototype exploring the Mount Sharp boxwork region of Gale Crater, Mars. This revision supplies shared state and contracts for the team. It does not yet implement the interactive map, notebook UI, 3D view or offline caching, and contains no verified imagery/terrain dataset.

## Development

Use Node `^22.22.3`, `^24.15.0` or `>=26.0.0` (validated with Node 24.22.1 and npm 11.9.0).

```sh
npm ci
npm start
npm test
npm run build
```

`npm test` runs once without watch. Production output is `dist/marswalk/browser`. For a local production smoke check:

```sh
python3 -m http.server 8000 --directory dist/marswalk/browser
```

In the prepared cloud environment, set `npm_config_cache=/workspace/.npm-cache` if the default npm cache is not writable. `NG_CLI_ANALYTICS=false` disables CLI analytics prompts. Do not assume servers survive publication.

## Willy: ready to integrate

- Angular standalone bootstrap: `src/main.ts`, `src/app/app.config.ts`, `src/app/app.ts`.
- Shared interfaces: `src/app/core/models.ts`.
- Root-provided signals and actions: `src/app/core/mission.service.ts`.
- Route/calibration helpers: `src/app/core/route.ts`.
- Runtime data/storage validation: `src/app/core/validation.ts`.
- Leaflet and `@types/leaflet` are dependencies; global Leaflet CSS is loaded.
- Create your standalone component under `src/app/map/`; do not initialize another app or another mission store.
- Inject MissionService and consume readonly signals; call actions rather than mutating state. Root assembly already calls initialize once.

See [the coding contract](docs/team/CODING_AGENTS.md), [Willy's brief](docs/team/WILLY.md), and [the image handoff](docs/data/IMAGE_CONTRACT.md). The current shell intentionally reports unavailable data until Gaddielle delivers a valid local image and manifest. This does not block coding with explicitly synthetic test fixtures.

## Data and persistence

No geographic positions, terrain values or safety classifications are invented. V1 uses bottom-left image pixels; geographic GeoJSON is not appropriate for these routes. Distance remains unavailable without independently verified calibration for the active image.

Save/load uses browser localStorage, a versioned envelope and the active image reference. `addObservation` persists before publishing success; UI callers must retain drafts on failure. `loadRoute` restores both route and observations and resets undo history. It must be called explicitly after data is ready; initialization does not overwrite current work with stored data. Export downloads JSON containing provenance and limitations. Storage is isolated by origin.

Offline readiness is not implemented in this foundation. Leaflet is credited to its contributors (BSD-2-Clause); Angular to its contributors (MIT). See dependency packages for licenses. Foundation code and documentation were assisted by OpenAI Codex; scientific sources remain to be verified by the data team.

## Team

[Assignments](TEAM_TASKS.md) · [Personal coding-agent briefs](docs/team/) · [Image contract](docs/data/IMAGE_CONTRACT.md)
