# Analytics

The live site sends page views and two game events to Google Analytics 4.
The code is `src/services/analytics.ts`.

The GA4 account is "Warpblade" on the owner's personal Google account, with the property warpblade.sainytk.com (Thailand time) and the web stream "Warpblade web".
The measurement ID and the one host that reports are in `src/constants/analytics.ts`.
Only pages served from warpblade.sainytk.com load gtag.js, so dev servers, previews, playtest bots and forks send nothing.

Both pages (the game and the patch notes) record a page view.
The game also sends:

| Event | When | Parameters |
| --- | --- | --- |
| `run_start` | a solo run or a co-op room's run starts | `hero`, `coop`, `players` (co-op only) |
| `run_end` | a run ends, solo or co-op | `hero`, `outcome` (`fallen`, `clear`, `left`), `wave`, `coins` |

New events go through `track()` in the same service, with a row added here.
