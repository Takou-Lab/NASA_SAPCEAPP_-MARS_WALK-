# Gaddielle — Numerical environmental data and remaining release work

> Current piece: [W2](../../TEAM_TASKS.md#w2). Updated **15 November 2026**. This is your single remaining-work file and coding-agent prompt.

## Completed — do not repeat

- Image package, Data Passport and image-only index are accepted. R3 `42a0dd2` is integrated at `c7ac053`, retaining all 33 data regressions.
- Release-data handoff **`0514da1`** is delivered and accepted with coordinator documentation corrections. [Accepted handoff](../data/RELEASE_DATA_HANDOFF.md), [review](../reviews/GADDIELLE.md).
- The coordinator corrected CRLF-versus-LF byte/hash figures and the full-pack membership description. Current runtime data is **529,376 bytes**; image-only payload **524,472 bytes**; deployed full runtime pack **1,789,610 bytes / 17 files**. Worker and control inventory are outside those 17 entries. No scientific assets were regenerated.
- The PWA is live at **https://marswalk-jet.vercel.app/**. [Actual production checks](../qa/VERCEL_PRODUCTION.md). Home-screen/physical-device acceptance remains Longla/Willy's work. Automatic GitHub deployments are not connected; coordinator must deploy reviewed source changes.

Preserve local progress and original source credits. Do not repeat R1–R3, image acquisition, passport/index creation or the completed release-data handoff.

## Active assignment — real pressure, temperature and radiation data

**Goal:** supply a small, reproducible numerical dataset Enzo can explain in the app, with enough source evidence for the coordinator to agree a shared typed contract. These are historical Curiosity/Gale regional measurements, not current weather or hazards along a drawn route.

First milestone is **actual source samples plus an evidence/schema proposal**. You can complete this while the runtime API is pending. Do not wait for UI work or invent fields on MissionService.

Continue your existing branch if this work has already started. Otherwise merge published main safely and use proposed **`feature/gaddielle-environment-data`**. Keep the accepted data-preparation branch/history. Do not reset/force-push or duplicate an unpublished implementation.

## Phase A — source evidence, start now

Own `docs/data/ENVIRONMENT_SOURCE_AUDIT.md` and small actual source fixtures under `tools/data/fixtures/environment/`. Locate collections through NASA PDS and the instruments' official archive documentation; verify collection/product URLs rather than guessing filenames.

- [ ] Find an interpretable **REMS reduced/processed** product containing atmospheric pressure and air temperature. Prefer a bounded, documented time window with quality information. Record original field names, units, observation timestamps/sols, location context, quality flags, missing sentinels and product/release/version.
- [ ] Independently investigate **RAD** dose-rate products. Distinguish absorbed dose from dose equivalent; confirm units and averaging interval from actual documentation. Do not hardcode a dose unit, conversion factor or uncertainty from prior conversational suggestions.
- [ ] Save a few genuine representative rows plus the relevant label/column definitions for review. Preserve original evidence; synthetic fixtures must be labeled test-only and never presented as NASA measurements. Keep source URL, exact source bytes/hash and extraction method traceable.
- [ ] Write an audit table: quantity, product/collection URL, measured field, unit, time interval, instrument/location, quality/sentinel rules, uncertainty when documented and redistribution/credit requirements. Include actual download/parse commands and observations.
- [ ] If access or interpretation is blocked, record exact URL/HTTP error or missing documentation and hand off the usable material. Do not bypass network policy, scrape random dashboard values or consume the whole release window searching one missing product.
- [ ] Hand coordinator and Enzo the real samples, audit and proposed JSON shape. Aim for pressure, temperature and radiation; if one is unavailable, make that gap explicit. Walking time is derived from assumptions, not an independent NASA measurement substitute.

## Phase B — contract agreement, before runtime generation

Coordinator owns shared models/validation/loading and worker integration; Enzo owns environmental/science/evidence UI and presentation. No environmental runtime API is implemented merely by this plan.

- [ ] Propose a versioned schema with stable quantity ID, value or explicit unavailable state, source unit, observation interval, instrument/location/sol where verified, quality/aggregation method, source/product and documented uncertainty or null.
- [ ] Separate measurement time from publication/download. Do not convert a sol to an Earth date using an invented mission epoch. Unknown observation dates stay unknown. Different REMS/RAD windows remain separately identified.
- [ ] Agree the schema/field semantics through the coordinator before producing `public/data/environment.json` or expecting Enzo to consume it. Put proposals/examples in the audit document meanwhile; do not fabricate an application service or claim a proposed contract already exists.

## Phase C — reproducible converter and numerical output

After agreement, own `tools/data/prepare_environment.py`, `tools/data/test_prepare_environment.py`, agreed small fixtures and **`public/data/environment.json`**, plus the audit/reference documentation. Use existing tooling and standard library where practical; coordinate any new dependency centrally.

- [ ] Parse the documented formats/labels and quality rules. Preserve legitimate zeros. Filter explicit invalid/sentinel samples; do not silently repair malformed records or substitute believable values.
- [ ] Report sample count/time coverage and excluded counts/reasons. Mean/min/max need real samples and a stated aggregation method; handle irregular sampling as documented. Do not pool incompatible instruments/units/locations or invent a time series from one summary.
- [ ] Preserve source units/precision unless a documented conversion is required. Label computed summaries as derived from actual observations and state their interval. Uncertainty is sourced, not guessed; no unsupported route-safety/radiation alerts.
- [ ] Emit deterministic UTF-8/LF bytes. Validate before atomic output replacement; invalid/missing inputs, wrong units/schema or truncated records return nonzero without changing an existing destination's bytes/mtime. Never overwrite source inputs.
- [ ] Test extraction against actual representative rows, valid zero, sentinels/quality rejection, invalid units/time/format, missing inputs, deterministic output and preserved destination on failure. Keep synthetic edge fixtures test-only.
- [ ] Run relevant data tests and index `--check`. Run production build for the new asset and record actual outcomes. Do not claim the live PWA includes/caches the file until coordinator integrates it and deploys a new verified pack.
- [ ] Handoff actual branch/commit, file sizes/hashes, quantity values/units/intervals, source evidence, commands/results and blockers to coordinator/Enzo through your report/MD. Push only your feature branch; no main merge, live deployment or external messages.

## Phase D — deployment data acceptance

- [ ] Update `docs/data/RELEASE_DATA_HANDOFF.md` for accepted environment data: exact committed/built bytes, hashes and runtime paths. Do not add environment/science/control files to the two-file image-only index.
- [ ] Coordinator explicitly includes the new runtime file in the full PWA pack, adds shared loading/validation, integrates Enzo's UI and deploys. Verify the actual deployed version/URL and served bytes with the coordinator.
- [ ] Check displayed units, source/quality/time labels and honest unavailable states with Enzo; confirm local summaries remain readable after preparation/disconnection with Longla. External citations can need internet.
- [ ] Supply final dataset/product/instrument credits and exact limits for Enzo's presentation. No current-condition, precise-route-location or safety claim from regional archive data.

## Conditional later work — exact-raster scale

After the numerical-data handoff, investigate whether a documented scale bar/product mapping applies to the exact 2048×1042 raster, preserving crop/resize/source evidence. Deliver evidence and uncertainty to coordinator; leave calibration unverified if insufficient. No brightness-derived elevation, guessed terrain, source image geometry/imageRef change or shared model mutation. This investigation must not block the numerical samples or already-working offline mission.

## Agent prompt — copy this

```text
You are Gaddielle's MARSWALK numerical-data agent.
Read docs/team/GADDIELLE.md, TEAM_TASKS.md W2, CODING_AGENTS.md and
docs/data/RELEASE_DATA_HANDOFF.md. Preserve completed imagery/R3/handoff.
0514da1 is accepted with canonical-byte/cache-membership doc corrections;
do not repeat that phase. Preserve any unpublished local work.

Start with Phase A: actual documented REMS pressure/temperature samples and
RAD feasibility, an ENVIRONMENT_SOURCE_AUDIT.md and reviewable source rows.
Record real product/field/unit/time/quality/sentinel/uncertainty evidence.
Propose the JSON contract; coordinator agrees shared types/loader and Enzo
consumes the implemented UI API. No invented measurements, dates or API.

After agreement implement the owned local converter/tests/environment.json.
Emit deterministic UTF-8/LF; preserve existing output on invalid input.
Test meaningful extraction/error cases and report actual checks/hashes.
Keep the image-only index unchanged. Coordinator owns full-pack inclusion,
root/core/packages/worker/deployment; Enzo owns UI/presentation.
No guessed units, simulated records labeled measured, route safety claim,
new terrain search before data handoff, or duplicate app/store.
Push only the assigned feature branch and report actual commit/files,
source evidence/results/blockers. No main merge, deployment or messages.
```
