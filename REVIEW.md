# MARSWALK — Submitted branches reviewed and integrated

Reviewed **15 November 2026 (Africa/Douala)**. Application integration: **`b744b0b55252b33903b0e67559defaa4901047ee`**, following remote main `9914e70`. All **eight advertised feature tips** are ancestors of this revision. Older accepted branches were already merged; new integration preserves their history. [Exact branch table and evidence](docs/qa/FINAL_BRANCH_INTEGRATION.md).

| Contributor / branch | Published tip | Verdict / integration |
| --- | --- | --- |
| Willy — `feature/willy-map-development` | `21cf6f0` | Accepted, already merged; navigation preserved |
| Willy — `feature/willy-image-retry` | `02134f1` | Accepted, merged; explicit retry/state preservation verified |
| Emma — `feature/emma-science-provenance` | `947ff1a` | Accepted, already merged; research/protocol/presentation preserved |
| Emma — `feature/emma-science-context-ui` | `4efcb5a` | Accepted, merged; one shared science list |
| Emma — `feature/emma-science-evidence-workspace` | `3b7b1c1` | Accepted, merged; discovery/confidence/passport mounted |
| Gaddielle — `feature/gaddielle-data-preparation` | `a53724a` | Already merged via PR #4; coordinator closed R3 in `b744b0b` |
| Enzo — `feat/enzo-ui-planner-notebook` | `16a2e66` | Accepted, merged; root conflicts resolved, transfer/drafts/shared panels retained |
| Royce / Longla — `feature/longla-3d-rehearsal` | `23d5180` | Corrected viewer merged; new device report requires clarification |

All four existing PR heads are historical accepted submissions. GitHub does not advertise the legacy local `Tablet-App` tracking reference. No feature branch was deleted or force-pushed. This review cannot establish unseen local work.

## Integrated checks and remaining limits

**131 Angular tests across 15 files, 28 Python tests and production build pass.** The real two-file index verifies **524,472 image-payload bytes** unchanged. Production initial output is **587.25 kB**; lazy viewer is **595.60 kB**. Initial/planner/notebook size warnings and Leaflet CommonJS warning remain; error budgets pass and no budgets were raised.

Chromium production checks cover the actual route → science → note → persistence/export/import workflow, failed-save draft retention, composed evidence filters, image failure/retry, responsive layout, lazy viewer and local WebGL fallback. Graphics inspection confirms narrow-panel framing and texture disposal. [Detailed environments/results](docs/qa/FINAL_BRANCH_INTEGRATION.md). Previous component counts remain historical, tied to their own source revisions.

Longla's latest QA text quotes messages different from its stated source revision, uses an inexact browser version and supplies no measurement artifact for 60 FPS. The full [submission is preserved](docs/qa/submissions/LONGLA_23d5180.md) as contributor-reported pending reconciliation. Its presence in Git history does not certify physical-device/PWA acceptance. [Review and exact clarification](docs/reviews/LONGLA.md).

Installation, complete shell/data preparation, update handling, disconnected installed reopening, physical-device confirmation and outside-user outcomes remain pending. Scientific sources were not independently re-fetched in this technical integration. Missing science positions/calibration/terrain remain explicit.

## Next work

[TEAM_TASKS.md](TEAM_TASKS.md) and [NEXT_TASKS.md](NEXT_TASKS.md) assign consistent follow-ups: Willy install assets, Gaddielle release-data handoff, Enzo pure image-byte verifier, Emma release accessibility/size work, Longla corrected hardware evidence and coordinator real PWA lifecycle. Personal prompts and historical reviews are in [team briefs](docs/team/) and [reviews](docs/reviews/).


The complete ordered remaining-work plan for each person, including deployment and final handoff, is now in their single named [personal MD file](docs/team/). See the [owner matrix and release gates](TEAM_TASKS.md#one-complete-remaining-work-file-per-person). These plans do not represent completed numerical-data, AI, immersive-VR or PWA implementation, and no deployment was executed by this documentation update.

Remaining-work ownership was swapped at the user’s request on 15 November: [Enzo](docs/team/ENZO.md) takes verifier/environment/science/AI/presentation; [Emma](docs/team/EMMA.md) takes professional shell/UI/accessibility and deployed UI checks. Accepted contribution table above remains historical and unchanged.


## Coordinator PWA implementation — `8a4dadc`

Subsequent production foundation passes **136 Angular tests, 11 worker tests, 28 data tests, root/subpath builds and real browser process-restart offline/update checks**. Manifest/icons, generated complete runtime pack, lifecycle API and guarded updates are implemented without new dependencies or source data changes. Initial warning size is now 595.20 kB; existing style/CommonJS warnings remain. Previous branch review counts above retain their historical revision. [Actual evidence](docs/qa/PWA_FOUNDATION.md), [hosting runbook](docs/DEPLOYMENT.md). Actual public hosting, physical launcher installation, numerical data/AI/VR and outside-user outcomes are not established by this implementation.
