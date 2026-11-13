# Kael skills

Kael's part of the skill rework (`docs/skill-design.md`).
This is a working design: numbers are starting values for the constants files.
AD and AP mean Kael's attack damage and ability power (both 10 at hero level 1, `KAEL.base`).

## Identity

Kael is the warp knight: a sword string that plays the same every time, a thrown sword he appears beside, a sword guard whose parry blinks him behind the attacker, and crystal magic.
His skills lean on what makes him different: the warp (J held), back attacks, Keen timing, the parry, launches into short air strings, and spells with no shared wait.
He plays on the moveset every hero shares (`docs/moveset-design.md`).
Every skill is on a single button press or runs on its own; nothing asks for a direction, a dash or a double tap during or after a combo.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The ground string, fixed at 4 hits and the same wherever the foes stand: step cut (1.15 AD), rising backhand (1.15 AD), twin fang (0.75 + 0.85 AD), falling smash (2.35 AD, knocks down). No blow turns Kael around. |
| J (Keen) | J pressed in the 0.1 s after a blow lands makes the next blow a sure crit, drawn gold. Mashing spoils it. |
| J (air) | Air string of 2 per jump: wheel slash (1.7 AD), scissor cut (1.85 AD, pops the foe up). |
| J held | Warp Strike, the shared warp: throw the sword at the nearest foe ahead and appear beside it striking, 1.8 AD plus 0.014 AD per pixel travelled (up to +2.8). 10 MP, 2 s recharge. |
| K | Guard: held, it blocks blows from the front for 14 stamina and lets 20% through. A blow from behind lands. |
| K (parry) | Pressed just as a blow lands: the shared parry, then a riposte cut at once (1.6 AD, sure crit), the next string blow is Keen, and for 0.7 s J is the counter. |
| J after a parry | The counter: Kael blinks to the attacker's back and strikes it, 2 AD and a sure crit. A gold mark shows where he will land. |
| L | The shared dodge: 0.24 s, untouchable, ground only, two per stamina bar. A perfect dodge in its first 0.12 s slows the world and gives 8 MP, 25 stamina and 5 Flow. |
| I | Cast the selected ability; on a recharging one, the next ready one. Each has its own recharge, and none waits on another. |
| I held | The wide form of the selected ability for 1.5 times its MP (`WIDE_COST`). |
| I during a combo | Spellblade: after the second hit, the cast leaves the hand at once with 1.5x power and ends the combo. |
| O | Switch to the next ability. |
| U | Crystal Nova, charged in four levels (75% of the level power, ring 60 to 340 px). Crystal Nova's skill upgrades it. |
| Up | Jump; Up again in the air is a double jump. |

Base abilities:

- **Crystal Lance**: a crystal crescent flies forward and cuts every foe in its line once, 2.5 AP, passes guards. 12 MP, 4 s. Reuses `createCrystalWave`.
- **Crystal Burst**: a ring of crystal around Kael, 40 px, 1.5 AP, pushes foes away. 15 MP, 6 s. An escape when cornered. Reuses `createFloorRing` and an `around` hit.

The ability order is Lance, Burst, Fire, Ice, Lightning, the spells shown once their skill is held.

Wide forms (I held), each for 1.5 times the MP and the same recharge:

| Ability | Wide form |
| --- | --- |
| Crystal Lance | A fan of three lances, flat, rising and steeply rising. Each foe is cut once, so the fan reaches flyers and spreads out, and one foe takes no more than from one lance. |
| Crystal Burst | A ring twice as wide (80 px) that pulls every foe in it to Kael, harder the farther out it stood. |
| Fire Flask | Each flask's burst raises a wall of flame (22 px each side, 16 px tall) that stands 3 s and burns every foe in it for 0.3 of the burst each tick. |
| Ice Spikes | A full line of spikes runs each way, and frost over 110 px round Kael slows every foe on it for 2.5 s. Glacier Bloom keeps its spire at the front end. |
| Lightning | A chain of bolts across the whole screen, nearest foes first, one bolt each on 3 foes plus the bolt's arcs, each 0.6 of the bolt. Thunderhead's cloud still comes. |

Spellblade works on the wide form: held during an open combo, the wide form leaves the hand at once with Spellblade's power.


### Combo hits and the air string

- `comboHits: 4`. The string is step cut, rising backhand, twin fang, smash; hop cleave and crescent turn leave the plain string and come back as skill moves (Keen Edge, Reaping Sweep).
- Combo length never changes. Skills change hit 1 (Reaping Sweep), hit 3 (Phase Cut), hit 4 (Skybreaker, Keen Edge) or add effects to every hit.
- When two skills claim the same hit: Phase Cut wins hit 3 over the crescent turn, and a Keen 4th hit is the hop cleave (Keen Edge level 7) over Skybreaker's launch.
- Air string limit: 2 per jump in the base kit (wheel, scissor), 3 with Sky Dance (adds the stomp). A double jump adds no air hits.
- Every skill blow holds a wind-up of at least three animation frames before its hit frame, like the plain string (`docs/combo-design.md`), and keeps the string's tempo; their timing and hit feel are in `src/constants/kael/skillBlows.ts`.
- The sweep strikes on frame 5 and its drag stops each foe at Kael's feet. The crescent turn cuts in front on frame 5 and behind on frame 10.
- The phase cut coils for frames 2 to 4, passes through the foe between frames 4 and 5 and strikes it on frame 5 as Kael lands past it, still facing on; he turns to face it on frame 7, every time.
- Skybreaker slides in through its crouch, strikes on frame 7, lifts Kael 40 px and throws the foe up at 330 px a second, low enough that the air string started in its follow-through reaches it. The hop cleave leaves the floor on frame 2 and lands on its hit, frame 8.
- Sky Dance's whirlwind cuts on frames 5, 8 and 11; the meteor drop tucks to frame 5 and dives at the stomp's speed.

## What leaves today's kit

| Today | Input | Where its good part went |
| --- | --- | --- |
| Rising Launcher | Up + J in a combo | Skybreaker: the 4th hit launches on its own. The 2x damage on airborne foes is already a base rule. |
| Low Sweep | Down + J | Reaping Sweep: the 1st hit is the sweep that trips and drags. |
| Phase Finish (forward) | double tap after hit 3 | Phase Cut: the 3rd hit passes through the foe by itself, so the finisher lands from behind. |
| Phase Finish (back flip) | double tap back after hit 3 | Dropped. Its job (get out and push the foe off) is the plain dash plus Crystal Burst. |
| Skybreaker | Up after hit 3 | Skybreaker: the launch hits every foe in a tall box (level 2) and behind (level 6). |
| Dash Strike | J right after a dash | Passing Cut: the dash itself cuts foes it passes and ends with the uppercut, no J. |
| Running Thrust | J while running | Warpcraft level 2: the warp arrival is the lunging thrust with its wall bounce. |
| Meteor Drop | Down + J in the air | Sky Dance level 6: the air string's stomp lands as the meteor bounce. |
| Whirlwind | J after a double jump | Sky Dance level 3: the first air hit after a double jump. |
| Blink Combo | K in a combo | Blink Step: J held in an open combo, the combo goes on after it. |
| Flowing Chain | passive | Gone (combo length is fixed). |
| Warp Strike, Double Jump | skills | Base kit. |
| Sky Dance, Jump Dash, Gravity Well | skills, fusion | Sky Dance levels 1, 2, 5. |
| Warpcraft | skill | Warpcraft level 1. |
| Deep Breath, Quickstep | passives | Passing Cut levels 2 and 5 (stamina). |
| Fire, Ice, Lightning, Pyromancy, Cryomancy, Stormcalling | spells, enhances | Fire Flask, Ice Spikes, Lightning levels. |
| Sunflask, Glacier Bloom, Thunderhead | evolutions | The three spell skills' evolutions. |
| Static Step | fusion | Static Charge. |
| Shatter | fusion | Ice Spikes level 4. |
| Ignition | fusion | Fire Flask level 5. |
| Phantom Edge | fusion | Phantom Edge (summon). |
| Mana Blade | fusion | Keen Edge level 4 (a Keen blow sends the crystal wave). |
| Riposte | fusion | Mirror Knight level 2. |
| Thousand Edges, Phantom Legion, Starfall | ultimates | Crystal Nova's levels: phantoms (level 3), falling stars (level 5), a storm of edges (level 6), and Supernova's storm that follows Kael. |
| Dash and its K warp | L, K | The shared dodge on L and the shared warp on J held; Kael keeps Rift Walker. |
| Tempest | ultimate | Folded into Thunderhead (the storm cloud keeps striking). |
| Keen Edge (stat), Swift Hands, Killing Intent, Berserker, Iron Will, Fleet Foot, Mana Font, Arcane Power, Archmage, Swift Sigils, Quick Cast, Siphon | passives | Dropped; Might, Haste and the other charms cover stat growth. |

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `k_keen` | Keen Edge | attack | precise | J | `k_phase` | Peerless Edge |
| `k_skyward` | Skybreaker | attack | timed | J | `k_skydance` | Heavenfall |
| `k_reap` | Reaping Sweep | attack | easy | J | `k_splinters` | Crystal Harvest |
| `k_phase` | Phase Cut | attack | timed | J | `k_blink` | Phantom Passage |
| `k_aegis` | Crystal Aegis | attack | precise | K | `k_mirror` | Diamond Aegis |
| `k_warpcraft` | Warpcraft | movement | timed | J held | `k_passing` | Rift Walker |
| `k_blink` | Blink Step | movement | timed | J held | `k_echo` | Shadow Step |
| `k_spellwarp` | Spellwarp | movement | timed | J held | `k_warpcraft` | Arcane Arrival |
| `k_passing` | Passing Cut | movement | timed | L | `k_skydance` | Phantom Rush |
| `k_skydance` | Sky Dance | movement | timed | Up | `k_reap` | Comet Dance |
| `k_flame` | Fire Flask | spell | easy | I | `k_familiar` | Sunflask |
| `k_frost` | Ice Spikes | spell | timed | I | `k_reap` | Glacier Bloom |
| `k_volt` | Lightning | spell | easy | I | `k_static` | Thunderhead |
| `k_splinters` | Crystal Splinters | dot | easy | auto (J blows) | `k_keen` | Shatterstorm |
| `k_rift` | Rift Wound | dot | timed | auto (warp arrival) | `k_warpcraft` | Rift Collapse |
| `k_static` | Static Charge | dot | timed | auto (L through foes) | `k_passing` | Overload |
| `k_echo` | Phantom Edge | summon | precise | auto (back blow) | `k_mirror` | Phantom Host |
| `k_familiar` | Crystal Familiar | summon | easy | auto (cast) | `k_volt` | Crystal Choir |
| `k_mirror` | Mirror Knight | summon | precise | auto (parry or perfect dodge) | `k_keen` | Perfect Reflection |
| `k_nova` | Crystal Nova | ultimate | easy | U | `k_keen` | Supernova |

Counts: attack 5, movement 5, spell 3, dot 3, summon 3, ultimate 1. Risk: easy 6, timed 10, precise 4.
The Values column shows only the numbers a level changes; the data rows (`src/constants/characters/kael/skills/`) carry the whole state.

"New" in a card line marks a level that adds a property; the rest are number steps.
Damage source: hits of Kael's own press (string blows, warp, blink, the parry's riposte and counter, dodge cuts, casts, ultimates) count as `attacks`, `abilities` or `ultimate` and build Flow; ticks, summons and anything that strikes on its own use the skill id and build no Flow.

#### `k_keen` Keen Edge

Attack, precise, J. Press J in the beat after a blow lands: the Keen blow hits far harder.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Keen blows deal +200% damage. | bonus 2, window 0.1 |
| 2 | Keen window 0.10 to 0.14 s. | window 0.14 |
| 3 | New: a Keen blow breaks guards. | guardBreak 1 |
| 4 | New: a Keen blow sends a crystal wave forward. | wave 1.5 |
| 5 | Keen damage +200% to +500%. | bonus 5 |
| 6 | New: each Keen blow in a row adds +25% to the next, up to +100%. | streak 0.25, streakCap 1 |
| 7 | New: a Keen 4th hit is a hop cleave that knocks down. | cleave 3 |
| 8 | Keen damage +500% to +2000%; the wave hits far harder. | bonus 20, wave 10 |

Evolution **Peerless Edge** (partner `k_phase`): Every third Keen blow ends in a gold cross cut, and for 3 seconds every blow is Keen.
Evolved values added: cross 330, crossEvery 3, free 3. The cross cut strikes only the foe the Keen move paid off on (precise payoff, balance round 3); it had a 15 AD ring in 50 px before.
Code: `hero/kael/keen.ts` (window, wave, streak, Peerless Edge), `hero/kael/bonus.ts` (Keen bonus), `hero/kael/shapeHit.ts` (guard break, hop cleave), `utils/comboChoice.ts`.

#### `k_skyward` Skybreaker

Attack, timed, J. The last hit of the combo launches foes into the air instead of knocking them down.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The 4th hit launches the foe high. | launch 2.65, crashReach 30 |
| 2 | New: the launch takes every foe in a tall box ahead. | wide 1 |
| 3 | Launch power 2.65 to 3.95. | launch 3.95 |
| 4 | New: launched foes take +30% damage until they land. | airBonus 0.3 |
| 5 | New: launched foes crash down on foes near them. | crash 1.2 |
| 6 | New: the launch also cuts behind Kael. | behind 1 |
| 7 | Launched foes take +60%; the crash hits harder. | airBonus 0.6, crash 2 |
| 8 | Launch and crash far stronger and wider. | launch 8.2, crashReach 45, crash 3.5 |

Evolution **Heavenfall** (partner `k_skydance`): At the top of each launch a crystal phantom spikes the foe back down into a shockwave.
Evolved values added: spike 15, shockReach 60.
Code: `utils/comboChoice.ts` (4th hit), `hero/kael/shapeHit.ts` (power, box), `hero/kael/bonus.ts` (airborne taken), `skills/kael/skybreaker.ts` (crash, Heavenfall).

#### `k_reap` Reaping Sweep

Attack, easy, J. The combo opens with a low sweep that trips foes and drags them into the string.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The 1st hit is a low sweep that trips foes and drags them in. | power 1.65, reach 34, drag 20 |
| 2 | New: the sweep reaches behind Kael too. | behind 1 |
| 3 | Reach 34 to 50 px; drags twice as far. | reach 50, drag 40 |
| 4 | New: tripped foes take +25% damage. | trip 0.25 |
| 5 | New: the 3rd hit is a crescent turn, front and back. | crescent 1 |
| 6 | New: the sweep pulls flying foes down to the floor. | flyers 1 |
| 7 | Sweep power 1.65 to 3.3; tripped foes take +40%. | power 3.3, trip 0.4 |
| 8 | Reach 50 to 70 px; drags them to Kael's feet. | reach 70, drag 60 |

Evolution **Crystal Harvest** (partner `k_splinters`): The sweep sends a crystal tide along the floor both ways that drags every foe it touches to Kael and lodges splinters.
Evolved values added: tide 120, tideSplinters 3.
Code: `utils/comboChoice.ts` (1st and 3rd hit), `hero/kael/shapeHit.ts` (power, reach, drag), `hero/kael/reap.ts` (flyers, Crystal Harvest tide), `hero/kael/bonus.ts` (tripped taken).

#### `k_phase` Phase Cut

Attack, timed, J. The third hit cuts through the foe and turns, so the finisher lands on its back.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The 3rd hit passes through the foe, so the 4th lands from behind. | power 3.85, reach 80 |
| 2 | New: Kael cannot be hurt in the pass, and it breaks guards. | guard 1 |
| 3 | Phase cut power 3.85 to 5.5. | power 5.5 |
| 4 | New: every foe passed through is cut. | line 1 |
| 5 | New: back attacks deal +40% for 1.5 s after a phase. | back 0.4, backTime 1.5 |
| 6 | Reach 80 to 120 px. | reach 120 |
| 7 | New: an afterimage repeats the phase cut. | echo 0.6 |
| 8 | Phase cut power 5.5 to 13.2; back attacks +150% for 2 s. | power 13.2, back 1.5, backTime 2 |

Evolution **Phantom Passage** (partner `k_blink`): The phase cut runs through every foe within 160 px ahead, and the finisher strikes them all from behind.
Evolved values added: reach 160, passage 1.
Code: `hero/moves/finishers.ts` (pass, guard, Phantom Passage), `hero/kael/shapeHit.ts`, `hero/kael/afterStrike.ts` (back bonus window, afterimage), `hero/kael/bonus.ts`.

#### `k_warpcraft` Warpcraft

Movement, timed, J held. Warp Strike costs less, recharges faster and reaches further, and its arrival hits like a thrust.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Warp costs 6 MP and recharges in 1.5 s. | cost 6, recharge 1.5, charges 1 |
| 2 | New: the arrival is a lunging thrust that drives foes off. | thrust 1 |
| 3 | The longer the warp, the harder it hits. | perPx 0.025, cap 5 |
| 4 | New: the thrown sword cuts every foe on its way. | path 1 |
| 5 | New: two warp charges. | charges 2 |
| 6 | Recharge 1.5 to 1.1 s. | recharge 1.1 |
| 7 | New: the arrival also cuts behind Kael. | behind 1 |
| 8 | Warp strike 1.8 to 7; the sword's cut hits harder. | path 2.5, strike 7 |

Evolution **Rift Walker** (partner `k_passing`): Once every 4 seconds, after an arrival the sword leaps on to 3 more foes and Kael warps to each in turn.
Evolved values added: chain 3, chainEvery 4.
Code: `hero/warp.ts` (cost, recharge, charges, thrust, path cut, behind, Rift Walker chain).

#### `k_blink` Blink Step

Movement, timed, J held. Hold J during a combo to step through to the foe's back and strike, with no sword throw.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | J held during a combo blinks behind the foe and strikes. | power 1.8 |
| 2 | New: the combo goes on after the blink. | keep 1 |
| 3 | Blink strike power 1.8 to 2.8. | power 2.8 |
| 4 | New: a blink in the Keen beat is a sure crit. | keen 1 |
| 5 | New: the foe cannot turn for 1.2 s. | lock 1.2 |
| 6 | New: the blink has its own 1.2 s recharge. | recharge 1.2 |
| 7 | New: an afterimage cuts where Kael stood. | after 1.2 |
| 8 | Blink strike power 2.8 to 7; the foe cannot turn for 2 s. | power 7, lock 2 |

Evolution **Shadow Step** (partner `k_echo`): A phantom cuts from the near side as Kael blinks, and a blink that kills is free.
Evolved values added: shadow 1.
J held outside an open combo, or with no blink ready, is the plain warp.
Code: `hero/readActions.ts` (J held in a combo), `hero/kael/blink.ts` (strike, lock, afterimage, Shadow Step).

#### `k_passing` Passing Cut

Movement, timed, L. The dodge cuts every foe it passes through.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The dodge cuts every foe it passes through. | cut 0.8 |
| 2 | Max stamina +50: one more dodge. | ; stamina +50 |
| 3 | Dodge cut power 0.8 to 1.4. | cut 1.4 |
| 4 | New: the dodge ends with a rising cut. | rising 1 |
| 5 | New: each foe cut gives back stamina. | refund 10 |
| 6 | New: a perfect dodge cuts for triple. | perfect 3 |
| 7 | New: foes cut are slowed for 1.5 s. | chill 1.5 |
| 8 | Dodge cut power 1.4 to 4; rising cut 1 to 2. | cut 4, rising 2 |

Evolution **Phantom Rush** (partner `k_skydance`): Crystal phantoms along the dodge's path cut again a moment later, and dodges cost half the stamina.
The dodge on L is the one every hero shares (`hero/dash.ts`); Passing Cut is Kael's addition to it.
Evolved values added: rush 3, staminaCost 0.5.
Code: `hero/kael/passingCut.ts` (cuts, rising cut, refund, chill, Phantom Rush), `hero/stamina.ts` (half cost).

#### `k_skydance` Sky Dance

Movement, timed, jump. One more attack in the air, ending in a stomp, and later a dodge in the air.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | One more air hit: a stomp that knocks foes down. | air 1, stomp 2.2, stompReach 40 |
| 2 | New: L dodges in the air too, once per jump. | airDash 1 |
| 3 | New: after a double jump, the first air hit spins both ways. | whirl 1 |
| 4 | Air hits +30%. | airBonus 0.3 |
| 5 | New: the stomp drags airborne foes down with Kael. | gravity 1 |
| 6 | New: the stomp bounces foes up for a fresh launch. | meteor 1 |
| 7 | Stomp reach 40 to 60 px; air hits +60%. | stompReach 60, airBonus 0.6 |
| 8 | Stomp power 2.2 to 6. | stomp 6 |

Evolution **Comet Dance** (partner `k_reap`): Air hits drop crystal shards on the foe below, and the stomp lands as a comet that draws foes in.
Evolved values added: shard 1.5, comet 8, cometReach 90.
Code: `skills/airLimit.ts` (air string), `hero/dash.ts` (air dash), `utils/comboChoice.ts` (whirl, meteor), `hero/moves/air.ts` (stomp, comet), `hero/gravityWell.ts`, `skills/kael/skyDance.ts` (Comet Dance shards).

#### `k_flame` Fire Flask

Spell, easy, I. Learn the fire spell: a flask that bursts and sets foes burning.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | I throws a flask that bursts and sets foes burning. | power 1.6, radius 34, burn 1.5, recharge 10, flasks 1 |
| 2 | New: the burst knocks foes down. | stun 0.5 |
| 3 | New: the burst leaves the floor burning. | floor 2 |
| 4 | Burst power 1.6 to 2.4; recharge 10 to 7 s. | power 2.4, burn 3, recharge 7 |
| 5 | New: a burning foe thrown up or down explodes. | ignite 2 |
| 6 | Burst radius 34 to 50 px. | radius 50 |
| 7 | New: two flasks at once. | flasks 2 |
| 8 | Burst power 2.4 to 4; burns longer. | power 4, burn 4 |

Evolution **Sunflask** (partner `k_familiar`): The flask bursts, then three smaller flasks fly at nearby foes and burst on them.
Evolved values added: children 3.
Code: `spells/fire.ts`, `spells/floorFire.ts`, `spells/sunflask.ts`, `game/damage.ts` (ignition).

#### `k_frost` Ice Spikes

Spell, timed, I. Learn the ice spell: a running line of spikes that freezes foes.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | I sends a running line of ice spikes that freezes foes. | power 1.6, spikes 4, freeze 0.8, recharge 9 |
| 2 | Spikes 4 to 6. | spikes 6 |
| 3 | Spike power 1.6 to 2.4; freezes longer. | power 2.4, freeze 1.4 |
| 4 | New: a heavy blow on a frozen foe shatters it. | shatter 0.8 |
| 5 | New: foes beside the line are slowed; recharge 6.5 s. | recharge 6.5, chill 2 |
| 6 | New: frozen foes take +25% damage. | frozenBonus 0.25 |
| 7 | New: a frozen foe that dies bursts and freezes others. | burst 1 |
| 8 | Spike power 2.4 to 7; shards far stronger. | power 7, shatter 3.5 |

Evolution **Glacier Bloom** (partner `k_reap`): A second line runs behind Kael, and the last spike grows into a spire that bursts into freezing shards.
Evolved values added: bloom 1, spire 3, bloomPower 1.5.
Code: `spells/ice.ts`, `game/damage.ts` (shatter), `skills/kael/iceSpikes.ts` (death burst), `hero/kael/bonus.ts` (frozen taken).

#### `k_volt` Lightning

Spell, easy, I. Learn the lightning spell: a bolt on a foe ahead that arcs on.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | I strikes a foe ahead with a bolt that arcs to another. | power 2.5, arcs 1, arcPower 1.2, recharge 6 |
| 2 | New: the struck foe is stunned. | stun 0.5 |
| 3 | Strike power 2.5 to 3.5; arcs to 2. | power 3.5, arcs 2 |
| 4 | New: shocked foes take +20% damage. | swordBonus 0.2 |
| 5 | Arcs to 4; recharge 6 to 4.5 s. | arcs 4, recharge 4.5 |
| 6 | New: the bolt strikes twice. | twice 1 |
| 7 | New: a second bolt strikes the nearest foe behind Kael. | behind 1 |
| 8 | Strike power 3.5 to 7; arcs hit harder. | power 7, arcPower 2.5 |

Evolution **Thunderhead** (partner `k_static`): A storm cloud stays over the strike and calls down five more bolts that each arc to two foes.
Evolved values added: cloud 5, cloudArcs 2.
Code: `spells/bolt.ts`, `spells/thunderhead.ts`, `hero/kael/bonus.ts` (shocked taken).

#### `k_splinters` Crystal Splinters

Dot, easy, auto. Sword blows lodge crystal splinters that bleed. Weak at first, a crowd shredder late.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Sword blows lodge crystal splinters that bleed the foe. | per 0.05, max 3, life 3, finisher 1, crit 1 |
| 2 | A foe holds 3 to 5 splinters. | max 5 |
| 3 | Splinters bleed twice as fast. | per 0.1 |
| 4 | New: the 4th hit lodges 3 at once. | finisher 3 |
| 5 | New: a foe full of splinters passes them to foes beside it. | spread 1 |
| 6 | New: a crit lodges 2; a foe holds 8. | max 8, crit 2 |
| 7 | New: a foe that dies fires its splinters at foes near it. | burst 0.5 |
| 8 | Splinters bleed harder and last 5 s. | per 0.22, life 5 |

Evolution **Shatterstorm** (partner `k_keen`): The 4th hit and every Keen blow shatter the splinters in the foes they hit, cutting every foe around.
Evolved values added: shatter 0.5, shatterReach 70.
Code: `skills/kael/crystalSplinters.ts` on the shared stacks (`addStacks`).

#### `k_rift` Rift Wound

Dot, timed, auto. Warp strikes open rift wounds that drain the foe; each warp deepens them.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A warp strike opens a rift wound that drains the foe. | per 0.2, max 3, life 4 |
| 2 | New: wounded foes are slowed; the wound lasts 6 s. | life 6, slow 1 |
| 3 | New: the 4th hit of a string adds a layer. | finisher 1 |
| 4 | Each layer drains 0.2 to 0.5 a second. | per 0.5 |
| 5 | New: each new layer also opens on the nearest foe. | spread 1 |
| 6 | Up to 5 layers; each drains far more. | per 1.2, max 5 |
| 7 | New: each layer makes the foe take +6% damage. | taken 0.06 |
| 8 | Each layer drains 1.2 to 8 a second. | per 8 |

Evolution **Rift Collapse** (partner `k_warpcraft`): A foe at full layers collapses: the wound's damage at once, doubled, and the rift pulls foes in and wounds them.
Evolved values added: collapse 2, pull 60, give 3.
Code: `skills/kael/riftWound.ts` on the shared stacks; `hero/kael/bonus.ts` (taken per layer).

#### `k_static` Static Charge

Dot, timed, auto. Dodge through foes to charge them; they crackle, and your sword sets them off.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Foes the dodge passes through are charged and crackle. | tick 0.2, life 3 |
| 2 | Charge lasts 3 to 5 s. | life 5 |
| 3 | New: a sword blow on a charged foe calls lightning. | bolt 1.5, arc 1, arcs 1 |
| 4 | Charged foes crackle 0.2 to 0.5 a second. | tick 0.5 |
| 5 | New: the charge jumps to foes touching a charged one. | contagion 1 |
| 6 | New: a charged foe that dies arcs to foes near it. | bolt 2, death 1 |
| 7 | New: a perfect dodge charges every foe near. | perfect 1 |
| 8 | Charged foes crackle harder; lightning arcs to 3. | tick 1.2, arcs 3 |

Evolution **Overload** (partner `k_passing`): Charge never runs out, and each dodge strikes up to 8 charged foes with lightning.
Evolved values added: overload 3, overloadArcs 2, most 8, every 1.5.
Code: `skills/kael/staticCharge.ts` on the shared stacks.

#### `k_echo` Phantom Edge

Summon, precise, auto. A sword blow from behind may call a phantom of Kael that repeats the blow.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A blow from behind may call a phantom that repeats it. | chance 0.5, repeat 1, most 1, cooldown 0.4 |
| 2 | Chance 50% to 75%. | chance 0.75 |
| 3 | New: the phantom stays and repeats every blow on that foe. | stay 2 |
| 4 | Phantom blows 100% to 130%. | repeat 1.3 |
| 5 | New: the phantom's blows land from behind. | back 1 |
| 6 | New: the phantom's blows break wind-ups; always called. | chance 1, stay 3, heavy 1 |
| 7 | New: up to 2 phantoms at once. | most 2 |
| 8 | Phantom blows 130% to 220%. | repeat 2.2 |

Evolution **Phantom Host** (partner `k_mirror`): Phantoms come to any sword blow, no back blow needed, and stay on their foe repeating every blow.
Evolved values added: host 1.
Code: `skills/kael/phantomEdge.ts`, `effects/echo.ts`, `hero/phantom.ts`.

#### `k_familiar` Crystal Familiar

Summon, easy, auto. Casting may call a crystal familiar that fires homing shards.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A cast may call a crystal familiar that fires shards. | chance 0.4, life 6, every 1, power 0.3, pierce 1, most 1, cooldown 1 |
| 2 | Chance 40% to 70%. | chance 0.7 |
| 3 | New: a cast fires a volley of 2 from each familiar out. | volley 2 |
| 4 | New: shards pierce a foe. | pierce 2 |
| 5 | Familiars stay 10 s and fire faster. | life 10, every 0.7 |
| 6 | New: two familiars at once. | most 2 |
| 7 | New: shards take the element just cast. | element 1 |
| 8 | Shard power 0.3 to 0.5; fire faster. | every 0.6, power 0.5 |

Evolution **Crystal Choir** (partner `k_volt`): Three familiars, always out, and every shard arcs to another foe.
Evolved values added: every 0.8, most 3, choir 1.
Code: `skills/kael/crystalFamiliar.ts` (rebuilt: cast trigger, AP shards).

#### `k_mirror` Mirror Knight

Summon, precise, auto. A parry or a perfect dodge calls a mirror knight that warp-strikes the attacker first, then the nearest foes.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry or a perfect dodge calls a mirror knight that warp-strikes a foe. | strike 6, targets 1, cooldown 1 |
| 2 | New: Riposte: the next blow after a parry or perfect dodge deals triple. | riposte 3, ripTime 1.5, ripBlows 1 |
| 3 | Knight strike 6 to 12. | strike 12 |
| 4 | New: the knight warps through up to 2 foes. | targets 2 |
| 5 | New: the knight stuns what it strikes; Riposte covers 2 blows. | ripTime 2.5, ripBlows 2, stun 0.8 |
| 6 | New: the knight stays and copies your blows. | stay 4, copy 0.5 |
| 7 | Knight strike 12 to 30; copies at 80%. | strike 30, copy 0.8 |
| 8 | Knight strike 30 to 70; Riposte quadruple; stays 6 s. | strike 70, riposte 4, stay 6, copy 1 |

Evolution **Perfect Reflection** (partner `k_keen`): A parry or a perfect dodge stops time while Kael and the knight strike the attacker and every foe near.
Evolved values added: stay 8, reflect 150, reflectArea 15, reflectReach 120.
After a parry the knight's first warp goes to the foe that struck, so it lands with Kael's counter.
Code: `skills/kael/mirrorKnight.ts` (both triggers); Riposte after a parry in `hero/kael/guardStyle.ts`, after a perfect dodge in `hero/perfectDodge.ts`, its bonus in `meleeHit.ts` and `hero/kael/bonus.ts`.

#### `k_aegis` Crystal Aegis

Attack, precise, K. Every blow Kael blocks sets a crystal in his guard, and his next parry shatters them all at the attacker.
It pairs his light block with a stronger parry: holding the guard through a flurry stores power, and the parry spends it.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Blocked blows set crystals in the guard; a parry shatters them at the attacker. | plates 3, shard 1.2, reach 36 |
| 2 | New: blocks cost half the stamina. | half 0.5 |
| 3 | Shatter 1.2 to 2 a crystal; the guard holds 4. | shard 2, plates 4 |
| 4 | New: a parry sets one more crystal before the shatter. | parryPlate 1 |
| 5 | New: the shatter freezes what it hits for 1 s. | freeze 1 |
| 6 | New: blocked blows let no damage through. | sealed 1 |
| 7 | Shatter 2 to 3.5 a crystal; the guard holds 6. | shard 3.5, plates 6 |
| 8 | Shatter 3.5 to 6 a crystal; reach 36 to 56 px. | shard 6, reach 56 |

Evolution **Diamond Aegis** (partner `k_mirror`): Every blocked blow also throws a crystal lance back at the attacker, and the shatter throws foes high.
Evolved values added: reflect 2, launch -260.
The shatter's full blow lands on the attacker only; other foes in reach take 0.4 of it (`AEGIS_SPLASH`), the precise payoff rule.
Level 1 shatters 3.6 AD at most, level 8 36 AD (6 crystals), about 10 times.
The crystals circle Kael's sword hand, so the player sees what the next parry will spend.
Code: `hero/kael/aegis.ts` (crystals, block cost and chip, shatter), `hero/kael/guardStyle.ts`.

#### `k_spellwarp` Spellwarp

Movement, timed, J held. The warp lands with the element of the ability selected on I, and a cast right after it leaves the hand at once.
It ties the warp to the ability bar: switch to fire with O, warp in, and the foe burns before the flask even leaves the hand.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The warp lands with the selected ability's element: fire burns, ice slows, lightning shocks. | power 0.6, burn 2, chill 1.5, shock 1 |
| 2 | New: a cast just after a warp is a Spellblade cast. | window 1 |
| 3 | Element power 0.6 to 1.2. | power 1.2 |
| 4 | New: the element also strikes foes beside the one you land on. | reach 30 |
| 5 | New: that Spellblade cast costs half the MP. | half 0.5 |
| 6 | Element power 1.2 to 2; the window lasts 1.5 s. | power 2, window 1.5 |
| 7 | New: each warp takes 1 s off the selected ability's recharge. | refund 1 |
| 8 | Element power 2 to 4.5; statuses last longer. | power 4.5, burn 3, chill 2.5, shock 1.5 |

Evolution **Arcane Arrival** (partner `k_warpcraft`): Once every 3 seconds, a warp arrival also casts the selected ability for free at half power.
Evolved values added: arcaneEvery 3.
The element is AP and lands on every arrival: the warp, Rift Walker's chained arrivals, Blink Step and the parry's counter.
Crystal Lance and Crystal Burst give a plain crystal cut with no status.
Code: `hero/kael/spellwarp.ts` (element, window, refund, Arcane Arrival), `hero/spell.ts` (Spellblade after a warp, `castFree`).

#### `k_nova` Crystal Nova

Ultimate, easy, U. Crystal Nova grows: it draws foes in, then phantoms, falling stars and a storm of edges join it. Grows with attack damage.
Every part is a share of the ring's own blow at the charge level (the ring is 0.75 of the level power).

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The nova draws foes in to Kael and bursts 30% harder. | power 1.3, pull 1 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: phantoms of Kael cut 2 struck foes from behind. | phantoms 2, phantom 0.35 |
| 4 | Nova power +30% to +70%. | power 1.7 |
| 5 | New: crystal stars fall on each foe it strikes. | stars 2, star 0.5 |
| 6 | New: a storm of edges cuts every foe it struck. | edges 5, edge 0.15 |
| 7 | New: an echo nova bursts again, wider; 4 phantoms. | echo 0.5, echoes 1, phantoms 4 |
| 8 | Nova power +70% to +100%; 3 stars; phantoms cut harder. | power 2, stars 3, phantom 0.45 |

Evolution **Supernova** (partner `k_keen`): The nova bursts three times, each ring wider, and its storm of edges follows Kael for 4 seconds; every Keen blow in it adds a volley.
Evolved values added: echo 1, echoes 2, follow 4.
Budget per foe the ring strikes, in ring blows: level 8 is 2 (ring) + 1 (echo) + 1.35 (phantoms, three cuts each) + 1.5 (stars) + 0.75 (edges), about 6.6.
Supernova is 6 (three rings) + 3.6, and its storm cuts foes within 70 px for 0.2 of a ring blow every 0.2 s, up to 4 more, about 13.6 before Keen volleys.
Measured on the wave 5 boss with one charge: level 8 4.9 times the plain nova, Supernova 7.3 times while the boss stood outside the storm.
The phantoms come from Phantom Legion, the stars from Starfall, the storm from Thousand Edges and Endless Edges.
Code: `ultimates/crystalNova.ts`, `ultimates/nova/` (ring, phantoms, stars, edges, storm), `constants/kael/nova.ts`; recharge and charge speed in `hero/ultimate.ts`.

## Balance

The first draft counted far more triggers than an ordinary player makes.
The numbers in the data follow the shared play model of the balance review of 7 November 2026 (all four heroes, one model) and its rules for every hero:

- G1: hits a skill deals on its own (summons, copies, ticks, bursts, shards) use the skill id as source and never call blow or cast events, so no summon calls another.
- G2: copies (Phantom Edge, Mirror Knight, Shadow Step) repeat the move's own power (`skills/kael/copyPower.ts`) with only the base back, air and crit rules.
- G3: damage-taken bonuses (airborne, tripped, frozen, shocked, rift layers) and a mark add into one sum capped at +100% (`DAMAGE.takenCap`).
- G4: bonuses on Kael's own hits (Keen, Phase Cut's back bonus, Sky Dance's air bonus, Riposte) add into one sum; only crit, back and air multiply.
- G5: anything spread by a death or a spread (splinters, rift layers, static charge, frozen bursts) cannot pass on again for 0.5 s (`skills/kael/spreadLock.ts`).
- G6: every summon has its cooldown in its data (Phantom Edge 0.4 s, Crystal Familiar 1 s, Mirror Knight 1 s).

Model rates for Kael (ordinary player): 0.43 strings started a second, 1.27 blows landed, 0.18 last hits, 0.22 Keen blows (0.29 with the wider window), a perfect dodge every 7 s, warp 0.25 a second (0.45 with Warpcraft), a dodge through foes 0.25 a second, about 0.12 casts a second per spell.
Base Warp Strike is 1.8 AD (orchestrator decision), so the base kit sits near the other heroes.

Bands at level 8 in AD (or AP) per second on the intended target: easy 4.2, timed 6.7, precise 10.5 to 12.6; movement skills 0.8 of their band; dots 1.1 to 1.4 times the attack band of their risk.
Ultimates are measured per cast against Crystal Nova at charge 3 (5.25 AD a foe): level 8 about 6 times, evolved about 15 times.

The moveset rework (13 November 2026) added the guard, the counter, the wide forms and two skills, and cut two ultimates.
The wide forms cost 1.5 times the MP and spread the same blow wider: a foe is cut by one lance of the fan, the burst and the ice keep their damage, the fire wall burns only foes that stay in it, and the chain of bolts deals 0.6 of the bolt on each foe.
The parry's riposte, the counter and Crystal Aegis pay only on a parry, which needs a fresh press of K just as a blow lands.
Spellwarp sits at about 2 AP a second at level 8 at the model's warp rate with Warpcraft, under the movement band of 5.4.

Changes made from the review (all "must" items and the useful "suggest" items):

| Skill | Change |
| --- | --- |
| `k_keen` | Keen +200% / +500% / +1000% at levels 1, 5, 8; wave 1.5 to 10 AD; streak cap +100%; evolution every third Keen blow (counted across strings), cross cut 60 AD (330 AD on one foe since balance round 3). |
| `k_skyward` | Level 8 launch 5 AD, crash 3.5 AD; Heavenfall spike 15 AD. |
| `k_phase` | Phase cut 3.5 AD at level 1, 12 AD at level 8; back bonus +150%. |
| `k_blink` | Retagged timed; level 8 strike 7 AD. |
| `k_warpcraft` | Level 8 strike 7 AD; Rift Walker's chained arrivals do not call the warp event, so they count as one arrival for Rift Wound. |
| `k_frost` | Level 8 spikes 7 AP, shards 3.5 AD; one more new property (chill beside the line). |
| `k_volt` | Two more new properties (stun, a bolt behind); level 8 strike 7 AP, arcs 2.5 AP. |
| `k_flame` | One more new property (the burst knocks down). |
| `k_splinters` | Level 8 0.22 AD per splinter a second; Shatterstorm 0.5 AD per splinter within 70 px; one more new property (crits lodge 2). |
| `k_rift` | Level 8 2.4 AD per layer a second (8 since balance round 3); one more new property (slow); Rift Collapse's layers cannot spread or collapse again within a second. |
| `k_static` | Overload strikes at most 8 foes, at most every 1.5 s; one more new property (a charged foe that dies arcs); lightning 2 AP from level 6. |
| `k_echo` | Copies follow G2; level 8 repeat 220%; one more new property (its blows break wind-ups). |
| `k_familiar` | Rebuilt from the framework's reference summon (which was far too strong): a cast trigger, AP shards, 1 s cooldown, volleys of 2; Crystal Choir fires every 0.8 s, arcs to 1 foe and adds no volleys. |
| `k_mirror` | Strike 6 AD at level 1, 50 AD at level 8; one knight at a time, a new perfect dodge refreshes it; 1 s cooldown; Perfect Reflection 150 AD to the attacker and 40 AD within 120 px; one more new property (the knight stuns). |

Every dot stays below the attack skill of its risk on the same target at levels 1 to 4 and passes it at 7 and 8 under the model (Splinters against Reaping Sweep, Rift Wound against Phase Cut, Static Charge against Skybreaker).
These are hand estimates within about 25 percent; the growth simulation and bot runs tune them further.

The motion pass of November 2026 slowed the skill blows so each holds its wind-up, and raised their power so each keeps its damage per game second within 5 percent: the sweep 1 and 2 to 1.65 and 3.3, the phase cut 3.5, 5 and 12 to 3.85, 5.5 and 13.2, Skybreaker's launch 1.6, 2.4 and 5 to 2.65, 3.95 and 8.2, the crescent turn's cuts 0.9 to 1.32, the whirlwind's cuts 0.7 to 0.92, and the meteor drop lands at 1.33 times the stomp's power.
The hop cleave already took as long, since it now lands on its hit, and keeps its power.

## Example builds

Each has 8 skills; three evolve, steered with skips and banishes.

**Phantom duelist** (precise, one target): Keen Edge, Phase Cut, Blink Step, Phantom Edge, Mirror Knight, Crystal Aegis, Rift Wound, Crystal Nova.
Evolve Keen Edge (Phase Cut), Blink Step (Phantom Edge), Phantom Edge (Mirror Knight).
Phase and Blink put Kael behind foes; Phantom Edge feeds on that; Keen timing, parries and the counter carry the damage.
Crystal Aegis turns a boss's flurry into one big shatter, and Mirror Knight joins every parry. Boss killer, needs clean play.

**Storm caster** (easy, crowd): Fire Flask, Ice Spikes, Lightning, Crystal Familiar, Static Charge, Passing Cut, Spellwarp, Crystal Nova.
Evolve Lightning (Static Charge), Fire Flask (Crystal Familiar), Static Charge (Passing Cut).
Dodge through the crowd to charge it, warp in with the selected element, cast the wide forms into it, let the familiars and the storm cloud work. Safe and wide, lower peak.

**Sky reaver** (timed, juggle): Skybreaker, Sky Dance, Reaping Sweep, Crystal Splinters, Keen Edge, Warpcraft, Rift Wound, Crystal Nova.
Evolve Skybreaker (Sky Dance), Crystal Splinters (Keen Edge), Rift Wound (Warpcraft).
Sweep pulls foes in, the 4th hit launches them, the air string and stomp bring them down full of splinters; the warp keeps the wounds open. Splinters and Rift make the early waves slow and the late waves fast.

## Built differently from the first draft

- Phantom Host keeps two phantoms (not four): with phantoms called by any blow, four would multiply every blow by about nine.
- Passing Cut level 7 slows the foes it cuts, in place of a longer dodge, so the dodge's distance and the motion standard stay as they are.
- Blink Step keeps the combo going by holding its link window open over the arrival; the next J goes on with the string.
- Crystal Splinters and the other dots tick through the shared stacks (`addStacks`), so the end of run screen lists them by name.
- The back flip is gone; its job (get out and push a foe off) is the dodge and Crystal Burst.

## Code map

- Data: `src/constants/characters/kael/skills/` (one file per skill, rows built with `utils/skillRows.ts`).
- Kit hooks into the shared loop, all optional and left out by the other heroes: `HeroKit.shapeHit`, `keenWindow`, `alwaysKeen` (in `combo.ts`), and `registerDamageHooks` (`game/damageHooks.ts`, read in `dealDamage`).
- Kael's kit state for his skills: `src/game/hero/kael/state.ts` (Keen streak, blink recharge, phase window, Aegis crystals, Spellwarp window, Supernova's storm).
- Guard and parry: `src/game/hero/kael/guardStyle.ts`, the counter in `kael/counter.ts`, Crystal Aegis in `kael/aegis.ts`, the guard clip in `src/constants/kael/guardClip.ts`.
- Warp: `src/game/hero/kael/warpStyle.ts` (Warpcraft's thrust, Rift Walker, Spellwarp) on the shared `hero/warp.ts`.
- Behaviors on their own: `src/game/skills/kael/`.
- Abilities on I: `KAEL_SLOTS` in `src/game/hero/spell.ts` on the shared ability bar (Lance, Burst, then the element spells held), wide forms in `src/game/spells/` and `LANCE_FAN`, `WIDE_BURST`, `FIRE_WALL`, `ICE_FIELD` and `BOLT_CHAIN` in `src/constants/spells.ts`.
- Icons: `src/ui/skills/icons/kael/` (every skill, every evolution, and Kael's three damage sources).
