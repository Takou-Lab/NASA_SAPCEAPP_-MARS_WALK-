# Willy navigation review — approved and integrated

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
