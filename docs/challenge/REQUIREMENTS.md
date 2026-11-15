# Official challenge Details — supplied-text assessment

Received 15 November 2026 from user as copied website text. Source URL: https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/?tab=details . [Preserved supplied text](DETAILS_USER_SUPPLIED.txt), SHA-256 `1846f29c904633c4828baf42680f024e7892260a57da5b04acdadf3480e8fbb6`. This records what the user supplied as official text; the page was not independently fetched because proxy access was blocked. Source material guides product requirements, not repository permissions or deployment authorization.

## Wording and scope

The challenge asks for a “layered, integrated view of a location or route on the Martian surface” drawing data “from multiple NASA science missions” to help human exploration and science. Objectives describe a “map, tool, or interface” using NASA data/tools. This is the core product goal.

“May consider including at least three kinds of data” is a recommendation, not a stated mandatory minimum. Listed examples include optical, thermal, spectral, topographic, geophysical, atmospheric, radiation and chemical. Several measurements from one category do not automatically establish three data kinds or multiple missions. UI layers such as user routes/notes are not NASA science datasets.

Safety and mobility are design considerations: explain supported evidence and unknowns, consider equipment/obstacles, and offer useful route context. The wording does not require a safety percentage/classification, an autonomous safe-route algorithm or an operationally validated astronaut system. Do not invent any of those.

Static maps, interactive products and map generators are allowed examples. Tablet/habitat/HUD formats are optional. Historical, predicted or unspecified timeframes are explicitly allowed; this does not validate an unsupported prediction or permit labeling archival observations as current. Surface point-of-view imagery and robotic transport are optional suggestions. AI, immersive VR, a DEM and live APIs are not stated requirements in this supplied Details text. Terrain/elevation could strengthen the intended route experience if verified.

## Current app versus challenge

| Goal / consideration | Current evidence | Gap / next priority |
| --- | --- | --- |
| NASA data from multiple missions | MRO HiRISE imagery and sourced Curiosity/MSL contextual records | Explain mission/instrument provenance and keep differing geographic footprints explicit |
| Layered/integrated location or route view | Interactive raster, user route, contextual record list, notes/export | Records lack verified image positions; no exact AOI overlap/calibration. A sidebar is useful context but must not be presented as spatially aligned data |
| Scientific objective and chosen location | Mount Sharp boxwork framing exists | State one concrete mission question and explain the evidence available on this particular frame; do not claim every contextual target lies on it |
| Helpful navigation/mobility context | Manual route sketch, endpoint/waypoint controls, reset/focus | No obstacle clearance, scale, DEM or slope. Describe visual proposal, not measured or safe traverse |
| Suggested breadth of data kinds | Optical imagery plus chemical/geologic findings described by records | Do not count every prose record as an independent quantitative layer. A verified pressure/temperature context panel could add atmospheric data; source/schema review is still required |
| Temporal context | Archival observations are allowed | Label observation dates/intervals and geographic limits. REMS is rover-local history, not current route-wide weather |
| Practical mission use | Local notes, save/load/export, prepared offline app; browser recovery tested | Resolve actual Android missing-note report and obtain exact revision-specific device/usability evidence |
| Optional immersion/AI | Flat 3D, proposed static explanations | Extra presentation tools only; cannot replace integrated verified science data |

## Release priority for remaining time

1. Protect the core mission workflow and actual submission access: clarify science goal, test note/route recovery on the deployed candidate and finalize truthful demo materials.
2. Accept one reproducible useful environmental source delivery if feasible; agree units/time/location/quality/schema before UI. Keep it regional/archival. Do not delay a reliable entry for unverified data volume.
3. Improve integration/context in the accepted UI: sources and limits available, clear route actions, explain zero located records and unavailable measurements.
4. Pursue exact-raster geographic calibration/compatible terrain if evidence can be obtained and tested in time; do not introduce guesses.
5. Add AI explanations or VR only as reviewed optional slices that leave the core workflow intact. Omit unfinished experiments at freeze.

The user reports an 11 am planning point and 10 pm submission deadline; timezone/official submission source remain unverified. Treat the proposed 2 pm review/5 pm feature-freeze/8–9 pm submission schedule as internal planning in the user's event timezone, not official rules.

## Remaining official inputs

Resources-tab text/links are not supplied. Event/local deadline and timezone, registration/team rules, submission portal fields, artifact limits, judging criteria, attribution/AI disclosure requirements and actual submission confirmation are not established by this Details extract. Request the relevant official pages/text; do not infer them from this page. Details is now available for product alignment, so do not keep claiming all challenge wording is unknown.
