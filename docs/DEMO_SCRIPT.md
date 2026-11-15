# MARSWALK — Demonstration Rehearsal Scripts

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Updated **15 November 2026**. Demonstrators must explicitly cite the active served revision:
- **Live Vercel Deployment:** [https://marswalk-jet.vercel.app/](https://marswalk-jet.vercel.app/) (serves commit **`b6669fb`**, pack `95d8b5f6ee7aba0a38e8e7758ada62be20a3f0ca61efd04adce0fc4cabb7a827`).
- **Local Production Build:** Cite the exact local commit and its specific test scope.

> [!NOTE]
> Internal pacing targets (2 minutes primary, 45 seconds fallback) are team operational rehearsal guidelines, not verified official competition constraints.

---

## Pre-Demonstration Setup (Perform Before Presenting)

1. Open the application in a clean browser session (e.g. Chrome / Edge).
2. Confirm the active raster is loaded: `hirise-mro-pia26306-boxwork-2048x1042-v1`.
3. Locate the PWA preparation control in the header/drawer: click **Prepare offline**.
4. **Wait for full pack preparation to complete** (status indicates "ready" with verified asset bytes). Do not disconnect the network before preparation finishes.
5. Have sample mission notes drafted or ready for typing.

---

## Primary Demonstration (2 Minutes)

| Segment | Elapsed | Control / Screen Action | Suggested Narration |
| --- | --- | --- | --- |
| **1. Purpose & Image Attribution** | 0:00–0:18 | Open map; show raster and source metadata badge | “MARSWALK is an exploration planner for Gale Crater's boxwork formations, built around real NASA data and explicit evidence boundaries. We are looking at HiRISE image PIA26306 from Mars Reconnaissance Orbiter.” |
| **2. Proposed Route Sketching** | 0:18–0:38 | Switch between **Start**, **Waypoint**, and **Destination** buttons; click raster to place 3 points | “Users sketch proposed traverses directly on the regional raster. Notice that distance and slope are explicitly reported as unavailable: pixel scale is uncalibrated and no aligned DEM is loaded.” |
| **3. Contextual Science Inspection** | 0:38–0:55 | Select and expand a Curiosity science record (e.g. Mount Sharp Boxwork Ridges and Hollows) | “Three real Curiosity rover findings from Mount Sharp are available for contextual science. Because geodetic tie-points onto this orbital image are unverified, they are presented with full source links but zero fabricated map pins.” |
| **4. Field Observation & Save** | 0:55–1:15 | Open **Notebook**; type a field observation note; click **Save Observation** | “Scientists record observations tied to the active image reference. The system confirms save to local persistence, and typed drafts are preserved in memory if storage fails.” |
| **5. Route Save & Mission Export** | 1:15–1:30 | In Route Planner, click **Save Route**; then click **Export** (Mission Transfer) | “We save the route locally and export a versioned, portable mission JSON package containing the geometry, notes, provenance, and active constraints.” |
| **6. Disconnected Reopen & Load** | 1:30–1:50 | Disconnect network; fully close browser tab; reopen application offline; click **Load Route** | “With the network disconnected, we reopen the prepared application. Notice that startup does not restore notes automatically—we explicitly click 'Load Route' to restore the saved traverse and view our recovered notes and export.” |
| **7. Optional 3D Rehearsal or Close** | 1:50–2:00 | (Optional) Switch to **3D Rehearsal** and launch flat viewer, or summarize release gates | “An opt-in flat 3D viewer provides spatial orientation without fabricating 3D terrain. Browser offline restart checks pass; physical standalone device acceptance is tracked as pending.” |

---

## Rapid Fallback Demonstration (45 Seconds)

Use this condensed sequence if presentation time is limited or offline network manipulation is restricted:

| Time | Control / Action | Suggested Narration |
| --- | --- | --- |
| 0:00–0:10 | Open map showing `PIA26306` with NASA attribution | “MARSWALK enables bounded exploration planning on Gale Crater imagery while making data uncertainty transparent.” |
| 0:10–0:22 | Draw a 3-point route; highlight Confidence Panel | “Users sketch a proposed traverse. The confidence panel enforces Visual Review Only—distance and slope remain unavailable without verified calibration.” |
| 0:22–0:32 | Open Notebook; save an observation; click **Save Route** | “Contextual science records remain readable without fake map pins. Users save observations and store routes locally per image reference.” |
| 0:32–0:45 | Click **Export** to show JSON; cite offline PWA status | “Proposals export as versioned mission JSON. Full pack caching enables offline browser recovery; physical device testing and usability sessions remain in progress.” |

---

## Operational & Fallback Notes

1. **Explicit "Load Route" Action:** Startup does **not** automatically reload previous routes or notes into active memory. Demonstrators must explicitly click **Load Route** in the Route Planner to restore persisted state. (Note: Royce's physical device report tracks an open note-persistence observation under investigation).
2. **Offline Testing Realities:** A DevTools offline toggle is a browser smoke check. A genuine offline proof requires physical disconnection and a full process close and reopen. If live offline simulation cannot be performed safely, present the online workflow and clearly state the offline capability status.
3. **No Staged Failures:** Do not attempt to inject storage failures or corrupt drafts during a live rehearsal unless using an isolated test harness.
4. **Flat 3D Boundary:** Only launch the 3D viewer if WebGL is supported on the presentation device. Emphasize that it is a flat reprojection for rehearsal, not a measured digital elevation model.
