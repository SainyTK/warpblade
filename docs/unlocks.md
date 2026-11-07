# Unlocks and the Codex

Relics, charms and slots are found over many runs.
A new player starts with a small set, and every other relic, charm and slot opens when its goal is met.
The game keeps most of it a mystery: the Codex shows a cryptic hint for what is still locked, a few secret entries show only ???, and evolution recipes stay hidden until the player has made that evolution once.

## Starting set

- Relics: Seeker Wisp (`wisp`) and Orbit Shards (`shards`).
- Charms: Might, Haste, Vigor and Insight.
- 3 relic slots and 3 charm slots; the design maximum stays 5 and 5 (`RELIC_SLOTS`, `CHARM_SLOTS`).

The data is in `src/constants/unlocks.ts`.

## The unlock table

The exact goals below are what the game hides.
"In one run" goals count from the run's start; the others count over every run.

| Unlock | Goal | Hint the Codex shows | Secret |
| --- | --- | --- | --- |
| Warp Daggers | Land 30 back attacks in one run | Strike them where they cannot see you. | |
| Echo Blade | Land 300 blows in one run | A blade swung often enough begins to answer. | |
| Storm Rod | Clear wave 10 | Past the tenth gate, the sky starts to crackle. | |
| Ember Aura | Reach wave 12 having taken 2 relics or fewer in the run | Travel light into the deep, and the embers will find you. | |
| Frost Bell | Evolve a relic | When one relic changes shape, another rings in answer. | |
| Thorn Trail | Defeat 1,500 foes with relics | Let your relics reap until the ground itself grows teeth. | Yes |
| Persistence | Raise any relic to level 4 | A relic kept long enough wants to stay longer. | |
| Resonance | Fill Flow to the top | Strike without pause until the current runs over. | |
| Swiftness | Make 10 perfect dodges or parries in one run | Slip past enough blows in one night and your feet grow light. | |
| Reach | Defeat 150 foes with relics in one run | Relics that reap enough in one night want to reach further. | |
| Fortune | Open a chest with five upgrades | Some chests hold far more than they should. | |
| Multitude | Raise any relic to level 8 | A relic at its peak longs for company. | Yes |
| Fourth relic slot | Reach wave 8 | Go deeper than the first giant and your hands find room. | |
| Fourth charm slot | Open 5 chests | Open enough chests and one of them opens you. | |
| Fifth relic slot | Clear wave 20 | Break the gate at the end of the fourth era. | |
| Fifth charm slot | Clear all 30 waves | Only those who see the stage's end carry five. | Yes |

A blow is a swing of the hero's own that lands, counted once per swing.
A back attack is a hit of the hero's own (attacks, abilities or ultimate) on a foe from the side it is not facing.
A relic kill is a kill whose last hit came from a relic.

## Pacing

Early runs that die around waves 4 to 8 should find Resonance, Persistence and often Warp Daggers or Swiftness, and the fourth relic slot at wave 8.
Persistence comes early on purpose: it is Orbit Shards' partner, so Shard Halo is possible from the second or third run, and Wisp Choir (Seeker Wisp with Haste) is possible from the first.
Runs into the rain era bring Echo Blade, Storm Rod and Reach, and a run that travels light to wave 12 brings Ember Aura, whose partner Vigor is in the starting set.
Chests from wave 3 on bring the fourth charm slot and, with luck, Fortune.
The first evolution opens Frost Bell; a relic at level 8 opens Multitude for Warp Daggers.
Thorn Trail (1,500 relic kills; a full run has about 650 foes, so several long runs), the fifth relic slot (wave 20) and the fifth charm slot (a stage clear) take many hours.

When each evolution becomes possible:

| Evolution | Needs | Earliest |
| --- | --- | --- |
| Wisp Choir | Seeker Wisp, Haste | First run |
| Shard Halo | Orbit Shards, Persistence | After a relic reaches level 4 |
| Phantom Arc | Echo Blade, Might | After 300 blows in a run |
| Sun Heart | Ember Aura, Vigor | After wave 12 travelling light |
| Dagger Storm | Warp Daggers, Multitude | After a relic reaches level 8 |
| Thunder Crown | Storm Rod, Fortune | After a five-upgrade chest |
| Glacier Toll | Frost Bell, Reach | After the first evolution |
| Bramble Wake | Thorn Trail, Swiftness | After 1,500 relic kills |

## Recipes

A card for a relic says "Evolves with ???" until the player has made that relic's evolution once.
Core calls `learnRecipe(id)` when a relic evolves; `knowsRecipe(id)` tells the cards and the Codex whether to show the partner charm.

## Tracking

Unlocks use the achievement machinery (`docs/achievements.md`): `feat()` reports the event, `applyFeat` turns it into tracked stats, and an unlock's goal is a `Goal` read from those stats, like an achievement's.
`src/store/unlocks.ts` checks the goals after every feat and owns what is found, the known recipes and what was found since the run began (`unlockedThisRun()`).
The pure checks are in `src/utils/unlocks.ts`.

New feats:

| Feat | Where |
| --- | --- |
| `backAttack` | `dealDamage` in `src/game/damage.ts`, for a hero hit from behind |
| `kill` now carries the `source` of the last hit | `killEnemy` in `src/game/kill.ts`, from `dealDamage` |
| `relicLevel`, `evolved`, `chestOpened`, `flowFull` | core's build, chest and Flow code |

"In one run" goals are kept as bests (`runBackAttacks`, `runBlows`, `runPerfects`, `runRelicKills`, `lightWave`) from a run tally that starts over with each run and is never saved.
Unlocks are not achievements: they pay no coins and the Achievements page does not list them.

Only solo runs count, like the achievements, since `feat()` ignores a co-op room.
In a co-op room every hero is dealt from the host's unlocks, slots and recipes: the host runs the game and deals the cards, so it reads its own store, and nothing has to cross the wire.
A guest's own finds only count in their solo runs.

A playtest session (`warpblade-playtest`) has everything found and every recipe known, and finds nothing.

## Saving

The `warpblade-meta-v1` save has two new optional fields: `unlocks` (found unlock ids) and `recipes` (relic ids whose evolution was made).
New tracked stats are new optional keys of `tracked`.
A save from before them loads with nothing found; goals it already meets, such as a wave long since reached, are found on load.
The highest wave cleared is read from the waves cleared with each hero for such a save.

## Where the player sees them

- A banner in the achievement style, in crystal, with the found thing's icon, when something is found in play or a recipe is learned.
- The end of run screen lists what the run found, under the achievements it earned.
- The Codex on the start menu, next to Achievements: each relic with its evolution under it, the charms and the extra slots.
  A found one shows its icon, name and text, and an evolution its recipe once made.
  A locked one shows a dark silhouette and its hint; a secret one only ???.
  The count found out of everything is under the title.
