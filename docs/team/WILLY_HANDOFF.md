# Willy — Angular foundation handoff

The foundation is implemented. Your map component remains yours to build under `src/app/map/`.

## Start

Fetch the latest `main`, preserve any local work, and base your feature branch on that revision. Then:

```sh
npm ci
npm start
npm test
npm run build
```

Use the Node version range in package.json. In the cloud machine, use `npm_config_cache=/workspace/.npm-cache` if needed.

## Imports and calls

From `src/app/map/map.component.ts`:

```ts
import { inject } from '@angular/core';
import * as L from 'leaflet';
import { MissionService } from '../core/mission.service';
import type { Point } from '../core/models';

// Inside your standalone MapComponent:
// readonly mission = inject(MissionService);
// Map click: mission.applyMapPoint({ x: event.latlng.lng, y: event.latlng.lat });
// Read: mission.image(), route(), mode(), layers(), markers(), selectedMarkerId().
```

The root already calls `initialize()` once. Do not fetch data in a rendering effect or add another service/store. Leaflet CSS and TypeScript declarations are installed. Add your component import/selector to root assembly in a small coordinated integration change.

## Current data status

No verified image has been delivered. The shell therefore correctly shows unavailable data. Read [the image contract](../data/IMAGE_CONTRACT.md) and [the shared API](CODING_AGENTS.md). Ask Gaddielle for the real image plus manifest; no contact with Gaddielle has been performed by this coding session. Use clearly synthetic unit-test fixtures to develop meanwhile, not fabricated scientific assets in public/data.

`dataStatus === 'ready'` means the manifest validated, not that the image decoded. Your component must handle image load failure and verify natural dimensions against the manifest. Missing markers do not prevent imagery work; dataError reports their status.

## Verification recorded for the foundation

- Frozen-lockfile installation: passed.
- Unit/component tests: 15 passed across three files.
- Production build: passed.
- Production HTTP check: app shell and referenced JavaScript/CSS served successfully.
- Headless Chromium rendering attempt: stalled; browser behavior is not verified by that attempt. The component test verifies the rendered unavailable-data shell in the test DOM.
- Interactive map and offline workflow: not implemented or tested in this foundation.

Proceed with the prompt in [WILLY.md](WILLY.md), using the now-implemented core instead of treating it as missing.
