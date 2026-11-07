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
| K | Warp Strike: throw the sword at the nearest foe ahead and appear beside it striking, 2.2 AD plus 0.014 AD per pixel travelled (up to +2.8). 10 MP, 2 s recharge. |
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
- When two skills claim the same hit, the later one in this order wins: Reaping Sweep (hit 1), Phase Cut (hit 3), Keen Edge's hop cleave (hit 4 when Keen), Skybreaker (hit 4). The situational moves still take priority over all of them, as today.
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
| `k_blink` | Blink Step | movement | precise | K | `k_echo` | Shadow Step |
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

Counts: attack 4, movement 4, spell 3, dot 3, summon 3, ultimate 3. Risk: easy 6, timed 10, precise 4.

"New" in a card line marks a level that adds a property; the rest are number steps.
Damage source: hits of Kael's own press (string blows, warp, blink, dash cuts, casts, ultimates) count as `attacks`, `abilities` or `ultimate` and build Flow; ticks, summons and anything that strikes on its own use the skill id and build no Flow.

### Attack

#### `k_keen` Keen Edge

Attack, precise, J. Keen blows (J in the beat after a blow lands) hit harder and gain effects; rhythm over mashing.

| Lv | Card line |
| --- | --- |
| 1 | Keen blows deal +50% damage. |
| 2 | Keen window 0.10 to 0.14 s. |
| 3 | New: a Keen blow breaks guards and staggers for 0.4 s. |
| 4 | New: a Keen blow sends a crystal wave forward, 0.8 AD, passing guards. |
| 5 | Keen damage +50% to +120%. |
| 6 | New: Keen streak: each Keen blow in a row adds +20% to the next, up to +80%. |
| 7 | New: a Keen 4th hit is the hop cleave: 3 AD overhead, knocks down, 30 px floor ring. |
| 8 | Keen damage +120% to +250%; wave 0.8 to 3 AD. |

Evolution **Peerless Edge** (partner `k_phase`): four Keen blows in one string end in a gold cross cut, 14 AD to the foe ahead and 5 AD within 50 px, and for the next 3 s every blow is Keen with no timing.

Build: `KEEN.window` and the Keen multiplier read `skillValues("k_keen")` in `combo.ts` (`judgeTiming`, `strike`); guard break sets `big` on the blow; the wave is `createCrystalWave`; the hop cleave is `CHAIN_MOVES.hopCleave` picked as the 4th hit in `comboChoice.ts`; the cross cut is a new slash shape in `KEEN_RAMP`. `combo.ts` is shared with Ysra, so every hook is a skill query, which is 0 for her.

#### `k_skyward` Skybreaker

Attack, timed, J (4th hit). The finisher launches instead of knocking down, so a string can turn into an air string; the base chase cut follows.

| Lv | Card line |
| --- | --- |
| 1 | New: the 4th hit is Skybreaker: 1.6 AD, launches the foe high. |
| 2 | New: the launch takes every foe in a tall box ahead, 40 px. |
| 3 | Launch 1.6 to 2.4 AD. |
| 4 | New: launched foes take +30% damage until they land (on top of the 2x air rule). |
| 5 | New: launched foes crash down: 1.2 AD to foes within 30 px of where each lands. |
| 6 | New: the launch also cuts behind Kael. |
| 7 | Air bonus +30% to +60%; crash 1.2 to 2 AD. |
| 8 | Launch 2.4 to 3.5 AD; crash reach 30 to 45 px. |

Evolution **Heavenfall** (partner `k_skydance`): at the top of each launch a crystal phantom spikes the foe back down, 6 AD, and a 60 px shockwave rings out where it lands.

Build: `FINISHER_MOVES.skybreaker` as hit 4 in `comboChoice.ts`; the crash is a new landing hook on airborne foes (`enemies/airborne.ts`) with `createFloorRing`; the phantom reuses the ghost snapshot from `ultimates/phantomLegion.ts`.

#### `k_reap` Reaping Sweep

Attack, easy, J (1st hit). The opener is a low sweep that trips foes and drags them into the string.

| Lv | Card line |
| --- | --- |
| 1 | New: the 1st hit is the low sweep: 1 AD, trips for 0.9 s, drags foes 20 px toward Kael. |
| 2 | New: the sweep reaches behind Kael too. |
| 3 | Reach 34 to 50 px; drag 20 to 40 px. |
| 4 | New: tripped foes take +25% from the rest of the string. |
| 5 | New: the 3rd hit becomes the crescent turn, cutting front and back. |
| 6 | New: the sweep pulls flyers within reach down to the floor. |
| 7 | Sweep 1 to 2 AD; trip bonus +25% to +40%. |
| 8 | Reach 50 to 70 px; drag 40 to 60 px. |

Evolution **Crystal Harvest** (partner `k_splinters`): the sweep sends a crystal tide 120 px each way along the floor that drags every foe it touches to Kael's feet and lodges 3 splinters in each (full splinter rules even at low splinter levels).

Build: `SKILL_MOVES.sweep` as hit 1 (with `around` from level 2); `CHAIN_MOVES.crescentTurn` as hit 3; the flyer pull reuses `gravityWell.ts`; the tide is a new floor effect drawn like the ice spike line in the crystal palette.

#### `k_phase` Phase Cut

Attack, timed, J (3rd hit). The 3rd hit passes through the foe and turns, so the finisher lands from behind.

| Lv | Card line |
| --- | --- |
| 1 | New: the 3rd hit is the phase cut: 1.8 AD, passes through to the foe's back and turns; the 4th hit lands as a back attack. |
| 2 | New: Kael cannot be hurt during the pass, and it slips past guards. |
| 3 | Phase cut 1.8 to 3 AD. |
| 4 | New: every foe passed through is cut, up to 80 px. |
| 5 | New: after a phase, back attacks deal +40% more for 1.5 s. |
| 6 | Reach 80 to 120 px. |
| 7 | New: the pass leaves an afterimage that repeats the phase cut 0.3 s later at 60%. |
| 8 | Phase cut 3 to 6 AD; back bonus +40% to +100% for 2 s. |

Evolution **Phantom Passage** (partner `k_blink`): the phase cut runs through every foe within 160 px ahead, cutting each from behind at full power, and the finisher strikes all of them from their backs at once.

Build: `FINISHER_MOVES.phaseCut` without its `finisher` flag as hit 3 (`phaseEnter`, `phaseStep`); the guard window is `MoveDef.guard`; the afterimage repeat is `createEcho`.

### Movement

#### `k_warpcraft` Warpcraft

Movement, timed, K. Warp Strike gets cheaper, faster and longer, and the arrival hits like the running thrust.

| Lv | Card line |
| --- | --- |
| 1 | Warp costs 10 to 6 MP and recharges in 2 to 1.5 s. |
| 2 | New: the arrival is a lunging thrust that drives the foe far and bounces it off walls. |
| 3 | Distance bonus 0.014 to 0.025 AD per px, cap +2.8 to +5 AD. |
| 4 | New: the thrown sword cuts every foe on its path, 1 AD. |
| 5 | New: two warp charges. |
| 6 | Recharge 1.5 to 1.1 s. |
| 7 | New: the arrival also cuts behind Kael. |
| 8 | Warp strike 2.2 to 5 AD; path cut 1 to 2.5 AD. |

Evolution **Rift Walker** (partner `k_passing`): once every 4 s, after an arrival the sword leaps on to up to 3 more foes in reach and Kael warps to each in turn, striking each at full distance power, for no extra MP.

Build: `warpCost` and `warpCooldown` in `warp.ts` read `skillValues`; the path cut is a new box check in `effects/thrownSword.ts`; the thrust uses `SKILL_MOVES.thrust`'s blow and step; charges are a count in the skill's memory.

#### `k_blink` Blink Step

Movement, precise, K during a combo. K mid-combo steps through to the foe's back and strikes, and the string goes on from there.

| Lv | Card line |
| --- | --- |
| 1 | New: K after a hit of a combo blinks behind the last foe hit and strikes, 1.8 AD, for half the warp's MP. |
| 2 | New: the combo goes on after the blink (it takes no hit from the string). |
| 3 | Blink strike 1.8 to 2.8 AD. |
| 4 | New: a blink pressed in the Keen beat is a sure crit. |
| 5 | New: the foe Kael blinks behind cannot turn for 1.2 s. |
| 6 | New: the blink has its own 1.2 s recharge, apart from the warp. |
| 7 | New: an afterimage left where Kael stood cuts once, 1.2 AD. |
| 8 | Blink strike 2.8 to 4.5 AD; no-turn time 1.2 to 2 s. |

Evolution **Shadow Step** (partner `k_echo`): each blink leaves a phantom on the near side that cuts with Kael, so the foe is struck from both sides at once, and a blink that kills is refunded.

Build: `blink()` in `warp.ts`; `pressWarp` in `readActions.ts` checks `comboOpen(1)` and stops ending the combo from level 2; the no-turn time is a new foe field read where `TURN_DELAY` is applied.

#### `k_passing` Passing Cut

Movement, timed, L. The dash cuts every foe it passes through, with no J needed.

| Lv | Card line |
| --- | --- |
| 1 | New: foes the dash passes through are cut, 0.8 AD each. |
| 2 | Max stamina +50: one more dash per bar. |
| 3 | Cut 0.8 to 1.4 AD. |
| 4 | New: the dash ends with a rising cut on the nearest foe ahead, 1 AD, popping it up. |
| 5 | New: each foe cut gives back 10 stamina. |
| 6 | New: a perfect dodge through a foe cuts it for triple. |
| 7 | Dash length +30%. |
| 8 | Cut 1.4 to 4 AD; rising cut 1 to 2 AD. |

Evolution **Phantom Rush** (partner `k_skydance`): every dash leaves a line of crystal phantoms along its path that cut again 0.25 s later (3 AD), and dashes cost half the stamina.

Build: a once-per-foe box check in `runDash` (the pattern of today's `chargeFoes`); the rising cut is `dashStrike`'s second blow, struck from `travelEnded`; stamina numbers through `stamina.ts`. `dash.ts` is Kael's; other heroes have their own L.

#### `k_skydance` Sky Dance

Movement, timed, Up. The air game: a third air hit, an air dash, and a stomp that grows into the meteor drop.

| Lv | Card line |
| --- | --- |
| 1 | New: air string 2 to 3 hits; the 3rd is the sky stomp, 2.2 AD, knocking down both sides. |
| 2 | New: jump dash: L in the air, once per jump. |
| 3 | New: after a double jump the first air hit is the whirlwind, cutting both sides and keeping foes up. |
| 4 | Air hits +30%. |
| 5 | New: the stomp drags every airborne foe within 60 px down with Kael. |
| 6 | New: the stomp lands as the meteor drop: 46 px ring that bounces foes up for a fresh launch. |
| 7 | Stomp reach 40 to 60 px; air hits +30% to +60%. |
| 8 | Stomp 2.2 to 4 AD. |

Evolution **Comet Dance** (partner `k_reap`): every air hit drops a crystal shard on the foe below (1.5 AD), and the stomp is a comet: 90 px ring, 8 AD, drawing foes in to its centre.

Build: `AIR_STRING.skill` becomes `k_skydance` (`airLimit` from `skillLevel`); air dash is the air branch of `tryDash`; whirl and meteor moves already exist in `moves/air.ts`; the drag is `gravityWell.ts`.

### Spell

#### `k_flame` Fire Flask

Spell, easy, I. A flask that bursts and sets foes burning.

| Lv | Card line |
| --- | --- |
| 1 | New: learn Fire Flask: 1.6 AP burst, 34 px, burns 1.5 s. 18 MP, 10 s. |
| 2 | Burst 1.6 to 2.4 AP. |
| 3 | New: the burst leaves burning floor for 2 s. |
| 4 | Recharge 10 to 7 s; burn 1.5 to 3 s. |
| 5 | New: a burning foe that is launched or knocked down explodes, 2 AP within 34 px. |
| 6 | Radius 34 to 50 px. |
| 7 | New: two flasks in a short spread. |
| 8 | Burst 2.4 to 4 AP; burn 3 to 4 s. |

Evolution **Sunflask** (partner `k_familiar`): today's Sunflask: a white flask whose burst throws three child flasks at nearby foes, each 50% of the burst.

Build: `spells/fire.ts`, `explosion.ts`, `sunflask.ts` with numbers from `skillValues`; Ignition code from today's fusion.

#### `k_frost` Ice Spikes

Spell, timed, I. A running line of spikes that freezes; it pays when the crowd is lined up.

| Lv | Card line |
| --- | --- |
| 1 | New: learn Ice Spikes: 4 spikes ahead, 1.6 AP each foe, freezes 0.8 s. 18 MP, 9 s. |
| 2 | Spikes 4 to 6. |
| 3 | Damage 1.6 to 2.4 AP; freeze 0.8 to 1.4 s. |
| 4 | New: a heavy blow on a frozen foe shatters it: double damage, and shards cut foes within 42 px for 0.8 AD. |
| 5 | Recharge 9 to 6.5 s. |
| 6 | New: frozen foes take +25% from everything. |
| 7 | New: a frozen foe that dies bursts, 1 AP within 36 px, freezing those foes 0.6 s. |
| 8 | Damage 2.4 to 4 AP; shards 0.8 to 2 AD. |

Evolution **Glacier Bloom** (partner `k_reap`): today's Glacier Bloom (a second line behind Kael and a crown spire), with the spire's burst at 3 AP and every spike at 1.5x.

Build: `spells/ice.ts`; Shatter moves from `damage.ts`'s perk check to a skill query.

#### `k_volt` Lightning

Spell, easy, I. A bolt strikes the nearest foe ahead and arcs on.

| Lv | Card line |
| --- | --- |
| 1 | New: learn Lightning: 2.5 AP on a foe ahead, arcs to 1 more for 1.2 AP, shocks 0.6 s. 18 MP, 6 s. |
| 2 | Arcs 1 to 2. |
| 3 | Strike 2.5 to 3.5 AP. |
| 4 | New: shocked foes take +20% from sword blows. |
| 5 | Arcs 2 to 4. |
| 6 | New: the bolt strikes twice, 0.3 s apart. |
| 7 | Recharge 6 to 4 s. |
| 8 | Strike 3.5 to 5 AP; arcs 1.2 to 1.5 AP. |

Evolution **Thunderhead** (partner `k_static`): today's storm cloud over the strike, now with 5 follow-up bolts that each arc to 2 foes (Tempest's idea folded in).

Build: `spells/bolt.ts`, `lightning.ts`, `thunderhead.ts`.

### Damage over time

#### `k_splinters` Crystal Splinters

Dot, easy, runs on its own (sword blows). Blows lodge crystal splinters that bleed; weak early, a crowd shredder late.

| Lv | Card line |
| --- | --- |
| 1 | New: each sword blow lodges a splinter (3 per foe, 3 s): 0.05 AD per splinter per second. |
| 2 | Splinters per foe 3 to 5. |
| 3 | Per splinter 0.05 to 0.1 AD/s. |
| 4 | New: the 4th hit lodges 3 at once. |
| 5 | New: a foe full of splinters passes one to each foe within 30 px every second. |
| 6 | Splinters per foe 5 to 8; per splinter 0.1 to 0.2 AD/s. |
| 7 | New: a foe that dies with splinters fires them at foes within 40 px, 0.5 AD each. |
| 8 | Per splinter 0.2 to 0.35 AD/s; lasting 3 to 5 s. |

Evolution **Shatterstorm** (partner `k_keen`): the 4th hit and every Keen blow shatter the splinters in the foes they hit: 1.2 AD per splinter to that foe and to every foe within 40 px; splinters then grow back from the next blows.

Build: new `src/game/skills/kael/splinters.ts` listening to blow landed; splinter count and timer per foe in the skill's memory keyed by foe; small crystal shards drawn on the foe; ticks through `dealDamage(..., { dot: true, source: "k_splinters" })`.

#### `k_rift` Rift Wound

Dot, timed, runs on its own (warp arrival). The warp strike opens a rift in the foe; each warp deepens it.

| Lv | Card line |
| --- | --- |
| 1 | New: a warp strike opens a rift wound: 0.2 AD/s per layer for 4 s, up to 3 layers. |
| 2 | Wound lasts 4 to 6 s. |
| 3 | New: the 4th hit of a string adds a layer to the foe it hits. |
| 4 | Per layer 0.2 to 0.5 AD/s. |
| 5 | New: each new layer also lands on the nearest other foe within 40 px. |
| 6 | Layers 3 to 5; per layer 0.5 to 1.2 AD/s. |
| 7 | New: each layer makes the foe take +6% from everything Kael deals. |
| 8 | Per layer 1.2 to 1.6 AD/s. |

Evolution **Rift Collapse** (partner `k_warpcraft`): a foe at full layers collapses: it takes the wound's remaining damage at once, doubled, then the rift pulls foes within 60 px together and gives each 3 layers.

Build: new `src/game/skills/kael/rift.ts` listening to warp and blow landed; reuses `effects/rift.ts` for the drawing and `gravityWell.ts` for the pull.

#### `k_static` Static Charge

Dot, timed, runs on its own (dash through foes). Foes Kael dashes through are charged and crackle; his sword sets them off.

| Lv | Card line |
| --- | --- |
| 1 | New: foes the dash passes through are charged for 3 s: 0.2 AP/s. |
| 2 | Charge 3 to 5 s. |
| 3 | New: a sword blow on a charged foe calls lightning on it, 1.5 AP, arcing to 1 more for 1 AP (once per 2 s per foe). |
| 4 | Tick 0.2 to 0.5 AP/s. |
| 5 | New: the charge jumps to any foe touching a charged one, once a second. |
| 6 | Tick 0.5 to 0.8 AP/s; lightning 1.5 to 2.5 AP. |
| 7 | New: a perfect dodge charges every foe within 60 px. |
| 8 | Tick 0.8 to 1.2 AP/s; arcs 1 to 3. |

Evolution **Overload** (partner `k_passing`): charge no longer runs out, and each dash strikes every charged foe on screen with lightning, 3 AP each, arcing to 2 more (at most once per 1.5 s).

Build: today's `e.charged`, `discharge()` in `meleeHit.ts` and `createLightning` move into `src/game/skills/kael/static.ts`, listening to dash, perfect dodge and blow landed. The lightning from a sword blow counts as `attacks`; ticks use `k_static`.

### Summon

#### `k_echo` Phantom Edge

Summon, precise, back blow. A blow from behind calls a phantom of Kael that repeats it (today's Phantom Edge and the Echo Blade relic).

| Lv | Card line |
| --- | --- |
| 1 | New: a sword blow from behind has a 50% chance to call a phantom that repeats it 0.3 s later. At most once per 0.4 s. |
| 2 | Chance 50% to 75%. |
| 3 | New: the phantom stays 2 s and repeats every blow Kael lands on that foe. |
| 4 | Repeat power 100% to 130%. |
| 5 | New: the phantom's blows count as back attacks (1.5x). |
| 6 | Chance 75% to 100%; stays 2 to 3 s. |
| 7 | New: up to 2 phantoms at once. |
| 8 | Repeat power 130% to 180%. |

Evolution **Phantom Host** (partner `k_mirror`): up to 4 phantoms gather behind Kael's target and repeat every blow without needing a back blow; when the foe dies they move to the next one.

Build: `effects/echo.ts`; the phantom is drawn from the ghost snapshot in `phantomLegion.ts`; the "blow landed" event needs a back-attack flag.

#### `k_familiar` Crystal Familiar

Summon, easy, ability cast. A cast may call a crystal familiar that fires homing shards (the Seeker Wisp relic, themed to Kael).

| Lv | Card line |
| --- | --- |
| 1 | New: each cast has a 40% chance to call a familiar for 6 s that fires a shard at the nearest foe every 1 s, 0.8 AP. At most once per 1 s. |
| 2 | Chance 40% to 70%. |
| 3 | Shard 0.8 to 1.1 AP. |
| 4 | New: shards pierce one foe. |
| 5 | Stays 6 to 10 s; fires every 1 to 0.7 s. |
| 6 | New: two familiars at once. |
| 7 | New: the familiar takes the element just cast: fire shards burn 1 s, ice shards chill, lightning shards arc to one more. |
| 8 | Shard 1.1 to 1.4 AP; fires every 0.7 to 0.6 s. |

Evolution **Crystal Choir** (partner `k_volt`): three familiars, always out, firing every 0.35 s, and every shard arcs to 2 foes.

Build: port `relics/wisp.ts` into `src/game/skills/kael/familiar.ts` (the relic code is being removed); listens to ability cast, which Spellblade and base abilities also emit.

#### `k_mirror` Mirror Knight

Summon, precise, perfect dodge. A perfect dodge calls a mirror knight that warp-strikes; Riposte comes back here.

| Lv | Card line |
| --- | --- |
| 1 | New: a perfect dodge calls a mirror knight that warp-strikes the nearest foe, 4 AD. |
| 2 | New: Riposte: Kael's next sword blow within 1.5 s deals triple and breaks guards. |
| 3 | Mirror strike 4 to 7 AD. |
| 4 | New: the knight warps on to strike up to 3 foes. |
| 5 | Riposte lasts 1.5 to 2.5 s and covers 2 blows. |
| 6 | New: the knight stays 4 s and fights beside Kael, copying his blows at 50%. |
| 7 | Mirror strike 7 to 11 AD; copies at 50% to 80%. |
| 8 | Mirror strike 11 to 15 AD; Riposte triple to quadruple; copies at 100% for 6 s. |

Evolution **Perfect Reflection** (partner `k_keen`): a perfect dodge stops time around Kael for 0.6 s while he and the knight strike every foe within 120 px, 20 AD each; the knight then stays 8 s.

Build: `perfectDodge.ts` emits the perfect dodge event; Riposte uses `hero.riposte` and `RIPOSTE`; the knight is a ghost figure (`ghostCanvas`) moving with `createWarpLine`.

### Ultimate

All three replace Crystal Nova on U and keep the four charge levels (`ULT_LEVELS`), with their power scaled by the skill's level row.

#### `k_edges` Thousand Edges

Ultimate, timed, U. A storm of blades ahead; huge on whatever is in front.

| Lv | Card line |
| --- | --- |
| 1 | New: U becomes Thousand Edges: blades ahead, both sides at charge 3, the screen at 4. 1.0x level power. |
| 2 | Recharge 20 to 17 s. |
| 3 | New: the storm pulls foes toward its centre. |
| 4 | Power 1.0x to 1.4x. |
| 5 | New: charge level 2 already reaches both sides. |
| 6 | New: the storm lasts 0.6 s longer and hits 3 more times. |
| 7 | Recharge 17 to 13 s; charging 30% faster. |
| 8 | New: a great sword falls last, 50% of the level power again to all in reach; power 1.4x to 2x. |

Evolution **Endless Edges** (partner `k_keen`): the storm follows Kael for 4 s while he keeps fighting, and every Keen blow in that time adds a volley.

Build: `ultimates/thousandEdges.ts`.

#### `k_legion` Phantom Legion

Ultimate, easy, U. Phantoms appear behind foes and cut them from their blind side.

| Lv | Card line |
| --- | --- |
| 1 | New: U becomes Phantom Legion: a phantom behind each of 2, 4, 8 or all foes by charge, 3 cuts each, 0.6x level power. |
| 2 | One more phantom at each charge level. |
| 3 | New: each phantom repeats its cuts once at half power. |
| 4 | Power 0.6x to 0.8x. |
| 5 | New: struck foes cannot turn for 2 s. |
| 6 | Recharge 20 to 15 s. |
| 7 | New: a foe a phantom kills sends that phantom on to the nearest foe. |
| 8 | Power 0.8x to 1.0x. |

Evolution **Phantom Army** (partner `k_echo`): the legion stays 5 s, each phantom cutting every 0.5 s and moving to a new foe when its own falls.

Build: `ultimates/phantomLegion.ts`.

#### `k_starfall` Starfall

Ultimate, timed, U, grows with AP. Meteors on the foes in reach; best into a packed group.

| Lv | Card line |
| --- | --- |
| 1 | New: U becomes Starfall: meteors on foes in reach, 0.9x level power on AP. |
| 2 | New: burning floor where meteors land, 3 s. |
| 3 | Power 0.9x to 1.3x. |
| 4 | New: meteors stun for 0.8 s. |
| 5 | Reach of each charge level +40 px. |
| 6 | New: 3 more meteors fall on the densest group 0.5 s later. |
| 7 | Recharge 20 to 15 s. |
| 8 | Power 1.3x to 2x; floor burn 3 to 5 s. |

Evolution **Cataclysm** (partner `k_flame`): meteors keep falling for 4 s on foes near Kael, and each lands as a Fire Flask burst at the flask's level.

Build: `ultimates/starfall.ts`, `densestSpot.ts`.

## Balance

### Assumptions

All numbers at hero level 1 (AD 10, AP 10), no charms, no Flow, 5% base crit ignored except where a skill uses crits.
Rates of ordinary play, taken from the clips and constants:

- The 4-hit string takes about 1.25 s (step cut and backhand 0.23 s each with the wind-up slow, twin fang 0.28 s, smash 0.5 s) plus 0.5 s combo cooldown. With dodging and walking back in, one string every 2.5 s: 0.4 strings/s, 2 blows/s, 5.9 AD per string, about 24 DPS on one foe.
- A string blow hits 2.5 foes of a crowd of 6 on average; a ring or burst hits 4; a line hits 3.
- MP comes in at about 6 per second (2 regen, 2 per blow landed), which caps warps and casts. A warp lands every 4 s (base), a cast every 5 to 6 s.
- Dashes 0.5/s, through a foe 0.3/s. A skilled player lands 1.2 Keen blows/s and a perfect dodge every 3 s from mid waves on; precise numbers assume that player.
- Ultimates are averaged over their recharge at charge level 3.
- Base kit: about 36 DPS on one foe (string 24, warp 9, Lance 3) and about 95 on a crowd (string 59, warp 15, Lance 9, Burst 5, Nova 6).

Budget anchor: an easy skill at level 8 adds about 50 DPS on its intended target (twice the base string on one foe).
So timed is about 80 and precise about 125 to 150.
Each number below is the DPS the skill adds on top of the base kit.

### Damage per second

| Skill | Risk | Intended | L1 one | L1 crowd | L8 one | L8 crowd | Evolved one | Evolved crowd | Basis |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `k_keen` | precise | one | 13 | 20 | 125 | 230 | 310 | 480 | 1.2 Keen blows/s at 2.1 AD; L8 adds streak, 3 AD wave, hop cleave; evo cross cut every string and always Keen 3 s of 2.5. |
| `k_skyward` | timed | crowd | 10 | 14 | 50 | 85 | 110 | 200 | 0.4 launches/s; launch plus chase and 2 air hits at 2x; L8 crash on 3 foes; evo 6 AD spike x2 air plus ring. |
| `k_reap` | easy | crowd | 3 | 7 | 22 | 50 | 45 | 110 | 0.4 sweeps/s; pulls one more foe into each blow; evo tide drags the whole crowd. |
| `k_phase` | timed | one | 7 | 10 | 75 | 110 | 150 | 300 | 0.4 phases/s; back smash 1.5x then +100%; afterimage; next string's first blows still from behind. |
| `k_warpcraft` | timed | one | 4 | 6 | 66 | 110 | 90 | 200 | 0.75 warps/s at L8 (charges, 1.1 s, 6 MP); 7.5 AD strike plus 2.5 AD path cut. |
| `k_blink` | precise | one | 11 | 13 | 115 | 140 | 290 | 360 | 2 blinks per string at L8, 6.75 AD from behind, Keen crit; no-turn keeps 3 blows back. |
| `k_passing` | timed | crowd | 2 | 5 | 30 | 80 | 70 | 180 | 0.5 dashes through foes/s; 4 AD on 3 foes plus rising cut at L8; evo phantoms cut again and 0.8 dashes/s. |
| `k_skydance` | timed | crowd | 6 | 12 | 40 | 80 | 100 | 200 | one jump string per 2.5 s at L8 (air dash); 3 air hits plus 4 AD stomp on 2.5 foes. |
| `k_flame` | easy | crowd | 2.5 | 7 | 18 | 55 | 35 | 120 | one cast per recharge; burst plus burn on 3 foes (L1) and 4.5 foes with 2 flasks (L8). |
| `k_frost` | timed | crowd | 2 | 6 | 12 | 65 | 30 | 150 | line catches 3 to 4; shatter on the smash; +25% while frozen. Slightly under budget, paid in crowd control. |
| `k_volt` | easy | crowd | 4 | 6 | 25 | 55 | 50 | 110 | strike plus arcs, twice per cast at L8, every 4 s. |
| `k_splinters` | easy | crowd | 1.5 | 3 | 30 | 70 | 70 | 220 | 2 blows/s keep foes full; 8 x 0.35 AD/s per foe at L8 on 2.5 foes; evo 8 x 1.2 AD shatter every string. |
| `k_rift` | timed | one | 2 | 3 | 95 | 150 | 220 | 350 | layers from warps and finishers, 5 held on an elite or boss at L8; +30% taken. |
| `k_static` | timed | crowd | 1 | 3 | 25 | 95 | 60 | 220 | 4 charged foes at L8 at 8 AP/s tick plus 2.5 AP lightning per 2 s each. |
| `k_echo` | precise | one | 9 | 12 | 130 | 170 | 330 | 420 | 1 back blow/s (with Phase Cut or Blink Step); L8 two phantoms repeat every blow at 180% from behind. |
| `k_familiar` | easy | one | 4 | 5 | 47 | 60 | 110 | 150 | full uptime from L5; two familiars at 1.4 AP every 0.6 s at L8. |
| `k_mirror` | precise | one | 13 | 20 | 127 | 200 | 350 | 600 | 1 perfect dodge per 3 s: 15 AD strike, 2 quadruple blows, 6 s of copied string. |
| `k_edges` | timed | crowd | 4 | 14 | 16 | 90 | 40 | 180 | 7 AD per foe per cast at 1x, 13 s recharge and 2.5x content at L8. |
| `k_legion` | easy | crowd | 3 | 15 | 10 | 63 | 30 | 130 | all 6 foes reached at charge 3; cuts from behind; 15 s recharge at L8. |
| `k_starfall` | timed | crowd | 4 | 12 | 16 | 85 | 40 | 180 | as Thousand Edges on AP. |

### Budget check

- Easy, L8 on intended: 50 (Reaping Sweep), 55 (Fire Flask, Lightning), 47 (Familiar), 63 (Legion). On target.
- Timed, L8 on intended: 75 to 90 for most; Warpcraft (66) and Ice Spikes (65) sit a little low because they also carry mobility and freezing.
- Precise, L8 on intended: 115 to 130, which is 2.3 to 2.6 times easy. On the low edge of the 2.5 to 3 band; the evolutions (290 to 350) restore the gap.
- Level 8 against level 1 on the intended target: 6x to 10x for the attacks, movement and summons; the spells reach 7x to 11x, the dots 20x to 50x, which is the point of a dot.
- Dots against the attack skill of the same risk on the same target:

| Level | Splinters (easy, crowd) | Reaping Sweep | Rift Wound (timed, one) | Phase Cut | Static Charge (timed, crowd) | Skybreaker |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 7 | 2 | 7 | 3 | 14 |
| 4 | 12 | 26 | 15 | 35 | 25 | 40 |
| 7 | 50 | 44 | 75 | 65 | 75 | 70 |
| 8 | 70 | 50 | 95 | 75 | 95 | 85 |

Below at 1 to 4, above at 7 and 8, as the contract asks.

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

## Notes for the build

- Kael's skill code reads only `skillLevel`, `skillEvolved` and `skillValues` with `k_` ids, which are 0 for the other heroes. Shared files (`combo.ts`, `meleeHit.ts`, `damage.ts`) gain skill queries in place of perk checks and keep their defaults, so Ysra, Sable and Hulda play the same.
- Kael-only files (`comboChoice.ts`, `readActions.ts`, `warp.ts`, `dash.ts`, `jump.ts`, `spell.ts`) carry the button changes.
- No new moves are needed; every move used already has a clip (`sweep`, `hopCleave`, `crescent`, `phase`, `skyRend`, `thrust`, `dashCut`, `airStomp`, `spin`, `plunge`). New effects: the gold cross cut, the crystal tide, the comet ring, splinter and rift marks on foes, the mirror knight and the familiar.
- Events the kit needs from `src/game/skills/events.ts`: blow landed with the move id, finisher flag, Keen flag and back-attack flag; warp arrival with the foe; dash with the foes passed through; perfect dodge; ability cast with the element.
