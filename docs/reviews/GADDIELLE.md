# Gaddielle review — synchronization accepted; passport corrections required

Reviewed **14 November 2026**. Branch: `feature/gaddielle-data-preparation`. Tip: **`f265407817a405bc133fb10646ff5ff5d37383fb`**. Main baseline: **`aeb0e9ef595264fd5b32d3210754a40ce10e08de`**.

**Verdict:** the previous merge-conflict and verifier work is accepted. The new Data Passport needs three targeted documentation corrections before approval. Stay on the same branch; do not repeat image preparation, change the verifier, or start another task yet.

## Completed and accepted

- Merge commit `3ae290d` resolves the three previously reported conflicts. The current read-only merge preview is clean.
- Verifier, required-Pillow dependency, regression tests and image inventory match canonical main.
- Runtime code, public assets, tools, package/lockfile and configuration are unchanged from main.
- All four verifier regression tests passed in an isolated temporary extraction of the branch.
- The prepared JPEG fully decodes at **2048 × 1042**. Image/manifest checksums and the **524,472-byte** runtime image-pack total match the new passport.
- The map handoff now correctly separates MapComponent image-display errors from core manifest/data readiness.
- The v1 UI field mapping, bottom-left pixel bounds, unavailable calibration/terrain and distinction between package verification and full PWA readiness are useful and consistent.
- Future schema fields remain a proposal; no runtime interface has been changed.

The new branch delta is documentation only: `docs/data/DATA_PASSPORT.md`, a Pillow prerequisite in the processing log, and corrected image-error guidance in the data README.

## 1. Correct the processing statement

**File:** `docs/data/DATA_PASSPORT.md:82`.

The lineage currently says `bicubic resampling, quality 85, no subsampling`.

Evidence checked:

- The processing log records **HighQualityBicubic (GDI+)** for the committed derivative.
- The GDI+ implementation calls its JPEG encoder without recording an explicit quality/subsampling setting; it does not establish quality 85.
- The alternative Pillow resize path uses LANCZOS and quality 90, so the statement does not describe that path either.
- Inspection of the actual committed JPEG reports `JpegImagePlugin.get_sampling(...) == 2`, with Y sampling 2 × 2 and chroma 1 × 1: **4:2:0 chroma subsampling**. Thus “no subsampling” is false for the unchanged delivered image.

**Correction:** describe the documented GDI+ bicubic processing and actual image encoding evidence. Mark encoder quality as unrecorded unless a retained source establishes it. Do not infer an exact quality value from the checksum or regenerate the image to match the prose.

## 2. Describe offline caching as pending

**File:** `docs/data/DATA_PASSPORT.md:88`.

The asset role says the texture is `precached for offline tablet use`. The project has not implemented or verified the required production PWA caching lifecycle.

**Correction:** say the texture is a **required/intended offline image asset**. Keep actual precaching, installation and offline reopening marked pending until the coordinator verifies them. A locally bundled file is not proof of a prepared offline pack. Retain the existing PWA scope boundary at the top of the passport.

## 3. Separate parent-observation scale from release/derivative scale

**File:** `docs/data/DATA_PASSPORT.md:45–46`.

The master-resolution row places the parent's nominal 25 cm/pixel value alongside the 7488 × 3813 public-release JPEG. The next row broadly states that orbital scale cannot be linearly scaled without ground control points.

**Correction:** distinguish these three products:

1. Parent orbital observation: nominal metadata, supported by the cited parent-product evidence.
2. Public-release JPEG: its own ground scale/georeferencing has not been independently established for this project.
3. Prepared 2048 × 1042 derivative: metric calibration remains unverified.

A nominal parent scale alone does not establish the prepared raster's scale. Avoid the universal claim that a known, calibrated raster cannot be rescaled without new ground control points; a verified transformation/lineage can support such a derivation. For the current data, keep `verified: false`, null metric scale and unavailable distance. Do not add calibration or geographic coordinates to the runtime schema.

When editing the parent-coordinate row, use consistent notation such as signed latitude `-4.843°` or `4.843°S`, and keep it clearly associated with the parent observation rather than prepared-image pixels. Do not use that row as route georeferencing.

## Checks and review limits

| Check | Observed result |
| --- | --- |
| Branch/main comparison | Only three documentation files differ; runtime/assets/tools/dependencies/configuration match |
| Read-only merge preview | Clean; previous three conflicts are resolved |
| `PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_verify_pack.py' -v` on isolated branch extraction | Four tests passed |
| Full decoding, dimensions, sizes and hashes | Match the passport and inventory |
| JPEG encoding inspection | Sampling code 2, 4:2:0; contradicts “no subsampling” |

Prepared-image SHA-256 remains `7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8`. No asset or imageRef changes are required. External NASA/archive metadata was not independently re-fetched in this review. No new Angular build/browser cycle was required because the branch contains no application changes.

## Same-branch handoff

1. Preserve the accepted synchronization, files and scientific limitations.
2. Make only the documented passport corrections, plus any directly necessary wording alignment in the existing data notes.
3. Check local references, field labels, dimensions, byte counts, hashes and unchanged imageRef. Ensure no claim implies current metric calibration or verified offline readiness.
4. Commit and push `feature/gaddielle-data-preparation` normally; provide the corrected commit for re-review.

No new assignment is issued until this small documentation review passes. The next task must not reopen the completed verifier or image delivery.

Ready-to-paste prompt: [GADDIELLE.md](../team/GADDIELLE.md). Project review: [REVIEW.md](../../REVIEW.md).
