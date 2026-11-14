# MARSWALK — Shared Coding-Agent Contract

## Status and scope

This is an implementation specification for future coding work. At this revision the repository contains documentation, not an Angular application. Do not assume files, dependencies, scripts, verified data or passing tests exist. Inspect the checkout first. Read this document, [TEAM_TASKS.md](../../TEAM_TASKS.md), and the named person's brief.

Use Angular standalone components, strict TypeScript, plain CSS/SCSS and a small root-provided mission service. Use Leaflet with `CRS.Simple` for the first local-image implementation. Add geographic mapping only after verified data and an agreed migration. Three.js is exclusive to the optional 3D component. No backend, authentication, UI framework or extra state framework is required.

The coding prompts in personal briefs are intended to be pasted into the relevant teammate's coding-agent session. They authorize that agent to implement its assigned slice when invoked by the teammate; this document itself does not instruct agents to start unrelated tasks.

## Integration order and file ownership

| Person | Owned implementation | Dependency |
| --- | --- | --- |
| Coordinator (YOU) | Angular bootstrap/config, `src/app/core/`, root assembly, assessment, offline build, package files | Starts first |
| Willy | `src/app/map/` | Shared models/service and imagery metadata |
| Enzo | `src/app/ui/`, `src/app/planner/`, `src/app/notebook/` | Shared models/service; coordinate map integration with Willy |
| Longla | `src/app/viewer3d/` | Shared route and image reference; verified terrain optional |
| Gaddielle | `public/data/imagery/`, `public/data/terrain/`, `public/data/manifest.json`, `docs/data/`, optional `tools/data/` | Coordinator-approved manifest schema |
| Emma | `public/data/markers.json`, `docs/SCIENCE.md`, `docs/REFERENCES.md`, `docs/AI_USE.md` | Coordinator-approved science-record schema |

Do not overwrite another person's changes. Request shared model/API changes from the coordinator. The coordinator adds dependency declarations and lockfile changes for Leaflet/Three.js or processing tools. Do not scaffold a second Angular project in a feature directory. Use the existing checkout; create a feature branch only when useful and preserve local work. Do not push, merge, deploy or contact teammates unless the user explicitly authorizes that action.

## Version 1 models

Coordinator creates `src/app/core/models.ts` with these contracts before feature integration. These are proposed APIs to implement, not currently available imports. Extend them centrally when evidence requires it.

```ts
export interface Point { x: number; y: number }
export type Mode = 'inspect' | 'start' | 'destination' | 'waypoint';
export type LayerId = 'imagery' | 'markers' | 'grid' | 'coverage';
export interface Route {
  start: Point | null;
  destination: Point | null;
  waypoints: Point[];
}
export interface Source {
  title: string;
  url: string; // validated HTTPS URL
  credit: string;
}
export interface ImageManifest {
  schemaVersion: 1;
  imageRef: string; // changes when raster or coordinate interpretation changes
  assetPath: string; // local path relative to the deployed app base
  width: number;
  height: number;
  coordinateSystem: 'image-pixels-bottom-left';
  source: Source;
  observationDate: string | null;
  coverageStatus: 'regional-context' | 'verified-aoi';
  limitations: string[];
  calibration: {
    verified: boolean;
    metersPerPixel: number | null;
    sourceUrl: string | null;
    method: string | null;
  };
}
export interface ScienceMarker {
  id: string;
  name: string;
  imageRef: string;
  position: Point | null;
  positionStatus: 'verified' | 'illustrative' | 'unavailable';
  instrument: string | null;
  date: string | null;
  finding: string;
  evidenceType: 'measured' | 'derived' | 'interpreted' | 'simulated';
  source: Source;
  limitations: string[];
}
export interface Observation {
  id: string;
  imageRef: string;
  createdAt: string; // ISO timestamp
  text: string;
  position: Point | null;
}
export interface Assessment {
  planarDistanceMeters: number | null;
  distanceStatus: 'unavailable' | 'derived';
  terrainStatus: 'unavailable'; // v1 has no validated DEM contract
  warnings: string[];
}
```

`manifest.json` contains one `ImageManifest`; `markers.json` contains a `ScienceMarker[]`. If no verified source asset exists, do not fabricate a manifest or source. The application must show a data-unavailable state. Explicitly named test fixtures may be used in tests; they must not be presented as mission data.

## Coordinates and route behavior

- Origin is bottom-left of the prepared raster; x increases right and y increases up. Bounds are `0 <= x <= width`, `0 <= y <= height`.
- Leaflet conversion occurs only at the map boundary: `{x, y}` ↔ `[y, x]`. Bounds are `[[0, 0], [height, width]]`.
- A point in inspect mode makes no route change. Other modes replace start, replace destination, or append one waypoint.
- Ordered polyline points are the available start, ordered waypoints, then available destination. Distance is unavailable until both endpoints exist.
- Undo restores the previous route snapshot, including replaced endpoints; clear resets the route and can itself be undone. Loading a valid route resets undo history.
- Reject nonfinite/out-of-bounds points. Do not silently reinterpret saved positions for another image.
- Pixel distance is not meters. Enable derived planar distance only with a verified positive finite scale, HTTPS calibration source and nonempty documented method for the active raster. Sum Euclidean segment lengths and multiply by the scale. This does not enable slope or terrain distance.

## Shared MissionService API

Coordinator implements `src/app/core/mission.service.ts`. Expose readonly Angular signals with these names:

```ts
image: Signal<ImageManifest | null>;
markers: Signal<readonly ScienceMarker[]>;
route: Signal<Route>;
mode: Signal<Mode>;
layers: Signal<Readonly<Record<LayerId, boolean>>>;
selectedMarkerId: Signal<string | null>;
observations: Signal<readonly Observation[]>;
assessment: Signal<Assessment>;
canUndo: Signal<boolean>;
dataStatus: Signal<'loading' | 'ready' | 'unavailable' | 'error'>;
dataError: Signal<string | null>;

setMode(mode: Mode): void;
setLayer(id: LayerId, visible: boolean): void;
selectMarker(id: string | null): void;
applyMapPoint(point: Point): void;
undoRoute(): void;
clearRoute(): void;
saveRoute(): { ok: boolean; error?: string };
loadRoute(): { ok: boolean; error?: string };
addObservation(text: string, position: Point | null):
  { ok: boolean; error?: string };
exportMission(): void; // downloads versioned JSON, never pixel GeoJSON
```

Use `inject(MissionService)` in components. Features must not mutate signal values, create competing state stores or read/write browser storage independently. Handle asynchronous data loading centrally and validate JSON before publishing state. Show loading/errors without crashing. Root assembly loads data once; rendering effects must not refetch it.

## Storage, assessment and offline acceptance

- Persist versioned records with `imageRef`; validate type, coordinates and active reference before loading. Catch storage failures and expose actionable feedback.
- Whitespace-only notes fail validation; preserve user-entered text if saving fails. Render text through Angular interpolation.
- Every assessment includes missing terrain/coverage limitations. Never return a SAFE classification.
- Offline caching is production-only and follows the core workflow. Readiness means all required build/data assets are cached and verified, not simply worker registration.
- External citation links are not promised to work offline. Export includes schema version, active image reference, route, observations, provenance and assessment limitations.

## Required verification and report

Coordinator documents real commands after creating the app: frozen-lockfile install, noninteractive unit tests, production build and production serving/offline test. Never report nonexistent scripts as executed. Every feature agent runs the relevant existing checks and reports commands, outcomes, files changed, remaining blockers and one manual acceptance scenario. No tests are expected for documentation-only edits.

For learner sessions: inspect first, explain at most three unfamiliar concepts, propose one small slice and ask the learner to predict its behavior before the first substantive feature edit. Continue read-only investigation while waiting. Do not invent the learner's answer. After implementation, explain the data flow and ask for a small variation the learner can make.
