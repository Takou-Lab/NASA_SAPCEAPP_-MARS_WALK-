# MARSWALK — start here when continuing

Updated 15 November 2026 UTC. This file is the cross-chat handoff, not an assertion that every remote feature is accepted. Verify Git and deployment state before acting. Never include credentials here.

## Goal and product boundary

Angular PWA for Mars visual mission planning: image map, route, contextual science, notes, local save/export and prepared offline recovery. Current imagery is uncalibrated; distance, elevation, slope and safety are unavailable. Flat opt-in 3D is implemented; terrain 3D, immersive VR and runtime AI are not. Environmental observations are not yet accepted runtime data.

## Repository and baseline

Repository: boscopatrick907-coder/NASA_SAPCEAPP_-MARS_WALK-, main. Local checkout currently `/workspace/NASA_SAPCEAPP_-MARS_WALK-`; rediscover if the environment changes. Reviewed source baseline **d6801a4**, including Emma integration be4ac2b, scientific LF fix ac79be5 and iOS icon discovery d32453f. This handoff's later documentation commits do not change runtime behavior. [Fresh checks](docs/qa/CONTINUITY_BASELINE.md).

Public URL: https://marswalk-jet.vercel.app/. Last documented deployed source b6669fb; anonymous inventory fetched this turn still reports pack `95d8b5f6ee7aba0a38e8e7758ada62be20a3f0ca61efd04adce0fc4cabb7a827`. Current local build pack differs: `2d175fcf490efe85d3d75ff3d7114bd814ef0b96edbb2808330511371c46e1e6`. Main is ahead of production. No deployment in this handoff task. Automatic GitHub deployment is not connected. Follow [Vercel runbook](docs/VERCEL_SETUP.md) and [deployment evidence](docs/qa/VERCEL_PRODUCTION.md); authenticate through supported tools, never copy secrets into chat/Git.

## Current designated PUBLIC preview — source 38516f8

https://marswalk-pfoqdsf41-boys-band.vercel.app/ is READY and anonymous HTTP/browser checks pass; **no Vercel login needed**. [Evidence and precise source limitations](docs/qa/PUBLIC_SCIENCE_PREVIEW.md). 223 Angular tests, 54 data tests/build, all 19 asset hashes and unauthenticated full-process offline route/note recovery pass. Contains Emma UI, accepted Enzo navigation and two limited-provenance REMS excerpt summaries (not independently archive-authenticated/full-day). MARSWALK preview protection disabled at explicit user request; no secrets shared. Production remains older and unchanged. This origin supersedes prior previews for tests/screenshots; storage does not transfer automatically between origins.

## Official Details text supplied — alignment now available

Read [challenge assessment](docs/challenge/REQUIREMENTS.md) and preserved user-supplied text. Central goal is a layered integrated location/route using multiple NASA science missions. Three data kinds are suggested, historical data is allowed, AI/VR/DEM/live feeds are not mandatory in supplied Details. Prioritize science-goal/location integration, reproducible data and reliable mission recovery. Independent webpage retrieval still blocked; Resources tab/submission fields/deadline timezone remain unverified. Do not treat all Details wording as missing now.

## People and current review states

| Owner | State and next step |
| --- | --- |
| Coordinator/user | [YOU.md](docs/team/YOU.md): verify official event requirements, review pending submissions, prepare candidate, then authorized deployment/device acceptance |
| Emma (he/him) | Phase 1 cdd2417 accepted in be4ac2b. Phase 2 59e00e1 accepted: 208 tests/build/browser pass, initial 442.83 kB. Deployed UI verification next; existing preview is older. [Plan](docs/team/EMMA.md) |
| Willy Agent 1 | Existing map/navigation/retry accepted. Map usability/release workflow. [Plan](docs/team/WILLY.md) |
| Willy Agent 2 | Windows report 9b4093d accepted as contributor evidence; missing raster HTTP, browser offline and physical-device checks next, separate QA. [Plan](<docs/team/WILLY 2.md>) |
| Enzo | fc79cf8 verifier correction accepted: 193 integrated Angular tests and root/subpath builds pass. Pure verifier remains unmounted; Coordinator completed Agent 1 evidence clarity with 194 tests/build/browser checks; Agent 1 next is bounded science-record navigation, Agent 2 release-story 0731a49 accepted with minor coordinator wording fixes; cbddb0e checklist accepted with technical corrections; candidate screenshots/rehearsal remain pending. Agent 2 e161e41 three-record AI proposal received; planned/observed and source-overreach corrections pending, no runtime approval; see docs/team/ENZO 2.md. [Correction](docs/reviews/ENZO.md) |
| Gaddielle (she/her) | Earlier imagery/tooling accepted. Environmental prototype 0f6bd95 plus coordinator C1/C2 corrections accepted as illustrative tooling only; 52 integrated data tests pass. Latest REMS cdd5b45 received; 53 isolated tests pass, but extractor synthetic Ls/nonfinite/quality/integrity issues remain. Not merged; collection ongoing. No runtime environment dataset/schema accepted. [Review](docs/reviews/GADDIELLE.md) |
| Royce/Longla | Existing 3D accepted; QA report 3af60d1 integrated as contributor-reported only. Samsung installation reported; missing-note reproduction/build identity needed before physical acceptance. [Plan](docs/team/LONGLA.md) |

Emma owns shell/planner/notebook; Willy map; Enzo evidence/environment logic. Emma has a styling-only exception for science-context, exploration-confidence and image-passport SCSS. Coordinator owns root/core/build/worker. Original completed work retains its authorship. Use independent checkouts for Willy's two agents; never change the same checkout's branch/build concurrently.

## Available-agent split — current user instruction

Emma Agent 2: new standalone read-only boxwork mission briefing, computed structural checklist and QA in a new folder; [EMMA 2.md](<docs/team/EMMA 2.md>). Emma Agent 1 remains on accepted UI/deployed checks. Enzo Agent 2: source-corrected explanations, sentence-to-source mapping and complete mission-story/demo package in existing documentation; [ENZO 2.md](<docs/team/ENZO 2.md>). Enzo Agent 1 navigation and Gaddielle collection continue independently. User/coordinator: persistence regression, accepted environmental/explanation contracts, reviewed component integration and updated preview, ordered in YOU.md. Separate checkouts and file ownership; no invented future API or runtime dataset approval. No new product code implemented by this assignment update.

## Environmental integration state

Coordinator implemented src/app/core/environment.ts, EnvironmentService and projected environmental panel with runtime review-status metadata (readings empty). [Contract](docs/data/ENVIRONMENT_RUNTIME_CONTRACT.md). Gaddielle 437a777 remains unmerged with unresolved finite-value/quality/source guards; its 53 data tests pass but no numeric dataset accepted. Latest extractor removed synthetic Ls. This is functional loader/UI/offline infrastructure, not verified atmospheric measurements. Never claim environmental values are deployed or approved from this status record.

## Latest limited scientific context and navigation

Enzo Agent 1 2b2a708 navigation accepted. User-authorized numerical subset is limited to Gaddielle's supplied 25-row Sol 3900 pressure/air-temperature excerpt (800.335 Pa / 204.700 K means), reproducibly processed, explicitly **not independently archive-authenticated or full-day**. See ENVIRONMENT_RUNTIME_CONTRACT.md. Other submitted data/extractor remain unmerged. 223 Angular tests, 54 data tests/build/local offline browser pass. Public preview access enabled for MARSWALK at user request; no tokens need sharing. Production promotion remains separate.

## Ordered next work

1. User supplied [official challenge URL](https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/?tab=details). User supplied Details text; see docs/challenge/REQUIREMENTS.md. Proxy retrieval remains blocked. Obtain Resources/submission rules and exact deadline/timezone; do not call supplied Details requirements unknown. Do not invent them.
2. Review Gaddielle original-source acquisition when submitted. Coordinator completed C1/C2 prototype fixes with 52 data tests passing; do not repeat corrections. Verify products/labels/extraction before accepting runtime data. See docs/reviews/GADDIELLE.md.
3. Enzo fc79cf8 correction is accepted with 193 tests and both builds passing. Evidence clarity completed centrally; preserve his new science-navigation slice; coordinator owns future cache-lifecycle composition. Do not repeat the closed correction.
4. Agree environmental schema/loader only from accepted evidence. Keep measurements historical, time/location/units/quality explicit. Calibration and compatible elevation are separate scientific priorities.
5. Reconcile approved UI/map work, run checks and create a release candidate. Do not repeat accepted merges or alter canonical data hashes for CRLF.
6. Deploy only when instructed through the release workflow. Record source/artifact/URL and test actual public-origin offline recovery. Physical Android/iOS standalone/touch and three outside-user sessions are still pending; desktop automation cannot substitute.
7. Complete actual presentation/credits and official submission fields. No competition submission has been made by this work.

## How to resume in another chat or agent

Attach/select the same repository and send:

> Continue MARSWALK. Read PROJECT_HANDOFF.md, docs/team/YOU.md, TEAM_TASKS.md and repository instructions. Inspect local changes and fetch remote branches before editing. Preserve unpublished work. Distinguish pushed, reviewed, merged and deployed. Start the first unblocked coordinator task and update the handoff after meaningful progress. Do not deploy, publish the cloud environment or submit the entry without my instruction.

For a teammate agent, replace YOU.md with that person's MD and obey its ownership/branch boundaries. Before resetting this chat, commit/push authorized work and record remaining local files; uncommitted files and `/tmp` artifacts may not survive. Fresh environments need repository setup/dependencies again. Chat context and billing/usage allowances are separate: this file preserves knowledge, not extra allowance or authentication.

## Verification and durable evidence

Use lockfile-installed dependencies (`npm ci`), `npm test`, `npm run test:pwa`, `npm run build` and `python3 -m unittest discover -s tools/data -p 'test_*.py'` as appropriate. Build output is `dist/marswalk/browser`; `npm run build` includes pack verification while bare Angular compilation does not. Root/subpath output overwrite the same build directory: test one before building the other. Keep scientific JSON LF per .gitattributes.

[Current baseline](docs/qa/CONTINUITY_BASELINE.md), [team plan](TEAM_TASKS.md), [release plan](docs/RELEASE_PLAN.md), [product charter](SOUL.MD), [contracts](docs/team/CODING_AGENTS.md), [usability protocol](docs/USABILITY.md). Historical evidence counts are revision-specific. Do not rely on `/tmp` scripts, installed tools, existing credentials or old chat claims without checking them.
