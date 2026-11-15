# Enzo 2 — Release story, demonstration and submission evidence

## Current handoff — release-story corrections accepted

0731a49 passes documentation review with minor coordinator example/label corrections. [Acceptance](../reviews/ENZO.md#agent-2-release-story-0731a49--accepted-with-minor-coordinator-corrections). Do not repeat the closed 25634e2 correction request. Preserve local work and safely incorporate published main.

Next: maintain a screenshot/rehearsal checklist in your existing QA handoff: exact candidate URL/commit/pack, device/browser/viewport, required scenes, expected saved/recovered note and actual versus unrun steps. Capture only an actually served release candidate designated by coordinator; new main is not automatically live. Once supplied, reconcile screenshots and rehearse the accepted primary/fallback script, recording actual failures and timing rather than a planned duration as a result. Consolidate real user observations only when coordinator/Longla provides them. Official page text/deadline, candidate deployment and device/session access remain dependencies, not reasons to invent outcomes. No independent deployment, external messages or runtime AI assigned.


Assigned 15 November 2026. You are Enzo's second coding agent. Your assignment runs independently of Agent 1's confidence/evidence UI work. Read [project handoff](../../PROJECT_HANDOFF.md), [Enzo's plan](ENZO.md), [product charter](../../SOUL.MD) and [release plan](../RELEASE_PLAN.md).

## Independent checkout and file ownership

Use a separate clone or existing independent checkout. Never switch branches, install dependencies or generate build output concurrently in Agent 1's checkout. Preserve local/unpublished work. Continue an existing presentation branch if it contains progress; otherwise use `feature/enzo-release-story` from published main. No reset or force push.

Own only:

- `docs/PRESENTATION.md`
- `docs/DEMO_SCRIPT.md`
- `docs/JUDGES_QA.md`
- `docs/SCIENCE.md`
- `docs/REFERENCES.md`
- `docs/AI_USE.md`
- `docs/USABILITY.md`
- Your new handoff `docs/qa/ENZO_2_RELEASE_STORY.md`
- Optional actual screenshots under `docs/demo/`, with no personal data and with attribution/revision recorded.

Preserve Emma's original authorship and completed research. These files are assigned to you so Agent 1 must not edit them concurrently. Do not edit application source, data/fixtures, worker, root/core, packages, deployment config, other agents' briefs or scientific evidence audits. Suggest corrections outside ownership through your handoff, not direct edits.

## Current factual baseline

Enzo verifier correction fc79cf8 is accepted in main 7896e8b: 193 Angular tests and both production build paths pass. Pure image verification is not mounted into the UI and is not itself complete offline readiness. Gaddielle's illustrative converter is accepted as tooling only; 52 data tests pass. No verified environmental runtime dataset/schema is accepted.

Map route drawing, contextual science, notes, local save/recover/export, guarded import and custom full-pack offline preparation exist. Flat opt-in 3D exists. Metric distance, elevation/slope, hazard/safety assessment, runtime AI and immersive VR are unavailable. Science records have no verified positions on the active image. Public deployment is older than main; obtain the exact source from the coordinator's deployment record before recording a live demonstration.

## Slice 1 — Reconcile the existing story with evidence

1. Read the existing seven owned documents and identify stale statements without deleting historical evidence/authorship. Seven slides and demo durations are internal choices, not official rules.
2. Update the current summary to distinguish implemented, tested locally, publicly deployed, physical-device tested and planned. Link each meaningful claim to existing revision-scoped review/QA evidence.
3. State the user problem plainly: rehearsing and documenting an exploration plan with contextual evidence and honest unknowns. Do not claim validated astronaut navigation, operational mission readiness, safety, customers or comparative superiority without evidence.
4. Update PRESENTATION.md into a coherent editable outline: user/problem; NASA data and provenance; actual workflow; offline recovery evidence; distinguishing contribution; limitations/next work. Keep slide count flexible until official requirements are verified.
5. Update SCIENCE.md and REFERENCES.md with the actual imagery/record sources already supported by repository evidence. Distinguish science findings, interpretations, user notes and fixture values. External source links may require internet even when the app is prepared offline.

## Slice 2 — Prepare a reproducible demonstration and fallback

Write a primary two-minute rehearsal plus a short fallback in DEMO_SCRIPT.md. These are internal targets, not submission requirements.

Sequence: load the specified release; prepare the full offline pack; draw start/waypoint/destination; inspect a contextual science record; save an observation; save route/export; disconnect and fully close/reopen; explicitly load the saved route; show note recovery/export. Explain null distance/terrain briefly instead of reading every warning. Optional flat 3D only if time remains and it works on the demonstrated device.

List prerequisites, actual control labels, expected visible outcomes, revision and preparation steps. Clearly separate pre-demo setup from actions shown live. If offline/installation cannot be observed, use a clearly labeled recorded demonstration from a verified revision or show the online workflow and state the missing proof. Never stage a fake offline connection, green readiness badge or recovered record.

Capture screenshots only from an actually served build; record commit, URL, viewport/browser and scene. Do not capture new features from main and label them as currently public. Do not deploy to obtain screenshots yourself; coordinate the candidate URL. Keep existing evidence as historical if the new build is unavailable.

## Slice 3 — Judging questions and attribution

Update JUDGES_QA.md with concise evidence-grounded answers to: why this user needs it; which NASA data; what is original; what works offline; why science has zero located pins; why distance/slope are unavailable; why the viewer is flat; how data is validated; what remains to finish. Do not claim 3D terrain, live AI, live Mars weather or radiation safety.

Update AI_USE.md from actual records: tools/models only where known, assistance performed, human/source review and remaining limitations. Separate AI-assisted development/prepared text from runtime inference. No API keys, tokens or invented model/version attribution. This task does not add an AI feature.

## Slice 4 — Real usability evidence and final reconciliation

Preserve the existing USABILITY.md protocol. Prepare a blank results table for three coordinator-arranged unfamiliar users: anonymous participant ID, device/browser, revision, task outcome, observed confusion, fix owner and retest. If sessions have not happened, mark them pending. Do not contact people or invent participants, quotations or timings. Incorporate observations provided by coordinator/Longla and reconcile conflicting reports with their actual revision.

Once Agent 1's UI changes are accepted and a candidate is deployed, update screenshots/control wording and repeat only affected demonstration steps. Record unresolved blockers, then freeze presentation claims to that exact release.

## Official challenge gate

User supplied https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/?tab=details . Current recorded retrieval is blocked by proxy CONNECT 403. This does not verify challenge wording or deadline. Use actual official text when provided or accessible; record source/section/date. If unavailable, continue factual internal preparation and mark compliance mapping/submission fields blocked. Never invent mandatory datasets, executable format, video length, local deadline or upload limits. Coordinator owns final requirements verification/submission.

## Validation and delivery

For documentation-only changes verify relative links/anchors, source claims, revision consistency, actual paths/control labels and Markdown formatting. Do not add artificial unit tests or rerun application tests without a code change or relevant concern. Assets require inspection and provenance, not invented test counts. Report failed external access honestly.

Create docs/qa/ENZO_2_RELEASE_STORY.md with branch/commit, edited files, evidence references, current served versus planned revision, observed demo steps, screenshots, checks performed, pending devices/users/official rules and final coordinator inputs. Push your feature branch for review. Do not merge main, deploy, submit the entry or send external messages.

## Paste into Agent 2

```text
Read docs/team/ENZO 2.md and PROJECT_HANDOFF.md. Work in an independent
checkout on the release-story slice only. Preserve original authorship,
existing progress and evidence. Update the assigned presentation/demo/QA
and attribution documents from actual implemented and deployed behavior.
Do not edit Agent 1's UI, runtime data or coordinator configuration.
Record unsupported claims and blocked official/device/user inputs honestly.
Validate links and claims, push your feature branch, and provide the handoff.
```
