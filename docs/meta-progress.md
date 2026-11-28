# Meta progress: gold and the Armory

A run is a roguelite run: level, picks and learned skills start over each time.
Gold is what a run leaves behind, with its kill counts and goal progress (`docs/unlocks.md`).
Gold is banked when the run ends, cleared, lost, restarted or quit, and spent in the Armory, on heroes and on Hyper stages.
The code and the save still call gold coins.

## Gold

Every slain foe drops gold: a minion's base share of its wave (`COIN_DROP`, `coinShare`), an elite twice its base, a mini boss and a boss their full count.
Every foe drops a quarter more on top (`COIN_BONUS`) and Lodestone another quarter; Greed and Curse then multiply the drop by 10% per level, and a fraction left over is a chance at one more coin.
In a stage, gold per foe is x0.4 of the wave-mode drop (`FOE_BAND.goldShare`), times the stage twist and x2 on a Hyper stage.
Gold pops out of the foe, bounces, and is picked up by touch; after 1.6 seconds, or 0.3 with Lodestone, it flies to the hero.

A full clear earns 380 (Sunlit Ruins) to 670 (Moonlit Ruins) gold, and a run that falls in the opening act about 40 to 130.

## Run end

When the hero falls or the stage is cleared, the run's gold is banked and the stage result screen opens: grade, time, level, foes, damage and gold, what the run unlocked, the next goals with this run's progress, the best run for the stage, the damage of every source and the bank.
A fallen run keeps its gold, kill counts and goal progress, and gives no stage-clear reward.
Play again replays the stage, Choose stage opens the stage screen, Main menu goes home and Armory opens the Armory.

## The Armory

The Armory is on the start menu and the result screen.
An item appears there once its unlock goal is met (`docs/unlocks.md`), then costs gold.
Bought levels apply at the start of every run.

- Price: the first price times the level being bought, raised 5% for every Armory level already owned, rounded to 5 (`nextPrice` in `src/utils/armory.ts`, `PRICE_RISE_PER_PURCHASE`).
  So every purchase raises every other price a little.
- Refund all gives back every coin paid for the levels owned and empties the Armory, so the next purchases are cheap again.
  Unlocks bought with gold (heroes, skills, Hyper stages) are kept.
- An item bought can be switched off and on again at any time: its row's On or Off chip, or A and D on the row.
  A switched-off item does nothing in runs and still counts as bought.
- Skills for sale (`docs/unlocks.md`, skill ladder steps 6 and 13) are listed in the Armory under Skills and bought once.

| Item | Per level | Levels | Prices with nothing else owned |
| --- | --- | --- | --- |
| Vitality | Max HP +10 | 3 | 60, 120, 180 |
| Honed Edge | Attack damage +1 | 3 | 90, 180, 270 |
| Arcana | Ability power +1 | 3 | 90, 180, 270 |
| Wellspring | Max MP +10 | 3 | 50, 100, 150 |
| Precision | Crit chance +2% | 3 | 70, 140, 210 |
| Light Boots | Move speed +3% | 3 | 50, 100, 150 |
| Endurance | Max stamina +10 | 3 | 50, 100, 150 |
| Reroll | One more reroll every run | 3 | 60, 120, 180 |
| Skip | One more skip every run | 3 | 40, 80, 120 |
| Banish | One more banish every run | 2 | 80, 160 |
| Lodestone | Gold flies to the hero at once, foes drop a quarter more | 1 | 100 |
| Aftershock | Every landed dash or leap sends a shockwave of 0.8x attack damage that briefly stuns foes | 1 | 250 |
| Greed | Foes drop 10% more gold | 3 | 120, 240, 360 |
| Growth | Experience +5% | 3 | 120, 240, 360 |
| Curse | Foes +10% HP and damage, +10% gold, +5% experience | 5 | 50, 100, 150, 200, 250 |

The data is `ARMORY_ITEMS` in `src/constants/armory.ts`; tuning for the gear is `src/constants/armoryTuning.ts`.
Every run starts with 2 rerolls, 2 skips and 1 banish before the Armory (`PICK_TOOLS`).
Head Start was removed: with a level 1 to 99 stage it only skipped the first picks.

### Power

Stats are flat and added to the hero's base before the in-run percentages multiply them, so they keep their share all run.
A full Armory gives a hero with 10 attack damage and ability power +30% damage from Honed Edge and Arcana, about +4% more from Precision's +6% crit (crits deal 1.75x), and +30% HP from Vitality.
Curse takes some of that back by design.
All 44 levels cost about 15,100 gold bought cheapest first, about 30 full clears; the pacing simulation buys the last level in run 51, about 13 hours in.

### Curse, Greed and Growth

The run reads one set of rates from the Armory (`runRates()` in `src/store/meta.ts`):

- Gold: `dropCoins` multiplies the drop by Greed's and Curse's shares.
- Experience: `earnXp` multiplies by Growth's and Curse's shares.
- Foes: Curse multiplies HP and damage, through `stageMods` in a stage and `makeEnemy` in wave mode.

In a co-op room the host's Curse applies to everyone, and each player's Greed and Growth to that player.

## Hero unlocks and Hyper stages

Kael and Cerise are free.
The other seven cost 300 (Aldric), 400 (Vesper), 550 (Saya), 750 (Yun), 1,000 (Brynn), 1,350 (Zafir) and 1,800 (Calder), 6,150 gold in all, once each hero's goal is met (`docs/unlocks.md`).
Each price is the hero's `CharacterDef.price`.
A cleared stage's Hyper version is for sale on the stage screen for 150, 300, 450, 600 or 900 gold by tier (`HYPER_PRICE`).

## Every Armory item helps every hero

The Armory is shared by every hero, and no item names a hero or a hero's own move.
The hero screen shows each hero's level 1 stats with what the Armory adds as a lighter part of each bar.

A new hero's kit keeps these promises, so every item works for it on day one:

- Damage comes from `progress.stats.ad` (Honed Edge, Aftershock) and abilities scale with `progress.stats.ap` (Arcana).
  Every blow goes through `dealDamage`, which rolls `progress.stats.crit` (Precision).
- The kit spends MP on the shared ultimate and may spend more of it on its own abilities (Wellspring).
- The kit spends stamina on its defence or travel (Endurance).
- Walking uses `progress.stats.move` through the shared physics (Light Boots).
- Blows on the hero go through `hurtHero`, so Vitality's HP applies.
- The kit calls `travelEnded()` from `src/game/hero/travelEnd.ts` when each of its travel moves ends (Aftershock).
- Gold, experience, foes and the pick tools live in shared code and need nothing from the kit (Lodestone, Greed, Growth, Curse, Reroll, Skip, Banish).

Item ids are saved, so a renamed item keeps its id.

## Saving

Meta progress is saved in local storage under `warpblade-meta-v2` (`src/services/metaStorage.ts`).
The save holds the bank, the Armory levels (`owned`), the gold paid for them (`spentOnOwned`), the items switched off (`switchedOff`), the achievements and tracked stats, the unlock ids found and the recipes.
`parseMeta` in `src/utils/metaSave.ts` keeps only known items within their level limits; a save without `spentOnOwned` gets the price of its levels bought in Armory order.
`src/store/meta.ts` is the one owner of the bank and the Armory, and saves on every change.

A 0.14.2 save under `warpblade-meta-v1` is carried over when no `warpblade-meta-v2` save exists yet (`upgradeLegacyMeta` in `src/utils/legacyMeta.ts`), and the old key is left untouched.
Its coins, achievements, tracked stats, recipes and bought heroes (the old `heroes` field, read as hero unlocks) carry over.
Shop levels of items the Armory still has are kept up to the Armory's level limit, and those items count as unlocked.
Every other level, and every item the Armory no longer has (Head Start, Last Light), comes back as the coins it cost in 0.14.2 (`LEGACY_SHOP_PRICES` in `src/constants/legacyShop.ts`).
The kept levels' `spentOnOwned` is what they cost in 0.14.2, so Refund All gives back what the player paid.
A hero bought before 0.11.0 that left the roster also comes back as its price.
