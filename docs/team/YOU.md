# YOU — Project Coordinator and Integrator

**Continue existing work:** preserve your current branch and completed results. Finish or hand off the small slice already underway; apply newly added charter tasks afterward. Do not restart the earlier assignment. See [the transition rule](../../SOUL.MD#apply-this-charter-without-restarting-work).

## Current priority — one complete offline PWA mission

Read [SOUL.MD](../../SOUL.MD), [the shared contract](CODING_AGENTS.md) and [the team allocation](../../TEAM_TASKS.md). MARSWALK serves science learning, mission rehearsal and analogue-workflow research now; future astronaut support is a vision that still requires substantial validation.

The Angular foundation, shared models, MissionService and Leaflet dependencies already exist on `main`. The last recorded foundation check passed 15 tests, a production build and HTTP asset checks; headless browser rendering was not verified. Gaddielle's imagery and Emmanuelle's science records remain on their feature branches until reviewed integration. Inspect the actual revision before relying on this snapshot. Do not recreate the app or duplicate implemented localStorage/export logic.

Your immediate outcome is an installed PWA that can prepare essential mission assets, close, reopen offline, recover its mission, support route editing and observations, and export JSON with limitations. 3D/VR comes after this core acceptance check.

## Your mission and ownership

YOU is the coordinator label retained from the project context; the original PDF called this role Dinang. Own:

- Root application assembly, package declarations/lockfile and reproducible commands.
- `src/app/core/`, shared models, MissionService and pure assessment rules.
- PWA manifest, icons, service-worker/build configuration and readiness/update coordination.
- Integration of teammates' components, data and evidence into one workflow.
- Release verification, usability testing coordination and accurate status reporting.

Keep feature implementation with its named owner. Treat new installation/offline service APIs as additions to design and document centrally; they are not already available from MissionService.

## Team handoffs

| Teammate | What you integrate |
| --- | --- |
| Willy | Local-image map, route rendering, layer visibility and marker interactions |
| Gaddielle | Image manifest/assets, verified package inventory, provenance and coverage limitations |
| Emmanuelle / Emma | Supported science records, evidence audit, references and honest pitch/demo content |
| Enzo | Tablet workspace, route controls, evidence display, notebook and export UI |
| Longla | Independent device/offline QA and usability observations first; optional labeled 3D later |

## Integration order

1. Inspect Git state and preserve work. Review data branches, runtime schema compatibility and remaining citation/metadata limitations before merging under the user's authorized workflow.
2. Integrate regional imagery, sourced science context, Willy's map and Enzo's route controls. Unlocated science records remain accessible as list/context items rather than invented map positions.
3. Connect shared route save/load, notes and export. Do not create competing component storage.
4. Make Exploration Confidence visible throughout the workflow. Show source-backed data passports: source, credit, date/resolution when known, processing, verification and gaps.
5. Implement installability and production offline preparation, then verify closing and reopening the installed app without a network.
6. Conduct the outsider task check with Longla and Emmanuelle; fix the most common misunderstanding or failure.
7. Integrate optional 3D only if core readiness remains reliable. Keep VR optional.

## Exploration Confidence rules

- Use the actual mission state and supported data, never invented confidence percentages or a SAFE badge.
- Current regional imagery does not establish exact exploration-area coverage. Unverified metric scale means unavailable distance.
- The exact prepared raster needs independently verified positive calibration, source and method before planar distance is derived.
- Neither calibration nor route drawing enables elevation, slope, terrain distance or hazard clearance.
- Route-specific data-coverage claims require verified coverage geometry; do not imply analysis that does not exist.
- Keep unavailable terrain and unknown scientific positions explicit. Distinguish measured, derived, interpreted and simulated content.
- Maintain the **visual review only** fallback. A research rehearsal is not validated operational navigation.

## Required PWA implementation and acceptance

- Provide a valid web app manifest with name/short name, suitable icons including a maskable option where appropriate, start URL, scope and `display: standalone`. Verify deployment paths.
- Use HTTPS for deployed installation and service-worker operation; supported localhost development is acceptable for local checks.
- Choose a supported Angular-compatible production worker/caching approach. Cache the actual built shell, required local imagery, manifest and bundled science records. Do not cache archival originals merely because they are in the repository.
- Use Gaddielle's inventory/checksums for data integrity and define build/data versions. Readiness requires the complete expected asset set to be available and verified, not merely a registered worker or `navigator.onLine`.
- Expose connection status separately from offline-pack preparation/readiness. Specify proposed UI APIs with Enzo before implementation; avoid competing workers or cache owners.
- Handle failed preparation, insufficient storage, missing/corrupt data, updates and changed image references. Do not discard the last usable mission silently. Offer clear retry/update feedback; avoid forcing a reload over unsaved work.
- Verify a clean preparation and installation on the demonstration device, then disconnect, close the app, reopen from its installed icon, inspect imagery/science context, draw/edit the route, save/recover a note and export JSON.
- State that external citation links can require internet. Do not promise guaranteed browser storage durability; support mission export.

## Evidence and release checks

Run the actual frozen-lockfile install, meaningful tests, production build and integrated browser checks. Record the exact revision, device/browser, commands, outcomes and remaining gaps. Historical tests do not establish current PWA behavior.

Coordinate three people outside the implementation team to attempt drawing a proposed route, explaining whether distance/slope are known, and saving/recovering a note. Use anonymous observations, actual completion/errors and participant explanations. Longla records technical QA under `docs/qa/`; Emmanuelle maintains the usability summary. Mark planned or unavailable checks honestly. Fix observed issues and rerun the affected scenario.

Check official submission requirements and deadlines directly. Present one demonstrable mission and real test evidence; make fair comparisons with existing tools. Help teammates explain their data flow and contribution without claiming understanding on their behalf.

## Copy-paste coding-agent prompt

```text
You are the coordinator's coding tutor and implementation agent for MARSWALK.
Read SOUL.MD, docs/team/YOU.md, docs/team/CODING_AGENTS.md, TEAM_TASKS.md
and each teammate's current assignment.

1. Inspect Git status, branches, actual scripts and data. Preserve all work.
   Angular, models, MissionService and Leaflet already exist on main.
   Do not scaffold another app, duplicate storage/export or overwrite owners.
2. Review and integrate the data/evidence and feature contributions within
   the user's authorized workflow. Gaddielle's data and Emmanuelle's records
   are on feature branches until merged; schema validity is not scientific
   proof. Keep unlocated records in a science list, not fictional markers.
3. Assemble the map, route controls, notes and mission export. Use the
   existing readonly signals/actions. Expose supported data passports and
   honest Exploration Confidence: unavailable distance/calibration, terrain,
   slope and unverified coverage must remain visible. No SAFE label or score.
4. Implement the installable Angular PWA: web manifest/name/icons/start_url/
   scope/standalone behavior and a supported production worker strategy.
   Use HTTPS deployment and handle subpath URLs correctly.
5. Cache the built shell and essential local mission data. Coordinate with
   Gaddielle's inventory/checksums; version build/data and verify the full
   required cache before showing readiness. Worker registration and online
   status alone are insufficient. Design/document proposed readiness APIs
   with Enzo; they do not yet exist in the shared core contract.
6. Handle failed/incomplete preparation, cache/storage failures and updates
   without silently discarding usable data or unsaved work. Keep connectivity
   and offline readiness separate. External sources may require internet.
7. Run actual tests/build and verify installation on the target device.
   Prepare, disconnect, close, reopen from installed icon, inspect the image
   and science, edit a route, save/recover a note and export JSON. Record
   exact device/browser/revision and results; do not invent browser success.
8. Coordinate three outsider task checks with Longla and Emmanuelle. Record
   real completion, misunderstandings and failures; fix the largest issue.
   Keep QA and usability evidence anonymous and status-labeled.
9. Update README and release evidence to match working behavior. Verify
   official submission rules separately. Add optional 3D only after the
   complete offline mission is reliable; VR remains optional.

Teach one small slice at a time using the learner checkpoint. Report actual
commands, files, results and remaining blockers. No deployment, main merge,
push or messaging to others without the user's applicable authorization.
```
