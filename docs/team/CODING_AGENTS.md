# MARSWALK — Shared Coding-Agent Contract

Read [SOUL.MD](../../SOUL.MD) before your role brief. It defines the real users, product scope and acceptance criteria. This document defines implementation ownership and shared APIs; it does not prove that future PWA or feature APIs already exist.

Preserve work already underway. Complete or hand off the current small slice before starting a new charter follow-up; do not repeat completed assignments or learning checkpoints. Emma (he/him) has delivered science/evidence/demo work at `8a947a4` and the usability protocol at `b0640d9` on his feature branch. These need coordinator integration, not recreation. His new task is presentation and judges' Q&A preparation; actual user sessions remain a later phase.

## Status and scope

The Angular foundation now implements the v1 models and MissionService API below, with Leaflet dependencies and noninteractive test/build scripts. MARSWALK's target is an installable offline PWA; installation and offline caching are not yet implemented in the foundation. Imagery and science records are on Gaddielle's and Emma's feature branches pending integration and evidence follow-up. Inspect the checkout and actual scripts before starting. Read this document, [TEAM_TASKS.md](../../TEAM_TASKS.md), and the named person's brief.

Use Angular standalone components, strict TypeScript, plain CSS/SCSS and a small root-provided mission service. Use Leaflet with `CRS.Simple` for the first local-image implementation. Add geographic mapping only after verified data and an agreed migration. Three.js is exclusive to the optional 3D component. No backend, authentication, UI framework or extra state framework is required.

The coding prompts in personal briefs are intended to be pasted into the relevant teammate's coding-agent session. They authorize that agent to implement its assigned slice when invoked by the teammate; this document itself does not instruct agents to start unrelated tasks.

## Integration order and file ownership

| Person | Owned implementation | Dependency |
| --- | --- | --- |
| Coordinator (YOU) | Angular bootstrap/config, `src/app/core/`, root assembly, assessment, offline build, package files | Starts first |
| Willy | `src/app/map/`; current narrow root-mount exception below | Publish reported completed local map first; shared models/service and imagery metadata |
| Enzo | `src/app/ui/`, `src/app/planner/`, `src/app/notebook/` | Shared models/service; coordinate map integration with Willy |
| Longla | `docs/qa/` for independent device/offline checks first; optional `src/app/viewer3d/` afterward | Coordinator's integrated PWA and actual target device; optional viewer depends on shared route/image reference |
| Gaddielle | `public/data/imagery/`, `public/data/terrain/`, `public/data/manifest.json`, `docs/data/`, optional `tools/data/` | Coordinator-approved manifest schema |
| Emma | `public/data/markers.json`, `docs/SCIENCE.md`, `docs/SCIENCE_EVIDENCE.md`, `docs/DEMO_SCRIPT.md`, `docs/USABILITY.md`, `docs/PRESENTATION.md`, `docs/JUDGES_QA.md`, `docs/REFERENCES.md`, `docs/AI_USE.md` | Reuse completed research/protocol; actual build/evidence for presentation claims, real sessions before recording outcomes |

Do not overwrite another person's changes. Request shared model/API changes from the coordinator. The coordinator adds dependency declarations and lockfile changes for Leaflet/Three.js or processing tools. Do not scaffold a second Angular project in a feature directory. Use the existing checkout; create a feature branch only when useful and preserve local work. Do not push, merge, deploy or contact teammates unless the user explicitly authorizes that action.

The current Gaddielle, Emma and Willy follow-up assignments explicitly include committing and pushing their own feature branches. This does not authorize merging into `main`, deployment or contacting teammates. Gaddielle owns the image-data inventory and verification tool; the coordinator owns service-worker caching, app installation and complete offline readiness. Emma owns the evidence audit and presentation content; shared models stay unchanged unless coordinated.

**Willy's current integration exception:** he may edit `src/app/app.ts`, `app.html`, `app.scss` and `app.spec.ts` only to import/mount his existing standalone MapComponent once, provide its layout space and verify the mounted shell. Inspect the actual selector before use. Keep other root assembly, shared core, package/PWA configuration and data-branch integration with the coordinator. His new map-owned Reset View/Focus Route actions must preserve mission state and avoid duplicating Enzo's route/notebook controls. His reported 26 tests/build are not independently verified until the branch is available and checks are rerun.

## Current product integration priorities

1. Integrate reviewed local imagery and science evidence without inventing geolocations or metric calibration.
2. Finish the 2D mission: image, contextual science, route sketch, confidence messages, notebook, recovery and JSON export.
3. Complete the installable offline PWA and test closing/reopening the installed app disconnected on the target device. Connectivity and verified pack readiness are different states.
4. Present Data Passports using Gaddielle's documented metadata and Emma's evidence audit. Use existing model fields where supported; the coordinator must agree any typed extension before feature agents consume new fields.
5. Conduct three outside-user sessions with the coordinator, record actual anonymized outcomes through Emma and Longla, and fix observed confusion.
6. Add optional 3D/VR only after the essential mission is accepted.

The implemented MissionService below has no install/offline lifecycle API. The coordinator must define and test that contract before Enzo consumes it; feature agents must not invent methods, progress values or readiness claims. The signature confidence panel reports evidence and limits, not safety scores. Unlocated science records must remain accessible as context without fabricated map positions.

## Version 1 models

These interfaces are implemented in `src/app/core/models.ts`. The service is implemented in `src/app/core/mission.service.ts`. Extend them centrally when evidence requires it. The root calls the additional idempotent `initialize(): Promise<void>` method once. See [image handoff](../data/IMAGE_CONTRACT.md) for current data-loading behavior.

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
