# MARSWALK — Current handoff checklist

Updated **15 November 2026 (Africa/Douala)**. All eight submitted feature tips are merged in code **`b744b0b`**. **131 Angular tests, 28 data tests, build and browser checks pass**; build size warnings remain. [Verdicts](REVIEW.md), [evidence](docs/qa/FINAL_BRANCH_INTEGRATION.md), [canonical plan](TEAM_TASKS.md).

| Piece | Person | Next action | Done when |
| --- | --- | --- | --- |
| [W1](TEAM_TASKS.md#w1) | [Willy](docs/team/WILLY.md) | Manifest and install icons | Actual asset/path/decode/build checks and discovery handoff |
| [W2](TEAM_TASKS.md#w2) | [Gaddielle](docs/team/GADDIELLE.md) | Release data handoff; R3 is closed | Exact runtime data/hash/size/built-copy/cache inclusion guidance |
| [W3](TEAM_TASKS.md#w3) | [Emma](docs/team/EMMA.md) | Pure image-payload byte verifier | Planned contract implemented/tested, read-only cache reader handoff |
| [W4](TEAM_TASKS.md#w4) | [Enzo](docs/team/ENZO.md) | UI accessibility and size cleanup | Keyboard/ARIA/focus and size results, no regressions/budget increase |
| [W5](TEAM_TASKS.md#w5) | [Longla](docs/team/LONGLA.md) | Clarify report; actual integrated-device QA | Exact served build/browser/messages and observed hardware outcomes |
| [W6](TEAM_TASKS.md#w6) | [Coordinator](docs/team/YOU.md) | Real install/cache/update lifecycle | Complete prepared installed mission reopens disconnected on target device |

No repeat retry, evidence-panel implementation, root reconciliation, viewer corrections or R3 fix. W1–W4 are independent follow-ups; preserve existing local progress. W5 can test the integrated online mission now. Installed/offline/update checks follow W6. Proposed branches are in the plan; existing data/QA branches remain. The old local `Tablet-App` reference is not currently advertised by GitHub.

Push only the assigned feature branch and report actual commit/files/checks/blockers. Deployment, environment publication, submission and external messaging remain separate actions.
