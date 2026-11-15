# Image payload verifier — W3 handoff

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

## Files in this slice

- `src/app/offline/image-payload-verifier.ts`
- `src/app/offline/image-payload-verifier.spec.ts`
- `docs/qa/IMAGE_PAYLOAD_VERIFIER.md`
