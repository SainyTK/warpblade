# Unlocks and the Codex

Charms, charm slots and evolution recipes are found over many runs.
A new player starts with a small set of charms, and every other charm and the extra charm slots open when their goals are met.
Every hero's 20 skills can be dealt from the first run (`docs/skill-design.md`); what stays hidden is how they evolve.
The game keeps most of it a mystery: the Codex shows a cryptic hint for what is still locked, a few secret entries show only ???, and a skill's evolution partner stays hidden until the player has made that evolution once.

## Starting set

- Charms: Might, Haste, Vigor and Insight.
- 8 skill slots, always (`SKILL_SLOTS`).
- 3 charm slots; the design maximum stays 5 (`STARTING_CHARM_SLOTS` in `src/constants/unlocks.ts`, `CHARM_SLOTS`).

The data is in `src/constants/unlocks.ts`.

## The unlock table

The exact goals below are what the game hides.
"In one run" goals count from the run's start; the others count over every run.

| Unlock | Goal | Hint the Codex shows | Secret |
| --- | --- | --- | --- |
| Persistence | Raise any skill to level 4 | A skill kept long enough wants to stay longer. | |
| Resonance | Fill Flow to the top | Strike without pause until the current runs over. | |
| Swiftness | Make 10 perfect dodges or parries in one run | Slip past enough blows in one night and your feet grow light. | |
| Reach | Defeat 150 foes with skill sources in one run | Skills that reap enough on their own in one night want to reach further. | |
| Fortune | Open a chest with five upgrades | Some chests hold far more than they should. | |
| Multitude | Raise any skill to level 8 | A skill at its peak longs for company. | Yes |
| Fourth charm slot | Open 5 chests | Open enough chests and one of them opens you. | |
| Fifth charm slot | Clear all 30 waves | Only those who see the stage's end carry five. | Yes |

A skill kill is a kill whose last hit came from a skill's own source (a summon, a projectile it launched, damage over time), not from the hero's own presses.

## Pacing

Early runs that die around waves 4 to 8 should find Resonance and Persistence, and often Swiftness.
Runs into the rain era bring Reach for a build with summons or damage over time.
Chests from wave 3 on bring the fourth charm slot and, with luck, Fortune.
A skill at level 8 opens Multitude.
The fifth charm slot (a stage clear) takes many hours.

## Recipes

A skill card shows its evolution's name and "Evolves with ???" until the player has made that evolution once; after that it names the partner, in gold when the hero holds it.
Core calls `learnRecipe(id)` when a skill evolves; `knowsRecipe(id)` tells the cards and the Codex whether to show the partner.
Recipes are kept by skill id, so skill ids are unique across heroes.

## Tracking

Unlocks use the achievement machinery (`docs/achievements.md`): `feat()` reports the event, `applyFeat` turns it into tracked stats, and an unlock's goal is a `Goal` read from those stats, like an achievement's.
`src/store/unlocks.ts` checks the goals after every feat and owns what is found, the known recipes and what was found since the run began (`unlockedThisRun()`).
The pure checks are in `src/utils/unlocks.ts`.

Feats the unlocks read:

| Feat | Where |
| --- | --- |
| `kill` carries the `source` of the last hit | `killEnemy` in `src/game/kill.ts`, from `dealDamage` |
| `skillLevel`, `evolved`, `ultimateLearned` | `raiseSkill` and `evolveSkill` in `src/game/build/raise.ts` |
| `chestOpened`, `flowFull` | core's chest and Flow code |

"In one run" goals are kept as bests (`runPerfects`, `runSkillKills`) from a run tally that starts over with each run and is never saved.
Unlocks are not achievements: they pay no coins and the Achievements page does not list them.

Only solo runs count, like the achievements, since `feat()` ignores a co-op room.
In a co-op room every hero is dealt from the host's unlocks, slots and recipes: the host runs the game and deals the cards, so it reads its own store, and nothing has to cross the wire.
A guest's own finds only count in their solo runs.

A playtest session (`warpblade-playtest`) has everything found and every recipe known, and finds nothing.

## Saving

The `warpblade-meta-v1` save keeps `unlocks` (found unlock ids) and `recipes` (skill ids whose evolution was made).
Loading keeps only ids the game still has, so a save from the relic version loads with its relic unlocks and relic recipes dropped and its charm unlocks kept.
Tracked stats the game no longer counts are dropped the same way.

## Where the player sees them

- A banner in the achievement style, in crystal, with the found thing's icon, when something is found in play or a recipe is learned.
- The end of run screen lists what the run found, under the achievements it earned.
- The Codex on the start menu, next to Achievements: each hero's skills with each skill's evolution under it, the charms and the extra charm slots.
  A skill always shows its icon, name and text.
  An evolution shows a dark silhouette and "Evolves with ???" until made once, then its name, text and recipe.
  A locked charm or slot shows a dark silhouette and its hint; a secret one only ???.
  The count under the title is of the evolutions, charms and slots found.
