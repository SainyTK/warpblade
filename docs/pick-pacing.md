# Pick pacing

A run is 30 waves.
Every level up gives Kael one skill point, and the points wait until the wave is cleared.
When the wave's last foe falls with points waiting, the game pauses on a pick of three cards for each point, before the pause to the next wave.
The fight itself is never paused by a level up; only the Level banner shows.
Points left when wave 30 falls are not spent, since the stage and the run end there.

## How many picks a run gives

The numbers below come from adding up the experience of every foe in the wave plan (`src/utils/waves.ts`) against the curve in `src/constants/progression.ts`, assuming every foe dies.

- Experience drops as orbs that Kael picks up; the numbers assume he collects all of it, which he does because left orbs fly to him.
- The curve is twice the first one (base 48, step 26). Kael reaches about level 4 at wave 5, level 11 at wave 19 and level 18 at wave 30.
  The first curve reached 5, 16 and 26.
- Level ups give about 17 skill points in a full run, two more with the shop's Head Start.
- Kael's skill tree holds 57 ranks that one run can learn, counting one skill from each group that locks out its rivals and the three evolutions, so a full run learns about a third of it.
  Five of them are the abilities Kael no longer starts with: Warp Strike, Fire Flask, Ice Spikes, Lightning and Crystal Nova.
- Every level gate is still reached: ultimates (levels 11 to 13) between waves 17 and 20, and the six-hit combo (level 17) near wave 28.

## Evolutions

Each of Kael's spells and Ysra's Flame Pillar has an evolved form (`kind: "evolution"`, in each hero's Evolution branch).
It is offered once its skill is learned (`evolves`), its partner passive is at full rank (`mastered`) and the hero is level 6 or higher.
Level 6 arrives around wave 9, so a focused build can evolve one skill by waves 9 to 12.

| Evolution | Hero | Skill | Partner at full rank | Points to reach it |
| --- | --- | --- | --- | --- |
| Sunflask | Kael | Fire Flask | Mana Font 3/3 | 5 |
| Glacier Bloom | Kael | Ice Spikes | Swift Sigils 3/3 | 5 |
| Thunderhead | Kael | Lightning | Arcane Power 4/4 | 7, since Arcane Power needs Mana Font |
| Pyre Colonnade | Ysra | Flame Pillar | Kindling 3/3 | 5, since she starts with Flare |

The point counts include the evolution card itself.
Points spent on a spell or rite line are points not spent on combo, movement or an ultimate, which is the price of an evolution.
When any evolution is ready, `rollPicks` (`src/utils/skillPicks.ts`) deals one of them as the first card and fills the rest as usual, so a pick never shows two.
A second ready evolution comes at the next pick.
When none is ready, the cards are dealt exactly as before, with the same random draws.
Evolutions belong to the run and reset with it; nothing about them is saved.

## When cards run short

If fewer skills than cards are left, Second Wind (`src/constants/boons.ts`) fills the rest and restores all HP and MP.
With about 17 points against 57 ranks for Kael this does not happen in a normal run.
