# MARSWALK — 60-Second Internal Demo Rehearsal Script

> **Notice:** The 60-second duration below is an **internal team rehearsal pacing target**, not an official NASA Space Apps Challenge submission rule or time limit. Always check the official competition page for current submission rules.

## Feature Readiness Summary

| Step | Time | Rehearsal Topic | Status on Current Branch (`feature/emma-science-provenance`) |
| --- | --- | --- | --- |
| 1 | 0:00–0:10 | Orbital Imagery (`hirise-mro-pia26306-boxwork-2048x1042-v1`) | **`[PENDING — Branch Integration]`** (Asset and `manifest.json` reside on Gaddielle's branch; loader contract in `MissionService.initialize()` is **`[WORKING]`** in foundation unit tests) |
| 2 | 0:10–0:20 | Science Context (`public/data/markers.json`) | **`[WORKING — Data & Validation]`** / **`[PENDING — UI Panel]`** (3 sourced records verified against NASA Science blogs; `position: null` / `positionStatus: "unavailable"`) |
| 3 | 0:20–0:30 | Route Drawing (Start, Waypoints, Destination, Undo/Clear) | **`[WORKING — Service State]`** / **`[PENDING — Map UI Controls]`** (`applyMapPoint`, `undoRoute`, `clearRoute` implemented in `MissionService`; Leaflet map UI pending Willy & Enzo) |
| 4 | 0:30–0:40 | Uncertainty & Exploration Confidence (`assessRoute`) | **`[WORKING — Assessment Logic]`** / **`[PENDING — Confidence Panel UI]`** (Returns `distanceStatus: "unavailable"` and `terrainStatus: "unavailable"` with explicit warnings) |
| 5 | 0:40–0:48 | Saved Note (`addObservation` & `localStorage`) | **`[WORKING — Service Persistence]`** / **`[PENDING — Notebook UI]`** (`addObservation` persists to `localStorage` before returning `{ ok: true }`; UI form pending Enzo) |
| 6 | 0:48–0:54 | Mission Export (`exportMission`) | **`[WORKING — Service Export]`** / **`[PENDING — Export Button UI]`** (`exportMission()` generates downloadable `marswalk-mission.json` with provenance and limitations) |
| 7 | 0:54–1:00 | Offline Reopening & PWA Installation | **`[PENDING / REQUIRING VERIFICATION]`** (`loadRoute()` restores saved `localStorage` state for the active `imageRef`, but PWA manifest, service-worker caching, and production offline reload remain unimplemented and untested) |

---

## Spoken Rehearsal Narration (60 Seconds)

- **0:00–0:10 (Imagery)** — `[PENDING — Branch Integration / WORKING — Loader Contract]`
  *"Welcome to MARSWALK, an Angular PWA under development for planning traverses across Mount Sharp's boxwork formations in Gale Crater. Our shared service loads a versioned HiRISE PIA26306 raster contract prepared by our data team."*

- **0:10–0:20 (Science Context)** — `[WORKING — Sourced Records / PENDING — Marker UI]`
  *"Alongside the orbital imagery, we display three Curiosity science records covering boxwork ridges, Vera Rubin Ridge, and the clay-to-sulfate transition. Every claim separates observation from interpretation, and because pixel tie-points aren't verified yet, coordinates remain explicitly marked unavailable."*

- **0:20–0:30 (Route Drawing)** — `[WORKING — Service Logic / PENDING — Map UI]`
  *"In our mission service, planners place a start point, waypoints, and destination in pixel coordinates, with full undo and clear history."*

- **0:30–0:40 (Uncertainty & Confidence)** — `[WORKING — Assessment Logic / PENDING — Panel UI]`
  *"Instead of inventing measurements, our assessment logic explicitly reports planar distance as unavailable without verified scale calibration, and flags terrain relief as unavailable for visual review only."*

- **0:40–0:48 (Saved Note)** — `[WORKING — localStorage Persistence / PENDING — Notebook UI]`
  *"Planners can attach field observations tied to the active image reference, which are validated and saved directly to browser `localStorage`."*

- **0:48–0:54 (Mission Export)** — `[WORKING — JSON Export / PENDING — UI Trigger]`
  *"One click exports a versioned `marswalk-mission.json` bundle containing the route, observations, marker provenance, and assessment warnings."*

- **0:54–1:00 (Offline Reopening)** — `[PENDING / REQUIRING VERIFICATION]`
  *"Finally, `loadRoute` restores saved state on reload, and our coordinator is completing PWA service-worker caching so the entire mission pack can reopen reliably offline after production testing."*
