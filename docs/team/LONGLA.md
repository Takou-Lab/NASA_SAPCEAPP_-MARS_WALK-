# Longla — PWA Quality Checks and Optional 3D Rehearsal

## Current priority — prove the core mission works

Read [SOUL.MD](../../SOUL.MD), [the shared contract](CODING_AGENTS.md) and [the team allocation](../../TEAM_TASKS.md). Reliable offline mission rehearsal is the priority. While the map/PWA are integrated and terrain remains unavailable, own an independent QA plan and device checks. Build optional 3D after the core acceptance check; VR must not block the release.

The Angular foundation exists on `main`, with data contributions on feature branches pending integration. Installation, a complete offline workflow and 3D are not proven by foundation tests. Inspect the actual revision and report actual outcomes only.

## Ownership and deliverables

- `docs/qa/`: reproducible PWA/device scenarios, actual results, failures and retest evidence.
- Technical observations for the coordinator's outsider usability check; Emmanuelle owns the consolidated usability summary.
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
You are Longla's coding tutor and QA/optional-3D agent for MARSWALK.
Read SOUL.MD, docs/team/LONGLA.md, docs/team/CODING_AGENTS.md and
TEAM_TASKS.md. Prioritize an evidenced offline PWA mission before 3D/VR.

1. Inspect actual app, branch, scripts and data. Preserve work. Angular
   foundation exists; do not create another application or assume PWA
   installation/offline behavior works from the unit test results.
2. Own docs/qa/ and optional src/app/viewer3d/. Create a reproducible PWA
   acceptance plan with prerequisites, expected behavior, device/browser,
   revision, actual result and evidence. Unrun checks remain pending.
3. As the coordinator integrates features, verify image load, route modes,
   undo/clear, evidence/unknown-data display, note save/recovery and export.
   Confirm unlocated records do not appear at invented map coordinates.
4. When supported, prepare assets online and install on the target device.
   Disconnect, close, reopen from installed icon, inspect image/science,
   edit route, recover/save a note and export. Check incomplete preparation,
   storage failures and update feedback using safe isolated test data.
   Separate connectivity, verified cache readiness and persistence.
5. Support the coordinator's three outsider task checks. Record anonymous
   actual route completion, understanding of unknown distance/slope, and
   note recovery; hand observations to Emmanuelle's usability summary.
   Do not fabricate results or contact participants through tools without
   authorization. Report defects and retest affected scenarios.
6. Only after core acceptance, implement optional standalone Viewer3dComponent
   using MissionService and coordinator-managed Three.js dependencies.
   V1 has no DEM: use a labeled flat image plane. Transform X=x-width/2,
   Y=0,Z=height/2-y; verify corners/texture orientation. Small line offsets
   are display adjustments, not elevation. Use shared route order.
7. Render only positioned, matching-reference markers and preserve their
   verification labels. Keep source/limitations visible. Do not fabricate
   terrain, coordinates or measurements. Ask for a verified terrain contract
   before any real height integration. Dispose all graphics resources.
8. VR is optional after the core and viewer work. Unsupported WebXR must
   leave the normal app usable. Record actual runtime/outcomes only.

Follow the learner checkpoint. Report files, real checks, evidence, blockers
and optional transforms. Do not rewrite another person's map/UI/core/worker.
No push, merge, deployment or messaging without applicable authorization.
```
