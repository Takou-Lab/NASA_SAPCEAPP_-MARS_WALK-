# Royce / Longla — Device QA after corrected 3D delivery

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

## Continuing role reference

The retained role plan below supplies context. The active task is the reviewed correction slice above; preserve completed work.

**Continue existing work:** preserve your current branch and completed results. Finish or hand off the small slice already underway; apply newly added charter tasks afterward. Do not restart the earlier assignment. See [the transition rule](../../SOUL.MD#apply-this-charter-without-restarting-work). If a 3D change is already underway, preserve and finish or hand off that bounded change before the next QA slice; do not discard it or recreate it.

## Current priority — prove the core mission works

Read [SOUL.MD](../../SOUL.MD), [the shared contract](CODING_AGENTS.md) and [the team allocation](../../TEAM_TASKS.md). Reliable offline mission rehearsal is the priority. While the map/PWA are integrated and terrain remains unavailable, own an independent QA plan and device checks. Build optional 3D after the core acceptance check; VR must not block the release.

The Angular foundation, Willy's mounted map and the data/science contributions are now integrated; see [map integration checks](../qa/MAP_INTEGRATION.md). Installation, a complete offline workflow and 3D are not proven by foundation tests. Inspect the actual revision and report actual outcomes only.

## Ownership and deliverables

- `docs/qa/`: reproducible PWA/device scenarios, actual results, failures and retest evidence.
- Technical observations for the coordinator's outsider usability check; Emma owns the consolidated usability summary.
- Optional `src/app/viewer3d/`: a labeled Three.js rehearsal view using shared mission data.

The coordinator owns core state, root assembly, package dependencies and service-worker/PWA logic. Enzo owns interface controls, Willy the map, and Gaddielle the imagery/terrain preparation. Report defects with reproduction steps instead of independently rewriting their implementation.

## Work in this order

1. Inspect the actual app and write `docs/qa/PWA_ACCEPTANCE.md` with scenario, prerequisites, expected behavior, device/browser, revision, actual result and evidence. Mark unrun scenarios pending.
2. Plan checks for installation/standalone launch, image loading, route editing, science-source visibility, note persistence/export and failure feedback. Account for unavailable calibration/terrain and unlocated science records.
3. When the coordinator's PWA implementation is ready, prepare essential assets online, install on the demonstration device, disconnect, close the app, reopen from its icon and repeat the complete mission. Check the image and science content, route editing, note recovery and JSON export.
4. Check failed/interrupted preparation, unavailable storage, update behavior and wrong-image records with safe test data. Do not clear another person's browser records; export any needed mission before controlled destructive storage tests.
5. Support the coordinator's three outsider task checks: can each person draw a route, explain unknown distance/slope and save/recover a note? Record anonymous observed behavior, errors and actual explanations. Do not invent participants, answers, completion counts or contact anyone without authorization.
6. Report reproducible defects to the coordinator in the QA document and retest affected scenarios after fixes. Distinguish blocked, failed, passed and unrun outcomes.
7. Only after core readiness is demonstrated, implement optional 3D with the agreed shared route/image reference. Keep an optional experiment from degrading PWA startup, caching or the main mission flow.

## Optional 3D scope

You hold the 3D role called Royce in the original PDF. Use a standalone Angular component with Three.js, coordinated dependency declarations and shared MissionService signals. The v1 contract has no verified terrain model. Begin with a flat imagery plane labeled **Prototype: 3D training view — no verified terrain**.

- Use the agreed pixel convention: scene X = x − width/2, Y = 0, Z = height/2 − y. Verify texture orientation at the four corners against the 2D image.
- A small route display offset to prevent z-fighting is not real elevation.
- Render only markers with a compatible image reference and a supplied display position; never invent locations for unlocated science records.
- Keep actual terrain unavailable unless Gaddielle and the coordinator supply a verified terrain contract, units, coverage, transform and NoData handling. Never derive elevation from image brightness.
- Use simple orbit controls/reset view. Display source, coverage limitations and any genuine vertical exaggeration.
- Stop animation and dispose of observers, listeners, controls, geometry, materials, textures and renderer resources on teardown.
- Test alignment, resize, reopening and fallback on the actual device. WebXR is optional after all earlier checks and must leave the normal app usable when unsupported. Use fixed views or teleport.

## Completion and handoff

Your required outcome is a trustworthy QA record of the core mission, with failures and retests made visible. A written plan alone does not demonstrate readiness. Hand off the exact tested revision/device/browser, evidence, outstanding defects and reproducible scenarios. An optional 3D deliverable is additional; no terrain or VR claim should exceed what was tested.

Learn and explain the difference between installation, cache readiness, online status and local record persistence. If implementing 3D, also explain scene/camera/renderer and coordinate conversion. Follow the shared learner checkpoint one slice at a time.

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
