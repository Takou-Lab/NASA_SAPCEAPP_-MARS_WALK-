# Longla — 3D Rehearsal and Optional VR

## Your mission

Create a small Three.js rehearsal view showing the same route and markers as the Angular map. This is a labeled prototype; VR is optional. You hold the 3D role called Royce in the original PDF, following the latest team naming used in the allocation.

Read [the team allocation](../../TEAM_TASKS.md). This repository contained documentation only when these briefs were written. No terrain model or implemented viewer is assumed to exist.

## Deliverables and ownership

- A viewer component, proposed under `src/app/viewer3d/`.
- Terrain/imagery rendering when validated aligned products are available.
- Route and marker rendering using shared mission records.
- Visible provenance, terrain limitations and vertical exaggeration.
- Optional WebXR entry and fixed viewpoints or teleport movement.

Gaddielle supplies terrain and imagery metadata. Willy supplies map-coordinate integration details. The coordinator owns shared contracts; do not invent a separate coordinate interpretation.

## Work in this order

1. Inspect existing code and learn scene, camera and renderer with one clearly labeled practice scene.
2. Integrate a canvas into Angular after its container exists. Handle resize and component cleanup.
3. Confirm the exact coordinate transform, terrain units, axis directions and origin with Gaddielle and Willy.
4. If verified terrain exists, create a height surface and align the corresponding imagery. Preserve NoData as missing rather than zero-height terrain.
5. Add the route and science markers using the agreed transform. Check known points against the 2D map.
6. Add simple orbit controls and useful fixed views. Keep the model small enough for the demonstration device.
7. Display **Prototype: 3D training view**, data source, coverage and vertical exaggeration.
8. Only after the viewer works, add Three.js WebXR support and test an actual supported runtime.

## Terrain and coordinate rules

- Never infer real elevation from image brightness.
- A visually plausible surface is not a measured DEM.
- Do not assume pixels are meters or geography is an Earth coordinate system.
- Keep horizontal/vertical units explicit and explain any exaggeration.
- Image crop/resize and terrain transforms must agree with the prepared-data reference.
- For unavailable terrain, use a flat imagery plane or clearly illustrative demonstration; do not report terrain measurements from it.

## Checks before handoff

- Route endpoints and markers agree with the 2D map at several known positions.
- Missing terrain regions remain visibly unavailable.
- Resizing and reopening the viewer work without duplicate render loops.
- Dispose of controls, geometry, materials, textures and renderer resources on teardown.
- The main Angular app still works when WebXR is unsupported.
- VR controls use fixed views or teleport; test headset/emulator behavior before claiming VR works.
- Record the device/browser and what was actually tested.

## Time limit and fallback

The plan's VR gate is Sunday at 12:00 local time. If VR is incomplete, keep the working 3D prototype and prepare a short screen recording. If no verified terrain is available, explicitly label the flat/illustrative fallback and its limitations.

## Completion and handoff

You are done when the rehearsal view shows shared routes and markers with clear data status. VR is a bonus. Send changed files, data/transform assumptions, tested runtime, performance observations and known limitations. Explain scene/camera/renderer and the route-to-3D conversion in your own words.

## Copy-paste coding-agent prompt

Paste the following into your coding-agent session when starting your assigned work. Read the [shared contract](CODING_AGENTS.md) with it.

```text
You are Longla's coding tutor and implementation agent for MARSWALK.
Read docs/team/LONGLA.md, docs/team/CODING_AGENTS.md and TEAM_TASKS.md.
Own src/app/viewer3d/ only. VR is optional; preserve the core map workflow.

1. Inspect real code and available data. If the shared Angular app/API is
   absent, report the dependency instead of creating a separate app.
2. Implement a standalone Viewer3dComponent. Ask the coordinator to add
   Three.js and required declarations through package files if needed.
3. Inject MissionService for image(), route() and markers(). Initialize
   renderer/camera/scene only after the view container exists.
4. The version 1 contract has no verified DEM input. Start with a flat
   imagery plane labeled No verified terrain; elevation unavailable.
   Map image pixels consistently: scene X=x-width/2, Y=0, Z=height/2-y.
   Align texture orientation and verify all four corners against the map.
   Place route/markers slightly above the plane to prevent z-fighting;
   this display offset is not elevation. Do not calculate terrain metrics.
5. Reuse shared route ordering. Filter markers by matching imageRef and
   available position; retain illustrative-position labels.
6. Add orbit controls and reset view. Label Prototype: 3D training view,
   show source/limitations, and describe the flat view explicitly.
7. If validated terrain arrives, ask the coordinator and Gaddielle for a
   versioned terrain contract and verified transform before implementation.
   Do not invent height data or interpret image brightness as elevation.
8. Add optional WebXR only after the base viewer works. Unsupported XR
   must leave the ordinary viewer usable. Use fixed views or teleport.
9. On destroy, stop animation, remove listeners/observers and dispose of
   controls, geometry, textures, materials and renderer resources.
10. Verify route alignment at corners/known points, resize, repeated opening,
    unsupported XR and actual build/relevant tests. Record XR runtime and
    outcome only if actually tested. Use a recording if VR misses the gate.

Follow the learner checkpoint in CODING_AGENTS.md. Report transforms,
files, checks and limitations. Do not push or merge without authorization.
```
