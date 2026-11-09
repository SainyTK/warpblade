# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

- Hero sprint (charter): one new hero every night until the game has ten. Each one plays completely differently from the rest. (Grand Chase, pillar 2)
  - Taken play styles: Kael (warp swordsman), Ysra (planted glaive, brace and parry, Heat), Sable (ranged hunter, ammo and reload), Hulda (unarmed grappler, grabs and throws, armour plates built from Grit), Orrin (tether fighter, pendulum swing on a hooked chain, Momentum from speed, mid-range tip sweet spot), Mirel (time mage, Stillfield slowing foes and shots, delayed echoes on every blow, Rewind that heals, hover at the jump's apex, Sand refilled by waiting) and Wenna (summoner, Wicks that hold and intercept, Wax dripped by kills, Swap, Kindle). Seven of ten heroes.
  - Next prices by the rule: 1350, 1800, 2450.
  - Suggested order for the last three, chosen to keep each new hero far from the last: a shadow assassin (after a foe awareness rule), a fighter on a rhythm, and a berserker or shield thrower as the tenth.
  - The trapper leaves the open directions, since Wenna covers damage placed away from the hero.
  - Engine note: the optional `steadfast` hook in `hurtHero` is new shared code; a future hero with super armour should reuse it.
  - Engine note: Orrin's swing runs in his kit through `drivesMotion` and `gravityScale`. A future hero with a tether or rope should reuse his pendulum step and write no second one.
  - Engine note: `src/game/timeFields.ts` (`fieldPace`) is the shared hook for anything that slows foes or foe shots in an area, and the foe `stopped` status is the shared full stop. Future time or control heroes and skills reuse both.
  - Engine note: Wenna's Wick hold (`src/game/enemies/holds.ts`) and her `absorbHurt` intercept are the pattern for any future ally that blocks for a hero. If a later hero needs foes to choose allies as targets, build a shared target hook then and move Wicks onto it.
  - Engine note: `dealDamage` has a `noFlow` option for Wenna's Wick bites; future summons in base kits should use it.

- New system: class advancement. Each hero unlocks a second job after clearing the stage once, changing part of the combo, the special and the look. (Grand Chase, pillars 2 and 4)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. (pillars 1 and 4, feedback 10)
- Achievements round two: per-hero mastery achievements now that heroes have trials, and achievements that unlock shop items or a stage. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- New boss: a mid-stage boss with readable phases for wave 15, replacing a mini boss. (Grand Chase, pillar 1)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- The Rift Warden at wave 20. On 8f3fa9f in bot-skilled-wave20 every hero fell in 20.7 to 23.5 s with 0 kills (Kael 23.5 s, Ysra 23.3 s, Sable 20.7 s, Hulda 23.3 s), and on the 0.6.0 baseline all six heroes fell in 18.9 to 27.5 s with 0 kills. Before tuning, check whether the wave-20 start at level 14 matches a real run's level and build under the new growth curve.
- The mash gap between heroes. On 0.6.0 (one deterministic run each from wave 1): mash Kael wave 4, Ysra 5, Sable 5, Hulda 4, Orrin 5, Mirel 5 with 16 kills; skilled Kael 5, Ysra 5, Sable 5, Hulda 8, Orrin 3 (the skilled bot never hooks), Mirel 5 with 14 kills (neither bot presses K, so her Stillfield is left out).
- Hero sprint nights are all big, so carry one measured balance fix beside a hero on a night when the hero's scope allows it.
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other.
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)

Note for the owner: the playtest bots need an Orrin entry (hook use for the skilled bot) and a Mirel entry (a skilled policy would hold K over a crowd, string inside it and press L after a hit). The studio cannot edit `agent-studio/playtest/`.
The bots also need a Wenna entry: a skilled policy would press K when Wax allows, strike the nearest foe with J to set the Quarry, Kindle a Wick beside a crowd, and press L away from a wind-up.

## Later

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

## Shipped

- 0.7.0 Lamplight: Wenna the lamplighter (studio, hero sprint night four, the summoner from the suggested order), the shared foe hold seam, the `noFlow` damage option, and kills through a guard counting for the blow's source.
- 0.6.0 Borrowed Time: Mirel the hour keeper (studio, hero sprint night three), the shared time fields and foe stop status, every hero in their own rest pose in the menus, and the Anchor Pin fix for fliers level with a ledge (the 0.5.0 known issue).
- 0.5.0 Long Chain: Orrin the chain dancer (studio, hero sprint night two), hero skills replacing relics with 20 skills per hero (day work), the growth rework with charms, chests, Flow, streaming waves, damage by source and the Codex (day work). The hero skills also shipped evolutions for every hero (Evolutions round two, Hulda's evolutions), and the Codex shipped the collection screen from Achievements round two.
- 0.4.0 Iron Grip: Hulda the iron grappler (studio, hero sprint night one), Sable the hooded hunter (day work), achievements and coin unlocks for heroes (day work), the hero roster screen for up to ten heroes (day work).
- 0.3.0 Side by Side: co-op rooms for up to four players (feedback 10), the low HP glow and wounded idle (feedback 8), Ysra's mobility and survival pass (feedback 9), detailed heroes and foes at 640 by 360, and a fresh hero at the start of every run.
- 0.2.0 Evolutions: Sunflask, Glacier Bloom and Thunderhead for Kael, Pyre Colonnade for Ysra, the kept jump press and held-Up launcher, Rift Warden HP 900 to 720, coins +25 percent, and the load flash fix (feedback 4).
