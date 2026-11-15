# Willy — Remaining map, installation and deployment work

> Current work piece: [W1](../../TEAM_TASKS.md#w1).

Updated **15 November 2026**. This is your **single remaining-work checklist through deployment and final handoff**. The current tested application is `b744b0b`, published with documentation at `27b1171`: 131 Angular tests, 28 data tests/build/browser checks passed. Those are historical baseline results, not checks of the future work below. [Integration evidence](../qa/FINAL_BRANCH_INTEGRATION.md).

All unchecked items below are **planned**, not claims of implementation. Keep completed work and unseen local progress. Finish or hand off your current slice before switching. Read [the team plan](../../TEAM_TASKS.md), [shared contracts](CODING_AGENTS.md) and [product charter](../../SOUL.MD). This personal file contains the full sequence; earlier files under `tasks/` remain detailed reference specifications for their named slices.

## Already complete — preserve

Map `094fce2`, navigation `21cf6f0` and explicit retry `02134f1` are accepted and integrated. Keep one map, bottom-left image pixels, decode/readiness guards, route/notes/layers/view preservation and reset/focus behavior. No repeated root mount or map rewrite.

## Phase 1 — Install assets, start now

Branch default: **`feature/willy-pwa-install-assets`**, from latest published main. Own these assets and `docs/qa/PWA_INSTALL_ASSETS.md` only:

- [ ] `public/manifest.webmanifest`: UTF-8 JSON; name/short_name MARSWALK, `lang: en`, description, `start_url: ./`, `scope: ./`, `display: standalone`, matching dark background/theme colors.
- [ ] `public/icons/marswalk-192.png` (192×192, any), `marswalk-512.png` (512×512, any), `marswalk-maskable-512.png` (512×512, maskable). Manifest uses relative `icons/...` URLs and correct PNG types/sizes/purposes. Optional original source belongs under the same directory.
- [ ] Original readable mark and attribution/tool record. Maskable image has opaque full background and essential artwork within a centered circle of diameter 80% of canvas. Fully decode files and inspect actual launcher-size appearance.
- [ ] Verify JSON, PNG dimensions/alpha, root and `/marswalk/` URL resolution, production output and actual HTTP serving. No hardcoded host/repository path or new app identity without agreement.
- [ ] Give coordinator the manifest link/theme-color handoff. Do not edit `src/index.html`, root/package/worker/config or scientific data. Assets alone do not prove installability/offline readiness.

## Phase 2 — Map usability and calibration integration

After Phase 1 handoff, use **`feature/willy-map-release`** if no task exists. Own `src/app/map/` and map QA only; Emma owns overall styling, coordinator owns shared state/calculation.

- [ ] Test touch/keyboard map controls, readable labels, visible focus and adequate targets. Align map control spacing/colors with Emma's agreed tokens without editing his UI/global files.
- [ ] Clarify marker-layer empty state: three contextual records may have zero located pins. Retain readable science access; never invent coordinates to populate the map.
- [ ] Move any map-specific next action beside its control; keep reset/focus/retry behavior and selected route intact. Do not hide relevant missing-data information.
- [ ] If Gaddielle establishes valid scale and coordinator accepts calibration, test the existing route display against the exact active raster. Do not invent scale, change image geometry or calculate separate competing distance state.
- [ ] Verify pan/zoom/draw/reset/focus/retry and failed/stale image handling on narrow/touch layout. Preserve single overlay and mission state.

## Phase 3 — Deployment validation, after coordinator provides URL

- [ ] Check actual HTTPS preview and production URLs: correct base path, image/manifest/icons load, no case-sensitive or nested-path 404s, private-window first visit works online.
- [ ] On the designated device, verify launcher icon/standalone appearance where installation is supported. Record exact browser/device/build and supported manual guidance if install prompts are absent.
- [ ] With Longla/coordinator test prepared installed app: disconnect, close/reopen, image/map navigation, route editing/reset/focus and JSON export. Use an isolated mission; image-only success is not a full offline pass.
- [ ] Record defects and retest affected map/assets after deployment fixes; do not change worker/hosting configuration yourself.

## Phase 4 — Final release handoff

- [ ] Supply final map/install screenshots and credits for Enzo's presentation, tied to actual deployed commit.
- [ ] Report map/assets blockers, final QA evidence and actual feature commit. No late redesign after release freeze; fix reproducible blockers only.

## Agent execution and final handoff

Preserve local changes; fetch published main and reconcile safely before starting a slice. Use the proposed branch only if no task branch already exists. No reset, force push or competing application/state store. Work on one slice at a time; hand it off for integration before starting the next dependent slice. A future contract is not an existing API.

For code changes run the relevant behavioral tests, the integrated `npm test` and `npm run build`, plus the actual affected browser workflow. Use data tests for Python/data changes. For static documents/assets, check real facts, paths/links, JSON and decoding/build output as applicable; do not add tests that merely repeat formatting. Record actual results and warnings, not baseline counts copied as new passes. Current build has initial/style warning overruns; do not raise budgets to hide them.

Each handoff includes actual **branch/commit, changed files, dependencies, commands/results, one observed workflow, remaining failures and deployment implications**. A blocked item includes the missing input/device/contract and next action. Do not fabricate numbers, coordinates, participant outcomes, timing, AI inference or hardware passes.

Normal commit/push to your assigned feature branch is authorized. Main merges belong to the coordinator. This plan prepares deployment; it does not itself publish an environment, deploy a site, submit the competition entry or authorize external messages. Preserve NASA/data/library/AI attribution.

Paste this into your coding agent:

```text
Read my personal docs/team file, TEAM_TASKS.md and CODING_AGENTS.md.
Inspect the actual branch and preserve existing work. Identify the first
unfinished, unblocked phase in my checklist and implement that slice only.
Use the listed owned files, real inputs and existing/agreed contracts.
Do not consume future APIs or modify another owner's files speculatively.
Keep all accepted behavior. Check important failure cases and the actual
user workflow; run relevant checks and review the diff before handoff.
Push only my feature branch. Report the actual commit/files/checks,
blockers and deployment effects. Do not start an unrelated redesign,
deployment or main merge. Mark completion only when supported by evidence.
```
