# Out-and-back survival planning scenario

Coordinator took over Enzo Agent 2's survival-budget implementation at the user's request while teammates were unavailable. New standalone component in src/app/survival-budget is mounted in Route Planner after route controls. Takou/Charles styling ownership is untouched.

## User workflow

1. Draw start, destination and optional waypoints.
2. Open Route Planner and enter walking speed (km/h), available excursion minutes, task minutes and protected reserve minutes. All fields start blank. Use illustrative example is explicitly synthetic: 1 km/h, 120 available minutes, 20 task minutes, 30 reserve minutes.
3. Review round-trip distance/travel, travel plus task time, margin after reserve and maximum one-way distance under those assumptions. A deficit says exceeds entered time budget. It never grants clearance or a safety classification.
4. Save scenario assumptions separately. Save Route and Notebook continue using their existing mission storage. Download survival brief produces readable TXT with assumptions, current route, derived values, image identity/source, timestamp and limitations. Use Mission Transfer for importable mission JSON.
5. Prepare offline while connected. Reopening restores saved route/observations; opening Planner restores saved assumptions tied to this image.

## Formula and boundaries

The drawn route is the outward path, including waypoints; assume the exact same path back. Round-trip travel minutes = 2 * planar meters / (speed km/h * 1000) * 60. Margin = available - tasks - reserve - round-trip travel. Outward distance budget = max(0, (available - tasks - reserve)/2 * speed * 1000/60).

Speed and available time must be finite and positive; tasks/reserve finite and nonnegative. Missing endpoints/calibration, missing/invalid inputs or arithmetic overflow mean unavailable. Derived zero distance remains valid. No live timer, automatic route optimization, obstacle clearance, oxygen model, terrain speed correction, verified slope, operational suit endurance, radiation or current route weather is inferred. Pre-departure checks direct users to verify life support, communications, return access and hazards independently. AI relief is not a terrain source.

## Persistence

Assumptions use a separate image-specific marswalk:survival-budget:v1:<imageRef> key and require an explicit save. Invalid saved bytes are preserved and protected from replacement. Storage errors retain in-memory assumptions and offer a downloaded brief. Route, observations, mission import schema and science contracts are unchanged. Changing route points updates the estimate reactively. The brief is a snapshot; it does not alter or save the mission and cannot be imported as mission JSON.

## Verification

266 Angular tests across 28 files pass; production build passes. Fourteen new tests cover exact arithmetic, reserve/zero/boundary/deficit, missing/nonfinite/overflow inputs, reactive distance, persistence/recreation, corrupt-record protection, storage failure, brief content and empty-field handling.

Production browser check at 390px with touch emulation: draw real start/waypoint/destination, compare displayed formula outputs to exported mission distance, exercise unavailable and deficit states, download TXT, save assumptions/route/note, prepare full pack, terminate browser and restart disconnected. Exact route and observations recover automatically; assumptions restore when Planner opens; no horizontal page overflow. This is not physical phone certification. Existing shell stylesheet and Leaflet CommonJS build warnings remain; budgets were not increased. Full offline pack remains approximately 9.7 MB including AI relief.

## Published acceptance

Runtime ecc3eb5 deployed at https://marswalk-review-boys-band.vercel.app/ (unique https://marswalk-miv7jezfe-boys-band.vercel.app/, deployment dpl_6k7j58FfmMZ2t32ejXZELeaqCWrH). Anonymous HTTPS checks confirm all 20 assets match local hashes; pack bef063b5d670a97b2ebe64f2049905c57e9c4b41da16625c7c9dbbba626ecb02, 9,710,403 bytes. On this stable public origin the full phone-size route/arithmetic/deficit/download/save/offline process-restart recovery scenario passes. Production alias marswalk-jet was not promoted. Existing installations should save/export and use Check for updates / Prepare & apply update, then prepare the new pack before disconnecting.
