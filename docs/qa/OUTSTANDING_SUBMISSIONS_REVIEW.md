# Outstanding submissions — integration decisions

Reviewed against current MARSWALK, 15 November 2026. Exact teammate commits are retained below. Local combined acceptance is distinct from source provenance, current deployment and physical device acceptance.

| Submission | Decision | Integration / evidence |
| --- | --- | --- |
| Willy 8fbc341, feature/willy-map-release | Accepted with coordinator UI adaptation | Cherry-picked e97b2d9. Keyboard map-center placement with image bounds/readiness/inspect guards, active drawing mode, empty-marker explanation and geometry readout. Coordinator keeps coordinate details collapsed to preserve the cleaner default view. Calibrated v2 image retained. |
| Royce/Longla 334bc7f, feature/longla-3d (also topography-improvement) | Exact branch rejected | Unmodified archive compiled with current installed dependencies fails with numerous NG5002 malformed @if/@else/closing tags and TS2352 mock cast at spec line 152. The branch is not a measured-topography delivery. Its older core auto-load must not replace guarded current persistence. |
| Notebook readiness intent | Coordinator fix accepted independently | Current native form/markup retained; computed canSubmit disables saving until ready, onSubmit refuses pending/unavailable metadata and preserves draft. Added real HTTP-transition/missing-image regression cases. Existing reversible attachment behavior retained. This is not a merge or certification of Royce's branch. |
| REMS 99dc2d5, feature/enzo-atmospheric-observations | Accepted as archived, reproducible source delivery | Cherry-picked 1a59251. All six supplied product-file byte counts/SHA-256 values and label/field checks pass. Four Node tests pass; extractor --check regenerates 21-column, 33-row sample exactly with timestamp-matched ADR positions. Sources remain in Git outside public and excluded from Vercel upload. Runtime environmental excerpt unchanged. |
| Geology 5cef4d7, feature/usgs-sim3292-geology-context | Accepted as research/reference artifacts with limits | Cherry-picked aefaec4. Six isolated tests and artifact verification pass: 6 features, enclosing coarse Htu unit, committed GeoJSON hash 09de70cd83f9183c222126a0430b5cc302139079b8a9972384f6bb014bb8922d. Source GIS archive is not retained here; full source regeneration/external provenance was not independently repeated. No new local geology/hazard overlay. |
| Takou/Charles visual branch reported 2af5fed | Still unavailable from this environment | Public fork advertises only main 7798074 and QA 794c245. Branch fetch fails; full SHA fetch reports not our ref; web/raw commit requests return 404. No styling reconstructed or falsely integrated. Await reachable source or exact patches. |

## Scientific acceptance boundaries

REMS retained readings are finite and positive; timestamps increase; pressure flags are 31 rows of 11 and 2 rows of 10. Temperature confidence strings vary and are preserved verbatim. No confidence threshold was applied: these are source-record samples, not qualified route-wide weather. ADR X/Y/Z are MSL_TOPO local-frame coordinates, not verified map pixels or latitude/longitude. Burst/gap structure remains; no interpolated conditions or forecast is supplied. Contributor-supplied source identity and official URLs are recorded; this review validates local bytes/labels/extraction, not a new independent download from NASA. No new runtime environmental measurements were admitted.

SIM3292 is global-scale geology. Its derived regional context cannot establish local outcrop/obstacle boundaries inside the active 512 m crop, real slope, safe terrain or rover-target alignment. Passing internal artifact checks is not independent confirmation of every source/GIS claim. Its reference package is retained for transparent further review, not rendered as local scientific certainty.

Raw archives do not enter public/data, the runtime image/mission contracts or offline-pack inventory. Existing historical runtime data retains limited-review status. No AI mesh is used as a DEM.

## Combined checks

308 Angular tests (29 files), production build, 60 Python tests, 4 REMS Node tests and 11 worker tests pass. Isolated geology checks: 6/6 and artifact verifier pass. Isolated Royce branch: fails compilation before tests.

390px touch-emulated production browser: keyboard placement via Enter, coordinate bounds, real start/waypoint/destination drawing, Reset/Focus route preservation, reversible Notebook attachment, source disclosures, bounded science comparison, scenario arithmetic/download, exact route/note/objective/declaration/assumption recovery after full process restart offline and no horizontal page overflow pass. Physical phone acceptance is pending.

Build warnings remain the prior shell stylesheet warning and Leaflet CommonJS optimization notice; budgets are unchanged. Combined offline pack is about 9.74 MB with 20 assets and includes uploaded relief; raw data bundles are excluded.

## Public candidate acceptance

Runtime 828fb35 at https://marswalk-review-boys-band.vercel.app/; unique deployment https://marswalk-2t995p660-boys-band.vercel.app/ (dpl_9mYU2Y81DvGTAHb2gCFnzZxn7BHU). Anonymous HTTP checks verify all 20 asset hashes and 404 for the raw REMS table URL; pack f09d91208dbb8dc278678cb6e22525590b2b58fb3530d60a332982d2dc7a90d6, 9,738,193 bytes. On this public origin the keyboard map-center placement, Reset/Focus preservation, reversible note attachment, source/comparison and complete mission/brief/scenario/full-process offline recovery checks pass at 390px. Production alias unchanged. Physical-device tests remain pending; save/export before applying a PWA update.
