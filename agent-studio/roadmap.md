# Studio roadmap

The director keeps this file current after every patch: it adds ideas, moves items between lists and removes what shipped.
Each item names the reference or pillar it serves and any feedback IDs behind it.
Order inside a list is priority order.

## Next big patches

- Hero sprint (charter): one new hero every night until the game has ten. Each one plays completely differently from the rest. (Grand Chase, pillar 2)

- Evolutions round two: Ysra's Flare and Brazier, Kael's Warp Strike, a blade or glaive combo evolution, and ultimate evolutions, using the same evolves and mastered fields. (Vampire Survivors, pillar 3)
- New system: class advancement. Each hero unlocks a second job after clearing the stage once, changing part of the combo, the special and the look. (Grand Chase, pillars 2 and 4)
- Co-op round two: player names, rejoining a run, a guest joining between waves, hit-stop that freezes only the striking hero and its foes, and client-side prediction for the guest's own hero. (pillars 1 and 4, feedback 10)
- Achievements round two: a collection screen that records evolutions found and shows their recipes once found, and achievements that unlock shop items or a stage. (Vampire Survivors, pillar 4)
- New stage: a second stage with its own eras, platforms and hazards, unlocked by clearing the first. (Grand Chase dungeons, pillar 4)
- New boss: a mid-stage boss with readable phases for wave 15, replacing a mini boss. (Grand Chase, pillar 1)
- Run modifiers: curses chosen before a run that make foes stronger for more coins. (Vampire Survivors, pillar 4)

## Small patch candidates

- Measure the Rift Warden at wave 20 after the 0.2.0 HP cut. Baseline on af6af06: skilled Kael fell in 29 s with 2 kills and 165 HP lost, skilled Ysra in 34.9 s with 0 kills. Look at its orb and dive damage first.
- Measure both heroes after Ysra's pass. Baseline on af6af06: mash Kael wave 4, Ysra wave 5; skilled Kael wave 5, Ysra wave 7. Check whether the gap is Kael or the bot's dash use before buffing him.
- Measure each hero's mash and skilled bot runs and bring their death waves within two waves of each other.
- Check the shop prices against coins earned per run (see `docs/meta-progress.md`).
- Measure the four evolutions' damage per cast with the 0.2.0 scenario scripts and even them out; Glacier Bloom is the weakest on paper.
- Tune `COOP_SCALING` once real rooms report results. (feedback 10)

Note for the owner: a playtest option to grant perks and set ranks at the start of a run would let bots measure evolutions directly.

## Shipped

- 0.3.0 Side by Side: co-op rooms for up to four players (feedback 10), the low HP glow and wounded idle (feedback 8), Ysra's mobility and survival pass (feedback 9), detailed heroes and foes at 640 by 360, and a fresh hero at the start of every run.
- 0.2.0 Evolutions: Sunflask, Glacier Bloom and Thunderhead for Kael, Pyre Colonnade for Ysra, the kept jump press and held-Up launcher, Rift Warden HP 900 to 720, coins +25 percent, and the load flash fix (feedback 4).
