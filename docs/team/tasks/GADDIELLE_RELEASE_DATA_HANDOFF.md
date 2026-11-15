# Gaddielle — Release data/cache handoff

> **Completed:** `0514da1` is accepted with coordinator byte/hash/cache-membership corrections. This specification is historical. Current numerical-data assignment and agent prompt are in [GADDIELLE.md](../GADDIELLE.md). Do not repeat this handoff.


The coordinator closed R3 during `b744b0b`; all 28 Python tests and the real index check pass. Preserve your merged image/passport/index work. Do not repeat R1–R3, reacquire imagery or regenerate the scientific pack. Preserve any unpublished local fix and compare it with main before proceeding.

Continue the existing data branch, merge published main safely and deliver **`docs/data/RELEASE_DATA_HANDOFF.md`**, with only necessary factual updates to `docs/data/IMAGE_PACK_INDEX.md` / `OFFLINE_DATA_PACK.md`.

- Enumerate actual runtime data: `data/manifest.json`, its prepared image, `data/markers.json` and the existing image-index control file. Record exact imageRef, byte sizes and SHA-256 from current files.
- Separate image payload (524,472 bytes), science bytes and index/control bytes. No combined number may be labeled full app size/readiness; shell/icons/install manifest/worker are additional W6 responsibilities.
- Verify production output copies these files byte-identically, with commands/results and the tested code/build. Confirm root/subpath URL resolution as supported.
- Give W6 a precise include/exclude handoff. The archival master and terrain/readme/reference documents are not essential runtime data for current code; avoid an indiscriminate data-directory precache. External citation pages are outside the offline pack.
- Keep current schema, image/index bytes, calibration and terrain limitations unchanged. The index excludes itself by design. Do not introduce a new inventory schema, worker or app API without coordination.

Run relevant existing verification and report actual results. Do not create mirror tests for document formatting or claim cache/install outcomes from a file listing. Commit/push only this existing feature branch with the handoff; no main integration, deployment, environment publication or messaging.
