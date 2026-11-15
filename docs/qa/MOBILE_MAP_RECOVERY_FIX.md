# Mobile map and mission recovery fix

15 November 2026. Coordinator implementation on fix/mobile-map-and-recovery.

The phone flex layout could collapse the map parent to zero height. Phone layouts now scroll naturally, retain the map height and put detailed mission summary behind a native disclosure.

Initialization restores a valid saved mission for the active image automatically, including route and observations. A visible status reports recovery or storage errors. New edits during initialization take precedence. Invalid saved bytes and old-image storage remain untouched. Saving still requires the explicit route/observation actions; unsaved drafts are not durable saves.

Verification: 241 Angular tests across 24 files pass; production build passes. Browser checks cover 390px both themes, positive map/ancestor height, retained drafts, failed saves, wrong-image import rejection and full browser process restart offline with exact route/observation export comparison. Restoration is checked before pressing Load Route. These are browser checks, not physical Android/iOS certification.

Saved data belongs to its browser origin and active image reference. Keep using the same review URL. Data on older preview domains remains there; export it there and import into a compatible image version. Do not clear site data to troubleshoot missing missions.

Physical acceptance: open the review URL on Android/iOS, prepare offline, draw/save a route, save an observation, close the installed app, disconnect, reopen and verify both return. Record device, URL, version and result.
