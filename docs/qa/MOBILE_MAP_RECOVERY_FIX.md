# Mobile map and mission recovery fix

15 November 2026. Coordinator implementation on fix/mobile-map-and-recovery.

The phone flex layout could collapse the map parent to zero height. Phone layouts now scroll naturally, retain the map height and put detailed mission summary behind a native disclosure.

Initialization restores a valid saved mission for the active image automatically, including route and observations. A visible status reports recovery or storage errors. New edits during initialization take precedence. Invalid saved bytes and old-image storage remain untouched. Saving still requires the explicit route/observation actions; unsaved drafts are not durable saves.

Verification: 241 Angular tests across 24 files pass; production build passes. Browser checks cover 390px both themes, positive map/ancestor height, retained drafts, failed saves, wrong-image import rejection and full browser process restart offline with exact route/observation export comparison. Restoration is checked before pressing Load Route. These are browser checks, not physical Android/iOS certification.

Saved data belongs to its browser origin and active image reference. Keep using the same review URL. Data on older preview domains remains there; export it there and import into a compatible image version. Do not clear site data to troubleshoot missing missions.

Physical acceptance: open the review URL on Android/iOS, prepare offline, draw/save a route, save an observation, close the installed app, disconnect, reopen and verify both return. Record device, URL, version and result.

## Published candidate

Runtime source b28f6ad. Public stable URL: https://marswalk-review-boys-band.vercel.app/

Unique deployment https://marswalk-7p2nd3sgc-boys-band.vercel.app/ (dpl_6PsqWfNthwncixoFiEE8GJs7RnWX). All 19 served assets match the locally tested production pack hashes; missing files return 404 and iOS icon discovery remains present. Production alias marswalk-jet.vercel.app was not changed.

Anonymous browser verification on the stable HTTPS alias also passed: prepare the full offline pack, draw/save route and note, reject wrong-image import, terminate browser, restart disconnected, automatically restore and compare exact route/observations via export. At 390px the map and its ancestors retain positive height and the page has no horizontal overflow. Physical phones remain to be checked.
