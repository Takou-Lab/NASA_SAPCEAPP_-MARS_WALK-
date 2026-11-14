# Willy — Current map handoff

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W1](../../TEAM_TASKS.md#w1).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

Current piece: **[W1 — map recovery](../../TEAM_TASKS.md#w1)**. The original map `094fce2` and navigation `21cf6f0` are approved/integrated. Do not repeat Reset View, Focus Route, map creation or root mounting.

Read [WILLY.md](WILLY.md) and [WILLY_IMAGE_RETRY.md](tasks/WILLY_IMAGE_RETRY.md). If no retry branch exists locally, create proposed `feature/willy-image-retry` from published main; otherwise preserve existing task work and synchronize safely. Own only the four map component files.

Implement explicit Retry Image for valid metadata plus display failure. Keep load/dimension checks, stale-event tokens, duplicate-attempt blocking and mission/navigation guards. No source changes, metadata reinitialization or cache/storage clearing. Run actual regressions/build/browser retry checks and push the task branch with commit/results/blockers.

The image remains 2048 × 1042, imageRef `hirise-mro-pia26306-boxwork-2048x1042-v1`, using bottom-left pixels. All three science positions remain unavailable; Emma's science component is already mounted on main. Enzo integrates the shell/planner/notebook with that component and existing mission transfer. PWA lifecycle stays coordinator-owned. No invented pins or calibrated measurements.

[Image contract](../data/IMAGE_CONTRACT.md), [shared API](CODING_AGENTS.md), [review](../reviews/WILLY.md).
