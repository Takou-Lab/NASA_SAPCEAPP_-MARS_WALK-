# Willy — Retry a failed local image load

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W1](../../../TEAM_TASKS.md#w1).** Follow the canonical ownership/dependency plan; preserve completed work and existing local progress.
<!-- /CURRENT_WORK_PLAN -->

Your Reset View / Focus Route work at `21cf6f0` passed review and its tests/build; preserve it and the integrated readiness guard. This is a new usability task, not a defect to reopen in the completed navigation assignment.

Read [WILLY.md](../WILLY.md), [the shared contract](../CODING_AGENTS.md) and [the image contract](../../data/IMAGE_CONTRACT.md).

## Branch and ownership

Preserve local task work. If no retry branch exists, create proposed `feature/willy-image-retry` from latest published main; otherwise keep the existing task branch and synchronize safely. Own only `src/app/map/map.component.ts`, `.html`, `.scss` and `.spec.ts`. No new dependency, root/core API, data file, cache manager or service worker is needed.

## Required behavior

- Show a native **Retry Image** button when core metadata is ready, a valid active manifest exists, and the map image-display state is error.
- Do not offer it for missing/invalid metadata. Do not call initialize again or force core dataStatus to ready/error for rendering failures.
- An explicit retry recreates the local image overlay using the existing base-relative URL and manifest bounds. Keep the image bytes, asset path and imageRef unchanged.
- Validate successful decoding/natural dimensions exactly as on first load. A repeated failure stays a visible error with another explicit retry available; do not auto-loop.
- While retry is loading, block duplicate retry attempts and keep Reset View, Focus Route and route-point dispatch guarded.
- Invalidate the previous request token and ignore late load/error events from superseded overlays. Teardown must still cancel observations/listeners and remove the map correctly.
- Preserve route, mode, observations, selected record and layer visibility across failure/retry. Re-render the existing route/positioned markers after a successful retry.
- Use a readable label, keyboard focus and touch-friendly control. Do not clear storage/caches, discard notes, regenerate data or claim PWA readiness to make a retry succeed.

## Verification

Add meaningful regressions for initial failure → retry → correct load, repeated failure, dimension mismatch, stale callbacks, duplicate attempts while loading, metadata unavailable, teardown and unchanged mission state. Preserve all existing navigation and readiness tests.

Run `npm test` and `npm run build`. Where supported, use browser request interception to fail the first image request and allow the retry; verify one successful loaded image and no duplicate map/route layers. Use test-only interception rather than changing the real image. Mark unsupported checks unrun.

Commit and push only the assigned W1 task branch (default `feature/willy-image-retry`; report an existing task name if different); that own-feature push is authorized. Hand off the commit, changed files, actual tests/build/browser outcomes and remaining limits. No main merge/push, environment publication, deployment or external messaging is included.
