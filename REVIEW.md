# MARSWALK — Published branch review

Review date: **14 November 2026**. Baseline: `main` at **`f24f6fc68750f3bfd735132a8e62d3c7fa4f8914`**. This report covers the remote branch tips fetched for this review, not unseen local work. Later commits need a fresh review.

See [NEXT_TASKS.md](NEXT_TASKS.md) for the resulting actions and the named briefs for ready-to-paste coding-agent instructions. Passing a technical review is distinct from integration, external scientific verification and installed-PWA acceptance.

## All published branches

| Branch | Reviewed tip | Result | Action |
| --- | --- | --- | --- |
| `main` | `f24f6fc` | Tests/build pass; integrated map and data baseline | Continue Enzo's UI and coordinator PWA work; do not claim the full offline mission is finished |
| `feature/willy-map-development` | `094fce2` | Accepted and already integrated; tip is an ancestor of main | Sync main and continue the existing Reset View / Focus Route task |
| `feature/emma-science-provenance` | `b0640d9` | Accepted and already integrated; tip is an ancestor of main | Publish the presentation work reported finished locally; do not recreate science or protocol |
| `feature/gaddielle-data-preparation` | `094d042` | Verifier fixes pass; equivalent runtime behavior already on main; three merge conflicts remain | Resolve overlaps against main, preserve regression tests and correct two documentation statements |
| `Tablet-App` | `f24f6fc` | Exactly matches the reviewed main: zero unique commits/diff | No independent contribution or branch owner can be inferred; no separate correctness claim |

No Enzo or Royce/Longla feature branch was visible in the fetched remote heads. This does not establish whether they have completed or in-progress local work. Preserve that work and obtain a published commit before reviewing it.

## Willy — accepted original contribution

Reviewed tip: `094fce28d1004f0988d9b3a2456be4f572ab7690`.

- All four map files are present and integrated; `<app-map>` is mounted once in the root.
- Manifest-based image bounds, bottom-left coordinate conversion, base-relative assets, null-position filtering and source-safe text rendering are consistent with the shared contracts.
- Main retains the coordinator's readiness guard so map clicks cannot dispatch route actions before valid imagery displays.
- The current map suite has 16 checks, including readiness regression cases. The integrated application suite has 32 tests total.
- Reset View and Focus Route are follow-up features. Their absence is not a failure of the original delivered assignment.

**Next:** preserve the published map, merge the latest main into the same feature branch, and implement only the bounded viewport task in [WILLY.md](docs/team/WILLY.md). Do not mount a second component or rebuild the app.

## Emma — accepted delivered science and protocol

Reviewed tip: `b0640d9c7f423eb066ed133e63e4366de981e20c`. Emma uses he/him pronouns.

- Science records, corrected citations, evidence audit, references, AI-use record, internal demo script and usability protocol are integrated.
- All three real records pass the active runtime validator and use the delivered imageRef. Their positions remain null/unavailable, so they are contextual records rather than fabricated map pins.
- Actual outside-user sessions remain pending. The protocol does not claim invented participants or results.
- The user reports the later presentation task finished. `docs/PRESENTATION.md` and `docs/JUDGES_QA.md` are not present at either inspected published ref. Their publication is unverified; this is not a claim that his local work is unfinished.

**Next:** hand off and publish those existing presentation files on his current branch. Do not assign the evidence audit, demo, slides or usability protocol again. See [EMMA.md](docs/team/EMMA.md).

This review validated records and inspected evidence documentation; it did not independently refetch every external scientific source or certify the underlying scientific interpretations.

## Gaddielle — technical fixes pass; integration overlap remains

Reviewed tip: `094d04251602d26277ec1ddf0959e3a860a15594`.

The latest commit updates the verifier, requirements and three data documents. Isolated checks against that branch confirmed:

- Real data passes text and JSON output modes.
- Missing Pillow, a missing manifest and a truncated JPEG return failure in both modes.
- Wrong dimensions return failure.
- Both committed JPEGs fully decode; the prepared image is **2048 × 1042**.
- Image/manifest sizes and checksums match the inventory; required image pack totals **524,472 bytes**.
- The header-only success fallback is removed. The assigned decoding and JSON-exit fixes are complete; do not repeat them.

Main already contains the equivalent mandatory-Pillow fix and four regression tests. A read-only `git merge-tree --write-tree` check identified conflicts in:

1. `tools/data/verify_pack.py`
2. `tools/data/requirements.txt`
3. `docs/data/OFFLINE_DATA_PACK.md`

These are overlapping implementations, not a failing real image. The runtime images and imageRef must remain unchanged.

Two documentation corrections remain on Gaddielle's branch:

- The verifier **calculates and reports** SHA-256 values; it does not compare them automatically with a trusted expected-hash inventory. Main's inventory already uses the accurate wording.
- Image decoding/dimension failures belong to the map's image-display error state. Valid core manifest readiness must not be rewritten merely because the image failed to display.

**Next:** merge current main into his existing branch, resolve the three overlaps while preserving the tested main implementation/regressions and useful processing notes, then prepare the queued Data Passport from existing metadata. See [GADDIELLE.md](docs/team/GADDIELLE.md). No redownload, derivative regeneration or new calibration is required.

## Checks rerun for this review

On the reviewed main baseline:

| Command | Observed result |
| --- | --- |
| `npm test` | 32 tests passed across four files |
| `npm run build` | Passed; Leaflet CommonJS optimization warning remains; bundle within configured budget |
| `PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_verify_pack.py' -v` | Four verifier tests passed |
| Ancestry comparison | Emma and Willy tips are integrated |
| `Tablet-App` comparison | Same commit as reviewed main, no unique changes |
| Read-only Gaddielle merge preview | Three conflicts listed above; no branch or checkout was merged by this review |

Gaddielle's latest branch was separately extracted into a temporary directory and checked through nine CLI scenarios covering successful text/JSON verification, missing dependencies/files, truncation and dimensions. Source assets were not modified.

The [previous production browser checks](docs/qa/MAP_INTEGRATION.md) apply to the same main code baseline. They were not repeated as a new physical-device or installed-PWA test in this review.

## Remaining product limits

Enzo's route controls, contextual science list and notebook UI, PWA installation, complete verified offline reopening and actual user sessions remain pending. Technical checks do not establish those outcomes. No application code, dependency declarations, source data or feature branches are changed by publishing this review and the associated task updates.
