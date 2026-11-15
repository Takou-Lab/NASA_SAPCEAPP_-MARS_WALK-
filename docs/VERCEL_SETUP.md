# Vercel setup and live deployment

Updated **15 November 2026**. The requested [Vercel get-started guide](https://vercel.com/get-started.md) was fetched and read after the environment network change. Vercel CLI authentication completed through user-approved device sign-in; `vercel whoami` verifies **`boscopatrick907-coder`**. No password/token was requested in chat or committed.

## Live project

| Item | Verified value |
| --- | --- |
| Public URL | **https://marswalk-jet.vercel.app/** |
| Additional production alias | https://marswalk-boys-band.vercel.app/ |
| Account / team / project | `boscopatrick907-coder` / `boys-band` (`boys_band`, Hobby) / `marswalk` |
| Dashboard | https://vercel.com/boys-band/marswalk |
| Tested production source | **`b6669fb`**, including Gaddielle merge `c7ac053` and review handoff `bc26a37` |
| Final deployment | `dpl_3dGqArmwGYzMkxMQHwWuvaj7BVWU` |
| Immutable deployment URL | https://marswalk-jvrb8lwv5-boys-band.vercel.app/ (provider sign-in protection may apply here) |
| Public access | Anonymous curl and clean persistent browser serve the actual app without sign-in; no bypass used for production acceptance |
| Runtime pack | `95d8b5f6ee7aba0a38e8e7758ada62be20a3f0ca61efd04adce0fc4cabb7a827`, **17 files / 1,789,610 bytes** |
| Build | Project Node `24.x`, `npm ci`, `npm run build`, output `dist/marswalk/browser` |
| Serving | Explicit static configuration (`framework: null`) with filesystem lookup then 404; no application backend or Dockerfile |

Earlier staged deployments remain in project history. They were not declared accepted merely because an HTTP request returned a login page with status 200. Candidate assets were checked through authenticated CLI access, then production aliases were independently checked anonymously. A provider SPA fallback was found and corrected with explicit filesystem/404 routing; real files still serve correctly.

## Guide completion — verified state only

```text
CLI: 65.16.0, authenticated as boscopatrick907-coder
CLI installation: /workspace/.vercel-tools (user-owned global prefix)
Guidance: blocked in this managed user profile
  Plugin attempted first; installer cannot create /home/agent/.cache/plugins.
  Plugin documentation checked; standalone global skills fallback attempted,
  but /home/agent/.agents cannot be created. No plugin/skills claimed installed.
MCP: blocked; codex mcp list was inspected before adding.
  codex mcp add vercel --url https://mcp.vercel.com failed because
  /home/agent/.codex/config.toml is on a read-only filesystem.
MCP endpoint requested: shared global https://mcp.vercel.com
Authenticated MCP check: unavailable; no MCP server was added/authenticated.
CLI read-only checks: whoami, teams list, project inspect and docs search pass.
Reload: not performed; no unavailable plugin/server claimed loaded.
```

No profile remount, sandbox bypass or cloud-environment publication was attempted. CLI deployment works independently of optional plugin/MCP availability. New setup did not change unrelated user/client MCP entries.

## Commands for this cloud workspace

The CLI's normal user profile is read-only here. Its approved device credentials live outside the repository at `/workspace/.vercel-cli`; the standard XDG data directory uses `/workspace/.vercel-state/com.vercel.cli` to reference that directory. Use bare CLI commands with:

```sh
export PATH=/workspace/.vercel-tools/bin:$PATH
export XDG_DATA_HOME=/workspace/.vercel-state
export VERCEL_TELEMETRY_DISABLED=1
vercel whoami
vercel project inspect marswalk --scope boys-band --json
```

Local `.vercel/` project metadata and CLI-generated `.env.local` OIDC data are Git-ignored and explicitly upload-ignored. A post-link deployment dry-run verifies they are excluded, along with node_modules, build output and archival image/terrain sources. Do not copy auth files into the project or publish their contents.

For a future reviewed source change:

```sh
npm test
npm run test:pwa
npm run build
vercel deploy --scope boys-band --prod --skip-domain --yes
# Inspect/test the returned candidate, then promote its actual URL:
vercel promote <tested-deployment-url> --scope boys-band --yes
```

Keep candidate/production source commits and pack version recorded. Root/subpath compilation must match the host; this project uses the domain root. Existing bundle/style/CommonJS warnings remain below error budgets.

The CLI created a project **Protection Bypass for Automation** secret while checking the protected staging deployment. It is retained by Vercel for CLI testing, not committed or printed here. Manage/revoke it through project Deployment Protection settings if no longer needed. Production public-access tests deliberately did not use it.

## Remaining setup and acceptance

- **Automatic GitHub deployments are not connected.** `vercel git connect` failed for the correct repository. Use project **Settings → Git** to connect `boscopatrick907-coder/NASA_SAPCEAPP_-MARS_WALK-`, approving repository access if prompted. Do not assume every push already deploys. PR comments were disabled on the project; no teammate messages were sent.
- Until Git connection succeeds, use the reviewed CLI deploy/promote workflow above. The live site does not depend on that optional connection.
- Physical phone/home-screen installation and standalone disconnected reopening remain pending; [public browser evidence](qa/VERCEL_PRODUCTION.md) is not physical-device acceptance.
- Official event URL/deadline verification, numerical environmental data/shared contract, prepared AI explanations, immersive VR and outside-user outcomes remain separate assignments. No competition submission was made.


Observed final anonymous response headers: entry HTML, worker and install manifest return `Cache-Control: public, max-age=0, must-revalidate` from Vercel; worker MIME is `application/javascript` and manifest MIME is `application/manifest+json`. This is the actual provider response, distinct from the config’s requested no-store values. Revalidation satisfies the current host requirement; worker registration also uses `updateViaCache: none` and preparation downloads use `cache: no-store`. No positive-TTL immutable caching of these control files was observed.
