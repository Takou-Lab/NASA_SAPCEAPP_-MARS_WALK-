# Gaddielle review — image-pack index needs corrections

Reviewed tip: **`bf9689bc2e50974b4a7bc2bc6cbe893de9e6605e`** on `feature/gaddielle-data-preparation`, **14 November 2026**. Compared with main **`c897a70`**. Verdict: **changes required before integration**. Her earlier image package, verifier and corrected passport remain accepted; do not repeat them.

## What passed

The submission adds exactly the four assigned deliverables. It reuses `verify_pack.verify_package` and mandatory Pillow decoding, computes real sizes/hashes, writes deterministic JSON atomically and keeps the image-only boundary clear. The committed index matches the current two files: **524,472 bytes**.

- All **14 Python tests passed**: 10 generator tests plus four accepted verifier regressions.
- The real committed index passed `--check`.
- Additional temporary-fixture probes confirmed that output symlink/hardlink aliases of the manifest are rejected, changed valid image bytes make an index stale, and invalid manifests/truncated images preserve existing output.
- A read-only merge preview with current main was clean. No feature code has been merged; a clean merge does not resolve the findings below.

## Required corrections

### R1 — enforce the agreed manifest and browser-path contract

Locations in the reviewed generator: `build_index_data`, lines **66–89**.

The tool accepts `--manifest public/data/other-manifest.json` and emits that path instead of the required `data/manifest.json`. It also accepts a real local image whose assetPath contains a query, fragment or backslash. Reproduced successful outputs include `data/imagery/texture.jpg?v=1`, `data/imagery/texture.jpg#fragment` and a filename containing a backslash.

These filesystem names do not identify the same browser asset URL; a future cache consumer could verify an inventory that cannot fetch its declared file. The assignment explicitly requires `data/manifest.json` and forward-slash paths without query/fragment/traversal.

Fix within the generator, preserving the accepted verifier and source assets:

- Require the normalized app-relative manifest location to be `data/manifest.json` under the chosen public root, with resolved containment retained.
- Validate emitted paths as app-base-relative forward-slash paths. Reject URL/scheme/authority, query, fragment, backslash, absolute path, empty/dot/traversal segments and resolved escapes, including symlinks.
- Reject invalid inputs before writing. Preserve existing output and return exit **1** with a useful error.
- Add temporary-fixture regressions for the noncanonical manifest and query/fragment/backslash image paths. Include a symlink escape. Do not weaken validation to make fixtures pass.

### R2 — validate the complete index shape and JSON types before comparison

Location: `check_index`, lines **143–195**.

Reproduced `--check` results:

| Invalid index mutation | Actual result | Required result |
| --- | --- | --- |
| `schemaVersion: true` | Exit 0 | Exit 1; version must be integer 1, excluding booleans |
| Integer byte fields changed to JSON floats, e.g. `1200.0` | Exit 0 | Exit 1; sizes/totals must be integers, excluding booleans |
| Extra top-level or file-entry key | Exit 0 | Exit 1; require the agreed v1 fields |
| Root JSON `[]` | Exit 1 with `AttributeError` traceback | Exit 1 with a readable invalid-index error |

Python equality treats `True == 1` and `1200.0 == 1200`; field-value comparison alone does not validate this schema. Check root/entry object shapes, exact keys, proper scalar types, ordered two-entry files and digest format before comparing with the computed payload. Handle scalar/list/null roots without uncaught exceptions. Retain useful mismatch messages.

Use temporary indexes. Assert failure leaves their **bytes and modification time unchanged**, creates no output/parent directory when the target is missing, and does not produce a traceback. Keep normal generation byte-identical and retain every current test. Update the tooling document's check behavior and actual test count after adding regressions.

## Checks performed

The branch was extracted into an isolated temporary directory; negative cases modified copies only. Commands on that extracted tree:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/data -p 'test_*.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check
```

Additional probes used temporary copies and the same CLI. No source images, manifest, feature branch or application code were modified. Angular suites were not rerun for this isolated Python review. This does not establish PWA installation, cache completeness or disconnected-device reopening.

## Next action

Stay on **`feature/gaddielle-data-preparation`**, preserve the delivered implementation, merge latest main without reset/force push and fix **R1/R2**. Own generator/tests/tooling documentation; the generated index should remain unchanged for unchanged source assets. Commit/push that feature branch and send its new commit for re-review. No new assignment or main integration until these corrections pass.

Ready-to-paste instructions: [GADDIELLE.md](../team/GADDIELLE.md). Original contract: [GADDIELLE_IMAGE_PACK.md](../team/tasks/GADDIELLE_IMAGE_PACK.md).

---

# Previous accepted review — package and passport `c887286`

Final reviewed tip: **`c88728600552da024efbacf848fc6de658e8772f`**, dated **14 November 2026**. Branch: `feature/gaddielle-data-preparation`. The approved contribution is merged into this main integration. Earlier passport findings at `f265407` are closed.

## Accepted contributions

- Real imagery, stable manifest/reference and offline image inventory.
- Mandatory-Pillow verifier and retained regression coverage.
- Resolution of the three overlapping verifier/inventory conflicts.
- Correct component-image-error versus core-data-readiness handoff.
- Corrected Data Passport with provenance, UI label mapping, pixel bounds and explicit scientific limitations.

The prepared image remains **2048 × 1042**, and the required two-file image payload remains **524,472 bytes**. Image bytes, ImageManifest, source assets, tools, dependencies and application behavior were not changed by the final passport corrections.

## Prior findings closed

| Earlier finding | Verified correction in `c887286` |
| --- | --- |
| Unsupported quality 85 / false no-subsampling claim | Records GDI+ HighQualityBicubic, actual 4:2:0 chroma subsampling, and unrecorded encoder quality |
| Texture described as already precached | Described as required/intended offline asset; worker preparation and full offline reopening remain pending |
| Parent scale conflated with public-release/prepared JPEG scales | Separates parent nominal metadata from the unverified release/derivative scales; current calibration remains false/null |
| Ambiguous parent latitude notation | Uses signed latitude or south notation and explicitly excludes pixel/route georeferencing |

The previous conflict resolutions and four verifier regressions were accepted at `f265407`. A comparison of the final correction showed only Data Passport and related README text changes, with runtime/assets/tools unchanged. The main merge was clean. Documentation checks confirmed the corrected statements and preserved manifest/image hashes; unnecessary application/test reruns were not used as new evidence for unchanged code.

External NASA/archive metadata was not independently re-fetched in this final review. This approval concerns the assigned package/documentation work, not full PWA readiness or new calibrated scientific measurements.

## Previous assignment — delivered at `bf9689b`

This historical handoff is now delivered; use the R1/R2 corrections at the top of this review. The user authorized the bounded coding task: [generate and check the machine-readable image-pack index](../team/tasks/GADDIELLE_IMAGE_PACK.md). It builds on the accepted verifier/data rather than reopening any completed work. Preserve source image bytes and imageRef; do not repeat passport corrections or data acquisition.

Ready-to-paste agent handoff: [GADDIELLE.md](../team/GADDIELLE.md). Current assignment list: [NEXT_TASKS.md](../../NEXT_TASKS.md).
