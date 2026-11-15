# Gaddielle — Remaining data, calibration and deployment work

> Current work piece: [W2](../../TEAM_TASKS.md#w2).

Updated **15 November 2026**. This is your **single remaining-work checklist through deployment and final handoff**. The current tested application is `b744b0b`, published with documentation at `27b1171`: 131 Angular tests, 28 data tests/build/browser checks passed. Those are historical baseline results, not checks of the future work below. [Integration evidence](../qa/FINAL_BRANCH_INTEGRATION.md).

All unchecked items below are **planned**, not claims of implementation. Keep completed work and unseen local progress. Finish or hand off your current slice before switching. Read [the team plan](../../TEAM_TASKS.md), [shared contracts](CODING_AGENTS.md) and [product charter](../../SOUL.MD). This personal file contains the full sequence; earlier files under `tasks/` remain detailed reference specifications for their named slices.

## Already complete — preserve

Image package/passport/index `a53724a` is merged. Coordinator closed R1–R3; 28 baseline data tests and real index check pass. Preserve prepared image/manifest/index bytes, imageRef and coordinate system. Do not repeat fixes, downloads or passport construction without a new reason.

## Phase 1 — Release data handoff, start now

Continue **`feature/gaddielle-data-preparation`**, safely incorporating main. Own `docs/data/RELEASE_DATA_HANDOFF.md` and necessary factual data-doc updates for this slice.

- [ ] Enumerate real runtime manifest, prepared image, science records and image-index control file with exact paths, imageRef, bytes and SHA-256. Verify production copies match source files.
- [ ] Separate **524,472 image-payload bytes** from science/index and complete app size. Give coordinator explicit cache include/exclude guidance; archival master, unused terrain/readme/reference docs and external citations are not automatically essentials.
- [ ] Record actual commands/results and supported root/subpath resolution. No new schema/API/assets or speculative inventory in this slice.

## Phase 2 — Numerical environmental data

After Phase 1 handoff use **`feature/gaddielle-environment-data`** if no task exists. Own proposed `tools/data/prepare_environment.py`, meaningful tool tests, raw-source audit under `docs/data/`, and proposed `public/data/environment.json`. These names reserve ownership; the runtime schema is **not yet agreed or implemented**.

- [ ] First investigate accessible, documented Curiosity REMS reduced pressure/temperature data and RAD dose-rate products. Prefer a small interpretable archival sample. Record exact product/release/source URLs, units, time coverage, quality/missing-value flags and redistribution conditions. No live-conditions claim.
- [ ] Within the first investigation block, deliver a source sample and schema proposal to coordinator/Emma. Do not spend the release window on an unavailable product; document access/interpretation blockers. Do not replace missing radiation with a guessed value or count walking time as an independent measurement.
- [ ] Agree the versioned schema with coordinator **before** generating the runtime file. Proposal must distinguish quantity id/value/unit, observation time interval, instrument/location/sol where verified, quality status, source/product and any documented uncertainty. Unknown values stay explicitly unavailable. Units must match the actual product, not assumptions.
- [ ] Implement reproducible conversion. Filter documented invalid flags/sentinels, preserve legitimate zero values, handle units/time correctly and record included/excluded sample counts. Mean/min/max require a stated sampling interval/aggregation method; do not average incompatible quantities or releases.
- [ ] Deliver pressure and temperature plus radiation if supported by actual sourced data. Each quantity has its own provenance/time window. Different instrument locations/times remain visible; these are regional historical context, not route-local hazards.
- [ ] Verify extraction against representative source rows, negative/missing/invalid-quality cases, deterministic output and no source/output overwrite on failure. Document source hashes and actual test results. Add references with citations; shared app models/loaders remain coordinator-owned.

## Phase 3 — Scale investigation, conditional independent improvement

- [ ] Investigate whether a documented scale bar or product mapping applies to the exact 2048×1042 derivative. Preserve original source/crop/resize evidence and quantify uncertainty where supported.
- [ ] A trustworthy raster scale may support planar distance without full geodetic registration; geographic placement and terrain distance remain separate. Do not infer scale from image brightness or copy another product's resolution blindly.
- [ ] Deliver evidence/proposed calibration to coordinator for shared validation/version handling. No direct coordinate/imageRef/schema changes or claimed terrain model. If evidence is insufficient, leave calibration unverified and record why.

## Phase 4 — Deployment and final data audit

- [ ] Update release data handoff after accepted environmental data: paths, hashes, bytes, data version and intended offline inclusion. Do not alter the image-only index to include unrelated files.
- [ ] Verify deployed served bytes/version match the accepted build; correct base-path/case/MIME failures through coordinator. Check date/unit/source labels with Emma.
- [ ] Confirm bundled records remain readable offline in the actual prepared app with Longla; external source links may require connectivity.
- [ ] Provide final NASA/product/library credits, dataset limitations and provenance for presentation/submission. Label any missing quantity/calibration openly. Retest only changed/relevant data concerns.

## Agent execution and final handoff

Preserve local changes; fetch published main and reconcile safely before starting a slice. Use the proposed branch only if no task branch already exists. No reset, force push or competing application/state store. Work on one slice at a time; hand it off for integration before starting the next dependent slice. A future contract is not an existing API.

For code changes run the relevant behavioral tests, the integrated `npm test` and `npm run build`, plus the actual affected browser workflow. Use data tests for Python/data changes. For static documents/assets, check real facts, paths/links, JSON and decoding/build output as applicable; do not add tests that merely repeat formatting. Record actual results and warnings, not baseline counts copied as new passes. Current build has initial/style warning overruns; do not raise budgets to hide them.

Each handoff includes actual **branch/commit, changed files, dependencies, commands/results, one observed workflow, remaining failures and deployment implications**. A blocked item includes the missing input/device/contract and next action. Do not fabricate numbers, coordinates, participant outcomes, timing, AI inference or hardware passes.

Normal commit/push to your assigned feature branch is authorized. Main merges belong to the coordinator. This plan prepares deployment; it does not itself publish an environment, deploy a site, submit the competition entry or authorize external messages. Preserve NASA/data/library/AI attribution.

Paste this into your coding agent:

```text
Read my personal docs/team file, TEAM_TASKS.md and CODING_AGENTS.md.
Inspect the actual branch and preserve existing work. Identify the first
unfinished, unblocked phase in my checklist and implement that slice only.
Use the listed owned files, real inputs and existing/agreed contracts.
Do not consume future APIs or modify another owner's files speculatively.
Keep all accepted behavior. Check important failure cases and the actual
user workflow; run relevant checks and review the diff before handoff.
Push only my feature branch. Report the actual commit/files/checks,
blockers and deployment effects. Do not start an unrelated redesign,
deployment or main merge. Mark completion only when supported by evidence.
```
