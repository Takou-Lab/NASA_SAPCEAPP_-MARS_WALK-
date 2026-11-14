# Gaddielle — Mars Imagery and Terrain Data

## Current follow-up — correct the submitted image-pack index

Latest reviewed branch: **`feature/gaddielle-data-preparation`** at **`bf9689b`**. Verdict: **changes required**. Read [the exact review](../reviews/GADDIELLE.md), [original index specification](tasks/GADDIELLE_IMAGE_PACK.md), [shared contract](CODING_AGENTS.md) and [NEXT_TASKS.md](../../NEXT_TASKS.md).

Your image package, verifier and corrected passport through `c887286` remain accepted and integrated. The new generator/index/tests/documentation are delivered: all **14 Python tests pass**, and the real index matches **524,472 bytes**. Preserve that work. The generator is not yet approved or merged.

### Correction 1 — manifest and browser-safe paths

Keep the manifest at the selected public root's `data/manifest.json`; reject other locations even when contained. Validate emitted app-relative paths: forward slashes, no URL/query/fragment/backslash, absolute path, empty/dot/traversal segment or resolved symlink escape. The review reproduces successful generation for an alternate manifest and filenames with `?`/`#`/backslash; these must fail with exit 1 and leave existing output untouched.

### Correction 2 — strict read-only index checking

Before comparing values, validate the root and entry objects, exact v1 keys and JSON types. Integer fields must exclude booleans and floats. The current checker accepts `schemaVersion: true`, float sizes and extra fields; `[]` crashes with a traceback. Reject these cleanly with exit 1, preserve output bytes/mtime and retain meaningful errors for stale content. Keep ordering, full lowercase SHA-256 and exact payload comparison.

Add temporary-fixture regressions for both corrections. Preserve all 14 current tests, alias protection, full-image validation and atomic writing. Confirm missing targets are not created by `--check`; update documentation and report the new actual test count. See R1/R2 in [the review](../reviews/GADDIELLE.md) for exact acceptance cases.

### Scope and handoff

Continue on the **same feature branch**. Preserve local work; merge latest main without reset or force push. Edit only `tools/data/build_image_pack.py`, `tools/data/test_build_image_pack.py` and `docs/data/IMAGE_PACK_INDEX.md`; regenerate `public/data/image-pack.json` only if necessary, with identical output for unchanged assets. Keep ImageManifest, source files, accepted verifier, dependencies, app/core and service-worker work unchanged.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/data -p 'test_*.py' -v
python3 tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check
```

Commit/push only `feature/gaddielle-data-preparation`, then report the commit, files, R1/R2 fixes, actual commands/results and remaining limits. That feature-branch push is authorized. No new task, main merge/push, deployment, environment publication or external messaging is assigned. This remains an image-only inventory, not complete PWA readiness.

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
You are Gaddielle's MARSWALK coding agent. Continue the SAME branch:
feature/gaddielle-data-preparation. Reviewed commit bf9689b has changes
required; do not restart the generator or repeat accepted image/passport work.

Read docs/reviews/GADDIELLE.md (R1/R2), docs/team/GADDIELLE.md,
docs/team/tasks/GADDIELLE_IMAGE_PACK.md and docs/team/CODING_AGENTS.md.
Preserve local work and merge latest main without reset or force push.

14 Python tests and the real index check pass, but review reproduced gaps:
1. Enforce manifest app-relative path data/manifest.json inside public root.
   Reject emitted paths containing URL/query/fragment/backslash, absolute
   paths, empty/dot/traversal segments or resolved escapes/symlinks.
   Alternate contained manifest and image filenames with ?/#/backslash
   currently succeed; make them exit 1 before writing, preserving old output.
2. Validate complete v1 index shape/types before comparing payload values.
   Require object root and entries, exact keys, integer fields excluding bool
   and floats, correct strings/digests and ordered two-file payload.
   schemaVersion:true, float bytes and extra keys currently pass --check.
   [] currently crashes. Reject all cleanly, exit 1 with useful errors and no
   traceback; --check must preserve bytes/mtime and never create missing paths.
3. Add temporary-fixture regressions, retaining every current test, alias
   protections, deterministic atomic generation and full Pillow validation.
   Update tool documentation and actual test count. Keep the index identical
   for unchanged real assets; compute hashes/sizes from inputs, not constants.
4. Run the complete tools/data Python suite and real --check command from
   the brief. Report actual results, R1/R2 closure and the new commit.

Edit only generator, its tests and tooling document; generated index only
if needed. No source image/manifest/verifier/schema/dependency/app/PWA edits.
Commit/push only this feature branch (authorized), then request re-review.
No main integration, deployment, publication or external messaging.
```
