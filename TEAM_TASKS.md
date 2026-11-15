# MARSWALK — Current team work plan

Updated **15 November 2026 (Africa/Douala)**. Reviewed application code: **`b744b0b`**. All eight advertised feature tips are integrated, preserving history. [REVIEW.md](REVIEW.md) records verdicts; [final integration evidence](docs/qa/FINAL_BRANCH_INTEGRATION.md) records exact revisions and checks. This is the canonical assignment plan; preserve any later local work.

Product: **Angular PWA for Mars exploration rehearsal**, focused on the prepared Mount Sharp/Gale image. Read [SOUL.MD](SOUL.MD). The Willy/Gaddielle role swap remains in force. Emma uses he/him; Royce is the original-plan name for the role documented as Longla.

<a id="current-state"></a>
## Delivered work and current state

Main includes the real 2048 × 1042 image; map/navigation and explicit image retry; science discovery, confidence and image-passport panels; shell, route controls and notebook; shared assessment/persistence and guarded mission transfer; and the opt-in lazy flat viewer. **131 Angular tests, 28 Python tests, production build and recorded browser workflow checks pass.** Build size warnings remain below error thresholds.

Gaddielle's R3 encoded/whitespace path gap is closed by the coordinator. Longla's latest device report is preserved as contributor-reported, pending clarification of source/message/browser/FPS discrepancies. Physical-device acceptance, complete installation/cache/update/reopening and actual outside-user outcomes remain pending. Science positions, metric calibration, terrain and exact AOI overlap remain unavailable/unverified.

| Published contribution | Latest integrated tips | Verdict |
| --- | --- | --- |
| Willy map/navigation/retry | `21cf6f0`, `02134f1` | Accepted, merged |
| Emma research/science/evidence workspace | `947ff1a`, `4efcb5a`, `3b7b1c1` | Accepted, merged; three shared UI components mounted once |
| Gaddielle package/index | `a53724a` | Merged; R3 closed in `b744b0b`, real index unchanged |
| Enzo shell/planner/notebook | `16a2e66` | Accepted, merged; root conflicts resolved, transfer/drafts retained |
| Longla optional viewer and QA submission | `23d5180` | Viewer merged; submitted hardware claims need clarification |

## Six consistent pieces of work

| Piece | Owner | Next deliverable | Branch | Exact scope |
| --- | --- | --- | --- | --- |
| [W1](#w1) | Willy | Manifest and install icons | Proposed `feature/willy-pwa-install-assets` | Public assets and QA only; coordinator wires discovery |
| [W2](#w2) | Gaddielle | Release data handoff | Existing `feature/gaddielle-data-preparation` | Actual runtime paths, hashes/sizes, built-copy and cache inclusion guidance |
| [W3](#w3) | Emma | Read-only image-payload verifier | Proposed `feature/emma-image-payload-verifier` | Pure module/spec/QA; exact planned byte-check contract |
| [W4](#w4) | Enzo | Release accessibility and size cleanup | Proposed `feature/enzo-release-ui` | Owned UI/tests/styles; preserve mission behavior and budgets |
| [W5](#w5) | Longla | Device report clarification and actual-device QA | Existing `feature/longla-3d-rehearsal` | QA records only; exact integrated build/device/outcomes |
| [W6](#w6) | Coordinator / YOU | Real PWA install/cache/update lifecycle | Main integration workflow | Shared root/core/packages/worker and complete installed offline mission |

<a id="w1"></a>
## W1 — Willy: PWA install assets

Map/navigation/retry are complete. Deliver `public/manifest.webmanifest`, the three specified launcher/maskable PNGs under `public/icons/`, optional original icon source and `docs/qa/PWA_INSTALL_ASSETS.md`. Verify relative URLs at root/subpath, JSON, actual PNG decoding/dimensions, readable original artwork/maskable safe area and built serving. No root/index/package/worker/data edits or new dependency. Assets alone do not prove installation/readiness. [Prompt](docs/team/WILLY.md), [exact spec](docs/team/tasks/WILLY_PWA_INSTALL_ASSETS.md).

<a id="w2"></a>
## W2 — Gaddielle: release data handoff

R1–R3 are closed; do not repeat fixes or regenerate assets. Deliver `docs/data/RELEASE_DATA_HANDOFF.md` with the actual required runtime data paths/imageRef, sizes/hashes, production-copy comparison and exact worker include/exclude guidance. Separate manifest/image payload, science and index-control bytes from app readiness. Exclude archival masters/unused reference documents from essentials. Own this document and necessary factual data-doc updates only; no new schema/data/API/worker. [Prompt](docs/team/GADDIELLE.md), [exact spec](docs/team/tasks/GADDIELLE_RELEASE_DATA_HANDOFF.md).

<a id="w3"></a>
## W3 — Emma: read-only image-payload verification

Science discovery and both evidence panels are complete. Implement the **planned** pure `verifyImagePayload(index, activeImage, readBytes)` module under `src/app/offline/`, its tests and `docs/qa/IMAGE_PAYLOAD_VERIFIER.md`. Validate unknown v1 index/active manifest before reads; verify exact bytes, SHA-256 and manifest identity using an injected cache-only reader and the specified result/failures. No network fallback, storage writes, shared/root/model/source/Python/package/worker changes or readiness UI. W6 composes this with all other shell/science/install checks. [Prompt](docs/team/EMMA.md), [exact contract](docs/team/tasks/EMMA_IMAGE_PAYLOAD_VERIFIER.md).

<a id="w4"></a>
## W4 — Enzo: release UI accessibility and size cleanup

The complete shell and root integration are done. Improve tab/tabpanel ARIA relationships, keyboard navigation/focus and current initial/style warning sizes without raising budgets or deleting capabilities. Preserve notebook drafts, shared components, transfer and viewer teardown. Own shell/header/planner/notebook UI/tests/styles only; root/core/packages/worker remain coordinator-owned. Record actual before/after checks in `docs/qa/RELEASE_UI.md`. Future PWA status UI awaits W6's real contract. [Prompt](docs/team/ENZO.md), [exact spec](docs/team/tasks/ENZO_RELEASE_UI.md).

<a id="w5"></a>
## W5 — Longla: clarify device report and verify integrated build

Viewer corrections/integration are done. Reconcile the quoted strings, served commit, exact browser version and unsupported FPS statement in [your preserved submission](docs/qa/submissions/LONGLA_23d5180.md). Record actual physical-device observations separately from coordinator headless checks; label paraphrases and unmeasured performance honestly.

Test current integrated main online: route/science/note/save/recovery/transfer, retry and optional viewer together. Record device/OS/browser/input/build/URL, actual outcomes and reproducible defects in `docs/qa/PWA_ACCEPTANCE.md`. No teammate code changes or invented pass. Installation/cache/update/disconnected close/reopen remain blocked until W6. [Prompt](docs/team/LONGLA.md), [acceptance record](docs/qa/PWA_ACCEPTANCE.md).

<a id="w6"></a>
## W6 — Coordinator: real installable offline release

All current submissions are integrated. Review future W1–W4 deliveries without repeating completed code. Define/document the actual PWA lifecycle contract before assigning its status UI. MissionService currently has no install/cache API.

Wire reviewed manifest/icons and implement production caching, complete-pack verification, separate connection/readiness states, preparation/storage/update failures and mission-safe recovery. Deliberately include required shell/data/index/science assets; 524,472 image-payload bytes exclude the rest of the app. Keep the optional viewer lazy and its cache policy explicit. Perform actual install/preparation/disconnected closing/reopening with W5; then arrange three outside-user sessions using Emma's protocol and record real outcomes. [Coordinator prompt](docs/team/YOU.md).

## Dependencies and finish rules

W1–W4 can progress independently from published main; W5 can verify the complete online mission now. W6 defines the lifecycle, reviews assets/verifier/data guidance, and validates all required bytes before claiming readiness. W5's installed/offline pass follows W6. Current build/test/browser evidence does not establish installation, physical hardware, scientific certification or outside-user success.

Preserve local work. Proposed branch names apply only when no follow-up exists. Keep W2/W5's existing branches and all accepted history. Personal briefs authorize normal pushes to assigned feature branches. Coordinator integration follows the user's authorized workflow; deployment, environment publication, competition submission and external messages are separate.

Hand off **commit, files/selectors, actual checks, one observed workflow and blockers**. Official competition requirements/deadline must be verified separately; internal rehearsal timing is not an official rule.
