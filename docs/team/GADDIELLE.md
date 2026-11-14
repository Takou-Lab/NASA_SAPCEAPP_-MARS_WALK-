# Gaddielle — Mars Imagery and Terrain Data

**Continue existing work:** preserve your current branch and completed results. Finish or hand off the small slice already underway; apply newly added charter tasks afterward. Do not restart the earlier assignment. See [the transition rule](../../SOUL.MD#apply-this-charter-without-restarting-work).

## Current follow-up — offline image-data package

Read [SOUL.MD](../../SOUL.MD) before continuing. Your data package supports an installable Angular PWA for science learning, mission rehearsal and analogue-workflow research. Future astronaut support is the long-term vision; this release does not establish operational navigation or route safety.

Continue on **`feature/gaddielle-data-preparation`**. Your initial imagery and manifest have been reviewed for technical compatibility: both images decode and the prepared image is **2048 × 1042**, matching the manifest. The committed file checksums match the processing log. Scientific product/coverage claims still require authoritative evidence.

The Angular foundation is on `main`, but your imagery files remain on your feature branch until integration. Update your existing branch from `main` while preserving work; do not start a second data branch, redownload the same files or regenerate the derivative unnecessarily. The current assignment below takes precedence over the initial acquisition checklist retained later in this brief.

### Deliver these next

1. Review `docs/data/README.md`, `PROCESSING_LOG.md` and `TERRAIN_EVALUATION.md`. Qualify or remove unsupported claims about exact AOI overlap, projection, orientation and DEM coverage. Keep terrain and metric calibration unavailable; record inaccessible sources rather than claiming verification.
2. Create **`docs/data/OFFLINE_DATA_PACK.md`**. List the manifest and prepared runtime image with relative paths, byte sizes, SHA-256 values, total required image-pack size, provenance, credits and limitations. Identify the original master image as archival rather than required for offline caching. This inventory covers image data only, not the full PWA or its readiness.
3. Add **`tools/data/verify_pack.py`**. Read the manifest without changing files, validate its local asset reference, decode the image, compare actual dimensions to the manifest, and report byte size and SHA-256 for the manifest and referenced image. It must work without network access and exit nonzero for an invalid manifest, missing/unreadable files or inconsistent dimensions. Use explicit arguments such as `--manifest public/data/manifest.json --public-root public` and document the actual command.
4. Run the verifier against the committed data and demonstrate a failure using temporary test files for a missing image or wrong dimensions. Do not corrupt repository assets for a negative check. Reuse the declared Pillow dependency if needed; coordinate any new dependency declaration with the coordinator.
5. Preserve the committed derivative. GDI+ and Pillow can produce different bytes from the same source; changing the derivative or its coordinate interpretation requires deliberate `imageRef` versioning and a coordinated migration.
6. Give Willy a short written handoff: image path, manifest path, imageRef, bounds, bottom-left pixel convention, Leaflet `[y, x]` conversion, and expected feedback for failed image loading or mismatched dimensions. Do not implement Willy's map.
7. Create **`docs/data/DATA_PASSPORT.md`** as the source for Enzo's readable Data Sources panel. Include the source/credit, observation date when verified, coverage and resolution when known, exact image version/reference, processing steps, checksum, verification status and limitations. Distinguish confirmed metadata from unverified claims. Map existing manifest fields to display labels; document extra information without adding runtime schema fields unilaterally. Give the coordinator any proposed model changes before implementation.
8. Support the complete offline mission test by supplying the exact required image files and checksums. An image-pack verification pass cannot prove application installation, full offline reopening or route/note persistence. Keep those outcomes pending until the coordinator tests the integrated PWA.

### Completion and publication

Done means the image-data inventory and Data Passport are accurate, offline file verification passes, a controlled failure is detected, and the handoff and unsupported-claim corrections are committed. Report the commands and outcomes. Commit and push **your feature branch**; this follow-up authorizes that push. Do not merge into or push `main`, deploy the app, create a second service worker, or change shared Angular models.

## Initial assignment reference

The following mission, acquisition checklist and rules describe the original role. Keep them as reference; continue with the current assignment above rather than repeating completed acquisition work.

## Your mission

Find and prepare credible Mars data for the selected Mount Sharp boxwork area in Gale Crater. You own the imagery/terrain role after the swap with Willy. Your name also appears as Gaddiel/Daddiel in earlier requests.

Read [the team allocation](../../TEAM_TASKS.md) and [shared contract](CODING_AGENTS.md). The original brief was written before the Angular foundation and data branch were available; inspect the current checkout before applying its proposed paths.

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

Paste this into your coding-agent session for the current follow-up assignment.

```text
You are Gaddielle's data-preparation agent for the Angular MARSWALK PWA.
Read docs/team/GADDIELLE.md, docs/team/CODING_AGENTS.md,
docs/data/IMAGE_CONTRACT.md, SOUL.MD and TEAM_TASKS.md.
The immediate users are science learners and exploration-rehearsal teams.
Do not present this regional imagery as validated astronaut navigation.

Continue on feature/gaddielle-data-preparation. Inspect Git status and
preserve local work before updating from main. The Angular foundation is
on main; the prepared image and manifest are on your existing feature
branch pending integration. Do not create a competing app or reacquire
already delivered data unnecessarily.

1. Inspect your existing manifest, images and processing records. Qualify
   unsupported AOI overlap, projection/orientation and DEM claims in
   docs/data/README.md, PROCESSING_LOG.md and TERRAIN_EVALUATION.md.
   Keep terrain and metric calibration unavailable. If authoritative source
   access is blocked, record the limitation rather than claiming verification.
2. Create docs/data/OFFLINE_DATA_PACK.md with the required manifest and
   prepared image paths, byte sizes, SHA-256 values, total image-pack size,
   sources, credits and limitations. Distinguish archival master imagery
   from required runtime files. This is an image-data inventory, not the
   complete offline PWA pack or a claim of offline readiness.
3. Implement tools/data/verify_pack.py with explicit manifest/public-root
   arguments. Validate the manifest and local asset reference, confirm the
   image exists and decodes, compare actual dimensions with the manifest,
   and calculate/report bytes and SHA-256 for both required files.
   Read files only; do not download or modify data. Exit nonzero for invalid
   metadata, missing/unreadable files or wrong dimensions. Run offline.
4. Document and execute the verifier command. Check one valid package and
   a controlled failure using temporary files; never damage real assets.
   Reuse existing Pillow support. Coordinate new dependencies centrally.
5. Keep the committed derivative unchanged. Different image libraries can
   produce different bytes; a changed derivative/coordinate interpretation
   needs a new imageRef and coordinated record migration.
6. Write Willy's image handoff: paths, imageRef, 2048x1042 dimensions,
   bounds [[0,0],[1042,2048]], bottom-left pixel convention, Leaflet [y,x]
   conversion, unavailable calibration/terrain and load/dimension error
   expectations. These dimensions apply only while the committed image
   and manifest remain the inspected version.
7. Create docs/data/DATA_PASSPORT.md for the user-facing Data Sources panel:
   source/credit, verified date, coverage/resolution where known, imageRef,
   processing, checksum, verification status and limitations. Separate
   confirmed metadata from unknowns. Map existing manifest fields to labels;
   propose extra runtime fields to the coordinator instead of changing the
   shared schema yourself. Help Enzo explain what this imagery supports.
8. Supply the coordinator with the required files/checksums for the complete
   offline mission test. Your verifier checks image data only. Do not claim
   installability, full offline readiness, route persistence or note recovery
   until the integrated PWA is actually tested. Keep terrain and calibration
   limitations visible in the passport and handoff.

Own docs/data/, tools/data/ and your existing data files. Do not alter
Willy's Angular map, shared models, service-worker logic or another
teammate's records. Report files, commands, results and unresolved source
verification. Commit and push feature/gaddielle-data-preparation; that
feature-branch push is authorized for this follow-up. Do not merge or push
to main, deploy, or send messages to teammates on the user's behalf.
```
