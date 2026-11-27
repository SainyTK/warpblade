# Unlocks and the Codex

Charms, charm slots, evolution recipes and hero jobs are found over many runs.
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

Hero jobs (`docs/hero-module.md`, Jobs) are found the same way, from each job's own `unlock` on its hero's `CharacterDef.jobs`.
They show on the hero screen, not in the Codex: a locked job's chip carries the padlock and its hint, which says plainly what to do.

| Job | Goal | Hint the hero screen shows |
| --- | --- | --- |
| Kael's Prism Knight (`job-kael-prism`) | Clear the Sunlit Ruins with Kael (the hero stat `kael.stage.prologue`) | Defeat Oakheart with Kael. |

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

## Stages, Hyper stages and the unlock table

Every unlock that is not a hero job is one row of `UNLOCKS` in `src/constants/unlocks.ts`: an id kept in the save, a reward, a goal and, for some, a gold price.
A row without a price is found the moment its goal is met; a row with a price goes on sale then, and is found when bought (`unlockState`, `buyUnlock` in `src/store/unlocks.ts`).
A later unlock (a skill, an item, a hero) is a new reward kind and new rows; the store, the save, the toasts and the result screen take it as it is.

The stage graph is `STAGE_OPENS` in `src/constants/stageGraph.ts`.
A new save has the Sunlit Ruins only.
Clearing a stage opens the stages it leads to; a stage with several stages before it opens when any one of them is cleared, except the Abyss Citadel, which needs both Veil Spires and Blightroot Hollow.

| Clear | Opens |
| --- | --- |
| Sunlit Ruins | Storm Marsh, Cinder Foundry |
| Storm Marsh | Frostglass Caverns, Thunderhead Skyway |
| Cinder Foundry | Frostglass Caverns, Drowned Archive |
| Frostglass Caverns | Moonlit Ruins |
| Thunderhead Skyway | Moonlit Ruins, Veil Spires |
| Drowned Archive | Moonlit Ruins, Blightroot Hollow |
| Moonlit Ruins | Veil Spires, Blightroot Hollow |
| Veil Spires and Blightroot Hollow | Abyss Citadel |

A stage clear also puts that stage's Hyper version on sale (`hyper:<stage>`).
Clearing a Hyper stage gives its own reward once (`hyperReward:<stage>`): a Rift Stage's Rift Art, which then starts every run at level 1; one more reroll every run for the Sunlit Ruins; one more banish every run for the Abyss Citadel.

The goals read two new things: `stageClears` (a stage's clears, Hyper apart) and `goalsMet` (how many of a list of goals are met), counted from the `stageCleared` feat that a cleared run reports.
The stage screen shows a locked stage's goal as "Clear Storm Marsh or Cinder Foundry" (`stageLockText`).

## Tracking

Unlocks use the achievement machinery (`docs/achievements.md`): `feat()` reports the event, `applyFeat` turns it into tracked stats, and an unlock's goal is a `Goal` read from those stats, like an achievement's.
`src/store/unlocks.ts` checks the goals of the unlocks and of every hero job after every feat, and once as the game loads, and owns what is found, the known recipes and what was found since the run began (`unlockedThisRun()`).
The stage result screen's Unlocked list is `unlockedThisRun()` and nothing else.
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

The `warpblade-meta-v1` save keeps `unlocks` (found unlock ids, job unlock ids included) and `recipes` (skill ids whose evolution was made).
The job chosen for each hero is kept apart, under `warpblade-jobs` (`{ "kael": "prism" }`, `src/services/jobChoice.ts`); a saved job that is locked or unknown plays as the hero's own job.
Loading keeps only ids the game still has, so a save from the relic version loads with its relic unlocks and relic recipes dropped and its charm unlocks kept.
Tracked stats the game no longer counts are dropped the same way.

## Where the player sees them

- A banner in the achievement style, in crystal, with the found thing's icon, when something is found in play or a recipe is learned; a job's reads "New job" over its name.
- The end of run screen lists what the run found, under the achievements it earned.
- The Codex on the start menu, next to Achievements: each hero's skills with each skill's evolution under it, the charms and the extra charm slots.
  A skill always shows its icon, name and text.
  An evolution shows a dark silhouette and "Evolves with ???" until made once, then its name, text and recipe.
  A locked charm or slot shows a dark silhouette and its hint; a secret one only ???.
  The count under the title is of the evolutions, charms and slots found.
