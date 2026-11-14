# MARSWALK — Published branch review

Review date: **14 November 2026**. Baseline: `main` at **`f24f6fc68750f3bfd735132a8e62d3c7fa4f8914`**. This report covers the remote branch tips fetched for this review, not unseen local work. Later commits need a fresh review.

**Supplemental Enzo review:** `15b1666` was subsequently reviewed against main `ee9f6ae` (the same application code with the published review documents). **Changes required:** 47 branch tests pass, but the production build fails on remote Google Fonts; duplicate core/bootstrap, placeholder map, inaccessible unlocated science, draft loss and sidebar sizing need correction. See the [full Enzo review](docs/reviews/ENZO.md). No Enzo feature code has been merged.

**Latest Emma review:** science UI **`4efcb5a`** on `feature/emma-science-context-ui` is **approved, integrated and mounted**. Current-main integration passes 51 tests, production build and recorded keyboard/layout/error browser checks. Presentation/research stay accepted. His substantial follow-up combines science counts/search/filters and future read-only confidence/image-passport presentation transferred from Enzo. See [review](docs/reviews/EMMA.md) and [new agent assignment](docs/team/EMMA.md); no repeat earlier work.

**Latest Willy review:** navigation `21cf6f0` passed 38 tests, production build and Chromium keyboard/touch-emulated checks and is approved/integrated. See [Willy's review](docs/reviews/WILLY.md). The next bounded task is map-owned image retry, not repeated navigation or root mounting.

**Latest Gaddielle review:** image-pack generator/index **`bf9689b`**, compared with main `c897a70`: **changes required**. All 14 Python tests and the real index check pass, but canonical/browser-safe paths and strict index shape/type validation need correction (R1/R2). Feature code is not merged; a read-only merge preview was clean. Earlier package/passport `c887286` remains approved and integrated. See [the latest review and correction brief](docs/reviews/GADDIELLE.md); preserve the existing implementation and repair the same branch before a new task.

**Latest Royce/Longla review:** at the user's request, the coordinator implemented the corrections in code **`2a6dbba`** on `feature/longla-3d-rehearsal`, including main `d814ec4`. **R1–R5 verified closed on that branch:** 70 tests/build, production lazy/fallback/mission-preservation checks and actual WebGL camera/resource/orientation checks pass. Feature integration into main remains pending. Next work is actual-device QA, not more terrain/VR. [Review](docs/reviews/LONGLA.md), [evidence](docs/qa/VIEWER3D_REVIEW.md), [prompt](docs/team/LONGLA.md).

See [NEXT_TASKS.md](NEXT_TASKS.md) for the resulting actions and the named briefs for ready-to-paste coding-agent instructions. Passing a technical review is distinct from integration, external scientific verification and installed-PWA acceptance.

## All published branches

| Branch | Reviewed tip | Result | Action |
| --- | --- | --- | --- |
| `main` | `f24f6fc` | Tests/build pass; integrated map and data baseline | Continue Enzo's UI and coordinator PWA work; do not claim the full offline mission is finished |
| `feature/willy-map-development` | `21cf6f0` | Navigation approved/integrated; 38 tests/build and keyboard/touch-emulated checks pass | Begin map-owned image retry on proposed `feature/willy-image-retry` from published main |
| `feature/emma-science-provenance` | `947ff1a` | Presentation delivered/integrated; earlier work retained | Preserve; subsequent science component accepted below |
| `feature/emma-science-context-ui` | `4efcb5a` | Science component approved, integrated/mounted; 51 integrated tests/build and production browser checks pass | New `feature/emma-science-evidence-workspace`: science discovery, confidence/image-passport presentation and QA handoff |
| `feature/gaddielle-data-preparation` | `bf9689b` | Index needs corrections; 14 Python tests and real check pass; prior package/passport accepted | Fix R1/R2 path and index-validation findings on the same branch, then re-review |
| `feat/enzo-ui-planner-notebook` | `15b1666` | Changes required; 47 tests pass, production build blocked by external fonts, UI/core integration and behavior issues reproduced | Preserve the UI and repair the same branch using [ENZO.md](docs/reviews/ENZO.md); no new assignment/branch yet |
| `feature/longla-3d-rehearsal` | `2a6dbba` | R1–R5 corrected/verified on feature branch; 70 tests/build and browser checks pass; main integration pending | Actual-device QA and truthful blocked/pending PWA gates using [LONGLA.md](docs/team/LONGLA.md) |
| `Tablet-App` | `f24f6fc` | Exactly matches the reviewed main: zero unique commits/diff | No independent contribution or branch owner can be inferred; no separate correctness claim |

No Royce/Longla feature branch was visible in the original fetched remote heads; `aedfd4d` is now available and reviewed above. Enzo's branch also became available later and is covered by its supplemental review. Remote visibility does not establish whether other local work is complete; preserve it and obtain a published commit before reviewing it. This record covers named reviewed tips; other newly published branches require their own review.

## Willy — original accepted contribution; latest navigation approved above

Reviewed tip: `094fce28d1004f0988d9b3a2456be4f572ab7690`.

- All four map files are present and integrated; `<app-map>` is mounted once in the root.
- Manifest-based image bounds, bottom-left coordinate conversion, base-relative assets, null-position filtering and source-safe text rendering are consistent with the shared contracts.
- Main retains the coordinator's readiness guard so map clicks cannot dispatch route actions before valid imagery displays.
- At the original map review the suite had 16 map checks and 32 application tests total. The accepted navigation follow-up adds six tests: 38 application tests now pass.
- Reset View and Focus Route were a separate follow-up and are now approved/integrated at `21cf6f0`.

**Latest status:** the subsequent navigation `21cf6f0` is approved/integrated; use the new Retry Image assignment in [WILLY.md](docs/team/WILLY.md). Do not repeat the old map/navigation task.

## Emma — accepted science/protocol and now-delivered presentation

Original accepted contribution: `b0640d9c7f423eb066ed133e63e4366de981e20c`. The earlier synchronization-only review at `ee9f6ae` is historical; `947ff1a` now delivers the presentation/Q&A and is integrated as described above. Emma uses he/him pronouns.

- Science records, corrected citations, evidence audit, references, AI-use record, internal demo script and usability protocol are integrated.
- All three real records pass the active runtime validator and use the delivered imageRef. Their positions remain null/unavailable, so they are contextual records rather than fabricated map pins.
- Actual outside-user sessions remain pending. The protocol does not claim invented participants or results.
- Presentation/Q&A files are now published at `947ff1a` and integrated with the coordinator's small readiness wording updates. The earlier publication gap is closed.

**Latest status:** presentation `947ff1a` and science component `4efcb5a` are accepted/integrated. His new science-discovery and confidence/image-passport assignment is in [EMMA.md](docs/team/EMMA.md). The earlier publication gap is historical and closed.

This review validated records and inspected evidence documentation; it did not independently refetch every external scientific source or certify the underlying scientific interpretations.

## Gaddielle — earlier technical review, now closed by `c887286`

The findings below describe the historical `094d042` review. Synchronization at `f265407` resolved the overlaps, and `c887286` corrected the passport and is now approved/integrated. See [the accepted review](docs/reviews/GADDIELLE.md). Do not repeat any old merge/verifier/passport assignment.

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

Emma's science list/details are now mounted and verified in [SCIENCE_INTEGRATION.md](docs/qa/SCIENCE_INTEGRATION.md). Enzo's route controls/notebook/shell corrections, Emma's follow-up discovery/evidence panels, PWA installation, complete verified offline reopening and actual user sessions remain pending. Technical checks do not establish those outcomes. Emma's reviewed component and narrow coordinator root mounting are the application changes in this latest integration; source data, shared core, dependencies and other feature branches are unchanged.
