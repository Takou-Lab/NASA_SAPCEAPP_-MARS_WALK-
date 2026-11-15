# Royce / Longla — Remaining 3D, VR, QA and deployment work

> Current work piece: [W5](../../TEAM_TASKS.md#w5).

Updated **15 November 2026**. This is your **single remaining-work checklist through deployment and final handoff**. The current tested application is `b744b0b`, published with documentation at `27b1171`: 131 Angular tests, 28 data tests/build/browser checks passed. Those are historical baseline results, not checks of the future work below. [Integration evidence](../qa/FINAL_BRANCH_INTEGRATION.md).

All unchecked items below are **planned**, not claims of implementation. Keep completed work and unseen local progress. Finish or hand off your current slice before switching. Read [the team plan](../../TEAM_TASKS.md), [shared contracts](CODING_AGENTS.md) and [product charter](../../SOUL.MD). This personal file contains the full sequence; earlier files under `tasks/` remain detailed reference specifications for their named slices.

Royce is the original-plan name for the role documented as Longla.

## Already complete — preserve

Corrected optional flat viewer is integrated through branch tip `23d5180`. It is lazy/opt-in, frames the raster in narrow panels and destroys resources on leaving the tab. No measured terrain or immersive VR is currently implemented. Do not repeat viewer corrections or root/package reconciliation.

## Phase 1 — Clarify report and run integrated device QA

Continue **`feature/longla-3d-rehearsal`** for QA. Own `docs/qa/PWA_ACCEPTANCE.md` and actual defect/retest records. Do not rewrite teammate implementation.

- [ ] Reconcile [preserved report](../qa/submissions/LONGLA_23d5180.md): actual controls are Open 3D viewer / Close 3D viewer; canonical import error is “Invalid mission or a different image version. Current work is unchanged.” Explain differing quotes/served build, exact browser version and whether FPS was actually measured. Preserve original evidence as contributor-reported history.
- [ ] On the actual available device record served commit/URL, device/OS/browser/version/input and observation date. Check real image/science, route edits, note save/recovery/draft failure, matching transfer and wrong-image rejection using isolated work.
- [ ] Check optional 3D activation, camera presets/portrait framing, alignment, close/reopen, touch/keyboard and local failure fallback without breaking 2D. No terrain, north/geographic-heading or safety claims.
- [ ] Record expected/actual outcome, repro steps, screenshot/log where useful and retest revision. Headless software graphics is not a physical-device pass. No FPS number without method and measurement evidence.

## Phase 2 — VR feasibility, then isolated prototype

Only after Phase 1 handoff and a protected working release candidate. Use proposed **`feature/longla-webxr-prototype`** if no experiment exists. Own proposed `src/app/xr/` and `docs/qa/WEBXR_PROTOTYPE.md`; existing viewer rendering adapters may change only within agreed viewer ownership. Coordinator handles packages/root/build and any shared API.

- [ ] First check actual headset/browser, HTTPS secure context and `navigator.xr.isSessionSupported('immersive-vr')`. Record real supported/unsupported result and device. Without testable hardware, document the blocker; an emulator or button is not a headset acceptance pass.
- [ ] Present proposed controls/render integration to coordinator before dependency/root changes. Reuse image/route coordinates; opt-in lazy loading, no startup headset request or duplicate mission store.
- [ ] If supported and time remains, implement real user-initiated immersive session with clear exit, denied/unsupported/session-ended states, resize/render lifecycle and resource disposal. Preserve working 2D/flat viewer on every failure. Do not fake support/presenting toggles.
- [ ] Show a flat image rehearsal in VR unless actual validated terrain exists. Do not infer elevation from brightness, promise astronaut safety or claim immersive implementation from a screen recording.
- [ ] Test actual enter/exit/reenter, denied session, device/browser behavior and frame/resource issues. Hand off measured results for review; keep prototype separate if it does not pass. VR is an enhancement, not a dependency of the essential offline mission.

## Phase 3 — Preview and production acceptance

- [ ] Coordinator supplies exact HTTPS preview/build. Verify clean-profile first load, case/base paths, actual installed launcher/standalone behavior on supported device and meaningful unsupported guidance.
- [ ] After real preparation implementation: prepare online, verify full pack, install, disconnect, close, reopen from icon; inspect imagery and local science/environment, draw route, save/recover note and export. Record every step and actual build/device. Do not mark ready from registration/image-only checks.
- [ ] Exercise safe interrupted preparation, missing/stale asset, insufficient storage and new-version/update scenarios with coordinator using isolated data. Verify draft/mission and last usable version remain protected; record blocked prerequisites honestly.
- [ ] Test optional 3D/VR according to explicit cache policy: if excluded from essentials, its unavailability must be clear/local and must not break offline 2D. Do not claim all optional models/assets are cached unless checked.
- [ ] Verify production release URL again after promotion; report only actual regressions for urgent fixes. Preserve local data and exact release evidence.

## Phase 4 — Usability and demonstration evidence

- [ ] Support coordinator-arranged outside-user observations using Emma's existing protocol; Enzo consolidates anonymized results. No unauthorized participant messaging or fabricated outcomes.
- [ ] Supply actual device screenshots/video and supported VR demonstration, with build and labels, for Enzo's presentation. Record remaining defects/unsupported hardware and the final retest status.

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
