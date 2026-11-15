# Install asset handoff — coordinator starter implementation

Source **`8a4dadc`**, **15 November 2026**. Coordinator supplied these while teammates were unavailable; Willy retains visual review/refinement and deployed-device validation. Do not recreate already-provided assets blindly; compare and preserve any local work.

- `public/manifest.webmanifest`: valid UTF-8 JSON, relative `./` start/scope, standalone, English name/description, matching `#0b0e14` colors, correct relative PNG icon declarations.
- Original geometric Mars/mountain mark in `public/icons/marswalk.svg`; coordinator/Codex-assisted design, not NASA's official branding. PNGs were drawn with Pillow from the same geometry, rendered at 1024px and downsampled with Lanczos. No external illustration/license source was used.
- `marswalk-192.png` and `marswalk-512.png` fully decode as RGB at 192×192/512×512; `marswalk-maskable-512.png` is opaque RGB at 512×512. Essential artwork lies within radius 174px on the 512px canvas, inside the 204.8px maskable safe radius.
- Root/index manifest discovery link and theme-color are already wired centrally. No new application dependency or source imagery change.
- Root and actual `/marswalk/` production builds served correct relative assets; Chromium manifest diagnostics and non-incognito installability diagnostics return no errors. [Full evidence](PWA_FOUNDATION.md).

Actual target-device installation/launcher appearance is pending. Willy's next work: inspect/refine the original mark and launcher-size appearance, verify actual host paths/standalone/device behavior, then continue his map-release checklist. A visual refinement changes manifest/icon hashes and requires a fresh full production build/pack and update test; do not replace deployed files outside that build.
