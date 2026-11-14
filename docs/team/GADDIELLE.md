# Gaddielle — Mars Imagery and Terrain Data

## Your mission

Find and prepare credible Mars data for the selected Mount Sharp boxwork area in Gale Crater. You own the imagery/terrain role after the swap with Willy. Your name also appears as Gaddiel/Daddiel in earlier requests.

Read [the team allocation](../../TEAM_TASKS.md). This repository contained documentation only when these briefs were created. Proposed files below are deliverables to create as needed, not verified existing assets.

## Deliverables and ownership

- One usable regional imagery product with documented provenance.
- A verified aligned terrain product, or an explicit unavailable-data report.
- A data manifest, proposed at `public/data/manifest.json`, and preparation notes under `docs/data/`.
- Files or layer details Willy can load and Longla can use for 3D.

Coordinate scientific findings with Emma and shared schemas with the coordinator. Do not change application logic to disguise missing data.

## Work in this order

1. Confirm the exact proposed AOI using actual product footprints and rover-localization evidence. General Gale coverage does not prove boxwork overlap.
2. Open Mars Trek and check available imagery/elevation products for that area. Verify usable layer requests rather than copying an untested service URL.
3. Download or open one real sample image. Record its original dimensions, format and source.
4. Search for one overlapping terrain product. Time-box the initial terrain search to one hour.
5. Inspect coordinate reference system, longitude direction/range, orientation, horizontal units, vertical units and datum.
6. Check alignment visually and through metadata. Record NoData and coverage gaps.
7. Prepare a reasonably sized derivative if necessary. Preserve the original product identity and document crop, resize, transform and conversion steps.
8. Hand Willy the imagery/bounds and Longla the terrain/units. Ask the coordinator to trigger the visual-review fallback if terrain remains unverified.

## Metadata checklist for every product

| Field | What to record |
| --- | --- |
| Identity | Product ID/name, provider, primary HTTPS source and credit |
| Coverage | Footprint, AOI overlap evidence and gaps |
| Coordinates | CRS, axes, units, longitude convention and orientation |
| Resolution | Original resolution and derivative resolution, with units |
| Timing | Observation date and retrieval date, when available |
| Processing | Original format, output format and reproducible conversion steps |
| Validity | Verification status, NoData, known uncertainty and intended use |

Use null/unavailable for unknown fields. Never supply guessed coordinates or scale as verified facts.

## Calibration and terrain rules

- Resizing or cropping changes the relationship between pixels and source coordinates.
- A presentation image alone does not establish metric scale or north-up orientation.
- Pixel distance can become metric distance only after independently verified calibration of the exact prepared raster.
- Slope needs validated elevation, units, alignment and NoData handling. Imagery alone cannot supply slope.
- Missing terrain must remain unknown, including along partially covered routes.
- Check source terms and attribution before committing data; coordinate large assets with the coordinator.

## Checks before handoff

- Open the actual prepared file and verify its dimensions and readability.
- Confirm that metadata matches that exact file and processing version.
- Demonstrate image/terrain overlap rather than relying on product names.
- Reproduce a preparation step using the documented command if processing was necessary.
- Confirm the app loads the delivered local asset without an external account.

## Completion and handoff

You are done when usable imagery is supplied with honest coverage information, and terrain is either validated or clearly unavailable. Send the filenames, manifest, provenance, coordinate details, processing instructions and unresolved questions. Explain why each dataset supports the claimed use and where it does not.

## Copy-paste coding-agent prompt

Paste the following into your coding-agent session when starting your assigned work. Read the [shared contract](CODING_AGENTS.md) with it.

```text
You are Gaddielle's data-preparation agent for MARSWALK.
Read docs/team/GADDIELLE.md, docs/team/CODING_AGENTS.md and TEAM_TASKS.md.
Willy owns map code; your role is data, with optional processing scripts.

1. Inspect actual data and metadata. Verify sources and exact AOI coverage
   before making claims. Do not assume PDF/context product details are true.
2. Own public/data/imagery/, public/data/terrain/, public/data/manifest.json,
   docs/data/ and optional tools/data/. Do not modify Angular map code.
3. Deliver one real local image and a manifest matching ImageManifest in
   CODING_AGENTS.md. Use a stable imageRef tied to the exact derivative.
   Unknown calibration must be verified:false with null scale/source/method.
   Observation date can be null; never invent source metadata.
4. Document product identity, coverage, CRS/orientation, dimensions, source,
   credit, processing and gaps. Verify the actual file opens and matches
   width/height. A regional image is not automatically a verified exact AOI.
5. Time-box terrain search to one hour. If unavailable, report it. The v1
   schema deliberately has no DEM contract; agree on one before adding
   terrain integration. Never generate a fictional height map.
6. If scripts are needed, write small command-line Python tools in tools/data/
   with explicit input/output paths, no hard-coded local machine paths,
   no network secrets, and documented dependencies. Validate inputs; avoid
   overwriting originals. Record crop/resize/resampling and NoData handling.
   Ask the coordinator to manage dependency declarations centrally.
7. Check output metadata, readability and alignment; reproduce one processing
   command. Hand Willy bounds/imageRef and Longla terrain units/transform.

If sources are inaccessible, report exact destinations/operations needed;
do not fabricate records or request secret values in chat. Report files,
evidence, commands and limitations. No push/merge without authorization.
```
