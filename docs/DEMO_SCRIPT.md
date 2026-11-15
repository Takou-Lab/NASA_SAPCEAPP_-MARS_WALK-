# MARSWALK — 60-Second Internal Demo Rehearsal

Updated **15 November 2026** for current release baseline **`f6567ca`** and live Vercel deployment (**https://marswalk-jet.vercel.app/**). Internal pacing is an operational guideline, not an official competition time limit. State the actually demonstrated revision. Use isolated rehearsal data; export existing work before replacement. Active imageRef: `hirise-mro-pia26306-boxwork-2048x1042-v1`. Sketched routes and field notes are user rehearsal inputs, not a measured Curiosity traverse.

| Time | Action on live / integrated app | Suggested narration |
| --- | --- | --- |
| 0:00–0:08 | Open prepared HiRISE image; highlight NASA/JPL-Caltech/UArizona attribution | “MARSWALK is an exploration planner for Gale Crater's boxwork formations, built around real NASA data and explicit evidence boundaries.” |
| 0:08–0:20 | Switch to Start, Waypoint, and Destination modes; click map to draw traverse | “Users sketch visual proposals directly on the raster. Metric distance and slope remain explicitly unavailable because calibration is unverified.” |
| 0:20–0:30 | Filter and inspect contextual Curiosity science records | “Three real Curiosity observations remain readable with full findings and source links, without placing unverified pins on orbital imagery.” |
| 0:30–0:38 | Review Exploration Confidence Panel and Image Passport | “Uncertainty and data gaps are front and center: the app enforces Visual Review Only and never claims a route is safe.” |
| 0:38–0:48 | Type a field note, demonstrate draft preservation on failure, then save & recover | “Field observations persist locally per raster reference. If storage fails, user drafts are kept intact in the editor.” |
| 0:48–0:55 | Open Mission Transfer; download versioned mission JSON | “The entire proposal—route, notes, provenance, and limitations—exports into a portable, versioned JSON record.” |
| 0:55–1:00 | Summarize PWA status and release gates | “The app is a live PWA with service worker caching. Offline restart checks pass in the browser; physical standalone device acceptance is currently pending.” |

## Extended Rehearsal Notes (90–120 Seconds)

1. **Mission Transfer Demonstration:** After exporting the mission JSON, demonstrate importing a matching file with replacement confirmation, then show that an invalid or mismatched `imageRef` is safely rejected.
2. **Optional 3D Rehearsal:** Open the **3D Rehearsal** tab and launch the **3D Viewer**. Emphasize that it is an opt-in, flat training projection that releases GPU resources on teardown, and does not claim to supply measured DEM terrain or immersive VR.
3. **PWA Offline Recovery:** Demonstrate closing the network connection in DevTools, reloading the page, and verifying that the cached raster, science records, and local notes reload without error. Note that physical device home-screen installation testing is tracked in [docs/qa/PWA_ACCEPTANCE.md](qa/PWA_ACCEPTANCE.md).

[Final checks](qa/FINAL_BRANCH_INTEGRATION.md), [team tasks](../TEAM_TASKS.md), [branch reviews](../REVIEW.md), [device/PWA gates](qa/PWA_ACCEPTANCE.md).
