# MARSWALK — Internal Presentation Outline (7 Slides)

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Original author: Emma (he/him). Enzo now maintains remaining presentation and release-story documentation following the user's assignment swap; original authorship is retained. These seven slides and [60-second rehearsal](DEMO_SCRIPT.md) are internal choices, not verified official submission limits. Status aligned **15 November 2026** with current release baseline **`f6567ca`** and live Vercel deployment at **https://marswalk-jet.vercel.app/**.

| Slide | Message and evidence | Actual stage / remaining artifact |
| --- | --- | --- |
| 1 — User and purpose | Planetary-science learning, analogue mission rehearsal, and human reasoning under incomplete evidence; [SOUL.MD](../SOUL.MD) | Target users: students, educators, and analogue exploration teams. Not claimed operational astronaut navigation. |
| 2 — The real data boundary | Gale Crater / Mount Sharp HiRISE image (PIA26306) and three sourced Curiosity records; no verified metric scale, geodetic tie-points, or DEM | Local image/records active on main. Exact AOI-scale geological map and terrain elevation remain unavailable; [science audit](SCIENCE_EVIDENCE.md) |
| 3 — What we contribute | A bounded mission planning workflow, portable notes/routes, and visible provenance/uncertainty | Does not claim Mars Trek/JMARS lacks capabilities; provides a focused educational rehearsal tool with portable JSON export; [references](REFERENCES.md) |
| 4 — Show the current app | One image map (Leaflet CRS.Simple), layer toggles, contextual science filters, exploration confidence panel, and data passport | Live on Vercel (**https://marswalk-jet.vercel.app/**) and integrated in main `f6567ca`; [final checks](qa/FINAL_BRANCH_INTEGRATION.md). |
| 5 — Complete the online mission | Sketch route (start, waypoints, destination), save/load route, field note entry with draft retention on storage failure, versioned mission JSON export | Enzo shell, planner, and notebook integrated with Emma panels; 136 Angular tests + 11 worker tests + 28 data tests pass; style budget warnings remain below error threshold. |
| 6 — Optional 3D rehearsal | Integrated opt-in lazy flat viewer (Three.js); explicitly presents no measured terrain or immersive VR; resources released on exit | Browser WebGL checks pass; physical hardware FPS and mobile browser validation remain under device QA. |
| 7 — Offline PWA & release gate | Service worker caching, full pack verification, offline restart checks, and update notifications | Production service worker and pack verifier active in `f6567ca`. Physical standalone home-screen installation and outside-user sessions remain pending; [acceptance](qa/PWA_ACCEPTANCE.md), [usability](USABILITY.md). |

## Speaker guidance

Use the current live Vercel deployment (**https://marswalk-jet.vercel.app/**) or local production build for the demo and cite baseline commit **`f6567ca`**.

1. **Explicit Data Limits:** Explain why Curiosity science records remain readable without fabricated map pins (`position: null`). Distinguish measured observations, derived interpretations, and user-sketched routes.
2. **No False Safety Metrics:** State clearly that distance is unavailable without verified calibration, and that neither flat imagery nor the 2D viewer supplies slope, elevation, or rover trafficability certification ("Visual Review Only").
3. **Resilient Field Workflow:** Demonstrate note taking and highlight that typed drafts are preserved in the editor even if browser storage fails.
4. **Honest Limitations:** Keep NASA/JPL/USGS provenance visible. Acknowledge that physical device standalone testing, outside-user usability sessions, and official Space Apps submission confirmation are pending.

## Evidence to capture next

- Refresh high-resolution screenshots from the live Vercel deployment showing route drawing, confidence warnings, and export.
- Reconcile physical mobile device observations (W5) once device testing completes.
- Record actual anonymized outcomes from the three outside-user sessions in [docs/USABILITY.md](USABILITY.md) once arranged by the coordinator.
- Confirm official competition submission URL, form fields, and exact deadline with the coordinator.
