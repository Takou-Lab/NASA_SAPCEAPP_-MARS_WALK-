# Science-context integration checks

<!-- CURRENT_WORK_PLAN -->
> **Revision-scoped evidence/acceptance record.** Keep recorded counts/outcomes tied to their revisions; current assignments and dependencies are in [the work plan](../../TEAM_TASKS.md). Unrun device/offline checks remain pending or blocked.
<!-- /CURRENT_WORK_PLAN -->

Date: **14 November 2026**. Reviewed science tip **`4efcb5a`**, tested against main baseline **`91a1eaf`** with narrow coordinator root changes. GitHub PR #3 then merged the identical component at **`52f5764`**; this integration preserves that merge and adds the tested root mounting. Export: `ScienceContextComponent`, selector `app-science-context`.

## Automated verification

- Frozen-lockfile install in an isolated copy of current main plus the submitted component passed.
- `NG_CLI_ANALYTICS=false npm test`: **51 tests passed across five files**, both before and after root mounting. Seven submitted tests cover selection, unlocated records, preserved state, missing fields, errors/empty/removed selection, plain text and position/link formatting.
- The root real-service regression now selects a delivered record, confirms its finding and unknown position, and confirms route, mode and observations remain unchanged.
- `NG_CLI_ANALYTICS=false npm run build`: passed after mounting; initial output **438.42 kB**, within the configured warning budget. The existing Leaflet CommonJS warning remains.

The coordinator mounts science once alongside the existing map and preserves mission-file transfer and one-time initialization. Source records, shared models/service and dependencies are unchanged.

## Production-browser outcomes

Served `dist/marswalk/browser` over local HTTP and tested with Chromium through Playwright:

| Scenario | Actual outcome |
| --- | --- |
| Real map image and all three delivered records | Image displayed; three native science selection buttons present |
| Keyboard focus + Enter on each science record | Correct finding, source/credit, unavailable position and selected state displayed |
| Safe source links | Correct source URL; `target="_blank"` and `rel="noopener noreferrer"` present |
| Keyboard clear selection | Details closed; selection buttons remained usable |
| Mission exported before/after selection | Route, observations and image unchanged; no science marker pins created; Focus Route remained disabled for the empty route |
| Desktop 1366 × 1100 and tablet-sized 820 × 1180 | No page errors; usable layout |
| 390 × 844 viewport with science panel constrained to 320 px | No page or science-panel horizontal overflow |
| Controlled failed `markers.json` request | Readable science-load error and empty state; no fabricated records |

The normal run used main's actual image/records. Only the failure scenario intercepted the science request. No external source page was visited and no source records were changed.

These are desktop Chromium and emulated viewport checks. Physical-device behavior, installation, complete offline cache/reopening and outside-user sessions remain pending. This review did not independently re-fetch the scientific sources.

## Follow-up ownership

Emma preserves this component and builds [science discovery plus the transferred read-only confidence/image-passport panels](../team/tasks/EMMA_SCIENCE_EVIDENCE_WORKSPACE.md). Enzo preserves one science mount while integrating his shell and imports the later evidence components only after review. This record is not a claim that those follow-ups already exist.
