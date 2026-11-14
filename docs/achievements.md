# Achievements and hero unlocks

Kael and Cerise are free.
Every other hero starts locked and is bought with coins on the hero screen.
Achievements give the player goals across runs, and most of them pay coins, which feed back into the shop and the hero unlocks.

## Hero unlocks

A hero's price is `CharacterDef.price` in its `src/heroes/<id>/character.ts`.
A price of 0 means the hero is open from the start.
The prices are fixed for the nine heroes, in roster order:

| Hero | Kael | Cerise | Aldric | Vesper | Saya | Yun | Brynn | Zafir | Calder |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Price | 0 | 0 | 300 | 400 | 550 | 750 | 1000 | 1350 | 1800 |

Each paid hero costs about 1.35 times the one before: the n-th paid hero costs 300 x 1.35^(n - 1), rounded to the nearest 50.

The basis is the coin table in `docs/meta-progress.md`.
A run that reaches wave 8 to 10 banks about 60 to 80 coins and a full clear about 440.
Aldric takes a few good runs, or one run past wave 20 with the achievement coins earned on the way.
Vesper, at 400, takes a few more, Saya, at 550, a few more again, Yun, at 750, about two runs past wave 10 beyond that, Brynn, at 1000, about three more, Zafir, at 1350, about one full clear past that, and Calder, at 1800, about one more.
All seven together cost 6,150 coins, about fourteen full clears.

The hero screen shows a roster of every hero over one panel for the hero in focus; Left and Right, or a tap on a tile, move through them.
A locked hero shows as a black silhouette with a padlock, its panel shows the price, and the bank shows under the title.
The first press asks "Unlock? Press again", the second one buys and makes the hero the choice.
A press the bank cannot pay for shakes the price.
A locked hero never starts a run.
In a co-op lobby, Left and Right step only through the heroes this player has unlocked.
A hero that is still a stand-in is left out of a production build, so players meet each hero once it is built.
Dev builds and the playtest harness show all nine, with a stand-in titled "Not built yet" and playing as Kael (`docs/hero-module.md`, "Replacing a stand-in").

Charms, charm slots and evolution recipes found across runs are a separate system with no coins; see `docs/unlocks.md`.

## Tracking

`src/store/achievements.ts` is the one owner of tracking.
The game reports what happens through `feat()` in `src/game/feat.ts`, called where the event already happens:

| Event | Where |
| --- | --- |
| A foe slain, with its rank | `killEnemy` in `src/game/kill.ts` |
| A wave reached | `startWave` in `src/game/waves.ts` |
| A wave cleared, with the hero | `endWave` in `src/game/endWave.ts` |
| A run ended, cleared or fallen | `endRun` in `src/game/runEnd.ts` |
| A blow landed, with the moves in the combo so far | `meleeHit` in `src/game/meleeHit.ts` |
| A perfect dodge or a parry | `rewardPerfectDodge` in `src/game/hero/perfectDodge.ts` and the shared guard's parry in `src/game/hero/heroGuard.ts` |
| An ultimate skill taken, a skill's new level, a skill evolved | `raiseSkill` and `evolveSkill` in `src/game/build/raise.ts` |
| Coins banked | `bankCoins` in `src/game/coins.ts`, and the co-op host and guest at run end |
| A hero's own stat counted | the hero's kit, through the `heroCount` and `heroBest` feats |

The same feats, and a few more, also feed the unlocks (`docs/unlocks.md`).

Shop levels and heroes bought are read from the meta save, so buying in the shop or unlocking a hero is checked as soon as it happens.

`applyFeat` in `src/utils/trackedStats.ts` turns an event into new stats, and the goal checks in `src/utils/achievements.ts` read those stats.
Stats are saved at the end of each wave and run, and an earned achievement saves at once with its coins.
Only solo runs count toward play goals; a co-op run counts the coins it banks.
The studio's playtest bots set `warpblade-playtest` in local storage, and the dev build then unlocks every hero and tracks nothing.

## Saving

Unlocked heroes, earned achievements and the tracked stats are optional fields of the `warpblade-meta-v1` save: `heroes`, `achievements` and `tracked`.
A save from before them loads with its coins and shop levels, no heroes bought and nothing earned.
`parseMeta` in `src/utils/metaSave.ts` keeps only the ids the game still has.
A save that bought a hero no longer in the roster gets that hero's price back into the bank once (`REMOVED_HERO_PRICES` in `src/constants/removedHeroes.ts`), and the start menu shows the refund until the next run starts.

## Where the player sees them

- A small banner slides down at the top of the screen when one is earned, in play or in the menu, and play goes on under it.
- The result screen names up to three earned in the run, with their coins.
- Achievements on the start menu lists them all by group, with the count earned under the title.
  An earned one has a gold trophy and its coins lit.
  One still to earn shows its goal, a progress bar when it counts up, and its coins dimmed.
  A hidden one shows ??? and the achievement that reveals it.

## The list

| Group | Name | Goal | Coins | Hidden until |
| --- | --- | --- | --- | --- |
| Waves | Into the Rift | Reach wave 5 | 15 | |
| Waves | Night Watch | Reach wave 10 | 30 | |
| Waves | Deep Rift | Reach wave 15 | 60 | |
| Waves | Last Era | Reach wave 20 | 100 | |
| Waves | Warpblade | Clear all 30 waves | 300 | Last Era |
| Heroes | Kael's Trial | Clear wave 10 with Kael | 40 | |
| Heroes | Cerise's Trial | Clear wave 10 with Cerise | 40 | |
| Heroes | Aldric's Trial | Clear wave 10 with Aldric | 40 | |
| Heroes | Vesper's Trial | Clear wave 10 with Vesper | 40 | |
| Heroes | Saya's Trial | Clear wave 10 with Saya | 40 | |
| Heroes | Yun's Trial | Clear wave 10 with Yun | 40 | |
| Heroes | Brynn's Trial | Clear wave 10 with Brynn | 40 | |
| Heroes | Zafir's Trial | Clear wave 10 with Zafir | 40 | |
| Heroes | Calder's Trial | Clear wave 10 with Calder | 40 | |
| Foes | Culling | Slay 100 foes | 20 | |
| Foes | Thinning the Night | Slay 3,000 foes | 80 | |
| Foes | Endless Blade | Slay 15,000 foes | 200 | Thinning the Night |
| Foes | Giant Slayer | Slay 10 mini bosses | 40 | |
| Foes | Warden's End | Slay the Rift Warden | 100 | Deep Rift |
| Foes | Lights Out | Defeat The Unblinking | 500 | Warpblade |
| Skill | Flowing Steel | Land the fifth move of a combo | 40 | |
| Skill | Untouchable | Make 25 perfect dodges or parries | 40 | |
| Skill | Final Art | Take an ultimate skill | 30 | |
| Skill | Evolved | Evolve a skill | 50 | |
| Coins | Coin Purse | Bank 500 coins from runs | 25 | |
| Coins | Treasury | Bank 3,000 coins from runs | 100 | Coin Purse |
| Coins | Outfitted | Buy 10 levels or skills in the Shop | 30 | |
| Coins | New Blood | Unlock a hero with coins | 50 | |

The trials are built from the roster: `src/constants/achievements.ts` adds one for every hero in `CHARACTERS`, with the id `trial-<id>` and the same reward.
A hero left out of a production build has no trial there until it is built.
Since waves stream their quota of foes (`docs/growth-design.md`), a full clear slays about 620 foes where it slew about 190, so the two larger kill goals went up from 1,000 and 5,000 to 3,000 and 15,000 to stay about as far off in runs.
They keep their ids, `kills-1000` and `kills-5000`, so saves that earned them keep them.
The 19 shared achievements pay 1,810 coins and each hero's trial 40, so with all nine heroes the page lists 28 achievements that together pay 2,170 coins.

## A hero's own achievements

A hero adds its own achievements in `CharacterDef.achievements`, in its `src/heroes/<id>/character.ts` (`docs/hero-module.md`, "Achievements").
`ACHIEVEMENTS` in `src/constants/achievements.ts` gathers them from every hero in the roster, after the shared Skill achievements.
Each names its group and has a goal on one of the hero's own stats:

```ts
{ id: "<id>-<name>", name: "...", text: "As <Name>, ...", group: "Skill", goal: { kind: "hero", stat: "<id>.<stat>", need: 30 }, reward: 60 }
```

The hero's kit counts the stat with `feat`:

- `feat({ kind: "heroCount", stat: "<id>.<stat>", add: 1 })` adds to a lifetime count.
- `feat({ kind: "heroBest", stat: "<id>.<stat>", value: n })` keeps the best value ever reached, for a goal met within one run or one move.

Every achievement id starts with `<id>-` and every hero stat with `<id>.`, so two heroes never share one.
The stats are saved with the player's other tracked stats, under `tracked.hero`.
No hero has achievements of its own yet: Kael's list is empty, and the eight heroes being built add theirs with their kits.

## Adding a hero

The roster is fixed at nine heroes, and each one's price is set (`docs/hero-module.md`).
A hero in the roster gets its trial with no further step.
When a hero adds its own achievements, add their rows to the list above and update the count and the total.
