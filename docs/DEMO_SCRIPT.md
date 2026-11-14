# MARSWALK — 60-Second Internal Demo Rehearsal

<!-- CURRENT_WORK_PLAN -->
> **Current work and status:** [canonical team plan](../TEAM_TASKS.md). Distinguish main capabilities, verified feature branches and pending assignments; preserve completed work.
<!-- /CURRENT_WORK_PLAN -->

Internal pacing, not an official submission requirement. Demonstrate the actually served revision and name it. This sequence matches current **main**, whose map, science access and mission-file transfer are implemented. Enzo's complete shell/notebook and Longla's optional viewer remain branch features until integrated.

Prerequisite: have a small version-matching rehearsal mission JSON ready. Its sketched route/notes are user-created rehearsal content, not a measured Curiosity traverse. Export existing work before importing a replacement. The active imageRef is `hirise-mro-pia26306-boxwork-2048x1042-v1`.

| Time | Action available on main | Suggested narration |
| --- | --- | --- |
| 0:00–0:08 | Open the actual local Mars image and source/credit | “MARSWALK rehearses exploration using real Gale Crater imagery and explicit evidence limits.” |
| 0:08–0:17 | Pan/zoom; use Reset View | “The image uses bottom-left pixels. Geographic alignment and metric scale are unverified.” |
| 0:17–0:27 | Select a science record and show source/limitations | “All three records are readable context. Their image positions are unavailable, so we create no pins.” |
| 0:27–0:37 | Choose the matching mission file and import; Focus Route | “The same rehearsal route and notes can move between devices using this image version. Invalid files are rejected.” |
| 0:37–0:45 | Point to Exploration confidence warnings | “This is visual review only. Terrain, slope and calibrated distance remain unavailable; missing evidence does not establish safety.” |
| 0:45–0:54 | Export mission JSON | “The versioned file carries route, notes, source context and limitations. Exporting protects a portable copy of the work.” |
| 0:54–1:00 | State the next release gate | “Our next proof is the complete installed PWA reopening disconnected on the target device. That acceptance remains pending.” |

Do not say initialization automatically restores saved records: the existing `loadRoute()` is an explicit validated recovery action. File transfer alone does not cache imagery or prove installability/offline reopening.

## Branch-only demonstrations

After the main rehearsal, Enzo `bcac915` can demonstrate actual route drawing, notebook creation and save/load on his tested branch, explicitly labeled pending final current-main reconciliation. Longla `9d794e2` can demonstrate the corrected optional flat viewer on his branch; no measured terrain or immersive VR is supplied. Neither is an installed-offline pass.

After W4/W6 integrate and W5 records real device acceptance, update this script from the actual evidence. [Work pieces](../TEAM_TASKS.md), [branch verdicts](../REVIEW.md), [device gates](qa/PWA_ACCEPTANCE.md).
