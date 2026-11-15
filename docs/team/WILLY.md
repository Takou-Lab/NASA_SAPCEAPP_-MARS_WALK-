# Willy — PWA install assets after accepted map recovery

<!-- CURRENT_WORK_PLAN -->
> **Current assignment: [W1](../../TEAM_TASKS.md#w1).** Preserve completed map work; the new slice is install assets delegated from coordinator preparation.
<!-- /CURRENT_WORK_PLAN -->

## Completed — do not repeat

Map `094fce2`, navigation `21cf6f0` and image retry **`02134f1`** are approved/integrated. Retry passed 56 branch tests/build; combined integration `b744b0b` passes **131 Angular tests**, build and actual retry/state-preservation/browser checks. [Review](../reviews/WILLY.md), [evidence](../qa/RECOVERY_EVIDENCE_INTEGRATION.md).

## Next work — manifest and launcher icons

Read [WILLY_PWA_INSTALL_ASSETS.md](tasks/WILLY_PWA_INSTALL_ASSETS.md) for the exact JSON, asset paths, root/subpath checks and handoff. After this integration is published, preserve local work and use proposed **`feature/willy-pwa-install-assets`** from latest main if no follow-up exists; keep the accepted retry branch/history.

Own only `public/manifest.webmanifest`, the three declared `public/icons/marswalk-*.png` assets, an optional original icon source and `docs/qa/PWA_INSTALL_ASSETS.md`. Produce an original readable mark, a true maskable icon with opaque background/safe-area artwork, correct relative manifest URLs and actual verification evidence.

Do not edit root/index, package/build config, service worker, map, scientific data or another person's files. No new dependency. The coordinator wires discovery and the lifecycle after review; assets alone do not establish install/cache readiness. Enzo continues release UI cleanup, Emma supplies a read-only byte verifier, and Longla owns device evidence.

## Acceptance and handoff

Parse the manifest; fully decode/inspect declared PNG dimensions and maskable appearance; validate root and `/marswalk/` URL resolution; run production build and check served output. Record actual commands, byte sizes, authorship/credits and remaining discovery/install checks. Do not fabricate an installed-device result or create mirrored tests just for static declarations.

Commit/push only the assigned W1 feature branch (default above), giving actual name/commit/files/checks. No main integration, deployment, environment publication, submission or external messaging.

## Copy-paste coding-agent prompt

```text
You are Willy's MARSWALK install-assets agent. Read TEAM_TASKS.md W1,
docs/team/WILLY.md, docs/team/tasks/WILLY_PWA_INSTALL_ASSETS.md,
docs/reviews/WILLY.md and docs/team/CODING_AGENTS.md.

Image retry 02134f1 is accepted/integrated; combined code b744b0b passes
131 Angular tests/build/browser checks. Preserve map/navigation/retry; do not redo them.

1. Preserve local work. After integration publication, start proposed
   feature/willy-pwa-install-assets from latest main if no task exists.
2. Deliver manifest.webmanifest and exact PNG icons/optional source under
   public/icons plus docs/qa/PWA_INSTALL_ASSETS.md. Follow the detailed JSON
   contract, relative start/scope/icon paths and real maskable safe area.
3. Use an original readable mark and document source/credits. Fully decode
   PNGs, check actual dimensions/alpha and launcher-size appearance.
4. Verify root and /marswalk/ URL resolution, production build/served assets.
   Give the coordinator discovery-link/theme-color handoff and actual checks.
   Assets are not complete app-cache or installed-device acceptance.

Own those assets/QA only. No index/root/core/package/worker/source-data edits,
new dependencies, map changes or fake readiness UI. Coordinator wires it.
Commit/push only this task branch (authorized) and report actual branch,
commit/assets/checks/blockers. No main merge, deployment, publication,
submission or external messages.
```
