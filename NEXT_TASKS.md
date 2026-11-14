# MARSWALK — Next actions after branch review

Based on [REVIEW.md](REVIEW.md), dated **14 November 2026**. Preserve existing branches, completed work and learning. These are bounded follow-ups, not restarts. Named briefs contain the full coding-agent prompts.

## Enzo — correct the reviewed UI branch before a new task

Review of `feat/enzo-ui-planner-notebook` at `15b1666`: **changes required**. The 47 branch tests pass, but the production build fails here on the Google Fonts request. Keep his UI work and stay on the same branch; do not start another app or task branch yet.

1. Reconcile the older branch with current main while preserving the canonical models, MissionService, validators, persistence, dependencies and map. Do not replace main with the duplicate foundation.
2. Mount the existing MapComponent once in the shell and wire the UI to the existing service/helper APIs.
3. Use local/system fonts so production builds and essential rendering do not depend on Google Fonts.
4. Add contextual science selection for all three unlocated records without inventing positions.
5. Preserve unsaved/failed-save notebook drafts across tab changes and clamp sidebar sizing to the viewport for all input paths.
6. Run the integrated regressions, adapted UI tests, production build and real browser mission/error checks; push the corrected same branch for re-review.

Full findings: [docs/reviews/ENZO.md](docs/reviews/ENZO.md). Agent instructions: [docs/team/ENZO.md](docs/team/ENZO.md).

## Willy — viewport navigation

Original map `094fce2`: **accepted and integrated**.

1. Preserve local work and merge the published integration from `main` into `feature/willy-map-development`.
2. Add Reset View and Focus Route only if equivalent controls are absent.
3. Disable actions until imagery is ready; require at least two route points for Focus Route and cap coincident-point zoom.
4. Preserve route, mode, observations, selection and layer state. Keep controls keyboard/touch accessible.
5. Run relevant map tests, the full suite/build and supported browser checks; push the same feature branch and report its commit.

Own only `src/app/map/`. Root mounting is already complete. Do not repeat it or implement Enzo's controls/PWA caching.

Agent instructions: [WILLY.md](docs/team/WILLY.md).

## Emma — publish completed presentation work

Science/evidence/demo/protocol `b0640d9`: **accepted and integrated**. The user reports his presentation work done locally; those two files are not visible at the reviewed remote tip.

His branch now points to `ee9f6ae` after synchronization. The [latest review](docs/reviews/EMMA.md) confirms zero unique commits against main `6c78ebe` and no published presentation/Q&A files. The action below remains publication of existing work; no new task or branch is assigned yet.

1. Locate and preserve the existing `docs/PRESENTATION.md` and `docs/JUDGES_QA.md` in his working branch.
2. Check origin/branch and local changes. Sync main without overwriting his completed files.
3. Commit and push the existing finished files to `feature/emma-science-provenance`, then hand off the commit and any still-pending evidence artifacts.
4. If they are already on another published branch, provide its exact name/commit. Do not recreate them to satisfy an outdated checklist.
5. Reuse the existing usability protocol when the coordinator conducts real sessions; leave unrun results pending.

This is a publication handoff, not a new research or presentation assignment. Emma uses he/him pronouns.

Agent instructions: [EMMA.md](docs/team/EMMA.md).

## Gaddielle — machine-readable image-pack index

Corrected passport **`c887286`**: **approved and integrated**. Image preparation, verifier fixes, conflict resolution and passport corrections are complete; do not repeat them.

New coding deliverables:

- `tools/data/build_image_pack.py`: verify existing inputs and generate the index deterministically; `--check` detects stale/missing/tampered indexes without writing.
- `public/data/image-pack.json`: versioned two-file inventory with imageRef, app-relative paths, actual byte counts, SHA-256 and summed payload bytes.
- `tools/data/test_build_image_pack.py`: generation, deterministic output, check mode and safe failure regressions.
- `docs/data/IMAGE_PACK_INDEX.md`: schema, commands and handoff to the coordinator.

Reuse the accepted full-image verifier/Pillow dependency and preserve all source assets, manifest and runtime schema. The index covers only the manifest and active prepared image; it excludes itself, the archival master, science records and built shell. It does not establish complete offline readiness. Sync the published main integration into the same feature branch, implement this bounded tool task, run the relevant Python checks and push that branch for review.

Exact specification: [GADDIELLE_IMAGE_PACK.md](docs/team/tasks/GADDIELLE_IMAGE_PACK.md). Ready-to-paste prompt: [GADDIELLE.md](docs/team/GADDIELLE.md).

## Other contributors and branch

- **Enzo:** his published `15b1666` is now reviewed; follow the corrective assignment above. Do not discard his UI or move to a new branch before re-review.
- **Royce/Longla:** preserve the ongoing slice, then follow the existing QA/optional-3D brief; provide a published branch/commit for source review. No corresponding feature branch was visible at this snapshot.
- **Coordinator:** review later submissions, integrate the UI and implement/test installable offline PWA behavior. Do not call it complete from unit/build results alone.
- **Tablet-App:** duplicates the reviewed main. Keep main as the integration reference unless the team explicitly chooses another branch strategy; do not infer a separate implementation or owner.

Follow-up assignments permit normal commits/pushes to each person's own existing feature branch. Main merges, deployment, competition submission and messaging to others remain separate actions requiring applicable user authorization.
