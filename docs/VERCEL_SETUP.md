# Vercel setup status

Updated **15 November 2026**. User selected Vercel and requested fetching `https://vercel.com/get-started.md` and following it. The environment's enforced restricted network policy currently excludes Vercel. Direct fetch returned HTTP **403** (including a CONNECT-tunnel denial); CLI login failed with `fetch failed` before issuing an authorization URL. The guide has **not** been read, no account is connected, and no deployment/project URL is claimed.

## Prepared and verified

- `vercel.json` selects Angular, runs **`npm run build`** (including the required PWA pack generator) and serves **`dist/marswalk/browser`** at the domain root. Install is `npm ci`.
- Entry HTML, worker and control inventory use `no-store`; install manifest/icons/data revalidate. Manifest MIME is explicit and `nosniff` is set. No catch-all rewrite turns missing data/worker files into HTML. Current app has no client routes requiring a navigation rewrite.
- `.vercelignore` excludes dependency/build caches, Git/docs and archival image/terrain source from upload. `.vercel/` local account/project metadata is Git-ignored.
- Vercel CLI **65.16.0** installed through npm exec in the workspace package cache, without adding an app dependency. Its installed configuration validator accepts `vercel.json`.
- Production build passes and reproduces the verified 17-asset/1,789,610-byte pack. Existing bundle/style/CommonJS warnings remain. No application logic or scientific data changed in this setup slice.

## Remaining connection steps

1. In this chat's cloud-environment settings, allow `vercel.com` and the required Vercel subdomains (API/authentication); allow the eventual `*.vercel.app` deployment URLs for verification. Preserve existing package-manager/GitHub access. The current tools cannot directly apply a running-environment network grant; no proxy bypass or environment publication was attempted.
2. Once access is applied, fetch **the user-requested guide first**, read it and follow its actual current setup workflow. Do not describe this preparatory configuration as having followed an unread guide.
3. If the guide requires CLI login, run the supported device login and let the user authorize in their browser. Use a writable CLI config directory outside the repository:

```sh
VERCEL_TELEMETRY_DISABLED=1 npm_config_cache=/workspace/.npm-cache npm exec --yes --package vercel@65.16.0 -- vercel --global-config /workspace/.vercel-cli login
```

Never paste passwords/tokens into the chat or commit credentials. Link the correct user's project/team after authentication. Select supported Node 24.x in project settings. Keep the explicit build/output commands; plain `ng build` omits generated PWA support.

4. Deploy a preview using the guide's authorized workflow. Record its actual commit/build URL and test entry HTML, headers, icon/manifest URLs, worker scope, real imagery/science, route/notebook/transfer and full preparation/offline restart. Confirm the intended public app is accessible without login; provider deployment protection can interfere with an offline public demo.
5. Promote the tested artifact to production through the user's requested deployment workflow; record actual production URL, build/pack version and rollback reference. Perform the physical home-screen tests separately. [Full acceptance/runbook](DEPLOYMENT.md).

**Next required user action is the network setting, not a password or API token.** A login approval link can only be supplied after Vercel is reachable (if required by the fetched guide).
