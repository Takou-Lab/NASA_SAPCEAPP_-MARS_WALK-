# MARSWALK — start here when continuing

Updated 15 November 2026 UTC. This file is the cross-chat handoff, not an assertion that every remote feature is accepted. Verify Git and deployment state before acting. Never include credentials here.

## Goal and product boundary

Angular PWA for Mars visual mission planning: image map, route, contextual science, notes, local save/export and prepared offline recovery. Current imagery is uncalibrated; distance, elevation, slope and safety are unavailable. Flat opt-in 3D is implemented; terrain 3D, immersive VR and runtime AI are not. Environmental observations are not yet accepted runtime data.

## Repository and baseline

Repository: boscopatrick907-coder/NASA_SAPCEAPP_-MARS_WALK-, main. Local checkout currently `/workspace/NASA_SAPCEAPP_-MARS_WALK-`; rediscover if the environment changes. Reviewed source baseline **d6801a4**, including Emma integration be4ac2b, scientific LF fix ac79be5 and iOS icon discovery d32453f. This handoff's later documentation commits do not change runtime behavior. [Fresh checks](docs/qa/CONTINUITY_BASELINE.md).

Public URL: https://marswalk-jet.vercel.app/. Last documented deployed source b6669fb; anonymous inventory fetched this turn still reports pack `95d8b5f6ee7aba0a38e8e7758ada62be20a3f0ca61efd04adce0fc4cabb7a827`. Current local build pack differs: `2d175fcf490efe85d3d75ff3d7114bd814ef0b96edbb2808330511371c46e1e6`. Main is ahead of production. No deployment in this handoff task. Automatic GitHub deployment is not connected. Follow [Vercel runbook](docs/VERCEL_SETUP.md) and [deployment evidence](docs/qa/VERCEL_PRODUCTION.md); authenticate through supported tools, never copy secrets into chat/Git.

## People and current review states

| Owner | State and next step |
| --- | --- |
| Coordinator/user | [YOU.md](docs/team/YOU.md): verify official event requirements, review pending submissions, prepare candidate, then authorized deployment/device acceptance |
| Emma (he/him) | Phase 1 cdd2417 accepted in be4ac2b. Phase 2 visual specification/header and three delegated SCSS theme fixes remain. [Plan](docs/team/EMMA.md) |
| Willy Agent 1 | Existing map/navigation/retry accepted. Map usability/release workflow. [Plan](docs/team/WILLY.md) |
| Willy Agent 2 | Windows/root/subpath install verification, separate QA and device evidence. [Plan](<docs/team/WILLY 2.md>) |
| Enzo | c35b021 published on feature/enzo-image-payload-verifier. Review rejected integration: 43 focused Node tests pass but 11 integrated failures; both builds pass. Not merged. [Correction](docs/reviews/ENZO.md) |
| Gaddielle (she/her) | Earlier imagery/tooling accepted. Environmental prototype 0f6bd95 plus coordinator C1/C2 corrections accepted as illustrative tooling only; 52 integrated data tests pass. Original verified REMS products/labels/extraction are next. No runtime environment dataset/schema accepted. [Review](docs/reviews/GADDIELLE.md) |
| Royce/Longla | Existing 3D accepted; physical device/release QA pending. [Plan](docs/team/LONGLA.md) |

Emma owns shell/planner/notebook; Willy map; Enzo evidence/environment logic. Emma has a styling-only exception for science-context, exploration-confidence and image-passport SCSS. Coordinator owns root/core/build/worker. Original completed work retains its authorship. Use independent checkouts for Willy's two agents; never change the same checkout's branch/build concurrently.

## Ordered next work

1. Obtain official challenge/submission URL and exact deadline/timezone; requirements remain unverified. User was asked this turn. Do not invent a submission deadline.
2. Review Gaddielle original-source acquisition when submitted. Coordinator completed C1/C2 prototype fixes with 52 data tests passing; do not repeat corrections. Verify products/labels/extraction before accepting runtime data. See docs/reviews/GADDIELLE.md.
3. Wait for Enzo's corrected verifier commit; rerun full Angular suite, not just focused Node tests. Do not merge known failing c35b021.
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
