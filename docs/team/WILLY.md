# Willy — Angular Map Developer

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W1](../../TEAM_TASKS.md#w1).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

## Accepted work and next slice

Your original map `094fce2` and Reset View / Focus Route `21cf6f0` are approved and integrated. The navigation review passed **38 tests**, production build and Chromium desktop-keyboard/tablet-sized touch-emulated checks. See [WILLY review](../reviews/WILLY.md). Do not recreate the map, repeat navigation buttons or mount another root component.

Read [the new detailed task](tasks/WILLY_IMAGE_RETRY.md), [SOUL.MD](../../SOUL.MD), [NEXT_TASKS.md](../../NEXT_TASKS.md) and [shared contracts](CODING_AGENTS.md).

## New task — Retry Image

Preserve local work. If no retry task branch exists, create proposed `feature/willy-image-retry` from latest published main in the existing checkout; otherwise retain the existing local task branch and synchronize safely. Own only the four files under `src/app/map/` for this task.

Add an explicit Retry Image action when valid metadata exists but the local image failed to display. Recreate only the image overlay, recheck natural dimensions, ignore stale request callbacks and preserve mission state. Duplicate attempts while loading must be blocked. Do not retry unavailable/invalid metadata, refetch MissionService initialization, clear caches/storage, modify source imagery or create an automatic retry loop.

Reset View / Focus Route and map-click actions remain guarded until the image is actually ready. A repeated failure stays a truthful error. See the exact behavior, tests and branch handoff in [WILLY_IMAGE_RETRY.md](tasks/WILLY_IMAGE_RETRY.md).

Enzo owns shell/planner/notebook integration; Emma now owns `src/app/science/` contextual record UI. Core, root, dependencies and PWA lifecycle remain coordinator-owned. Keep the current bottom-left pixel contract, imageRef, safe text rendering and teardown behavior.

## Done and handoff

Run relevant regressions, `npm test`, `npm run build` and supported browser failure/retry checks. Report actual results rather than copying the previous 38-test count. Physical-device/offline PWA verification remains separate.

Commit/push only your W1 task branch (default `feature/willy-image-retry`; preserve/report an already-started local task branch); that normal feature push is authorized. Give the coordinator the commit, changed files, failure/retry behavior, checks and limits. No main merge, deployment, environment publication or external messaging is included.

## Copy-paste coding-agent prompt

```text
You are Willy's map-recovery coding agent for MARSWALK.
Read docs/team/tasks/WILLY_IMAGE_RETRY.md, docs/team/WILLY.md,
docs/reviews/WILLY.md, docs/team/CODING_AGENTS.md and SOUL.MD.

The original map and navigation at 21cf6f0 are approved and integrated.
Preserve them. No repeated root mounting, map recreation or Reset/Focus work.

1. Preserve local work. If no retry branch exists, create proposed
   feature/willy-image-retry from latest published main; otherwise keep
   existing local task work and synchronize safely.
2. Own only src/app/map/map.component.ts/.html/.scss/.spec.ts.
3. Add Retry Image only for a valid ready manifest plus image-display error.
   An explicit retry recreates the base-relative local overlay, retaining
   imageRef, bounds and full load/natural-dimension validation.
4. Invalidate previous request tokens; ignore stale load/error callbacks.
   Block duplicate attempts while loading. Keep navigation/click guards.
   Repeated failure stays an error with explicit retry, never an auto-loop.
5. Preserve route, mode, notes, selection and layers. Restore their existing
   rendering on success. Do not clear storage/caches, refetch core metadata,
   alter assets, add dependencies or implement your own worker.
6. Add focused failure/retry/success, repeated-failure, mismatch, stale-event,
   duplicate-attempt, unavailable-metadata and teardown/state regressions.
7. Run actual tests/build and supported browser interception checks. Report
   real counts/results and any unrun scenarios; no invented PWA readiness.

Use learner checkpoints only for this new slice. Commit/push your new
task branch and hand off its actual name/commit/files/checks. No main merge/push,
deployment, environment publication or messaging to others is included.
```
