# Public science candidate — 38516f8

Published 15 November 2026 UTC at explicit user request for public tester access and bounded numerical context.

- **Public preview:** https://marswalk-pfoqdsf41-boys-band.vercel.app/
- **Source:** 38516f8, clean source at deployment. Includes Emma UI, Enzo Agent 1 navigation 2b2a708, environment contract/panel and limited submitted REMS excerpt.
- **Deployment:** dpl_76a6UfPh2mmRxsLQT3Yh6YW64hJH, READY, preview target.
- **Pack:** `a80ff718c27e0ee51b6b44c06ff13d45b762ee024ff7ab54e34d9f24b8a00c12`, 19 files, 1678076 bytes.
- **Access:** MARSWALK project preview SSO protection disabled at user request. Anonymous HTTPS request returns **200**; fresh browser uses no protection token, bypass cookie or Vercel login. Other project settings/accounts unchanged. Old preview links are now public too, but serve their original revisions.
- **Production:** marswalk-jet.vercel.app has not been promoted; it remains the older separately documented release. Use this new candidate for testing/screenshots.

## Numerical scope and provenance

Pressure mean **800.335 Pa**, air-temperature mean **204.700 K**, 25 selected samples each, from Gaddielle's submitted Sol 3900 excerpt. Actual runtime data/processing are reproducible via tools/data/build_reviewed_environment.py and its regression tests. The UI explicitly says **Limited source review — excerpt only**. Original NASA archive download remains blocked here, so this is not independently archive-authenticated NASA byte provenance, a complete-sol average, live weather, map-wide conditions or operationally certified instrument data. Parent-product UTC interval is labeled separately from exact excerpt coverage. Original source/extraction contribution credited to Gaddielle; bounded admission/generator by coordinator. Daily dataset and unresolved original extractor remain unmerged.

## Newly run verification

- **223 Angular tests / 20 files**, including Enzo navigation and environment admission/presentation cases, pass.
- **54 Python data tests** pass, including exact excerpt summary/sample/runtime regeneration checks.
- Build and provider build pass. Initial **450.97 kB** below unchanged warning budget; existing Leaflet CommonJS warning remains. Existing worker suite is unchanged; prior 11-pass result retains its scope rather than being claimed rerun here.
- Anonymous HTTP downloads for all 19 assets match local sizes/SHA-256. Artifact audit uses x-vercel-skip-toolbar to suppress provider preview HTML injection only; no protection bypass header. Missing archive/data/worker requests return 404; apple-touch-icon present.
- Fresh unauthenticated Chromium persistent profile: limited-source warning and two displayed quantities, previous/next navigation with correct filtered position, real imagery/full preparation, actual route/waypoint/destination, successful note save/export and wrong-image import rejection.
- Full browser-process shutdown and relaunch disconnected before navigation: imagery/science/route/note recovery via explicit Load Route and export match saved mission. Optional flat 3D opens/closes offline. At 390px no horizontal page overflow. Normal-flow page errors absent.

Managed cloud proxy and isolated environment-CA pinning remain as documented in earlier preview evidence; this is not a browser requirement for normal visitors. Script reused old production labels in temporary output; actual tested origin is this public preview. Temporary logs/results /tmp/public-science-*; screenshot /workspace/artifacts/marswalk-public-science-offline.png. No personal missions/tokens/browser profiles committed.

## Tester actions

Royce: verify Samsung installed close/reopen and explicit Load Route before saving anything, confirm observations before/after export. This browser pass does not close the device-specific report. Willy Agent 2: public icon/install/actual device checks; no new Willy push beyond reviewed 9b4093d was present at this review. Enzo Agent 1: navigation accepted; test actual candidate keyboard/filter bounds. Enzo Agent 2: truthful screenshots/demo and source-corrected explanation proposal; no runtime AI integrated. Emma: deployed UI checks; Agent 2 briefing remains separate. Preserve existing missions when changing preview origins: local storage is origin-specific.

Physical Android/iOS/user acceptance and final competition submission remain pending. No production alias promotion or automatic Git integration configured by this task.
