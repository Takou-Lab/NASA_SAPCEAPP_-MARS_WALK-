# Install asset handoff — coordinator starter implementation

## Willy audit follow-up — 15 November 2026

Willy reports an independent Antigravity read-only audit passed manifest/icons/relative-path/maskable checks. This is contributor-reported evidence, not a new coordinator physical-device pass. No new Willy feature branch or asset commit is published at review time.

Coordinator added a relative `apple-touch-icon` link in `src/index.html` to the existing opaque 192×192 PNG, declared at its actual size. This reuses an existing prepared-pack asset, supports root/subpath resolution and does not claim iOS launcher validation. No Pillow installation is required for Willy or Emma to use the assets. PNG files were independently decoded at their declared dimensions as RGB.

Coordinator checks: root and `/marswalk/` production builds both pass, including full pack verification. Parsed icon links resolve under both bases; built PNG matches the source bytes. These checks do not establish physical iOS installation.

### Current source asset fingerprints

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `public/manifest.webmanifest` | 603 | `12c50a0f0033fbc0a890be2d56ddf3594d217db58d45eaa5a0b71eafa3513490` |
| `public/icons/marswalk-192.png` | 9600 | `137194e041be8e171dfa40bbd5b333f69cb6c268957c49fa4e2525b464394faa` |
| `public/icons/marswalk-512.png` | 19227 | `3ad6eab9da3faa9dfcb2415f979d2fca89d89e7f8a9a1c084ca17481c3b72ad9` |
| `public/icons/marswalk-maskable-512.png` | 19227 | `3ad6eab9da3faa9dfcb2415f979d2fca89d89e7f8a9a1c084ca17481c3b72ad9` |
| `public/icons/marswalk.svg` | 361 | `edd13d0e30c646395eef13a844e3d87d15a5a32ad91bcc4999dfa3deca0f0afc` |

Manifest/SVG checkout bytes are pinned to LF by `.gitattributes`; scientific JSON LF rules are already on main (`ac79be5`). Existing Windows working copies may still need the clean-file refresh documented below. Do not change scientific hashes or regenerate data. Browser-specific installed appearance remains pending actual Android/iOS checks.


## Windows LF compatibility — coordinator fix, 15 November 2026

Repository `.gitattributes` now enforces `text eol=lf` for public scientific JSON, including the byte-verified manifest. No canonical data, expected hash, build script or worker was changed. A fresh indexed checkout with `core.autocrlf=true` preserves manifest size **1,200 bytes** and SHA-256 `40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82`.

Coordinator verified `npm run build` and `npm run build -- --base-href /marswalk/`: both Angular compilation **and full pack verification pass**, each with 18 assets. This is Linux build evidence plus Git checkout simulation, not a native Windows or installed-device pass.

**Enzo/Willy handoff:** preserve local changes, fetch and merge published main into your existing branch. Existing CRLF working files may need refreshing after attributes arrive: inspect `git status` and back up any edits first. Only if `public/data/manifest.json` has no work to preserve, run `git restore --source=HEAD --worktree -- public/data/manifest.json` to re-check it out using the new attributes. Do not reset the repository, change global autocrlf settings, regenerate scientific data or change expected hashes to accommodate CRLF. Rerun both commands above and record your actual commit/platform/results in this QA file. Enzo's reported documentation-only submission is awaiting those checks; do not mark all Phase 1/device acceptance complete. Willy can use the same fix for his install-assets verification; this does not transfer his map work to Enzo.


Source **`8a4dadc`**, **15 November 2026**. Coordinator supplied these while teammates were unavailable; Willy retains visual review/refinement and deployed-device validation. Do not recreate already-provided assets blindly; compare and preserve any local work.

- `public/manifest.webmanifest`: valid UTF-8 JSON, relative `./` start/scope, standalone, English name/description, matching `#0b0e14` colors, correct relative PNG icon declarations.
- Original geometric Mars/mountain mark in `public/icons/marswalk.svg`; coordinator/Codex-assisted design, not NASA's official branding. PNGs were drawn with Pillow from the same geometry, rendered at 1024px and downsampled with Lanczos. No external illustration/license source was used.
- `marswalk-192.png` and `marswalk-512.png` fully decode as RGB at 192×192/512×512; `marswalk-maskable-512.png` is opaque RGB at 512×512. Essential artwork lies within radius 174px on the 512px canvas, inside the 204.8px maskable safe radius.
- Root/index manifest discovery link and theme-color are already wired centrally. No new application dependency or source imagery change.
- Root and actual `/marswalk/` production builds served correct relative assets; Chromium manifest diagnostics and non-incognito installability diagnostics return no errors. [Full evidence](PWA_FOUNDATION.md).

Actual target-device installation/launcher appearance is pending. Willy's next work: inspect/refine the original mark and launcher-size appearance, verify actual host paths/standalone/device behavior, then continue his map-release checklist. A visual refinement changes manifest/icon hashes and requires a fresh full production build/pack and update test; do not replace deployed files outside that build.

## Enzo Windows LF compatibility check — 15 November 2026

- Tested branch: `feature/enzo-image-payload-verifier`, merge commit `740a2a1` (main `ac79be5` merged with no conflicts). Platform: Windows PowerShell, Node `v24.20.0`, npm `12.0.2`, Git `2.55.0.windows.3`.
- Refreshed `public/data/manifest.json` from the Git-generated checkout copy after the documented `git restore` was a no-op on the clean, CRLF-normalized file. Final worktree is LF, **1,200 bytes**, SHA-256 `40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82`; no data/index/hash change is staged.
- `npm test`: blocked before tests ran because local `node_modules` lacks locked `three@0.187.0`.
- `npm run build`: blocked at Angular compilation by the same missing `three` package; full pack verification did not run.
- `npm run build -- --base-href /marswalk/`: same Angular compilation blocker; full pack verification did not run.
- An attempt to restore the already locked package timed out without a registry response. `package.json` and `package-lock.json` are unchanged. No deployment was performed.
