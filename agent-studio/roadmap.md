# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

Patch 0.11.0 set the roster at nine sword heroes (the charter's Roster section), and big patches keep the charter's three-day cadence.
The next big patch is due on 24 November, since 0.13.0 shipped on 21 November.
0.13.0 was a new-system headline (class advancement), so the next big patch should rotate to another kind unless players ask for more jobs.

- New system: class advancement round two. A second job for two more heroes, Cerise and Aldric suggested, since their parry and shield give a job room to change defence. Each gets its own look, 3rd blow and finisher, mark and ultimate addition, opened by defeating Oakheart with that hero. First in line for the next new-system headline. (Grand Chase, pillars 2 and 4)
- Job choice in co-op rooms: the lobby and host session carry the job id beside the hero id; job state is already per seat. (pillar 4, feedback 10)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. (pillars 1 and 4, feedback 10)
- Achievements round two: per-hero mastery achievements now that heroes have trials, and achievements that unlock shop items or a stage. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- For the owner: the Rift Warden at wave 20. The wave 20 bot starts at level 14, which matches a run after wave 10, while `docs/growth-design.md` puts a real run at level 35 after wave 20. Ask the owner to start the wave 20 bot at about level 35 (`agent-studio/playtest` belongs to the owner) before the Warden is tuned. The Gloam Shepherd and the ultimate figures below wait on this too.
- For the owner: the smoke check presses each key once after the last settles, so it cannot see a lost press. Ask the owner to add a step to `agent-studio/playtest` that presses U 0.1 s after I for every hero and checks the ultimate starts. (pillar 1)
- For the owner: in Brynn's skilled bot run from wave 5, level 6, the bot stands on the right platform above two Mire Toads in wave 6 until the 30 minute timeout (QA, 0.12.1). It is deterministic and affects measurement only, but it will skew the wave 10 Bog Hulk measurement. Ask the owner to have the bot drop down to foes below it (`agent-studio/playtest` belongs to the owner).
- For the owner: the skilled bot's Vesper run holds U forever on a ledge at wave 6 or 7 above foes that cannot reach it, so her ordinary run ends as a timeout at wave 7 (QA, 0.13.1). Ask the owner to have the bot drop down to foes below it, together with Brynn's stall above (`agent-studio/playtest` belongs to the owner).
- Wave 5. In 0.13.1 Oakheart drops its guard under half HP (with a leaf burst), its base HP went from 240 to 200 (1,153 to 961 at wave 5), its branch sweep from 18 to 14, and its rest between attacks above half HP became 1.25 times as long. The plan had only the guard drop; the stat cuts were the developer's deviation after the guard alone left the skilled bot at 2 of 9, and they repeat 0.11.1's levers. Measured result: the ordinary skilled bot clears wave 5 in 4 of 9 runs, up from 1 (Brynn, Zafir, Calder, Vesper), inside the target of 3 to 6; mash clears it in 2 of 9, up from 0 (Brynn, Zafir), the top of its 0 to 2 range. HP lost at wave 5 (hpLostByWave): Brynn 99 to 49, Zafir 125.6 to 67, Calder 93.1 to 90. Kael, Cerise, Aldric, Saya and Yun still fall at wave 5, reaching it with 67 to 108 HP left after waves 1 to 4. In frontal fights at wave 5, level 6, Oakheart's first half takes 18.0 to 19.3 s (base 20.6 to 29.6 s), and heroes started there clear it with 8 of 9 heroes, up from 5, most in 15 to 30 s with 50 to 122 HP left. QA's minor issue: wave 5 may now be easy for a hero who arrives with full HP, and real players with shop upgrades may find Oakheart much softer than the bots suggest. If skilled goes over 6 of 9 on a later measurement, give the guard back for the first quarter of the enraged half. If it falls under 3 of 9, the next lever is the enraged cooldown, allowed from 0.14.1 at the earliest (three patches after 0.13.1). Easing waves 1 to 4 is the other lever for the five heroes who still fall there. (pillar 1)
- The Bog Hulk at wave 10. Brynn and Zafir now reach wave 10 on the skilled bot and wave 9 on mash. Measure it the same way as Oakheart, since all nine heroes fight in melee against its frontal guard too, and check Vesper's ordinary skilled run there once the owner fixes her ledge stall. (pillar 1)
- The bark-split burst reads weakly (QA, 0.13.1). The 10 leaf shards fire under the hit flash and damage numbers, the pale-green flecks sit around a green crown, and Oakheart looks the same afterwards, so a player who misses the 0.5 to 0.9 s burst has no lasting cue that the guard is gone. Give it a stronger burst or a lasting mark on the bark, using the `guarding` hook's phase. (pillars 1 and 5)
- A measuring room in the repo for skill balance (the method of `docs/skills/balance.md` as a playtest scenario with repeat runs and a tougher late target), then settle the eight new heroes' skills inside their bands. Zafir's Sand Wraith read over its band in his own room, Cerise's Measured Touch and Calder's Point Blank sit just over the crowd cap after QA's cuts, Zafir's room figures predate his wound cut, and most of Yun's and Vesper's level 8 skills read under their bands. Endless Rain's evolved row keeps every level 8 value (checked in `heavensGrove.ts`), so its low reading is the room, not the data. (pillar 3)
- The ultimates per cast against their targets: Vesper's Dusk Waltz, Brynn's Crimson Fall and Yun's evolved Jade Rain read short in the hero agents' rooms. (pillar 1)
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other. After 0.13.1 the skilled runs spread from wave 5 to wave 10, while five heroes still end at wave 5, so settle the wave 5 item first.
- The Gloam Shepherd at wave 15. The Procession's one-wide-ring look is fixed in 0.12.1 (rings of 9 px radius, 19 px apart, over the same 56 px band). Measure it at a level near a real run (`docs/growth-design.md` puts a run near level 25 by wave 15) once the owner raises the late bot's start level, then tune its HP within 400 to 560, its kneel window and the Procession's narrow jump window (about 700 to 950 ms) from that. The 0.12.0 level 14 bots never reached its second phase. (pillar 1)
- A larger compact HUD in large windows (QA, 0.12.2). Windows such as 1280 by 1024, 1440 by 900 and 1180 by 820 now use the compact HUD at phone size (10 px text, 5 px bars) in the top corners, with room left unused beside a 4x stage. Before 0.12.2 they had the 12 px HUD inside the stage. A larger compact size where the room allows would read better. (pillar 1)
- The phone HUD's reserved band (QA, 0.12.2). On a phone held upright the HUD sits 47 px higher than in 0.12.1 (top 163 px against 210 px at 390 by 844), with an empty band under the bars early in a run where it keeps room for a full build. At 320 by 568 it now stays inside the stage for the whole run. Look for a way to keep the place fixed with less empty room on phones. (pillar 1)
- Compact HUD charms on one line (QA, 0.12.2). At 640 by 600 and 700 by 700 a full build puts the charms on a second row under the skills; the plan asked for one line. It fits the 90 px budget (84 px at 640 by 600), and at 1024 by 768 the full build fits on one line.
- The day-era backdrop (QA, 0.12.1 and 0.12.2). Beside the stage the backdrop shows lighter bands with a visible edge at the stage's top line, and at 600 by 540 a second sun appears on the backdrop beside the stage's sun. (pillar 5)
- The Bog Hulk at wave 10 and the Abyss Maw at wave 25 are the era leaders left with a single phase. A later new-boss patch can give one of them a kneel and a second phase the way the Gloam Shepherd has them. (Grand Chase, pillar 1)
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`), with the bot coins after 0.11.1 (baseline: 24 to 32 coins per run).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Play Cerise, Vesper, Yun and Brynn in a co-op room: their state is kept per seat, and QA's co-op pairs covered only Saya, Zafir, Aldric and Calder. (pillar 1, feedback 10)
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)
- Measure the Prism Knight against the Warp Knight once the owner lets the bot choose a job (a skilled run each from wave 5, level 6). The job aims at equal clear rates, not higher ones. (pillars 2 and 3)
- For the owner: the bots and the side-scrolling adventure (8aa5370). The bots do not play the adventure: the bot sets the `warpblade-playtest` storage key, and `startRun` only begins the adventure when that key is absent or `?section=` is given, so the bot's wave 1 and wave 20 runs play the 30-wave arena. Ask the owner whether the bots should run the adventure (`agent-studio/playtest` belongs to the owner). Until then QA checks Oakheart's adventure room by hand; in 0.13.1, as Brynn in section 1, the leaf burst showed at half HP and Oakheart (600 HP there) died 4.3 s later. (pillar 1)
- Prism shards on Oakheart (QA, 0.13.0). Its front guard blocked many Prism Thrusts (2 of 5 three-blow strings lodged a shard in the run sampled). Since 0.13.1 Oakheart has no guard under half HP. Measure shards lodged per string on its enraged half, and close this item if they build at the rate they do on other foes. (pillar 1)
- Vite's large-chunk warning on build (QA, 0.13.1). The game chunk is 1,236 kB (443 kB gzipped). Split it, for example by loading heroes or eras on demand, so the warning goes away and the first load gets lighter.
- Verify what 0.13.0 could not (QA, 0.13.0): a full co-op room with a real guest over PeerJS, and the run result's "New job" entry after a real Oakheart kill.

## Later

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

## Shipped

Patches 0.4.0 to 0.10.0 each added a hero that carried no sword; patch 0.11.0 removed those heroes and the shared hooks only they used.

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
