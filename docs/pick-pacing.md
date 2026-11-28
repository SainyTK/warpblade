# Pick pacing

A solo run is one stage, from level 1 to 99 (`docs/growth-design.md`, "Stage arc").
Every level on the pick schedule gives the hero one skill point, and the points bank while the hero fights.
In a stage, the cards open 0.35 seconds after a level up that gives a point (`PICK_DELAY_SECONDS` in `src/constants/defense.ts`), and when a big foe falls.
The game pauses while the cards are open.

## How many picks a stage gives

- Experience in a stage is budgeted by the clock so that a hero who kills everything follows the level band: 15 at 1:30, 44 at 4:30, 80 at 8:00 and 99 at 10:00 (`docs/growth-design.md`).
- Experience drops as orbs; left orbs fly to the hero, so none is lost.
- Not every level gives a pick: one per level up to 30, then one every second level, plus milestones at 50, 75 and 99, 66 picks from level 1 to 99 (`docs/growth-design.md`, "Pick budget").
- A pick deals skills, masteries, charge ranks, attunements and Honing stat cards (`dealCards` in `src/utils/cards.ts`); new skills wait for a slot opened by the level, and picks have no prerequisites.
- In the co-op arena `XP_CURVE` (`15 + 10 x (level - 1)`) and the wave experience are unchanged: a full 30-wave run reaches about level 84.

## Evolutions

A skill evolves in a chest, never on a card: from wave 8 (in a stage, from the band that wave matches, about level 25) a chest evolves one skill at level 8 whose partner is held at level 4 or more (`docs/skill-design.md`).
Evolutions belong to the run and reset with it; only the recipe (which partner a skill evolves with) is kept across runs.

## When cards run short

Honing cards never run out, so a pick always has at least three cards.
If a fourth card is dealt with nothing left for it, Second Wind (`src/constants/boons.ts`) fills it and restores all HP and MP.
