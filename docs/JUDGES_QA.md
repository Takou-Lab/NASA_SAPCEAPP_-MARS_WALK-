# MARSWALK — Judges' Q&A Reference

> **Purpose:** Factual answers grounded strictly in inspected repository files, verified NASA/USGS sources, and recorded test/review outputs through `22e07ef` (`main`) and `b0640d9` (`feature/emma-science-provenance`). Do not claim unverified metrics, partnerships, or untested offline results. Author: Emma (he/him).

---

### 1. Who are MARSWALK's current users, and is this ready for astronaut navigation?
- **Near-term target users (to evaluate with, not claimed existing customers/partnerships):**
  - **Planetary-science students & educators:** Inspect genuine orbital Mars imagery, trace sourced Curiosity findings, and learn what cannot be inferred from a visual raster alone.
  - **Analogue mission teams:** Rehearse traverse preparation, local note capture, and delayed/disconnected workflows.
  - **Science outreach & research teams / mission-planning researchers:** Carry a curated, attributed study-area package and study how planners make decisions under incomplete information ([SOUL.MD](../SOUL.MD)).
- **Long-term vision vs. current boundary:** Operational astronaut or rover navigation is a **long-term future vision**. The current prototype has no live telemetry, no validated terrain elevation model, and no hazard classification—it is **not** a certified navigation or safety system.

### 2. What does MARSWALK contribute alongside existing tools like NASA Mars Trek or JMARS?
- **Fair comparison:** Tools such as **NASA Mars Trek** and **JMARS** already provide comprehensive global planetary GIS layers, elevation models, and route/profile measurement tools. MARSWALK does not claim those tools lack terrain or routing features.
- **MARSWALK's contribution:** A focused, portable **Angular PWA rehearsal workflow** centered on one bounded study area (Mount Sharp boxwork in Gale Crater) that foregrounds **epistemic transparency**: separating measured, derived, and interpreted science records, keeping unverified positions and uncalibrated distances explicitly `unavailable`, and bundling route/observation provenance into a versioned JSON export (`marswalk-mission.json`).

### 3. Which NASA, USGS, and software resources were actually used?
- **Imagery:** NASA/JPL-Caltech/University of Arizona MRO HiRISE observation **PIA26306 (`PSP_001752_1750`)**, captured Dec. 10, 2006, prepared locally as a **2048 × 1042** JPEG (`hirise-mro-pia26306-boxwork-2048x1042-v1`) in [public/data/manifest.json](../public/data/manifest.json).
- **Curiosity Science Records:** Three specific `science.nasa.gov` mission blog updates verified via HTTP 200 checks in [SCIENCE_EVIDENCE.md](SCIENCE_EVIDENCE.md):
  1. [Curiosity Blog, Sols 4804–4811](https://science.nasa.gov/blog/curiosity-blog-sols-4804-4811-kicking-off-the-final-phase-of-boxwork-exploration/) (Mount Sharp boxwork ridges/hollows, Sol 4803 `2026-02-09`, MAHLI/APXS; paired with `PIA26306` HiRISE context).
  2. [Curiosity Blog, Sol 2121: Blackjack!](https://science.nasa.gov/blog/sol-2121-blackjack/) (Vera Rubin Ridge `'Pettegrove Point'` / `'Ailsa Craig'` target, DRT/MAHLI/APXS characterization and orbital hematite reference).
  3. [Curiosity Blog, Sols 3251–3253](https://science.nasa.gov/blog/sols-3251-3253-celebrating-another-go-around/) (Glen Torridon clay unit to sulfate-rich strata transition, Left Navcam Sol 3247, Drill, CheMin, SAM).
- **Regional / Geological Context:** NASA *Curiosity's Proposed Path Up Mount Sharp* (HiRISE/CRISM/CTX/HRSC orbital mapping context) and USGS SIM-3292 (*Geologic Map of Mars*, Tanaka et al., 2014, 1:20,000,000 scale) listed in [REFERENCES.md](REFERENCES.md). Note: `jpl.nasa.gov/news/nasas-curiosity-rover-explores-a-spiderweb-on-mars/` returned `HTTP 403 Forbidden` during automated verification and was replaced by the accessible `science.nasa.gov` and `PIA26306` records.
- **Software Libraries:** Angular & TypeScript (MIT), Leaflet with `CRS.Simple` (BSD-2-Clause), Vitest + jsdom for unit testing, and Python + Pillow for image-pack verification (`tools/data/verify_pack.py`).

### 4. How do you ensure scientific accuracy and separate observations from interpretations?
- Every record in [public/data/markers.json](../public/data/markers.json) and [SCIENCE_EVIDENCE.md](SCIENCE_EVIDENCE.md) explicitly labels `evidenceType` (`measured`, `derived`, or `interpreted`) and divides the `finding` text into **Observation** versus **Derivation** or **Interpretation**.
- Unsupported details (such as unverified Earth dates, quantitative chemical percentages not present in the blog text, or calcium sulfate veins absent from the Sol 2121 post) were removed during the evidence audit.
- Explicit scientific boundaries state that ancient groundwater mineralization does **not** prove current liquid water, and regional geological units do **not** guarantee rover-scale trafficability or slope safety.

### 5. Why are marker coordinates, metric distances, and terrain slopes marked `unavailable`?
- **Marker coordinates (`position: null`, `positionStatus: "unavailable"`):** Neither the Curiosity blog updates nor the `PIA26306` release provide verified pixel-level tie-points mapping rover drill/bedrock targets onto `PIA26306_derived_2048.jpg`. Rather than inventing map pins, the records render as readable contextual entries.
- **Metric distance (`distanceStatus: "unavailable"`):** `manifest.json` keeps `calibration.verified: false` (`metersPerPixel: null`) because the public Photojournal JPEG and its 2048 × 1042 derivative lack independent ground-control scale calibration (`src/app/core/route.ts`).
- **Terrain slope (`terrainStatus: "unavailable"`):** No validated, co-registered DEM is bundled in v1 ([TERRAIN_EVALUATION.md](data/TERRAIN_EVALUATION.md)), so MARSWALK triggers **visual review only** and never infers elevation from image brightness or assigns a `"SAFE"` classification.

### 6. What is actually implemented and tested right now versus still pending?
- **Implemented & Verified on `main` (`f24f6fc` / `22e07ef`):**
  - Core models, validation, `MissionService` signals, `localStorage` route/observation persistence, and `marswalk-mission.json` export ([src/app/core/mission.service.ts](../src/app/core/mission.service.ts)).
  - Prepared 2048 × 1042 HiRISE image pack (524,472 bytes, 4 passing Python verifier tests in `tools/data/test_verify_pack.py`) and 3 validated science records (`public/data/markers.json`).
  - Mounted Leaflet `CRS.Simple` map (`src/app/map/map.component.ts`) with readiness guards, layer toggles, and zoom/pan — verified by **32 passing unit tests across 4 files**, production `npm run build`, and one-time Playwright desktop (1366 × 1000) / tablet-sized (820 × 1180) smoke checks in [MAP_INTEGRATION.md](qa/MAP_INTEGRATION.md).
- **Pending / In Progress:**
  - Enzo's route-drawing controls, contextual science list, Confidence Panel, and notebook/export UI (`feat/enzo-ui-planner-notebook` at `15b1666`, awaiting fixes in [docs/reviews/ENZO.md](reviews/ENZO.md)).
  - Willy's Reset View / Focus Route buttons (`feature/willy-map-development`) and Gaddielle's Data Passport wording corrections ([docs/reviews/GADDIELLE.md](reviews/GADDIELLE.md)).
  - Coordinator's PWA web manifest, service-worker caching, installation, and physical-device offline close/reopen verification.
  - Three outside-user formative usability sessions ([USABILITY.md](USABILITY.md), currently `PENDING`).

### 7. How was AI assistance used and reviewed?
- AI coding assistants helped scaffold the Angular foundation, data-verification scripts, documentation structure, and source lookups.
- Every AI-assisted artifact underwent human/coordinator and automated verification documented in [AI_USE.md](AI_USE.md) and [REVIEW.md](../REVIEW.md): HTTP checks on every retained NASA URL, strict TypeScript/JSON schema checks against `models.ts` and `validation.ts`, Pillow decoding/dimension regression tests, and strict enforcement against fabricated coordinates, dates, or test results.
