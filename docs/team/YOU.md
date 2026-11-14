# YOU — Project Coordinator and Integrator

## Your mission

Connect the six contributions into one working Angular mission flow. Own shared contracts, route assessment, integration and offline operation. YOU is the coordinator label retained from the latest project context; the original PDF called this role Dinang.

Read [the team allocation](../../TEAM_TASKS.md). This checkout contained only documentation when these briefs were created. The attached context describes another repository and historical implementation; verify actual code and branches instead of assuming that application exists here.

## Deliverables and ownership

- A runnable Angular application and accurate README commands.
- Shared models/state, proposed under `src/app/core/`.
- Exploration Confidence Panel and pure assessment helpers.
- Validated local persistence/export contracts coordinated with Enzo.
- Tested offline asset preparation after the core workflow works.
- Reviewed integration, references and a complete demo.

## Confirm the team split

| Teammate | Handoff to you |
| --- | --- |
| Willy | Angular map, map events and layer/marker display |
| Gaddielle | Verified imagery/terrain, manifest and coordinate limitations |
| Emma | Science records, provenance, references and presentation copy |
| Enzo | Layout, route controls, notebook and persistence UI |
| Longla | Labeled 3D rehearsal and optional tested VR |

## Establish shared contracts first

1. Inspect repository state and preserve existing work. Angular is the user's selected framework.
2. If creating the application is the assigned coding task, establish a small standalone Angular structure and reproducible package scripts.
3. Agree on one active coordinate system, image/product reference, point shape and route ordering.
4. Define marker verification status, layer coverage, source metadata and unavailable values.
5. Keep mission state in one shared service; components read state and invoke actions.
6. Define versioned route/note records and export fields. Never label pixel positions as geographic GeoJSON.
7. Publish the contract to teammates before they build integrations.

## Assessment implementation

- Show supported route information, coverage gaps and unavailable assessments together.
- Distinguish measured, derived, interpreted and simulated values.
- For calibrated image pixels, require independently verified positive scale for the exact prepared raster before displaying metric planar distance.
- For verified geographic coordinates, use a documented Mars-specific calculation and coordinate convention.
- Neither calibration nor a route line establishes terrain distance, slope or safety.
- Require aligned elevation data, units and NoData handling for any terrain-derived result.
- Keep unknown coverage unknown; never display a blanket SAFE status.
- If terrain is unavailable, activate the **visual review only** fallback.

## Integration sequence

1. Get one image and Angular shell running.
2. Integrate Willy's map and Enzo's interaction controls.
3. Connect Emma's science records and Gaddielle's metadata.
4. Add assessment messages and validated local note/route handling.
5. Add export and exercise one complete mission.
6. Integrate Longla's prototype without blocking the core map.
7. Add offline preparation and verify production behavior.

Review small feature changes, resolve contract conflicts centrally and keep a runnable integration branch. Do not claim historical test results as validation of new changes.

## Offline and persistence checks

- Cache actual production assets, local data and application entry points using the chosen supported approach.
- Show readiness only after required assets are verified in cache.
- Load once online, wait for readiness, then perform a full offline reload and repeat the essential mission flow.
- Keep external source-link connectivity limitations visible.
- Validate saved records and handle corruption, unavailable storage and schema/data-reference changes.
- Verify mission export contains the active data reference, route, notes, provenance and uncertainty.

## Release checklist

- Run the actual project build, meaningful unit checks and an integrated browser smoke check.
- Demonstrate target selection, route drawing, missing-data warnings, a saved note, export and offline reopening.
- Verify sources and coverage claims with Emma and Gaddielle.
- Confirm no data placeholders or illustrative positions are presented as measurements.
- Check the public demo without login if deployment is part of the release task.
- Verify current official submission requirements and deadline; prepare references and AI-use disclosure.
- Freeze features Sunday at 12:00 local time according to the team plan, then prioritize fixes and presentation.

## Completion

Your work is complete when the integrated mission is demonstrable and its limitations are explicit. Report which commands and user flows passed, which remain unavailable, and the exact deployed/reviewed revision. Help each teammate explain their contribution and data flow; do not claim understanding or test outcomes on their behalf.

## Copy-paste coding-agent prompt

Paste the following into your coding-agent session when starting your assigned work. Read the [shared contract](CODING_AGENTS.md) with it.

```text
You are the coordinator's coding tutor and implementation agent.
Read docs/team/YOU.md, docs/team/CODING_AGENTS.md, every personal brief
and TEAM_TASKS.md. Implement the shared foundation before feature agents
integrate. Do not assume the historical application in the pasted context
exists in this repository.

1. Inspect Git status, files and available Node/npm. Preserve all work.
   If still documentation-only, bootstrap ONE standalone Angular TypeScript
   app at the repository root, preserving these docs. Use a compatible
   supported Angular/Node combination and commit the generated lockfile.
   Existing prepared CLI 22.2.7 is compatible with Node 24.22.1; inspect
   versions before using it. Do not copy the separate validation demo.
   npm_config_cache=/workspace/.npm-cache is available in this environment.
2. Implement models.ts and MissionService exactly as specified in
   CODING_AGENTS.md before wiring features. Add pure route helpers and
   versioned storage helpers under src/app/core/. Keep public signals
   readonly and writable signals private. Document any necessary API change.
3. Load manifest.json and markers.json once using base-aware local URLs.
   Validate schemas, finite dimensions, paths, references, bounds and HTTPS
   citations. Missing files produce unavailable/error states, not fake data.
   Do not block app startup on absent imagery. Keep test fixtures separate.
4. Implement route modes, immutable snapshot undo, clear and load semantics.
   Reject invalid points. Derive assessment with endpoint/calibration gates;
   terrain remains unavailable. Add meaningful unit tests for these rules.
5. Implement validated save/load and observation persistence with version
   and imageRef. Return errors instead of swallowing storage failures.
   Export versioned JSON with provenance and limitations; no pixel GeoJSON.
6. Assemble Willy's MapComponent, Enzo's panels/notebook and Longla's
   optional viewer as they arrive. Add agreed Leaflet/Three.js dependencies
   centrally. Do not overwrite teammate-owned implementation files.
7. Document real install/start/test/build commands. Ensure tests run
   noninteractively and report actual counts. Test the integrated mission
   in a browser with valid data when available and with data unavailable.
8. Add production-only offline caching after the core works. Verify the
   complete required cache before indicating readiness. Test full offline
   reload, route/note persistence and export; external sources may need
   network. Handle cache versions and deployment base paths deliberately.
9. Update README with current behavior, data gaps, contribution ownership
   and reproducible commands. Keep verified facts separate from roadmap.

Teach one small slice at a time using the learner checkpoint. Report changed
files, actual command results and outstanding dependencies. No deployment,
main merge or push unless explicitly authorized for this implementation.
```
