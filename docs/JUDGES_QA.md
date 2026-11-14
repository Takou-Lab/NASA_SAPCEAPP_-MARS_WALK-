# MARSWALK — Judges' Q&A Reference

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Use the actual demonstrated revision. [Current verdicts](../REVIEW.md) and [work pieces](../TEAM_TASKS.md) determine feature/readiness claims. This reference is not an official competition rubric.

## Who uses it, and why?

Target near-term users are planetary-science learners/educators, analogue mission teams and outreach groups rehearsing decisions under incomplete evidence. MARSWALK combines a bounded local image, readable scientific context, user-sketched missions, portable notes/routes and clear unknowns. No customers, partnerships, participant outcomes or operational astronaut deployment are claimed.

## What data is real?

The prepared PIA26306 image is credited to NASA/JPL-Caltech/University of Arizona. Three Curiosity contextual records cite primary NASA sources, with findings, instruments/dates where available, evidence type and limitations in [SCIENCE_EVIDENCE.md](SCIENCE_EVIDENCE.md) and [REFERENCES.md](REFERENCES.md). The exact processed image has its own imageRef, hashes and preparation evidence in [DATA_PASSPORT.md](data/DATA_PASSPORT.md).

These are contributor source-audit records. Schema validation and image decoding do not independently certify scientific interpretation. The latest documentation alignment did not re-fetch those scientific sources.

## Why are there no science pins or metric distance?

All three science positions are null/unavailable on the prepared image. The **implemented science list** keeps them accessible without guessed coordinates. Exact AOI/geodetic alignment and metric calibration are unverified. The current contract has no verified DEM; image brightness is not elevation. Consequently distance, elevation, slope and route safety cannot be invented. A flat 3D image is not measured terrain.

## How does it compare with Mars Trek or JMARS?

Those tools already provide substantial planetary mapping, terrain and measurement capabilities. Our intended contribution is a focused portable rehearsal workflow with local mission notes and explicit evidence boundaries. We do not claim those tools lack features or that this prototype is more accurate.

## What works now, and what remains?

| Stage | Truthful capability |
| --- | --- |
| Main | Real local image/map/navigation, three selectable science records, shared assessment/persistence and guarded mission JSON import/export |
| Enzo branch `bcac915` | Functional shell, route controls and notebook; 57 tests/build/browser checks pass, final current-main reconciliation remains |
| Longla branch `9d794e2` | Corrected lazy flat viewer, code `2a6dbba`; 70 tests/build/browser/resource/orientation evidence, main integration and physical-device outcomes pending |
| Emma W3 | Science discovery plus dedicated confidence/image-passport UI assigned, not yet delivered |
| Gaddielle W2 | Real image index checks pass; one runtime/browser-path syntax follow-up remains |
| Coordinator W6 / Longla W5 | Installation, full verified cache/readiness/update behavior and disconnected device reopening still to implement/verify |

Do not add the test counts together; they apply to different revisions/scopes. Build success and an emulated tablet viewport are not installed-device acceptance.

## Does it work offline or in VR?

The target is an installable offline Angular PWA. That complete installed workflow has **not passed acceptance**. A mission JSON transfer does not contain the imagery or prepare the full cache. External citation pages may need connectivity. Immersive VR is **not implemented**; the optional branch viewer says so explicitly.

## What are the next proof points?

Finish W4's main reconciliation while W1/W2/W3 progress independently. W6 implements a real lifecycle contract and full pack, W5 records actual device results, and the coordinator arranges three outside-user sessions using [USABILITY.md](USABILITY.md). Report actual failures, fixes and retests. No participant results exist yet.

## How was AI used and credited?

See [AI_USE.md](AI_USE.md). AI assisted research drafting, coding, tests, technical review and documentation. Cite specific contributor/coordinator checks; do not claim every AI output or scientific conclusion was independently verified. Preserve NASA/data and library attribution. Check official submission requirements separately.
