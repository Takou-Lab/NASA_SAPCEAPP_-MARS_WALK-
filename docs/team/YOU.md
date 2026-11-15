# YOU — Coordinator: integration and installed offline mission

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W6](../../TEAM_TASKS.md#w6).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

Current piece: **[W6](../../TEAM_TASKS.md#w6)**. Read [the current team plan](../../TEAM_TASKS.md), [review](../../REVIEW.md), [shared API](CODING_AGENTS.md) and [SOUL.MD](../../SOUL.MD). YOU retains the coordinator role called Dinang in the original PDF. Preserve completed work; no new application scaffold or competing state store.

## Starting point

All eight published feature tips are integrated in **`b744b0b`**, including retry/evidence, Enzo's complete shell/planner/notebook/transfer and the optional lazy viewer. R3 is closed. **131 Angular tests, 28 data tests, build and browser mission checks pass**; initial/style warning overruns remain. [Evidence](../qa/FINAL_BRANCH_INTEGRATION.md). Do not repeat root reconciliation or accepted UI/data/viewer work. Complete installation/cache/update/installed offline acceptance is still pending.

## Ownership and immediate deliverables

Own root/core/shared models, package/lockfile and build config, app install/worker/readiness/update lifecycle, reviewed main integration and release evidence. Keep map/science/evidence/UI/data implementation with the named owners.

1. Preserve all accepted features. Review future W1–W4 deliveries: install assets, factual release-data handoff, pure image-byte verifier and release-UI cleanup. Keep current guards, tests and source bytes.
2. Wire reviewed install discovery/assets and compose the planned image-only verifier with the full required shell/science/data set; do not create a competing state store or duplicate evidence panels.
3. Decide the actual production PWA approach and document its implemented lifecycle contract before asking Enzo to consume status/progress APIs. No install/cache/readiness API currently exists in MissionService; do not publish invented signals or simulated progress as working.
4. Implement app manifest/icons/start URL/scope/standalone behavior and a supported production worker/cache strategy, preserving subpath deployment. Use HTTPS or supported localhost for installation/worker tests.
5. Define and verify the **complete** required shell/data pack, versions, hashes where appropriate and failure behavior. Gaddielle's 524,472-byte image inventory excludes itself, science and built shell. Exclude archival originals from essentials unless deliberately justified. R3 is closed; retain its negative regressions and safe-write behavior.
6. Implement truthful connection/preparation/ready/error/update states and recovery. Registration or network status alone is not offline readiness. Handle interrupted preparation, missing/stale data, storage failures and updates without silently replacing unsaved work or the last usable mission.
7. Run actual integrated tests/build/browser checks. With W5, prepare online, install on the target device, disconnect, close, reopen from icon, inspect image/science, edit route, save/recover a note and export. Record exact commit/device/browser and actual outcomes in the QA record.
8. Arrange three outside-user sessions using Emma's protocol, coordinate observation with Longla and record anonymized actual outcomes through Emma. Fix the observed main obstacle and retest. Do not invent participants/timings or message people without authorization.

## Optional viewer integration

Preserve the already integrated flat viewer and explicit lazy activation/destruction on tab exit. Verify that initial core loading, map/mission transfer, bundle budgets and worker asset selection remain sound. Optional viewer bytes are distinct from essentials unless deliberately included. No measured terrain, geographic heading or immersive VR is implemented. Do not reopen completed viewer corrections or let optional features replace W6's core offline gate.

## Product and evidence limits

Keep visual review only, unavailable metric scale/terrain and regional coverage limitations visible. Use service-derived planar distance only with verified calibration; it does not supply slope/terrain safety. No confidence percentage or SAFE label. Unlocated science stays readable without invented pins. External citations may need connectivity. Source/schema validation is distinct from scientific-source verification.

Update user-facing docs to the actually served revision and stage; main, unmerged branch and future assignment must remain distinguishable. Official competition submission rules/deadline require separate checking. Environment publication, deployment, submission and external messaging are separate from normal repository work.

## Copy-paste coding-agent prompt

```text
You are the MARSWALK coordinator's implementation/integration agent.
Read TEAM_TASKS.md (W6 and dependencies), REVIEW.md, docs/team/YOU.md,
docs/team/CODING_AGENTS.md, SOUL.MD and docs/qa/PWA_ACCEPTANCE.md.

Main already has map/navigation, real data/science UI, shared state and
mission transfer. Preserve it. Do not scaffold another app/store or repeat
completed teammate tasks. Feature-branch passes are not main/PWA passes.

1. All submitted features are integrated in b744b0b (131 Angular/28 data tests).
   Preserve one map/science/confidence/passport, guarded transfer, drafts and
   lazy viewer teardown. Review future W1 assets/W2 data handoff/W3 verifier/
   W4 accessibility-size work separately; don't repeat completed integration.
2. Own shared/root/package/worker work. Define/document a real lifecycle
   contract before Enzo uses install/preparation/readiness/update APIs.
3. Implement Angular-compatible production install manifest/icons/start URL/
   scope/standalone and worker/caching with correct HTTPS/subpath behavior.
4. Verify the full required shell/data pack and build/data versions. Image
   payload bytes alone exclude index/science/shell and do not prove readiness.
   Handle interrupted/stale/missing/storage/update cases with truthful states.
   Separate connection, metadata, image display, persistence and cache readiness.
5. Preserve mission/drafts and last usable data on failure/update. No forced
   reload over unsaved work. Keep external citations' connectivity limits clear.
6. Run actual tests/build/browser checks and target-device installed offline
   close/reopen mission with W5. Record actual commit/device/results/blockers.
7. Arrange actual outside-user sessions; Emma consolidates, Longla observes.
   No invented outcomes or unauthorized external messages. Fix observed defects.
8. The integrated optional viewer must stay lazy/flat and preserve core
   loading/cache budgets; no new terrain/VR. Update docs to actual stage.

Use the user's authorized Git workflow. Deployment, environment publication,
submission and external messaging are separate. Report real files/checks,
remaining dependencies and evidence; no installation claim from unit tests.
```
