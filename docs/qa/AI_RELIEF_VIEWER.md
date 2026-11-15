# Uploaded Pixal3D model in the 3D section

15 November 2026. User supplied marswalk_crop_terrain.glb and identified Tencent ARC Pixal3D as its generator. Integrated as public/data/models/marswalk-ai-relief.glb (6,991,404 bytes; SHA-256 6c14752843fb5bd7f1a5d320eaf699c64a46825a390cdbfa1309ed3aac7ece84).

Open 3D Rehearsal, Open 3D viewer, then AI-generated relief and model slopes. The original flat mission view remains selectable. The relief supports orbit/pan/zoom, reset/top cameras and tap-to-inspect a triangle. Switching modes releases the previous GPU view. Model downloads are lazy until opening relief, or intentionally downloaded when preparing the full offline pack.

## Meaning of the numbers

The supplied model is treated as Y-up. For each triangle, compute its world-space cross-product normal; inclination to the model XZ plane is acos(abs(normal.y)/normal.length). Zero-area faces are excluded. Mean inclination is weighted by triangle area. Area and vertical extent are in model units only. No arbitrary scaling or vertical exaggeration is added.

Actual uploaded mesh: 203,522 nondegenerate triangles; mean inclination 47.5 degrees; maximum triangle inclination 84.2 degrees; height range 12.50 model units; footprint 200 by 200 model units; surface area 62,481.2 square model units. These are mathematical properties of this generated mesh, not estimates validated against the Martian ground. Sharp texture-driven artifacts can dominate them.

Pixal3D output has no verified elevation scale, DEM, geographic alignment or image-to-mesh transform. It cannot provide real slope, elevation, route ascent, terrain distance, hazard or safety. No route or science pins are projected onto the generated surface. Shared mission assessment and exports keep terrain unavailable. The calibrated 2D image remains the route-distance reference. Source attribution and this boundary are visible in the viewer. No inference, model weights or remote AI service runs in the PWA.

## Verification

247 Angular tests (26 files) and 11 service-worker tests; production build. Added mathematical checks for flat/45-degree/vertical/degenerate triangles and transformed geometry, plus load/error/late-callback/disposal behavior. Browser verification at 390px with touch emulation: real GLB/texture decoding, displayed metrics, triangle tap, camera controls, return to flat view and teardown; complete browser-process restart disconnected loads the model from the verified offline pack. Physical Android/iOS testing remains pending.

Full offline preparation now includes the 7 MB GLB and its lazy code, increasing the pack to approximately 9.7 MB. Existing Leaflet CommonJS and shell stylesheet warning remain; budgets were not raised. Production alias is unchanged; the stable public review URL is updated after deployment.
