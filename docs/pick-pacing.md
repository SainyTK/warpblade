# Pick pacing

A run is 30 waves.
Every level up gives the hero one skill point, and the points wait until the wave is cleared.
When the wave's last foe falls with points waiting, the fight plays on for 0.9 seconds (`PICK_DELAY` in `src/constants/waves.ts`) so the fall is seen, then the game pauses on a pick of three cards for each point.
The rest of the 2 second pause to the next wave follows the picks.
The fight itself is never paused by a level up; only the Level banner shows.
Points left when wave 30 falls are not spent, since no wave follows it.

## How many picks a run gives

The growth rework (`docs/growth-design.md`) moved the curve to `15 + 10 x (level - 1)` (`XP_CURVE` in `src/constants/growth.ts`).

- Experience drops as orbs that Kael picks up; the numbers assume he collects all of it, which he does because left orbs fly to him.
- A full run reaches about level 84: level 3 after wave 1, 13 after wave 9, 38 after wave 20 and 84 after wave 30.
  The curve before the rework reached 1, 6, 13 and 19.
- Level ups give about 80 picks in a full run, two more with the shop's Head Start.
- A pick deals skills and charms (`dealCards` in `src/utils/cards.ts`); picks have no level gates and no prerequisites.
- The ground string's length is fixed per hero (`CharacterDef.comboHits`).

## Evolutions

A skill evolves in a chest, never on a card: from wave 8 a chest evolves one skill at level 8 whose partner is held at level 4 or more (`docs/skill-design.md`).
The next level of a held skill is a rare card (weight 9 against 100 for a new skill), so most runs evolve their first skill late (wave 24 in the median simulated run) and few evolve more than three (`docs/growth-design.md`, "Skill cards and evolutions").
Evolutions belong to the run and reset with it; only the recipe (which partner a skill evolves with) is kept across runs.

## When cards run short

If fewer cards than a pick deals are left, Second Wind (`src/constants/boons.ts`) fills the rest and restores all HP and MP.
With about 75 picks against 64 skill levels and up to 25 charm levels, this can happen late in a long run with full slots.
