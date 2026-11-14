# Mission transfer verification

<!-- CURRENT_WORK_PLAN -->
> **Revision-scoped evidence/acceptance record.** Keep recorded counts/outcomes tied to their revisions; current assignments and dependencies are in [the work plan](../../TEAM_TASKS.md). Unrun device/offline checks remain pending or blocked.
<!-- /CURRENT_WORK_PLAN -->

Date: **14 November 2026**. Scope: coordinator-owned mission import/export added to the integrated Angular application.

## Automated checks

- `NG_CLI_ANALYTICS=false npm test`: **44 tests passed across four files**.
- `NG_CLI_ANALYTICS=false npm run build`: production build passed. The existing Leaflet CommonJS optimization warning remains.
- Service regressions cover exported-file round trip, malformed/version-mismatched/out-of-bounds records, invalid notes, duplicate identifiers, oversized files, missing active image, untrusted scientific metadata and storage failure. Failed imports preserve current work and saved data.
- Root checks cover asynchronous file selection/import and an older file read finishing after a newer selection.

## Browser check

**Passed in production Chromium**, with desktop (1366 × 1000) and tablet-sized (820 × 1180) separate contexts: exported route/note round trip, three rendered route points, preserved image identity, unavailable metric distance, wrong-image rejection and forced storage-failure rejection.

Serve `dist/marswalk/browser` over local HTTP and use separate Chromium contexts so browser storage is not shared. Import a bounded test route with one waypoint and an unlocated note into a desktop-sized context, export through the actual download button, then import that downloaded file into a fresh tablet-sized context. Check the route, note, image reference and rendered route points. Also reject a mismatched image reference and a forced storage failure without publishing replacement state.

This checks file portability between isolated browser sessions. It does not establish physical tablet behavior, PWA installation, offline cache completeness, disconnected reopening or outside-user usability. Those checks remain pending.

## Manual acceptance sequence

1. Open the app with its current image. Export current work before importing a replacement.
2. Choose a mission JSON file exported with that exact image version; select **Import selected mission**.
3. Confirm success, route display and **Focus Route**. Export again and inspect the route and observations.
4. Repeat on another device with the matching image pack.
5. Try malformed JSON and a different image reference. Confirm the current mission remains intact and the error is visible.

Import replaces and saves the mission. Initialization does not automatically restore it after reopening; the existing explicit `loadRoute()` flow still applies. The notebook/recovery UI is part of the pending integration.
