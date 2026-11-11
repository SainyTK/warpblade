# Growth design

The in-run growth rework agreed on 7 November 2026 after the growth review (`docs/growth-review/`).
Goal: a run where the right set of skills and charms, and some luck, compounds into hundreds of times the starting damage, where each pick can change the result, and where the end of run screen shows which source did the damage.
Skill stays about half of a win: the hero's own blows, dodges and the Flow multiplier.

This file is the contract between the parts of the build.
Numbers here are starting values; balance changes them in the constants files, not here, and updates this file when the shape changes.

## Words

- **Skill**: one of a hero's 20 skills, levels 1 to 8, then one evolution with a partner skill. The contract is `docs/skill-design.md`.
- **Charm**: a passive that multiplies a stat for every source at once (Might, Haste). Levels 1 to 5 (Multitude 1 to 2).
- **Card**: one choice in a pick. A card offers a new skill, a held skill's next level, a new charm or a charm's next level.
- **Build**: the skills, charms and evolutions a hero holds in a run. It lives in `progress.build` and resets with the run.
- **Chest**: dropped by elites, mini bosses and the wave 20 boss. Opening it raises held skills and charms, or evolves a skill.
- **Flow**: a multiplier on all damage that the hero's own hits build and getting hurt breaks.
- **Source**: what dealt a hit, for the end of run screen: `attacks`, `abilities`, `ultimate`, or the id of a skill that dealt the hit on its own.

## Slots

- 8 skill slots from the first run (`SKILL_SLOTS`) and 5 charm slots at most (`CHARM_SLOTS`), 3 of them open at the start (`docs/unlocks.md`).
- A new skill or charm is only offered while a slot is free.

## Skills

Relics were removed on 7 November 2026 (`docs/skill-design.md`); their growth idea moved to each hero's own skills.
A skill's own hits (a summon, a projectile it launches on its own, damage over time) read the shared multipliers through `withCharms` (`src/game/skills/query.ts`): Multitude adds to amounts; Reach, Persistence, Swiftness and Haste multiply area, duration, speed and cooldowns.
Might applies to every hit centrally in `dealDamage`.

## Charms

`src/constants/charms.ts`.

| Id | Charm | Per level | Max level |
| --- | --- | --- | --- |
| `might` | Might | +10% damage, every source | 5 |
| `haste` | Haste | -8% skill cooldowns, also spell, rite, ultimate and warp recharge | 5 |
| `multitude` | Multitude | +1 amount for skills that fire or summon several | 2 |
| `reach` | Reach | +10% skill area | 5 |
| `persistence` | Persistence | +10% skill duration | 5 |
| `swiftness` | Swiftness | +10% skill projectile speed, +4% move speed | 5 |
| `fortune` | Fortune | +10% luck: a 4th card at `1 - 1/luck`, better chests, +2% crit | 5 |
| `vigor` | Vigor | Max HP x1.15, +0.2 HP per second | 5 |
| `insight` | Insight | +8% experience | 5 |
| `resonance` | Resonance | Flow holds 20% more stacks | 5 |

## Hero growth

- Attack damage and ability power grow by `HERO_LEVEL_POWER` (x1.025) per level, compounding, instead of a flat amount. The heroes' `growth.ad` and `growth.ap` are 0; HP, MP keep their flat growth.
- HP and MP growth per level are about a fifth of what they were, so about 84 levels end near the old totals of 19 levels.
- A level up restores 5% of HP and MP (`LEVEL_UP_RESTORE`), so a level heals a little.
- The ground string's length is fixed per hero (`CharacterDef.comboHits`); it no longer grows with the level.
- Shop stats stay flat.

## Flow

`FLOW` in `src/constants/growth.ts`.

- Every hit of the hero's own (`attacks`, `abilities`, `ultimate`) that lands on a foe adds 1 stack. A perfect dodge adds 5.
- Up to 25 stacks, +20% per Resonance level. Each stack is +4% damage on every source, skill sources included, so a full bar doubles damage.
- 2.5 seconds after the last hero hit, stacks drain at 4 per second. Getting hurt halves them.
- The HUD shows the bar and the multiplier.

## Experience and picks

- Experience for the next level: `15 + 10 x (level - 1)`, no level cap below 99. A full run reaches about level 80.
- Picks still wait for the end of the wave (owner rule, 3 November 2026): each level banks a point, the cards open when the wave's last foe falls.
- A pick deals 3 cards, 4 with luck. Cards are drawn without repeats by weight (`CARD_WEIGHT`): a skill not held yet 100, the next level of a held skill 6, a new charm its own weight (90, Multitude and Haste 50), a held charm's next level the same. Picks have no prerequisites; once the 8 skill slots are full no new skill is dealt, and once an ultimate skill is held no other ultimate skill is.
- Every run starts with 2 rerolls, 2 skips and 1 banish; the shop sells more. Reroll deals new cards without the ones shown. Skip spends the point for nothing. Banish removes one card's skill or charm from the run and deals again.
- When nothing is left to offer, Second Wind fills the cards.

## Skill cards and evolutions

Target (`docs/skill-design.md`): over a full run, a player who takes the best card each time and uses no tools evolves 1 to 2 skills (median); a player who steers with skips, banishes and rerolls evolves 3 (median), and 4 or more in under 10% of runs.

Method: `docs/growth-review/skill-sim.mts` plays 2,000 full 30-wave runs per case with the game's own `dealCards`, `rollChest` and `readyEvolutions`.
Picks come from the experience of every foe of every wave (levels 2, 14, 35 and 76 after waves 1, 10, 20 and 29: 75 picks), chests from each elite, mini boss and the wave 20 Warden at the wave they drop, with no luck and the four starting charms in 3 charm slots.
The hero is synthetic: 20 skills, 2 of them ultimates, with partners either in mutual pairs or a random cycle (the designers choose; both are reported).
The greedy player knows no partners and uses no tools: a new skill while a slot is free, then the highest skill level, then a charm.
The steering player knows every partner: it raises skills whose partner it holds (and partners to level 4), takes new skills that complete a pair, and otherwise rerolls, then banishes a lone new skill, then skips once it holds four skills.

Results with the weights in the game (new skill 100, skill level 9, starting tools 2 rerolls, 2 skips, 1 banish):

| Player | Partners | Median | 4 or more | 0 / 1 / 2 / 3 / 4 / 5 evolutions, of 2,000 |
| --- | --- | --- | --- | --- |
| Greedy | pairs | 2 | 3.4% | 254 / 427 / 868 / 383 / 66 / 2 |
| Greedy | cycle | 2 | 2.0% | 48 / 545 / 906 / 461 / 39 / 1 |
| Steering | pairs | 3 | 12.8% | 6 / 111 / 641 / 987 / 249 / 6 |
| Steering | cycle | 3 | 11.0% | 1 / 74 / 546 / 1160 / 212 / 7 |

The skill level weight was 6 until 11 November 2026, when the owner asked for held skills to come up a little more often so more of them evolve; at 6 the steering player evolved 4 or more in 7.6% to 9.5% of runs.

The first evolution comes at wave 24 (median): most skills reach level 8 late, since the next level of a held skill is a rare card.
The skill level weight is the lever: at 20, steering players evolved 4 or more in 38% of runs; at 8 it was 10%.
Rerolls matter little; knowing partners is what steering buys.
With every pick tool bought in the shop (5, 5, 3) the simulated steering player evolves 2 to 3 (median), 4 or more in 4 to 6%, since its skips spend points; a sharper player would do better.

## Chests

- Dropped by the elite of a wave, each mini boss and the wave 20 boss. Touching the chest opens it.
- From wave 8, a chest evolves one skill if any is ready (level 8 and its partner held at level 4 or more, `EVOLVE_PARTNER_LEVEL`).
- Otherwise it gives 1 upgrade, 3 with chance `0.10 x luck`, 5 with chance `0.03 x luck`: each a random held skill or charm below its maximum. With nothing to raise it heals fully.
- Opening pauses the game on a chest screen that lists what changed; J or a tap continues.

## Waves

`src/constants/waves.ts` and `src/utils/waves.ts`.

- Still 30 waves in the same five eras with the same foes, mini bosses at 5, 10, 15 and 25, the Warden at 20 and the Abyss Sovereign at 30 (`BOSSES` in `src/constants/waves.ts`). After the Sovereign falls The Unblinking comes through (`FINALE`); a hero who falls to it has still cleared the stage.
- A wave has a quota of foes, `round(3 x 1.11^(wave - 1))` (3 at wave 1, 62 at wave 30), that stream in through rifts. At most `min(2 + ceil(0.6 x wave), 22)` stand at once; a new rift opens 0.35 s after a place frees. The wave ends when the quota is dead.
- Mini boss waves bring the mini boss with a stream of flyers (the quota less one); boss waves bring the Warden with a stream of half the quota.
- Rifts open away from every hero and spread from the foes and rifts already there. Minions standing their ground ease apart so a crowd stays readable.
- Foe HP grows by x1.125 per wave (about x30 at wave 30); mini bosses have x3 and bosses x6 on top. Experience grows by x1.07 per wave. Damage keeps its slow linear growth.
- From wave 3, waves divisible by 3 that are not boss waves bring one elite halfway through the stream: a normal foe of the era with x3 HP, x3 experience, x2 coins and a gold ring with a glint, which drops a chest.
- Coins per run stay about where they are today (`docs/meta-progress.md`), so drops per foe shrink as foes multiply.
- Experience orbs grow with the wave, so a kill drops as many orbs late as early; with many orbs about, kills drop fewer, and past 60 they join the nearest orb. Kill bursts of light and particles shrink when many foes fall at once.

## End of run screen

- Every hit is recorded by source (`src/game/damageLedger.ts`): total damage, the time the source was first held.
- The result screen lists each source with its level (or Evolved), a bar, total damage and damage per second over the time held, plus time, level reached and foes defeated.
- Sources are named after the hero: "Kael's attacks", "Kael's abilities", "Ultimate", and the names of skills that dealt hits on their own (their evolution's name once evolved).

## Discovery

Owner request on 7 November 2026: not everything is there on day one, and the game keeps much of it a mystery, like Vampire Survivors.
A new player starts with four charms (Might, Haste, Vigor, Insight) and three charm slots; every skill can be dealt from the first run.
Every other charm and charm slot unlocks when a goal is met; the Codex in the main menu shows locked ones as silhouettes with a short cryptic hint, and a few as "???".
A skill's evolution partner stays hidden ("Evolves with ???") until the player has made that evolution once.
The goals, their exact rules and the pacing are in `docs/unlocks.md`.

## Ownership while building

- Core (build state, cards and pick screen, charms, hero growth, Flow, chests, shop, the skill framework): `src/game/build/`, `src/game/skills/`, `src/utils/build.ts`, `src/utils/cards.ts`, `src/ui/skills/`, `src/ui/chest/`, HUD.
- Each hero's skills: `src/constants/characters/<hero>/skills/`, `src/game/skills/<hero>/`, `src/ui/skills/icons/<hero>/` (`docs/skill-design.md`).
- Waves: `src/utils/waves.ts`, `src/game/waves.ts`, `src/constants/waves.ts`, enemy spawning, elites, coins.
- Results: `src/game/damageLedger.ts`, the `source` of every `dealDamage` call, damage numbers, the result screen.
