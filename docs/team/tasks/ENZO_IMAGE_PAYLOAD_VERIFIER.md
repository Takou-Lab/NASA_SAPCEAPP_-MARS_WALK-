# Enzo — Read-only browser image-payload verification

Current piece **W3**, delegated from coordinator PWA preparation after accepted science/evidence workspace `3b7b1c1`. Preserve the mounted science filters/confidence/passport panels. No repeat research, UI construction or presentation rewrite.

This is a **new planned module**, not an existing API. W6 will later compose it with complete app-cache and installation checks. An image-only success must never become a full-PWA readiness claim.

## Branch and owned files

After publication of the accepted integration, preserve local work and create proposed **`feature/enzo-image-payload-verifier`** from latest main if no follow-up already exists. Keep the accepted workspace branch/history.

- `src/app/offline/image-payload-verifier.ts`
- `src/app/offline/image-payload-verifier.spec.ts`
- `docs/qa/IMAGE_PAYLOAD_VERIFIER.md`

Own only this module/tests/handoff for the new slice. Import current `ImageManifest` and pure `validManifest` as needed. No MissionService edits/injection, root/shell mounting, worker, package, source data or Python-tool changes; no new dependency.

## Exact exported contract to implement

```ts
export type ReadAssetBytes = (path: string) => Promise<Uint8Array | null>;

export interface ImagePayloadResult {
  readonly scope: 'image-payload';
  readonly ok: boolean;
  readonly imageRef: string | null;
  readonly verifiedPaths: readonly string[];
  readonly totalBytes: number | null;
  readonly errors: readonly string[];
}

export function verifyImagePayload(
  index: unknown,
  activeImage: ImageManifest,
  readBytes: ReadAssetBytes,
): Promise<ImagePayloadResult>;
```

The caller supplies a **cache-only reader** in later W6 integration. The module itself must not fetch network data, register workers, access CacheStorage/localStorage, write anything, change signals, expose progress/install states or initialize MissionService. Reader rejection/missing data is a failure, not a reason to fetch a substitute.

## Validation and success semantics

1. Validate `activeImage` with the current runtime contract, then the unknown index **before invoking the reader**. Require exactly the existing v1 root keys (`schemaVersion`, `imageRef`, `files`, `totalBytes`); integer 1, matching nonempty imageRef; exactly two ordered file objects with only `path`, `bytes`, `sha256`; positive safe-integer lengths/total and full lowercase 64-hex digests. Total must equal the two lengths without unsafe arithmetic.
2. Paths must be **exactly** `data/manifest.json` then `activeImage.assetPath`. Runtime validation of the active image supplies the existing browser-path restrictions. Reject wrong references, extra/missing entries/keys, booleans/float sizes, URL/absolute/traversal/percent/whitespace paths before reading. Do not broaden the Python index contract or runtime schema.
3. Read those exact bytes through the supplied function. Require byte lengths to match declarations; compute SHA-256 with browser WebCrypto and compare full digests. Return useful errors for missing/read/size/digest/crypto failures. Catch operational failures and return `ok: false`; never silently accept unavailable crypto or use a noncryptographic fallback.
4. Decode the manifest bytes as strict UTF-8 JSON and validate them with `validManifest`. Require its `imageRef`, `assetPath`, `coordinateSystem`, width and height to match `activeImage`. No repairing/migrating invalid records. All inputs remain unchanged.
5. Success returns `scope: 'image-payload'`, `ok: true`, matching imageRef, the two verified paths in order, actual summed bytes and empty errors. Failure returns the same scope, `ok: false`, empty verifiedPaths, null totalBytes and nonempty errors; report the active imageRef only when its manifest is valid.

SHA matching checks correspondence with the supplied expected index; it is not a digital signature, independent scientific verification, geographic calibration or proof that the complete app cache is ready. This pure byte verifier does not decode image pixels; existing Python preparation and browser map decode/dimension checks remain distinct.

The image-only index excludes itself, science records, icons/manifest and built app shell. W6 verifies those separately and owns final readiness. Do not add UI or a competing offline state service to this module.

## Meaningful tests and browser proof

Use small **test-only** byte fixtures, a synthetic valid manifest and independently known/computed expected SHA-256; never change public scientific files.

- Successful bytes, order, reference and exact total; demonstrate actual WebCrypto in a supported browser environment.
- Missing file, reader rejection, wrong byte length, corrupt bytes/digest and unavailable/rejected crypto all return failure without throwing or writing.
- Invalid root/types/keys/version/reference/ordering/paths fail **before reader calls**. Include NaN/infinity/unsafe integers as direct unknown input cases where appropriate.
- Hash-matching but invalid/wrong-identity manifest bytes still fail; strict UTF-8/JSON and dimension/path/reference mismatches are rejected.
- Input index/bytes and unrelated mission/storage remain untouched. Empty results on failure cannot be mistaken for a prepared complete app.

Run the actual full `npm test` and `npm run build`; no new dependency or mirrored formatting tests. Record real counts/results and WebCrypto/browser details in the handoff. Explain how W6 wraps a CacheStorage-only byte reader and combines this result with other required assets, while explicitly keeping full installed/offline checks pending.

Commit/push only the assigned W3 feature branch (default above) with actual name/commit/files/checks/limits. No main integration, deployment, environment publication, submission or external messaging.
