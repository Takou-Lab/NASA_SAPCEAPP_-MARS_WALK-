# Emma — Browser image-payload verification after evidence UI delivery

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W3](../../TEAM_TASKS.md#w3).** The new slice is a pure read-only verifier delegated from coordinator PWA preparation.
<!-- /CURRENT_WORK_PLAN -->

Emma uses **he/him**. Read [the current review](../reviews/EMMA.md), [exact new task](tasks/EMMA_IMAGE_PAYLOAD_VERIFIER.md), [shared contract](CODING_AGENTS.md) and [SOUL.MD](../../SOUL.MD).

## Completed — preserve it

Science/research/protocol/presentation, science UI `4efcb5a` and **evidence workspace `3b7b1c1`** are accepted. Science discovery and both confidence/passport panels are now mounted in code **`b744b0b`**: **131 combined Angular tests**, production build and actual recovery/filter/evidence/layout browser checks pass. Your isolated branch passed 69 tests/build. Do not repeat those implementations or redo the evidence audit/presentation.

Enzo has integrated the existing reviewed `app-science-context`, `app-exploration-confidence` and `app-image-passport`; those components are available, not future files. His next task is release UI accessibility/size cleanup; root reconciliation is complete. Your next slice does not edit his files or the accepted UI.

## New work — verify image bytes without claiming full readiness

Implement **`src/app/offline/image-payload-verifier.ts`**, its spec and `docs/qa/IMAGE_PAYLOAD_VERIFIER.md` using [the exact planned contract](tasks/EMMA_IMAGE_PAYLOAD_VERIFIER.md):

```ts
verifyImagePayload(index, activeImage, readBytes): Promise<ImagePayloadResult>
```

This API is to be implemented; it does not exist yet. Read an unknown v1 image index, validate it against the active runtime ImageManifest before any reads, verify two supplied byte arrays by length/SHA-256, validate manifest identity and return a scoped result. `readBytes` is supplied by the future caller; no network fallback or storage writes. Errors return failure without publishing partial readiness or changing mission state.

W6 composes this image-only result with app shell/science/install/cache checks later. It is not a worker, service, progress UI, independent scientific verification or full-PWA readiness signal.

## Branch, checks and ownership

After integration publication, preserve local work and start proposed **`feature/emma-image-payload-verifier`** from latest main if no follow-up branch exists. Keep the completed workspace branch/history. Own only the three named verifier/test/handoff files for this slice; no core/model/source-data/Python/worker/package/root/Enzo/UI changes or new dependency.

Follow the spec's success/failure fields and negative cases. Use test-only byte fixtures and actual WebCrypto where supported; a temporary harness with existing build tools can prove browser operation without leaving a root/production mount. Run actual tests/build and record exact counts/browser/source identity limits. Full installed/offline outcomes remain pending.

Commit/push only your assigned W3 task branch (default above), reporting actual name/commit/files/checks. No main integration, deployment, environment publication, submission or external messaging.

## Retained learning answer — computed record badge

```ts
readonly recordBadge = computed(() => {
  const records = this.mission.markers();
  const located = records.filter(
    record => record.position !== null && record.positionStatus !== 'unavailable',
  ).length;
  return `${records.length} records (${located} located on image)`;
});
```

Render `{{ recordBadge() }}`. The accepted component now implements this and distinguishes illustrative from verified locations. Do not store a separate counter or repeat the finished variation.

## Copy-paste coding-agent prompt

```text
You are Emma's MARSWALK read-only image-payload verification agent (he/him).
Read TEAM_TASKS.md W3, docs/team/EMMA.md,
docs/team/tasks/EMMA_IMAGE_PAYLOAD_VERIFIER.md, docs/reviews/EMMA.md
and docs/team/CODING_AGENTS.md.

Workspace 3b7b1c1 is accepted/mounted in code b744b0b: 131 combined Angular tests,
build and real browser checks pass. Preserve finished UI/research/protocol/
presentation; no repeats. Enzo integrates the three existing evidence/science
components. Your new task feeds coordinator PWA preparation independently.

1. Preserve work; after publication create proposed
   feature/emma-image-payload-verifier from latest main if no task exists.
2. Own offline/image-payload-verifier.ts, its spec and the named QA handoff.
   Implement the detailed task's exact planned exports/result semantics.
3. Validate unknown v1 index and active runtime manifest before reader calls;
   exact ordered paths, imageRef, types/keys/safe sizes, SHA-256 and totals.
4. Read bytes only through caller-supplied readBytes. Check lengths/digests
   using WebCrypto and manifest UTF-8/JSON/runtime validity/identity. Catch
   missing/read/crypto/validation errors; fail without writes/mutations or
   partial success. No network fallback, worker, store or readiness UI.
5. Add meaningful success/corruption/missing/reader/crypto/schema/path/identity
   tests, actual test/build results and supported browser WebCrypto proof.
   Synthetic byte fixtures stay test-only. Explain the cache-only reader
   handoff and full-app assets W6 must verify separately.

No core/models/service/data/Python/package/root/Enzo/UI edits or dependencies.
This result is IMAGE-PAYLOAD only; no full-PWA/science/calibration claim.
Commit/push only this feature task branch (authorized), report branch/commit/
files/checks/limits for review. No main merge, deployment, publication,
submission or external messaging. Teach one new slice at a time.
```
