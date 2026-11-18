# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

Patch 0.11.0 set the roster at nine sword heroes (the charter's Roster section), and big patches keep the charter's three-day cadence.

- New system: class advancement. A hero unlocks a second job that changes part of the combo, the special and the look. Ship the system and its unlock in one patch with one or two heroes, then add more heroes in later patches. The unlock must be reachable, for example the hero's Trial (wave 10), since a stage clear is out of reach in every measured run. First in line, since the roster is now fixed. (Grand Chase, pillars 2 and 4)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. (pillars 1 and 4, feedback 10)
- Achievements round two: per-hero mastery achievements now that heroes have trials, and achievements that unlock shop items or a stage. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- Wave 5. In 0.12.1 Oakheart's base HP went from 320 to 240 (1,538 to 1,153 at wave 5) and its root line from 20 to 16. Measured result: the skilled bot from wave 5, level 6 clears wave 5 in 5 of 9 runs, up from 2 (Aldric, Vesper, Brynn, Zafir, Calder), with Oakheart's time to kill 18.4 to 36.9 game s for the heroes who clear it (Zafir 18.4, Brynn 24.1, Calder 27.2, Vesper 36.3, Aldric 36.9). The ordinary skilled bot still clears it in 1 of 9 runs, as before (Brynn now, where it was Vesper, Oakheart killed in 31.5 s), missing the target of 3 of 9; mash stays at 0 of 9. QA's minor issue: ordinary runs still end at wave 5, though every failed run now leaves Oakheart about 300 to 550 HP lower (Kael 819 to 285, Aldric 620 to 240). The next Oakheart change is allowed from 0.13.1 at the earliest (the third patch after 0.12.1, counting a big 0.13.0). If wave 5 is still a wall then, try the guard next, for example no guard while enraged. Check Vesper then: her ordinary skilled run now falls with Oakheart at 75 HP. Then measure the Bog Hulk at wave 10 the same way, now that more bots should reach it, since all nine heroes fight in melee against its frontal guard too. (pillar 1)
- For the owner: the smoke check presses each key once after the last settles, so it cannot see a lost press. Ask the owner to add a step to `agent-studio/playtest` that presses U 0.1 s after I for every hero and checks the ultimate starts. (pillar 1)
- The Rift Warden at wave 20. The wave 20 bot starts at level 14, which matches a run after wave 10, while `docs/growth-design.md` puts a real run at level 35 after wave 20. Ask the owner to start the wave 20 bot at about level 35 (`agent-studio/playtest` belongs to the owner) before the Warden is tuned.
- A measuring room in the repo for skill balance (the method of `docs/skills/balance.md` as a playtest scenario with repeat runs and a tougher late target), then settle the eight new heroes' skills inside their bands. Zafir's Sand Wraith read over its band in his own room, Cerise's Measured Touch and Calder's Point Blank sit just over the crowd cap after QA's cuts, Zafir's room figures predate his wound cut, and most of Yun's and Vesper's level 8 skills read under their bands. (pillar 3)
- The ultimates per cast against their targets: Vesper's Dusk Waltz, Brynn's Crimson Fall and Yun's evolved Jade Rain read short in the hero agents' rooms. (pillar 1)
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other, after the Oakheart rerun above: every hero ended at wave 5, so the spread could not be read.
- The Gloam Shepherd at wave 15. The Procession's one-wide-ring look is fixed in 0.12.1 (rings of 9 px radius, 19 px apart, over the same 56 px band). Measure it at a level near a real run (`docs/growth-design.md` puts a run near level 25 by wave 15) once the owner raises the late bot's start level, then tune its HP within 400 to 560, its kneel window and the Procession's narrow jump window (about 700 to 950 ms) from that. The 0.12.0 level 14 bots never reached its second phase. (pillar 1)
- A compact HUD above the stage (QA, 0.12.1). In desktop windows such as 640 by 600, 700 by 700, 800 by 600 and 1280 by 1024 the HUD now sits inside the stage, fully visible, but at 2x scale it is 135 to 159 px tall over a 360 px stage, so it covers roughly the top 40% of the fight (flying moths, Storm Kites) while 120 to 150 px of room above the stage stays empty. A more compact outside layout, such as one tab row and smaller bars, would let it use that room. (pillar 1)
- The HUD moving mid-run at 600 by 540 (QA, 0.12.1). There the HUD's place depends on the hero and the run: Kael's HUD starts above the stage and moves inside once when the build strip grows at a pick. It moves once with no flicker, but players at that size see it jump. A compact outside layout (the item above) may settle both. (pillar 1)
- For the owner: in Brynn's skilled bot run from wave 5, level 6, the bot stands on the right platform above two Mire Toads in wave 6 until the 30 minute timeout (QA, 0.12.1). It is deterministic and affects measurement only, but it will skew the wave 10 Bog Hulk measurement. Ask the owner to have the bot drop down to foes below it (`agent-studio/playtest` belongs to the owner).
- The Bog Hulk at wave 10 and the Abyss Maw at wave 25 are the era leaders left with a single phase. A later new-boss patch can give one of them a kneel and a second phase the way the Gloam Shepherd has them. (Grand Chase, pillar 1)
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
- Engine note: `takes` on an `EnemyKind` is the shared hook for a foe's damage taken windows (the Gloam Shepherd's kneel), and `steady` keeps a foe from being stunned while it must stay up.
- Engine note: the `foeKills` goal kind with `TrackedStats.foes` is the shared way to make an achievement for one foe.

## Shipped

Patches 0.4.0 to 0.10.0 each added a hero that carried no sword; patch 0.11.0 removed those heroes and the shared hooks only they used.

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
