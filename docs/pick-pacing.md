# Pick pacing

A solo run is one stage, from level 1 to 99 (`docs/growth-design.md`, "Stage arc").
Every level on the pick schedule gives the hero one skill point, and the points bank while the hero fights.
In a stage, the cards open 0.9 seconds after a room beat ends (a Rift Surge cleared, the elite, mini boss or boss down; `ROOM_BEATS` in `src/constants/stageArc.ts`), then the room pauses 2 seconds before the next beat.
Points can also be spent at any time with the area's mentor.
In the co-op arena the points wait until the wave is cleared, then the game pauses on a pick for each point (`PICK_DELAY` in `src/constants/waves.ts`).
The fight itself is never paused by a level up; only the Level banner shows.

## How many picks a stage gives

- Experience in a stage is budgeted per beat so that a hero who kills everything ends each beat at its planned level: 15 at the end of the opening, 50 after the mini boss, 99 after the stage boss (`docs/growth-design.md`).
- Experience drops as orbs; left orbs fly to the hero, so none is lost.
- Not every level gives a pick: one per level up to 30, then one every second level, plus milestones at 50, 75 and 99, 66 picks from level 1 to 99 (`docs/growth-design.md`, "Pick budget").
- A Rift Surge is three waves, about 30 to 78 foes in all; it gives 6 to 11 levels and 4 to 10 picks when it ends.
- A pick deals skills, masteries, charge ranks, attunements and Honing stat cards (`dealCards` in `src/utils/cards.ts`); new skills wait for a slot opened by the level, and picks have no prerequisites.
- In the co-op arena `XP_CURVE` (`15 + 10 x (level - 1)`) and the wave experience are unchanged: a full 30-wave run reaches about level 84.

## Evolutions

A skill evolves in a chest, never on a card: from wave 8 (in a stage, from the band that wave matches, about level 25) a chest evolves one skill at level 8 whose partner is held at level 4 or more (`docs/skill-design.md`).
Evolutions belong to the run and reset with it; only the recipe (which partner a skill evolves with) is kept across runs.

## When cards run short

Honing cards never run out, so a pick always has at least three cards.
If a fourth card is dealt with nothing left for it, Second Wind (`src/constants/boons.ts`) fills it and restores all HP and MP.
