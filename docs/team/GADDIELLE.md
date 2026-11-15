# Gaddielle — Image-pack browser-path compatibility follow-up

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W2](../../TEAM_TASKS.md#w2).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

## Accepted and merged — R3 closed

Your published `a53724a` is integrated. The coordinator closed the remaining R3 encoded/whitespace path gap in **`b744b0b`** with three regressions: **28 data tests and the real index check pass**. Real image/manifest/index bytes and imageRef are unchanged. Do not repeat R1–R3, image acquisition, passport or verifier work; preserve any existing local progress and compare with main.

## Next W2 — release data handoff

Follow [GADDIELLE_RELEASE_DATA_HANDOFF.md](tasks/GADDIELLE_RELEASE_DATA_HANDOFF.md). Keep the existing data branch and merge published main safely. Deliver `docs/data/RELEASE_DATA_HANDOFF.md`: actual required data paths/imageRef, hashes/sizes, built-file correspondence and precise worker include/exclude guidance. Separate image/science/control bytes from total app readiness.

Own this document and only necessary factual updates to existing data handoff docs. No source assets/schema/model/worker/API/dependency changes or another speculative inventory. Record actual verification results and blockers; push only your existing feature branch and report commit. No main merge, deployment, environment publication or messaging.

## Initial assignment reference

The following mission, acquisition checklist and rules describe the original role. Keep them as reference; continue with the current assignment above rather than repeating completed acquisition work.

## Your mission

Find and prepare credible Mars data for the selected Mount Sharp boxwork area in Gale Crater. You own the imagery/terrain role after the swap with Willy. Your name also appears as Gaddiel/Daddiel in earlier requests.

Read [the team allocation](../../TEAM_TASKS.md) and [shared contract](CODING_AGENTS.md). The original brief was written before the Angular foundation and data branch were available; inspect the current checkout before applying its proposed paths.

## Deliverables and ownership

- One usable regional imagery product with documented provenance.
- A verified aligned terrain product, or an explicit unavailable-data report.
- A data manifest, proposed at `public/data/manifest.json`, and preparation notes under `docs/data/`.
- Files or layer details Willy can load and Longla can use for 3D.

Coordinate scientific findings with Emma and shared schemas with the coordinator. Do not change application logic to disguise missing data.

## Original workflow reference — do not repeat accepted delivery

1. Confirm the exact proposed AOI using actual product footprints and rover-localization evidence. General Gale coverage does not prove boxwork overlap.
2. Open Mars Trek and check available imagery/elevation products for that area. Verify usable layer requests rather than copying an untested service URL.
3. Download or open one real sample image. Record its original dimensions, format and source.
4. Search for one overlapping terrain product. Time-box the initial terrain search to one hour.
5. Inspect coordinate reference system, longitude direction/range, orientation, horizontal units, vertical units and datum.
6. Check alignment visually and through metadata. Record NoData and coverage gaps.
7. Prepare a reasonably sized derivative if necessary. Preserve the original product identity and document crop, resize, transform and conversion steps.
8. Hand Willy the imagery/bounds and Longla the terrain/units. Ask the coordinator to trigger the visual-review fallback if terrain remains unverified.

## Metadata checklist for every product

| Field | What to record |
| --- | --- |
| Identity | Product ID/name, provider, primary HTTPS source and credit |
| Coverage | Footprint, AOI overlap evidence and gaps |
| Coordinates | CRS, axes, units, longitude convention and orientation |
| Resolution | Original resolution and derivative resolution, with units |
| Timing | Observation date and retrieval date, when available |
| Processing | Original format, output format and reproducible conversion steps |
| Validity | Verification status, NoData, known uncertainty and intended use |

Use null/unavailable for unknown fields. Never supply guessed coordinates or scale as verified facts.

## Calibration and terrain rules

- Resizing or cropping changes the relationship between pixels and source coordinates.
- A presentation image alone does not establish metric scale or north-up orientation.
- Pixel distance can become metric distance only after independently verified calibration of the exact prepared raster.
- Slope needs validated elevation, units, alignment and NoData handling. Imagery alone cannot supply slope.
- Missing terrain must remain unknown, including along partially covered routes.
- Check source terms and attribution before committing data; coordinate large assets with the coordinator.

## Checks before handoff

- Open the actual prepared file and verify its dimensions and readability.
- Confirm that metadata matches that exact file and processing version.
- Demonstrate image/terrain overlap rather than relying on product names.
- Reproduce a preparation step using the documented command if processing was necessary.
- Confirm the app loads the delivered local asset without an external account.

## Completion and handoff

You are done when usable imagery is supplied with honest coverage information, and terrain is either validated or clearly unavailable. Send the filenames, manifest, provenance, coordinate details, processing instructions and unresolved questions. Explain why each dataset supports the claimed use and where it does not.

## Copy-paste coding-agent prompt

```text
You are Gaddielle's MARSWALK release-data handoff agent. Read TEAM_TASKS.md W2,
docs/team/GADDIELLE.md, docs/team/tasks/GADDIELLE_RELEASE_DATA_HANDOFF.md
and docs/qa/FINAL_BRANCH_INTEGRATION.md.
R3 is closed in main integration b744b0b: 28 data tests and real index pass.
Preserve all completed work; don't repeat fixes/research or regenerate assets.
1. Preserve local work and merge published main into the existing data branch.
2. Deliver RELEASE_DATA_HANDOFF.md with actual required runtime data paths,
   reference, bytes/hashes and production-copy verification.
3. Separate image/science/index-control bytes; don't call this full app/cache
   readiness. Give W6 exact include/exclude guidance, excluding archival master
   and unused reference documents from essentials. No speculative new schema.
4. Record actual commands/results and blockers, with only necessary factual
   edits to existing data docs. No source/core/package/worker/API changes.
Push only this existing feature branch (authorized), report commit/checks.
No main integration, deployment, environment publication or external messages.
```
