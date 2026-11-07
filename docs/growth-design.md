# Growth design

The in-run growth rework agreed on 7 November 2026 after the growth review (`docs/growth-review/`).
Goal: a run where the right set of items, and some luck, compounds into hundreds of times the starting damage, where each pick can change the result, and where the end of run screen shows which source did the damage.
Skill stays about half of a win: the hero's own blows, dodges and the Flow multiplier.

This file is the contract between the parts of the build.
Numbers here are starting values; balance changes them in the constants files, not here, and updates this file when the shape changes.

## Words

- **Relic**: a damage source the hero carries that acts on its own (an orbiting shard, a familiar, a bell). Levels 1 to 8, then evolves.
- **Charm**: a passive that multiplies a stat for every source at once (Might, Haste). Levels 1 to 5 (Multitude 1 to 2).
- **Skill**: a node of the hero's own skill tree, as today.
- **Card**: one choice in a pick. A card offers a new relic, a relic's next level, a new charm, a charm's next level, or a skill.
- **Build**: the relics, charms and evolutions a hero holds in a run. It lives in `progress.build` and resets with the run.
- **Chest**: dropped by elites, mini bosses and the wave 20 boss. Opening it raises owned relics and charms, or evolves a relic.
- **Flow**: a multiplier on all damage that the hero's own hits build and getting hurt breaks.
- **Source**: what dealt a hit, for the end of run screen: `attacks`, `abilities`, `ultimate` or a relic id.

## Slots

- 5 relic slots and 5 charm slots (`RELIC_SLOTS`, `CHARM_SLOTS` in `src/constants/growth.ts`).
- A new relic or charm is only offered while a slot is free. Skills have no slots.

## Relics

Each relic's level table is data in `src/constants/relics/<id>.ts`.
Damage numbers are absolute (they do not scale with the hero's attack damage); Kael's level 1 sustained damage is about 23 per second, so a level 1 relic does about a quarter to a third of that on one foe and more on a crowd.
Level 8 is about 6 to 10 times level 1 on one foe; the evolution about doubles to triples level 8 and adds a new behaviour.
Every relic reads the shared multipliers from the build stats (`buildStats`): `might` (all damage, applied centrally in `dealDamage`), `haste` (cooldowns), `amount`, `area`, `duration`, `speed`.

| Id | Relic | What it does | Evolves with | Evolution |
| --- | --- | --- | --- | --- |
| `shards` | Orbit Shards | Crystal shards circle the hero for a while, then rest. | Persistence | Shard Halo: never rests, more shards. |
| `wisp` | Seeker Wisp | A small familiar by the hero's shoulder fires homing bolts at the nearest foe. | Haste | Wisp Choir: three wisps, far faster. |
| `daggers` | Warp Daggers | Daggers fly straight ahead in the facing direction. | Multitude | Dagger Storm: fires ahead and behind, very fast. |
| `storm` | Storm Rod | Lightning strikes random foes on screen. | Fortune | Thunder Crown: each strike arcs to two more foes. |
| `aura` | Ember Aura | A ring of embers burns foes close to the hero. | Vigor | Sun Heart: larger and hotter, and kills heal the hero. |
| `bell` | Frost Bell | A cold ring rings out from the hero, hurting and chilling foes. | Reach | Glacier Toll: rings twice and freezes. |
| `echo` | Echo Blade | Every few of the hero's own hits sends a crescent forward. | Might | Phantom Arc: crescents both ways, more often, coming back. |
| `thorns` | Thorn Trail | Moving leaves thorns on the floor that hurt foes standing in them. | Swiftness | Bramble Wake: thorns follow the hero and grow while moving. |

Echo Blade is the relic that ties damage to skill: it counts the hero's own landed hits.
Thorn Trail rewards movement.

A relic is code in `src/game/relics/<id>.ts` implementing `RelicBehavior` (`src/types/build.ts`): `update(memory, level, evolved, dt)`, and optional `draw` and `drawBack`.
`updateRelics(dt)` runs each owned relic for each hero; `drawRelicsBack()` and `drawRelics()` are called from `renderScene` behind and in front of the hero.
Runtime memory per relic per hero lives in `progress.build.memory[id]`, so co-op seats keep their own.
Hits go through `dealDamage(e, base, { source: id, ... })`.
Relic hits are not melee (guards do not stop them) and do not build Flow.

## Charms

`src/constants/charms.ts`.

| Id | Charm | Per level | Max level |
| --- | --- | --- | --- |
| `might` | Might | +10% damage, every source | 5 |
| `haste` | Haste | -8% relic cooldowns, also spell, rite, ultimate and warp recharge | 5 |
| `multitude` | Multitude | +1 amount for relics that fire several | 2 |
| `reach` | Reach | +10% relic area | 5 |
| `persistence` | Persistence | +10% relic duration | 5 |
| `swiftness` | Swiftness | +10% relic projectile speed, +4% move speed | 5 |
| `fortune` | Fortune | +10% luck: a 4th card at `1 - 1/luck`, better chests, +2% crit | 5 |
| `vigor` | Vigor | Max HP x1.15, +0.2 HP per second | 5 |
| `insight` | Insight | +8% experience | 5 |
| `resonance` | Resonance | Flow holds 20% more stacks | 5 |

## Hero growth

- Attack damage and ability power grow by `HERO_LEVEL_POWER` (x1.025) per level, compounding, instead of a flat amount. The heroes' `growth.ad` and `growth.ap` are 0; HP, MP keep their flat growth.
- HP and MP growth per level are about a fifth of what they were, so about 84 levels end near the old totals of 19 levels.
- A level up restores 5% of HP and MP (`LEVEL_UP_RESTORE`), so a level heals a little.
- Level gates (skill node levels, combo lengths, the skill evolutions' level) moved so each arrives at about the same wave as before.
- Skill nodes that added flat attack damage or ability power add a percentage instead (Keen Edge: +10% attack damage per rank).
- Shop stats stay flat.

## Flow

`FLOW` in `src/constants/growth.ts`.

- Every hit of the hero's own (`attacks`, `abilities`, `ultimate`) that lands on a foe adds 1 stack. A perfect dodge adds 5.
- Up to 25 stacks, +20% per Resonance level. Each stack is +4% damage on every source, relics included, so a full bar doubles damage.
- 2.5 seconds after the last hero hit, stacks drain at 4 per second. Getting hurt halves them.
- The HUD shows the bar and the multiplier.

## Experience and picks

- Experience for the next level: `15 + 10 x (level - 1)`, no level cap below 99. A full run reaches about level 80.
- Picks still wait for the end of the wave (owner rule, 3 November 2026): each level banks a point, the cards open when the wave's last foe falls.
- A pick deals 3 cards, 4 with luck. Cards are drawn without repeats by weight: a relic 100, a charm 90 (Multitude and Haste 50), and all available skills share 300 between them. Owned relics and charms count three times. A hero skill evolution that is ready still takes the first card.
- Every run starts with 2 rerolls, 2 skips and 1 banish; the shop sells more. Reroll deals new cards without the ones shown. Skip spends the point for nothing. Banish removes one card's relic, charm or skill from the run and deals again.
- When nothing is left to offer, Second Wind fills the cards as today.

## Chests

- Dropped by the elite of a wave, each mini boss and the wave 20 boss. Touching the chest opens it.
- From wave 8, a chest evolves one relic if any is ready (level 8 and its partner charm owned at any level).
- Otherwise it gives 1 upgrade, 3 with chance `0.10 x luck`, 5 with chance `0.03 x luck`: each a random owned relic or charm below its maximum. With nothing to raise it heals fully.
- Opening pauses the game on a chest screen that lists what changed; J or a tap continues.

## Waves

`src/constants/waves.ts` and `src/utils/waves.ts`.

- Still 30 waves in the same five eras with the same foes, mini bosses at 5, 10, 15 and 25 and the Warden at 20 and 30.
- A wave has a quota of foes, `round(4 x 1.1^(wave - 1))` (4 at wave 1, 63 at wave 30), that stream in through rifts. At most `min(3 + ceil(0.6 x wave), 22)` stand at once; a new rift opens 0.35 s after a place frees. The wave ends when the quota is dead.
- Mini boss waves bring the mini boss with a stream of flyers (the quota less one); boss waves bring the Warden with a stream of half the quota.
- Rifts open away from every hero and spread from the foes and rifts already there. Minions standing their ground ease apart so a crowd stays readable.
- Foe HP grows by x1.125 per wave (about x30 at wave 30); mini bosses have x3 and the Warden x6 on top. Experience grows by x1.07 per wave. Damage keeps its slow linear growth.
- From wave 3, waves divisible by 3 that are not boss waves bring one elite halfway through the stream: a normal foe of the era with x5 HP, x3 experience, x2 coins and a gold ring with a glint, which drops a chest.
- Coins per run stay about where they are today (`docs/meta-progress.md`), so drops per foe shrink as foes multiply.
- Experience orbs grow with the wave, so a kill drops as many orbs late as early; with many orbs about, kills drop fewer, and past 60 they join the nearest orb. Kill bursts of light and particles shrink when many foes fall at once.

## End of run screen

- Every hit is recorded by source (`src/game/damageLedger.ts`): total damage, the time the source was first held.
- The result screen lists each source with its level (or Evolved), a bar, total damage and damage per second over the time held, plus time, level reached and foes defeated.
- Sources are named after the hero: "Kael's attacks", "Kael's abilities", "Ultimate", and the relic names.

## Ownership while building

- Core (build state, cards and pick screen, charms, hero growth, Flow, chests, shop): `src/game/build/`, `src/utils/build.ts`, `src/ui/skills/`, `src/ui/chest/`, HUD.
- Relics: `src/game/relics/<id>.ts`, `src/constants/relics/<id>.ts`, relic icons.
- Waves: `src/utils/waves.ts`, `src/game/waves.ts`, `src/constants/waves.ts`, enemy spawning, elites, coins.
- Results: `src/game/damageLedger.ts`, the `source` of every `dealDamage` call, damage numbers, the result screen.
