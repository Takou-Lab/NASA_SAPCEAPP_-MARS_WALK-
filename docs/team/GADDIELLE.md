# Gaddielle — Image-pack browser-path compatibility follow-up

## Latest reviewed delivery — keep completed work

Published **`a53724a`** on **`feature/gaddielle-data-preparation`** is reviewed. It is already merged into main via PR #4 (`d814ec4`). **25 Python tests and the real index check pass**; image payload remains **524,472 bytes**. Previous literal-path/manifest/symlink fixes and strict schema/type/read-only errors are complete. Preserve them and all earlier imagery/verifier/passport work.

[The current review](../reviews/GADDIELLE.md) finds one additional compatibility gap, **R3**. Do not repeat R1/R2 or start a new dataset/task.

## Current bounded correction — browser normalization

The generator currently accepts percent-escaped traversal/filenames and trailing whitespace although runtime `validManifest()` rejects them and browsers resolve them differently. Temporary fixtures using these paths produce exit 0 in generation and check mode:

- `data/imagery/%2e%2e/texture.jpg` resolves in the browser to `data/texture.jpg`.
- `data/imagery/texture%23image.jpg` hashes a literal percent-named file but HTTP decoding targets a different filename.
- `data/imagery/texture.jpg ` loses its trailing space during URL parsing.

Align tool path syntax with the existing runtime image-path contract: `data/imagery/` followed only by permitted letters/digits/underscore/dot/forward-slash/hyphen, retaining nonempty segments, no dot/traversal and resolved containment. Reject percent escapes, whitespace/control characters and all previously forbidden forms. Reuse a tool-local syntax helper where useful; do not weaken runtime or accepted verifier behavior.

Add temporary-fixture regressions for these cases, asserting exit 1, no traceback, unchanged existing output bytes/mtime and read-only `--check`. Keep all 25 tests, atomic/alias protection and unchanged real index. Update the tooling document with actual added checks/counts.

## Files, branch and handoff

Continue **`feature/gaddielle-data-preparation`**; preserve local work and merge current main without reset/force push. Own `tools/data/build_image_pack.py`, its test file and `docs/data/IMAGE_PACK_INDEX.md`. No source bytes, manifest/imageRef, shared models, verifier, dependency, app/worker or new calibration changes. The existing real index should stay byte-identical.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/data -p 'test_*.py' -v
python3 tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check
```

Commit/push only this feature branch; that correction push is authorized. Report the new commit, R3 closure and actual commands/results for re-review. No main merge/push, deployment, environment publication, submission or external messaging is included. Complete-app offline preparation remains coordinator-owned.

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
You are Gaddielle's MARSWALK image-pack tooling agent.
Read docs/reviews/GADDIELLE.md (latest R3), docs/team/GADDIELLE.md,
docs/team/tasks/GADDIELLE_IMAGE_PACK.md and docs/team/CODING_AGENTS.md.

a53724a is already merged. 25 Python tests and the real index pass;
previous R1 literal-path cases and R2 schema/type cases are closed.
Preserve all delivered work. Do not repeat passport/image/verifier work.

1. Preserve local work and merge current main into the SAME existing
   feature/gaddielle-data-preparation branch without reset/force push.
2. Fix only R3: make tool image paths match runtime validManifest syntax.
   Reject percent escapes (including %2e%2e), whitespace/control characters,
   and previously forbidden forms. Keep canonical manifest path, permitted
   runtime characters, nonempty segments, no dot/traversal and realpath
   containment/symlink checks. Share tool syntax logic if useful.
3. Add temporary-fixture regressions for encoded traversal, percent-encoded
   filename and trailing/control whitespace. Generation must fail exit 1
   before writing and preserve old bytes/mtime; check stays read-only with
   useful errors and no traceback. Keep every current test and protections.
4. Update tooling documentation and actual test count. Run the complete
   tools/data suite and real --check. Keep the real index byte-identical.
5. Commit/push only this same feature branch (authorized) and report commit,
   R3 closure and actual results for re-review; no new unrelated task.

Own generator, its tests and tooling doc only. Do not change image/manifest/
imageRef/core/schema/verifier/dependencies/worker or reacquire data.
No main integration, deployment, environment publication or messaging.
```
