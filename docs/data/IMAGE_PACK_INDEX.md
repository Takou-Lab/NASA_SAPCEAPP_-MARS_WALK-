# MARSWALK — Offline Image-Pack Index & Tooling

<!-- CURRENT_WORK_PLAN -->
> **Data/reference record.** Preserve source facts, hashes and coordinate limits. Current work is [W2](../../TEAM_TASKS.md#w2); app-wide PWA lifecycle belongs to [W6](../../TEAM_TASKS.md#w6), not this image inventory.
<!-- /CURRENT_WORK_PLAN -->

**Current implementation note:** the real committed index passes its checks and all 28 current Python tests pass. The coordinator closed R3 encoded/whitespace rejection in main integration `b744b0b`; see [the exact review](../reviews/GADDIELLE.md). The schema and runtime browser-path restrictions now agree; source assets and the real index are unchanged.

## Purpose & Overview

This document specifies the machine-readable inventory contract for the MARSWALK offline image data pack, implemented by `tools/data/build_image_pack.py` and serialized to `public/data/image-pack.json`.

The image-pack index provides the coordinator with an exact, deterministic manifest of the image assets required for offline rendering. It enables automated precache asset resolution, cache validation, and integrity auditing without manual inspection.

> [!IMPORTANT]
> **Boundary Notice — Image Payload Scope:**
> This index accounts **only** for the two client image runtime assets: the mission manifest (`data/manifest.json`) and the prepared map texture (`data/imagery/PIA26306_derived_2048.jpg`).
> - The **index itself** (`image-pack.json`) is excluded to prevent cyclic self-hashing.
> - The **archival master** (`PIA26306.jpg`), **science records** (`data/markers.json`), and **Angular application shell/bundles** are excluded.
> - Generating or checking this index verifies local file presence and bitstream integrity; it does **not** prove service-worker precaching, browser installation, or end-to-end PWA offline readiness.

---

## 1. Schema Specification (Version 1)

The index file (`public/data/image-pack.json`) adheres to the following JSON schema:

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

### Field Definitions

| Field | Type | Description |
| :--- | :--- | :--- |
| `schemaVersion` | `integer` | Must be `1`. Identifies the structure of this inventory contract. |
| `imageRef` | `string` | The active unique image derivative identifier matching `manifest.json`. |
| `files` | `array` | Exactly two ordered entries: manifest first, prepared derivative second. |
| `files[i].path` | `string` | App-base-relative path with forward slashes (no leading slash, traversal, or absolute path). |
| `files[i].bytes` | `integer` | Exact file size on disk in bytes. |
| `files[i].sha256` | `string` | Full 64-character lowercase hexadecimal SHA-256 digest. |
| `totalBytes` | `integer` | Sum of `bytes` across the two declared files (`1200 + 523272 = 524472`). |

---

## 2. CLI Tool: `tools/data/build_image_pack.py`

### Generation Mode (Atomic Write)

To generate or update `public/data/image-pack.json` from verified source files:

```bash
python tools/data/build_image_pack.py \
  --manifest public/data/manifest.json \
  --public-root public \
  --output public/data/image-pack.json
```

**Generation Behavior:**
1. Validates path confinement: ensures `--manifest` resolves strictly to `data/manifest.json` within `--public-root`. Emitted browser asset paths must use forward slashes and must not contain URL schemes/authorities, query parameters (`?`), fragment identifiers (`#`), backslashes (`\`), absolute roots, empty/dot/traversal segments, or symlink escapes outside the root.
2. Validates that `--output` does not alias either source file (`manifest.json` or `PIA26306_derived_2048.jpg`).
3. Invokes `verify_pack.verify_package` to confirm manifest schema validity, full pixel decoding via Pillow (`img.load()`), and exact dimensions (`2048 × 1042`).
4. Constructs the canonical dictionary in memory.
5. Writes the file atomically via a temporary file, `os.fsync()`, and `os.replace()`, ensuring that any input failure leaves previous files untouched.

### Verification Mode (`--check`)

To verify whether the existing index file matches the current disk assets without modifying any file:

```bash
python tools/data/build_image_pack.py \
  --manifest public/data/manifest.json \
  --public-root public \
  --output public/data/image-pack.json \
  --check
```

**Check Behavior:**
- Completely read-only: does not create, rewrite, or touch any file, and does not create missing target directories.
- Validates the complete structural shape and strict scalar types of the JSON index before comparing payload values:
  - Root must be an object with exactly `{"schemaVersion", "imageRef", "files", "totalBytes"}` (rejecting lists, primitives, and extra keys without tracebacks).
  - `schemaVersion` must be integer `1` (strictly excluding booleans).
  - Byte fields (`files[i].bytes`, `totalBytes`) must be positive integers (strictly excluding floats and booleans).
  - File entries must have exact keys `{"path", "bytes", "sha256"}`, valid app-relative browser paths, and 64-character lowercase hexadecimal SHA-256 digests.
- If verification fails (stale, tampered, invalid schema, or missing index), exits code `1` with descriptive errors while preserving the existing file's exact bytes and modification time (`mtime`).
- Returns exit code `0` if and only if the index exists, parses cleanly, satisfies all schema constraints, and exactly matches the computed payload.

---

## 3. Automated Test Regressions

The test suite in `tools/data/test_build_image_pack.py` validates 24 automated regression cases:
1. `test_generate_real_package_matches_expected_schema_and_values`: Generates real index and verifies schema, paths, hashes, and byte sums.
2. `test_deterministic_identical_generation`: Confirms repeated executions produce byte-identical JSON.
3. `test_check_mode_passes_fresh_index_without_modifying`: Confirms `--check` passes fresh index without changing `mtime`.
4. `test_check_mode_fails_on_missing_index`: Confirms missing output triggers exit `1`.
5. `test_check_mode_fails_on_tampered_hash_or_bytes`: Confirms altered SHA-256 fails.
6. `test_check_mode_fails_on_tampered_total_bytes`: Confirms mismatched `totalBytes` fails.
7. `test_corrupt_or_truncated_image_fails_and_preserves_existing_output`: Confirms truncated image rejects generation and leaves pre-existing file intact.
8. `test_missing_image_fails_and_preserves_existing_output`: Confirms missing image preserves output.
9. `test_output_aliasing_input_is_rejected_safely`: Confirms attempting to overwrite manifest or image is blocked.
10. `test_escaping_path_is_rejected`: Confirms path traversal escapes outside public root are rejected.
11. `test_noncanonical_manifest_path_is_rejected_and_preserves_output`: Confirms noncanonical manifest names under public root fail exit `1` without writing.
12. `test_image_path_with_query_is_rejected_and_preserves_output`: Confirms asset paths with `?` fail exit `1` without writing.
13. `test_image_path_with_fragment_is_rejected_and_preserves_output`: Confirms asset paths with `#` fail exit `1` without writing.
14. `test_image_path_with_backslash_is_rejected_and_preserves_output`: Confirms asset paths with backslashes fail exit `1` without writing.
15. `test_symlink_escape_is_rejected`: Confirms symlink paths resolving outside public root are safely rejected.
16. `test_check_fails_on_schema_version_boolean`: Confirms `schemaVersion: true` fails exit `1` with schema error and preserves `mtime`.
17. `test_check_fails_on_float_bytes_and_preserves_file`: Confirms JSON float bytes (e.g. `1200.0`) fail exit `1` and preserve `mtime`.
18. `test_check_fails_on_extra_keys_and_preserves_file`: Confirms unexpected keys at root or file entries fail exit `1` and preserve `mtime`.
19. `test_check_fails_cleanly_on_root_list_no_traceback`: Confirms root `[]` fails cleanly with exit `1` without unhandled traceback.
20. `test_check_fails_cleanly_on_root_primitive_no_traceback`: Confirms primitive root JSON fails cleanly with exit `1` without traceback.
21. `test_check_does_not_create_missing_path_or_parent_directory`: Confirms `--check` on nonexistent target creates neither directory nor file.

To run the complete data tools test suite (28 tests total: 24 indexer regressions + 4 package verifier regressions):

```bash
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tools/data -p 'test_*.py' -v
```

---

## 4. Handoff to Coordinator (PWA Integration)

For future PWA service-worker precaching, the coordinator can ingest `public/data/image-pack.json` to:
1. Obtain the exact list of image URLs to precache: `data/manifest.json` and `data/imagery/PIA26306_derived_2048.jpg`.
2. Verify cached response sizes and digests against `files[].sha256`.
3. Display the verified offline image payload size (`524,472 bytes` / `~512 KB`) in the UI storage/offline indicator.


### R3 closure

The coordinator added rejection/regressions for percent-encoded traversal/filenames, trailing spaces and whitespace/control characters. Generation/check fail safely with existing output bytes/mtime preserved. Current total is 28 data tests; this remains an image-only inventory, not full PWA readiness.
