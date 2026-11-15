# Willy 2 — Windows install and release verification

## Run identity

| Field | Value |
| --- | --- |
| Tested commit | `d6801a417a5a32375bf6453deadcc024d1460919` |
| Branch | `feature/willy-pwa-install-assets` |
| Platform | Windows 11 |
| Node | `v24.21.0` |
| npm | `11.19.0` |
| Git | `2.51.0.windows.1` |

The branch was fast-forwarded to the tested commit before verification. The existing staged `docs/qa/PWA_INSTALL_ASSETS.md` and original `stash@{0}` were preserved.

## Verification results

| Check | Tested revision | Platform | Command/action | Actual result | Evidence / remaining blocker |
| --- | --- | --- | --- | --- | --- |
| Locked install | `d6801a4` | Windows 11 | `npm.cmd ci` | **PASS**; 303 packages installed | npm warned that install scripts for `@parcel/watcher`, `esbuild`, `lmdb` and `msgpackr-extract` were not approved. No package manifest or lockfile changed. |
| Canonical data-manifest bytes | `d6801a4` | Windows 11 | Inspect byte count, SHA-256 and `git ls-files --eol` | **PASS after clean-file refresh**; 1,200 bytes; SHA-256 `40381b96e243b6876c4aa796d4cfcb5b222592982a5c1726101f467622418f82`; `i/lf w/lf attr/text eol=lf` | The documented `git restore` command exited successfully but did not rewrite the clean CRLF worktree file. It initially remained 1,228 bytes (`e3c33a304ae01e657d5e282fa07ca7143f8ed9a76a359419e5320238e750d53a`). After backing it up, the exact raw `HEAD` blob bytes were written to the worktree file and verified. The Git blob and scientific content were unchanged. |
| Other LF-pinned assets | `d6801a4` | Windows 11 | Check worktree bytes and `git ls-files --eol` | **PASS after the same clean-file refresh**; webmanifest 603 bytes, SVG 361 bytes; both `i/lf w/lf attr/text eol=lf` | Webmanifest SHA-256 `12c50a0f0033fbc0a890be2d56ddf3594d217db58d45eaa5a0b71eafa3513490`; SVG SHA-256 `edd13d0e30c646395eef13a844e3d87d15a5a32ad91bcc4999dfa3deca0f0afc`. Worktree backups were saved before refresh. |
| PNG decode and opacity | `d6801a4` | Windows 11 | Decode with `System.Drawing`; read every pixel | **PASS**; 192×192 and two 512×512 PNGs fully decoded as `Format24bppRgb`, minimum alpha 255 | Source fingerprints match the documented inventory: 192px SHA-256 `137194e041be8e171dfa40bbd5b333f69cb6c268957c49fa4e2525b464394faa`; both 512px files SHA-256 `3ad6eab9da3faa9dfcb2415f979d2fca89d89e7f8a9a1c084ca17481c3b72ad9`. |
| Root production build | `d6801a4` | Windows 11 | `npm.cmd run build` | **PASS**; Angular compilation and full pack generation; 18 assets, 1,655,461 bytes; pack version prefix `2821c139b35b` | `offline-pack.json` and `service-worker.js` generated. Leaflet CommonJS warning remains. The first sandboxed attempt could not read source directories; the same command passed with workspace access. |
| `/marswalk/` production build | `d6801a4` | Windows 11 | `npm.cmd run build -- --base-href /marswalk/` | **PASS**; Angular compilation and full pack generation; 18 assets, 1,655,470 bytes; pack version prefix `70091eb3af62` | `offline-pack.json` and `service-worker.js` generated. The built index uses `<base href="/marswalk/">`; the service worker contains the generated pack version. Manifest, icon and required data entries were present in the pack and built bytes matched source bytes. |
| Local root HTTP assets | `d6801a4` | Windows 11 | Serve root build locally; GET page, manifest, icons, data manifest, pack and worker | **PASS**; all requested root URLs returned HTTP 200 | `/` 2,317 bytes; manifest 603; PNGs 9,600 / 19,227 / 19,227; data manifest 1,200; offline pack 3,023; service worker 7,830. Content types were HTML, `application/manifest+json`, PNG, JSON and JavaScript as expected. |
| Local `/marswalk/` HTTP assets | `d6801a4` | Windows 11 | Serve build under `/marswalk/`; GET corresponding subpath URLs | **PASS**; `/marswalk/` and manifest, icons, data, pack and worker URLs returned HTTP 200 | A root-level `/manifest.webmanifest` request returned 404, confirming the output was served under the actual subpath. |
| Deployed-host HTTP assets | Deployed revision identified in project notes as `b6669fb` (not exposed by HTTP response) | HTTPS | GET `https://marswalk-jet.vercel.app/` and manifest, icons, worker and pack | **PARTIAL**; all requested URLs returned HTTP 200 | Served response sizes: page 2,272; manifest 603; icons 9,600 / 19,227 / 19,227; worker 7,603; offline pack 2,871 bytes. The served page had a root base, manifest link and theme-color, but no `apple-touch-icon` link. The host is older than the local candidate containing the coordinator's iOS discovery link. |
| Physical Android/iOS installation | Not tested | Physical device required | Add to Home Screen; inspect launcher and standalone app | **NOT PERFORMED / PENDING** | No physical target device was available for this run. No installation or launcher appearance is claimed. |
| Installed offline recovery | Not tested | Physical device and current deployment required | Disconnect, close/reopen installed app, recover saved mission and verify route/note/export | **NOT PERFORMED / PENDING** | Requires a current deployed candidate and target-device access. |
| Browser install/offline workflow | Not tested | Browser required | Isolated-profile preparation, install and disconnected restart | **NOT PERFORMED** | HTTP checks do not establish browser installation, service-worker activation or offline mission recovery. `npm test` was not run; this verification task was focused on Windows builds, assets and HTTP serving. |

## Manifest and icon declarations

The webmanifest parsed successfully. It declares MARSWALK name and short name, English language, `./` start URL and scope, standalone display, matching `#0b0e14` theme/background colors, and relative PNG icon paths with the declared sizes, MIME types and purposes. The local root and subpath index links resolve to the correct manifest and icon URLs.

## Blockers and next steps

1. Deploy a current reviewed candidate so the hosted page exposes the relative `apple-touch-icon` link already present in the merged source; repeat the hosted URL checks against that exact deployed revision.
2. Run Add to Home Screen and launcher/standalone checks on an available physical Android Chrome or iOS Safari device.
3. On the installed app, complete disconnected close/reopen and saved route/note recovery, including export. Record the device model, OS, browser and actual outcomes.
4. Keep the unapproved npm install-script warnings and Leaflet CommonJS warning visible for coordinator review; they did not block either production build.

No physical-device acceptance, current-host iOS launcher discovery, or installed offline mission recovery is claimed by this report.

## Execution details added after independent review

### Initial Git state

Before fetching main, the branch was `feature/willy-pwa-install-assets` at `ac79be5876f80ce3c728c17756fa86f7873f2af0`; it was three commits behind `origin/main`. `git status --short --branch` showed only the existing staged modification to `docs/qa/PWA_INSTALL_ASSETS.md`. `stash@{0}` was `90e027034e605698f5981d2553c31519462ac33c`.

After the fast-forward to tested commit `d6801a417a5a32375bf6453deadcc024d1460919` and before `npm.cmd ci`, the only tracked worktree change was that same QA document, reapplied by Git's autostash as an **unstaged** modification. The stash remained unchanged. No clean-working-tree state is claimed for this run.

### Local HTTP server commands and requested URLs

Both temporary servers listened on `127.0.0.1:4173`. The root server mapped `/` to `dist/marswalk/browser/index.html`; the subpath server only served requests prefixed by `/marswalk/` from the same build directory. These are the inline Node commands used:

Root build:

```powershell
node.exe --% -e "const http=require('http'),fs=require('fs'),path=require('path');const root=path.resolve('dist/marswalk/browser');http.createServer((req,res)=>{let url=new URL(req.url,'http://localhost').pathname;let rel=url.startsWith('/')?url.slice(1):url;if(!rel||rel.endsWith('/'))rel+='index.html';const file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('forbidden')}fs.readFile(file,(err,b)=>{if(err){res.writeHead(404);return res.end('not found')}const ext=path.extname(file);const types={'.html':'text/html','.webmanifest':'application/manifest+json','.json':'application/json','.js':'text/javascript','.css':'text/css','.png':'image/png','.ico':'image/x-icon'};res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Content-Length':b.length});res.end(b)})}).listen(4173,'127.0.0.1',()=>console.log('ROOT-READY'))"
```

Subpath build:

```powershell
node.exe --% -e "const http=require('http'),fs=require('fs'),path=require('path');const root=path.resolve('dist/marswalk/browser');http.createServer((req,res)=>{let url=new URL(req.url,'http://localhost').pathname;const prefix='/marswalk/';if(!url.startsWith(prefix)){res.writeHead(404);return res.end('outside subpath')}let rel=url.slice(prefix.length);if(!rel||rel.endsWith('/'))rel+='index.html';const file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('forbidden')}fs.readFile(file,(err,b)=>{if(err){res.writeHead(404);return res.end('not found')}const ext=path.extname(file);const types={'.html':'text/html','.webmanifest':'application/manifest+json','.json':'application/json','.js':'text/javascript','.css':'text/css','.png':'image/png','.ico':'image/x-icon'};res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Content-Length':b.length});res.end(b)})}).listen(4173,'127.0.0.1',()=>console.log('MARSWALK-READY'))"
```

The root request loop used `Invoke-WebRequest` against `http://127.0.0.1:4173/`, `/manifest.webmanifest`, `/icons/marswalk-192.png`, `/icons/marswalk-512.png`, `/icons/marswalk-maskable-512.png`, `/data/manifest.json`, `/offline-pack.json` and `/service-worker.js`. The subpath loop used the same paths prefixed with `/marswalk/`; `curl.exe` also checked that the root-level `/manifest.webmanifest` returned 404 on the subpath-only server.

**Raster image HTTP request: NOT PERFORMED.** The local request loops did not request the raster path from `manifest.assetPath`; the hosted URL checks also did not request it. No raster HTTP status or response size is claimed.

### Archived logs

Build and HTTP results were observed in the interactive command output and summarized in this report. **No build logs, HTTP transcripts, screenshots or network traces were archived as files.**
