# Brannoc's skills

Brannoc's 20 skills, written from the skill data in `src/constants/characters/brannoc/skills/`, which is the source of truth.
His debt, Fury, the axe string, the Hunt, his guard and Blood Answer, Frenzy and Berserk are in `docs/brannoc-design.md`; the rules every hero's skills follow are in `docs/skill-design.md`.

## Units

Damage is a multiple of attack damage (x AD) from `progress.stats.ad`, or of ability power (x AP) from `progress.stats.ap` where a skill's values say so.
At the start of a run AD is 13 and AP is 6.
Fury multiplies every hit he deals, from any source, by up to 1.6 as his HP falls, so every number below grows when he is hurt.
HP costs are shares of his max HP, paid into the debt.
"Bloodied" means at or under 35% of max HP (40% with Scarred Hide at level 4).
The damage over time skills lay their stacks through the shared `addStacks`.
"Slowed" means the shared chill, which halves a foe's pace.
Distances are art pixels, times are seconds, speeds are pixels a second.

## Base kit

Every button does something from the first second of a run.

| Key | With no skill |
| --- | --- |
| A / D | Walk, faster as his HP falls; a double tap runs. |
| W | One jump of the shared height. No double jump. |
| J tapped | The string Hew, Reave, Cleave, the same wherever foes stand. Cleave hits both sides and spins twice while Bloodied. In the air, Hatchet Drop, once per airtime. |
| J held | The Hunt, his warp on the shared numbers (10 MP): the great axe hurled into the nearest foe ahead, and him after it with a chop that wins back 5% of max HP more from the debt. |
| K | Guard: half a blocked blow bleeds through into the debt, 25 stamina a block. A parry is Blood Answer: the whole debt back at once and 3 s of Frenzy for free. |
| L | The shared front dodge. |
| I | The selected ability, paid in HP: Frenzy (12%: for 4 s blows do not stagger him, he swings 20% faster and repays 1.5 times, then 2 s before the next), War Cry (8%), Red Crescent (10%), or a spell skill. Held, War Cry reaches further and Red Crescent goes both ways, for 1.5 times the HP. |
| O | Switch ability. |
| U | Berserk, the base special, with the shared charge levels. |

## The 20 skills

| Id | Name | Kind | Risk | Button | Evolves with |
| --- | --- | --- | --- | --- | --- |
| `b_redEdge` | Red Edge | attack | precise | J | `b_scarred` |
| `b_heavyHew` | Heavy Hew | attack | easy | J | `b_geyser` |
| `b_reaver` | Reaver | attack | timed | J | `b_hunt` |
| `b_executioner` | Executioner | attack | precise | J | `b_bleed` |
| `b_spinningReap` | Spinning Reap | attack | timed | J | `b_headlong` |
| `b_sunder` | Sunder | attack | precise | J | `b_rend` |
| `b_hunt` | Long Hunt | movement | timed | J | `b_wolves` |
| `b_headlong` | Headlong | movement | easy | J | `b_reaver` |
| `b_bloodTrail` | Blood Trail | movement | timed | J | `b_hemorrhage` |
| `b_geyser` | Blood Geyser | spell | easy | I | `b_pact` |
| `b_axeThrow` | Hurled Axe | spell | easy | I | `b_spinningReap` |
| `b_pact` | Blood Pact | spell | precise | I | `b_executioner` |
| `b_bleed` | Open Wounds | dot | easy | auto | `b_sunder` |
| `b_rend` | Rend | dot | timed | J | `b_heavyHew` |
| `b_hemorrhage` | Haemorrhage | dot | precise | auto | `b_redEdge` |
| `b_wolves` | Blood Wolves | summon | easy | auto | `b_ravens` |
| `b_ancestor` | Forebear | summon | timed | K | `b_berserk` |
| `b_ravens` | Carrion Ravens | summon | timed | auto | `b_axeThrow` |
| `b_scarred` | Scarred Hide | passive | easy | auto | `b_ancestor` |
| `b_berserk` | Berserk | ultimate | timed | U | `b_bloodTrail` |

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.
Risk: precise 5, easy 7, timed 8.
His precise skills pay off on the first foe a blow reaches (`PRECISE_TARGETS`): Red Edge while Bloodied, Executioner on a wounded foe, Sunder on a foe caught winding up, Blood Pact's first Bloodied blow, and Haemorrhage's mark.

Kit events he emits through the shared function, declared in `src/types/brannoc.ts`: `debt` (spend, repay, fade or forfeit, with the HP), `frenzy` (on or off), `hunt` (his warp landed, with its foe, whether he threw from the air and where he threw from), `bloodied` (he crossed the line), `berserk` (on with its level, or off) and `cleave` (a Cleave struck, with the foes it landed on); and the shared `cast`, `jump`, `warp`, `dash`, `parry` and `hurt`.

### b_redEdge: Red Edge

attack, precise, J. While he is Bloodied, Cleave deals a large bonus to the first foe it reaches.

Values: power: share more the payoff blow deals to its first foe; hew: 1 Hew pays off too; bleed: 1 the payoff foe bleeds; sure: 1 the payoff is a sure crit; repay: a multiple on what the payoff repays; moon: 1 a Bloodied Cleave throws a 90 px crimson arc both ways (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.6, repay 1 | While Bloodied, Cleave deals 60% more to its first foe. |
| 2 | hew 0 to 1 | Hew pays off too. |
| 3 | power 0.6 to 0.9 | 90% more. |
| 4 | bleed 0 to 1 | The payoff foe bleeds. |
| 5 | power 0.9 to 1.3 | 130% more. |
| 6 | sure 0 to 1 | The payoff is a sure crit. |
| 7 | power 1.3 to 1.8 | 180% more. |
| 8 | power 1.8 to 2.4, repay 1 to 3 | 240% more; the payoff repays triple. |
| Evolved | moon 0 to 1 | A Bloodied Cleave throws 90 px arcs both ways. |

Evolution: **Crimson Moon** (partner `b_scarred`). A Bloodied Cleave also throws a crimson arc 90 px both ways along the floor.

### b_heavyHew: Heavy Hew

attack, easy, J. Hew lands harder, and later cracks the floor ahead of him.

Values: power: share more Hew deals; crack: pixels of the floor crack Hew sends ahead (0 for none); crackPower: attack damage the crack deals; guard: 1 Hew breaks a guard; crackStagger: 1 the crack staggers; split: 1 the crack erupts in spikes that throw minions up (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.25, crackPower 0.4 | Hew deals 25% more. |
| 2 | crack 0 to 40 | Hew cracks the floor 40 px ahead, 0.4x. |
| 3 | power 0.25 to 0.45 | Hew deals 45% more. |
| 4 | guard 0 to 1 | Hew breaks a guard. |
| 5 | crack 40 to 70, crackPower 0.4 to 0.6 | The crack runs 70 px, 0.6x. |
| 6 | crackStagger 0 to 1 | The crack staggers foes. |
| 7 | power 0.45 to 0.7 | Hew deals 70% more. |
| 8 | power 0.7 to 0.9, crackPower 0.6 to 1 | Hew 90% more; the crack 1x. |
| Evolved | split 0 to 1, crack 70 to 140 | The crack runs 140 px and erupts in spikes. |

Evolution: **Earthsplitter** (partner `b_geyser`). Hew's crack runs 140 px and erupts in spikes that throw minions up.

### b_reaver: Reaver

attack, timed, J. Reave reaches further behind him and drags what it sweeps.

Values: behind: pixels Reave reaches behind him; power: share more Reave deals; pull: pixels Reave pulls foes in; slow: seconds struck foes are slowed (to half speed); elites: 1 it pulls elites; second: attack damage of a second sweep (0 for none); hook: pixels round him from which Reave drags every foe into the Cleave's arc (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | behind 24, power 0.2 | Reave reaches 24 px behind him and deals 20% more. |
| 2 | pull 0 to 10 | Reave pulls foes 10 px in. |
| 3 | slow 0 to 2 | Struck foes are slowed for 2 s. |
| 4 | power 0.2 to 0.4 | Reave deals 40% more. |
| 5 | elites 0 to 1 | It pulls elites too. |
| 6 | power 0.4 to 0.6 | Reave deals 60% more. |
| 7 | second 0 to 0.6 | A second sweep follows, 0.6x. |
| 8 | power 0.6 to 0.9, second 0.6 to 0.8 | 90% more; the second sweep 0.8x. |
| Evolved | hook 0 to 60 | Reave drags every foe within 60 px in. |

Evolution: **Reaping Hook** (partner `b_hunt`). Reave drags every foe within 60 px into the Cleave's arc.

### b_executioner: Executioner

attack, precise, J. His blows deal a large bonus to a wounded foe.

Values: power: share more a blow deals to its first foe when that foe is under the threshold; under: the HP share under which a foe counts as wounded; killRepay: share of max HP a kill it makes repays; elites: 1 it works on elites; cull: minions under this HP share die outright; headsman: 1 Cleave fells minions and elites under 20% outright and deals 3x to mini bosses under 30% (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.8, under 0.3 | +80% on a minion or mini boss under 30% HP. |
| 2 | under 0.3 to 0.35 | Under 35% HP. |
| 3 | power 0.8 to 1.2 | 120% more. |
| 4 | killRepay 0 to 0.1 | A kill it makes repays 10% of max HP. |
| 5 | power 1.2 to 1.6 | 160% more. |
| 6 | elites 0 to 1 | It works on elites. |
| 7 | cull 0 to 0.15 | Minions under 15% HP die outright. |
| 8 | power 1.6 to 2.4 | 240% more. |
| Evolved | headsman 0 to 1 | Cleave fells foes under 20%; 3x on mini bosses. |

Evolution: **Headsman** (partner `b_bleed`). Cleave fells minions and elites under 20% HP outright, and deals 3x to mini bosses under 30%.

### b_spinningReap: Spinning Reap

attack, timed, J. Cleave spins on for extra turns.

Values: spins: extra turns Cleave spins; power: attack damage each extra turn deals; drift: pixels he drifts forward over the turns; pull: pixels each turn pulls foes in; wind: radius of a wind ring the last turn throws (0 for none); tempest: seconds of a whirl he steers with A and D in place of the turns (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | spins 1, power 0.6 | Cleave spins once more for 0.6x. |
| 2 | drift 0 to 20 | He drifts 20 px forward as he spins. |
| 3 | power 0.6 to 0.8 | The turns deal 0.8x. |
| 4 | pull 0 to 8 | Each turn pulls foes 8 px in. |
| 5 | spins 1 to 2 | Another turn. |
| 6 | power 0.8 to 1 | The turns deal 1x. |
| 7 | wind 0 to 60 | The last turn throws a 60 px wind ring. |
| 8 | power 1 to 1.3 | The turns deal 1.3x. |
| Evolved | tempest 0 to 1.2 | Cleave is a 1.2 s whirl steered with A and D. |

Evolution: **Red Tempest** (partner `b_headlong`). Cleave becomes a 1.2 s whirl he steers with A and D.

### b_sunder: Sunder

attack, precise, J. A Cleave that catches a foe winding up hits it far harder and stuns it.

Values: power: share more a Cleave deals to a foe caught winding up; stun: seconds it stuns that foe; mark: extra damage the foe takes from all sources for 5 s; hew: 1 Hew sunders too; elites: 1 it works on elites and mini bosses; ring: radius of a shatter ring round the foe (0 for none); shatter: radius the stunned foe bursts for, 2x attack damage (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, stun 0.8 | A Cleave on a winding foe deals 100% more and stuns it 0.8 s. |
| 2 | mark 0 to 0.2 | It marks the foe: +20% from all for 5 s. |
| 3 | power 1 to 1.5 | 150% more. |
| 4 | hew 0 to 1 | Hew sunders too. |
| 5 | elites 0 to 1 | Elites and mini bosses too. |
| 6 | power 1.5 to 2 | 200% more. |
| 7 | ring 0 to 40 | A 40 px shatter ring, 0.8x. |
| 8 | power 2 to 2.6, stun 0.8 to 1.2 | 260% more; the stun lasts 1.2 s. |
| Evolved | shatter 0 to 50 | The stunned foe bursts for 50 px, 2x. |

Evolution: **Shatterblow** (partner `b_rend`). The stunned foe bursts for 50 px, 2x.

### b_hunt: Long Hunt

movement, timed, J. The Hunt (J held) bites deeper, hunts twice in a row and marks its foe.
Its numbers reach the shared warp through his warp's `tune`; left out, the shared number stays.

Values: strike: attack damage of the Hunt chop; perPx and cap: power added per pixel the axe flew, and the most it adds; launch: 1 the chop launches minions; mark: extra damage the hunted foe takes from all sources for 5 s; charges: Hunts in a row before the first comes back; cost: MP a Hunt costs; wolves: 1 each Hunt sends a red wolf down the lane (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | strike 2.4 | The Hunt's chop deals 2.4x. |
| 2 | perPx 0.025, cap 4.5 | The further the axe flew, the harder the chop, up to +4.5x. |
| 3 | strike 2.4 to 3 | The chop deals 3x. |
| 4 | launch 0 to 1 | The chop launches minions. |
| 5 | mark 0 to 0.2 | The hunted foe is marked: +20% for 5 s. |
| 6 | charges 2 | Two Hunts in a row. |
| 7 | cost 6 | The Hunt costs 6 MP. |
| 8 | strike 3 to 5.4 | The chop deals 5.4x. |
| Evolved | wolves 0 to 1 | Each Hunt sends a red wolf down the lane. |

Evolution: **Wolf's Road** (partner `b_wolves`). Each Hunt also sends a red wolf running down the lane ahead, 1.2x to each foe it passes.

### b_headlong: Headlong

movement, easy, J. The Hunt (J held) lands headlong, striking and dragging in the foes round where he lands.
The landing strikes every foe within reach that the chop did not reach; its seventh level adds the shared warp's `path`, the hurled axe cutting what it passes.

Values: power: attack damage the landing deals to each foe within reach the chop did not reach; reach: pixels round where he lands; stagger: 1 minions it strikes stagger; drag: 1 it drags the minions it strikes in front of him, into the next blow's arc; elites: 1 it drags elites too; path: attack damage each foe the hurled axe passes takes; juggernaut: 1 the landing throws the minions it strikes up (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.5, reach 30 | The Hunt lands headlong: foes within 30 px take 0.5x. |
| 2 | stagger 0 to 1 | Minions it strikes stagger. |
| 3 | power 0.5 to 0.8 | 0.8x. |
| 4 | drag 0 to 1 | It drags the minions it strikes in front of him. |
| 5 | reach 30 to 45 | It reaches 45 px. |
| 6 | power 0.8 to 1.1, elites 0 to 1 | 1.1x; it drags elites too. |
| 7 | path 0 to 1 | The hurled axe also cuts every foe it passes, 1x. |
| 8 | power 1.1 to 1.5 | 1.5x. |
| Evolved | juggernaut 0 to 1, reach 45 to 60 | The landing reaches 60 px and throws minions up. |

Evolution: **Juggernaut** (partner `b_reaver`). The landing reaches 60 px and throws the minions it strikes up.

### b_bloodTrail: Blood Trail

movement, timed, J. The Hunt (J held) leaves a trail of blood from where he threw to where he lands, hurting foes standing in it.

Values: power: attack damage the trail deals every 0.5 s; time: seconds the trail lasts; slow: 1 foes on it are slowed to half speed; bleed: 1 it bleeds foes; killRepay: share of max HP a kill on it repays; river: 1 the trail lasts 3 s more and bursts at its end for 2x (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.2, time 2 | The Hunt leaves a 2 s trail, 0.2x every 0.5 s. |
| 2 | slow 0 to 1 | The trail slows foes on it. |
| 3 | power 0.2 to 0.3 | 0.3x. |
| 4 | time 2 to 3 | The trail lasts 3 s. |
| 5 | bleed 0 to 1 | It bleeds foes. |
| 6 | power 0.3 to 0.45 | 0.45x. |
| 7 | killRepay 0 to 0.05 | A kill on it repays 5% of max HP. |
| 8 | power 0.45 to 0.6, time 3 to 4 | 0.6x; lasts 4 s. |
| Evolved | river 0 to 1 | The trail lasts 3 s more and bursts, 2x. |

Evolution: **River of Red** (partner `b_hemorrhage`). The trail lasts 3 s longer, then bursts along its length for 2x.

### b_geyser: Blood Geyser

spell, easy, I. A spell on I paid in HP: a pillar of blood erupts under the nearest foe and throws it up.

Values: hp: share of max HP it costs; cooldown: seconds; ap: ability power each pillar deals; ad: attack damage each pillar adds; pillars: pillars; width: pixels across each pillar; mark: extra damage struck foes take from all sources for 4 s; repay: 1 each foe struck repays the debt; fountain: 1 each foe struck repays twice (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | hp 0.08, cooldown 6, ap 1, ad 0.4, pillars 1, width 12 | 8% HP: a pillar under the nearest foe within 120 px, 1x AP. |
| 2 | pillars 1 to 2 | A second pillar. |
| 3 | ap 1 to 1.4 | 1.4x AP. |
| 4 | width 12 to 18 | The pillars are wider. |
| 5 | mark 0 to 0.15 | Struck foes are marked: +15% for 4 s. |
| 6 | ap 1.4 to 1.8 | 1.8x AP. |
| 7 | repay 0 to 1 | Each foe struck repays the debt. |
| 8 | ap 1.8 to 2.4, ad 0.4 to 0.6 | 2.4x AP; 0.6x AD. |
| Evolved | fountain 0 to 1, pillars 2 to 3 | Three pillars; each foe repays twice. |

Evolution: **Blood Fountain** (partner `b_pact`). Three pillars, and each foe they strike repays the debt twice.

### b_axeThrow: Hurled Axe

spell, easy, I. A spell on I paid in HP: a hand axe flies out and comes back.

Values: hp: share of max HP it costs; cooldown: seconds; power: attack damage each way; pierce: 1 it passes through foes; bleed: 1 it bleeds foes; axes: axes thrown; returnRepay: share of max HP each axe repays when he catches it; fangs: seconds two axes orbit him in place of the throw (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | hp 0.1, cooldown 4, power 0.7, axes 1 | 10% HP: a hand axe flies 160 px and back, 0.7x each way. |
| 2 | pierce 0 to 1 | It passes through foes. |
| 3 | power 0.7 to 0.9 | 0.9x. |
| 4 | bleed 0 to 1 | It bleeds foes. |
| 5 | axes 1 to 2 | A second axe, thrown high. |
| 6 | power 0.9 to 1.2 | 1.2x. |
| 7 | returnRepay 0 to 0.06 | Caught, each axe repays 6% of max HP. |
| 8 | power 1.2 to 1.6 | 1.6x. |
| Evolved | fangs 0 to 3 | Two axes orbit him for 3 s. |

Evolution: **Twin Fangs** (partner `b_spinningReap`). Two axes orbit him for 3 s, striking every foe they pass.

### b_pact: Blood Pact

spell, precise, I. A spell on I paid in HP: for a few seconds his blows crit more, and crits win back double.

Values: hp: share of max HP it costs; cooldown: seconds; time: seconds it lasts; crit: chance his blows crit in it; first: the first Bloodied blow in it is a sure crit for this many times its damage (0 for none); fury: Fury added in it; noFade: 1 the debt does not fade in it; oath: 1 every kill in it extends it 1 s (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | hp 0.2, cooldown 14, time 5, crit 0.25 | 20% HP: 5 s of +25% crit, and crits repay double. |
| 2 | first 0 to 2 | The first Bloodied blow in it is a sure crit, 2x. |
| 3 | crit 0.25 to 0.35 | +35% crit. |
| 4 | time 5 to 7 | It lasts 7 s. |
| 5 | fury 0 to 0.1 | Fury +0.1 in it. |
| 6 | crit 0.35 to 0.45 | +45% crit. |
| 7 | noFade 0 to 1 | The debt does not fade in it. |
| 8 | crit 0.45 to 0.6, first 2 to 3 | +60% crit; the first Bloodied blow 3x. |
| Evolved | oath 0 to 1 | Every kill extends the pact 1 s. |

Evolution: **Oathbound** (partner `b_executioner`). Every kill in the pact makes it last 1 s longer.

### b_bleed: Open Wounds

dot, easy, auto. His string blows lay a bleed that stacks.

Values: power: attack damage a second each stack deals; max: stacks a foe can carry; spread: 1 a foe that dies passes its stacks to the nearest foe; every: seconds between ticks; cleave: stacks a Cleave lays; dry: attack damage per stack a Cleave deals when it takes every stack as one hit (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.08, max 5, every 1, cleave 1 | String blows lay a bleed, 0.08x a second per stack, 5 stacks. |
| 2 | max 5 to 8 | 8 stacks. |
| 3 | power 0.08 to 0.12 | 0.12x. |
| 4 | spread 0 to 1 | A foe that dies passes its stacks on. |
| 5 | every 1 to 0.5 | Ticks twice as fast. |
| 6 | power 0.12 to 0.16 | 0.16x. |
| 7 | cleave 1 to 3 | Cleave lays 3 stacks. |
| 8 | power 0.16 to 0.22, max 8 to 10 | 0.22x; 10 stacks. |
| Evolved | dry 0 to 1.2 | Cleave takes every stack as one hit, 1.2x each. |

Evolution: **Bleed Dry** (partner `b_sunder`). Cleave takes every stack on a foe as one hit, 1.2x per stack.

### b_rend: Rend

dot, timed, J. Cleave rends the foes it strikes with heavy stacks that tear at them.

Values: power: attack damage a second each stack deals; stacks: stacks a Cleave lays; hew: stacks Hew lays (0 for none); time: seconds the stacks last; slow: seconds rended foes are slowed (to half speed); wide: pixels past the Cleave's reach it still rends; flay: share more rended foes take from Hew (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.15, stacks 3, time 4 | Cleave rends: 3 stacks, 0.15x a second each. |
| 2 | hew 0 to 1 | Hew rends too, 1 stack. |
| 3 | power 0.15 to 0.22 | 0.22x. |
| 4 | time 4 to 6 | Rends last 6 s. |
| 5 | slow 0 to 2 | Rended foes are slowed for 2 s. |
| 6 | power 0.22 to 0.3 | 0.3x. |
| 7 | wide 0 to 20 | Cleave rends 20 px past its reach. |
| 8 | power 0.3 to 0.42, stacks 3 to 4 | 0.42x; 4 stacks. |
| Evolved | flay 0 to 0.3 | Rended foes take 30% more from Hew. |

Evolution: **Flay** (partner `b_heavyHew`). Rended foes take 30% more from Hew.

### b_hemorrhage: Haemorrhage

dot, precise, auto. While Bloodied, his blows plant a mark on the first foe that bursts for what it stored.

Values: store: multiple of the damage stored the burst deals; fuse: seconds to the burst; repay: share of max HP a burst repays; spread: radius the burst spreads to at half (0 for none); bosses: 1 it works on mini bosses and bosses; bloom: 1 a burst chains to the next foe and plants a new mark (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | store 1.5, fuse 2 | Bloodied blows mark a foe; in 2 s it bursts for 1.5x what it stored. |
| 2 | store 1.5 to 2 | 2x what it stored. |
| 3 | repay 0 to 0.05 | A burst repays 5% of max HP. |
| 4 | store 2 to 2.5 | 2.5x. |
| 5 | spread 0 to 30 | The burst spreads 30 px at half. |
| 6 | fuse 2 to 1.5 | The fuse is 1.5 s. |
| 7 | bosses 0 to 1 | Mini bosses and bosses too. |
| 8 | store 2.5 to 3.5 | 3.5x. |
| Evolved | bloom 0 to 1 | A burst chains on and marks the next foe. |

Evolution: **Red Bloom** (partner `b_redEdge`). A burst chains to the next foe and plants a new mark there.

### b_wolves: Blood Wolves

summon, easy, auto. A kill may call a red wolf spirit that lunges at the nearest foe.

Values: chance: chance a kill calls wolves; power: attack damage each bite deals; count: wolves called; bleed: 1 bites bleed; stay: seconds wolves stay and bite again (0 for one bite); cooldown: seconds between calls; pack: 1 every kill while Bloodied calls a wolf (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.15, power 0.8, count 1, cooldown 0.6 | 15%: a kill calls a red wolf that lunges, 0.8x. |
| 2 | count 1 to 2 | Two wolves. |
| 3 | power 0.8 to 1.1 | 1.1x. |
| 4 | bleed 0 to 1 | Bites bleed. |
| 5 | chance 0.15 to 0.3 | 30% chance. |
| 6 | power 1.1 to 1.5 | 1.5x. |
| 7 | stay 0 to 3 | Wolves stay 3 s and bite again. |
| 8 | power 1.5 to 2 | 2x. |
| Evolved | pack 0 to 1 | Every Bloodied kill calls a wolf. |

Evolution: **Blood Pack** (partner `b_ravens`). Every kill while he is Bloodied calls a wolf.

### b_ancestor: Forebear

summon, timed, K. Frenzy, from I or from a parry's Blood Answer (K), calls a ghostly forebear who swings with him and answers each parry.

Values: every: his blows between the forebear's swings (a parry makes it swing at once); power: attack damage each swing deals; both: 1 it cleaves both sides; answer: seconds a parry's Blood Answer adds to its free Frenzy; stagger: 1 its swing staggers minions and marks them; outlast: seconds it stays after Frenzy ends; host: forebears that stand with him through Berserk (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | every 3, power 1 | Frenzy calls a forebear: it swings on every third blow and at once on a parry, 1x. |
| 2 | power 1 to 1.4 | 1.4x. |
| 3 | every 3 to 2 | It swings on every second blow. |
| 4 | both 0 to 1 | It cleaves both sides. |
| 5 | answer 0 to 2 | Blood Answer's free Frenzy lasts 2 s longer. |
| 6 | stagger 0 to 1, power 1.4 to 1.8 | Its swing staggers and marks minions; 1.8x. |
| 7 | outlast 0 to 2 | It stays 2 s after Frenzy. |
| 8 | power 1.8 to 2.4 | 2.4x. |
| Evolved | host 0 to 3 | Three forebears stand with him through Berserk. |

Evolution: **Host of Forebears** (partner `b_berserk`). Three forebears stand with him through Berserk too.

### b_ravens: Carrion Ravens

summon, timed, auto. A blow taken may send ravens at the foe that dealt it.

Values: chance: chance a blow taken sends them; count: ravens; power: attack damage each raven deals; blind: seconds they stagger the foe; repay: share of max HP each raven's strike repays; storm: seconds a raven cloud circles him (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.4, count 2, power 0.6 | 40%: two ravens strike the foe that hurt him, 0.6x. |
| 2 | blind 0 to 1 | They blind it 1 s. |
| 3 | power 0.6 to 0.9 | 0.9x. |
| 4 | count 2 to 4 | Four ravens. |
| 5 | chance 0.4 to 0.6 | 60% chance. |
| 6 | power 0.9 to 1.2 | 1.2x. |
| 7 | repay 0 to 0.02 | Each strike repays 2% of max HP. |
| 8 | power 1.2 to 1.6 | 1.6x. |
| Evolved | storm 0 to 4 | A raven cloud circles him for 4 s. |

Evolution: **Carrion Storm** (partner `b_axeThrow`). A cloud of ravens circles him for 4 s, striking every foe it passes.

### b_scarred: Scarred Hide

passive, easy, auto. His debt holds more, fades slower, and his Fury runs hotter.

Values: cap: share of max HP added to the debt's cap; fade: share slower the debt fades; line: the HP share he is Bloodied at (0 keeps 35%); fury: Fury added; thirst: share of max HP Bloodthirst heals (0 keeps 3%); thousand: 1 a blow forfeits only half the debt (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | cap 0.1 | The debt holds 10% more of max HP. |
| 2 | fade 0 to 0.25 | The debt fades 25% slower. |
| 3 | cap 0.1 to 0.15 | It holds 15% more. |
| 4 | line 0 to 0.4 | Bloodied from 40% HP. |
| 5 | fury 0 to 0.1 | Fury +0.1. |
| 6 | cap 0.15 to 0.2 | It holds 20% more. |
| 7 | thirst 0 to 0.04 | Bloodthirst heals 4%. |
| 8 | fade 0.25 to 0.5, fury 0.1 to 0.15 | Fades 50% slower; Fury +0.15. |
| Evolved | thousand 0 to 1 | A blow forfeits only half the debt. |

Evolution: **Thousand Scars** (partner `b_ancestor`). A blow forfeits only half the debt.

### b_berserk: Berserk

ultimate, timed, U. Berserk lasts longer as he kills, and Last Cleave strikes harder, wider and more than once.
It upgrades his special, which `castBerserk` reads through `ultimateValues()`; the plain special is Berserk without it.
Budget: level 8 is 2x on each of three strikes, about 6 times the plain special's one; evolved, 3x on each of three strikes and the same again across the whole stage, about 15 times.

Values: power: a multiple on Last Cleave's damage; extend: seconds each kill in Berserk adds; strikes: times Last Cleave strikes; wider: share wider its ring is; stun: seconds the roar stuns foes; repay: a multiple on repays in Berserk (2 without the skill); extra: seconds Berserk lasts longer; settle: 1 the last strike wins back the whole debt; world: 1 Last Cleave splits the floor across the stage (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.3, extend 0.5, strikes 1, repay 2 | Last Cleave deals 1.3x; each kill in Berserk adds 0.5 s. |
| 2 | strikes 1 to 2 | Last Cleave strikes twice. |
| 3 | power 1.3 to 1.6, wider 0 to 0.25 | Last Cleave deals 1.6x and rings 25% wider. |
| 4 | stun 0 to 1 | The roar stuns foes 1 s. |
| 5 | repay 2 to 3 | Blows repay triple in Berserk. |
| 6 | power 1.6 to 2, extra 0 to 1 | Last Cleave deals 2x; Berserk lasts 1 s longer. |
| 7 | settle 0 to 1 | The last strike of Last Cleave wins back the whole debt. |
| 8 | strikes 2 to 3, extra 1 to 2 | Last Cleave strikes three times; Berserk lasts 2 s longer. |
| Evolved | world 0 to 1, power 2 to 3 | Last Cleave splits the floor across the stage, 3x. |

Evolution: **World Ender** (partner `b_bloodTrail`). Every strike of Last Cleave splits the floor across the whole stage, 3x.
