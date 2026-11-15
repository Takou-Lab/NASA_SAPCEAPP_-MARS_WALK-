# Final submitted-branch integration — 15 November 2026

Reviewed/tested code: **`b744b0b55252b33903b0e67559defaa4901047ee`**. User-facing date/time zone: **Africa/Douala**. This integrates all eight advertised feature-branch tips, preserving their history.

| Branch | Integrated published tip |
| --- | --- |
| `feat/enzo-ui-planner-notebook` | `16a2e667a904dbb9496cc7c0c7a463cadbff58e5` |
| `feature/emma-science-context-ui` | `4efcb5ac9b4af5e0838552d1a4269f56352e0f55` |
| `feature/emma-science-evidence-workspace` | `3b7b1c17f3c4a7f296399bcbebaae00858baa276` |
| `feature/emma-science-provenance` | `947ff1a5ae641fe6fd8c3cdd8247609d787426ab` |
| `feature/gaddielle-data-preparation` | `a53724a43990319f44ca54e3d8693d0f821587ee` |
| `feature/longla-3d-rehearsal` | `23d5180174b6b0000e8503d207b1e793a7ccd1b9` |
| `feature/willy-image-retry` | `02134f1b71389fbadd5f31051fb78c24118d2da4` |
| `feature/willy-map-development` | `21cf6f0ad90144bd67af916d437651d97c40b9b2` |

The older accepted science/navigation/data branches were already ancestors; duplicate merges were unnecessary. New merges preserve image retry, evidence UI, Enzo's shell/mission transfer and Longla's viewer together. No feature branch was deleted or force-pushed.

## Integration decisions

- One shell-owned map and one shared science/confidence/passport presentation. Legacy duplicated confidence/provenance content was replaced by Emma's reviewed components.
- Root initializes MissionService once and retains the file-import limit, read-race guard, replacement warning and actual service results; transfer is accessible through its shell tab.
- Notebook stays mounted across tabs to preserve drafts. The optional 3D viewer stays lazy/opt-in and is destroyed when leaving its tab, releasing graphics resources.
- The viewer camera now fits the actual narrow sidebar aspect ratio; a projection regression verifies all raster corners. No geographic heading, measured terrain or immersive VR is claimed.
- Coordinator closed the remaining image-index R3 syntax gap: percent escapes and whitespace/control paths fail safely. Source image/manifest/markers/index bytes are unchanged.
- Longla's report `23d5180` is preserved in [submissions/LONGLA_23d5180.md](submissions/LONGLA_23d5180.md). Quoted labels/errors differ from the stated source and no measurement artifact supports its 60 FPS claim. Its hardware assertions remain contributor-reported/pending reconciliation, not an accepted physical-device/PWA pass.

## Actual checks

```sh
NG_CLI_ANALYTICS=false npm_config_cache=/workspace/.npm-cache npm ci --no-audit --no-fund
NG_CLI_ANALYTICS=false npm test
NG_CLI_ANALYTICS=false npm run build
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/data -p 'test_*.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check
```

- **131 Angular tests passed across 15 files**.
- **28 Python tests passed**, including new encoded/trailing/control path regressions. Real image index check passes at **524,472 image-payload bytes**.
- Production build passed: initial **587.25 kB**, lazy viewer **595.60 kB**. Warning overruns remain for initial 500 kB, planner style 4 kB and notebook style 4 kB; all stay below error budgets. Existing Leaflet CommonJS warning remains. Budgets were not raised.
- Enzo's isolated latest branch also passed 81 tests/build before integration; previous 56/69/70 counts remain tied to their component/branch revisions and are not added to the integrated total.

## Browser evidence

Headless Chromium 156.0.8078.79 on Linux through Playwright, with software WebGL for graphics checks. Production output was served at local HTTP; development mode was used only for projection/texture-disposal inspection.

- Actual local image plus one science/confidence/passport set; live filters and hidden selected details work in the shell.
- Real map clicks create start/waypoint/destination. Save, clear and undo work; exported metric distance stays null for unverified calibration.
- Exact unsaved draft survives tabs and a controlled storage failure; successful save clears it and exports the note.
- Mission Transfer tab is reachable. Wrong-image import preserves work; matching export imports successfully.
- No viewer chunk/canvas before explicit opening. Leaving the 3D tab destroys the viewer; reopening works without duplicate module fetches.
- Keyboard sidebar clamp holds at 820px; no horizontal page overflow at 390px. Normal production run had no uncaught page errors.
- Controlled image failure followed by Retry Image restores one decoded overlay and navigation readiness.
- Actual WebGL in the tablet sidebar fits all four raster corners in Top-Down; leaving the tab emits texture disposal.
- WebGL2-disabled fallback is readable/local; switching back retains the working 2D mission.

Physical-device confirmation, complete install/cache/update implementation, installed disconnected reopening and outside-user sessions remain pending. This merge does not establish those outcomes or independently re-verify scientific sources.
