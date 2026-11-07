# Warpblade playtest harness

The harness opens Warpblade in headless Chromium, plays it with real key presses, reads the game's state and captures stills and clips.
Studio agents use it to check that the game still works, to measure difficulty with bots, and to film new content for patch notes.

Run every command from `agent-studio/`.
Each command prints one JSON report to stdout and also writes it to `--out <file>` when given.
Use `npm run -s playtest` so npm's own banner lines stay out of stdout.
The exit code is 0 when the report says `ok`, 1 when a check or run failed, and 2 when the command itself could not run.

## How it works

Each command starts the game's own Vite dev server on a free port, from the game root given by `--root`.
The default root is the repository the harness lives in, two levels above this folder.
When that root has no `node_modules`, the harness runs `npm ci` there first.
The server runs through Vite's JavaScript API with hot reload switched off, so edits other agents make while a command runs never reload the page mid-run.
New sessions still get the latest code from disk.

Chromium comes from Playwright's install at `~/Library/Caches/ms-playwright/chromium-1248`.
Set `PLAYTEST_CHROMIUM` to use another Chromium or Chrome executable.

Every session is a fresh browser context, so storage starts empty: no shop upgrades, no saved hero choice and no best wave.
Each session also sets `warpblade-playtest` in local storage before the game loads; the dev build then unlocks every hero, including those that cost coins, and tracks no achievements.
Time in the page runs on Playwright's fake clock and moves only when the harness advances it.
The game therefore steps the same way on every machine, and it usually runs three to four times faster than real time.
`performance.now()` is rounded to the 16 ms frame grid so the game's 120 Hz steps line up with frames the same way in every session.

The dev server and the browser are always stopped when a command ends, fails or gets Ctrl+C.
An interrupted command prints no report.

## Commands

### smoke

```sh
npm run -s playtest -- smoke [--hero <id>|all] [--root <dir>] [--out <file>]
```

Loads the game and checks that the start menu opens and that heroes are found.
Then, for each hero, in a fresh session:

- starts a run through the real menu (Start, then the hero's card);
- waits for wave 1 and checks that the HUD shows the wave and the level;
- walks right with D and left with A and checks that the hero moved;
- presses W, J, K, L, I, U and O in turn, checks that none raises an error, that J starts an attack and that W leaves the ground;
- opens and closes the pause menu with Escape;
- stands still until a foe lands a blow and checks that the HP bar matches the HP left;
- checks that no page error or console error happened.

Last, it loads `/patches/` and `/feedback/`.
A page the dev server does not have yet is skipped with a note.
Uncaught errors and console errors on those pages fail the check.
Failed requests to other services, such as the feedback API when `wrangler dev` is not running, are listed in the detail and do not fail it.

`--hero` takes any hero id the game has, or `all` (the default) for every hero found.
Heroes are read at run time from `CHARACTERS` in `src/constants/characters/index.ts`, so new heroes are picked up without changes here.

Report fields: `command`, `ok`, `root`, `startedAt`, `wallSeconds`, `pageErrors`, `heroes`, and `checks`.
Each check has `name`, `ok`, and when they apply `hero`, `skipped` and `detail`.

### bot

```sh
npm run -s playtest -- bot [--hero <id>|all] [--runs N] [--policy mash|skilled] [--max-minutes M] [--root <dir>] [--out <file>]
```

An autopilot plays whole runs with real keys, one decision every 50 ms of game time, until the hero falls, the stage is cleared or the time limit is reached.
Each run starts from the start menu in a fresh session.

`mash` walks to the nearest foe and mashes J, and takes the first card of every skill pick.
Both policies close a chest screen with J once its input lock has passed.

`skilled` adds a few general rules that work for any hero:

- it presses L toward a foe that is striking or about to strike close by, which is a dash for Kael and whatever the hero has on L for others;
- it steps out from under a flying foe that is winding up or shooting overhead;
- it goes for foes it can reach, and for high foes when they sink after an attack;
- it holds U to charge the ultimate when the HUD's ultimate pips show it is paid for and two foes or a boss are near;
- it casts with I when the selected HUD spell tab is ready, and cycles with O to a ready one;
- it uses any other ready HUD tab with its key, such as WARP on K, on a foe at a distance;
- it jumps over a foe on the ground that faces the hero, to strike its back;
- it raises a held skill already at level 5 or more, so it heads for an evolution; otherwise it takes a new skill by kind in this order: ultimate, attack, summon, spell, dot, movement, passive; then the highest skill level, then a charm, then a boon.

The bot reads only the hero's position, HP and MP, the foes' positions, states and facing, and the HUD.
Tab readiness comes from the HUD, so a new hero whose tabs or keys differ still gets used sensibly.
The tab-to-key table lives in `constants/keys.ts` (`HUD_TAB_KEYS`); any tab not listed there is treated as a spell.

`--runs` is runs per hero (default 1).
`--max-minutes` is game minutes per run before it is stopped as a `timeout` (default 30).

Report fields: `command`, `ok`, `root`, `startedAt`, `wallSeconds`, `pageErrors`, `policy`, `runs`, `means` and `determinism`.
Each run has `hero`, `policy`, `wave` (furthest wave reached), `level`, `kills`, `coins` (banked at the end), `seconds` (game seconds), `wallSeconds`, `ending` (`fallen`, `clear` or `timeout`), `hpLostByWave` (HP lost in each wave, healing not subtracted) and `picks` (card names in order).
`means` holds the averages per hero.

Determinism: with the same game code, hero and policy, a run plays out the same way every time and on every machine.
The game seeds its RNG, every session starts with empty storage, and time moves in fixed steps between decisions.
Repeated runs of one hero repeat each other, so `--runs` above 1 only confirms that and adds no spread.
Wall seconds depend on the machine.
The game's sound effects use `Math.random`, which has no effect on play.
A change to the game's code, including changes other agents save while a command runs, changes the runs.

### scenario

```sh
npm run -s playtest -- scenario <file.ts> [--hero <id>] [--viewport WxH] [--root <dir>] [--out <file>]
```

Runs a script whose default export is `async (session) => {...}` against a fresh session.
With `--hero`, the run has already started through the menu when the script begins; without it, the game waits on the start menu.
Whatever the script returns lands in the report's `result`.
Report fields: `command`, `ok`, `root`, `startedAt`, `wallSeconds`, `pageErrors`, `file`, `result` and `error`.

Scripts can live anywhere, for example in a temp folder.
Import the harness types with an absolute path; type-only imports are dropped at run time.

## Library

```ts
import { openGame } from "<path to agent-studio>/playtest/index.ts";

const session = await openGame({ hero: "ysra" });
```

`openGame({ root, hero, viewport, start })` starts a dev server and a browser, loads the game and, with `hero`, starts a run through the menu.
`start: { wave, level, build }` opens the run at a later wave and level with skills, charms and evolutions already held (the game's dev-only `?wave=`, `?level=` and `?build=`, see `docs/skill-design.md`), for example `{ wave: 8, level: 30, build: "k_familiar:8,b_edge:4" }`.
The default viewport is 1280 x 720, where the stage is exactly 4 device pixels per art pixel.
`close()` stops everything.
`launchHarness(root)` gives one server and browser for many sessions, through `newSession({ hero, viewport })`.

A session has:

- `page`: the Playwright page.
- `state()`: a plain snapshot with `mode`, `wave`, `lull`, `kills`, `coins`, `level`, `picks`, `ultimate`, `hero` (`id`, `x`, `y`, `hp`, `maxHp`, `mp`, `maxMp`, `stamina`, `state`, `face`, `ground`), `enemies` (`type`, `rank`, `x`, `y`, `hp`, `state`, `face`, `stun`, `air`), `hud` (wave and level text, HP bar width, the tabs with `visible`, `ready` and `selected`, ultimate pips), `menu` (`context`, `screen`, `title`, the focused entry), `pick` (the open skill cards) and `lastRun`.
- `heroes()`: every hero the game has, as `{ id, name }`.
- `advance(ms)`: let game time pass.
- `press(key, ms)`, `hold(keys, ms)`, `tap(key)`, `keyDown(key)` and `keyUp(key)`: real key input, with key codes such as `KeyJ` and `Escape`; `KEYS` names them by action.
- `waitFor(predicate, timeoutMs, label)`: advance until the predicate holds on a snapshot, or throw after that much game time.
- `startRun(heroId)`: from any menu or mid-run, quit to the start menu if needed, then Start and the hero on the hero screen.
  The hero screen is navigated by stepping right until its hero panel shows the hero (`data-hero`).
- `choosePick(index)`: answer the open skill pick through the dialog's keys.
- `jumpToWave(n)`: play on with the skilled bot until wave `n` starts.
  It throws if the hero falls first, which gets likely past wave 8 or so with the current bot.
- `evaluate(fn, arg)`: run code in the page, for example `await import("/src/game/state.ts")` to read anything the snapshot leaves out.
  Keep scenario scripts to reading state; changing it skips the real game flow.
- `still(path)`: a PNG of the stage with its HUD at the page's own size, returning `{ path, width, height }`.
  At the default viewport it is 1280 x 720 with crisp 4 x 4 art pixels.
- `record(basePath, async () => {...}, { width })`: records the stage with its HUD while the callback plays and writes `<base>.mp4`, `<base>.gif` and `<base>.png`.
  It returns `{ mp4, gif, poster, width, height, seconds, bytes }`.
- `errors()`: page errors and console errors seen so far.
- `close()`.

About `record`:
frames are taken at 30 per second of game time, so the clip plays at game speed however slow the machine is.
Recording starts on the first frame of play inside the callback, so no loading frames get in.
All outputs are scaled nearest-neighbour to 640 px wide by default; at the default viewport that is an exact halving, so art pixels stay 2 x 2 and sharp.
The MP4 is H.264 High, yuv420p, silent, with fast start and even dimensions, at 30 fps; its quality steps down until it fits about 1.2 MB per 8 seconds.
The GIF is 15 fps with a palette made for the clip and no dithering, and falls back to 12 fps and fewer colors if it would pass 4 MB.
The poster is the frame half a second in.
The callback must let game time pass through `press`, `hold`, `advance` or `waitFor`.

A scenario that films Ysra fighting:

```ts
import type { Session } from "/abs/path/agent-studio/playtest/index.ts";

export default async (session: Session) => {
  await session.waitFor((s) => s.enemies.some((e) => e.hp > 0), 8000, "the first foes");
  const clip = await session.record("/tmp/patch-12/ysra-fight", async () => {
    for (let i = 0; i < 16; i++) {
      const { hero, enemies } = await session.state();
      const foe = enemies.find((e) => e.hp > 0);
      if (foe && Math.abs(foe.x - hero.x) > 14) {
        await session.press(foe.x < hero.x ? "KeyA" : "KeyD", 200);
      } else {
        await session.press("KeyJ", 120);
      }
    }
  });
  const still = await session.still("/tmp/patch-12/ysra.png");
  return { clip, still };
};
```

```sh
npm run -s playtest -- scenario /tmp/patch-12/ysra.ts --hero ysra
```

## Reaching later content

`jumpToWave(n)` reaches later waves through real play, which is slow for deep waves and can fail when the bot falls.
The game has no debug path to skip waves, and the harness adds none.
For content deep in the stage, a scenario can play with `jumpToWave` and retry with a different hero, or read state with `evaluate` to wait for the right moment.
Each session starts with empty storage, so shop upgrades bought in a browser never help.

## Limits

- The fake clock drives `requestAnimationFrame`, timers and `performance.now()`, while CSS animations run on real time.
  Menu and pick card transitions can look half-finished in frames.
- The HUD and the pause button are DOM over the canvas; they are in every still and clip.
- At 640 px wide, the HUD's small text is hard to read.
  Pass a larger `width` to `record` for HUD close-ups.
- The stage box is measured when a still or recording starts; a boss bar that appears later outside the stage gets cut off.
  This only happens at window shapes with room above the stage, where the HUD moves out of the stage.
- The bots see the foes and the HUD, and they never see projectiles or fires on the floor.
- Smoke checks for J and W are the only ones that need a specific result from a key; the others need only that no error appears.
- Menu navigation finds Start by its `data-opens="hero"` marker and Quit run by its label starting with "Quit".
