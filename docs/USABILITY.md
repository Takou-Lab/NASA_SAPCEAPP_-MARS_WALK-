# Usability Protocol & Formative Session Log — MARSWALK

> **Status:** **`PENDING (Sessions Not Yet Conducted)`** — Protocol prepared for the post-handoff evaluation phase. No participants have been tested yet; no outcomes, timings, or failures may be fabricated.
> **Scope Boundary:** A three-person formative usability test provides qualitative workflow feedback for refining the interface and confidence messaging. It is **not** proof of operational navigation fitness or astronaut safety certification.

## 1. Purpose & Roles

- **Goal:** Verify whether people outside the MARSWALK team can plan a proposed Mars traverse on the prepared regional image, understand which distance/slope metrics are known vs. unavailable, and save/recover an observation note after reopening the installed PWA offline.
- **Participants:** Three outside users matching target near-term audiences (e.g., planetary-science students/educators, analogue mission participants, or science outreach users). Do **not** contact participants through automated messaging tools without explicit authorization.
- **Session Ownership:**
  - **Coordinator (`YOU.md`):** Arranges and conducts the three sessions once the integrated offline PWA build is verified.
  - **Longla (`LONGLA.md`):** Supports independent target-device/offline QA and live session observation.
  - **Emma (`EMMA.md`):** Prepares this protocol and records only observed, anonymized outcomes, misunderstandings, failures, and retest results.

## 2. Prerequisites Before Running Sessions

Before conducting any session, confirm on the demonstration device that:
1. Gaddielle's `public/data/manifest.json` + prepared image (`hirise-mro-pia26306-boxwork-2048x1042-v1`) and Emma's `public/data/markers.json` are integrated.
2. Willy's Leaflet `CRS.Simple` map and Enzo's tablet UI, Exploration Confidence Panel, Data Passport, contextual science list, and notebook are integrated.
3. Coordinator's PWA manifest, service-worker caching, and production offline reopening pass independent QA checks.

## 3. Standardized Three-Task Protocol

Ask each participant to complete the following three tasks without prompting them with the answers:

### Task 1 — Draw a Proposed Route
- **Prompt to participant:** *"Using the map and route controls, sketch a proposed traverse across the Mount Sharp boxwork image with a start point, at least one intermediate waypoint, and a destination. Then undo or adjust one point."*
- **What to observe:**
  - Can the participant switch between `start`, `waypoint`, `destination`, and `inspect` modes and see the ordered polyline?
  - Can the participant place visual route endpoints freely without expecting a geolocated science marker pin as a mandatory target?

### Task 2 — Explain Distance & Slope Status
- **Prompt to participant:** *"Looking at your sketched route, is the route's metric distance known or unknown? Is terrain slope known or unknown? Please point to the message on screen that supports your answer."*
- **What to observe:**
  - Does the participant accurately state that **metric distance is unavailable** (because pixel calibration on `PIA26306` is unverified) and **elevation/slope are unavailable** (because no validated aligned DEM is loaded; visual review only)?
  - Can the participant locate and point directly to the supporting warning in the **Exploration Confidence Panel** / **Data Passport**?

### Task 3 — Save a Note, Reopen Offline, and Recover
- **Prompt to participant:** *"Write and save a brief field observation note for this route. Next, close the app, disconnect the device from the network, reopen the prepared app offline, and verify whether your route and note are still there (and test JSON mission export if available)."*
- **What to observe:**
  - Does the saved observation persist across an offline close/reopen cycle with the exact entered text and active `imageRef`?
  - If a save fails (e.g., storage full/disabled), is the typed draft preserved?

## 4. Anonymized Participant Outcomes

| Participant ID (Anonymized) | Task 1: Draw Route | Task 2: Explain Distance/Slope & Supporting Message | Task 3: Save & Recover Note Offline | Observed Time (Only if Measured) | Misunderstandings / Failures | Session Status |
| --- | --- | --- | --- | --- | --- | --- |
| `Participant P1` | `PENDING` | `PENDING` | `PENDING` | `PENDING (Not measured)` | `PENDING` | `PENDING — Not yet conducted` |
| `Participant P2` | `PENDING` | `PENDING` | `PENDING` | `PENDING (Not measured)` | `PENDING` | `PENDING — Not yet conducted` |
| `Participant P3` | `PENDING` | `PENDING` | `PENDING` | `PENDING (Not measured)` | `PENDING` | `PENDING — Not yet conducted` |

## 5. Obstacle Triage & Retest Log

- **Most Common Obstacle Identified:** `PENDING — Awaiting completion of the three outside-user sessions.`
- **Implemented Fix:** `PENDING`
- **Changes to Retest & Outcome:** `PENDING`
