# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

The hero sprint is complete with ten heroes after 0.10.0, and big patches return to the charter's three-day cadence.

- New system: class advancement. Each hero unlocks a second job after clearing the stage once, changing part of the combo, the special and the look. First in line, since every hero now exists to advance. (Grand Chase, pillars 2 and 4)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. (pillars 1 and 4, feedback 10)
- Achievements round two: per-hero mastery achievements now that heroes have trials, and achievements that unlock shop items or a stage. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- New boss: a mid-stage boss with readable phases for wave 15, replacing a mini boss. (Grand Chase, pillar 1)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- Tallis's mash run fell from wave 4 with 12 kills (his design note after the combo layer) to wave 3 with 9 kills on the 0.9.0 baseline while the other seven reached wave 5. Find which day-work commit moved him before tuning.
- Jory's flinch (0.9.0 known issues): mashing J through a flinch brings him back 16 to 144 ms after it ends where Kael takes 0 to 16 ms, and a J on the first airborne frame after it can get no answer. Measure the kept press's lapse from the latest J in the flinch, or from the flinch's end. (pillar 1)
- The Rift Warden at wave 20, now with ten heroes. On the 0.9.0 baseline every hero fell at the wave 20 start in 21.0 to 29.5 s with 0 kills (Kael 23.1, Ysra 24.3, Sable 29.5, Hulda 28.8, Orrin 21.0, Mirel 24.5, Wenna 22.2, Tallis 23.1, Jory 26.9), and Brannoc fell in 24.6 s with 0 kills on 0.10.0; on 0.6.0 all six heroes fell in 18.9 to 27.5 s with 0 kills. Before tuning, check whether the wave-20 start at level 14 matches a real run's level and build under the new growth curve and the slower pace.
- The mash gap between heroes. On the 0.9.0 baseline (one deterministic run each from wave 1): Kael, Ysra, Sable, Hulda, Orrin, Mirel and Wenna wave 5, Tallis wave 3, Jory wave 4 with 10 kills; Brannoc measured wave 5 with 14 kills on 0.10.0.
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other.
- Brannoc (0.10.0 known issues): the evolved summons and Haemorrhage hit hard by the developer's reading, and Carrion Storm's raven cloud wins back no debt where the single ravens do. Measure before changing anything. (pillar 3)
- Brannoc's touch Ability button: the HP cost rim is accurate but small at phone size, so 8% and 10% differ by a pixel or two. (pillar 1)
- The HUD at some desktop window sizes (also in 0.9.0): at 640 by 600 and 700 by 700 it sits partly above the screen, and at 600 by 540 the first tab row touches the pause button. A measured placement was tried in 0.10.0 and taken out because it moved the HUD over the stage on 360 by 640 phones. (pillar 1)
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)
- Wenna's Flare cone starts at her chest, behind the lantern (0.7.0 known issue), as a polish fix. (pillar 5)

Note for the owner: the playtest bots need an Orrin entry (hook use for the skilled bot) and a Mirel entry (a skilled policy would hold K over a crowd, string inside it and press L after a hit). The studio cannot edit `agent-studio/playtest/`.
The bots also need a Wenna entry: a skilled policy would press K when Wax allows, strike the nearest foe with J to set the Quarry, Kindle a Wick beside a crowd, and press L away from a wind-up.
The bots also need a Tallis entry: a skilled policy would press K when no foe within 60 px faces him, get behind the nearest foe by walking or Sink, press J when the back-open chevron shows, and press L when a foe winds up in front of him.
The bots also need a Jory entry: a skilled policy would read his beat phase, press J, K and L within 0.05 s of each beat, press K when a foe shot is within 60 px, and press L on the beat when a foe winds up in front of him.
The bots also need a Brannoc entry: a skilled policy would press K before a crowd, string J into it, press L at a foe out of reach, and press U when Bloodied.
The skilled bot's page close on the 0.9.0 baseline was not a game crash: Tallis's skilled run stalls on wave 4 on a platform above the last two walkers until the 30 game-minute limit, and the studio step's own time limit closed the page. The skilled policy could drop through a ledge when every foe left is on the floor below and none flies, and the studio step could pass a lower `--max-minutes`.

## Later

- Brannoc: his own walk and run from a gait model. (pillar 5)
- Brannoc: a second ultimate skill that trades max HP for the run. (pillar 3)
- Brannoc: an achievement for winning back 500 HP of debt in one run. (pillar 4)
- Brannoc: an option to show the debt as a number for players who want it exact. (pillar 1)

- Jory: a beat offset setting on the Options screen for audio delay. (pillar 1)
- Jory: a second and third ultimate skill. (pillar 3)
- Jory: his own walk and run from a gait model that steps on the beat. (pillar 5)
- Jory: an achievement for a full string of on-beat presses through a mini boss wave. (pillar 4)

- Tallis: climbing and clinging to the stage walls for drops from above. (pillar 1)
- Tallis: his own walk and run from a gait model. (pillar 5)
- Tallis: a third ultimate skill that marks a whole wave. (pillar 3)
- Mini boss behaviour that hunts a veiled hero by sound, if players find the Veil too safe. (pillar 1)

- Wenna: a second Wick kind (a shield-bearer or an archer) chosen with O, if players want more minion control. (pillar 2)
- Wenna: an achievement for keeping eight Wicks lit at once. (pillar 4)
- Wenna: her own walk and run from a gait model. (pillar 5)

- Mirel: a spell that sends foes back along their own path (needs a per-foe position history). (pillar 1)
- Mirel: her own walk and run from a gait model. (pillar 5)
- Mirel: a third ultimate skill that ages a whole wave. (pillar 3)
- Orrin: a second air-bite style, where a hooked foe becomes a moving swing point. (pillar 1)
- Orrin: his own walk and run from a gait model. (pillar 5)
- Orrin: a grab-free foe yank (hook and pull a minion to him) if players ask for more crowd control. (pillar 1)
- Orrin: a chain-length readout on the HUD while swinging, if new players find air bites unclear. (pillar 1)
- Hulda: catching foe projectiles and throwing them back. (pillar 1)
- Hulda: a full hold on mini bosses after a stagger. (pillar 1)
- Hulda: her own walk and run clips from a gait model. (pillar 5)
- Hulda: an achievement of her own beyond the trial, for example a thrown foe that strikes three others. (pillar 4)

## Heroes and shared code

- Taken play styles: Kael (warp swordsman), Ysra (planted glaive, brace and parry, Heat), Sable (ranged hunter, ammo and reload), Hulda (unarmed grappler, grabs and throws, armour plates built from Grit), Orrin (tether fighter, pendulum swing on a hooked chain, Momentum from speed, mid-range tip sweet spot), Mirel (time mage, Stillfield slowing foes and shots, delayed echoes on every blow, Rewind that heals, hover at the jump's apex, Sand refilled by waiting), Wenna (summoner, Wicks that hold and intercept, Wax dripped by kills, Swap, Kindle), Tallis (shadow assassin, Veil from Gloam refilled while unseen, Sink shadow pool, blows from behind at 2.25x), Jory (war drummer, a beat clock that judges J, K, L and I, Groove that raises his tempo from 96 to 132 bpm, Boom that pushes foes and drowns shots, Beat Step safe on the beat) and Brannoc (berserker, HP spent into a debt won back by blows, Fury from missing HP, no defence but Frenzy and Berserk).
- The next hero price by the rule: 3300.
- Engine note: the optional `steadfast` hook in `hurtHero` is the shared no-flinch hook; a future hero with super armour should reuse it.
- Engine note: the optional `hpFloor` kit hook in `hurtHero` is the shared way to keep a hero standing at a set HP; any later skill or status that does that reuses it.
- Engine note: the HP bar's debt segment (`src/ui/debtBar.ts`) is the place for any later recoverable-HP mechanic.
- Engine note: Orrin's swing runs in his kit through `drivesMotion` and `gravityScale`. A future hero with a tether or rope should reuse his pendulum step and write no second one.
- Engine note: `src/game/timeFields.ts` (`fieldPace`) is the shared hook for anything that slows foes or foe shots in an area, and the foe `stopped` status is the shared full stop. Future time or control heroes and skills reuse both.
- Engine note: Wenna's Wick hold (`src/game/enemies/holds.ts`) and her `absorbHurt` intercept are the pattern for any future ally that blocks for a hero. If a later hero needs foes to choose allies as targets, build a shared target hook then and move Wicks onto it.
- Engine note: `dealDamage` has a `noFlow` option for Wenna's Wick bites; future summons in base kits should use it.
- Engine note: `src/game/enemies/awareness.ts` (`heroHidden`, `foeSees`), the optional kit hook `hidden`, and the foe `blind` status are the shared hooks for anything that hides a hero or blinds foes; future heroes and skills reuse them. The co-op `nearest` now skips hidden heroes while a visible one stands.
- Engine note: `src/game/beat.ts` (`advanceBeats`, called from `stepGame`) is the shared beat clock that runs through hit-stop and slow motion. Anything that should keep musical time reuses it.

## Shipped

- 0.10.0 Red Oath: Brannoc the berserker (studio, hero sprint night seven, the tenth hero), which completes the hero sprint; the shared `hpFloor` hook and the HP bar's debt segment, and every hero's ability tabs wrapping together as one row.
- 0.9.0 Keep Time: Jory the war drummer (studio, hero sprint night six), the shared beat clock, the Abyss Sovereign at wave 30 and what waits behind it (day work), combos that lock their target at four fifths pace with the hit counter (day work), and the full-detail graphics and speed pass (day work).
- 0.8.0 Unseen: Tallis the gloam knife (studio, hero sprint night five), the shared foe awareness rule, the foe blind status, and foes in co-op going for a visible hero first.
- 0.7.0 Lamplight: Wenna the lamplighter (studio, hero sprint night four, the summoner from the suggested order), the shared foe hold seam, the `noFlow` damage option, and kills through a guard counting for the blow's source.
- 0.6.0 Borrowed Time: Mirel the hour keeper (studio, hero sprint night three), the shared time fields and foe stop status, every hero in their own rest pose in the menus, and the Anchor Pin fix for fliers level with a ledge (the 0.5.0 known issue).
- 0.5.0 Long Chain: Orrin the chain dancer (studio, hero sprint night two), hero skills replacing relics with 20 skills per hero (day work), the growth rework with charms, chests, Flow, streaming waves, damage by source and the Codex (day work). The hero skills also shipped evolutions for every hero (Evolutions round two, Hulda's evolutions), and the Codex shipped the collection screen from Achievements round two.
- 0.4.0 Iron Grip: Hulda the iron grappler (studio, hero sprint night one), Sable the hooded hunter (day work), achievements and coin unlocks for heroes (day work), the hero roster screen for up to ten heroes (day work).
- 0.3.0 Side by Side: co-op rooms for up to four players (feedback 10), the low HP glow and wounded idle (feedback 8), Ysra's mobility and survival pass (feedback 9), detailed heroes and foes at 640 by 360, and a fresh hero at the start of every run.
- 0.2.0 Evolutions: Sunflask, Glacier Bloom and Thunderhead for Kael, Pyre Colonnade for Ysra, the kept jump press and held-Up launcher, Rift Warden HP 900 to 720, coins +25 percent, and the load flash fix (feedback 4).
