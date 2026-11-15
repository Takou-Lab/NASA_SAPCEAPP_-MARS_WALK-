# Source library and optional evidence comparison

User requested an easier planning experience with provenance moved out of the primary flow. Source information is retained locally and remains accessible; scientific boundaries are not deleted. Takou styling files are untouched.

## UI changes

- Map retains a short image credit; the source link, pixel metadata and long limitation list sit in a closed Image sources & limitations disclosure.
- Confidence & Data has a closed Sources, data & methods library with the full Image Data Passport, a science source index, historical REMS archive/review status and Pixal3D attribution. External websites require internet; source descriptions remain part of the prepared local app.
- Selected science finding and position status remain visible; instrument/date/citation and detailed limitations are behind Science source, methods & limitations.
- Environmental historical/limited-review status stays visible; long review notes and archive/coverage details use disclosures. Measurement/error states are unchanged.
- Route time/reserve and mission objective/checklist interfaces are retained. No new tab, navigation mode, persistence schema, scientific dataset or safety classification is introduced.

## Continued MD work: Enzo comparison accepted

Reviewed and cherry-picked Enzo Agent 1 e68e734 as 73be9d1. Optional Compare evidence selects at most two original records, provides original evidence/source/position status and can clear/remove entries. Hidden filtered entries are identified; removed source records are pruned. Comparison uses local component signals and does not change the route, global selected record, science data or notes. It never interprets the two records as co-located destinations or produces a confidence score. Other Enzo source deliveries remain separate review items.

## Checks

278 Angular tests across 29 files and production build pass. Browser checks at 390px with touch emulation: source disclosures start closed, native keyboard activation exposes the original source links, the central source library opens, comparison enforces two-record maximum and leaves exact exported route/notes/global selection unchanged. The combined mission objective/checklist/time/route/observation/brief workflow still passes a full browser-process restart offline with restored data and no horizontal page overflow.

These browser checks are not physical-device certification. Existing shell stylesheet and Leaflet CommonJS warnings remain; no budgets or Takou-owned SCSS files changed.

## Public acceptance

Runtime 241cac6 published at https://marswalk-review-boys-band.vercel.app/ (unique https://marswalk-az2pbs98y-boys-band.vercel.app/, deployment dpl_HuPKmhu2L3vA6i7NxZ6A6tkgGqR9). Anonymous HTTP verification confirms all 20 assets match local hashes; pack 0313b8b4aeda24b7c6df1b3e67cd1fc9f276ff427d4bcdb039c5d4d632946233, 9,728,707 bytes. The source-keyboard/comparison and combined objective/checklist/route/time/note/export/offline full-process restart scenarios pass on this public origin. Production alias unchanged; existing installed users should save/export before applying an available update.
