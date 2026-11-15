# Image recovery and evidence-workspace integration

**15 November current integration:** all submitted code is merged in `b744b0b`; 131 Angular tests, 28 data tests, build and browser checks pass. [Final evidence](FINAL_BRANCH_INTEGRATION.md). Counts/revisions below describe their earlier tested scopes.


Tested code **`85561a6db762c4728a3a37d5df29acf8245a37da`**, **14 November 2026 (Africa/Douala)**. Includes Willy **`02134f1`** and Emma **`3b7b1c1`** on prior main `9914e70`, with coordinator root mounting and a small correction to Emma's nested-shell import-path handoff.

## Commands and results

- Isolated frozen installs passed. Willy's branch: **56 tests/build pass**; Emma's branch: **69 tests/build pass**. These are separate source baselines, not totals to add.
- After combining on current main and mounting both evidence components, `NG_CLI_ANALYTICS=false npm test`: **81 tests passed across seven files**.
- `NG_CLI_ANALYTICS=false npm run build`: passed; initial assets **465.09 kB**, within unchanged warning/error budgets. No component-style warning; existing Leaflet CommonJS warning remains.
- Root real-service regressions verify one confidence/passport mount, actual imageRef, unknown distance and preserved science-selection behavior.

No shared model/service, dependency, source raster, manifest, markers or index changed. Emma's read-only panels replace the temporary root confidence/metadata detail blocks; map attribution remains with the map. Both branches merged cleanly.

## Production Chromium checks

Served `dist/marswalk/browser` over local HTTP in isolated Chromium contexts. Normal content used the real delivered data. Controlled request interception affected image loading only.

| Scenario | Actual result |
| --- | --- |
| Initial image failure | Explicit Retry Image visible; valid metadata/evidence remain accessible |
| Retry held while mission already imported | No duplicate retry; Reset/Focus remain disabled during load; no automatic request loop |
| Release retry and decode real image | Exactly one overlay and four route paths (line plus three points); navigation restored |
| Export before/after retry | Route, observations and image identical |
| Repeated image failures | Each explicit attempt remains error/retryable; no automatic loop or metadata mutation |
| Science measured/derived search/filter changes | Correct showing/total counts; selected details remain when hidden by filters and when no match remains |
| Clear hidden filters | All three real records restored; located count remains zero |
| Mounted confidence | Imported endpoints/waypoint reflected; metric distance and terrain remain unavailable |
| Mounted passport | Correct imageRef/pixel dimensions/source/limits; unverified calibration explicit |
| Evidence/science interactions | Exported route and notes unchanged |
| Layout | No page/component overflow at 820px tablet viewport or 320px panels within a 390px viewport |
| Normal runtime | No uncaught page errors |

The map unit suite additionally covers decode/dimension failure, superseded callbacks, duplicate attempts, missing metadata and teardown; the evidence suites cover missing/error/empty data, valid derived zero and safe text/links. Browser checks are not physical-device or installed-offline outcomes.

## Integration handoff

Use one `app-science-context`, `app-image-passport` and `app-exploration-confidence` in Enzo's shell. They now exist on this reviewed integration; no competing legacy science/confidence/passport implementation is needed. Preserve mission-file transfer and one root initialization/map. From `src/app/ui/shell/shell.component.ts`, the component import paths begin `../../science/` or `../../evidence/`.

At this earlier snapshot, Enzo reconciliation and R3 were still pending; both are now closed in `b744b0b`. Current follow-ups: install assets, image-byte verifier, release-data handoff, release UI cleanup and clarified actual-device evidence. Full install/cache/update and disconnected reopening remain pending.
