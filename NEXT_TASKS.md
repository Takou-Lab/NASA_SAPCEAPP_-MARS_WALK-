# MARSWALK — Next actions after branch review

Based on [REVIEW.md](REVIEW.md), dated **14 November 2026**. Preserve existing branches, completed work and learning. These are bounded follow-ups, not restarts. Named briefs contain the full coding-agent prompts.

**Guide improvement:** the coordinator has implemented validated mission-file import alongside export, with 44 tests, production build and isolated-browser transfer checks passing. Preserve this capability in shell integration. [Adopted guide priorities](docs/GUIDE_IMPROVEMENTS.md) keep Gale and existing assignments; complete installed offline operation is next, followed by compatible layers and evidence-gated optional 3D. No teammate needs to restart work.

## Enzo — correct the reviewed UI branch before a new task

Review of `feat/enzo-ui-planner-notebook` at `15b1666`: **changes required**. The 47 branch tests pass, but the production build fails here on the Google Fonts request. Keep his UI work and stay on the same branch; do not start another app or task branch yet.

1. Reconcile the older branch with current main while preserving the canonical models, MissionService, validators, persistence, dependencies and map. Do not replace main with the duplicate foundation.
2. Mount the existing MapComponent once in the shell and wire the UI to the existing service/helper APIs.
3. Use local/system fonts so production builds and essential rendering do not depend on Google Fonts.
4. Integrate Emma's reviewed `app-science-context` component for all three unlocated records; do not duplicate its implementation or invent positions.
5. Preserve unsaved/failed-save notebook drafts across tab changes and clamp sidebar sizing to the viewport for all input paths.
6. Run the integrated regressions, adapted UI tests, production build and real browser mission/error checks; push the corrected same branch for re-review.

Full findings: [docs/reviews/ENZO.md](docs/reviews/ENZO.md). Agent instructions: [docs/team/ENZO.md](docs/team/ENZO.md).

## Willy — Retry Image after accepted navigation

Original map and navigation **`21cf6f0`**: **approved and integrated**. Navigation passed 38 tests/build and Chromium keyboard/touch-emulated checks. Do not repeat Reset View / Focus Route or root mounting.

After this integration is published, preserve local work and start proposed branch `feature/willy-image-retry` from latest main. Add an explicit Retry Image action only for valid metadata plus an image-display error. Recreate the overlay safely, recheck dimensions, ignore stale callbacks, block duplicate attempts and preserve mission state. Keep all navigation/readiness regressions.

Own only the four map files. Specification: [WILLY_IMAGE_RETRY.md](docs/team/tasks/WILLY_IMAGE_RETRY.md). Agent prompt: [WILLY.md](docs/team/WILLY.md). Review: [WILLY.md](docs/reviews/WILLY.md).

## Emma — contextual science UI transferred from Enzo

Presentation/Q&A **`947ff1a`** is delivered and integrated with small coordinator readiness-wording updates. Earlier science, demo and usability work stays complete; do not recreate it.

After this integration is published, preserve local work and start proposed branch `feature/emma-science-context-ui` from latest main. Implement standalone `ScienceContextComponent` (`app-science-context`) under `src/app/science/`: accessible list, selection/clear, sourced details and loading/error/empty states for the three records, including unavailable positions. Use existing MissionService signals/actions; never mutate routes or invent map locations.

This is a bounded new coding slice suitable for his agent-guided learning. Enzo retains shell, planner, notebook, draft retention, font/sidebar and canonical-core integration. Emma does not edit Enzo's files or mount the component in the root; Enzo/coordinator integrates it after review.

Specification: [EMMA_SCIENCE_CONTEXT_UI.md](docs/team/tasks/EMMA_SCIENCE_CONTEXT_UI.md). Agent prompt: [EMMA.md](docs/team/EMMA.md). Review: [EMMA.md](docs/reviews/EMMA.md).

## Gaddielle — correct the submitted image-pack index

Corrected passport **`c887286`** remains **approved and integrated**. Latest index submission **`bf9689b`** is reviewed: **changes required**. All 14 Python tests and the real index check pass, but alternate/URL-unsafe paths and incomplete index shape/type validation need correction. The feature code is not merged. Image preparation, verifier fixes, conflict resolution and passport corrections remain complete.

The four submitted deliverables are:

- `tools/data/build_image_pack.py`: verify existing inputs and generate the index deterministically; `--check` detects stale/missing/tampered indexes without writing.
- `public/data/image-pack.json`: versioned two-file inventory with imageRef, app-relative paths, actual byte counts, SHA-256 and summed payload bytes.
- `tools/data/test_build_image_pack.py`: generation, deterministic output, check mode and safe failure regressions.
- `docs/data/IMAGE_PACK_INDEX.md`: schema, commands and handoff to the coordinator.

Keep the implementation and correct **R1/R2** from [the latest review](docs/reviews/GADDIELLE.md): enforce canonical/browser-safe paths and strict index object/keys/types, with clean read-only failure. Add temporary-fixture regressions, retain all current tests and preserve source assets, verifier and runtime schema. Stay on the same feature branch, merge latest main, commit/push the corrections and request re-review before a new task. The image-only inventory does not establish complete offline readiness.

Exact specification: [GADDIELLE_IMAGE_PACK.md](docs/team/tasks/GADDIELLE_IMAGE_PACK.md). Ready-to-paste prompt: [GADDIELLE.md](docs/team/GADDIELLE.md).

## Other contributors and branch

- **Enzo:** his published `15b1666` is now reviewed; follow the corrective assignment above. Do not discard his UI or move to a new branch before re-review.
- **Royce/Longla:** preserve the ongoing slice, then follow the existing QA/optional-3D brief; provide a published branch/commit for source review. No corresponding feature branch was visible at this snapshot.
- **Coordinator:** review later submissions, integrate the UI and implement/test installable offline PWA behavior. Do not call it complete from unit/build results alone.
- **Tablet-App:** duplicates the reviewed main. Keep main as the integration reference unless the team explicitly chooses another branch strategy; do not infer a separate implementation or owner.

Follow-up assignments permit normal commits/pushes to each person's own existing feature branch. Main merges, deployment, competition submission and messaging to others remain separate actions requiring applicable user authorization.
