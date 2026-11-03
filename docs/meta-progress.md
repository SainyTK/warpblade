# Meta progress: coins and the shop

A run is still a roguelite run: level, picks and learned skills start over each time.
Coins are the one thing a run leaves behind.
They are banked when the run ends, cleared, lost, restarted or quit, and spent in the Shop on the start menu.
Bought upgrades apply at the start of every run, on top of the level-up picks.

## Coins

Every slain foe drops coins: a wisp 1, a husk 2, a Rift Brute 8 and the Rift Warden 25 (`COIN_DROP` in `src/constants/coins.ts`).
Coins pop out of the foe, fall and bounce on the floor or a ledge, and Kael picks them up by touch.
After 1.6 seconds any coin still lying around flies to him, so none is lost to a far corner.
When a run ends, coins still in flight are banked too.

## Run end

When Kael falls or the stage is cleared, the run's coins are banked and the start menu opens on a result screen with the wave reached, the coins earned and the bank.
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

Skills are bought once and none of them is offered on level up:

- Lodestone (60): coins fly to Kael after 0.3 seconds, and foes drop a quarter more (a fraction left over is a chance at one more coin).
- Warp Shock (150): every warp strike, including Blink Combo's, sends a ring out from Kael that hits each foe within 40 art pixels for 0.8 times attack damage and stuns it briefly.
- Head Start (200): runs start at level 3, and the two level-up picks open at once.
- Last Light (300): the first fatal blow of a run leaves Kael standing with half his HP.

## Pricing basis

The numbers come from the wave plan in `src/utils/waves.ts` and the drops above.
Clearing waves 1 to N earns this many coins in total:

| Waves cleared | 4 | 5 | 7 | 8 | 10 | 15 | 19 | 20 | 30 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Coins | 18 | 28 | 44 | 52 | 72 | 126 | 178 | 203 | 354 |

A mash-only bot dies at wave 5 and a scripted bot run in testing died in wave 8 with 20 coins, since it misses some kills.
A typical early run that reaches wave 7 to 10 earns about 40 to 70 coins, enough for one or two of the 20 to 30 coin first levels.
That matches the target of one or two cheap upgrades per run.
The first skill, Lodestone, takes about one good run, and Last Light about a run that reaches wave 20.
Every stat at its top level costs 2585 coins and the four skills 710, about 3300 in all, roughly nine full clears or a few dozen ordinary runs.

## Saving

Meta progress is saved in local storage under `warpblade-meta-v1` (`src/services/metaStorage.ts`).
The version is part of the key, so a future change of shape starts from a fresh save.
`parseMeta` in `src/utils/metaSave.ts` keeps only known items within their level limits and a whole, positive coin count; anything missing, corrupt or not JSON starts fresh.
`src/store/meta.ts` is the one owner of the bank and the bought levels, and saves on every change.
