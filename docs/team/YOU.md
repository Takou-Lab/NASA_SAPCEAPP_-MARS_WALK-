# YOU / Dinang — Remaining integration, PWA, deployment and submission work

> Current work piece: [W6](../../TEAM_TASKS.md#w6).

Updated **15 November 2026**. This is your **single remaining-work checklist through deployment and final handoff**. The current tested application is `b744b0b`, published with documentation at `27b1171`: 131 Angular tests, 28 data tests/build/browser checks passed. Those are historical baseline results, not checks of the future work below. [Integration evidence](../qa/FINAL_BRANCH_INTEGRATION.md).

All unchecked items below are **planned**, not claims of implementation. Keep completed work and unseen local progress. Finish or hand off your current slice before switching. Read [the team plan](../../TEAM_TASKS.md), [shared contracts](CODING_AGENTS.md) and [product charter](../../SOUL.MD). This personal file contains the full sequence; earlier files under `tasks/` remain detailed reference specifications for their named slices.

## Coordinator PWA delivery — current handoff

**`8a4dadc`** supplies production worker/full-pack verification, real PwaService state/actions, root lifecycle controls, manifest/icons and update handling. **136 Angular tests, 11 worker tests, 28 data tests/build/browser offline restart/update checks pass**. [Evidence](../qa/PWA_FOUNDATION.md), [deployment runbook](../DEPLOYMENT.md), [actual lifecycle API](CODING_AGENTS.md#implemented-pwa-lifecycle--available-now). Physical home-screen installation and public hosting still need validation. Existing 131-test statements below are historical baseline counts.

Core foundation is implemented. Next: actual hosting/target-device acceptance, official requirements verification, and shared environmental contract once real samples arrive. Enzo’s future pure verifier is not yet integrated; current complete-pack byte checks are already real. No host was published.

## Already complete — preserve

All eight submitted feature tips are integrated. Keep the actual map/retry/evidence, shell/planner/notebook/transfer and optional lazy viewer. R3 is closed. Do not restart the app, repeat merges or introduce a competing state store. PWA implementation and browser offline restart/update evidence are now supplied in `8a4dadc`; actual physical launcher/host acceptance remains pending.

## Phase 1 — Release coordination and shared contracts

Own root/bootstrap, `src/app/core/`, shared contracts/loading, package/lock/build config, worker/PWA lifecycle, main integration and hosting/release configuration. Teammates own their listed implementation folders. Use latest published main, preserve branch history and pending local work.

- [ ] Verify exact challenge wording, official deadline/timezone, submission fields/formats/team rules and required data/resources. Record source URL and verified requirements in `docs/RELEASE_PLAN.md`; do not adopt unverified slide/video/deadline claims from prior advice.
- [ ] Record protected working baseline and release candidate commit; tags are created deliberately and never moved silently. Establish actual available time and release freeze. Reserve final third for integration/device test/artifacts/submission; reduce optional experiments before consuming that reserve.
- [ ] Review W1 manifest/icons, W2 release-data handoff, W3 pure byte verifier and W4 accessibility/size cleanup as independent slices. Run checks appropriate to actual changes; preserve canonical tests/guards and each contributor's Git history.
- [ ] Agree Gaddielle's versioned environmental JSON and shared typed loader/validation **before** Enzo depends on it. Inputs include quantity/unit/time/location/instrument/quality/source and documented uncertainty; unknowns explicit, zero valid where supported. Separate metadata, numerical records, derived metrics and assumptions.
- [x] Define implemented PWA lifecycle state/actions before Emma builds status UI. Separate connectivity, metadata, displayed image, persistence and full-pack readiness; no invented service signals. Document actual exported APIs in CODING_AGENTS.md after implementation.

## Phase 2 — Complete installable offline PWA

- [x] Implement the documented production browser service-worker/cache strategy; add dependencies/config centrally. Wire reviewed manifest/icons, base-aware discovery/start/scope/standalone behavior and accurate install guidance. No promise that every browser emits an install prompt.
- [x] Define current versioned essentials: shell/all chunks/styles, required manifest/image/index/science and install assets. Future accepted environment/AI/VR files still require explicit inclusion and a new build. Image index is only 524,472 image-payload bytes; exclude archival master/unused references deliberately. State optional 3D/VR cache policy.
- [ ] Compose Enzo's image-only verifier with verification of the remaining required assets and build/data compatibility. Use cache-only reads to prove prepared state; missing/mismatched assets fail readiness rather than silently falling back to network.
- [x] Implement truthful preparation/progress/ready/failure/retry and update states. Handle interrupted work, storage limits, stale/missing files and unavailable crypto without destroying last usable data or current mission/drafts. Never force an update reload over unsaved notes.
- [ ] Integrate accepted environmental component/data and prepared AI explanation content if delivered, preserving missing-data states. Accept calibration only with evidence for exact raster and deliberate persistence/version handling; no fabricated slope/terrain/safety.
- [ ] Review optional VR separately; new model/backend/credentials must have agreed architecture. Never expose API keys in frontend. Essential offline mission remains usable without experimental AI/VR.

## Phase 3 — Deployment preparation and release execution

- [x] Produce `docs/DEPLOYMENT.md` with build/base-path/header/preview/rollback instructions.
- [ ] Choose the actual host/account/base path and provide its specific configuration; none has been chosen or published. App is a static Angular build at `dist/marswalk/browser`; no backend is currently required.
- [ ] Document reproducible Node/npm setup, `npm ci`, `npm test`, `npm run build`, data verification, build output, environment/base path and preview/production steps. Inspect licenses/secrets; do not deploy archival/raw-source files indiscriminately.
- [ ] Configure HTTPS, actual root/subpath base URL, case-sensitive assets, MIME types, SPA navigation handling as needed, service-worker scope and correct cache/update headers. Avoid immutable caching for entry HTML/worker/control files; use versioned/fingerprinted asset caching deliberately.
- [ ] Prepare an isolated preview and record exact commit/artifact/URL when deployment is explicitly requested in the release workflow. This documentation update itself does not publish/deploy. Confirm provider setup/credentials through available authorized tools when needed; never commit tokens.
- [ ] Validate clean/private-window first load, installed scope/icons, real full preparation/disconnected close-reopen and safe updates with Longla/Willy/Emma/Enzo/Gaddielle. Record errors and fix/retest blockers. Build success alone is insufficient.
- [ ] Promote the tested artifact through the authorized release workflow; preserve known-good build and rollback procedure. Recheck actual production URL, no login requirement if required by event, source/data versions and supported-device mission. Git merges and environment publication are separate operations.

## Phase 4 — Presentation, submission and support

- [ ] Give Enzo the actual served commit, URL, verified capabilities/limits and official format. Consolidate screenshots/demo, NASA/data/library/AI credits and references; no false live-data, safe-route, terrain, VR or installation claims.
- [ ] Arrange actual outside-user sessions using Emma's existing protocol when feasible; Longla observes, Enzo consolidates. Fix/retest observed confusion. If unrun, mark pending; do not invent participants or send messages without authorization.
- [ ] Verify all actual portal fields/team registration/links/artifacts/AI disclosures against official rules. Submit through an explicitly requested submission action and retain confirmation; deployment alone does not submit the entry. Do not assume portal edits remain possible.
- [ ] Final freeze: documented known issues and release commit; only reproducible release-blocker fixes with regression checks. Keep rollback available and verify any changed public link afterward.
- [ ] Final handoff: production URL, release commit/tag, deployment/runbook, accepted data versions/credits, device/offline evidence, AI/VR status, submission confirmation or explicit pending status and remaining maintenance work.

## Agent execution and final handoff

Preserve local changes; fetch published main and reconcile safely before starting a slice. Use the proposed branch only if no task branch already exists. No reset, force push or competing application/state store. Work on one slice at a time; hand it off for integration before starting the next dependent slice. A future contract is not an existing API.

For code changes run the relevant behavioral tests, the integrated `npm test` and `npm run build`, plus the actual affected browser workflow. Use data tests for Python/data changes. For static documents/assets, check real facts, paths/links, JSON and decoding/build output as applicable; do not add tests that merely repeat formatting. Record actual results and warnings, not baseline counts copied as new passes. Current build has initial/style warning overruns; do not raise budgets to hide them.

Each handoff includes actual **branch/commit, changed files, dependencies, commands/results, one observed workflow, remaining failures and deployment implications**. A blocked item includes the missing input/device/contract and next action. Do not fabricate numbers, coordinates, participant outcomes, timing, AI inference or hardware passes.

Use the user-authorized coordinator Git workflow: review feature slices, preserve history and integrate/push main when required. Contributors push their own feature branches. This plan prepares deployment; it does not itself publish an environment, deploy a site, submit the competition entry or authorize external messages. Preserve NASA/data/library/AI attribution.

Paste this into your coding agent:

```text
Read my personal docs/team file, TEAM_TASKS.md and CODING_AGENTS.md.
Inspect the actual branch and preserve existing work. Identify the first
unfinished, unblocked phase in my checklist and implement that slice only.
Use the listed owned files, real inputs and existing/agreed contracts.
Do not consume future APIs or modify another owner's files speculatively.
Keep all accepted behavior. Check important failure cases and the actual
user workflow; run relevant checks and review the diff before handoff.
Use my authorized coordinator Git workflow. Report actual commit/files/checks,
blockers and deployment effects. Do not start an unrelated redesign,
deployment. Mark completion only when supported by evidence.
```
