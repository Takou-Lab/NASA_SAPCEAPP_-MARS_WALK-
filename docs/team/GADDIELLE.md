# Gaddielle — Mars Imagery and Terrain Data

**Continue existing work:** preserve your current branch and completed results. Finish or hand off the small slice already underway; apply newly added charter tasks afterward. Do not restart the earlier assignment. See [the transition rule](../../SOUL.MD#apply-this-charter-without-restarting-work).

## Current follow-up — offline image-data package

Read [the published review](../../REVIEW.md), [next tasks](../../NEXT_TASKS.md), [SOUL.MD](../../SOUL.MD) and [the shared contract](CODING_AGENTS.md). Preserve completed work and continue on **`feature/gaddielle-data-preparation`**.

### Technical signoff — `094d042`

The latest reviewed branch commit is **`094d04251602d26277ec1ddf0959e3a860a15594`**. The original image/package assignment and requested verifier corrections pass the reviewed checks:

- The real package fully decodes with Pillow in text and JSON modes.
- Missing Pillow, a missing manifest and a truncated JPEG fail with nonzero exit codes in both modes; wrong dimensions also fail.
- The prepared image is **2048 × 1042**; the master is **7488 × 3813**. File sizes and SHA-256 values match the inventory.
- The required image pack remains **524,472 bytes**. Image bytes and `imageRef` are unchanged.
- Inventory, qualified regional-coverage documentation and Willy's image/coordinate handoff are delivered.

**Do not repeat image preparation, rewrite the verifier or reopen the earlier Pillow fixes.** `main` at `f24f6fc` already implements the equivalent mandatory-Pillow correction and includes four regression tests. This signoff covers technical package behavior, not independently reverified scientific source claims or complete offline PWA readiness.

### New action — synchronize the parallel fixes

A merge-tree check between `094d042` and `main` at `f24f6fc` reports conflicts in exactly these files:

- `tools/data/verify_pack.py`
- `tools/data/requirements.txt`
- `docs/data/OFFLINE_DATA_PACK.md`

The conflicts come from parallel implementations of the same fix. Preserve local work, fetch the latest `main` and merge it into your existing feature branch. Resolve these overlaps by keeping the canonical integrated main verifier, required-Pillow dependency and regression coverage. Preserve any new useful documentation; do not replace the main version with an older fallback implementation.

In the inventory, say the verifier **calculates/reports SHA-256 values for comparison**. It does not compare against an independently trusted expected-hash inventory. Keep the full-PWA versus image-pack boundary clear.

Correct the existing image-failure guidance in `docs/data/README.md`: a failed image load or dimension mismatch belongs to MapComponent's image-display error state. Core `dataStatus` reports manifest/data loading and may remain ready when valid metadata exists but the image cannot display. Do not ask Willy to mutate the shared core status for a rendering failure.

After resolving the merge, run the existing verifier and its regressions. This is confirmation that the integration preserved the accepted behavior, not a request to implement another verifier:

```sh
python tools/data/verify_pack.py --manifest public/data/manifest.json --public-root public --json
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_verify_pack.py' -v
```

Use the required Pillow dependency. Keep the committed images and manifest unchanged, and run the project's actual tests/build if the integration affects application files.

### Queued next deliverable — Data Passport

After synchronization, prepare **`docs/data/DATA_PASSPORT.md`** using the metadata and evidence already collected. It is a separate follow-up, not unfinished prior work. Include source/credit, date when verified, coverage/resolution when known, exact image reference, preparation steps, checksums, verification status and limitations. Map existing manifest fields to readable labels for Enzo. Document unknowns explicitly and propose extra runtime fields to the coordinator before changing a shared schema.

Do not reacquire data or regenerate the derivative for this document. Metric calibration and terrain remain unavailable. An image-pack pass cannot establish installation, complete offline reopening or mission persistence.

### Handoff and publication

Report the conflict resolutions, documentation corrections, actual verification commands/results, and whether the queued Data Passport is delivered or still pending. Commit and push **only your feature branch**; this assignment authorizes that push. Do not merge/push `main`, deploy, create another service worker, alter shared Angular models or send messages to teammates through tools without applicable authorization.

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
You are Gaddielle's data-integration agent for the Angular MARSWALK PWA.
Read REVIEW.md, NEXT_TASKS.md, docs/team/GADDIELLE.md,
docs/team/CODING_AGENTS.md, SOUL.MD and docs/data/IMAGE_CONTRACT.md.

The previous package/verifier work is technically accepted at 094d042
(full SHA 094d04251602d26277ec1ddf0959e3a860a15594).
The equivalent mandatory-Pillow fix already exists in main at f24f6fc.
Do not repeat image preparation, reacquire files, replace imageRef or
implement the same verifier correction again.

1. Inspect Git status and preserve local work. Continue on the existing
   feature/gaddielle-data-preparation branch. Fetch and merge the latest
   main into it without resetting, force-pushing or overwriting other work.
2. Resolve the known parallel-fix conflicts in tools/data/verify_pack.py,
   tools/data/requirements.txt and docs/data/OFFLINE_DATA_PACK.md. Keep the
   canonical main verifier, required Pillow dependency and existing
   tools/data/test_verify_pack.py regressions. Preserve useful new docs.
   Never restore a header-only success fallback.
3. Make inventory wording accurate: the tool calculates/reports hashes
   for comparison; it does not compare to an independently trusted list.
   Preserve runtime/archival distinctions and the image-data-only scope.
4. In docs/data/README.md, correct the image-load/dimension failure handoff:
   MapComponent owns its image-display error state; core dataStatus is
   metadata/data readiness and may remain ready. Do not change core or map
   code merely to force a rendering failure into the core status.
5. Confirm accepted behavior survived the merge by running:
   python tools/data/verify_pack.py --manifest public/data/manifest.json --public-root public --json
   PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_verify_pack.py' -v
   Report real outcomes. The package remains 2048x1042 and 524472 bytes;
   image bytes/reference must stay unchanged. Missing Pillow/files,
   truncation and wrong dimensions must fail. No repeated implementation.
6. After synchronization, the queued NEW deliverable is
   docs/data/DATA_PASSPORT.md, using existing metadata only. Supply source,
   credit, verified date, coverage/resolution when known, imageRef,
   processing, checksums, verification status and limitations for Enzo.
   Map current manifest fields to labels; propose schema changes centrally.
   No new downloads or image regeneration are needed.
7. Keep metric calibration/terrain unavailable and unknowns explicit.
   Package validation does not prove installation or full offline mission
   readiness. Do not alter another person's application/PWA work.

Own the data-tool/docs integration only. Commit and push the existing
feature branch; that push is authorized. Handoff commit, conflicts resolved,
files, actual checks, documentation fixes and next-deliverable status.
No main merge/push, deployment or messaging without applicable authorization.
```
