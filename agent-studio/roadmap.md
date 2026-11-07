# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

- Hero sprint (charter): one new hero every night until the game has ten. Each one plays completely differently from the rest. (Grand Chase, pillar 2)
  - Taken play styles: Kael (warp swordsman), Ysra (planted glaive, brace and parry, Heat), Sable (ranged hunter, ammo and reload) and Hulda (unarmed grappler, grabs and throws, armour plates built from Grit).
  - Next prices by the rule: 550, 750, 1000, 1350, 1800, 2450.
  - Suggested order, chosen to keep each new hero far from the last: a tether fighter who swings on a chain (movement-led), a time or gravity mage (control-led), a summoner (once the thrown-body and hold code proves foes can be moved safely), a shadow assassin (needs a foe awareness rule first), a fighter on a rhythm.
  - Engine note: the optional `steadfast` hook in `hurtHero` is new shared code; a future hero with super armour should reuse it.

- Evolutions round two: Ysra's Flare and Brazier, Kael's Warp Strike, a blade or glaive combo evolution, and ultimate evolutions, using the same evolves and mastered fields. (Vampire Survivors, pillar 3)
- New system: class advancement. Each hero unlocks a second job after clearing the stage once, changing part of the combo, the special and the look. (Grand Chase, pillars 2 and 4)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. (pillars 1 and 4, feedback 10)
- Achievements round two: per-hero mastery achievements now that heroes have trials, a collection screen that records evolutions found and shows their recipes once found, and achievements that unlock shop items or a stage. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- New boss: a mid-stage boss with readable phases for wave 15, replacing a mini boss. (Grand Chase, pillar 1)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- The Rift Warden at wave 20. Baseline on 423a0e3: skilled Kael fell in 29 s with 2 kills, Ysra in 34.9 s with 0, Sable in 29.1 s with 0. Look at its orb and dive damage first.
- The mash gap between heroes. Baseline on 423a0e3: mash Kael wave 4, Ysra 5, Sable 5; skilled Kael 5, Ysra 7, Sable 5. After 0.4.0 (ffa52e8): mash Hulda wave 4 with 10 kills, skilled Hulda wave 4 with 11 kills. Check whether the gap is Kael or the bot's dash use before buffing him.
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other.
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)

Note for the owner: a playtest option to grant perks and set ranks at the start of a run would let bots measure evolutions directly.

## Later

- Hulda: catching foe projectiles and throwing them back. (pillar 1)
- Hulda: a full hold on mini bosses after a stagger. (pillar 1)
- Hulda: her own walk and run clips from a gait model. (pillar 5)
- Hulda: an Evolution branch, as Kael and Ysra have. (pillar 3)
- Hulda: an achievement of her own beyond the trial, for example a thrown foe that strikes three others. (pillar 4)

## Shipped

- 0.4.0 Iron Grip: Hulda the iron grappler (studio, hero sprint night one), Sable the hooded hunter (day work), achievements and coin unlocks for heroes (day work), the hero roster screen for up to ten heroes (day work).
- 0.3.0 Side by Side: co-op rooms for up to four players (feedback 10), the low HP glow and wounded idle (feedback 8), Ysra's mobility and survival pass (feedback 9), detailed heroes and foes at 640 by 360, and a fresh hero at the start of every run.
- 0.2.0 Evolutions: Sunflask, Glacier Bloom and Thunderhead for Kael, Pyre Colonnade for Ysra, the kept jump press and held-Up launcher, Rift Warden HP 900 to 720, coins +25 percent, and the load flash fix (feedback 4).
