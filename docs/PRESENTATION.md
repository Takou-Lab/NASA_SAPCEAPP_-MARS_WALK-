# MARSWALK — Internal Presentation Outline (7 Slides)

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Author: Emma (he/him). These seven slides and [60-second rehearsal](DEMO_SCRIPT.md) are internal choices, not verified official submission limits. Status aligned **14 November 2026 (Africa/Douala)** with [REVIEW.md](../REVIEW.md) and [the work plan](../TEAM_TASKS.md).

| Slide | Message and evidence | Actual stage / remaining artifact |
| --- | --- | --- |
| 1 — User and purpose | Planetary-science learning, analogue mission rehearsal and reasoning under incomplete evidence; [SOUL.MD](../SOUL.MD) | Target users/use cases, not claimed customers or validated astronaut navigation |
| 2 — The real data boundary | Gale/Mount Sharp image and three sourced Curiosity records; no verified pixel tie-points, metric scale or DEM | Local image/records work on main. Exact AOI/terrain remains unavailable; [science audit](SCIENCE_EVIDENCE.md) |
| 3 — What we contribute | A bounded mission workflow, portable notes/routes and visible provenance/unknowns | Do not claim Mars Trek/JMARS lacks terrain, route or GIS features; [references](REFERENCES.md) |
| 4 — Show the current app | One image map, navigation, selectable science, guarded mission import/export | Working on main; [science](qa/SCIENCE_INTEGRATION.md) and [transfer](qa/MISSION_TRANSFER.md) checks. Capture the actually served revision |
| 5 — Complete the mission interface | Enzo's route/notebook shell works on his branch; Emma owns discovery and future confidence/image-passport panels | Enzo `bcac915`: 57 tests/build/browser checks; final main reconciliation W4. Emma W3 panels assigned, not implemented |
| 6 — Optional 3D and device evidence | Corrected flat viewer is optional, lazy and explicitly has no measured terrain/VR | Longla code `2a6dbba`, published `9d794e2`: 70-test/build/browser evidence; main integration/physical-device outcomes pending |
| 7 — Offline goal and next proof | Install, verify complete assets, disconnect, reopen, recover route/note and export | W6 implements lifecycle; W5 runs actual device acceptance. Outside-user sessions remain unrun; [acceptance](qa/PWA_ACCEPTANCE.md), [usability](USABILITY.md) |

## Speaker guidance

Use the current main rehearsal for the primary demo. If showing a branch-only feature, name its branch/revision and say that final integration is pending. Imported rehearsal notes do not demonstrate a working notebook form, and a JSON transfer does not install/cache the app.

Explain why the science records remain readable without fabricated pins. Distinguish measured observations, derived interpretations and user-sketched routes. State that distance is unavailable without verified calibration and that neither calibration nor a flat viewer supplies terrain slope or hazard safety.

Keep NASA/USGS provenance and library/AI credits visible. Earlier source audits remain contributor records; this documentation alignment did not independently re-fetch every source or certify scientific interpretation. A three-person formative test will provide feedback, not operational fitness proof.

## Evidence to capture next

- W4's final integrated route → science → note → recovery/export/import workflow with its actual commit and browser.
- W3's reviewed evidence panels when delivered; do not replace their status with a mockup presented as working software.
- W5's real device observations and, after W6, an installed disconnected close/reopen mission.
- Actual anonymized outside-user outcomes and the observed issue fixed after testing.

Preserve completed research/presentation work. Refresh screenshots and claims when a reviewed revision is actually integrated; no full rewrite is assigned to Emma before his W3 implementation. Verify official submission requirements/deadline separately.
