# MARSWALK — Next actions after branch review

Based on [REVIEW.md](REVIEW.md), dated **14 November 2026**. Preserve existing branches, completed work and learning. These are bounded follow-ups, not restarts. Named briefs contain the full coding-agent prompts.

**Guide improvement:** the coordinator has implemented validated mission-file import alongside export, with 44 tests, production build and isolated-browser transfer checks passing. Preserve this capability in shell integration. [Adopted guide priorities](docs/GUIDE_IMPROVEMENTS.md) keep Gale and existing assignments; complete installed offline operation is next, followed by compatible layers and evidence-gated optional 3D. No teammate needs to restart work.

## Enzo — final current-main reconciliation after functional pass

New tip **`bcac915`** passes **57 tests**, production build and actual browser route/science/notebook/draft/resize checks. Earlier core/map/font/draft/clamp defects are closed; do not repeat them or restart the UI.

Stay on **`feat/enzo-ui-planner-notebook`**. Merge latest main and resolve four root TS/HTML/SCSS/spec conflicts, preserving canonical core, one map/initialize, mission-file import/export and its guards, navigation and the accepted `app-science-context`. Replace the interim science list with Emma's component; don't implement her future evidence components. Keep unsupported grid controls honest and use a neutral notebook example. Run complete reconciled checks, push the same branch and request re-review before a new task.

[Current review](docs/reviews/ENZO.md). [Exact agent prompt](docs/team/ENZO.md).

## Willy — Retry Image after accepted navigation

Original map and navigation **`21cf6f0`**: **approved and integrated**. Navigation passed 38 tests/build and Chromium keyboard/touch-emulated checks. Do not repeat Reset View / Focus Route or root mounting.

After this integration is published, preserve local work and start proposed branch `feature/willy-image-retry` from latest main. Add an explicit Retry Image action only for valid metadata plus an image-display error. Recreate the overlay safely, recheck dimensions, ignore stale callbacks, block duplicate attempts and preserve mission state. Keep all navigation/readiness regressions.

Own only the four map files. Specification: [WILLY_IMAGE_RETRY.md](docs/team/tasks/WILLY_IMAGE_RETRY.md). Agent prompt: [WILLY.md](docs/team/WILLY.md). Review: [WILLY.md](docs/reviews/WILLY.md).

## Emma — substantial science and evidence workspace follow-up

Science component **`4efcb5a`** is **approved, integrated and mounted**: 51 tests, production build and production browser checks pass. Earlier science, protocol and presentation remain complete.

After this integration is published, preserve local work and create proposed **`feature/emma-science-evidence-workspace`** from latest main. Complete: science computed counts/search/composed filters/retained selection; standalone **ExplorationConfidenceComponent** and **ImagePassportComponent** under `src/app/evidence/`; meaningful behavioral tests and `docs/qa/EMMA_EVIDENCE_UI.md` with actual results and integration instructions.

The user explicitly transfers Enzo's future read-only confidence/image-passport presentation to Emma. Enzo retains shell/root integration, planner, notebook/drafts, fonts/sidebar, core-port corrections and later real PWA-status UI. Emma owns science/evidence components and the QA handoff only; no shared-core/root/Enzo-file changes or new metrics/storage/PWA APIs.

Specification and computed-badge answer: [EMMA_SCIENCE_EVIDENCE_WORKSPACE.md](docs/team/tasks/EMMA_SCIENCE_EVIDENCE_WORKSPACE.md). Ready-to-paste prompt: [EMMA.md](docs/team/EMMA.md). Accepted review: [EMMA.md](docs/reviews/EMMA.md).

## Gaddielle — one browser-path compatibility follow-up

**`a53724a`** is reviewed and already merged through PR #4. **25 Python tests** and the real index check pass; previous literal-path and schema/type/read-only fixes are complete. Preserve all image/verifier/passport/index work.

New **R3**: reject percent escapes and whitespace/control characters to match runtime asset-path syntax. Browser-normalized encoded traversal/filenames and trailing spaces currently pass generation/check. Add focused temporary regressions, preserve output bytes/mtime on failure, keep every current test and leave the real index unchanged. No new dataset, calibration, schema, dependency or PWA assignment.

Continue the same `feature/gaddielle-data-preparation` branch, merge current main without reset/force push, commit/push R3 and request re-review. [Reproductions](docs/reviews/GADDIELLE.md), [agent prompt](docs/team/GADDIELLE.md).

## Royce / Longla — actual-device QA after verified corrections

The user asked the coordinator to perform the unpublished corrections. Code **`2a6dbba`** on **`feature/longla-3d-rehearsal`** now closes R1–R5 with 70 passing tests, build and recorded browser/resource/orientation checks. Main `d814ec4` is merged into that branch; feature integration into main remains pending. Do not repeat the corrections or add terrain/VR.

Next: test the actual demonstration/available physical device, record online 2D/science/mission-transfer and optional-viewer outcomes/defects in `docs/qa/PWA_ACCEPTANCE.md`, then execute installed/offline gates only when real PWA prerequisites exist. Own QA records for this slice and push the same feature branch. [Verified review](docs/reviews/LONGLA.md), [actual evidence](docs/qa/VIEWER3D_REVIEW.md), [updated agent prompt](docs/team/LONGLA.md).

## Other contributors and branch

- **Enzo:** latest `bcac915` passes functional review; complete the four-root-conflict integration above on the same branch, preserving current main features.
- **Royce/Longla:** corrections `2a6dbba` are verified on the feature branch. Continue actual-device QA above; physical/PWA acceptance remains pending, not proven by automated checks.
- **Coordinator:** review later submissions, integrate the UI and implement/test installable offline PWA behavior. Do not call it complete from unit/build results alone.
- **Tablet-App:** duplicates the reviewed main. Keep main as the integration reference unless the team explicitly chooses another branch strategy; do not infer a separate implementation or owner.

Follow-up assignments permit normal commits/pushes to each person's own existing feature branch. Main merges, deployment, competition submission and messaging to others remain separate actions requiring applicable user authorization.
