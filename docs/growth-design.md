# Growth design

The in-run growth rework agreed on 7 November 2026 after the growth review (`docs/growth-review/`).
Goal: a run where the right set of skills and charms, and some luck, compounds into hundreds of times the starting damage, where each pick can change the result, and where the end of run screen shows which source did the damage.
Skill stays about half of a win: the hero's own blows, dodges and the Flow multiplier.

This file is the contract between the parts of the build.
Numbers here are starting values; balance changes them in the constants files, not here, and updates this file when the shape changes.

## Words

- **Skill**: one of a hero's 20 skills, levels 1 to 8, then one evolution with a partner skill. The contract is `docs/skill-design.md`.
- **Resonance**: an element's rank, from the skills and Arts held in it.
- **Rift Art**: the spell a Rift stage's boss leaves; levels 1 to 5.
- **Card**: one choice in a pick. A card offers a new skill, a held skill's next level, a new charm or a charm's next level.
- **Build**: the skills, charms and evolutions a hero holds in a run. It lives in `progress.build` and resets with the run.
- **Chest**: dropped by elites, mini bosses and the wave 20 boss. Opening it raises held skills and charms, or evolves a skill.
- **Flow**: a multiplier on all damage that the hero's own hits build and getting hurt breaks.
- **Source**: what dealt a hit, for the end of run screen: `attacks`, `abilities`, `ultimate`, or the id of a skill that dealt the hit on its own.

## Slots

- Skill slots open with the hero level (`SKILL_SLOT_LEVELS`): 4 at the start, the 5th at level 15, the 6th at 30, the 7th at 45 and the 8th at 60.
- A new skill is only offered while an open slot is free.

## Skills

Relics were removed on 7 November 2026 (`docs/skill-design.md`); their growth idea moved to each hero's own skills.
A skill's own hits (a summon, a projectile it launches on its own, damage over time) read the shared multipliers through `withCharms` (`src/game/skills/query.ts`): Multitude adds to amounts; Reach, Persistence, Swiftness and Haste multiply area, duration, speed and cooldowns.
Might applies to every hit centrally in `dealDamage`.

## Resonance and Fusions

Charms were removed on 25 November 2026: growth comes only from skills and Rift Arts.
Every skill and every Art has one of five elements (`SkillDef.element`, `ArtDef.element`).
An element's rank is the sum of held skill levels in it, plus 3 for an evolved skill, plus 2 per Art level (`RESONANCE_WEIGHT` in `src/constants/resonance.ts`).
Ranks are worked out in `refreshProgress` into `progress.resonance`, and the active Fusions into `progress.fusions`.

Every hit that is not damage over time resonates (`src/game/resonance/`):

- Blaze lays burn stacks worth a share of the hit; at rank 20 burning foes explode when they fall.
- Frost chills, then freezes a minion after a number of hits that falls with rank; frozen foes take more; at rank 20 chilled foes shatter when they fall.
- Storm may arc to nearby foes for a share of the hit, to one more foe every 8 ranks, with sure crits from rank 20.
- Venom lays poison stacks; each makes the foe take 1.5% more from every source; at rank 20 poison spreads on death.
- Void may echo the hit a moment later; from rank 24 it echoes twice.

Arcs and echoes are hits that resonate again, up to `PROC_DEPTH`, which is where the multiplying growth comes from.
Each element also bends one build stat the skills read through `withBuild`: Blaze area, Frost duration, Storm cooldowns and projectile speed, Void amounts, Venom crit.
Two elements at rank 12 (`FUSION_RANK`) make one of ten Fusions (`FUSIONS`), each a rule that links the two procs.
A Fusion's name stays ??? on cards and in the Codex until the player has made it once.

## Hero growth

- Attack damage and ability power grow by `HERO_LEVEL_POWER` (x1.025) per level, compounding.
- Levels no longer raise max HP or MP (owner rule, 26 November 2026). Max HP and MP grow only from shards, below.
- A level up restores 8% of max HP and MP (`LEVEL_UP_RESTORE`), so a level heals a little.
- The ground string's length is fixed per hero (`CharacterDef.comboHits`); it no longer grows with the level.
- Shop stats stay flat and are the base the shards add to.

## Heart Shards and Mana Shards

`SHARD_GAIN`, `SHARD_DROP` and `SHARD_MOTION` in `src/constants/vitals.ts`, the drops in `src/game/shards.ts`.

- A Heart Shard adds 3 max HP for the run; a Mana Shard adds 2 max MP. The new room fills at once.
- Every boss and mini boss drops one of each. The last foe of a Rift Surge, or of a wave in wave mode, drops a Heart Shard.
- An elite drops each kind with a 10% chance; any other foe with a 0.15% chance. Training drops none.
- Shards pop out, fall and bounce, and are picked up by touch. Any left lying fly to the nearest standing hero after 7 seconds, so none is lost.
- Picking one up shows a banner ("Heart Shard +3 max HP", with the player's tag in a room), a ring and a burst in the shard's colour, and the bar flashes.
- The HP and MP bars start at 60% of their width and grow to full as shards come in: full at 36 Heart Shards and 21 Mana Shards (`VITAL_BAR`).
- The shard counts live in `progress`, so each player in a room keeps their own.

Tuning: a full campaign (Prologue, 8 Rift stages, the Citadel) has 12 boss rooms, 18 Surges, about 75 elites and 1,165 other foes.
That comes to about 39 Heart Shards (+117 HP) and 21 Mana Shards (+42 MP) on average.
The old per level growth (1 to 1.3 HP and 0.4 to 0.45 MP a level) gave about +110 HP and +41 MP by the campaign's end, where the experience reaches about level 99.
A player who collects most shards ends near those totals.

## Pacts: drain and regeneration

A skill may carry a pact (`SkillDef.pact`): HP a second, MP a second and a share of attack and ability power, each per skill level, so level 8 (or the evolution) carries 8 times the level 1 amount.
The three pacts are `PACT` in `src/constants/vitals.ts`:

| Pact | Per level | At level 8 |
| --- | --- | --- |
| Blood | -0.4 HP/s, +6% power | -3.2 HP/s, +48% power |
| Mending | +0.3 HP/s, -0.25 MP/s | +2.4 HP/s, -2 MP/s |
| Focus | +0.35 MP/s, -3% power | +2.8 MP/s, -24% power |

Each hero has one Blood skill and one Mending or Focus skill:

| Hero | Blood | Mending or Focus |
| --- | --- | --- |
| Aldric | Penance | Resolve (Mending) |
| Brynn | Bloodletter | Iron Skin (Mending) |
| Calder | Point Blank | Speed Loader (Focus) |
| Cerise | Thorn Wounds | Poise (Mending) |
| Kael | Rift Wound | Spellwarp (Focus) |
| Saya | Weeping Cut | Still Water (Focus) |
| Vesper | Falling Night | Wanderer's Grace (Mending) |
| Yun | Thousand Cuts | Harmony (Mending) |
| Zafir | Opened Veins | Hot Gale (Focus) |

Rules:

- Pacts add up across held skills into `progress.hpPerSecond` and `progress.mpPerSecond` and a power share on attack damage and ability power (`refreshProgress`).
- Drain never kills: HP drain stops at 1 HP (`DRAIN_FLOOR`). A hero at 1 HP still falls to the next blow. MP drain stops at 0.
- Regeneration stops at max. The rates run only while the hero stands and the game plays.
- A card shows the pact at the level it reaches: power in gold, a drain in red ("Drains 1.2 to 1.6 HP/s"), a regeneration in green ("Regains 0.7 to 1 MP/s").
- The HUD shows the net HP a second after the HP bar when it is not zero, red for a drain and green for regeneration.
- Resonance does not touch pacts.

## Flow

`FLOW` in `src/constants/growth.ts`.

- Every hit of the hero's own (`attacks`, `abilities`, `ultimate`) that lands on a foe adds 1 stack. A perfect dodge adds 5.
- Up to 25 stacks, +20% per Resonance level. Each stack is +4% damage on every source, skill sources included, so a full bar doubles damage.
- 2.5 seconds after the last hero hit, stacks drain at 4 per second. Getting hurt halves them.
- The HUD shows the bar and the multiplier.

## Experience and picks

- Picks still wait for the end of the wave in co-op; in solo they bank and are spent with a mentor or on the map.
- A pick deals 3 cards, 4 with luck, drawn without repeats by weight (`CARD_WEIGHT`).
- Picks have no prerequisites; once an ultimate skill is held no other ultimate skill is dealt.
- Every run starts with 2 rerolls, 2 skips and 1 banish. Reroll deals new cards without the ones shown. Skip spends the point for nothing. Banish removes one card from the run and deals again.
- When nothing is left to offer, Second Wind fills the cards.

## Pick budget

One stage runs from level 1 to 99 (`docs/pick-pacing.md`).
A level up gives a pick every level up to 30, then every second level, plus a milestone pick at 50, 75 and 99 (`PICK_SCHEDULE`, `picksAtLevel` in `src/utils/cardSupply.ts`).

| Levels | Picks | Open slots | What the cards offer |
| --- | --- | --- | --- |
| 2 to 15 | 14 | 4, 5th at 15 | new skills, then their levels |
| 16 to 30 | 15 | 5, 6th at 30 | a new skill per slot, levels, first masteries |
| 31 to 50 | 11 | 6, 7th at 45 | levels, masteries, charge ranks |
| 51 to 79 | 15 | 7, 8th at 60 | levels, masteries |
| 80 to 99 | 11 | 8 | masteries, charge ranks, attunements |
| Total | 66 | | |

Card kinds and their supply:

| Card | Weight | Levels | When it is dealt |
| --- | --- | --- | --- |
| New skill | 100 | 1 | an open slot is free and the skill is available |
| Skill level | 14 | 2 to 8 | the skill is held below level 8 |
| Mastery | 10 | 4 per skill | the skill is at level 8, evolved or not; each level adds +5% attack and ability power and +2 Resonance in its element |
| Deeper Charge | 10 | 6 | solo play; each rank makes the charged skill (held J) deal +15% and charge 6% faster |
| Attunement | 8 | 3 per element | the hero ranks in that element; each level adds +3 Resonance |
| Rift Art level | 45 | 2 to 5 | an Art is held |
| Honing | 2 | no top | always: Whetstone (+4% attack), Focus (+4% ability power), Keen Eye (+1.5% crit) |

Supply at level 99: 8 skills give 64 levels and 32 masteries, plus 6 charge ranks and up to 15 attunements, about 115 cards for 66 picks.
With only 5 skills open (a new player), 40 levels, 20 masteries, 6 charge ranks and the attunements still cover the 66 picks; Honing never runs out, so Second Wind only fills a fourth card.
Rift Arts are not counted, since they no longer carry between stages.
A chest can also raise a mastery level.

The skill pool takes an availability filter: `CardView.isAvailable(skillId)` in `src/utils/cards.ts`, all skills when not given, so meta unlocks can lock skills without touching the deal.

Checked with `docs/growth-review/skill-sim.mts`: 500 stages per hero, a greedy player, chests at levels 15, 45, 70, 85 and 99.
Load it through the dev server (`await import("/docs/growth-review/skill-sim.mts")` in the browser console) and read `PICK_BUDGET`.
Every hero, with all 20 skills or the first 5 only, gets 66 picks and never lands on Second Wind or Honing for want of cards.
With 20 skills the last 20 levels still offer skill levels and masteries; with 5 skills they offer masteries, charge ranks and attunements.

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
- Each hero's skills: `src/heroes/<id>/constants/skills/`, `src/heroes/<id>/game/skills/`, `src/heroes/<id>/ui/icons/` (`docs/skill-design.md`, `docs/hero-module.md`).
- Waves: `src/utils/waves.ts`, `src/game/waves.ts`, `src/constants/waves.ts`, enemy spawning, elites, coins.
- Results: `src/game/damageLedger.ts`, the `source` of every `dealDamage` call, damage numbers, the result screen.
