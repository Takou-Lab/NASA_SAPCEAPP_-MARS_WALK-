# MARSWALK — Internal Presentation Outline (7 Slides)

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Original author: Emma (he/him). Enzo now maintains remaining presentation work after the user's assignment swap; original authorship is retained. These seven slides and [60-second rehearsal](DEMO_SCRIPT.md) are internal choices, not verified official submission limits. Status aligned **15 November 2026 (Africa/Douala)** with [REVIEW.md](../REVIEW.md) and [the work plan](../TEAM_TASKS.md).

| Slide | Message and evidence | Actual stage / remaining artifact |
| --- | --- | --- |
| 1 — User and purpose | Planetary-science learning, analogue mission rehearsal and reasoning under incomplete evidence; [SOUL.MD](../SOUL.MD) | Target users/use cases, not claimed customers or validated astronaut navigation |
| 2 — The real data boundary | Gale/Mount Sharp image and three sourced Curiosity records; no verified pixel tie-points, metric scale or DEM | Local image/records work on main. Exact AOI/terrain remains unavailable; [science audit](SCIENCE_EVIDENCE.md) |
| 3 — What we contribute | A bounded mission workflow, portable notes/routes and visible provenance/unknowns | Do not claim Mars Trek/JMARS lacks terrain, route or GIS features; [references](REFERENCES.md) |
| 4 — Show the current app | One image map, navigation/retry, science filters and confidence/passport | Integrated main `b744b0b`; [final checks](qa/FINAL_BRANCH_INTEGRATION.md). Capture the actually served revision |
| 5 — Complete the online mission | Draw/save/recover route, create/save note, guarded mission import/export; failed saves retain drafts | Enzo shell and Emma panels integrated; 131 Angular tests, 28 data tests/build/browser pass; build size warnings remain |
| 6 — Optional 3D and device evidence | Integrated opt-in lazy flat viewer; no measured terrain/VR; resources released on exit | Browser checks pass; Longla's hardware report needs exact build/message/browser/FPS clarification |
| 7 — Offline goal and next proof | Install, verify complete assets, disconnect, reopen, recover route/note and export | W6 implements lifecycle; W5 runs actual device acceptance. Outside-user sessions remain unrun; [acceptance](qa/PWA_ACCEPTANCE.md), [usability](USABILITY.md) |

## Speaker guidance

Use the current integrated main rehearsal for the primary demo and name its served revision. All current submitted features are integrated. Imported rehearsal notes do not demonstrate a working notebook form, and a JSON transfer does not install/cache the app.

Explain why the science records remain readable without fabricated pins. Distinguish measured observations, derived interpretations and user-sketched routes. State that distance is unavailable without verified calibration and that neither calibration nor a flat viewer supplies terrain slope or hazard safety.

Keep NASA/USGS provenance and library/AI credits visible. Earlier source audits remain contributor records; this documentation alignment did not independently re-fetch every source or certify scientific interpretation. A three-person formative test will provide feedback, not operational fitness proof.

## Evidence to capture next

- Refresh screenshots from the actual integrated route → science → note → recovery/export/import workflow.
- Preserve the accepted evidence UI; W3 is now a pure image-byte verifier rather than another panel assignment.
- W5's reconciled physical-device observations and, after W6, an installed disconnected close/reopen mission.
- Actual anonymized outside-user outcomes and the observed issue fixed after testing.

Preserve completed research/presentation work. Refresh screenshots and claims when a reviewed revision is actually integrated; no full rewrite is assigned to Emma for his new W3 byte-verifier implementation. Verify official submission requirements/deadline separately.
