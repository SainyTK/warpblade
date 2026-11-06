# Analytics

The live site sends page views and two game events to Google Analytics 4.
The code is `src/services/analytics.ts`.

It loads only in a production build with `VITE_GA_MEASUREMENT_ID` set to the GA4 measurement ID (`G-...`).
The ID lives in the Vercel project's environment variables, so dev servers, playtest bots and forks send nothing.
After setting or changing the ID, redeploy so the build picks it up.

Both pages (the game and the patch notes) record a page view.
The game also sends:

| Event | When | Parameters |
| --- | --- | --- |
| `run_start` | a solo run or a co-op room's run starts | `hero`, `coop`, `players` (co-op only) |
| `run_end` | a run ends, solo or co-op | `hero`, `outcome` (`fallen`, `clear`, `left`), `wave`, `coins` |

New events go through `track()` in the same service, with a row added here.
