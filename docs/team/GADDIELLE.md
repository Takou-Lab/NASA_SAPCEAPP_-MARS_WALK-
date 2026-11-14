# Gaddielle — Mars Imagery and Terrain Data

## Current follow-up — offline image-data package

Read [the detailed task](tasks/GADDIELLE_IMAGE_PACK.md), [the accepted review](../reviews/GADDIELLE.md), [REVIEW.md](../../REVIEW.md), [NEXT_TASKS.md](../../NEXT_TASKS.md) and [SOUL.MD](../../SOUL.MD). Preserve completed work and continue on `feature/gaddielle-data-preparation`.

### Accepted delivery — `c887286`

The image package, strict Pillow verifier, conflict resolutions and corrected Data Passport are accepted and included in this integration. The passport distinguishes recorded processing, actual 4:2:0 subsampling, unrecorded encoder quality, unverified image scales and pending offline caching.

Do not repeat acquisition, image processing, verifier fixes, conflict resolution or passport corrections. Preserve the image, manifest and imageRef. The prepared image remains 2048 × 1042; the required two-file image payload remains 524,472 bytes. Calibration and terrain remain unavailable.

### New task — machine-readable image-pack index

Create:

- `tools/data/build_image_pack.py`
- `public/data/image-pack.json`
- `tools/data/test_build_image_pack.py`
- `docs/data/IMAGE_PACK_INDEX.md`

Follow the [exact specification](tasks/GADDIELLE_IMAGE_PACK.md):

- `schemaVersion: 1`, active `imageRef`, ordered `files` and `totalBytes`.
- Exactly two entries: manifest first, referenced prepared image second.
- Each entry has app-base-relative `path`, actual `bytes` and full lowercase `sha256`.
- Exclude the index itself, archival master, science records and built application. `totalBytes` sums only the two declared payloads.
- Reuse the existing `verify_package` and Pillow/full decoding; do not duplicate validation or add dependencies.
- Generate deterministic JSON without timestamps or absolute paths. Resolve inputs inside the public root and reject output paths aliasing an input.
- Write atomically; failure preserves the previous output. `--check` is read-only and fails nonzero for missing, stale or mismatched indexes.

Commands:

```sh
python tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json
python tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check
```

### Verification and handoff

Test actual sizes/hashes, exclusions, deterministic output, fresh checking, stale/tampered data, missing/corrupt inputs and preservation of prior output. Use temporary fixtures; retain the four accepted verifier regressions. Follow the detailed task for path containment, source preservation and failure cases.

Document prerequisites, commands, schema and image-only scope. This index supports the coordinator's future offline pack; it does not establish installation or complete offline readiness. Do not change ImageManifest or implement the passport's proposed v2 schema.

After publication of this integration, fetch and merge main into the existing branch while preserving local work. Implement the bounded task, commit and push only that feature branch, then report the commit, generated paths and actual checks. No main merge/push, application/core/schema/dependency/service-worker changes, deployment, environment publication or messaging to others is included.

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
You are Gaddielle's image-pack indexing agent for MARSWALK.
Read docs/team/tasks/GADDIELLE_IMAGE_PACK.md, docs/team/GADDIELLE.md,
docs/reviews/GADDIELLE.md, REVIEW.md, NEXT_TASKS.md and SOUL.MD.

Work through c887286 is accepted and integrated. Do not repeat earlier
fixes, reacquire data or regenerate imagery.

1. Preserve local work. After this integration is published, fetch and
   merge main into feature/gaddielle-data-preparation without resetting.
2. Create only:
   tools/data/build_image_pack.py
   public/data/image-pack.json
   tools/data/test_build_image_pack.py
   docs/data/IMAGE_PACK_INDEX.md
3. Follow the detailed task's exact v1 schema: active imageRef, files
   ordered manifest then prepared image, each with base-relative path,
   actual bytes and full lowercase SHA-256; totalBytes sums those two files.
   Exclude the index itself, archival master, science records and app build.
4. Reuse verify_pack.verify_package and required Pillow/full decoding.
   Keep source files unchanged; no new dependencies or duplicate verifier.
5. Provide explicit --manifest, --public-root and --output arguments.
   Check path containment and reject output aliasing either input.
   Generate deterministic stable JSON without timestamps/absolute paths.
   Write atomically and preserve previous output on failure.
   --check must be read-only and return nonzero for missing/stale/mismatched
   output without rewriting it.
6. Test hashes/sizes/exclusions, repeated identical generation, fresh check,
   stale/tampered payloads, missing/corrupt inputs and preserved old output.
   Use temporary fixtures and retain existing verifier regressions.
7. Document and run the real generate/check commands. Report actual test
   counts/results, generated paths and remaining limitations.

This is an IMAGE-only index for future coordinator integration, not full
PWA readiness. Preserve image bytes, manifest, imageRef and shared models.
Use the learner checkpoint for this new coding slice, not completed work.
Commit and push only the existing feature branch; that push is authorized.
No main merge/push, deployment, environment publication, app/PWA changes or
messaging to others.
```
