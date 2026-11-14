# MARSWALK — Current handoff checklist

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Updated **14 November 2026 (Africa/Douala)**. Branch recheck: no new published tips since [the latest review](REVIEW.md). [TEAM_TASKS.md](TEAM_TASKS.md) is the canonical assignment/dependency plan. Preserve completed work and local progress.

| Piece | Person | Next action | Done when |
| --- | --- | --- | --- |
| [W1](TEAM_TASKS.md#w1) | [Willy](docs/team/WILLY.md) | Explicit map image retry in four owned map files | Retry/error/stale-event/navigation tests, build and browser outcomes reported; mission unchanged |
| [W2](TEAM_TASKS.md#w2) | [Gaddielle](docs/team/GADDIELLE.md) | R3 path normalization follow-up only | Encoded/whitespace paths rejected safely; all existing tests and real index preserved |
| [W3](TEAM_TASKS.md#w3) | [Emma](docs/team/EMMA.md) | Science filters/counts and two read-only evidence panels | Behavioral tests, build, actual layout/keyboard checks and Enzo integration handoff |
| [W4](TEAM_TASKS.md#w4) | [Enzo](docs/team/ENZO.md) | Four-root-conflict current-main reconciliation | One map/science/initialize, preserved mission transfer and complete integrated mission checks |
| [W5](TEAM_TASKS.md#w5) | [Longla](docs/team/LONGLA.md) | Physical-device QA on available features | Actual device/build/results/defects recorded; missing prerequisites remain blocked |
| [W6](TEAM_TASKS.md#w6) | [Coordinator](docs/team/YOU.md) | Reviewed integration and real install/cache/update lifecycle | Complete prepared installed mission reopens disconnected on the target device |

W4 can finish with the already-mounted science component; it does not wait for W3's future panels. W5 may run online checks now; complete route/notebook and installed/offline checks follow W4/W6 respectively. Enzo owns shell placement, not Emma's component implementation. The coordinator owns worker/core contracts, not feature agents.

Branch defaults: W1/W3 use their proposed new task branches from published main if work has not started; preserve an existing local task branch when it has. W2/W4/W5 retain their published branches. The old `Tablet-App` tracking reference is historical and is not advertised by GitHub; it is not a separate active assignment.

Push only the assigned feature branch and hand off commit, owned files, actual checks and blockers. Keep existing contributions. Deployment, environment publication, submission and external messaging remain separate actions.
