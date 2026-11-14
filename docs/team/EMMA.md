# Emma — Science, Provenance and Presentation

## Current follow-up — scientific evidence and PWA demo

**Emma uses he/him pronouns.** Keep the stable filename `docs/team/EMMA.md` and branch `feature/emma-science-provenance`.

**Latest status:** the user reports the presentation task below completed. Do not repeat it. The latest published commit inspected here is `b0640d9` (science/protocol now integrated); preserve any newer local presentation work and provide its published commit for review. Actual participant sessions remain pending. The task specification below is retained as a handoff checklist.

Read [SOUL.MD](../../SOUL.MD), [the team allocation](../../TEAM_TASKS.md) and [the shared contract](CODING_AGENTS.md). Preserve completed work and any small slice already underway; the new task below builds on it.

### Completed work — do not repeat

| Delivered work | Commit / branch files |
| --- | --- |
| Science records, corrected citations, evidence audit, accurate PWA status, references, AI-use record and internal demo script | `8a947a4`; `public/data/markers.json`, `docs/SCIENCE_EVIDENCE.md`, `docs/SCIENCE.md`, `docs/REFERENCES.md`, `docs/AI_USE.md`, `docs/DEMO_SCRIPT.md` |
| Three-user usability protocol and contextual-record handoff to Enzo | `b0640d9`; `docs/USABILITY.md`, `docs/SCIENCE.md` |

The usability protocol is delivered. **Actual user sessions remain pending** until the coordinator's integrated PWA is ready. Neither a delivered document nor a branch inspection establishes a working installed offline PWA. Do not recreate the audit, rewrite the existing demo or prepare a second usability protocol.

### New task — judges and presentation handoff

Prepare the following now while application integration continues:

1. **`docs/PRESENTATION.md`:** create an internal outline of at most seven slides. This is the team's chosen format, not a verified official submission limit. Cover one realistic science-learning or mission-rehearsal user story; the communication/evidence problem; a fair comparison with existing tools; the actual sourced datasets; the Exploration Confidence feature; the mission/demo evidence; and limitations/next steps.
2. For each slide, include its main message, the supporting source or implementation reference, the reviewed revision, the feature status and the artifact still needed. Use explicit placeholders for screenshots, installed-device/offline evidence and user-test outcomes that are not yet available. Do not invent customers, partnerships, successful tests or images of completed features.
3. Reuse or link the existing project summary in `docs/SCIENCE.md` and internal rehearsal in `docs/DEMO_SCRIPT.md`. Do not repeat completed research or rewrite those files merely to create new work. Their timing and format remain internal choices until official requirements are checked.
4. **`docs/JUDGES_QA.md`:** write short factual answers to: Who can use MARSWALK now? What does it add alongside Mars Trek/JMARS? Which NASA resources and other sources are actually used? What evidence supports the science? Why are metric distance, slope and some positions unavailable? What currently works versus still needs integration, installation and offline testing? How was AI used and reviewed?
5. Keep claims tied to evidence. Future astronaut support is a long-term vision. Do not claim existing tools lack route/terrain functions, that the route is safe, or that installation/offline reopening works before a verified demonstration. Mention only resources actually used; planned Mars Trek integration is not demonstrated use.
6. Reuse `docs/USABILITY.md` when real sessions occur. The coordinator arranges/conducts them, Longla supports QA, and you record actual anonymized outcomes. Do not contact participants through tools or manufacture results to fill a slide.

### Ownership, checks and handoff

Own the two new presentation documents. Keep scientific records, shared models and teammate code unchanged unless a concrete evidence/integration issue requires a coordinated correction. Preserve the active imageRef and null/unavailable positions.

Check every factual statement against the existing evidence, current feature status and actual revision. Verify local links and placeholders, and distinguish planned, implemented and tested behavior. Give the coordinator the two documents and a list of the missing demonstration artifacts. **Done means the presentation outline and Q&A are reviewable, traceable and honest about readiness.**

Continue on your existing feature branch, preserve local work, and update from `main` without overwriting delivered science files. Commit and push only `feature/emma-science-provenance`; this assignment authorizes that feature-branch push. No merge to `main`, deployment, submission or messaging to others is included.

The standing scientific guidance below remains reference, not an instruction to reopen completed assignments.

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

## Standing presentation guidance — reuse completed material

- Reuse the delivered English summary; adapt it only when required by verified submission fields or changed implementation status.
- Explain the mission flow: target, route, confidence information, observation and offline reopening.
- Credit NASA resources, other datasets, code libraries, images and text actually used.
- Record which code/content was AI-assisted and how the team reviewed it.
- Verify competition rules and deadlines against official pages; the planning PDF is not independent confirmation.
- Coordinate one concise demo with the coordinator and label incomplete 3D/VR honestly.

## Original science acceptance reference — already delivered

Open every source link; compare each record to its source; check that marker labels match location verification; inspect references for missing credits. You are done when the three records are usable, geological coverage is documented, and presentation claims match the integrated prototype. Hand off data files, links, credits and unresolved scientific questions.

## Copy-paste coding-agent prompt

```text
The user reports this presentation assignment completed. First inspect and
preserve existing results; hand off the published commit. Do not recreate
completed files. The checklist below applies only to genuinely missing work.

You are Emma's science/presentation assistant for MARSWALK. He uses he/him
pronouns. Read SOUL.MD, TEAM_TASKS.md, docs/team/EMMA.md and
docs/team/CODING_AGENTS.md.

His earlier science/evidence/demo work is delivered at 8a947a4. His
usability protocol and Enzo contextual-record handoff are delivered at
b0640d9. Do not repeat those assignments. Actual user sessions remain
pending until the integrated PWA is ready.

1. Inspect Git status and current branch. Continue on
   feature/emma-science-provenance, preserve all work and finish any
   current small slice. Update from main without overwriting completed
   science documents or records. Do not create another science branch.
2. Create docs/PRESENTATION.md: an internal outline of at most seven
   slides covering a real learning/rehearsal user story, communication
   and evidence problem, fair existing-tool comparison, sourced data,
   Exploration Confidence, mission/demo proof, and limits/next steps.
   This is a team format choice, not a verified official submission rule.
3. For every slide record the message, supporting evidence/file link,
   reviewed revision, feature status and artifact needed. Leave clear
   pending placeholders for unavailable screenshots, installed-device
   offline results and user-test outcomes. Invent no demonstrations,
   participants, customers, partnerships or successful tests.
4. Reuse/link the existing summary, evidence audit and 60-second internal
   demo script. Do not redo research or rewrite completed deliverables
   merely to populate the new outline.
5. Create docs/JUDGES_QA.md with concise factual answers about near-term
   users versus future astronaut vision; contribution alongside Mars Trek
   and JMARS without false absence claims; actual NASA/other sources;
   scientific evidence and missing scale/terrain/positions; current
   implementation versus pending UI/PWA installation/offline behavior;
   and AI assistance/review. Claim only resources and capabilities used.
6. Keep science records and shared models unchanged unless a concrete
   coordinated evidence/integration correction is needed. Preserve
   imageRef and unavailable positions. Do not add another feature or
   worker. Existing docs/USABILITY.md can record actual sessions later:
   coordinator conducts, Longla supports QA, you record real anonymized
   observations. Do not recreate its protocol or contact participants.
7. Validate claims against existing evidence and the actual revision,
   check links/placeholders, and report the two documents, missing demo
   artifacts and unresolved questions. No application tests are required
   for this documentation-only slice; do not invent test results.
8. Commit and push your feature branch for review. This assignment
   authorizes that branch push only, not main merge, deployment,
   submission or messaging. Follow learner checkpoints for genuinely
   new substantive work, without restarting completed lessons.
```
