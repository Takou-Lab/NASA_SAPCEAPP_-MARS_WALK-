# Willy — Map integration handoff

Willy's published map at `094fce2` has been reviewed and integrated with the root application. Gaddielle's image package and Emma's science records are included in the same integration. Do not mount another instance or repeat the completed map implementation.

## Start the next slice

After this integration is published, preserve your feature branch and local changes, fetch the latest `main`, and merge it into your branch without resetting completed work. Read [WILLY.md](WILLY.md) for the new Reset View / Focus Route assignment. Current ownership returns to `src/app/map/`; root assembly stays with the coordinator.

```sh
npm ci
npm start
npm test
npm run build
```

The root imports MapComponent and mounts `<app-map>` once. It initializes MissionService once. The integration adds a readiness guard so clicks cannot dispatch route actions while imagery is loading or has failed; preserve it when merging.

## Data status

The local prepared image is 2048 × 1042 pixels with imageRef `hirise-mro-pia26306-boxwork-2048x1042-v1`. Its bytes and reference are unchanged. Three valid science records load, all with unavailable positions; Enzo will expose them through a contextual list. Do not invent marker locations.

Enzo's controls/notebook and the coordinator's installable offline PWA lifecycle remain pending. The current shell uses inspect mode; map/service support for route actions does not itself supply route-control UI.

See [image contract](../data/IMAGE_CONTRACT.md), [shared API](CODING_AGENTS.md), and [recorded integration checks](../qa/MAP_INTEGRATION.md) for verification and limitations.
