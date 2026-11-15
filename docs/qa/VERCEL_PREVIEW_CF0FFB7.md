# Isolated Vercel preview — cf0ffb7

Deployed and verified 15 November 2026 UTC at explicit user request. **Production alias unchanged.**

- Source: **cf0ffb7**, clean checkout; includes coordinator evidence clarity de8dfdd, iOS icon discovery and accepted verifier. Emma's later unsubmitted UI and optional AI/VR are not included.
- Preview: **https://marswalk-m3n37k8ne-boys-band.vercel.app/**
- Deployment: `dpl_6zRzfchNEVi6scyiqL4stZLmdcJe`, READY, preview target.
- Provider inspection: https://vercel.com/boys-band/marswalk/6zRzfchNEVi6scyiqL4stZLmdcJe
- Pack: `4bb8ec987ae0320abd399e40660e75194763ed1622d4df7a4268902faafc2e81`, 18 files, 1656553 bytes.
- Production remains https://marswalk-jet.vercel.app/, last documented source b6669fb, inventory prefix 95d8b5f6ee7a reconfirmed this turn. No promotion occurred.

## Access and artifact checks

Preview is protected by existing Vercel authentication; an anonymous request returns HTTP 302 to the authentication flow. Team members need Vercel access. Coordinator checks used the existing automation bypass, kept out of Git/chat/URLs. These are authenticated preview checks, not anonymous public acceptance. No project-wide protection policy changed.

All 18 artifact byte sizes/SHA-256 match the local build; manifest/icon/worker paths resolve, apple-touch-icon is present, and missing archive/data/worker requests return 404. Vercel injects preview feedback-toolbar JavaScript into navigated HTML. The artifact-byte audit explicitly used `x-vercel-skip-toolbar: 1` to suppress that injection while comparing original build bytes; this header is not an end-user requirement. Ordinary preview browser full-pack preparation still passes. Do not describe transformed navigated HTML as byte-identical without that qualification.

## Newly run checks

- `npm test`: **194 pass / 17 files**.
- `npm run test:pwa`: **11 pass**.
- `npm run build`: compilation/full-pack pass; initial **434.99 kB** within unchanged warning budget; Leaflet CommonJS warning remains.
- Actual provider build: READY with matching runtime inventory.
- Chromium persistent isolated profile on preview: real imagery, complete offline preparation, actual route drawing/save, notebook save and mission export; wrong-image import rejects without altering route.
- Close the full browser process, relaunch the same profile disconnected before navigation: image/science load, explicit Load Route restores exact saved route and observations, and export matches.
- Prepared optional flat 3D opens/closes disconnected. 390px layout has no horizontal page overflow; normal-flow page errors absent.

Browser uses inherited managed proxy and pins only environment-provided proxy CA in this isolated test process, as described in VERCEL_PRODUCTION.md. First navigation established authorized preview access without printing credentials. Persistent profile retains that authorization across the disconnected restart. This does not establish that preview authentication remains usable indefinitely offline or provide public access.

Temporary test logs/results: /tmp/preview-*, /tmp/marswalk-preview-browser*. Screenshot: /workspace/artifacts/marswalk-preview-offline.png. Durable method/results are recorded here; no secrets or browser profiles committed.

## Next acceptance

Royce: retest the Android missing-note report on this exact preview if account access is available; confirm Save Observation, export observations, disconnected app restart, explicit Load Route, Notebook and second export. Record full device/build/pack identity. This browser result does not close his device issue. Willy Agent 2: current-host icon/raster/install checks against the designated preview with access, preserving existing missions. If Vercel access blocks a tester, record it; do not bypass project policy by sharing automation secrets.

Emma may continue his current slice. After review, deploy an updated candidate and repeat affected checks. Promotion to public production and competition submission remain separate actions, not performed here. Physical Android/iOS home-screen and outside-user acceptance are still pending actual observations.
