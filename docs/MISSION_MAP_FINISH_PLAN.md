# Finish the integrated Marswalk map — current priority override

Updated 15 November 2026 after explicit user direction. This is the current priority for all personal briefs; completed work stays accepted and unpublished progress must be preserved. [Challenge wording](challenge/REQUIREMENTS.md), [public candidate](qa/PUBLIC_SCIENCE_PREVIEW.md). Product goal: one useful map/route view using multiple NASA missions to support a specific boxwork science objective. Offline notes and explanations support that goal but do not replace calibrated, spatially meaningful evidence.

## Checked branch state

| Person | Latest published work | Review/integration state |
| --- | --- | --- |
| Emma Agent 1 | feature/emma-release-ui 59e00e1 | Accepted, on current public candidate. No newer UI tip. |
| Emma Agent 2 | No mission-briefing branch advertised | Assignment active; local/unpublished progress unknown, do not assume absent. |
| Enzo Agent 1 | feature/enzo-science-navigation 2b2a708 | Accepted/integrated, previous/next tested. Do not repeat. |
| Enzo Agent 2 | feature/enzo-release-story e161e41 | Three AI explanation drafts pending source corrections; no runtime AI accepted. |
| Willy Agent 1 | map 21cf6f0 / retry 02134f1 | Accepted; no new map-release branch advertised. |
| Willy Agent 2 | install-assets 9b4093d | Windows QA report accepted with explicit device/raster/browser gaps. |
| Gaddielle | environmental-data d6ab8aa | Source/terrain/thermal/geology docs investigated; full dataset/extractor NOT merged. Only coordinator-bounded 25-row REMS excerpt admitted with visible limited provenance. |
| Royce/Longla | longla-3d 498ee2e | New auto-restore/notebook/test changes unreviewed/unmerged. Preliminary diff shows checkbox toggle changed to set(true), so cannot untick; root/core scope needs coordinator review. |

## Critical path

1. **Gaddielle: one georeferenced area.** Verify original map-projected image label and compatible DTM label, exact product/footprint/CRS/units/nodata. Establish whether the prepared image's crop/resize/rotation can be reproduced. A DTM stereo pair containing the parent HiRISE observation does not establish 100% overlap or alignment with our derivative. Her proposed resolution/precision/compressed-size figures need actual label/raster evidence; do not call an unexecuted clipping plan a measured output.
2. **Coordinator: validate transform and route math.** Review calibration evidence for the exact display raster. If verified, implement tested image-to-ground conversion and planar distance using shared state, with persistence/image identity compatibility. Terrain/slope remains unavailable until elevation alignment/units/nodata/sampling are separately verified. Do not copy original m/pixel onto a resized image.
3. **Willy: map presentation and sampling checks.** Once the transform is real, render the accepted scale/coordinates/distance from shared APIs and verify known points/route lengths. Before then finish map interactions and explicit uncalibrated/context labels; no guessed scale bar or axes conversion.
4. **Emma 1 + Emma 2: one guided map workflow.** Mission question → available evidence/location confidence → route proposal → observation → save/recover/export. Main map stays usable while the briefing/details collapse. No green mission/safety badge from simply completing form fields.
5. **Enzo 1 + Enzo 2: science relevance.** Explain which evidence is located on this raster versus regional context. Provide source-backed targets with coordinate status, not fabricated pins. Finish accurate demo/source narrative; static AI prose only after supported science content and core route work.
6. **Royce + Willy 2: acceptance.** One deployed revision, real saved-note recovery, map interaction, installed phone/offline/export. Fix release blockers before VR experiments.

## Spatial data handoff — required before numerical map features

Deliver original raster/label/download/product/version, raw byte hashes, horizontal and vertical coordinate references, geographic footprint, exact processing commands, crop window/resize/rotation/reprojection and control-point residuals/uncertainty where applicable. A matching image dimension alone proves no spatial relationship. Keep missing transforms/units explicit. A compact AOI with verified georeferencing is more useful than a large unprocessed global layer. Do not publish full-resolution archives inside the PWA.

Candidate DTM: DTEEC_001488_1750_001752_1750_U02, reported on Gaddielle's branch. Treat existence, footprint, resolution, vertical datum and overlap as unverified until original metadata is inspected. If the existing derivative cannot be tied down, propose a reproducibly prepared, georeferenced replacement covering a small science area. Coordinator approves any imageRef change and protects old missions; no silent image swap or reuse of old pixel coordinates.

## Time gate and fallback

Within the next focused hour, Gaddielle/coordinator deliver a go/no-go on exact-raster calibration and usable terrain metadata, with actual evidence or exact missing input. If blocked, do not consume the remaining release window on promises: retain a truthful visual-planning entry, strengthen source/location distinctions and release/test it. User reports a 10 pm deadline, but timezone/official submission fields still need verification. No deadline-specific feature promises.

Pause new VR, live AI/backend, broad extra environmental quantities and cosmetic redesign. Preserve existing accepted flat viewer and reviewed science. This does not discard current unpublished agent work; hand off actual progress and reconcile owners before switching. A source/contract blocker is not permission to invent values or hypothetical APIs.

## Definition of this release

Required working demonstration: explain a concrete science objective; distinguish orbital/rover evidence and its spatial limits; draw a route; display only supported quantities; record an observation; save/export; reopen offline and recover. Verified metric distance and aligned terrain would strengthen it but must never be claimed if unavailable. Public preview is not final competition submission. Only coordinator integrates root/core/build/data-contract changes and performs authorized deployment; final submission requires explicit user action/instruction.
