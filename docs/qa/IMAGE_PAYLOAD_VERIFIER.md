# Image payload verifier — W3 handoff

## Coordinator acceptance — fc79cf8

15 November 2026: merged candidate with current main passes 193 integrated Angular tests (49 verifier cases), root and `/marswalk/` production builds plus full-pack verification. This supersedes the contributor's local missing-Three.js integration blocker below for review purposes; it does not fix his Windows install or claim a deployment. Verifier remains pure/unmounted and image-only. [Review and next work](../reviews/ENZO.md#verifier-correction-fc79cf8--accepted).

- Branch: `feature/enzo-image-payload-verifier`
- Base inspected: `339a676` (`origin/main` at task start)
- Status: verifier and focused regressions implemented; full integrated checks are blocked by the local missing `three` package.

## Scope

`verifyImagePayload(index, activeImage, readBytes)` is a pure, read-only check for the two v1 image-pack entries. It first validates the active image with the existing `validManifest`, then validates the unknown index's exact keys, version, image reference, ordered paths, byte counts and lowercase SHA-256 values before calling the injected reader. It checks returned byte lengths and Web Crypto SHA-256, strictly decodes and validates the cached manifest, and requires its image reference, asset path, coordinate system and dimensions to match the active image.

The verifier does not fetch, access browser storage or CacheStorage, write data, initialize mission state, decode image pixels, or expose an app readiness state. A W6 caller must provide a reader that looks up bytes only in the selected prepared cache and returns `null` or rejects on a miss; it must not fall back to network. W6 remains responsible for verifying the app shell, science records, install assets and complete offline lifecycle.

Matching hashes show that bytes correspond to the supplied index. They are not a signature, independent scientific validation, geographic calibration, pixel-decode check or proof that the complete application is ready offline.

## Verification performed

| Check | Result |
| --- | --- |
| Focused verifier tests: `npx vitest run --environment node src/app/offline/image-payload-verifier.spec.ts` | **43 passed**. Covers success/order/known SHA-256 vector, malformed index rejection before reads, missing/rejected/invalid reader results, size/digest/Web Crypto failures, strict UTF-8/JSON and manifest identity, input immutability, no fetch/storage writes. |
| Strict targeted TypeScript check for the verifier, tests and imported core contracts | **Passed** using TypeScript 6 with strict options. |
| Browser Web Crypto proof | **Passed** in Chrome **157.0.0.0** (reported UA: `Windows NT 10.0; Win64; x64`), `http://127.0.0.1` loopback secure context. `crypto.subtle` was available and SHA-256 executed; the temporary synthetic fixture read `data/manifest.json` then `data/imagery/test.png` and returned `ok: true`, image ref `synthetic-browser-proof`, total **457 bytes**, and no errors. The proof harness was temporary and is not part of the application. |
| Full `npm test` | **Blocked before tests ran**: this checkout's `node_modules` does not contain `three`, although `three@0.187.0` is already declared and locked. Angular reports `TS2307 Cannot find module 'three'` and corresponding viewer type errors. |
| Production `npm run build` | **Blocked** by the same missing local `three` package and unresolved viewer imports. No production build pass is claimed. |

The attempted restore of the existing locked package timed out without a registry response. Neither `package.json` nor `package-lock.json` was changed. The focused suite and targeted type check run independently of that unrelated missing package.

## Integration and deployment state

This feature adds no runtime mount or readiness UI. It has no deployment effect until the coordinator reviews and integrates the branch and a production build is run successfully. Physical installation, complete prepared-cache readiness, disconnected app reopening and science/image acceptance remain separate checks.

## Windows LF compatibility handoff — 15 November 2026

After merging main `ac79be5` in merge commit `740a2a1`, the manifest working copy was refreshed to canonical LF: **1,200 bytes**, SHA-256 `40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82`. The W3 branch content remains intact. On Windows with Node `v24.20.0`, npm `12.0.2` and Git `2.55.0.windows.3`, `npm test`, `npm run build` and `npm run build -- --base-href /marswalk/` all stop before tests/pack verification because `three@0.187.0` is missing from `node_modules`; registry restore timed out. No deployment or dependency-manifest change was made.

## Reviewer correction — cross-realm byte views

The review of `c35b021` found that `instanceof Uint8Array` rejected valid bytes created in another realm, causing 11 Angular-suite verifier failures before hashing. The verifier now confirms an actual Uint8Array view through `ArrayBuffer.isView` and the intrinsic typed-array name getter, then copies it into the module's realm. DataView, strings, signed/other typed arrays and failed copies remain rejected; size, SHA-256, manifest identity and failure semantics are unchanged.

| Check after correction | Result |
| --- | --- |
| Focused Node verifier suite | **48 passed, 1 skipped**. The skipped case needs a document/iframe realm. |
| Focused jsdom verifier suite | **49 passed**, including same-realm subarray offsets, a foreign-realm Uint8Array subarray, and DataView/other typed-array rejection. |
| Strict targeted TypeScript check | **Passed**. |
| Browser WebCrypto and cross-realm proof | **Passed** in Chrome **157.0.0.0** on a loopback secure context. The manifest reader returned a foreign-realm subarray for which `foreignBytes instanceof Uint8Array` was false; Web Crypto SHA-256 still verified both paths in order. Result: `ok: true`, image ref `synthetic-browser-proof`, **454 bytes**, no errors. Test-only fixture; no app integration. |
| Full `npm test` after correction | **Blocked before tests ran** by missing local `three@0.187.0`; Angular reports unresolved Three.js imports. |
| Root and `/marswalk/` production builds after correction | **Both blocked** at Angular compilation by the same missing package; pack verification did not run. |

The reviewer’s earlier Linux result for `c35b021` (176/187 Angular tests and both builds passing) is pre-correction evidence, not an after-fix integrated pass. The final integrated Angular suite/build still needs to run in an environment with the locked dependency installed. No new dependency or deployment was introduced by this correction.

## Files in this slice

- `src/app/offline/image-payload-verifier.ts`
- `src/app/offline/image-payload-verifier.spec.ts`
- `docs/qa/IMAGE_PAYLOAD_VERIFIER.md`
