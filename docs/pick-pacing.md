# Pick pacing

A run is 30 waves.
Every level up gives the hero one skill point, and the points wait until the wave is cleared.
When the wave's last foe falls with points waiting, the game pauses on a pick of three cards for each point, before the pause to the next wave.
The fight itself is never paused by a level up; only the Level banner shows.
Points left when wave 30 falls are not spent, since the stage and the run end there.

## How many picks a run gives

The growth rework (`docs/growth-design.md`) moved the curve to `15 + 10 x (level - 1)` (`XP_CURVE` in `src/constants/growth.ts`).

- Experience drops as orbs that Kael picks up; the numbers assume he collects all of it, which he does because left orbs fly to him.
- A full run reaches about level 84: level 3 after wave 1, 13 after wave 9, 38 after wave 20 and 84 after wave 30.
  The curve before the rework reached 1, 6, 13 and 19.
- Level ups give about 80 picks in a full run, two more with the shop's Head Start.
- A pick deals relics, charms and skills (`dealCards` in `src/utils/cards.ts`), so skills share the picks with the build.
- Every level gate was moved so it still arrives at about the same wave: the gates of skill nodes, the combo lengths in `COMBO_BY_LEVEL` and the evolutions' level.
  Ultimates (levels 30 to 38) come between waves 18 and 20, and the six-hit combo (level 65) near wave 27.

## Evolutions

Each of Kael's spells and Ysra's Flame Pillar has an evolved form (`kind: "evolution"`, in each hero's Evolution branch).
It is offered once its skill is learned (`evolves`), its partner passive is at full rank (`mastered`) and the hero is level 13 or higher.
Level 13 arrives around wave 9, so a focused build can evolve one skill by waves 9 to 12.

| Evolution | Hero | Skill | Partner at full rank | Points to reach it |
| --- | --- | --- | --- | --- |
| Sunflask | Kael | Fire Flask | Mana Font 3/3 | 5 |
| Glacier Bloom | Kael | Ice Spikes | Swift Sigils 3/3 | 5 |
| Thunderhead | Kael | Lightning | Arcane Power 4/4 | 7, since Arcane Power needs Mana Font |
| Pyre Colonnade | Ysra | Flame Pillar | Kindling 3/3 | 5, since she starts with Flare |

The point counts include the evolution card itself.
Points spent on a spell or rite line are points not spent on combo, movement or an ultimate, which is the price of an evolution.
When any evolution is ready, `dealCards` (`src/utils/cards.ts`) deals one of them as the first card and fills the rest as usual, so a pick never shows two.
A second ready evolution comes at the next pick.
Evolutions belong to the run and reset with it; nothing about them is saved.

## When cards run short

If fewer cards than a pick deals are left, Second Wind (`src/constants/boons.ts`) fills the rest and restores all HP and MP.
With about 80 picks against 57 ranks for Kael plus the relic and charm levels, this can happen late in a long run with full slots.
