# Royce / Longla — PWA Quality Checks and Optional 3D Rehearsal

## Current review — correct the delivered viewer before integration

Royce's original-plan 3D role is documented as Longla in this repository. Published branch **`feature/longla-3d-rehearsal`**, commit **`aedfd4d`**, is reviewed: **changes required**. Read [the full findings](../reviews/LONGLA.md), [shared contract](CODING_AGENTS.md), [SOUL.MD](../../SOUL.MD) and [NEXT_TASKS.md](../../NEXT_TASKS.md).

The viewer is delivered: **24 branch tests and production build passed**, with initial/style size warnings. Preserve the component, transforms, route rendering and camera controls. The branch predates the integrated map/data and has a root conflict with main; no viewer code is merged. Do not restart the assignment or add VR.

### Same-branch correction slice

1. **R1 — integrate safely:** merge latest main into the same branch without reset/force push. Retain canonical core, one initialization, MapComponent, real data, mission import/export and all accepted tests. Keep the optional viewer behind explicit activation and defer its download/rendering. Resolve the root conflict; do not raise budgets to hide size warnings.
2. **R2 — camera/resources:** route edits must update route objects without rebuilding the image or resetting the user's view. Dispose replaced textures and helper resources as well as resources still attached at teardown. Guard asynchronous loading and reset obsolete hover references.
3. **R3 — failures:** show loading/image-error/ready states, validate decoded dimensions and graphics initialization, and keep the main 2D mission usable when WebGL2/image loading fails. Do not relabel a metadata-ready mission as invalid because the viewer image fails. Include source/credit/limitations and verify actual texture corners.
4. **R4 — evidence:** replace unsupported Martian-north/geographic-heading claims with image-axis labels or remove the compass. The current image orientation is unverified. Describe all display offsets honestly; terrain and metric scale remain unavailable.
5. **R5 — VR:** remove the Enter/Exit VR toggle that only changes a signal. Mark immersive VR unimplemented. Actual VR is a later optional task.

Own `src/app/viewer3d/` and QA records. For this correction only, narrow root TS/HTML/SCSS/spec and package/lockfile edits are authorized to reconcile the viewer, preserve main behavior and defer it. Keep existing dependency versions; put type declarations in devDependencies. Do not edit another person's component, shared core/models, source data or worker.

### Verification and handoff

Add meaningful regressions for R2/R3 and truthful labels/VR availability. Retain the integrated regressions and run `npm test` and `npm run build` from the reconciled branch. Record actual real-data browser outcomes, including image failure, graphics fallback, route edits, view persistence, activation/teardown/reopening and texture alignment in `docs/qa/VIEWER3D_REVIEW.md`. Create/update `docs/qa/PWA_ACCEPTANCE.md`; installation/offline/physical-device scenarios remain pending until actually run.

Commit/push **only `feature/longla-3d-rehearsal`**, then provide the commit, files, R1–R5 closure, actual test/build/browser results and remaining limitations. This correction assignment authorizes that normal feature-branch push. No main merge/push, deployment, environment publication, competition submission or external messaging is included. After approval, continue independent PWA/device QA; do not expand into terrain/VR now.

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
You are Royce/Longla's MARSWALK viewer and QA agent. Continue the SAME
feature/longla-3d-rehearsal branch. aedfd4d is delivered but needs corrections;
do not restart the viewer or implement VR to close this review.

Read docs/reviews/LONGLA.md (R1–R5), docs/team/LONGLA.md,
docs/team/CODING_AGENTS.md, SOUL.MD and NEXT_TASKS.md.
24 branch tests and production build pass; they use the older foundation.

1. Preserve local work. Merge latest main without reset or force push.
   Resolve app.ts conflict while retaining MapComponent, single initialize,
   current core/data, mission transfer UI/guards and all accepted regressions.
   Optional viewer must load/render only after explicit activation. Do not
   raise size budgets. Preserve dependencies; type declarations are dev-only.
2. Separate image/terrain changes from route/marker updates. Route edits must
   keep camera and loaded texture unchanged. Dispose replaced textures,
   grid/arrow descendants and all teardown resources; guard late image work
   and clear stale hover references. Add meaningful behavioral tests.
3. Add local image loading/error/ready and natural-dimension checks. Handle
   WebGL2/renderer initialization failure with cleanup and visible fallback.
   Keep core readiness and 2D mission unchanged. Never show image-coordinate
   overlays as usable when imagery failed. Label practice coordinates.
   Preserve document-base paths, source link/credit/limitations; verify
   actual texture corners against 2D, not only coordinate helper math.
4. Remove unsupported Martian North/N/S/geographic-heading claims. Use image
   axes or omit the compass; current orientation/metric scale are unverified.
   Describe visual offsets honestly; no measured elevation or terrain claims.
5. Remove the simulated Enter/Exit VR state. State immersive VR unimplemented.
   No new VR scope; capability detection alone is not a working session.
6. Run complete integrated tests and production build. Browser-check main
   2D flow before/after optional activation, camera retention, failed/wrong
   image, graphics fallback, repeated teardown/reopening and alignment.
   Record actual outcomes in docs/qa/VIEWER3D_REVIEW.md. Create/update
   docs/qa/PWA_ACCEPTANCE.md with unrun installation/offline/device checks
   marked pending. Do not fabricate device, headset or user-test outcomes.

Own viewer3d and QA docs. Narrow root TS/HTML/SCSS/spec and package/lockfile
changes are allowed for this integration only. Do not alter shared core,
source assets, another contributor's component or service worker.
Commit/push only this existing feature branch (authorized) and request
re-review with commit, R1–R5 closure and actual checks. No main integration,
deployment, environment publication, submission or external messaging.
```
