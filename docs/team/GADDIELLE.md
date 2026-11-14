# Gaddielle — Mars Imagery and Terrain Data

**Continue existing work:** preserve your current branch and completed results. Finish or hand off the small slice already underway; apply newly added charter tasks afterward. Do not restart the earlier assignment. See [the transition rule](../../SOUL.MD#apply-this-charter-without-restarting-work).

## Current follow-up — offline image-data package

Read [Gaddielle's latest review](../reviews/GADDIELLE.md), [the project review](../../REVIEW.md), [next tasks](../../NEXT_TASKS.md), [SOUL.MD](../../SOUL.MD) and [the shared contract](CODING_AGENTS.md). Continue on **`feature/gaddielle-data-preparation`** and preserve all completed work.

### Accepted delivery and resolved integration — `f265407`

Latest reviewed tip: **`f265407817a405bc133fb10646ff5ff5d37383fb`**. The image package and verifier remain accepted. The earlier three merge conflicts are resolved; the latest branch merges cleanly with the reviewed main. Canonical required-Pillow verification and the four regression tests are retained. Runtime code, asset bytes, manifest, dependencies and verifier behavior match the reviewed integration.

Delivered follow-up:

- `docs/data/DATA_PASSPORT.md` with provenance, processing lineage, v1 UI field labels, limitations and a clearly proposed future schema.
- Updated Pillow prerequisites in the processing log and data handoff.
- Corrected distinction between MapComponent's image-display failure and core manifest/data readiness.

The prepared image remains **2048 × 1042**, and the required image pack remains **524,472 bytes**. Dimensions and checksums match the inventory. Calibration and terrain stay unavailable. The review did not independently reverify every external NASA/archive metadata claim.

**Do not resolve the old conflicts again, rewrite the verifier, reacquire the data or regenerate the imagery.** The remaining work is a small documentation correction to the delivered passport, not another package or Data Passport assignment.

### Current task — correct the passport's recorded claims

Make these targeted changes in `docs/data/DATA_PASSPORT.md` on the same branch:

1. **Processing lineage:** remove the unsupported claim “quality 85, no subsampling” near the processing arrow. The committed processing log records GDI+ HighQualityBicubic; its encoder call supplies default parameters, not an explicit quality 85 setting. The actual committed derivative has **4:2:0 chroma subsampling**, confirmed from its JPEG components. Record only supported facts, and label exact encoder quality unrecorded unless independent evidence establishes it. Do not infer a quality number or regenerate the image to match the wording.
2. **Offline status:** replace the claim that the active texture is already “precached” with “required runtime asset” or “intended for the coordinator's offline pack.” Installation, service-worker preparation and verified full offline reopening remain pending. Keep the package-verification versus PWA-readiness boundary explicit.
3. **Resolution scope:** distinguish the parent orbital observation's nominal scale from the public-release **7488 × 3813 JPEG** and the prepared **2048 × 1042 derivative**. The release JPEG's metric scale is not established by its dimensions or the parent's nominal resolution. Keep both public-release and active-derivative calibration unverified until supported. Do not claim that every known image resize universally requires new ground-control points; the current limitation is the missing verified scale/transform chain for these particular files.
4. If editing latitude notation, use a signed value such as `-4.843°` or `4.843°S` consistently for documented parent-observation context. Do not turn that parent coordinate into a pixel georeference or invent science-marker positions.

Preserve the validated v1 label mapping, exact imageRef, dimensions, bytes/checksums and unavailable terrain/calibration. The optional v2 schema remains a proposal; do not implement new fields in `models.ts` or other application code.

### Checks, completion and handoff

Inspect status and preserve any other local work before syncing the published review from main. No reset or force push is needed. Check the revised passport against `PROCESSING_LOG.md`, `process_image.py`, the actual JPEG metadata and the current manifest. Check that the diff contains only the intended documentation corrections and no changes to image, manifest, verifier or application files.

Retain the earlier fixes: the verifier calculates/reports hashes for comparison rather than automatically comparing against a trusted expected-hash list, and image-display errors remain separate from core metadata readiness. Existing package tests are already accepted; rerun affected checks only if data/tools change and report actual commands, not copied results.

**Done means:** the passport is accurate about recorded processing, scale and pending caching, with the previous package work unchanged. Commit and push **only `feature/gaddielle-data-preparation`**, then provide the commit for re-review. This assignment authorizes that feature-branch push. No main merge/push, deployment, schema change or messages to other people is included. A new assignment follows successful re-review; do not start a new task branch now.

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
You are Gaddielle's data-documentation review agent for MARSWALK.
Read docs/reviews/GADDIELLE.md, REVIEW.md, NEXT_TASKS.md,
docs/team/GADDIELLE.md, docs/team/CODING_AGENTS.md and SOUL.MD.

The delivered passport is reviewed at f265407. Earlier package/verifier
work is accepted, the three merge conflicts are resolved, canonical Pillow
verification and regressions are retained, and the latest branch merges
cleanly with reviewed main. Do not repeat those tasks or prepare a new
passport. Preserve image bytes, manifest and imageRef.

1. Inspect Git status and preserve local work. Continue on
   feature/gaddielle-data-preparation. Sync the published review from main
   without reset, force push or overwriting completed files.
2. Edit docs/data/DATA_PASSPORT.md only for the targeted corrections:
   - Replace unsupported "quality 85, no subsampling" with the documented
     GDI+ HighQualityBicubic processing facts. The actual committed JPEG
     uses 4:2:0 chroma subsampling; exact encoder quality is unrecorded
     unless separate evidence establishes it. Do not infer a quality value
     or regenerate imagery to match the documentation.
   - Replace "precached" with required/intended offline runtime asset.
     Installation, worker preparation and complete offline reopening are
     still pending; file verification alone cannot prove them.
   - Separate the parent orbital observation's nominal resolution from
     the unverified scale of the public-release JPEG and active derivative.
     Keep calibration unverified. Avoid a universal claim that a known
     resize always needs new GCPs; describe this product's missing verified
     scale/transform chain instead.
3. Preserve the existing v1 label mapping, unknown terrain/calibration,
   2048x1042 dimensions, exact imageRef, file sizes and checksums. Any v2
   interface remains an unapproved proposal, not a runtime schema change.
   If normalizing parent latitude, use signed -4.843 degrees or 4.843 S;
   never infer a pixel georeference or marker position from it.
4. Compare the text with PROCESSING_LOG.md, process_image.py, actual JPEG
   metadata and manifest. Confirm no asset, verifier, core or other app file
   changed. Keep accurate hash-reporting wording and component-versus-core
   image-error guidance. No new downloads, processing or verifier rewrite.
5. Run relevant documentation checks. Package tests are already accepted;
   rerun affected checks only for new data/tool changes and report actual
   results. Do not invent external source verification or PWA success.
6. Commit and push this same feature branch, then provide the commit,
   corrected passages and remaining evidence limits for re-review.

Only the own-feature-branch push is authorized. No main merge/push,
deployment, new schema, unrelated task branch or messaging to others.
```
