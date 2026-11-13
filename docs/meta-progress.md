# Meta progress: coins and the shop

A run is still a roguelite run: level, picks and learned skills start over each time.
Coins are the one thing a run leaves behind.
They are banked when the run ends, cleared, lost, restarted or quit, and spent in the Shop on the start menu.
Bought upgrades apply at the start of every run, on top of the level-up picks.

## Coins

Every slain foe drops coins: a wisp 1, a husk 2, a Rift Brute 8 and the Rift Warden 25 (`COIN_DROP` in `src/constants/coins.ts`).
Since waves stream a growing quota of foes, a minion drops only its share: a normal wave pays the coins of as many minions as a wave brought before (3, one more every third wave, 9 at most, `COIN_PAID_FOES`), spread over its whole quota (`coinShare` in `src/utils/coins.ts`).
Mini bosses and the Warden drop their full count, and an elite drops twice its base (`ELITE.coins`).
Since 0.2.0 every foe drops a quarter more on top of that (`COIN_BONUS`), and a fraction left over is a chance at one more coin.
Lodestone's quarter adds to it, so an owner of Lodestone gets half again the base drop.
Coins pop out of the foe, fall and bounce on the floor or a ledge, and the hero picks them up by touch.
After 1.6 seconds any coin still lying around flies to the hero, so none is lost to a far corner.
When a run ends, coins still in flight are banked too.

## Run end

When the hero falls or the stage is cleared, the run's coins are banked and the start menu opens on a result screen with the wave reached, the coins earned and the bank.
Continue goes to the start menu, Shop goes straight to the shop.
Start always begins a fresh run with everything bought so far.
Restart run from the pause menu still starts over at once, and it banks the coins of the run it ends.

## What the shop sells

Stats are bought in levels, each level adding the same flat amount, before the in-run percentage skills multiply the total:

| Item | Per level | Levels | First price |
| --- | --- | --- | --- |
| Vitality | Max HP +10 | 5 | 20 |
| Honed Edge | Attack damage +1 | 5 | 30 |
| Arcana | Ability power +1 | 5 | 30 |
| Wellspring | Max MP +10 | 5 | 20 |
| Precision | Crit chance +2% | 5 | 30 |
| Light Boots | Move speed +3% | 4 | 25 |
| Endurance | Max stamina +10 | 5 | 20 |

Each level costs 1.6 times the one before, rounded to 5 (`nextPrice` in `src/utils/shop.ts`), so a 20-coin stat goes 20, 30, 50, 80, 130.

Pick tools are bought in levels too, three each, priced the same way: each level adds one to what every run starts with (2 rerolls, 2 skips and 1 banish before the shop, `PICK_TOOLS` in `src/constants/growth.ts`).

| Item | Per level | Levels | First price |
| --- | --- | --- | --- |
| Reroll | One more reroll | 3 | 30 |
| Skip | One more skip | 3 | 25 |
| Banish | One more banish | 3 | 35 |

Skills are bought once, except Last Light with its three levels, and none of them is offered on level up:

- Lodestone (60): coins fly to the hero after 0.3 seconds, and foes drop another quarter of their base (a fraction left over is a chance at one more coin).
- Aftershock (150, saved under the id `warpShock`): every travel move the hero ends sends a ring out from the hero that hits each foe within 40 art pixels for 0.8 times attack damage and stuns it briefly.
  For Kael that is every dash and every warp, Blink Combo's included; for Ysra every vault, dive and backstep; for Sable every hop and slide; for Hulda every Bull Rush and every Skyfall Grab landing; for Orrin every release of a swing, every landing out of a fling, every zip, every ledge pull and every Backline; for Mirel the end of every Rewind and every landing out of a hover; for Wenna every Swap arrival; for Tallis every rise out of his shadow pool; for Jory the end of every Beat Step; for Brannoc every Hunt and Headlong landing.
- Head Start (200): runs start at level 3 with two skill points, spent when wave 1 is cleared.
  A full run reaches about level 84, so level 3 is what wave 1 alone gives; the two picks are the whole head start.
- Last Light (300, then 480 and 770): a fatal blow leaves the hero standing with half their HP, once per run for each of its three levels (`LAST_LIGHT_LEVELS`).

## Every shop item helps every hero

The shop is shared by every hero.
One bank and one set of bought levels serve whichever hero starts the run, and no item names a hero or a hero's own move.
The hero screen shows each hero's level 1 stats with what the shop adds as a lighter part of each bar.

A new hero's kit keeps these promises, so every item works for it on day one:

- Damage comes from `progress.stats.ad` (Honed Edge, Aftershock) and abilities scale with `progress.stats.ap` (Arcana).
  Every blow goes through `dealDamage`, which rolls `progress.stats.crit` (Precision).
- The kit spends MP on the shared ultimate and may spend more of it on its own abilities (Wellspring).
  A hero with a resource of its own, such as Ysra's Heat, still charges the ultimate from MP.
- The kit spends stamina on its defence or travel, such as a dash, a block or a backstep (Endurance).
- Walking uses `progress.stats.move` through the shared physics; a move the kit drives itself scales with it where it makes sense (Light Boots).
- Blows on the hero go through `hurtHero`, so Vitality's HP and Last Light apply.
- The kit calls `travelEnded()` from `src/game/hero/travelEnd.ts` when each of its travel moves ends: a dash, a warp, a leap, a landing out of the air (Aftershock).
  Shop skills that answer a hero's movement hook in there, never into one kit's code.
- Coins, levels, Head Start and the pick tools live in shared code and need nothing from the kit.

For Tallis, the eighth hero: Vitality raises an HP bar well below the front-line heroes'; Honed Edge every knife blow, Rising Cut, Drop Stab and Gloaming; Arcana Hamstring, his spells, the ability power dots and Gloaming; Wellspring the MP his abilities and the ultimate spend; Precision every hit, on the highest base crit in the roster; Light Boots his walk, run, veiled walk and the pool's glide; Endurance the stamina his Sink spends; Aftershock rings out at every rise from the pool.

For Jory, the ninth hero: Vitality raises his HP; Honed Edge every mallet blow, the Crash wave, Downstroke and Step Touch; Arcana Boom, Thunder Skin, his spells, the ability power dots and Drumroll; Wellspring the MP his abilities and the special spend; Precision every hit; Light Boots his walk, run and the length of Beat Step; Endurance the stamina Boom and Beat Step spend; Aftershock rings out at the end of every Beat Step.

For Brannoc, the tenth hero: Vitality raises his HP, which is also what he spends on Frenzy and his abilities, so it buys him both life and power; Honed Edge every axe blow, the Hunt Chop, Hatchet Drop, Red Crescent and Last Cleave; Arcana War Cry, Red Crescent, his spells, the ability power dots and Last Cleave; Wellspring the MP Berserk spends; Precision every hit, and his crits win back twice the debt; Light Boots his walk, run and the speed of Hunt; Endurance the stamina Hunt spends; Aftershock rings out at every Hunt and Headlong landing; Lodestone, Head Start and Last Light work as for every hero, and Berserk's Deathless leaves Last Light unspent.

A new item follows the same rule: it changes a shared stat or hooks into a shared event, and its text says what it does without naming a hero.
Item ids are saved, so a renamed item keeps its id.

## Pricing basis

The numbers come from the wave plan in `src/utils/waves.ts` and the drops above.
Clearing waves 1 to N earns this many coins in total, before the 0.2.0 bonus and with it (the base times 1.25, which is what the bonus gives on average):

| Waves cleared | 4 | 5 | 7 | 8 | 10 | 15 | 19 | 20 | 30 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Base coins | 18 | 28 | 44 | 52 | 72 | 126 | 178 | 203 | 354 |
| With the bonus | 22 | 35 | 55 | 65 | 90 | 158 | 222 | 254 | 442 |
| Streamed waves, base | 19 | 30 | 47 | 55 | 78 | 136 | 189 | 220 | 385 |
| Streamed waves, with the bonus | 24 | 38 | 59 | 69 | 98 | 170 | 236 | 276 | 481 |

The streamed rows count the Warden's base drop but not the flyers it calls.
They run about 5 to 9% above the old ones, from the elites' doubled drop and the mini boss waves' longer flyer streams, so the prices below still hold.

Before 0.2.0 the playtest bots banked 12 to 20 coins on runs that fell at waves 4 and 5, since they miss some kills.
Such a run bought one first level at most, which was too slow.
With the bonus, a run that reaches wave 8 to 10 earns about 60 to 80 coins, enough for two first levels or a first and a second level.
The first skill, Lodestone, takes about one good run, and Last Light about a run that reaches wave 20.
Every stat at its top level costs 2585 coins and the four skills with all three levels of Last Light 1960, about 4550 in all, roughly twelve full clears or a few dozen ordinary runs.

## Saving

Meta progress is saved in local storage under `warpblade-meta-v1` (`src/services/metaStorage.ts`).
The version is part of the key, so a future change of shape starts from a fresh save.
`parseMeta` in `src/utils/metaSave.ts` keeps only known items within their level limits and a whole, positive coin count; anything missing, corrupt or not JSON starts fresh.
`src/store/meta.ts` is the one owner of the bank and the bought levels, and saves on every change.
The same save holds the heroes unlocked with coins, the achievements earned and the stats they track (see `docs/achievements.md`); a save from before those fields loads with none of them.
