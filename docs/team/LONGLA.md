# Royce / Longla — Device QA after corrected 3D delivery

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W5](../../TEAM_TASKS.md#w5).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

## Completed correction — preserve the viewer

The coordinator implemented your R1–R5 corrections at the user's request. Corrected code **`2a6dbba`** on **`feature/longla-3d-rehearsal`** includes main `d814ec4`, **70 passing tests**, a passing production build and actual browser/resource/orientation checks. [Verified review](../reviews/LONGLA.md) and [QA evidence](../qa/VIEWER3D_REVIEW.md).

Do not repeat the integration, resource, failure-state, north-label or VR-toggle corrections. The viewer loads only when opened, stays flat and supplies no measured terrain/immersive VR. It is verified on the feature branch; main integration and physical-device acceptance are separate.

## Next work — actual-device rehearsal and defect evidence

Continue on the same existing branch, preserve local work and use the exact served build/revision. Own **`docs/qa/PWA_ACCEPTANCE.md`** and actual defect/retest notes under `docs/qa/`.

1. Run the corrected build on the demonstration device or your available physical device. Record model, OS, browser/version, input method, tested commit/build and URL. A desktop viewport emulator does not establish device behavior.
2. Check the current online 2D mission: image load, all three science records, unknown location/scale/terrain labels, matching mission import/export and rejection of a wrong-image file using temporary records. Preserve other people's saved work.
3. Check explicit viewer open/close, camera presets, texture alignment, touch/keyboard/layout and graphics fallback where the real device permits it. Record actual slowness, crashes or layout/input failures with reproduction steps; do not invent timing measurements.
4. Update actual results in `PWA_ACCEPTANCE.md`; report defects with severity, reproduction, expected/actual behavior and affected revision. Retest affected scenarios after coordinated fixes. Do not independently edit core/map/science/Enzo UI/worker files.
5. Keep full route/notebook, install, complete cache preparation, updates and disconnected close/reopen **blocked** until their real prerequisites are integrated. When ready, execute the documented installed-device sequence and record the outcomes. Worker registration, internet status and image-only bytes are not complete readiness.
6. Support the coordinator's outside-user sessions only when arranged; Emma owns the consolidated usability record. No invented participants/results or external messages.

No new terrain search, VR implementation, redesign or repeated automated suites is assigned merely to fill time. The actual-device record is the next useful evidence. If no device/build is available, record that blocker instead of claiming completion.

### Push and handoff

This QA follow-up authorizes normal commits/pushes to **`feature/longla-3d-rehearsal`** only. Send the QA commit, actual device/build, results, defects and pending prerequisites. No main merge/push, deployment, environment publication, competition submission or external messaging is included. Read [SOUL.MD](../../SOUL.MD), [shared ownership](CODING_AGENTS.md) and [the acceptance plan](../qa/PWA_ACCEPTANCE.md).

## Copy-paste coding-agent prompt

```text
You are Royce/Longla's MARSWALK actual-device QA agent.
Read docs/team/LONGLA.md, docs/reviews/LONGLA.md,
docs/qa/VIEWER3D_REVIEW.md, docs/qa/PWA_ACCEPTANCE.md and SOUL.MD.

R1–R5 corrections are implemented at 2a6dbba on the existing
feature/longla-3d-rehearsal branch: 70 tests/build and recorded browser
checks pass. Preserve that work. Do not repeat fixes or expand terrain/VR.

1. Preserve local work and use the exact corrected served build. Record
   tested commit/URL, actual device model, OS/browser/version and input.
2. Check real image/science/unknown labels, matching mission import/export
   and wrong-image rejection using isolated temporary records.
3. Check optional viewer activation/close, camera presets, touch/keyboard,
   image alignment, layout and graphics fallback on the available device.
4. Record ACTUAL outcomes in docs/qa/PWA_ACCEPTANCE.md. Report defects with
   reproducible steps, expected/actual behavior and affected revision;
   retest affected scenarios after coordinated fixes. No invented timings.
5. Keep installation, full notebook/route UI, complete cache preparation,
   updates and disconnected close/reopen blocked until actual prerequisites
   exist. Run the installed-device sequence when the coordinator supplies it.
6. Outside-user sessions require coordinator arrangement; Emma consolidates
   outcomes. Do not fabricate results or send messages to participants.

Own QA records only for this slice. Do not rewrite core/map/science/Enzo
UI/source data/dependencies/worker or implement more optional features.
Commit/push only this existing feature branch (authorized) and hand off
QA commit, device/build, observed results, defects and remaining blockers.
No main integration, deployment, environment publication or submission.
```
