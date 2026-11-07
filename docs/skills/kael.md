# Kael skills

Kael's part of the skill rework (`docs/skill-design.md`).
This is a working design: numbers are starting values for the constants files.
AD and AP mean Kael's attack damage and ability power (both 10 at hero level 1, `KAEL.base`).

## Identity

Kael is the warp knight: a sword string that reads the room, a thrown sword he appears beside, a dash nothing can touch, and crystal magic.
His skills lean on what makes him different from the other three: the warp (K), back attacks, Keen timing, launches into short air strings, and spells on a rotation.
Every skill is on a single button press or runs on its own; nothing asks for a direction, a dash or a double tap during or after a combo.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The ground string, fixed at 4 hits: step cut (1.1 AD), rising backhand (1.1 AD), twin fang (0.7 + 0.8 AD), falling smash (2.2 AD, knocks down). |
| J (situation) | The string still reads the foes: turning cut (foe only behind), ring cut (foes on both sides), pinning stab (foe down, once a combo), chase cut (foe in the air ahead, starts the air string). The 4th hit is always the smash. |
| J (Keen) | J pressed in the 0.1 s after a blow lands makes the next blow a sure crit, drawn gold. Mashing spoils it. |
| J (air) | Air string of 2 per jump: wheel slash (1.2 AD), scissor cut (1.3 AD, pops the foe up). |
| K | Warp Strike: throw the sword at the nearest foe ahead and appear beside it striking, 1.8 AD plus 0.014 AD per pixel travelled (up to +2.8). 10 MP, 2 s recharge. |
| K with Up held | Crystal Hang: warp to a floating crystal and hang there to recover MP fast (14 MP/s). Unchanged from today. |
| L | Dash: 0.24 s, untouchable, ground only, two per stamina bar. A perfect dodge in its first 0.12 s slows the world and gives 8 MP, 25 stamina and 5 Flow. |
| I | Cast the selected ability. Two base abilities: Crystal Lance and Crystal Burst. |
| I during a combo | Spellblade: after the second hit, the cast leaves the hand at once with 1.5x power and ends the combo. Single button, kept from today. |
| O | Switch to the next ability in the rotation. |
| U | Crystal Nova, charged in four levels as today (75% of the level power, ring 60 to 340 px). |
| Up | Jump; Up again in the air is a double jump (base now, was a skill). |

Base abilities:

- **Crystal Lance**: a crystal crescent flies forward and cuts every foe in its line once, 2.5 AP, passes guards. 12 MP, 4 s. Reuses `createCrystalWave`.
- **Crystal Burst**: a ring of crystal around Kael, 40 px, 1.5 AP, pushes foes away. 15 MP, 6 s. An escape when cornered. Reuses `createFloorRing` and an `around` hit.

The ability rotation is Lance, Burst, then each spell skill in the order learned.

### Combo hits and the air string

- `comboHits: 4`. The string is step cut, rising backhand, twin fang, smash; hop cleave and crescent turn leave the plain string and come back as skill moves (Keen Edge, Reaping Sweep).
- Combo length never changes. Skills change hit 1 (Reaping Sweep), hit 3 (Phase Cut), hit 4 (Skybreaker, Keen Edge) or add effects to every hit.
- When two skills claim the same hit: Phase Cut wins hit 3 over the crescent turn, and a Keen 4th hit is the hop cleave (Keen Edge level 7) over Skybreaker's launch. The situational moves still take priority over all of them, as today.
- Air string limit: 2 per jump in the base kit (wheel, scissor), 3 with Sky Dance (adds the stomp). A double jump adds no air hits.

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
| Whirlwind | J after a double jump | Sky Dance level 3: picked by the situation, as today. |
| Blink Combo | K in a combo | Blink Step: kept on one button, the combo goes on after it. |
| Flowing Chain | passive | Gone (combo length is fixed). |
| Warp Strike, Double Jump, Crystal Hang | skills | Base kit. |
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
| Thousand Edges, Phantom Legion, Starfall | ultimates | Ultimate skills. |
| Tempest | ultimate | Folded into Thunderhead (the storm cloud keeps striking). |
| Keen Edge (stat), Swift Hands, Killing Intent, Berserker, Iron Will, Fleet Foot, Mana Font, Arcane Power, Archmage, Swift Sigils, Quick Cast, Siphon | passives | Dropped; Might, Haste and the other charms cover stat growth. |

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `k_keen` | Keen Edge | attack | precise | J | `k_phase` | Peerless Edge |
| `k_skyward` | Skybreaker | attack | timed | J | `k_skydance` | Heavenfall |
| `k_reap` | Reaping Sweep | attack | easy | J | `k_splinters` | Crystal Harvest |
| `k_phase` | Phase Cut | attack | timed | J | `k_blink` | Phantom Passage |
| `k_warpcraft` | Warpcraft | movement | timed | K | `k_passing` | Rift Walker |
| `k_blink` | Blink Step | movement | timed | K | `k_echo` | Shadow Step |
| `k_passing` | Passing Cut | movement | timed | L | `k_skydance` | Phantom Rush |
| `k_skydance` | Sky Dance | movement | timed | Up | `k_reap` | Comet Dance |
| `k_flame` | Fire Flask | spell | easy | I | `k_familiar` | Sunflask |
| `k_frost` | Ice Spikes | spell | timed | I | `k_reap` | Glacier Bloom |
| `k_volt` | Lightning | spell | easy | I | `k_static` | Thunderhead |
| `k_splinters` | Crystal Splinters | dot | easy | auto (J blows) | `k_keen` | Shatterstorm |
| `k_rift` | Rift Wound | dot | timed | auto (K arrival) | `k_warpcraft` | Rift Collapse |
| `k_static` | Static Charge | dot | timed | auto (L through foes) | `k_passing` | Overload |
| `k_echo` | Phantom Edge | summon | precise | auto (back blow) | `k_mirror` | Phantom Host |
| `k_familiar` | Crystal Familiar | summon | easy | auto (cast) | `k_volt` | Crystal Choir |
| `k_mirror` | Mirror Knight | summon | precise | auto (perfect dodge) | `k_keen` | Perfect Reflection |
| `k_edges` | Thousand Edges | ultimate | timed | U | `k_keen` | Endless Edges |
| `k_legion` | Phantom Legion | ultimate | easy | U | `k_echo` | Phantom Army |
| `k_starfall` | Starfall | ultimate | timed | U | `k_flame` | Cataclysm |

Counts: attack 4, movement 4, spell 3, dot 3, summon 3, ultimate 3. Risk: easy 6, timed 11, precise 3.
The Values column shows only the numbers a level changes; the data rows (`src/constants/characters/kael/skills/`) carry the whole state.

"New" in a card line marks a level that adds a property; the rest are number steps.
Damage source: hits of Kael's own press (string blows, warp, blink, dash cuts, casts, ultimates) count as `attacks`, `abilities` or `ultimate` and build Flow; ticks, summons and anything that strikes on its own use the skill id and build no Flow.

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
Evolved values added: cross 60, crossArea 15, crossReach 50, crossEvery 3, free 3.
Code: `hero/kael/keen.ts` (window, wave, streak, Peerless Edge), `hero/kael/bonus.ts` (Keen bonus), `hero/kael/shapeHit.ts` (guard break, hop cleave), `utils/comboChoice.ts`.

#### `k_skyward` Skybreaker

Attack, timed, J. The last hit of the combo launches foes into the air instead of knocking them down.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The 4th hit launches the foe high. | launch 1.6, crashReach 30 |
| 2 | New: the launch takes every foe in a tall box ahead. | wide 1 |
| 3 | Launch power 1.6 to 2.4. | launch 2.4 |
| 4 | New: launched foes take +30% damage until they land. | airBonus 0.3 |
| 5 | New: launched foes crash down on foes near them. | crash 1.2 |
| 6 | New: the launch also cuts behind Kael. | behind 1 |
| 7 | Launched foes take +60%; the crash hits harder. | airBonus 0.6, crash 2 |
| 8 | Launch and crash far stronger and wider. | launch 5, crashReach 45, crash 3.5 |

Evolution **Heavenfall** (partner `k_skydance`): At the top of each launch a crystal phantom spikes the foe back down into a shockwave.
Evolved values added: spike 15, shockReach 60.
Code: `utils/comboChoice.ts` (4th hit), `hero/kael/shapeHit.ts` (power, box), `hero/kael/bonus.ts` (airborne taken), `skills/kael/skybreaker.ts` (crash, Heavenfall).

#### `k_reap` Reaping Sweep

Attack, easy, J. The combo opens with a low sweep that trips foes and drags them into the string.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The 1st hit is a low sweep that trips foes and drags them in. | power 1, reach 34, drag 20 |
| 2 | New: the sweep reaches behind Kael too. | behind 1 |
| 3 | Reach 34 to 50 px; drags twice as far. | reach 50, drag 40 |
| 4 | New: tripped foes take +25% damage. | trip 0.25 |
| 5 | New: the 3rd hit is a crescent turn, front and back. | crescent 1 |
| 6 | New: the sweep pulls flying foes down to the floor. | flyers 1 |
| 7 | Sweep power 1 to 2; tripped foes take +40%. | power 2, trip 0.4 |
| 8 | Reach 50 to 70 px; drags them to Kael's feet. | reach 70, drag 60 |

Evolution **Crystal Harvest** (partner `k_splinters`): The sweep sends a crystal tide along the floor both ways that drags every foe it touches to Kael and lodges splinters.
Evolved values added: tide 120, tideSplinters 3.
Code: `utils/comboChoice.ts` (1st and 3rd hit), `hero/kael/shapeHit.ts` (power, reach, drag), `hero/kael/reap.ts` (flyers, Crystal Harvest tide), `hero/kael/bonus.ts` (tripped taken).

#### `k_phase` Phase Cut

Attack, timed, J. The third hit cuts through the foe and turns, so the finisher lands on its back.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The 3rd hit passes through the foe, so the 4th lands from behind. | power 3.5, reach 80 |
| 2 | New: Kael cannot be hurt in the pass, and it breaks guards. | guard 1 |
| 3 | Phase cut power 3.5 to 5. | power 5 |
| 4 | New: every foe passed through is cut. | line 1 |
| 5 | New: back attacks deal +40% for 1.5 s after a phase. | back 0.4, backTime 1.5 |
| 6 | Reach 80 to 120 px. | reach 120 |
| 7 | New: an afterimage repeats the phase cut. | echo 0.6 |
| 8 | Phase cut power 5 to 12; back attacks +150% for 2 s. | power 12, back 1.5, backTime 2 |

Evolution **Phantom Passage** (partner `k_blink`): The phase cut runs through every foe within 160 px ahead, and the finisher strikes them all from behind.
Evolved values added: reach 160, passage 1.
Code: `hero/moves/finishers.ts` (pass, guard, Phantom Passage), `hero/kael/shapeHit.ts`, `hero/kael/afterStrike.ts` (back bonus window, afterimage), `hero/kael/bonus.ts`.

#### `k_warpcraft` Warpcraft

Movement, timed, K. Warp Strike costs less, recharges faster and reaches further, and its arrival hits like a thrust.

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

Movement, timed, K. Press K during a combo to step through to the foe's back and strike.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | K during a combo blinks behind the foe and strikes. | power 1.8 |
| 2 | New: the combo goes on after the blink. | keep 1 |
| 3 | Blink strike power 1.8 to 2.8. | power 2.8 |
| 4 | New: a blink in the Keen beat is a sure crit. | keen 1 |
| 5 | New: the foe cannot turn for 1.2 s. | lock 1.2 |
| 6 | New: the blink has its own 1.2 s recharge. | recharge 1.2 |
| 7 | New: an afterimage cuts where Kael stood. | after 1.2 |
| 8 | Blink strike power 2.8 to 7; the foe cannot turn for 2 s. | power 7, lock 2 |

Evolution **Shadow Step** (partner `k_echo`): A phantom cuts from the near side as Kael blinks, and a blink that kills is free.
Evolved values added: shadow 1.
Code: `hero/readActions.ts` (K in a combo), `hero/warp.ts` `blink()` (strike, lock, afterimage, Shadow Step).

#### `k_passing` Passing Cut

Movement, timed, L. The dash cuts every foe it passes through.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The dash cuts every foe it passes through. | cut 0.8 |
| 2 | Max stamina +50: one more dash. | ; stamina +50 |
| 3 | Dash cut power 0.8 to 1.4. | cut 1.4 |
| 4 | New: the dash ends with a rising cut. | rising 1 |
| 5 | New: each foe cut gives back stamina. | refund 10 |
| 6 | New: a perfect dodge cuts for triple. | perfect 3 |
| 7 | New: foes cut are slowed for 1.5 s. | chill 1.5 |
| 8 | Dash cut power 1.4 to 4; rising cut 1 to 2. | cut 4, rising 2 |

Evolution **Phantom Rush** (partner `k_skydance`): Crystal phantoms along the dash's path cut again a moment later, and dashes cost half the stamina.
Evolved values added: rush 3, staminaCost 0.5.
Code: `hero/kael/passingCut.ts` (cuts, rising cut, refund, chill, Phantom Rush), `hero/stamina.ts` (half cost).

#### `k_skydance` Sky Dance

Movement, timed, jump. One more attack in the air, ending in a stomp, and later an air dash.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | One more air hit: a stomp that knocks foes down. | air 1, stomp 2.2, stompReach 40 |
| 2 | New: L in the air dashes, once per jump. | airDash 1 |
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
| 8 | Each layer drains 1.2 to 2.4 a second. | per 2.4 |

Evolution **Rift Collapse** (partner `k_warpcraft`): A foe at full layers collapses: the wound's damage at once, doubled, and the rift pulls foes in and wounds them.
Evolved values added: collapse 2, pull 60, give 3.
Code: `skills/kael/riftWound.ts` on the shared stacks; `hero/kael/bonus.ts` (taken per layer).

#### `k_static` Static Charge

Dot, timed, auto. Dash through foes to charge them; they crackle, and your sword sets them off.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Foes the dash passes through are charged and crackle. | tick 0.2, life 3 |
| 2 | Charge lasts 3 to 5 s. | life 5 |
| 3 | New: a sword blow on a charged foe calls lightning. | bolt 1.5, arc 1, arcs 1 |
| 4 | Charged foes crackle 0.2 to 0.5 a second. | tick 0.5 |
| 5 | New: the charge jumps to foes touching a charged one. | contagion 1 |
| 6 | New: a charged foe that dies arcs to foes near it. | bolt 2, death 1 |
| 7 | New: a perfect dodge charges every foe near. | perfect 1 |
| 8 | Charged foes crackle harder; lightning arcs to 3. | tick 1.2, arcs 3 |

Evolution **Overload** (partner `k_passing`): Charge never runs out, and each dash strikes up to 8 charged foes with lightning.
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

Summon, precise, auto. A perfect dodge calls a mirror knight that warp-strikes the nearest foe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A perfect dodge calls a mirror knight that warp-strikes a foe. | strike 6, targets 1, cooldown 1 |
| 2 | New: Riposte: the next blow after a perfect dodge deals triple. | riposte 3, ripTime 1.5, ripBlows 1 |
| 3 | Knight strike 6 to 12. | strike 12 |
| 4 | New: the knight warps through up to 2 foes. | targets 2 |
| 5 | New: the knight stuns what it strikes; Riposte covers 2 blows. | ripTime 2.5, ripBlows 2, stun 0.8 |
| 6 | New: the knight stays and copies your blows. | stay 4, copy 0.5 |
| 7 | Knight strike 12 to 30; copies at 80%. | strike 30, copy 0.8 |
| 8 | Knight strike 30 to 70; Riposte quadruple; stays 6 s. | strike 70, riposte 4, stay 6, copy 1 |

Evolution **Perfect Reflection** (partner `k_keen`): A perfect dodge stops time while Kael and the knight strike the attacker and every foe near.
Evolved values added: stay 8, reflect 150, reflectArea 15, reflectReach 120.
Code: `skills/kael/mirrorKnight.ts`; Riposte in `hero/perfectDodge.ts`, `meleeHit.ts` and `hero/kael/bonus.ts`.

#### `k_edges` Thousand Edges

Ultimate, timed, U. A storm of blades in front of you in place of Crystal Nova. Grows with attack damage. Hold U to charge up to four levels, release to strike. Higher levels cost more MP; level 4 spends a full bar.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | U becomes Thousand Edges: a storm of blades ahead. | power 1, recharge 20, charge 1 |
| 2 | Recharge 20 to 17 s. | recharge 17 |
| 3 | New: the storm pulls foes to its centre. | pull 1 |
| 4 | Power +40%. | power 1.4 |
| 5 | New: charge level 2 already reaches both sides. | both 1 |
| 6 | New: the storm lasts longer and cuts more. | longer 1 |
| 7 | Recharge 17 to 13 s; charges 30% faster. | recharge 13, charge 1.3 |
| 8 | New: a great sword falls last; power x2.5. | power 2.5, greatsword 0.5 |

Evolution **Endless Edges** (partner `k_keen`): The storm follows Kael for 4 seconds while he fights, and every Keen blow adds a volley.
Evolved values added: follow 4.
Code: `ultimates/thousandEdges.ts`; recharge and charge speed in `hero/ultimate.ts`.

#### `k_legion` Phantom Legion

Ultimate, easy, U. Phantoms of Kael appear behind foes and cut them, in place of Crystal Nova. Grows with attack damage. Hold U to charge up to four levels, release to strike. Higher levels cost more MP; level 4 spends a full bar.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | U becomes Phantom Legion: phantoms cut foes from behind. | power 0.6, recharge 20, charge 1 |
| 2 | One more phantom at each charge level. | extra 1 |
| 3 | New: each phantom repeats its cuts at half power. | repeat 0.5 |
| 4 | New: the last cut launches; power +33%. | power 0.8, launch 1 |
| 5 | New: struck foes cannot turn for 2 s. | lock 2 |
| 6 | Recharge 20 to 15 s. | recharge 15 |
| 7 | New: a phantom whose foe falls moves to the next. | hop 1 |
| 8 | Power 0.8 to 16x. | power 16 |

Evolution **Phantom Army** (partner `k_echo`): The legion stays 5 seconds, each phantom cutting again and again and moving on when its foe falls.
Evolved values added: army 5, armyEvery 0.5, power 4.5.
Code: `ultimates/phantomLegion.ts`.

#### `k_starfall` Starfall

Ultimate, timed, U. Meteors rain on the foes in reach and set the floor alight, in place of Crystal Nova. Grows with ability power. Hold U to charge up to four levels, release to strike. Higher levels cost more MP; level 4 spends a full bar.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | U becomes Starfall: meteors on the foes in reach. | power 0.9, recharge 20, charge 1 |
| 2 | New: the floor burns where meteors land. | floor 3 |
| 3 | Power +45%. | power 1.3 |
| 4 | New: meteors stun foes. | stun 0.8 |
| 5 | New: meteors throw foes up. | launch 1 |
| 6 | New: 3 more meteors fall on the densest group. | late 3 |
| 7 | Recharge 20 to 15 s. | recharge 15 |
| 8 | Power 1.3 to 12x; the floor burns longer. | power 12, floor 5 |

Evolution **Cataclysm** (partner `k_flame`): Meteors keep falling for 4 seconds on foes near Kael, each landing as a Fire Flask burst.
Evolved values added: rain 4, rainEvery 0.25.
Code: `ultimates/starfall.ts`, `spells/floorFire.ts`.

## Balance

The first draft counted far more triggers than an ordinary player makes.
The numbers in the data follow the shared play model of the balance review of 7 November 2026 (all four heroes, one model) and its rules for every hero:

- G1: hits a skill deals on its own (summons, copies, ticks, bursts, shards) use the skill id as source and never call blow or cast events, so no summon calls another.
- G2: copies (Phantom Edge, Mirror Knight, Shadow Step) repeat the move's own power (`skills/kael/copyPower.ts`) with only the base back, air and crit rules.
- G3: damage-taken bonuses (airborne, tripped, frozen, shocked, rift layers) and a mark add into one sum capped at +100% (`DAMAGE.takenCap`).
- G4: bonuses on Kael's own hits (Keen, Phase Cut's back bonus, Sky Dance's air bonus, Riposte) add into one sum; only crit, back and air multiply.
- G5: anything spread by a death or a spread (splinters, rift layers, static charge, frozen bursts) cannot pass on again for 0.5 s (`skills/kael/spreadLock.ts`).
- G6: every summon has its cooldown in its data (Phantom Edge 0.4 s, Crystal Familiar 1 s, Mirror Knight 1 s).

Model rates for Kael (ordinary player): 0.43 strings started a second, 1.27 blows landed, 0.18 last hits, 0.22 Keen blows (0.29 with the wider window), a perfect dodge every 7 s, warp 0.25 a second (0.45 with Warpcraft), a dash through foes 0.25 a second, about 0.12 casts a second per spell.
Base Warp Strike is 1.8 AD (orchestrator decision), so the base kit sits near the other heroes.

Bands at level 8 in AD (or AP) per second on the intended target: easy 4.2, timed 6.7, precise 10.5 to 12.6; movement skills 0.8 of their band; dots 1.1 to 1.4 times the attack band of their risk.
Ultimates are measured per cast against Crystal Nova at charge 3 (5.25 AD a foe): level 8 about 6 times, evolved about 15 times.

Changes made from the review (all "must" items and the useful "suggest" items):

| Skill | Change |
| --- | --- |
| `k_keen` | Keen +200% / +500% / +1000% at levels 1, 5, 8; wave 1.5 to 10 AD; streak cap +100%; evolution every third Keen blow (counted across strings), cross cut 60 AD. |
| `k_skyward` | Level 8 launch 5 AD, crash 3.5 AD; Heavenfall spike 15 AD. |
| `k_phase` | Phase cut 3.5 AD at level 1, 12 AD at level 8; back bonus +150%. |
| `k_blink` | Retagged timed; level 8 strike 7 AD. |
| `k_warpcraft` | Level 8 strike 7 AD; Rift Walker's chained arrivals do not call the warp event, so they count as one arrival for Rift Wound. |
| `k_frost` | Level 8 spikes 7 AP, shards 3.5 AD; one more new property (chill beside the line). |
| `k_volt` | Two more new properties (stun, a bolt behind); level 8 strike 7 AP, arcs 2.5 AP. |
| `k_flame` | One more new property (the burst knocks down). |
| `k_splinters` | Level 8 0.22 AD per splinter a second; Shatterstorm 0.5 AD per splinter within 70 px; one more new property (crits lodge 2). |
| `k_rift` | Level 8 2.4 AD per layer a second; one more new property (slow); Rift Collapse's layers cannot spread or collapse again within a second. |
| `k_static` | Overload strikes at most 8 foes, at most every 1.5 s; one more new property (a charged foe that dies arcs); lightning 2 AP from level 6. |
| `k_echo` | Copies follow G2; level 8 repeat 220%; one more new property (its blows break wind-ups). |
| `k_familiar` | Rebuilt from the framework's reference summon (which was far too strong): a cast trigger, AP shards, 1 s cooldown, volleys of 2; Crystal Choir fires every 0.8 s, arcs to 1 foe and adds no volleys. |
| `k_mirror` | Strike 6 AD at level 1, 50 AD at level 8; one knight at a time, a new perfect dodge refreshes it; 1 s cooldown; Perfect Reflection 150 AD to the attacker and 40 AD within 120 px; one more new property (the knight stuns). |
| `k_edges` | Level 8 power 2.5 times. |
| `k_legion` | Level 8 power 2 times; one more new property (the last cut launches). |
| `k_starfall` | Level 8 power 3 times; one more new property (meteors throw foes up). |

Every dot stays below the attack skill of its risk on the same target at levels 1 to 4 and passes it at 7 and 8 under the model (Splinters against Reaping Sweep, Rift Wound against Phase Cut, Static Charge against Skybreaker).
These are hand estimates within about 25 percent; the growth simulation and bot runs tune them further.

## Example builds

Each has 8 skills; three evolve, steered with skips and banishes.

**Phantom duelist** (precise, one target): Keen Edge, Phase Cut, Blink Step, Phantom Edge, Mirror Knight, Warpcraft, Rift Wound, Phantom Legion.
Evolve Keen Edge (Phase Cut), Blink Step (Phantom Edge), Phantom Edge (Mirror Knight).
Phase and Blink put Kael behind foes; Phantom Edge feeds on that; Keen timing and perfect dodges carry the damage. Boss killer, needs clean play.

**Storm caster** (easy, crowd): Fire Flask, Ice Spikes, Lightning, Crystal Familiar, Static Charge, Passing Cut, Reaping Sweep, Starfall.
Evolve Lightning (Static Charge), Fire Flask (Crystal Familiar), Static Charge (Passing Cut).
Dash through the crowd to charge it, cast into it, let the familiars and the storm cloud work. Safe and wide, lower peak.

**Sky reaver** (timed, juggle): Skybreaker, Sky Dance, Reaping Sweep, Crystal Splinters, Keen Edge, Warpcraft, Rift Wound, Thousand Edges.
Evolve Skybreaker (Sky Dance), Crystal Splinters (Keen Edge), Rift Wound (Warpcraft).
Sweep pulls foes in, the 4th hit launches them, the air string and stomp bring them down full of splinters; the warp keeps the wounds open. Splinters and Rift make the early waves slow and the late waves fast.

## Built differently from the first draft

- Phantom Host keeps two phantoms (not four): with phantoms called by any blow, four would multiply every blow by about nine.
- Passing Cut level 7 slows the foes it cuts, in place of a longer dash, so the dash's distance and the motion standard stay as they are.
- Blink Step keeps the combo going by holding its link window open over the arrival; the next J goes on with the string.
- Crystal Splinters and the other dots tick through the shared stacks (`addStacks`), so the end of run screen lists them by name.
- The back flip is gone; its job (get out and push a foe off) is the plain dash and Crystal Burst.

## Code map

- Data: `src/constants/characters/kael/skills/` (one file per skill, rows built with `utils/skillRows.ts`).
- Kit hooks into the shared loop, all optional and left out by the other heroes: `HeroKit.shapeHit`, `keenWindow`, `alwaysKeen` (in `combo.ts`), and `registerDamageHooks` (`game/damageHooks.ts`, read in `dealDamage`).
- Kael's kit state for his skills: `src/game/hero/kael/state.ts` (Keen streak, warp charges, blink recharge, phase window, storm).
- Behaviors on their own: `src/game/skills/kael/`.
- Abilities on I: `src/game/hero/spell.ts` on `createRotation` (Lance, Burst, then the element spells held).
- Icons: `src/ui/skills/icons/kael/` (every skill, every evolution, and Kael's three damage sources).
