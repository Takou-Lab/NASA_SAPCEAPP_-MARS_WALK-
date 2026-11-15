# Environmental runtime contract v1

## Current release update — limited excerpt, not independently authenticated archive

At explicit user request, public/data/environment.json now uses **reviewStatus: limited** and contains only two reproducible summaries from Gaddielle's submitted 25-row Sol 3900 excerpt: pressure mean **800.335 Pa** and air-temperature mean **204.700 K**, 25 selected records each. It is not a full-day mean, live weather, map-wide field or independent NASA archive verification. The original download remains HTTP 403 here. Parent-product UTC bounds are labeled as such, not passed off as exact excerpt times. Wind/RAD/other quantities remain unavailable.

Canonical submitted table and normalized label are preserved under data/environment/reviewed-excerpt with hashes pinned in tools/data/build_reviewed_environment.py. Script validates product identity, row/field counts, finite values and exact mask width, selects per-quantity confidence bits, and computes unweighted excerpt statistics. Source byte provenance and all instrument flags/calibration are explicitly not independently certified. This limited admission does not accept Gaddielle's entire daily dataset/extractor or close its outstanding review. Original source/extraction authorship stays credited to Gaddielle.

Validator allows limited content through the same finite/unit/source/count/interval checks, and the UI exposes the limited warning prominently. `pending` continues to reject any measurements; full `accepted` review remains a separate status not assigned to this excerpt. Generator/data regression tests reproduce exact runtime payload, samples and units. Root/unit fixtures still test withholding separately.

Combined Enzo science-navigation + limited-context checks: **223 Angular tests**, **54 data tests**, production build/full pack pass. Initial **450.97 kB**; pack prefix **a80ff718c27e**, 19 assets / 1,678,076 bytes. Local full-process offline recovery and limitation display pass; prior figures below are historical. Preview authentication was disabled for the MARSWALK project at explicit user request so testers can open its previews without accounts. Original production remains unchanged pending release promotion.

Coordinator implementation 15 November 2026, after review of Gaddielle 437a777. Canonical exported types/validator: src/app/core/environment.ts; loader: EnvironmentService. No existing MissionService/model/calculation/persistence API changed.

## Admission gate

public/data/environment.json currently contains **reviewStatus: pending**, an empty readings array and a review note. This is coordinator-authored review metadata, not a verified measurement delivery. Pending status with any readings fails validation. No submitted numeric CSV values were copied into the app. Gaddielle retains original data authorship and her unmerged source work.

Accepted content requires separate actual scientific/provenance review before the coordinator changes status. Validator enforces schema version 1, historical-rover-context, REMS instrument, allowed NASA/PDS archive source hosts and HTTPS without credentials. These checks do not independently authenticate raw data or certify scientific quality.

Reading fields: quantity (pressure/air-temperature/ground-temperature/humidity/uv), matching unit (Pa/K/K/%/W/m²), finite nonnegative value/minimum/maximum with ordered bounds, positive safe-integer sampleCount, nonnegative integer sol, ordered UTC interval, original-product sourceUrl and nonempty qualityNote. Humidity maximum cannot exceed 100. One quantity per sol/interval; duplicate identities rejected. Mean/min/max are derived interval summaries over an explicitly reviewed population, not raw single measurements. Brightness temperature is not automatically a validated ground physical temperature; spectral/quality interpretation needs acceptance before a record is created. Missing measurements are omitted with review/coverage explanation; never coerce sentinel to zero. Valid zero is allowed.

Unknown source locations, detector calibration, time-weighting and confidence flags are reasons to withhold readings, not fill guessed defaults. An approved delivery also needs original product/label/FMT hashes, selected-row/quality/sentinel rules and reproducible aggregate calculations outside the runtime file. Do not convert the CSV by column renaming alone. Wind and RAD are unavailable; do not infer human dose or conditions across the drawn route.

## Loader and panel

EnvironmentService provides readonly status (loading/pending/ready/error) and context signals. initialize() runs once; reload() explicitly retries, removes stale displayed data and ignores older responses. Network or schema failure exposes no measurements. This state is independent of metadata, image display, mission persistence and complete offline readiness.

EnvironmentContextComponent is projected once from coordinator root through existing environmental-context slot; duplicated placeholder removed. Pending review, loading and errors are accessible, with retry and external source connectivity guidance. Ready rendering exists for future accepted data but currently has no scientific readings to display. It does not fetch original archives, edit mission state or initialize MissionService.

Build-pack explicitly includes the small environment.json review metadata; full-pack preparation/verification therefore includes it offline. Raw downloads, CSVs and candidate terrain/thermal files remain excluded. Changing accepted environment content requires a complete build/new pack and update/recovery test. Do not patch live assets manually or add personal notes to this file.

## Latest source review and next handoff

437a777 adds per-quantity rows, FMT/source metadata and terrain/thermal/geology investigation. Its 53 branch tests pass, but extractor still allows nonfinite float values, aggregates beyond confidence-selected populations, tolerates malformed row structure and lacks original-input hash/record matching before output. Claimed source totals/hash representations remain unresolved; archive fetch is HTTP 403 here. Synthetic solar longitude was removed in the latest extractor; that earlier issue is no longer attributed to this version. Existing raw/normalized distinction still needs source reconciliation. No archive product measurement is approved merely by this contract.

Gaddielle: provide one bounded reproducible original pressure/temperature product first, finite-value and exact-field/quality selection with input hash/label matching and atomic output regressions. Preserve ongoing collection. Coordinator maps accepted quantities into this contract; no parallel Enzo runtime API or duplicate component needed. Terrain product candidate/footprint/calibration require separate review before measured slope/distance.

## Coordinator integration verification

Fresh combined suite: **219 Angular tests across 20 files**, **11 worker tests**, production build/full-pack pass; initial **448.47 kB**, unchanged budgets, Leaflet CommonJS warning remains. New tests cover pending-with-values rejection, finite/unit/source/time/count/order/duplicate checks, legitimate zero, retry/stale response handling, immutable published metadata, missing/invalid-data UI and single root projection. No API tests certify actual source observations.

Local production persistent Chromium verifies one panel with measurements withheld, review metadata in offline inventory, keyboard disclosures, native notes/draft failure retention, save/export/import guards, collapsed focus/resize and 390px both-theme no overflow. Complete browser-process restart disconnected before navigation recovers exact route/notes/export and pending environmental panel; optional flat 3D opens/tears down. Pack prefix 433780ed0911, 19 files / 1,674,129 bytes. Temporary evidence /tmp/environment-*. These are local browser checks, not deployed-preview/physical-device or scientific-source acceptance. No site deployment performed.
