# Achievements and hero unlocks

Kael and Ysra are free.
Every newer hero starts locked and is bought with coins on the hero screen.
Achievements give the player goals across runs, and most of them pay coins, which feed back into the shop and the hero unlocks.

## Hero unlocks

The prices live in one table, `HERO_PRICES` in `src/constants/heroUnlocks.ts`, keyed by hero id.
A hero that is not in the table is free.

Each new hero gets the next price: the n-th hero added to the table costs 300 x 1.35^(n - 1), rounded to the nearest 50.

| Hero | 1st (Sable) | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th | 9th |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Price | 300 | 400 | 550 | 750 | 1000 | 1350 | 1800 | 2450 | 3300 |

The basis is the coin table in `docs/meta-progress.md`.
A run that reaches wave 8 to 10 banks about 60 to 80 coins and a full clear about 440.
Sable takes a few good runs, or one run past wave 20 with the achievement coins earned on the way.
The ninth hero costs about seven full clears.

On the hero screen a locked hero shows as a black silhouette with a padlock and the price, and the bank shows under the title.
The first press asks "Unlock? Press again", the second one buys.
A press the bank cannot pay for shakes the price.
A locked hero never starts a run.
In a co-op lobby, Left and Right step only through the heroes this player has unlocked.

A hero can be in the price table before it is in `CHARACTERS`; it shows up locked the moment it is added there.

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
| A perfect dodge or a parry | `perfectDodge` and Ysra's `parry` |
| A skill learned on a pick, with its kind | `choosePick` in `src/game/progress.ts` |
| Coins banked | `bankCoins` in `src/game/coins.ts`, and the co-op host and guest at run end |

Shop levels and heroes bought are read from the meta save, so buying in the shop or unlocking a hero is checked as soon as it happens.

`applyFeat` in `src/utils/trackedStats.ts` turns an event into new stats, and the goal checks in `src/utils/achievements.ts` read those stats.
Stats are saved at the end of each wave and run, and an earned achievement saves at once with its coins.
Only solo runs count toward play goals; a co-op run counts the coins it banks.
The studio's playtest bots set `warpblade-playtest` in local storage, and the dev build then unlocks every hero and tracks nothing.

## Saving

Unlocked heroes, earned achievements and the tracked stats are new optional fields of the `warpblade-meta-v1` save: `heroes`, `achievements` and `tracked`.
A save from before them loads with its coins and shop levels, no heroes bought and nothing earned.

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
| Heroes | Ysra's Trial | Clear wave 10 with Ysra | 40 | |
| Heroes | Sable's Trial | Clear wave 10 with Sable | 40 | |
| Foes | Culling | Slay 100 foes | 20 | |
| Foes | Thinning the Night | Slay 1,000 foes | 80 | |
| Foes | Endless Blade | Slay 5,000 foes | 200 | Thinning the Night |
| Foes | Giant Slayer | Slay 10 mini bosses | 40 | |
| Foes | Warden's End | Slay the Rift Warden | 100 | Deep Rift |
| Skill | Flowing Steel | Land the fifth move of a combo | 40 | |
| Skill | Untouchable | Make 25 perfect dodges or parries | 40 | |
| Skill | Final Art | Learn an ultimate | 30 | |
| Skill | Evolved | Learn an evolution | 50 | |
| Coins | Coin Purse | Bank 500 coins from runs | 25 | |
| Coins | Treasury | Bank 3,000 coins from runs | 100 | Coin Purse |
| Coins | Outfitted | Buy 10 levels or skills in the Shop | 30 | |
| Coins | New Blood | Unlock a hero with coins | 50 | |

Sable's Trial counts only once Sable is in `CHARACTERS`; until then the page lists 20.
All of them together pay 1,450 coins.

## Adding a hero

1. Add the hero to `CHARACTERS` in `src/constants/characters/index.ts`.
2. Add its id to `HERO_PRICES` in `src/constants/heroUnlocks.ts` with the next price from the table above.
3. Add `heroTrial("<id>", "<Name>")` to `ACHIEVEMENTS` in `src/constants/achievements.ts`, after the last hero's.
4. Add its row to the tables in this file.
