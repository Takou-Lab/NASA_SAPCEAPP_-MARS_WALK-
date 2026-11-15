# Willy retry review — approved and integrated

**15 November current integration:** all submitted code is merged in `b744b0b`; 131 Angular tests, 28 data tests, build and browser checks pass. [Final evidence](../qa/FINAL_BRANCH_INTEGRATION.md). Counts/revisions below describe their earlier tested scopes.


Published **`feature/willy-image-retry`**, tip **`02134f1b71389fbadd5f31051fb78c24118d2da4`**, reviewed **14 November 2026 (Africa/Douala)**. Verdict: **approved**, merged at `4c35a83`; combined integration code `85561a6` passes **81 tests/build/browser checks**.

The submission changes only the four map files. It gates retry on ready valid metadata plus display failure, preserves the existing map/view and shared mission, decodes and checks dimensions, invalidates obsolete requests, detaches handlers and blocks duplicate attempts/navigation until display is ready. Existing navigation/source/marker behavior is retained.

Willy's isolated branch passes **56 tests** and production build. Actual combined production-browser interception proved initial failure → held explicit retry → decoded success, one overlay, restored existing route and unchanged exported notes/image; repeated failures remain explicit without loops. Stale-event/decode/dimension/missing-metadata/teardown regressions pass in the map unit suite. [Full integration evidence](../qa/RECOVERY_EVIDENCE_INTEGRATION.md).

No source raster, core/store, dependency or cache/worker changes were included. This closes W1's image-retry slice; do not repeat it. Next W1 is [PWA manifest/icon assets](../team/tasks/WILLY_PWA_INSTALL_ASSETS.md), isolated from Enzo/root/worker work. [Updated agent prompt](../team/WILLY.md).

---

# Previous accepted navigation review — retained

<!-- CURRENT_WORK_PLAN -->
> **Published-commit review record.** Current work and file ownership follow [the team plan](../../TEAM_TASKS.md); historical findings below are not new assignments.
<!-- /CURRENT_WORK_PLAN -->

Reviewed **14 November 2026**. Branch `feature/willy-map-development`, tip **`21cf6f0ad90144bd67af916d437651d97c40b9b2`**, compared with main `f65778d`. The accepted navigation contribution is merged into this integration.

## Findings and checks

- Only four map-owned files changed; the merge preview and actual merge were clean.
- Reset View fits the active image bounds with padding.
- Focus Route reads the shared ordered points, requires at least two, and caps zoom at 2, including coincident points.
- Both controls require valid metadata and successfully displayed imagery. The earlier route-click readiness guard is retained.
- Native buttons have readable labels, visible focus and minimum 44px touch targets.
- The actions change the viewport without mutating route, mode, observations, selection or layers.

A temporary extraction of the branch passed frozen-lockfile installation, **38 tests across four files**, and the production build. The existing Leaflet CommonJS optimization warning remains within the configured bundle budget.

Chromium checks against its development server passed desktop keyboard and tablet-sized touch-emulated activation for reset, short-route disabled state, route framing, coincident zoom cap and unchanged mission state. An intercepted missing-image request left both viewport actions disabled. Test setup supplied route points through the actual MissionService because Enzo's route controls are not integrated; this is not a complete user-flow or installed-device test.

No blocker was found in the delivered navigation assignment. Earlier source/history and image bytes remain intact. Full PWA installation/offline reopening and physical-device/user sessions remain pending.

## New bounded task

Add an explicit **Retry Image** action for a map-owned image-display error, preserving mission state and request-token safety. This is a new follow-up, not a correction to reopen in the accepted navigation work.

Specification: [WILLY_IMAGE_RETRY.md](../team/tasks/WILLY_IMAGE_RETRY.md). Agent handoff: [WILLY.md](../team/WILLY.md).
