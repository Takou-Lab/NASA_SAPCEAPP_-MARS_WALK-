# Emmanuelle — Science, Provenance and Presentation

## Current follow-up — scientific evidence and PWA demo

Read [SOUL.MD](../../SOUL.MD) as guidance for integration and later work. It does not restart your completed assignment. Emmanuelle is listed as Emma in the existing filename and branch; keep `docs/team/EMMA.md` and `feature/emma-science-provenance`.

### Previous assignment completed — commit `8a947a4`

The user reported completion, and the branch inspection confirms these deliverables:

| Delivered work | Branch files |
| --- | --- |
| Three science records with the agreed imageRef and unavailable positions | `public/data/markers.json` |
| Record-level evidence audit, source passages and access log | `docs/SCIENCE_EVIDENCE.md` |
| Revised NASA-blog citations and narrowed claims/instrument attribution | `public/data/markers.json`, `docs/REFERENCES.md` |
| Accurate PWA-under-development status and implemented-versus-pending distinctions | `docs/SCIENCE.md` |
| Seven-step, status-labeled 60-second internal rehearsal | `docs/DEMO_SCRIPT.md` |
| Updated AI-use record | `docs/AI_USE.md` |

**Do not recreate or repeat this research, rewrite the demo, or reopen completed tasks simply because SOUL.MD was added.** The coordinator still needs to review and integrate the branch; delivered work is distinct from a merge or a working PWA. This inspection confirms the files and recorded evidence, not an independent revalidation of every external source.

Keep the existing explicit limitations: null/unavailable map positions, unknown dates where appropriate, unavailable terrain/calibration, and pending UI/install/offline behavior. Preserve `imageRef: "hirise-mro-pia26306-boxwork-2048x1042-v1"` unless a coordinated data migration changes it.

### Handoff now

1. Preserve your completed branch. Give the coordinator commit `8a947a4` and the delivered files for review; do not reset or duplicate them.
2. Address a concrete integration finding only if one is identified. A request to update from `main` must preserve your branch work; do not overwrite the completed science files.
3. Explain to Enzo which science records are contextual and unlocated. Existing evidence and demo content can be reused in the UI and presentation.

### Separate next phase — after handoff

A usability protocol in `docs/USABILITY.md` is **new follow-up work**, not an unfinished part of your previous assignment. When this next phase begins, help the coordinator prepare three outside-user tasks: draw a route, explain whether distance/slope are known, and save/recover a note. The coordinator conducts the sessions, Longla supports QA, and you record actual anonymized outcomes. Mark unrun sessions pending; do not invent results or contact participants through tools.

Keep the current mission and scientific guidance below as standing reference. It is not an instruction to repeat completed work.

## Your mission

Make every scientific claim traceable and prepare clear presentation material. Collect three meaningful Curiosity observations relevant to the selected Gale Crater region without inventing precise locations or measurements.

Read [the team allocation](../../TEAM_TASKS.md). The original brief predates the Angular foundation and the reviewed science branch. Inspect actual branch contents before editing; scientific assertions still require source verification.

## Deliverables and ownership

- Three sourced science records for the map and science panel.
- Geological map coverage and legend notes.
- A reference list and AI-use record, proposed under `docs/`.
- An English project summary and concise demo/slide text.
- An evidence audit and user-facing science descriptions.
- The usability protocol and factual observation record in `docs/USABILITY.md`, coordinated with the integrator.

Willy displays your markers. Gaddielle validates dataset coverage and coordinates with you. Enzo presents the source information. The coordinator integrates records and confirms submission readiness.

## Original workflow reference — completed work is not reassigned

1. Confirm the selected region and distinguish exact AOI evidence from broad regional context.
2. Check an actual USGS/NASA geological map for relevant coverage, scale and legend. Record if no suitable map is found.
3. Find primary Curiosity observation records using authoritative mission/instrument archives or source pages.
4. Open each source and write a short finding in plain language. Separate observation from interpretation.
5. Record instrument, observation date, source URL, credit and coverage limitations. Do not guess a sol, coordinate or measurement.
6. Give Willy three records in the coordinator's agreed schema. If location is unverified, keep coordinates unavailable and label any illustrative display position explicitly.
7. Keep references and AI-use notes current as assets and code libraries are added.
8. Draft the project summary and demo story using only implemented behavior and verified data.

## Suggested science-record fields

| Field | Requirement |
| --- | --- |
| ID and title | Stable identifier and readable name |
| Finding | Short statement with measured/derived/interpreted status |
| Mission and instrument | Verified source attribution |
| Observation date | Verified date or unavailable |
| Location | Verified coordinates and CRS, or unavailable |
| Display position | Explicitly distinguish illustrative positions from measured locations |
| Source and credit | Primary HTTPS link and required attribution |
| Limitations | Coverage, uncertainty and relevance to the AOI |

## Scientific boundaries

- Ancient-water evidence does not establish current liquid water.
- A regional study does not establish an instrument measurement at a demonstration marker.
- Missing hazard information does not prove route safety.
- Do not claim topography or chemistry coverage that the supplied files do not support.
- Treat AI-proposed product IDs, dates and citations as unverified until checked against the real source.

## Presentation tasks

- Draft a 50–200 word English summary, subject to the current official form's requirements.
- Explain the mission flow: target, route, confidence information, observation and offline reopening.
- Credit NASA resources, other datasets, code libraries, images and text actually used.
- Record which code/content was AI-assisted and how the team reviewed it.
- Verify competition rules and deadlines against official pages; the planning PDF is not independent confirmation.
- Coordinate one concise demo with the coordinator and label incomplete 3D/VR honestly.

## Checks and completion

Open every source link; compare each record to its source; check that marker labels match location verification; inspect references for missing credits. You are done when the three records are usable, geological coverage is documented, and presentation claims match the integrated prototype. Hand off data files, links, credits and unresolved scientific questions.

## Copy-paste coding-agent prompt

```text
You are Emmanuelle's science/provenance assistant for MARSWALK.
Read SOUL.MD, TEAM_TASKS.md, docs/team/EMMA.md and
docs/team/CODING_AGENTS.md. The previous science assignment is completed
on feature/emma-science-provenance at commit 8a947a4.

1. Inspect Git status and preserve all local work. Do not reset, recreate,
   or repeat the completed evidence audit, record corrections, summary,
   references, AI-use record or 60-second internal demo script.
2. Confirm the completed files are available for coordinator review and
   integration. Report the branch/commit and existing limitations. Do not
   equate delivered files with a completed installed offline PWA.
3. Keep the agreed imageRef and null/unavailable positions. Reuse the
   existing source audit; update a specific claim only for a concrete new
   evidence or integration issue, not because the charter was added.
4. Finish any small slice already in progress before taking on new work.
   Updating from main must preserve branch work; never overwrite the
   completed data to match main's still-pending integration state.
5. After handoff, the separate next phase is a usability protocol in
   docs/USABILITY.md, if not already present. Three outside users attempt
   route drawing, explanation of known/unknown distance and slope, and
   note recovery. Coordinator conducts sessions; Longla supports QA.
   Prepare the protocol first and label results pending until observed.
   Record only real anonymized outcomes, failures and changes to retest.
6. Present near-term science-learning/rehearsal use cases and future
   astronaut support honestly. Existing demo pacing is internal, not an
   official submission requirement. Reuse delivered science descriptions
   to help Enzo distinguish context records from geolocated markers.

Report existing completed work, any concrete integration issue and only
new follow-up changes. The prior branch assignment permits pushing your
own feature branch; no main merge, deployment, submission or messaging
without applicable authorization. Follow learner checkpoints only for
new substantive work; do not restart a completed lesson.
```
