# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

Patch 0.11.0 set the roster at nine sword heroes (the charter's Roster section), and big patches keep the charter's three-day cadence.
The next big patch is due on 2 December, since 0.15.0 shipped on 29 November.
0.15.0 was a new-system headline with new-foes beside it, so the next big patch should rotate to a hero rework, an effect rework or a new boss unless players ask otherwise.

- A foe record in the Codex: every foe and boss seen, with kills per foe from `TrackedStats.foes`. (Vampire Survivors collection, pillar 4)
- New system: class advancement round two. A second job for two more heroes, Cerise and Aldric suggested, since their parry and shield give a job room to change defence. Each gets its own look, 3rd blow and finisher, mark and ultimate addition, opened by defeating Oakheart with that hero. First in line for the next new-system headline. (Grand Chase, pillars 2 and 4)
- Job choice in co-op rooms: the lobby and host session carry the job id beside the hero id; job state is already per seat. (pillar 4, feedback 10)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. Per-player cameras shipped in 0.15.0. (pillars 1 and 4, feedback 10)
- Achievements round two: per-hero mastery achievements now that heroes have trials, and achievements that unlock Armory items or a stage. (Vampire Survivors, pillar 4)
- Run modifiers: curses chosen before a run that make foes stronger for more gold. (Vampire Survivors, pillar 4)

## Fun score

Definition 3 has its first readings from 0.15.0 (base 49.3, patch 49.3), so 0.15.1 tunes the crystal defense from them.

- The defense's big foe fights, from the first v3 bossFights readings: M2.1 skilled clear rate 50 percent (3 of 6 fights), M2.2 96.3 percent of HP lost after a tell, M2.4 fights at 8.1 times their designed kill time, and M6.1 -0.24 (the mash bot removes 3.83 bosses of HP against 3.09 for the skilled bot). Bring fight length toward the design and make skilled play beat mashing, and check it with the bossFights job. (challenge and mastery, pillar 1)
- The stage run's reward rhythm (M3.2): a reward every 3.98 s on the base and 4.09 s on the patch, and every judge wrote that the pick overlay keeps cutting into combat. (progress and control, pillar 3)
- For the studio: the 0.15.0 patch judges found every evidence still pixel-identical to the base and no still with the new 'Next from' banner, and menu-start.png still showed v0.14.2. Check that the evidence job films the patch build before trusting its rubric.

## Small patch candidates

- Edge marks for the Sky and Below sides, which show only a banner today since `sideWay` returns 0 for them. (clarity, pillar 1)
- The v1 save carry-over runs only when no v2 save exists (QA, 0.15.0). If main with the day work was deployed before 0.15.0, a player who earned anything on that build has a v2 save and never gets the 0.14.2 bank and purchases back. Check whether that build was live, and if so carry v1 over once into an existing v2 save. (save rule)
- The stage name banner at run start never shows (QA, 0.15.0): 'Foes from the West' overwrites it on the first tick, so the stage name is only in the HUD corner. (clarity, pillar 1)
- Long and overwritten side banners (QA, 0.15.0). The 5:56 warning reads 'Next from the West and East and Sky and Below' across the whole screen; 'Next from every side' would read better. Level-up banners also overwrite side banners within a second (at 6:01 it already read 'Level 61'). (clarity, pillar 1)
- Pale foes under constant hits (QA, 0.15.0). In heavy late fights a foe under constant procs stays near white from the per-hit flash in `src/scene/drawActors.ts`, so large foes read as pale shapes (`?stage=citadel&section=7&level=85`). (pillar 1)
- The README late build still (QA, 0.15.0). `docs/media/shot-late-build.png` has no crystal in frame and its foes are washed pale by the per-hit flash, the opposite of the skill light cap. Replace it with a capture that shows the crystal. (pillar 5)
- The touch Switch button's icon reads as an empty dark circle on the Controls screen and in a run (QA, 0.15.0). (pillar 1)
- Two Esc rows on the keyboard Controls list (QA, 0.15.0): pause, and put the cards away. The cards row also shows in co-op rooms, where the arena's wave picks have no Leave. (clarity)
- `docs/multiplayer.md:97` still says 'every rift surge' (QA, 0.15.0).
- For the owner: whether the level-up cards in a defense should keep the Lampwarden portrait and the Leave button now that the mentor is gone.
- For the owner: the smoke check still runs the 30-wave arena (its HUD check reads 'STAGE 1 WAVE 1/30'), and the harness's `startRun` with no `?stage=` starts the arena. Ask for a smoke step that starts a crystal defense (`agent-studio/playtest` belongs to the owner).
- A save compatibility check against the previous release in every QA pass, with a scripted two-build load at the same origin.
- A live co-op room against the two-phase Bog Hulk (QA, 0.14.0). The Rush hit each hero once in a two-seat HostRun inside one page, and a live two-browser room over PeerJS is still untested. Check it together with the 0.13.0 co-op item below. (feedback 10)
- For the owner: the skilled bot baseline for 0.13.2 ended with 'page.evaluate: Target page, context or browser has been closed' and no runs. The harness caused it, not the game: the baseline step in `agent-studio/src/steps/checks.ts` caps each bot command at 40 minutes, and it killed the skilled command at that mark after Kael, Cerise and Aldric had finished, while Vesper's run was going. On the base code her run reaches wave 7, stands idle on a ledge above a Mire Toad and waits out the 30 game-minute limit (2342 s of wall time), longer than the cap on its own. The page stayed responsive with steady memory. Ask the owner to keep a skilled report's finished runs when one run fails, and to cap a stalled run so it ends as a timeout inside the 40 minutes (`agent-studio/` belongs to the owner).
- For the owner: the smoke check presses each key once after the last settles, so it cannot see a lost press. Ask the owner to add a step to `agent-studio/playtest` that presses U 0.1 s after I for every hero and checks the ultimate starts. (pillar 1)
- The scene lint rule and dynamic imports (QA, 0.14.2). The `src/scene/**` override now catches a named `rng` import and a namespace import of game state, but a dynamic `(await import("../game/state")).rng` passes, and the namespace rule fails with Biome's generic tree-shaking message. Find a rule or a check that also catches the dynamic form, and give the scene rules a message that names the play generator. (pillar 1)
- Soft badges in the regular compact HUD (QA, 0.14.2). Since before 0.14.2, the 8 px level badges in the compact HUD at 640 px wide and up sit on fractional pixels and look slightly soft (QA's `badge.mts` at WS=640). Snap them to whole pixels the way 0.14.2 did for the under-273 px tray. (pillar 1)
- For the studio: layout checks on seed copies (QA, 0.14.2). Scratch copies with a symlinked `node_modules` get font 403s (54 console errors each), so layout and pixel checks on those copies are unreliable. Bot results are unaffected. Run layout checks on the real checkout, or give copies their own fonts.
- A measuring room in the repo for skill balance (the method of `docs/skills/balance.md` as a playtest scenario with repeat runs and a tougher late target), then settle the eight new heroes' skills inside their bands. Zafir's Sand Wraith read over its band in his own room, Cerise's Measured Touch and Calder's Point Blank sit just over the crowd cap after QA's cuts, Zafir's room figures predate his wound cut, and most of Yun's and Vesper's level 8 skills read under their bands. Endless Rain's evolved row keeps every level 8 value (checked in `heavensGrove.ts`), so its low reading is the room, not the data. (pillar 3)
- The ultimates per cast against their targets: Vesper's Dusk Waltz, Brynn's Crimson Fall and Yun's evolved Jade Rain read short in the hero agents' rooms. (pillar 1)
- A larger compact HUD in large windows (QA, 0.12.2). Windows such as 1280 by 1024, 1440 by 900 and 1180 by 820 now use the compact HUD at phone size (10 px text, 5 px bars) in the top corners, with room left unused beside a 4x stage. Before 0.12.2 they had the 12 px HUD inside the stage. A larger compact size where the room allows would read better. (pillar 1)
- The phone HUD's reserved band (QA, 0.12.2). On a phone held upright the HUD sits 47 px higher than in 0.12.1 (top 163 px against 210 px at 390 by 844), with an empty band under the bars early in a run where it keeps room for a full build. At 320 by 568 it now stays inside the stage for the whole run. Look for a way to keep the place fixed with less empty room on phones. (pillar 1)
- The compact HUD badge text size (QA, 0.14.1). The 0.14.1 plan asked for 6 or 7 px text in the 6 px badge under 273 px; it ships at 8 px because Silkscreen blurred its digits at 6 and 7 px at 1x density. Confirm 8 px is the size to keep, or find a crisp smaller digit set. (pillar 1)
- For the studio: tidy after each night (QA, 0.14.1). The 0.14.1 developer report counted 7 commits where the branch had 6 at QA time, and the developer's scratch worktrees (after, before, before-hud) are still registered in the repo. Count commits from `git log` when writing the report, and remove scratch worktrees with `git worktree remove` once QA is done.
- For the owner: bots started with `--start-level` deal their starting picks from one shared rng sequence, so every hero gets similar boons (in 0.14.1 all include Vigor), which shapes the HP they lose at waves 10 and 20 (developer, 0.14.1). Ask the owner whether the start picks should vary by hero (`agent-studio/playtest` belongs to the owner).
- Oakheart's split reads thin (QA, 0.13.2). The lasting split is a 1-art-pixel violet line close to the existing rift veins, so at a glance the lost middle acorn is the clearest change. The two shoulder moss dots removed while split sit under the crown, so removing them shows nothing. A wider split, or light spilling onto the bark beside it, would read better from across the stage. (pillars 1 and 5)
- The stage's dithered sky at pixel scale 1 (QA and developer, 0.13.2). In windows under 640 by 360 on a screen with one device pixel per CSS pixel, the 640 by 360 stage canvas is shown at half size, so its dithered sky shows stripes or a checkerboard and a lighter band at its top. A 2x screen runs the same window at scale 3 and looks right. (pillar 5)
- Check the Armory prices against gold earned per run (see `docs/meta-progress.md`).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Play Cerise, Vesper, Yun and Brynn in a co-op room: their state is kept per seat, and QA's co-op pairs covered only Saya, Zafir, Aldric and Calder. (pillar 1, feedback 10)
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)
- Measure the Prism Knight against the Warp Knight once the owner lets the bot choose a job (a skilled run each from wave 5, level 6). The job aims at equal clear rates, not higher ones. (pillars 2 and 3)
- Load each hero's kit on demand (QA, 0.13.1). Vite warns on large chunks: the touch chunk is now 1.85 MB and the game chunk 1.44 MB. The real fix is loading each hero's kit when it is chosen, as the comment in `vite.config.ts` says, which touches all nine hero modules. A build that only splits the code into chunks that all load at start does not count.
- Verify what 0.13.0 could not (QA, 0.13.0): a full co-op room with a real guest over PeerJS, and the run result's "New job" entry after a real Oakheart kill.

## Later

- The Abyss Maw is the last era leader with a single phase in the wave arena. A later new-boss patch can give it a kneel and a second phase the way the Gloam Shepherd and the Bog Hulk have them. (Grand Chase, pillar 1)
- Each sword hero: its own walk and run from a gait model, and Kael his own rest stance in the menus. (pillar 5)
- A third job per hero, opened by the hero's Trial (defeat the Bog Hulk), once most heroes have a second job. (Grand Chase, pillar 4)

## Heroes and shared code

- Taken play styles: see the charter's Roster section.
- A hero is a self-contained module under `src/heroes/<id>/`; `docs/hero-module.md` lists every hook.
- Engine note: the optional `steadfast` hook in `hurtHero` is the shared no-flinch hook; a hero with super armour reuses it.
- Engine note: `src/game/timeFields.ts` (`fieldPace`) is the shared hook for anything that slows foes or foe shots in an area.
- Engine note: `src/game/shotWards.ts` is the shared hook for anything that breaks foe projectiles in an area.
- Engine note: `dealDamage` has a `noFlow` option for hits that should build no Flow; summons in base kits use it.
- Engine note: `src/game/enemies/awareness.ts` (`foeSees`) and the foe `blind` status are the shared hooks for anything that blinds foes.
- Engine note: `takes` on an `EnemyKind` is the shared hook for a foe's damage taken windows (the Gloam Shepherd's kneel), and `steady` keeps a foe from being stunned while it must stay up.
- Engine note: the `foeKills` goal kind with `TrackedStats.foes` is the shared way to make an achievement for one foe.
- Engine note: `JobDef` on `CharacterDef.jobs` and `heroJob()` are the shared hooks for a hero's jobs; a job's look and moves live in the hero's own folder.
- Engine note: `guarding` on an `EnemyKind` is the shared hook for a foe that raises its guard only in some phases.
- Engine note: `upgradeLegacyMeta` in `src/utils/legacyMeta.ts` carries a 0.14.2 `warpblade-meta-v1` save into `warpblade-meta-v2`, with 0.14.2 prices in `src/constants/legacyShop.ts`.

## Shipped

Patches 0.4.0 to 0.10.0 each added a hero that carried no sword; patch 0.11.0 removed those heroes and the shared hooks only they used.

- 0.15.0 Hold the Crystal: the crystal defense, the monster ladder (which covers new foes for the Abyss), the shared skill light cap with mastery marks, and the Rift campaign with Resonance (which covers the new stage item), all day work; plus the save check that carries 0.14.2 saves over with refunds, the touch legend fix with the Leave and Esc rows, Esc on the cards no longer opening the pause menu, the 'Next from' warning before every new front, and the README refresh.
- 0.14.2 Oakheart and the Bog Hulk ease up: wave 5 (open again after 0.14.1), with Oakheart's rest 1.25 to 1.5 times the base above half HP (a developer deviation, +20 percent) and 0.65 to 0.8 once enraged, so skilled gets 3, 4 and 4 of 9 heroes past wave 5 across three seeds (was 2 of 9) and mash 2, 2 and 3; the Bog Hulk at wave 10, with a 1.25 times rest before it sinks, slam, mud wave and glob 22, 18 and 14 to 18, 14 and 11, and base HP 430 to 350; the level 1 badge in the smallest compact slots crisp (QA, 0.14.1); and the scene lint rule catching a namespace import (QA, 0.14.1).
- 0.14.1 Fair randomness and fixes: cosmetic particles off the gameplay random generator (QA, 0.13.2), with every cosmetic draw and the screen shake on their own generator `fxRng`, burning chunks never dropped at the particle cap and a lint rule that keeps `rng` out of scene code; the Bog Rush path mark readable on phones (QA, 0.14.0), with longer outlined dashes, a taller end post and a near-white flash in the last 0.25 s of the wind-up; and the compact HUD's smallest slots (QA, 0.13.2), with every level badge inside its own slot.
- 0.14.0 Bog Rush: the Bog Hulk as a two-phase boss with the Sinking, the Rise, a cracked phase 2 look, the Bog Rush slide, coins 8 to 10 and the Bog Breaker achievement.
- 0.13.2 Oakheart's split bark and fixes: the bark-split burst reads weakly (QA, 0.13.1), now with a lasting violet split in Oakheart's trunk under half HP that flares with each wind-up, a lost acorn, and a burst of 16 leaves, 8 bark chips and 6 rift sparks with a stronger shake; the day-era backdrop (QA, 0.12.1 and 0.12.2), now with no second sun, moon or eclipse beside the stage in any era and no band at the stage's top line; and compact HUD charms on one line (QA, 0.12.2) for a full build at every compact window width.
- 0.13.1 Wave 5 and the Prism Knight: Oakheart drops its guard under half HP with a leaf burst, with HP 240 to 200, branch sweep 18 to 14 and a 1.25 times longer rest above half HP; Crystal Nova's prism beams strike grounded foes by their hit box; the co-op lobby shows the Warp Knight's look; and the Prism Knight's pauldron gets a deep violet rim and wider plates.
- 0.13.0 Prism Knight: class advancement with jobs on the hero screen, opened through goals and kept per hero, and Kael's second job, the Prism Knight, opened by defeating Oakheart with him, with its own look, prism shards, Prism Thrust, Shatterfall and prism beams on Crystal Nova. Day work: the side-scrolling solo adventure with seven boss rooms, patrols, spike traps, mentors and an E to S grade.
- 0.12.2 HUD above the stage: a compact HUD layout above the stage in small desktop windows (640 by 600, 700 by 700, 800 by 600, 1280 by 1024), and the HUD's place no longer changes during a run.
- 0.12.1 Balance and fixes: Oakheart HP 320 to 240 and root line 20 to 16; the Lantern Procession drawn as three separate rings over the same band; and the HUD moves above the stage only when its measured height fits there, which fixes the cut-off HUD in small desktop windows (the known issue since 0.9.0).
- 0.12.0 Gloam Shepherd: a two-phase boss of Nightfall at wave 15 with a kneel between its phases, replacing the Rift Brute, and the Shepherd's End achievement with kills tracked per foe type.
- 0.11.2 Kept presses: Kael's and Yun's shared cast, Aldric's Shield Rush and call, Vesper's weave and stitch, and Calder's shots and reload keep a shared press and let it cut them once they have landed, as Saya's moves do since 0.11.1.
- 0.11.1 Balance and fixes: shared actions cut Saya's Brushline, Moonrise and counter draw once they land, with no lost presses; Oakheart HP 400 to 320 and branch sweep 22 to 18; and Yun's Sword Screen drawn at full strength on an outlined jade plate with a white flash on a block.
- 0.11.0 Nine Blades: the sword roster at the owner's request, outside the nightly studio: eight sword heroes (Cerise, Aldric, Vesper, Saya, Yun, Brynn, Zafir and Calder), Kael's new look, the nine heroes without a sword removed with a refund of their price, every hero as its own module, the guard against a touching foe, one set of words and a title of the same shape for every hero, and the hero sprint closed in the charter. Day work: one moveset for every hero with the floating crystals removed, the run clock and records, and touch play on iPhone and iPad.
- 0.10.0 Red Oath: the tenth hero, a berserker (studio, hero sprint night seven), which completed the hero sprint, and every hero's ability tabs wrapping together as one row.
- 0.9.0 Keep Time: a war drummer (studio, hero sprint night six), the Abyss Sovereign at wave 30 and what waits behind it (day work), combos that lock their target at four fifths pace with the hit counter (day work), and the full-detail graphics and speed pass (day work).
- 0.8.0 Unseen: a knife fighter who hid from foes (studio, hero sprint night five) and the foe blind status.
- 0.7.0 Lamplight: a lamplighter who fought through summons (studio, hero sprint night four), the `noFlow` damage option, and kills through a guard counting for the blow's source.
- 0.6.0 Borrowed Time: a time mage (studio, hero sprint night three), the shared time fields, every hero in their own rest pose in the menus, and a fix for fliers level with a ledge (the 0.5.0 known issue).
- 0.5.0 Long Chain: a chain fighter (studio, hero sprint night two), hero skills replacing relics with 20 skills per hero (day work), the growth rework with charms, chests, Flow, streaming waves, damage by source and the Codex (day work).
- 0.4.0 Iron Grip: a grappler (studio, hero sprint night one), a crossbow hunter (day work), achievements and coin unlocks for heroes (day work), the hero roster screen (day work).
- 0.3.0 Side by Side: co-op rooms for up to four players (feedback 10), the low HP glow and wounded idle (feedback 8), detailed heroes and foes at 640 by 360, and a fresh hero at the start of every run.
- 0.2.0 Evolutions: Sunflask, Glacier Bloom and Thunderhead for Kael, the kept jump press and held-Up launcher, Rift Warden HP 900 to 720, coins +25 percent, and the load flash fix (feedback 4).
