# Gaddielle — Generate the offline image-pack index

**Current review:** the implementation is delivered at `bf9689b`; 14 tests and the real index check pass. Before approval, fix R1/R2 in [the review](../../reviews/GADDIELLE.md) and use [the updated agent prompt](../GADDIELLE.md). Preserve existing work and this contract; do not restart the task.

## Why this is the next task

Your imagery, verifier and corrected Data Passport at `c887286` are approved and integrated. Keep them unchanged. The coordinator now needs a deterministic machine-readable inventory to prepare and check the image portion of the future PWA cache.

This is a small coding task using the files already delivered. It does not require new Mars data, image processing, calibration, a service worker or a change to ImageManifest.

Read [your brief](../GADDIELLE.md), [the accepted review](../../reviews/GADDIELLE.md), [the shared contract](../CODING_AGENTS.md) and [SOUL.MD](../../../SOUL.MD).

## Owned deliverables

| File | Purpose |
| --- | --- |
| `tools/data/build_image_pack.py` | Generate/check the inventory offline |
| `public/data/image-pack.json` | Generated index for the current manifest and prepared image |
| `tools/data/test_build_image_pack.py` | Meaningful generation/staleness/failure regressions |
| `docs/data/IMAGE_PACK_INDEX.md` | Schema, commands, byte-count boundary and coordinator handoff |

Reuse the existing Pillow dependency and verifier. Coordinate an import adjustment only if strictly necessary; do not change accepted verifier behavior, shared core, dependencies or source assets.

## Exact version 1 contract

The generated file has exactly these top-level fields:

```json
{
  "schemaVersion": 1,
  "imageRef": "hirise-mro-pia26306-boxwork-2048x1042-v1",
  "files": [
    {
      "path": "data/manifest.json",
      "bytes": 1200,
      "sha256": "40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82"
    },
    {
      "path": "data/imagery/PIA26306_derived_2048.jpg",
      "bytes": 523272,
      "sha256": "7b814497d98d7e5fb89dd122c65b01c32e5c2099b039ef62887a606af199bfa8"
    }
  ],
  "totalBytes": 524472
}
```

These are the current file values, not constants to hard-code into the generator. Read the manifest's active imageRef/path and compute sizes/hashes from actual bytes every time.

Rules:

- File order is manifest first, its referenced prepared image second.
- Paths are app-base-relative, use forward slashes and have no leading slash, URL, query, fragment, absolute machine path or traversal.
- Resolve paths within the selected public root and reject escapes, including symlinks. The manifest must correspond to `data/manifest.json` inside that root so the emitted path is accurate.
- `sha256` is the full lowercase hex digest; `bytes` is the actual byte length, not decoded image memory size.
- `totalBytes` is the sum of the two declared payload files only.
- Exclude the archival master, science records, Angular build assets and the index itself. Excluding the index avoids a self-hashing cycle.
- The coordinator must account for the index, science records and built shell separately when defining the complete PWA pack. This image-only total does not mean complete app storage, offline readiness or installation size.
- No timestamps, generated UUIDs, credentials, platform-specific paths or other nondeterministic fields.

This is a separate inventory contract. Do not implement the Data Passport's proposed v2 interface or alter the existing ImageManifest schema.

## CLI behavior

Generate:

```sh
python tools/data/build_image_pack.py \
  --manifest public/data/manifest.json \
  --public-root public \
  --output public/data/image-pack.json
```

Read-only verification:

```sh
python tools/data/build_image_pack.py \
  --manifest public/data/manifest.json \
  --public-root public \
  --output public/data/image-pack.json \
  --check
```

1. Reuse the existing full-image `verify_package` validation before declaring success. Require Pillow; do not introduce a header-only fallback or any network request.
2. Compute the expected inventory from the verified current payload. Fail clearly for missing, unreadable, invalid or truncated inputs.
3. Normal generation produces stable UTF-8 JSON with consistent formatting and a final newline. Repeated runs with unchanged inputs produce identical bytes.
4. Write the intended generated output atomically. Input failure must leave an existing output untouched. Reject an output path that aliases either input; never overwrite the source manifest or image.
5. `--check` never writes. It exits zero only when the existing index is valid and matches the current payload, ordering, hashes and totals. A missing, malformed, stale or tampered index fails with a nonzero exit and useful message.
6. Hash matching detects mismatch/staleness; it is not independent scientific-source verification.

## Required checks

Use temporary test directories for negative cases; never damage committed images or metadata.

- Generate an index for valid inputs; verify both paths, sizes, digests and summed total.
- Regenerate unchanged input and confirm byte-identical output.
- Confirm `--check` passes a fresh index and does not alter it.
- Tamper an index hash/total or use a changed valid temporary image; confirm a stale index fails.
- Confirm missing/corrupt image or invalid manifest fails and preserves any existing output.
- Confirm an escaping input path and an output aliasing an input are rejected.
- Keep all four existing verifier regressions passing.

Run and report the actual commands and results, for example:

```sh
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_*.py' -v
python tools/data/build_image_pack.py --manifest public/data/manifest.json --public-root public --output public/data/image-pack.json --check
```

Do not rerun unrelated Angular suites merely for this isolated Python/data-inventory task unless your changes affect the application. Do not claim full PWA/offline-device testing from these checks.

## Branch, learning and handoff

After this integration is published, preserve local work and merge the latest `origin/main` into your existing `feature/gaddielle-data-preparation` branch. Do not reset, recreate the project, regenerate imagery or repeat the completed passport corrections.

Explain one small slice at a time using the team's learner checkpoint. Start with reading/verifying inputs and producing the two-entry inventory, then add deterministic writing and check mode.

Commit and push only your feature branch; this task authorizes that normal push. Hand off the commit, four deliverables, exact generated byte total, test results and the complete-app boundary to the coordinator. No main merge/push, deployment, environment publication or external messaging is included.
