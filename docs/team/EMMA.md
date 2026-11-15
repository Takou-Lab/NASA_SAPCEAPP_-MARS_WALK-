# Emma — Remaining professional UI and deployment work

> Current work piece: [W4](../../TEAM_TASKS.md#w4).

Updated **15 November 2026**. This is your **single remaining-work checklist through deployment and final handoff**. The current tested application is `b744b0b`, published with documentation at `27b1171`: 131 Angular tests, 28 data tests/build/browser checks passed. Those are historical baseline results, not checks of the future work below. [Integration evidence](../qa/FINAL_BRANCH_INTEGRATION.md).

All unchecked items below are **planned**, not claims of implementation. Keep completed work and unseen local progress. Finish or hand off your current slice before switching. Read [the team plan](../../TEAM_TASKS.md), [shared contracts](CODING_AGENTS.md) and [product charter](../../SOUL.MD). This personal file contains the full sequence; earlier files under `tasks/` remain detailed reference specifications for their named slices.

## Current W4 handoff — Phase 1 accepted, Phase 2 starts now

Your `cdd2417` is approved and integrated at **`be4ac2b`**. Branch 139 tests/build pass; current integration **144 tests/build/browser offline checks pass**. Coordinator completed the unused-router bootstrap cleanup outside your ownership. Initial 433.80 kB is below 500 kB; planner/notebook style budgets pass. [Review/evidence](../reviews/EMMA.md#release-ui-cdd2417--accepted-and-integrated). Do not repeat Phase 1.

1. **Agree one visual specification** with Willy/Enzo using existing tokens, typography/spacing, panel density, badges/actions and both-theme screenshots. Keep one owner per edited file and preserve unpublished work.
2. **Readiness/header work is unblocked.** `src/app/core/pwa.service.ts` is real and documented in CODING_AGENTS.md. Read existing signals/actions; clarify mission metadata versus connection/verified offline pack. Display only supported states. Root already has PwaPanelComponent and initializes once: coordinate removal/relocation centrally before duplicating install/prepare/update controls. No new worker/model/API or pretend image/persistence-ready signals.
3. **Narrow styling exception granted:** own light/dark fixes in `src/app/science/science-context.component.scss`, `src/app/evidence/exploration-confidence.component.scss`, and `src/app/evidence/image-passport.component.scss`. Use existing theme tokens, readable text/borders/alerts/focus and actual contrast checks. Enzo retains their TS/HTML/tests/data logic; do not rewrite those components or touch his environmental implementation.
4. **Environmental slot:** coordinate a mounting handoff when Enzo's component and agreed data API exist. Keep this dependency explicit; complete the other design/header work now without inventing measurements or service exports.
5. **Phase 3/4:** use the exact coordinator-deployed UI revision for HTTPS clean/existing-profile and screenshot checks. Actual Android/iOS/touch/installed standalone acceptance and outside-user sessions remain unrun until observed. Coordinator arranges users; Enzo maintains outcomes. Do not reuse browser checks as physical evidence.

Continue existing **`feature/emma-release-ui`**, preserve work and incorporate published main safely. No reset/force-push or duplicate branch. Record actual results/revisions in `docs/qa/RELEASE_UI.md`. No independent deployment or main merge.

## Public host is ready for your acceptance checks

Use **https://marswalk-jet.vercel.app/**, deployed source `b6669fb`. Actual public browser preparation, offline full-process restart, route/note recovery/export and deferred flat 3D pass. [Evidence](../qa/VERCEL_PRODUCTION.md), [runbook](../VERCEL_SETUP.md). Target-device home-screen/standalone acceptance still needs actual observations; do not copy the browser pass as physical evidence. Automatic GitHub deployment is not connected, so a new main commit is not necessarily live until the coordinator deploys it.

## Coordinator PWA delivery — current handoff

**`8a4dadc`** supplies production worker/full-pack verification, real PwaService state/actions, root lifecycle controls, manifest/icons and update handling. **136 Angular tests, 11 worker tests, 28 data tests/build/browser offline restart/update checks pass**. [Evidence](../qa/PWA_FOUNDATION.md), [deployment runbook](../DEPLOYMENT.md), [actual lifecycle API](CODING_AGENTS.md#implemented-pwa-lifecycle--available-now). Physical home-screen installation and public hosting still need validation. Existing 131-test statements below are historical baseline counts.

Your real PWA presentation API is now available; root already mounts one PwaPanelComponent. Continue accessibility/design and coordinate any relocation of these controls rather than duplicating them or inventing readiness.

## Assignment swap and handoff

The user swapped **remaining** Emma/Enzo assignments on 15 November 2026. Completed work, original authorship and accepted branch names stay unchanged. Preserve any unpublished progress on the previous assignment and hand off its actual commit/files/blockers through the coordinator before overlapping edits. Keep existing task branches/history if work already exists; new branch defaults below apply only when starting fresh. This assignment changes ownership, not application code or deployment status.

## Already complete — preserve

Emma uses **he/him**. Your research/records/citations, usability protocol, presentation draft, science UI `4efcb5a` and evidence workspace `3b7b1c1` remain accepted and credited to you. Enzo's shell/planner/notebook `16a2e66` is also integrated. Your remaining assignment is now shell/planner/notebook accessibility, professional design and deployment UI verification. Enzo takes the remaining verifier, environmental/science/evidence UI, AI explanation and presentation work. Preserve all accepted components and guard behavior; do not repeat foundation or root reconciliation.

## Phase 1 — Release accessibility and size cleanup

Use **`feature/emma-release-ui`** if no task exists. Own `src/app/ui/`, `src/app/planner/`, `src/app/notebook/` and their tests/styles; named QA `docs/qa/RELEASE_UI.md`. No root/core/package/worker/data/evidence-component rewrite. The three named SCSS-only Phase 2 theme fixes above are the explicit exception; component logic remains Enzo-owned.

- [x] Implement coherent tab/tabpanel IDs and ARIA relationships, selected state, roving focus, Left/Right/Home/End behavior. Only handle keys originating in tab controls; do not intercept notebook typing.
- [x] Ensure hidden/collapsed content cannot trap focus. Keep visible focus, readable contrast and usable keyboard/touch layout.
- [x] Reduce initial/planner/notebook style warning overruns without raising budgets or deleting features. Measure actual before/after. Any lazy splitting must preserve notebook state after first creation, retain errors/drafts and list essential chunks for offline preparation.
- [x] Recheck exact unsaved note across tabs/failed save, successful save, sidebar restored/keyboard clamp, mobile overflow and 3D teardown. Record actual integrated tests/build/browser results.

## Phase 2 — Consistent professional design

- [ ] Agree a small visual specification with Willy/Enzo: existing palette/tokens, typography scale, spacing, action hierarchy, badges, panel density and responsive behavior. Record in `docs/qa/RELEASE_UI.md`; use original branding/icons, no new UI framework/external fonts.
- [ ] Polish owned shell/header/route/notebook using that specification. One clear next action and relevant empty/loading/error states per panel; reduce duplicated controls/content through agreed handoffs rather than editing others' files.
- [ ] Clarify header readiness labels: metadata loaded, image displayed, persistence available, connectivity and complete offline readiness are different states. Consume only existing/agreed coordinator signals; never manufacture a green ready status from internet access or registration.
- [ ] Reserve integration space for Enzo's environmental component and actual PWA status/install/update UI. Wait for exported components and tested coordinator APIs; report exact mounting needs. Root assembly remains coordinator-owned.
- [ ] Present update/install/preparation actions only when their real states exist. Failed preparation has recovery guidance; do not auto-reload over unsaved work. Keep unsupported grid/terrain unavailable and regional records accessible.

## Phase 3 — Deployed interface verification

- [ ] Check actual HTTPS preview in a clean browser plus existing-storage profile at desktop, tablet and narrow phone widths. Verify controls/tab/focus/scroll, no overflow, source/quantity text readability and manifest standalone viewport.
- [ ] With coordinator/Longla test installed offline route → evidence → note → save/recover/export, failed-save draft retention and supported update behavior. Use isolated storage; do not delete someone's mission.
- [ ] Record browser/device/build and actual defects. Hosting base-path/deep-link/cache fixes belong to coordinator; agree root/global style changes before touching those files.
- [ ] Retest affected UI after fixes and capture final consistent screenshots for Enzo. Keep logs free of uncaught normal-flow errors and explain unresolved warnings honestly.

## Phase 4 — Release freeze and support

- [ ] Deliver final component selectors/chunks, before/after size results, accessibility evidence and commit to coordinator.
- [ ] During release freeze fix only reproducible UI blockers. Verify public entry URL/private-window behavior after release and provide a concise known-issues list. No last-minute redesign or deployment-config ownership expansion.

## Agent execution and final handoff

Preserve local changes; fetch published main and reconcile safely before starting a slice. Use the proposed branch only if no task branch already exists. No reset, force push or competing application/state store. Work on one slice at a time; hand it off for integration before starting the next dependent slice. A future contract is not an existing API.

For code changes run the relevant behavioral tests, the integrated `npm test` and `npm run build`, plus the actual affected browser workflow. Use data tests for Python/data changes. For static documents/assets, check real facts, paths/links, JSON and decoding/build output as applicable; do not add tests that merely repeat formatting. Record actual results and warnings, not baseline counts copied as new passes. Current build has initial/style warning overruns; do not raise budgets to hide them.

Each handoff includes actual **branch/commit, changed files, dependencies, commands/results, one observed workflow, remaining failures and deployment implications**. A blocked item includes the missing input/device/contract and next action. Do not fabricate numbers, coordinates, participant outcomes, timing, AI inference or hardware passes.

Normal commit/push to your assigned feature branch is authorized. Main merges belong to the coordinator. This plan prepares deployment; it does not itself publish an environment, deploy a site, submit the competition entry or authorize external messages. Preserve NASA/data/library/AI attribution.

Paste this into your coding agent:

```text
Read my personal docs/team file, TEAM_TASKS.md and CODING_AGENTS.md.
Inspect the actual branch and preserve existing work. Identify the first
unfinished, unblocked phase in my checklist and implement that slice only.
Use the listed owned files, real inputs and existing/agreed contracts.
Do not consume future APIs or modify another owner's files speculatively.
Keep all accepted behavior. Check important failure cases and the actual
user workflow; run relevant checks and review the diff before handoff.
Push only my feature branch. Report the actual commit/files/checks,
blockers and deployment effects. Do not start an unrelated redesign,
deployment or main merge. Mark completion only when supported by evidence.
```
