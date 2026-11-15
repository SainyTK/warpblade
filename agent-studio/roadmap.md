# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

Patch 0.11.0 set the roster at nine sword heroes (the charter's Roster section), and big patches keep the charter's three-day cadence.

- New system: class advancement. Each hero unlocks a second job after clearing the stage once, changing part of the combo, the special and the look. First in line, since the roster is now fixed. (Grand Chase, pillars 2 and 4)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. (pillars 1 and 4, feedback 10)
- Achievements round two: per-hero mastery achievements now that heroes have trials, and achievements that unlock shop items or a stage. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- New boss: a mid-stage boss with readable phases for wave 15, replacing a mini boss. (Grand Chase, pillar 1)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- After 0.11.1, rerun all bots and check how far heroes now reach past wave 5. In 0.11.1 Oakheart went to 320 HP and an 18 sweep, yet 0 of 18 ordinary runs cleared wave 5 (2 of 9 when started at wave 5, level 6), since heroes enter worn down and the root line, the moths and the acorns kill about as often as the sweep. Look next at the root line, the moth pressure in wave 5, or the HP heroes carry into the mini boss. Then measure the Bog Hulk at wave 10 the same way, since all nine heroes fight in melee against its frontal guard too. (pillar 1)
- Check every hero's own ability states for the press loss Saya had in 0.11.0: a state longer than the 0.15 s press buffer with no `mayAct`. The 0.11.1 smoke check showed only Saya, but the smoke check presses each key once. (pillar 1)
- The Rift Warden at wave 20. The wave 20 bot starts at level 14, which matches a run after wave 10, while `docs/growth-design.md` puts a real run at level 35 after wave 20. Ask the owner to start the wave 20 bot at about level 35 (`agent-studio/playtest` belongs to the owner) before the Warden is tuned.
- A measuring room in the repo for skill balance (the method of `docs/skills/balance.md` as a playtest scenario with repeat runs and a tougher late target), then settle the eight new heroes' skills inside their bands. Zafir's Sand Wraith read over its band in his own room, Cerise's Measured Touch and Calder's Point Blank sit just over the crowd cap after QA's cuts, Zafir's room figures predate his wound cut, and most of Yun's and Vesper's level 8 skills read under their bands. (pillar 3)
- The ultimates per cast against their targets: Vesper's Dusk Waltz, Brynn's Crimson Fall and Yun's evolved Jade Rain read short in the hero agents' rooms. (pillar 1)
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other, after the Oakheart rerun above: every hero ended at wave 5, so the spread could not be read.
- The HUD at some desktop window sizes (also in 0.9.0): at 640 by 600 and 700 by 700 it sits partly above the screen, and at 600 by 540 the first tab row touches the pause button. A measured placement was tried in 0.10.0 and taken out because it moved the HUD over the stage on 360 by 640 phones. (pillar 1)
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`), with the bot coins after 0.11.1 (baseline: 24 to 32 coins per run).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Play Cerise, Vesper, Yun and Brynn in a co-op room: their state is kept per seat, and QA's co-op pairs covered only Saya, Zafir, Aldric and Calder. (pillar 1, feedback 10)
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)

## Later

- Each sword hero: its own walk and run from a gait model, and Kael his own rest stance in the menus. (pillar 5)

## Heroes and shared code

- Taken play styles: see the charter's Roster section.
- A hero is a self-contained module under `src/heroes/<id>/`; `docs/hero-module.md` lists every hook.
- Engine note: the optional `steadfast` hook in `hurtHero` is the shared no-flinch hook; a hero with super armour reuses it.
- Engine note: `src/game/timeFields.ts` (`fieldPace`) is the shared hook for anything that slows foes or foe shots in an area.
- Engine note: `src/game/shotWards.ts` is the shared hook for anything that breaks foe projectiles in an area.
- Engine note: `dealDamage` has a `noFlow` option for hits that should build no Flow; summons in base kits use it.
- Engine note: `src/game/enemies/awareness.ts` (`foeSees`) and the foe `blind` status are the shared hooks for anything that blinds foes.

## Shipped

Patches 0.4.0 to 0.10.0 each added a hero that carried no sword; patch 0.11.0 removed those heroes and the shared hooks only they used.

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
