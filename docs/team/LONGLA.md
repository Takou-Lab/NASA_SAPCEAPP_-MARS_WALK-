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
