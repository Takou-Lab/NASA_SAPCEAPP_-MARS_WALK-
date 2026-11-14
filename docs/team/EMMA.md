# Emmanuelle — Science, Provenance and Presentation

## Current follow-up — scientific evidence and PWA demo

**Name and branch:** Emmanuelle is listed as Emma in the existing filename and branch. Continue on `feature/emma-science-provenance`; keep `docs/team/EMMA.md` as the stable brief path.

The latest reviewed science branch contains three records and the corrected image reference. Those records and Gaddielle's manifest pass the shared validator together. They have not yet been merged into `main`. The Angular foundation is on `main`; PWA installation, offline caching and the feature UI are still pending. Preserve the completed work rather than recreating it.

Your next deliverables are:

1. **Evidence audit:** verify the specific source for each boxwork, Vera Rubin Ridge and sulfate-transition claim. A mission homepage or proposed-route illustration does not by itself establish mineral measurements or instrument attribution. Replace unsuitable citations or narrow the claim. Record blocked access honestly; do not mark an inaccessible source as checked.
2. **`docs/SCIENCE_EVIDENCE.md`:** one row per record with ID, supported claim, source URL, supporting passage/section, instrument evidence, observation-date evidence and remaining gaps. Separate observation, derivation and interpretation.
3. **Corrected records:** preserve `imageRef: "hirise-mro-pia26306-boxwork-2048x1042-v1"`, `position: null` and `positionStatus: "unavailable"` until location evidence is independently verified. Remove unsupported precision instead of inventing measurements or coordinates.
4. **Accurate summary:** describe an Angular PWA under development. The shared service already implements localStorage persistence and JSON export; the interface integration, installation and verified offline reopening remain pending. Do not describe the current release as offline-capable before those checks pass.
5. **`docs/DEMO_SCRIPT.md`:** a 60-second internal rehearsal covering imagery, science context, route drawing, uncertainty, a saved note, mission export and offline reopening. Mark every step working, pending or requiring verification. This duration is a rehearsal choice, not a claim about the official submission limit.
6. **References and handoff:** update `docs/REFERENCES.md` and `docs/AI_USE.md`, validate the data contract and report source access limits. Commit and push your feature branch for review; do not merge into `main` or deploy.

**Done when:** every retained scientific claim has traceable support or an explicit limitation, the JSON remains compatible with the image contract, and demo wording matches implemented behavior.

The standing guidance below remains applicable; the follow-up above is your current priority.

## Your mission

Make every scientific claim traceable and prepare clear presentation material. Collect three meaningful Curiosity observations relevant to the selected Gale Crater region without inventing precise locations or measurements.

Read [the team allocation](../../TEAM_TASKS.md). The original brief predates the Angular foundation and the reviewed science branch. Inspect actual branch contents before editing; scientific assertions still require source verification.

## Deliverables and ownership

- Three sourced science records for the map and science panel.
- Geological map coverage and legend notes.
- A reference list and AI-use record, proposed under `docs/`.
- An English project summary and concise demo/slide text.

Willy displays your markers. Gaddielle validates dataset coverage and coordinates with you. Enzo presents the source information. The coordinator integrates records and confirms submission readiness.

## Work in this order

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

Paste the following into your coding-agent session for this follow-up. Read the [shared contract](CODING_AGENTS.md) with it.

```text
You are Emmanuelle's science/provenance assistant for MARSWALK.
The repository uses EMMA.md and feature/emma-science-provenance for her work.
Read docs/team/EMMA.md, docs/team/CODING_AGENTS.md and TEAM_TASKS.md.
Your work is scientific evidence, structured data and presentation content,
not another Angular feature or service worker.

1. Inspect Git status and preserve all local changes. Continue on
   feature/emma-science-provenance. Fetch and integrate the latest main
   without resetting or overwriting completed science work. The current
   science records live on this feature branch, not yet on main.
2. Own public/data/markers.json, docs/SCIENCE.md, docs/REFERENCES.md,
   docs/AI_USE.md, docs/SCIENCE_EVIDENCE.md and docs/DEMO_SCRIPT.md.
   Do not alter shared Angular models, application logic or Gaddielle's assets.
3. Verify the exact supporting sources for the three existing records:
   - Mount Sharp boxwork and ancient-groundwater interpretation.
   - Vera Rubin Ridge hematite/calcium-sulfate observations and instruments.
   - Clay-to-sulfate transition and associated evidence/instruments.
   A general mission homepage or proposed-route image is insufficient for
   a detailed measurement claim unless it actually documents that claim.
   Replace unsuitable citations with specific authoritative records,
   articles or research sources. Narrow/remove unsupported precision.
   Record inaccessible sources and what remains unverified; never invent
   evidence, dates, coordinates or source-access results.
4. Create docs/SCIENCE_EVIDENCE.md with one row per record: ID, supported
   claim, source URL, supporting passage/section, instrument evidence,
   observation-date evidence and remaining gaps. Distinguish observation,
   derivation and interpretation, including within the finding text.
5. Preserve imageRef hirise-mro-pia26306-boxwork-2048x1042-v1 on all records.
   Keep position:null and positionStatus:unavailable until independently
   verified. Missing dates/instruments remain null. Keep valid records
   compatible with ScienceMarker and the active image contract.
6. Update the English project summary to describe an installable Angular
   PWA under development. Distinguish implemented shared-service localStorage
   persistence/JSON export from pending UI integration, installation and
   offline caching. Do not call the current app offline-capable until tested.
7. Create docs/DEMO_SCRIPT.md as a 60-second internal rehearsal covering
   imagery, science context, route drawing, uncertainty, a saved note,
   mission export and offline reopening. Label each step working, pending
   or requiring verification. Do not invent successful demonstrations or
   treat this duration as an official submission requirement.
8. Update references and the honest AI-use record. Validate JSON syntax,
   required schema fields, unique IDs, the exact imageRef and unavailable
   positions. If Gaddielle's manifest is absent on your branch, compare
   against her delivered contract read-only rather than recreating her
   files. Run relevant actual checks and report what executed.
9. Commit and push only feature/emma-science-provenance for review; this
   assignment authorizes that feature-branch push. Do not merge into main,
   deploy, submit the project or contact others through messaging tools.

Report changed files, sources actually checked, supported findings, check
results, remaining access/evidence gaps and the pushed commit.
```
