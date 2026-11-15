# MARSWALK — Current handoff checklist

Updated **15 November 2026 (Africa/Douala)**. Current code **`8a4dadc`** retains all eight submitted feature tips. **136 Angular tests, 11 worker tests, 28 data tests, build and browser offline restart/update checks pass**; build size warnings remain. [Verdicts](REVIEW.md), [evidence](docs/qa/FINAL_BRANCH_INTEGRATION.md), [canonical plan](TEAM_TASKS.md).

| Piece | Person | Next action | Done when |
| --- | --- | --- | --- |
| [W1](TEAM_TASKS.md#w1) | [Willy](docs/team/WILLY.md) | Review/refine coordinator-supplied manifest/icons | Actual launcher appearance/deployed-device checks; no duplicate asset generation |
| [W2](TEAM_TASKS.md#w2) | [Gaddielle](docs/team/GADDIELLE.md) | Release data handoff; R3 is closed | Exact runtime data/hash/size/built-copy/cache inclusion guidance |
| [W3](TEAM_TASKS.md#w3) | [Enzo](docs/team/ENZO.md) | Pure image-payload byte verifier | Planned contract implemented/tested, read-only cache reader handoff |
| [W4](TEAM_TASKS.md#w4) | [Emma](docs/team/EMMA.md) | UI accessibility and size cleanup | Keyboard/ARIA/focus and size results, no regressions/budget increase |
| [W5](TEAM_TASKS.md#w5) | [Longla](docs/team/LONGLA.md) | Clarify report; actual integrated-device QA | Exact served build/browser/messages and observed hardware outcomes |
| [W6](TEAM_TASKS.md#w6) | [Coordinator](docs/team/YOU.md) | Host/device acceptance and remaining shared contracts | Actual HTTPS deployment and target installed mission reopen offline; implementation already supplied |

No repeat retry, evidence-panel implementation, root reconciliation, viewer corrections or R3 fix. W1–W4 are independent follow-ups; preserve existing local progress. W5 can test the integrated online mission now. W6 implementation is supplied; Longla can run installed/offline/update checks on the actual device now. Proposed branches are in the plan; existing data/QA branches remain. The old local `Tablet-App` reference is not currently advertised by GitHub.

Push only the assigned feature branch and report actual commit/files/checks/blockers. Deployment, environment publication, submission and external messaging remain separate actions.


## Full remaining-work checklists

The single complete file for each person is [WILLY.md](docs/team/WILLY.md), [GADDIELLE.md](docs/team/GADDIELLE.md), [ENZO.md](docs/team/ENZO.md), [EMMA.md](docs/team/EMMA.md), [LONGLA.md](docs/team/LONGLA.md) and [YOU.md](docs/team/YOU.md). Each includes completed work, ordered remaining phases, owned files, contracts/dependencies, checks, deployment responsibilities and an agent prompt.

Finish current slices before dependent phases. Later work includes validated numerical data/quantity UI, consistent professional design/presentation, isolated AI/VR experiments and real HTTPS/install/offline/update/device acceptance. Existing 3D is already integrated. [Release sequence and owner matrix](TEAM_TASKS.md#one-complete-remaining-work-file-per-person). Deployment and submission execution are separate from writing these plans.


**PWA delivery update (`8a4dadc`):** manifest/icons/root discovery, full-pack preparation, guarded updates and lifecycle API are implemented; browser offline process-restart passes. Willy reviews/refines supplied assets, Emma consumes the existing API, Longla runs physical installation/host checks, coordinator chooses/deploys the actual host when requested. Enzo's pure verifier and future numerical data/AI/VR remain separate planned work. [Evidence](docs/qa/PWA_FOUNDATION.md), [runbook](docs/DEPLOYMENT.md).


**Gaddielle handoff update:** `42a0dd2` is approved and integrated at `c7ac053`; 33 data tests and real index check pass. Resume her existing Phase 1 release-data handoff, then environmental source investigation. This was the old R3 delivery, not completion of the later data tasks. [Latest review](docs/reviews/GADDIELLE.md).
