# MARSWALK — Current team work plan

Updated **14 November 2026 (Africa/Douala)** after checking all advertised GitHub branches. Review baseline: **`0043bae`**. This is the canonical assignment plan; [REVIEW.md](REVIEW.md) contains verdicts and [NEXT_TASKS.md](NEXT_TASKS.md) is the short handoff. Personal briefs contain the coding-agent prompts.

Product: **Angular PWA for Mars exploration rehearsal**, focused on the current Mount Sharp/Gale image. Read [SOUL.MD](SOUL.MD). The Willy/Gaddielle role swap remains in force. Emma uses he/him; Royce is the original-plan name for the role documented as Longla.

<a id="current-state"></a>
## Delivered work and current state

Main includes the real 2048 × 1042 image, map/navigation, three selectable contextual science records, shared assessment/persistence and guarded mission JSON import/export. The science positions, metric calibration, terrain and exact AOI overlap remain unavailable/unverified as documented.

Enzo's functional shell/planner/notebook passes on his branch but still needs final current-main reconciliation. Longla's corrected optional flat viewer is verified on his branch and remains separate from main. Gaddielle's image index is merged; one path-compatibility correction remains. Installation, complete offline preparation/reopening and actual outside-user outcomes remain pending.

| Published contribution | Latest reviewed tip | Evidence / integration |
| --- | --- | --- |
| Willy map/navigation | `21cf6f0` | Approved and integrated; navigation's recorded 38-test/build/browser review retained |
| Emma research/presentation and science UI | `947ff1a`, `4efcb5a` | Accepted/integrated; mounted science integration recorded 51 tests/build/browser checks |
| Gaddielle pack/index | `a53724a` | Merged through PR #4; 25 Python tests and real index check pass; R3 below remains |
| Enzo shell/planner/notebook | `bcac915` | 57 branch tests/build and production workflow checks pass; four root conflicts remain |
| Longla optional viewer | `9d794e2` (code `2a6dbba`) | Feature branch verified with 70 tests/build/browser/resource/orientation checks; physical-device evidence pending |

Counts belong to their tested revisions/scopes; do not add them together or present them as newly rerun checks. No new remote retry/evidence-workspace branch is advertised. Preserve unseen local progress.

## Six consistent pieces of work

| Piece | Owner | Current deliverable | Branch | Exact scope / acceptance |
| --- | --- | --- | --- | --- |
| [W1](#w1) | Willy | Safe Retry Image | Proposed `feature/willy-image-retry` | Four map files; explicit retry, stale-callback safety and preserved mission |
| [W2](#w2) | Gaddielle | R3 browser-path compatibility | Existing `feature/gaddielle-data-preparation` | Generator/tests/tooling doc; encoded/whitespace paths fail without writes |
| [W3](#w3) | Emma | Science discovery and two evidence panels | Proposed `feature/emma-science-evidence-workspace` | Science files, two standalone evidence components and QA handoff |
| [W4](#w4) | Enzo | Final shell/current-main reconciliation | Existing `feat/enzo-ui-planner-notebook` | Owned UI/planner/notebook plus narrow root integration; retain working main capabilities |
| [W5](#w5) | Longla | Actual-device QA and defect evidence | Existing `feature/longla-3d-rehearsal` | QA documents only for the current slice; actual hardware/build/outcomes |
| [W6](#w6) | Coordinator / YOU | Reviewed integration and real PWA lifecycle | Current main integration workflow | Shared core/root/packages/worker/install contract; complete installed offline mission |

<a id="w1"></a>
## W1 — Willy: map recovery

Preserve the accepted map, Reset View and Focus Route. Add explicit image retry only when metadata is valid and image display failed. Recreate the overlay safely, validate natural dimensions, ignore obsolete events, block duplicate attempts and keep route/mode/notes/selection/layers unchanged. No metadata reinitialization, cache/storage clearing, image regeneration or worker code.

Own `src/app/map/map.component.{ts,html,scss,spec.ts}` only. Test failure → retry → success, repeated failure, wrong dimensions, stale events, teardown and navigation/readiness regressions. Report actual tests/build/browser results. [Prompt](docs/team/WILLY.md), [spec](docs/team/tasks/WILLY_IMAGE_RETRY.md).

<a id="w2"></a>
## W2 — Gaddielle: one remaining tool compatibility fix

Keep all imagery, verifier/passport and merged index work. Fix **R3 only**: tool paths must match runtime image-path syntax, rejecting percent escapes, whitespace/control characters and prior forbidden forms. Preserve realpath/symlink checks. Add temporary fixtures asserting nonzero exit, no traceback and unchanged output bytes/mtime. Keep all 25 current tests and the real index byte-identical.

Own `tools/data/build_image_pack.py`, `tools/data/test_build_image_pack.py` and `docs/data/IMAGE_PACK_INDEX.md`. No new data, calibration, schema, dependencies or worker. [Prompt](docs/team/GADDIELLE.md), [reproductions](docs/reviews/GADDIELLE.md).

<a id="w3"></a>
## W3 — Emma: science and evidence presentation

Preserve the accepted science list/details. Add computed counts, search, evidence/position filters, showing/total count and selected details retained when filtered out. Build read-only `ExplorationConfidenceComponent` (`app-exploration-confidence`) and `ImagePassportComponent` (`app-image-passport`) using current service/model fields, plus behavioral tests and `docs/qa/EMMA_EVIDENCE_UI.md`.

Own existing `src/app/science/` files, those two component sets under `src/app/evidence/` and the handoff record. No root/Enzo/core/data/package/worker edits or new mission store. Unknown scale/terrain stays unavailable; no safety scores. These future evidence panels transfer from Enzo; they are not already implemented. [Prompt and badge answer](docs/team/EMMA.md), [full spec](docs/team/tasks/EMMA_SCIENCE_EVIDENCE_WORKSPACE.md).

<a id="w4"></a>
## W4 — Enzo: integrate the already-working UI

Preserve `bcac915` and its closed functional fixes. Merge current main on the same branch and resolve the four root TS/HTML/SCSS/spec conflicts. Keep canonical core/assets/dependencies, one initialization/map, accepted navigation and reachable guarded mission import/export. Replace the interim science list with existing reviewed `app-science-context` once. Retain draft and viewport-clamp fixes, mark unsupported grid unavailable and use a neutral notebook example.

Own UI/planner/notebook, the existing global-theme styling scope and the narrow root integration exception; no core/package/source/worker rewrite. Complete integrated tests/build and real route/science/note/recovery/export/import/failure checks. **This can finish now using the existing science component; it does not wait for W3's future panels.** Integrate W3 later after review without competing implementation. [Prompt](docs/team/ENZO.md), [review](docs/reviews/ENZO.md).

<a id="w5"></a>
## W5 — Longla: actual-device evidence

The coordinator completed the viewer corrections; do not repeat them or add terrain/VR. Run the corrected build on a physical device and record commit/URL, hardware, OS/browser/input, image/science/unknown labels, safe mission transfer and optional viewer behavior/defects. Update `docs/qa/PWA_ACCEPTANCE.md`; use isolated temporary records and report reproducible issues instead of editing teammates' code.

Online/device checks for available features can start now. Full route/notebook acceptance needs W4; installed cache/disconnect/reopen/update checks need W6. Mark absent prerequisites blocked and unrun checks pending. Coordinate real outside-user observation only when arranged; Emma maintains the consolidated usability record. [Prompt](docs/team/LONGLA.md), [existing evidence](docs/qa/VIEWER3D_REVIEW.md).

<a id="w6"></a>
## W6 — Coordinator: integration and installable offline release

Review and integrate corrected W2/W4 and later W1/W3 submissions, preserving current main and each contributor's history. Optional viewer integration stays explicit/deferred and must preserve the core mission. Define/document the actual PWA lifecycle contract before assigning Enzo status UI; the existing MissionService has no install/cache API.

Implement manifest/icons/start URL/scope/standalone support, production caching and versioned complete-pack validation, separate connection/readiness states, real preparation/storage/update failures and mission-safe recovery. Include required shell/data/index/science bytes deliberately; the 524,472-byte image payload is not full app size. Perform actual production/install/disconnected reopening tests with W5, then arrange three outside-user sessions and record actual outcomes with Emma. [Coordinator prompt](docs/team/YOU.md), [acceptance plan](docs/qa/PWA_ACCEPTANCE.md).

## Dependencies and finish rules

W1, W2, W3 and W4 can progress independently from the published main; W5 can test currently available features. W4's integrated core mission enables the full normal route/notebook workflow. W6 can design its lifecycle contract now, then verify final assets/integration before claiming offline readiness. W5's installed/offline pass follows W6. Presentation claims follow the actual tested revision.

Preserve any task already underway locally. Proposed branch names apply when no task branch exists; do not reset, discard work or create a duplicate implementation just to match a name. Existing branches are kept for W2/W4/W5. Each personal task authorizes a normal push to its feature branch. Coordinator main integration follows the user's existing authorized workflow. Deployment, environment publication, competition submission and external messaging are separate.

Hand off **commit, files/selectors, actual commands/results, one observed workflow and blockers**. No feature is done merely because its plan exists. Official competition rules/deadline must be checked separately; earlier internal rehearsal/freeze timings are not official submission requirements.
