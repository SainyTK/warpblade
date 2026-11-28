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
- Armory stats stay flat and are the base the shards add to.

## Heart Shards and Mana Shards

`SHARD_GAIN`, `SHARD_DROP` and `SHARD_MOTION` in `src/constants/vitals.ts`, the drops in `src/game/shards.ts`.

- A Heart Shard adds 3 max HP for the run; a Mana Shard adds 2 max MP. The new room fills at once.
- Every boss and mini boss drops one of each. The last foe of a Rift Surge, or of a wave in wave mode, drops a Heart Shard.
- An elite drops each kind with a 10% chance; any other foe with a 0.15% chance. Training drops none.
- Shards pop out, fall and bounce, and are picked up by touch. Any left lying fly to the nearest standing hero after 7 seconds, so none is lost.
- Picking one up shows a banner ("Heart Shard +3 max HP", with the player's tag in a room), a ring and a burst in the shard's colour, and the bar flashes.
- The HP and MP bars start at 60% of their width and grow to full as shards come in: full at 36 Heart Shards and 21 Mana Shards (`VITAL_BAR`).
- The shard counts live in `progress`, so each player in a room keeps their own.

Tuning: a Rift Stage has 9 Rift Surges, an elite at the end of the opening, a mini boss, a boss and about 45 surge elites.
That comes to about 14 Heart Shards (+42 HP) and 7 Mana Shards (+14 MP) on average by level 99.

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

## Stage arc: crystal defense, level 1 to 99 in 10 minutes

Owner decision of 28 November 2026: a stage is a defense of the Warp crystal at its center for 10 minutes (`DEFENSE_SECONDS`), replacing the road of areas, packs, rooms and Rift Surges.
The level, skill points, skills and run stats reset when a stage starts.
The data is `src/constants/defense.ts`; the pure clock maths is `src/utils/defenseClock.ts`; the run is `src/game/adventure/`.

### Field and crystal

The field is the stage's first area (`StageDef.areas[0]`): its length is the field's width (1280 to 1870 px) and its ledges stay, apart from those near the crystal or the two edges (`FIELD`).
Walls, spikes, gates, the exit and the mentor are gone.
The crystal stands at the center with 1200 HP, plus 15% per stage tier above the first (`CRYSTAL`).
The run is lost when it shatters and cleared when the clock reaches 0 with it standing.

Every foe goes for the crystal unless a standing hero is within its hunt range (70 px for minions, 150 for mini bosses, 200 for bosses, `HERO_HUNT_RANGE`).
A foe that goes for the crystal runs its own behaviour with the hero's position swapped for the crystal's (`actOnFoe` in `crystal.ts`), so every foe kind besieges it without its own code.
Its blows land on the crystal at 35% of their damage to a hero, at most once a second per foe, and every besieging foe within 60 px chips 1.5 HP a second times its damage multiplier, so ranged foes count too.

### The clock

The clock drives the level band, the spawn rate and the sides:

| Seconds | Level band | Foes a second | Most foes alive | Pack size |
| --- | --- | --- | --- | --- |
| 0 | 1 | 0.55 | 12 | 2 |
| 90 | 15 | 0.75 to 0.3 | 14 | 2.5 |
| 270 | 44 | 0.42 | 18 | 3.2 |
| 480 | 80 | 0.55 | 22 | 4.1 |
| 600 | 99 | 0.7 | 26 | 5 |

Values between the anchors are linear.
The rate drops at 90 s because step-2 foes take 20 hits.

Fronts (`FRONTS`):

| From | Sides | Rule |
| --- | --- | --- |
| 0:00 | West | one side |
| 1:30 | West, East | one open at a time, swapping every 30 s, announced 4 s ahead |
| 3:30 | West, East, Sky | two open at a time, swapping every 25 s |
| 6:00 | all four | all open; every 20 s one side surges and takes 60% of the packs |

Each side sends a different kind of pack (`SIDE_STYLE`): the West 1.5 times the pack size from one ladder step back, the East two thirds of the size from the newest steps with every 8th foe an elite, the Sky flyers through rifts 110 to 260 px from the crystal, and Below walkers through rifts 70 to 150 px from it.
On top of that, every `eliteEvery` foe over the run is an elite (18, or the stage twist's own).

Big foes come at fixed times (`BIG_FOE_CALLS`) at 240 to 280 px from the crystal: an elite at 1:35, the mini boss at 4:15 and the stage boss at 7:30.
A mini boss or boss waits for an earlier boss fight to end; an elite never holds the next call.
When the clock runs out the field clears and the stage counts as cleared; The Unblinking no longer appears.

### Revives

A fallen hero stands up at the crystal with full HP and 2 s of guard after 3 x 1.5^falls seconds, at most 30 (`REVIVE`): 3, 4.5, 6.8, 10.1, 15.2, 22.8, then 30.
The countdown shows over the fallen hero.
Falls count per player in co-op.

### Experience and cards

Each pack carries the experience from the level band at the end of the last pack to the band at the time the next pack is due, `xpToReach(to) - xpToReach(from)`, shared by `xpBudget` over its foes by weight.
A hero who kills everything follows the level band; foes left alive leave the hero behind it.
A big foe adds the experience of 12 (elite), 25 (mini boss) or 40 (boss) seconds of the clock.
Summoned adds give a tenth of a level each times their share (`FOE_BAND.summonXpOfLevel`).
Cards open 0.35 s after a level up that gives a point (`PICK_DELAY_SECONDS`), and after a big foe falls.

### Co-op

Each player past the first adds 40% more minions to every pack (`COOP_SCALING.count`) and their HP scaling, and the most foes alive is x1.5 in a room.
The shared camera still keeps standing heroes within one screen of each other.

### Foe power by level band

A foe's level band is the clock's level band when it comes through its rift.
The hero's expected damage at a level is a table of anchors interpolated geometrically (`EXPECTED_HERO_DAMAGE`): x1 at level 1, x3 at 15, x40 at 30, x300 at 50, x24,000 at 80 and x150,000 at 99.
The late anchors are that high because a full stage's build compounds: skills, masteries, chests, evolutions, Resonance procs and Flow multiply each other, and the scripted runs below killed a 21 million HP Oakheart in 6 to 7 s at level 93 before this table.

- Minion HP is fixed per foe type for the whole run (owner rule, 28 November 2026): each stage has a ladder of foe types (`StageDef.ladder`) on 8 steps (`LADDER_RUNGS`: levels 1, 15, 26, 38, 48, 53, 62, 78).
  A foe's HP = its step's hits x 10 (`FOE_HIT`) x expected damage x crowd toughness at the step's level x the stage's HP multiplier; flyers take half (`FLYER_TOUGHNESS`).
  Step 1 foes always have 10 HP (5 for flyers), so one level-1 hit kills them on every stage and in co-op.
  Steps sit where crowd damage grows about 3 to 5 times, so a type falls from its step's hits to a few hits by the next step, when a tougher type takes over.
  Spawns pick from the newest three steps open at the current level, weighted 4, 2 and 1 (`src/utils/ladder.ts`).
  Crowd toughness (`CROWD_TOUGHNESS`) is x1 to level 45, x5.8 at 55, x0.97 at 80 and x0.36 at 99: crowd clearing jumps around level 50 as area skills and procs arrive, then grows more slowly than damage to one target, which the boss anchors follow.
- Steps 1 to 4 flinch: they attack at 0.6 times the pace, only within 56 px across and 84 px up or down, and any hit staggers them and stops their attacks for 1.2 s (`FLINCH`).
  Steps 5 to 8, mini bosses and bosses are armored: they never stagger and keep attacking, so each of their attacks has a clear telegraph and a recovery to punish.
- Elite, mini boss and boss HP = `HERO_DPS_AT_LEVEL_1` (30) x expected damage at the level they are fought at x `TIME_TO_KILL` (elite 20, mini boss 170, boss 150) x the stage's HP multiplier.
- Death bursts (Wildfire, Shatter, Plague) deal their share of the fallen foe's max HP, but at most 2% of a mini boss's or boss's own max HP (`BIG_FOE_BURST_CAP`), so a dying crowd does not melt the boss.
- Damage = `1 + 0.015 x (level - 1)` (x2.47 at 99) x the stage's damage multiplier; bosses and mini bosses x1.25 more and their own profile power.
- Attack pace follows the wave the band matches, `bandWave = 1 + 29 x (level - 1) / 98`, through the existing aggression scaling.

Stage tiers (`TIER_SCALE`, `STAGE_TIER` in `src/constants/stageGraph.ts`):

| Tier | Stages | HP | Damage |
| --- | --- | --- | --- |
| 1 | Sunlit Ruins | x1.0 | x1.0 |
| 2 | Storm Marsh, Cinder Foundry, Frostglass Caverns | x1.3 | x1.1 |
| 3 | Thunderhead Skyway, Drowned Archive, Moonlit Ruins | x1.7 | x1.25 |
| 4 | Veil Spires, Blightroot Hollow | x2.2 | x1.4 |
| 5 | Abyss Citadel | x3.0 | x1.6 |

Each stage has one twist (`StageDef.twist`) that changes one rule for the whole run:

| Stage | Twist | Rule |
| --- | --- | --- |
| Sunlit Ruins | Kind Sun | foes hit x0.6 |
| Storm Marsh | Swarming Fen | x1.3 foes a second |
| Cinder Foundry | Hot Forge | foes HP x0.8, damage x1.2 |
| Frostglass Caverns | Hard Ice | foes HP x1.25, damage x0.85 |
| Thunderhead Skyway | Storm Front | foes act x1.15 faster |
| Drowned Archive | Gilded Pages | an elite every 9th foe |
| Moonlit Ruins | Gloam Tithe | gold x1.5, hearts x0.5 |
| Veil Spires | Torn Veil | an elite every 6th foe |
| Blightroot Hollow | Rot Bloom | no hearts |
| Abyss Citadel | Black Sun | foes act x1.2 faster |

A Hyper stage plays the same clock with foes acting x1.25 faster and x2 gold (`HYPER`).
Gold per foe is x0.4 of the wave-mode drop in stages (`FOE_BAND.goldShare`), since a stage has about 800 foes.

### Bosses and mini bosses

`src/game/bossFight/` runs every mini boss and boss fight.

- Three phases: phase 2 at 70% HP (each boss's own enrage now reads `BOSS_PHASES.second`), phase 3 at 35%. Each change pushes the hero back, calls the profile's adds and makes the boss untouchable for 1.2 s.
- Haste on the boss's attack cooldowns: x1.3 in phase 1, x1.6 in phase 2, x1.9 in phase 3 (`BOSS_HASTE`, `BOSS_FRENZY`). Phase 1 also casts the combo follow-up at half its phase 2 chance.
- A stagger bar under the HP bar fills with damage taken: 8% of max HP the first time, x1.4 more each break; it drains after 2 s without a hit. When full, the boss is stunned for 2.6 s.
- Crowd control shortens on repeat: each new stun, freeze, hold or pin lasts x0.6 per earlier one, and one is forgotten every 8 s (`CONTROL_RESIST`). Stagger breaks count.
- Enrage timer: a mini boss enrages after 90 s and a boss after 240 s: x2.4 haste and x1.5 damage. The HUD shows the time left in the last 30 s.

A mini boss is one of its stage's own foes, drawn with its art inside a ring in its own light, with a name, an epithet card, the boss bar and two telegraphed moves it casts every 6.5 s (4.5 s from phase 2): a floor ring and light flare for 0.75 s, then pillars of light onto the hero, a row of floor spikes both ways, or a call of two or three adds (`src/game/miniBoss/`).

| Stage | Mini boss | Built from | Moves |
| --- | --- | --- | --- |
| Sunlit Ruins | Bramble Tusk | Thornback | spikes, call |
| Storm Marsh | The Mire King | Mire Toad | spikes, call |
| Cinder Foundry | Forge Marshal | Forgeguard | pillars, spikes |
| Frostglass Caverns | Rime Oracle | Cryomancer | pillars, call |
| Thunderhead Skyway | Storm Captain | Sky Guard | pillars, call |
| Drowned Archive | Grand Tomeguard | Tomeguard | spikes, pillars |
| Moonlit Ruins | Gravewarden | Husk | pillars, call |
| Veil Spires | Rift Marshal | Rift Knight | spikes, pillars |
| Blightroot Hollow | Rot Queen | Rot Crawler | spikes, call |
| Abyss Citadel | Void Reaver | Void Stalker | pillars, spikes |

### Tuning record (road loop)

These runs measured the road loop that the crystal defense replaced on 28 November 2026.

Measured on 27 November 2026 with a scripted Kael in headless Chromium (`/tmp` scripts, not in the repo) that walks right, mashes attacks and spells, jumps walls, takes the first card of every pick and the chests, and is healed back to half HP whenever it drops lower, so it never falls.
Full runs of the Sunlit Ruins from the stage screen, game time:

| Run | Tuning | Opening (to level 15) | Middle (to the mini boss) | Mini boss fight | Final act | Boss fight | Whole stage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | first curve | 3.6 min | 4.4 min | 18 s | 3.3 min | 10 s | 12.1 min |
| 2 | x2 to x13 late | 4.0 min | 6.9 min | 14 s | 8.9 min | 6 s | 20.1 min |
| 3 | same | 3.6 min | 4.2 min | 16 s | 2.7 min | 7 s | 11.1 min |
| 4 | death bursts capped | 3.5 min | 5.1 min | 28 s | 2.8 min | 22 s | 12.3 min |
| 5 | final curve | 3.5 min | 5.4 min | 25 s | 11.5 min | 95 s | 22.6 min |

After run 5 the mini boss time to kill was doubled (85 to 170) for a 45 to 60 s fight.
The bot never dodges and cannot die, so a player is slower in every column; the targets (about 25 minutes, a 45 to 60 s mini boss, a 2 to 3 min boss) are set against the bot at about 0.8 of a player's time.
The runs vary a lot with the cards the bot is dealt (compare runs 2 and 3, same tuning): a build that stacks one element snowballs.
A Storm Marsh run (tier 2) on the run 2 curve took 5.7 min to level 15 and 5.4 min more to the mini boss.
One Frostglass Caverns run on the final curve reached level 73 at 23 min.

## Experience and picks

- In a stage the cards open 0.35 s after a level up that gives a point, and when a big foe falls.
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

The skill pool takes an availability filter: `CardView.isAvailable(skillId)` in `src/utils/cards.ts`, all skills when not given.
The game passes `isSkillOpen`, so a new save deals each hero's five starting skills only (`docs/unlocks.md`).

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
With every pick tool bought in the Armory (5, 5, 3, before the Armory's levels changed) the simulated steering player evolves 2 to 3 (median), 4 or more in 4 to 6%, since its skips spend points; a sharper player would do better.

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

- Core (build state, cards and pick screen, charms, hero growth, Flow, chests, Armory, the skill framework): `src/game/build/`, `src/game/skills/`, `src/utils/build.ts`, `src/utils/cards.ts`, `src/ui/skills/`, `src/ui/chest/`, HUD.
- Each hero's skills: `src/heroes/<id>/constants/skills/`, `src/heroes/<id>/game/skills/`, `src/heroes/<id>/ui/icons/` (`docs/skill-design.md`, `docs/hero-module.md`).
- Waves: `src/utils/waves.ts`, `src/game/waves.ts`, `src/constants/waves.ts`, enemy spawning, elites, coins.
- Results: `src/game/damageLedger.ts`, the `source` of every `dealDamage` call, damage numbers, the result screen.
