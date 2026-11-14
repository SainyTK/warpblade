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

- The Rift Warden at wave 20. On the 0.9.0 baseline Kael fell at the wave 20 start in 23.1 s with 0 kills. Before tuning, check whether the wave-20 start at level 14 matches a real run's level and build under the new growth curve and the slower pace.
- Measure the eight new heroes with the mash and skilled bots once they ship, against Kael's runs.
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other.
- The HUD at some desktop window sizes (also in 0.9.0): at 640 by 600 and 700 by 700 it sits partly above the screen, and at 600 by 540 the first tab row touches the pause button. A measured placement was tried in 0.10.0 and taken out because it moved the HUD over the stage on 360 by 640 phones. (pillar 1)
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)

## Later

- Each new sword hero: its own walk and run from a gait model, once the eight have shipped. (pillar 5)

## Heroes and shared code

- Taken play styles: see the charter's Roster section.
- A hero is a self-contained module under `src/heroes/<id>/`; `docs/hero-module.md` lists every hook.
- Engine note: the optional `steadfast` hook in `hurtHero` is the shared no-flinch hook; a hero with super armour reuses it.
- Engine note: `src/game/timeFields.ts` (`fieldPace`) is the shared hook for anything that slows foes or foe shots in an area.
- Engine note: `src/game/shotWards.ts` is the shared hook for anything that breaks foe projectiles in an area.
- Engine note: `dealDamage` has a `noFlow` option for hits that should build no Flow; summons in base kits use it.
- Engine note: `src/game/enemies/awareness.ts` (`foeSees`) and the foe `blind` status are the shared hooks for anything that blinds foes.

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
