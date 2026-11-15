# MARSWALK — Release Data & Cache Handoff

<!-- CURRENT_WORK_PLAN -->
> **Data Release Handoff Record.** Prepared by Gaddielle (Data/Imagery Owner, [W2](../../TEAM_TASKS.md#w2)) for Coordinator (YOU, [W6](../../TEAM_TASKS.md#w6)) and Enzo ([W3](../../TEAM_TASKS.md#w3)). Current active image derivative: `hirise-mro-pia26306-boxwork-2048x1042-v1`.
<!-- /CURRENT_WORK_PLAN -->

## Purpose & Scope

This document provides the definitive data inventory, verification hashes, production-build copy comparison, and cache include/exclude specifications for the MARSWALK client runtime data assets.

> [!IMPORTANT]
> **Data Boundary Notice:**
> - **Image Payload vs. Full App:** The client image payload totals exactly **524,472 bytes** (manifest + prepared raster). With science context (`markers.json`, 4,515 B) and index control (`image-pack.json`, 452 B), runtime data totals **529,439 bytes**. This must **never** be cited as the full application size or proof of offline readiness.
> - **PWA Lifecycle Boundary:** Full PWA service-worker lifecycle, cache installation, home-screen addition, and disconnected-device reopening belong to the Coordinator (W6) and independent QA (W5). File existence and SHA-256 validation verify local payload integrity, not service-worker caching state.
> - **No Guessed Data:** Missing elevation remains explicitly `unavailable` (`terrainStatus: 'unavailable'`). Metric scale remains unverified (`calibration.verified: false`).

---

## 1. Runtime Data Assets Inventory

The application requires four static data files under `data/` for complete client runtime operation. All four files have been verified, hashed, and committed to the repository:

| Logical Role | Source Repository Path | Production Runtime Path | Byte Size | SHA-256 Checksum (lowercase hex) | Dimensions / Records |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mission Manifest** | `public/data/manifest.json` | `data/manifest.json` | 1,200 bytes | `40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82` | `schemaVersion: 1`, active `imageRef` |
| **Active Map Texture** | `public/data/imagery/PIA26306_derived_2048.jpg` | `data/imagery/PIA26306_derived_2048.jpg` | 523,272 bytes | `7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8` | 2048 × 1042 px, JPEG 4:2:0 |
| **Science Context** | `public/data/markers.json` | `data/markers.json` | 4,515 bytes | `dcc13b2d4bc5160dcdfb416f1c289b3c1c4d913775a2a480024884b7cf7dfd67` | 3 Curiosity observation records |
| **Image-Pack Index** | `public/data/image-pack.json` | `data/image-pack.json` | 452 bytes | `f7b8950489f8053323c0a19e15eb03e19aa1d033e522e9a5b0e0c596096bc7bf` | v1 control index (excludes itself) |

### Byte Size Summary & Boundaries

- **Image Payload Total:** `1,200 + 523,272 = 524,472 bytes` (~512.2 KB).
  Governed by `tools/data/verify_pack.py` and `tools/data/build_image_pack.py`.
- **Runtime Data Total:** `524,472 + 4,515 + 452 = 529,439 bytes` (~517.0 KB).
- **Full PWA Offline Pack (Coordinator W6):** 17 total assets, `1,789,704 bytes` (~1.71 MB), including Angular application chunks, styles, icons, leaflet media assets, `manifest.webmanifest`, `service-worker.js`, and `offline-pack.json`.

---

## 2. Production Build Fidelity (`public/` vs `dist/`)

The Angular production build (`node tools/pwa/build.mjs`) compiles the application into `dist/marswalk/browser`. A byte-level cryptographic audit confirms that runtime data files in `dist/marswalk/browser/data/` match source files in `public/data/` identically:

| Runtime Asset | Source Bytes (`public/`) | Dist Bytes (`dist/...`) | Source SHA-256 | Dist SHA-256 | Match |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data/manifest.json` | 1,200 | 1,200 | `40381b96e243b687...` | `40381b96e243b687...` | **Identical** |
| `data/imagery/PIA26306_derived_2048.jpg` | 523,272 | 523,272 | `7b814497d98d7e5f...` | `7b814497d98d7e5f...` | **Identical** |
| `data/markers.json` | 4,515 | 4,515 | `dcc13b2d4bc5160d...` | `dcc13b2d4bc5160d...` | **Identical** |
| `data/image-pack.json` | 452 | 452 | `f7b8950489f80533...` | `f7b8950489f80533...` | **Identical** |

Verification was performed on `dist/marswalk/browser/data/` immediately following `npm run build`:
```bash
python -c "
import hashlib
from pathlib import Path
for name in ['manifest.json', 'imagery/PIA26306_derived_2048.jpg', 'markers.json', 'image-pack.json']:
    src = Path('public/data') / name
    dst = Path('dist/marswalk/browser/data') / name
    assert src.read_bytes() == dst.read_bytes(), f'Mismatch in {name}'
print('All 4 runtime data files match byte-for-byte.')
"
```

---

## 3. Cache Include / Exclude Guidance for Coordinator (W6)

To ensure rapid offline installation without exceeding device memory or cache quotas, precaching must be selective and governed by explicit inclusion rules.

### Essential Inclusions (Must Be Precached)

1. `data/manifest.json` (1,200 bytes):
   Required for core `MissionService` bootstrap, bounding box configuration, and image metadata.
2. `data/imagery/PIA26306_derived_2048.jpg` (523,272 bytes):
   The active map texture layer required by `MapComponent` (`Leaflet CRS.Simple`).
3. `data/markers.json` (4,515 bytes):
   Curiosity science observation context for `ScienceContextComponent`.
4. `data/image-pack.json` (452 bytes):
   Control index for offline payload integrity audits (`verifyImagePayload` in W3).

### Strict Exclusions (Must NOT Be Precached)

1. **Archival Master JPEG:**
   - **File:** `public/data/imagery/PIA26306.jpg` (2,658,965 bytes, ~2.54 MB, SHA-256: `c3a93d30db3daff7c964c1960d40493c72eb700b4e38d2ccfaabce255f617f5a`).
   - **Reason:** Full-resolution raw NASA/JPL 7488×3813 download. Preserved for provenance and future multi-resolution processing only; not consumed by the active runtime.
   - **Enforcement:** Explicitly excluded in `angular.json` under `assets[0].ignore: ["data/imagery/PIA26306.jpg", "data/terrain/**"]` and omitted by `tools/pwa/build-pack.mjs`. Must **never** be cached by the service worker.
2. **Terrain Search Documentation:**
   - **File:** `public/data/terrain/README.md` (2,356 bytes, SHA-256: `e0cc90e4393f44f471e60f6f4064da294e9486147377a28f83430d4786981969`).
   - **Reason:** Development documentation recording the Mount Sharp DEM investigation and absence of aligned high-resolution terrain.
   - **Enforcement:** Excluded by `angular.json` asset ignore rules.
3. **Indiscriminate Directory Precaching:**
   - The worker must **not** glob `public/data/**` indiscriminately. Only the four declared runtime files should be included.
4. **External Bibliographic Citations:**
   - Hyperlinks in `source.url` fields (`https://photojournal.jpl.nasa.gov/catalog/PIA26306`, NASA PDS Geosciences node, USGS publications) are external provenance links requiring live connectivity and must not be treated as offline assets.

---

## 4. URL Resolution & Path Compatibility

The application is deployed to static hosting (e.g. Vercel, GitHub Pages) and may be mounted at domain root (`/`) or under a subpath (e.g. `/marswalk/`).

1. **App-Relative Base Resolution:**
   - `MissionService` requests `data/manifest.json` and `data/markers.json` via relative HTTP fetch paths (`data/...`).
   - The manifest declares `assetPath: "data/imagery/PIA26306_derived_2048.jpg"`, which resolves against `document.baseURI`.
   - All paths avoid leading slashes (`/data/...`), ensuring seamless resolution under both root and subpath deployments.
2. **Strict Browser Syntax Compliance (R3 Closure):**
   - The image path strictly adheres to runtime regex `^data/imagery/[a-zA-Z0-9_./-]+$`.
   - Forbidden syntax (percent-encoding `%2e%2e` / `%23`, whitespace, control characters, URL query parameters `?`, URL fragments `#`, backslashes `\`, path traversal `..`) is rejected by both `tools/data/build_image_pack.py` and `tools/data/verify_pack.py`.

---

## 5. Handoff to Enzo (W3) — Image Payload Verifier Contract

For W3's pure `verifyImagePayload(index, activeImage, readBytes)` function in `src/app/offline/`:
- **Index Contract:** Exactly matches `public/data/image-pack.json` (`schemaVersion: 1`, `imageRef: "hirise-mro-pia26306-boxwork-2048x1042-v1"`).
- **Files Array:** Exactly two ordered entries:
  1. `data/manifest.json` (1,200 bytes, SHA-256 `40381b96e243b687...`)
  2. `data/imagery/PIA26306_derived_2048.jpg` (523,272 bytes, SHA-256 `7b814497d98d7e5f...`)
- **Total Bytes:** Exactly `524,472`.
- Note: `data/markers.json` and `data/image-pack.json` itself are **excluded** from `image-pack.json` by design. The image-payload verifier should verify only the two files declared in `index.files`.

---

## 6. Verification Commands & Observed Results

The following test suites were executed to validate data tooling, PWA worker logic, and application integration:

| Test Suite | Command | Tests Run | Result | Duration |
| :--- | :--- | :--- | :--- | :--- |
| **Data Tools Regressions** | `python -m unittest discover -s tools/data -p "test_*.py" -v` | 33 | **33 passed** (29 indexer + 4 verifier) | 21.83s |
| **Image-Pack Index Integrity** | `python tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check` | 1 | **Passed** (0 diff, matches active package) | 1.84s |
| **PWA Service Worker Tests** | `node --test tools/pwa/worker.test.mjs` | 11 | **11 passed** | 382ms |
| **Angular Application Tests** | `ng test --watch=false` | 136 | **136 passed** (16 test files) | 14.60s |
| **Production Build & Pack** | `node tools/pwa/build.mjs` | 1 | **Built successfully** (`9407bc02eaae`, 17 assets, 1.78 MB) | 12.52s |
