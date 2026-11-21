# Calder skills

Calder's part of the skill contract (`docs/skill-design.md`).
Numbers are the values in `src/heroes/calder/constants/skills/`; the card lines are the game's own.
AD and AP mean Calder's attack damage and ability power (11 and 9 at hero level 1, `CALDER.base`).
The design note is `docs/heroes/calder.md`.


## Drill set

Solo Adventure runs base Calder on the shared drill engine and all 20 skills upgrade a drill mechanic (`docs/skill-design.md`, "Drill baseline").
Rows keep the native numbers and add the drill's under `drill.` (`constants/skills/drillLevels.ts`); drill code is in `src/heroes/calder/game/drill/skills/`.
The native behaviours of the redesigned skills run only outside the drill (`game/skills/nativeOrDrill.ts`).
The DoT and summon skills answer the rounds the drill fires, so they keep their native rows.

| Id | Name | Mechanic | Level 1 | Levels 2 to 8 | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| `ca_trigger` | Hair Trigger | first slash | the first cut fires a round | stagger, hot rounds, the second cut fires too, a mark, round up to 4 AD | Dead Center (`ca_speedload`): every round-firing cut fires twice |
| `ca_vent` | Vent Blast | second slash | the second cut vents a blast ahead | knockback, burn, reach, a vent behind, up to 5 AD | Furnace Vent (`ca_brass`): every cut vents |
| `ca_breech` | Breech Slam | third slash | third cut +50% | a floor quake, stagger, a second hot round, reach 70, up to +400% | Faultline (`ca_blastjump`): a fault line bursts four times ahead |
| `ca_ricochet` | Ricochet | air slash | air cuts fire a round | ricochets, one more air cut, stagger, up to 4 AD | Pinball (`ca_tracer`): six ricochets |
| `ca_pointblank` | Point Blank | guard and parry | parry window +30% | a parry counter round, block rounds, stagger, hot counter, up to 12 AD | Deadeye (`ca_trigger`): counters fire down the line |
| `ca_recoil` | Recoil Dash | dash | dashing through foes fires rounds | pop-up, an air dash, air dash refund, hot rounds, up to 3.2 AD | Backfire Rush (`ca_vent`): a blast behind each dash |
| `ca_tracer` | Tracer Warp | warp strike | recharge -15%, damage +30% | a cutting tracer, stagger, air refresh, recharge -45%, damage +300% | Green Line (`ca_ricochet`): the tracer fires a round into each foe |
| `ca_speedload` | Speed Loader | warp and shells | an arrival loads the selected shell for 1 hit | faster loading up to 50%, an arrival shortens loading, more hits, an arrival burst | Spin Cycle (`ca_drum`): every arrival readies the shell |
| `ca_drum` | Drum Cylinder | dash and air dash | one more air dash | untouchable dashes, air dash restores the air cut, up to 3 more air dashes, a live round left behind | Bottomless Drum (`ca_speedload`): every dash recharges the warp |
| `ca_blastjump` | Blast Jump | jump and air | one more air cut | a floor blast on jumps, stagger, an air dash, a third air cut, up to 5 AD | Skyshot (`ca_breech`): hard landings blast 70 px |
| `ca_flare` | Phosphor Shell | Phosphor Shell | +50% and burns | spreading fire, flares on burning foes, a second shell, up to +500% | Greenfire Barrage (`ca_scorch`): each blast throws three more |
| `ca_chainshot` | Chain Shot | Chain Shot | +50% and one more arc | longer shock, more arcs, arcing infused cuts, stagger, up to +500% | Reaper Chain (`ca_ricochet`): strikes twice |
| `ca_charge` | Blast Charge | Blast Charge | +50% and throws foes | guard break, a second charge, stagger, charges planted by infused cuts, up to +500% | Demolition (`ca_tracer`): four hot rounds round the blast |
| `ca_shrapnel` | Shrapnel | dot on every round | as in the native kit | as in the native kit | as in the native kit |
| `ca_scorch` | Scorch Rounds | dot on the trigger round | as in the native kit | as in the native kit | as in the native kit |
| `ca_brass` | Hot Brass | dot on every sixth round | as in the native kit | as in the native kit | as in the native kit |
| `ca_turret` | Spare Barrel | summon on parries | as in the native kit | as in the native kit | as in the native kit |
| `ca_double` | Smoke Double | summon on trigger rounds | as in the native kit | as in the native kit | as in the native kit |
| `ca_hound` | Scrap Hound | summon on kills | as in the native kit | as in the native kit | as in the native kit |
| `ca_break` | Cylinder Break | the four charged tiers | charged skills +30% | faster charge, extra hot rounds, reach, stagger, up to +250% | Last Cylinder (`ca_trigger`): two more bursts |

Count by mechanic: 4 slash skills, 1 guard skill, 4 warp and dash skills, 1 jump skill, 3 spell skills, 3 damage over time, 3 summons, 1 charged-tier skill.

## Identity

Calder is the trigger blade: a heavy three-blow string, a round fired into the wound on the beat (the Trigger), a chamber of six rounds that reloads on J, a parry that answers with a counter shot, and shots on I.
His skills lean on the Trigger, the reload, the parry, his rounds and his shells.
Nothing asks for a direction, a dash or a double tap during or after a combo.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The ground string, 3 blows, the same wherever the foes stand: Hew (1.45 AD), Rip (1.5 AD), Breaker (2.8 AD, knocks down). |
| J (Trigger) | J pressed in the 0.1 s after a blow lands makes the next blow a sure crit, and a round goes off in the wound: 1.2 AD on the struck foe and 0.5 AD within 18 px. Spends 1 round; an empty chamber clicks. |
| J (empty chamber) | Reload, 0.6 s. A J pressed while the cylinder glints (0.16 to 0.3 s into it) is a quick reload: the cylinder snaps shut at once and the rounds are hot, half again as strong, until the chamber empties. |
| J (air) | Air string of 2: Air hew (1.6 AD), Drop cut (1.9 AD, falls and drives foes down). |
| J held | The shared warp; with a round loaded, the arrival fires it for 0.35 AD. |
| K | Guard on the blade's spine: 25% through, 14 stamina a block. |
| K (parry) | Counter shot: 2 AD point-blank, staggers 1 s, loads 2 rounds, and the next J is a Trigger. |
| L | The shared dodge. |
| I | Slug Shot (1 round, 3.5 s): pierces the line, 2.4 AP. Scatter Blast (2 rounds, 5 s): 2 AP to every foe within 46 px ahead and a hop back. Cast just after a blow lands, the shot skips its aim. |
| I held | Breaker Slug (2 rounds, 1.3 times, breaks guards, drives foes back) or Twin Scatter (3 rounds, fore and back). Shells: 1.5 times the MP. |
| O | Switch ability: slug, scatter, then the shells learned. |
| U | Cylinder Break: 3 cuts plus one per round in the chamber, each 0.12 of the charge level's power to every foe in reach (50, 75, 110 px, the screen); hot rounds 1.5 times. The chamber reloads hot after it. |
| Up | Jump; Up again in the air is a double jump. |

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `ca_trigger` | Hair Trigger | attack | precise | J | `ca_speedload` | Dead Center |
| `ca_breech` | Breech Slam | attack | timed | J | `ca_blastjump` | Faultline |
| `ca_vent` | Vent Blast | attack | easy | J | `ca_brass` | Furnace Vent |
| `ca_pointblank` | Point Blank | attack | precise | K | `ca_trigger` | Deadeye |
| `ca_speedload` | Speed Loader | attack | timed | J | `ca_drum` | Spin Cycle |
| `ca_ricochet` | Ricochet | attack | timed | auto | `ca_tracer` | Pinball |
| `ca_recoil` | Recoil Dash | movement | timed | L | `ca_vent` | Backfire Rush |
| `ca_tracer` | Tracer Warp | movement | timed | J | `ca_ricochet` | Green Line |
| `ca_blastjump` | Blast Jump | movement | timed | Up | `ca_breech` | Skyshot |
| `ca_flare` | Phosphor Shell | spell | easy | I | `ca_scorch` | Greenfire Barrage |
| `ca_chainshot` | Chain Shot | spell | timed | I | `ca_ricochet` | Reaper Chain |
| `ca_charge` | Blast Charge | spell | timed | I | `ca_tracer` | Demolition |
| `ca_shrapnel` | Shrapnel | dot | easy | auto | `ca_vent` | Shrapnel Storm |
| `ca_scorch` | Scorch Rounds | dot | timed | auto | `ca_flare` | Phosphor Heart |
| `ca_brass` | Hot Brass | dot | easy | auto | `ca_speedload` | Brass Rain |
| `ca_turret` | Spare Barrel | summon | precise | K | `ca_pointblank` | Gun Nest |
| `ca_double` | Smoke Double | summon | precise | auto | `ca_pointblank` | Gunsmoke Gallery |
| `ca_hound` | Scrap Hound | summon | easy | auto | `ca_drum` | Scrap Pack |
| `ca_drum` | Drum Cylinder | passive | easy | auto | `ca_speedload` | Bottomless Drum |
| `ca_break` | Cylinder Break | ultimate | easy | U | `ca_trigger` | Last Cylinder |

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1. Risk: easy 7, timed 9, precise 4.
The Values column shows only the numbers a level changes; the data rows carry the whole state.
"New" in a card line marks a level that adds a property.
In the Code lines, a file name is under `src/heroes/calder/game/`.
Damage source: hits carried by Calder's own press (string blows, Triggers, the warp's round, the counter shot, dodge rounds, shots, shells, the ultimate) count as `attacks`, `abilities` or `ultimate`; ticks, ricochets, summons and the Green Line use the skill id.

#### `ca_trigger` Hair Trigger

Attack, precise, J. A Trigger's round hits far harder on the foe the blow struck.

Values: `bonus` added share of a Trigger's blast on the struck foe, `window` seconds after a blow lands that J is a Trigger, `guardBreak`, `stagger` seconds, `streak` added per Trigger in a row up to `streakCap`, `twin` a Trigger on Breaker fires a second round, `mark` damage taken for `markTime` seconds.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Trigger blasts deal +200% to the struck foe. | bonus 2, window 0.1 |
| 2 | Trigger window 0.10 to 0.14 s. | window 0.14 |
| 3 | New: a Trigger blast breaks guards and staggers. | guardBreak 1, stagger 0.6 |
| 4 | Bonus +200% to +600%. | bonus 6 |
| 5 | New: each Trigger in a row adds +50%, up to +200%. | streak 0.5, streakCap 2 |
| 6 | New: a Trigger on Breaker fires a second round. | twin 1 |
| 7 | New: the struck foe takes +20% from everything for 3 s. | mark 0.2, markTime 3 |
| 8 | Bonus +600% to +5000%. | bonus 50 |

Evolution **Dead Center** (partner `ca_speedload`): A Trigger gives its round back, and every third Trigger in a row sends a breaching slug through the foe.
Evolved values added: refund 1, breachEvery 3, breach 60.
Code: `skills/hairTrigger.ts` (window, bonus, mark, Dead Center), `skills/hairTriggerTwin.ts`, `trigger.ts`.

#### `ca_breech` Breech Slam

Attack, timed, J. Breaker fires a round into the floor: a shock runs out both ways.

Values: `power` attack damage of the shock, `reach` pixels each way, `launch` throws foes up, `burn` attack damage a burn tick per stack, `second` a second shock farther out, `stun` seconds knocked down, `fissure` attack damage of the fissure that runs to both edges.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Breaker sends a shock along the floor both ways. | power 0.8, reach 34 |
| 2 | Shock reach 34 to 48 px; power +40%. | reach 48, power 1.1 |
| 3 | New: the shock throws foes up. | launch 1 |
| 4 | New: the shock leaves foes burning. | burn 0.15 |
| 5 | Shock power 1.1 to 2. | power 2 |
| 6 | New: a second shock runs out farther. | second 1 |
| 7 | New: the shock knocks foes down. | stun 0.8 |
| 8 | Shock power 2 to 4.5. | power 4.5 |

Evolution **Faultline** (partner `ca_blastjump`): The shock tears a fissure along the floor to both edges of the stage, striking every foe on it.
Evolved values added: fissure 5.
Code: `skills/breechSlam.ts`, `skills/floorShock.ts`, called from Breaker in `moves/string.ts`.

#### `ca_vent` Vent Blast

Attack, easy, J. Each string blow vents the chamber behind you, striking foes there.

Values: `power` attack damage of the vent, `reach` pixels behind, `knock` throws foes away and staggers them, `air` air blows vent too, `burn` attack damage a burn tick per stack, `front` share of the vent that also bursts in front, `ring` the vent strikes all round.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | String blows vent behind you, striking foes there. | power 0.4, reach 28 |
| 2 | Vent power +50%; reach 28 to 34 px. | power 0.6, reach 34 |
| 3 | New: the vent throws foes away and staggers them. | knock 1 |
| 4 | New: air blows vent too. | air 1 |
| 5 | Vent power 0.6 to 1. | power 1 |
| 6 | New: vented foes burn. | burn 0.1 |
| 7 | New: the vent also bursts in front. | front 0.5 |
| 8 | Vent power 1 to 2.2. | power 2.2 |

Evolution **Furnace Vent** (partner `ca_brass`): The vent bursts all round you at twice the power.
Evolved values added: ring 1, power 4.4.
Code: `skills/ventBlast.ts`, called from `afterStrike.ts`.

#### `ca_pointblank` Point Blank

Attack, precise, K. The parry's counter shot hits far harder.

Values: `power` added share of the counter shot, `rounds` more rounds a parry loads, `mark` damage taken for 4 s, `stagger` seconds the shot staggers longer, `dodge` a perfect dodge fires the counter shot, `free` the next Trigger after a parry spends no round, `fill` a parry fills the chamber.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The counter shot deals +150%. | power 1.5 |
| 2 | New: a parry loads one more round. | rounds 1 |
| 3 | New: the struck foe takes +15% from everything for 4 s. | mark 0.15 |
| 4 | Counter shot +150% to +400%. | power 4 |
| 5 | New: the struck foe reels 0.6 s longer. | stagger 0.6 |
| 6 | New: a perfect dodge fires the counter shot too. | dodge 1 |
| 7 | New: the next Trigger after a parry spends no round. | free 1 |
| 8 | Counter shot +400% to +1600%. | power 16 |

Evolution **Deadeye** (partner `ca_trigger`): A parry fills the chamber, and the counter shot hits half again as hard.
Evolved values added: fill 1, power 24.
Code: `skills/pointBlank.ts`, `counterShot.ts`.

#### `ca_speedload` Speed Loader

Attack, timed, J. Reload faster, and the closing cylinder throws a cutting ring.

Values: `window` seconds added to the quick reload window, `ring` attack damage of the ring the cylinder throws as it closes within `reach` pixels, `mp` MP a quick reload gives back, `rate` the reload's clock runs this much faster, `push` the ring throws foes away, `burst` attack damage of a hot blast round you on a quick reload, `auto` every reload is quick, `pull` the ring draws foes in.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Quick reload window +50%. | window 0.07 |
| 2 | New: the closing cylinder throws a cutting ring. | ring 0.8, reach 26 |
| 3 | Window +85%; ring +50%. | window 0.12, ring 1.2 |
| 4 | New: a quick reload gives back 12 MP. | mp 12 |
| 5 | Reload 30% faster; ring 1.2 to 2. | rate 0.3, ring 2 |
| 6 | New: the ring throws foes away and staggers them. | push 1 |
| 7 | New: a quick reload sets off a hot blast round you. | burst 2.5 |
| 8 | Ring 2 to 9; blast 2.5 to 10. | ring 9, burst 10 |

Evolution **Spin Cycle** (partner `ca_drum`): Every reload is quick, and the ring draws foes in before it cuts.
Evolved values added: auto 1, pull 1, ring 14.
Code: `skills/speedLoader.ts`, `reload.ts` (window, rate, Spin Cycle).

#### `ca_ricochet` Ricochet

Attack, timed, auto. A Trigger's round ricochets on to another foe nearby.

Values: `power` attack damage of a ricochet, `range` pixels it can jump, `bounces` how many, `stagger` seconds, `more` rounds from the warp and the parry ricochet too, `every` every round ricochets, `grow` each bounce hits this much harder.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A Trigger's round ricochets to a foe nearby. | power 0.6, range 60, bounces 1 |
| 2 | Ricochet power 0.6 to 1. | power 1 |
| 3 | New: it ricochets twice. | bounces 2 |
| 4 | New: ricochets stagger. | stagger 0.5 |
| 5 | Power 1 to 1.8; range 60 to 80 px. | power 1.8, range 80 |
| 6 | New: the warp's and the parry's rounds ricochet too. | more 1 |
| 7 | New: it ricochets three times. | bounces 3 |
| 8 | Ricochet power 1.8 to 4. | power 4 |

Evolution **Pinball** (partner `ca_tracer`): Every round you fire ricochets six times, each bounce harder than the last.
Evolved values added: every 1, bounces 6, grow 0.15.
Code: `skills/ricochet.ts`.

#### `ca_recoil` Recoil Dash

Movement, timed, L. The dodge fires a round behind you as it starts.

Values: `power` attack damage of the round behind, `cut` attack damage to foes passed through, `stamina` given back per foe passed, `air` dodge in the air, `end` attack damage of a blast ahead as it ends, `trail` attack damage of each blast left along the path.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The dodge fires a round behind you as it starts. | power 0.8 |
| 2 | Round power 0.8 to 1.2. | power 1.2 |
| 3 | New: foes you dodge through are cut. | cut 0.8 |
| 4 | New: each foe passed gives back 8 stamina. | stamina 8 |
| 5 | Round 1.2 to 2.2; cut 0.8 to 1.5. | power 2.2, cut 1.5 |
| 6 | New: dodge in the air. | air 1 |
| 7 | New: the dodge ends with a blast ahead. | end 2 |
| 8 | Round 4, cut 3, blast 4. | power 4, cut 3, end 4 |

Evolution **Backfire Rush** (partner `ca_vent`): The dodge leaves a line of blasts along its path.
Evolved values added: trail 2.5.
Code: `skills/recoilDash.ts`, the kit's `dodge` and `airDodge` hooks.

#### `ca_tracer` Tracer Warp

Movement, timed, J. The thrown sword leaves a tracer that cuts foes in its path.

Values: `path` attack damage to foes the thrown sword passes, `free` the arrival round needs no round in the chamber, `recharge` seconds, `blast` attack damage of the arrival round, `splash` and `reach` its splash, `charges` warps in a row, `load` the arrival loads a round, `line` attack damage a second of the tracer line left burning.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The thrown sword's tracer cuts foes on its path. | path 0.8 |
| 2 | New: the arrival round needs no round in the chamber. | free 1 |
| 3 | Warp recharge 2 to 1.5 s. | recharge 1.5 |
| 4 | New: the arrival blast splashes foes round it. | blast 0.5, splash 0.5, reach 30 |
| 5 | Tracer 0.8 to 1.6; blast 0.5 to 0.7. | path 1.6, blast 0.7 |
| 6 | New: two warps in a row. | charges 2 |
| 7 | New: the arrival loads a round. | load 1 |
| 8 | Tracer 1.6 to 6; blast 0.7 to 3.5. | path 6, blast 3.5 |

Evolution **Green Line** (partner `ca_ricochet`): The tracer line stays for 2 seconds and burns every foe on it.
Evolved values added: line 8.
Code: `warpStyle.ts` (tune, arrival round), `skills/tracerWarp.ts` (load, Green Line).

#### `ca_blastjump` Blast Jump

Movement, timed, Up. The double jump fires a round down, blasting foes under you.

Values: `power` attack damage of the blast under the double jump, `air` more air blows per jump, `drop` attack damage of a blast where Drop cut lands, `launch` the jump blast throws foes up, `stun` seconds Drop cut's blast knocks down, `skyshot` attack damage of the round every air blow fires down.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The double jump fires a round down at foes under you. | power 1 |
| 2 | Jump blast 1 to 1.5. | power 1.5 |
| 3 | New: one more air blow per jump. | air 1 |
| 4 | New: Drop cut lands with a blast. | drop 1.5 |
| 5 | Jump blast 2.5; landing blast 2.5. | power 2.5, drop 2.5 |
| 6 | New: the jump blast throws foes up. | launch 1 |
| 7 | New: Drop cut's blast knocks foes down. | stun 0.8 |
| 8 | Jump blast 5; landing blast 5. | power 5, drop 5 |

Evolution **Skyshot** (partner `ca_breech`): Every air blow fires a round down into the foe it struck.
Evolved values added: skyshot 3.
Code: `skills/blastJump.ts`, `chooseMove.ts` (air limit), `moves/air.ts`.

#### `ca_flare` Phosphor Shell

Spell, easy, I. Learn Phosphor Shell: a lobbed shell bursts into a pool of green fire.

Values: `cost` MP, `recharge` seconds, `power` ability power of the burst, `burn` ability power a fire tick per stack, `time` seconds the pool burns, `radius` pixels, `launch` the burst throws foes up, `halt` foes in the pool are held fast, `burnMax` more stacks, `shells` shells a cast.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Phosphor Shell: a shell that leaves green fire. | cost 14, recharge 6, power 1.6, burn 0.2, time 2.5, radius 22 |
| 2 | Fire 0.2 to 0.3; burns 3.5 s. | burn 0.3, time 3.5 |
| 3 | New: the burst throws foes up. | launch 1 |
| 4 | New: foes in the fire are held fast. | halt 1 |
| 5 | Burst 1.6 to 3; wider pool. | power 3, radius 30 |
| 6 | New: two shells a cast. | shells 2 |
| 7 | New: the fire stacks twice as high. | burnMax 5 |
| 8 | Burst 3 to 6; fire 0.3 to 1. | power 6, burn 1 |

Evolution **Greenfire Barrage** (partner `ca_scorch`): Four shells a cast, and their fire burns twice as hot.
Evolved values added: shells 4, burn 2.4.
Code: `shells/phosphorShell.ts`.

#### `ca_chainshot` Chain Shot

Spell, timed, I. Learn Chain Shot: two weights on a chain spin through every foe in a line.

Values: `cost` MP, `recharge` seconds, `power` ability power of a strike, `drag` foes are dragged along, `twice` each foe is struck twice, `wrap` seconds a struck foe is held fast.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Chain Shot: a spinning chain through a line of foes. | cost 12, recharge 5, power 2 |
| 2 | Power 2 to 3. | power 3 |
| 3 | New: the chain drags foes along. | drag 1 |
| 4 | New: it strikes each foe twice. | twice 1 |
| 5 | Power 3 to 5; recharge 5 to 4 s. | power 5, recharge 4 |
| 6 | New: foes it strikes are held fast for 1 s. | wrap 1 |
| 7 | New: costs 8 MP. | cost 8 |
| 8 | Power 5 to 14. | power 14 |

Evolution **Reaper Chain** (partner `ca_ricochet`): The chain comes back to you and strikes every foe again on the way.
Evolved values added: power 10.
Code: `shells/chainShot.ts`.

#### `ca_charge` Blast Charge

Spell, timed, I. Learn Blast Charge: a charge on the floor ahead blows when a foe touches it.

Values: `cost` MP, `recharge` seconds, `power` ability power of the blast, `radius` pixels, `fuse` seconds before it blows on its own, `stun` seconds knocked down, `pull` draws foes in as it blows, `count` charges a cast, `echo` share of a second blast `echoDelay` seconds later.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Blast Charge: a charge that blows when touched. | cost 13, recharge 6, power 1.5, radius 34, fuse 1.5 |
| 2 | Blast 1.5 to 2.2. | power 2.2 |
| 3 | New: the blast knocks foes down. | stun 0.6 |
| 4 | New: the charge draws foes in as it blows. | pull 1 |
| 5 | Blast 2.2 to 3.5; wider. | power 3.5, radius 44 |
| 6 | New: two charges a cast. | count 2 |
| 7 | New: each charge blows again a moment later. | echo 0.6, echoDelay 0.3 |
| 8 | Blast 3.5 to 6. | power 6 |

Evolution **Demolition** (partner `ca_tracer`): Every cast lays a row of charges, and each blast is far wider.
Evolved values added: radius 60.
Code: `shells/blastCharge.ts`.

#### `ca_shrapnel` Shrapnel

Dot, easy, auto. Every round's blast leaves shrapnel that bleeds the foes it struck.

Values: `damage` attack damage a tick per stack, `max` stacks a foe can carry, `stacks` laid by one blast, `pass` a fallen foe's shrapnel passes to the nearest foe, `rip` attack damage per stack Breaker tears out, `burst` attack damage per stack of a detonation in 30 px once a foe carries `at` stacks.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Every round's blast leaves bleeding shrapnel. | damage 0.05, max 5, stacks 1 |
| 2 | Bleed 0.05 to 0.06. | damage 0.06 |
| 3 | New: each blast lays two stacks. | stacks 2 |
| 4 | New: a fallen foe's shrapnel passes to the nearest foe. | pass 1 |
| 5 | Bleed 0.08; up to 8 stacks. | damage 0.08, max 8 |
| 6 | New: Breaker tears the shrapnel out at once. | rip 0.5 |
| 7 | New: up to 12 stacks. | max 12 |
| 8 | Bleed 0.08 to 0.18. | damage 0.18 |

Evolution **Shrapnel Storm** (partner `ca_vent`): A blast on a foe carrying 6 stacks or more detonates them all round it.
Evolved values added: burst 1.2, at 6.
Code: `skills/shrapnel.ts`.

#### `ca_scorch` Scorch Rounds

Dot, timed, auto. A Trigger's round sets the struck foe burning green.

Values: `damage` attack damage a tick per stack, `max` stacks, `splash` the blast's splash burns too, `shots` shots burn too, `spread` a burning foe that falls passes its fire on, `consume` attack damage per stack when a Trigger consumes `at` stacks or more.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Trigger rounds set the struck foe burning. | damage 0.15, max 4 |
| 2 | Burn 0.15 to 0.25. | damage 0.25 |
| 3 | New: the blast's splash burns too. | splash 1 |
| 4 | New: slugs and pellets burn too. | shots 1 |
| 5 | Burn 0.25 to 0.3. | damage 0.3 |
| 6 | New: a burning foe that falls sets the nearest foe alight. | spread 1 |
| 7 | New: up to 8 stacks. | max 8 |
| 8 | Burn 0.3 to 0.7. | damage 0.7 |

Evolution **Phosphor Heart** (partner `ca_flare`): A Trigger on a foe burning with 4 stacks or more consumes the fire in one burst.
Evolved values added: consume 2.5, at 4.
Code: `skills/scorchRounds.ts`.

#### `ca_brass` Hot Brass

Dot, easy, auto. A reload flings hot casings at foes nearby, burning them.

Values: `casings` thrown a reload, `damage` attack damage a tick per stack, `range` pixels, `quick` a quick reload throws twice as many, `stagger` seconds a casing staggers, `ult` Cylinder Break's reload throws them too, `rain` casings fall on foes across the whole screen.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A reload flings hot casings that burn foes nearby. | casings 3, damage 0.12, range 70 |
| 2 | Burn 0.12 to 0.2; range 90 px. | damage 0.2, range 90 |
| 3 | New: a quick reload throws twice as many. | quick 1 |
| 4 | New: casings stagger foes. | stagger 0.4 |
| 5 | Burn 0.2 to 0.4. | damage 0.4 |
| 6 | New: Cylinder Break's reload throws casings too. | ult 1 |
| 7 | New: six casings a reload. | casings 6 |
| 8 | Burn 0.4 to 1.5. | damage 1.5 |

Evolution **Brass Rain** (partner `ca_speedload`): Casings rain on every foe on screen.
Evolved values added: rain 1, casings 12.
Code: `skills/hotBrass.ts`.

#### `ca_turret` Spare Barrel

Summon, precise, K. A parry may plant a spare barrel on legs that shoots the nearest foe.

Values: `chance` a parry plants one, `life` seconds it stands, `every` seconds between its shots, `power` attack damage a shot, `pierce` its shots pierce, `most` barrels at once, `stagger` seconds its shots stagger, `dodge` a perfect dodge plants one too, `cooldown` least seconds between plants.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry may plant a barrel that shoots the nearest foe. | chance 0.5, life 4, every 0.6, power 0.6, most 1, cooldown 1 |
| 2 | Chance 50% to 80%. | chance 0.8 |
| 3 | New: its shots pierce. | pierce 1 |
| 4 | Shot 0.6 to 1.5; stands 6 s. | power 1.5, life 6 |
| 5 | New: two barrels at once. | most 2 |
| 6 | New: its shots stagger the foe. | stagger 0.2 |
| 7 | New: a perfect dodge plants one too. | dodge 1 |
| 8 | Shot 1.5 to 4; always plants. | power 4, chance 1 |

Evolution **Gun Nest** (partner `ca_pointblank`): Three barrels at once, firing faster and harder.
Evolved values added: most 3, every 0.4, power 5.
Code: `skills/spareBarrel.ts`.

#### `ca_double` Smoke Double

Summon, precise, auto. A Trigger may leave a double of gunsmoke that fires the same round again.

Values: `chance` a Trigger calls one, `power` share of a Trigger's blast it fires, `shots` rounds it fires, `cut` attack damage of a cut before it fires, `splash` attack damage of each round's splash, `hot` its rounds are hot, `doubles` called at once, `cooldown` least seconds between calls.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A Trigger may call a smoke double that fires it again. | chance 0.35, power 1, shots 1, doubles 1, cooldown 0.6 |
| 2 | Chance 35% to 60%. | chance 0.6 |
| 3 | New: the double cuts before it fires. | cut 1.5 |
| 4 | Round power 1 to 4. | power 4 |
| 5 | New: it fires twice. | shots 2 |
| 6 | New: every Trigger calls one, and its rounds splash. | chance 1, splash 0.5 |
| 7 | New: its rounds are hot. | hot 1 |
| 8 | Round power 4 to 24. | power 24 |

Evolution **Gunsmoke Gallery** (partner `ca_pointblank`): Two doubles at a time, each firing three rounds.
Evolved values added: doubles 2, shots 3.
Code: `skills/smokeDouble.ts`.

#### `ca_hound` Scrap Hound

Summon, easy, auto. A foe falling may call a clockwork hound that runs down and bites the nearest foe.

Values: `chance` a kill calls one, `life` seconds it runs, `power` attack damage a bite, `every` seconds between bites, `stagger` a bite staggers, `leap` hounds leap at foes in the air, `most` hounds at once, `boom` attack damage of the blast when it winds down, `cooldown` least seconds between calls.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A kill may call a clockwork hound that bites. | chance 0.3, life 5, power 0.25, every 0.5, most 1, cooldown 1 |
| 2 | Chance 30% to 50%. | chance 0.5 |
| 3 | New: bites stagger. | stagger 0.3 |
| 4 | Hounds run 8 s; bite 0.25 to 0.4. | life 8, power 0.4 |
| 5 | New: two hounds at once. | most 2 |
| 6 | New: hounds leap at foes in the air; bite 0.4 to 0.6. | power 0.6, leap 1 |
| 7 | New: a hound blows up when it winds down. | boom 2 |
| 8 | Bite 0.6 to 0.9. | power 0.9 |

Evolution **Scrap Pack** (partner `ca_drum`): Three hounds, always at your side.
Evolved values added: most 3, pack 1.
Code: `skills/scrapHound.ts`.

#### `ca_drum` Drum Cylinder

Passive, easy, auto. A bigger cylinder: more rounds in the chamber.

Values: `rounds` more rounds a full chamber holds, `reload` the reload runs this much faster, `killLoad` chance a kill loads a round, `full` added damage of string blows while the chamber is full, `parry` more rounds a parry loads, `freeEvery` every this many rounds fired, one is free.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The chamber holds one more round. | rounds 1 |
| 2 | New: reload 15% faster. | reload 0.15 |
| 3 | The chamber holds two more rounds. | rounds 2 |
| 4 | New: a kill may load a round. | killLoad 0.25 |
| 5 | The chamber holds three more rounds. | rounds 3 |
| 6 | New: string blows hit 15% harder while the chamber is full. | full 0.15 |
| 7 | New: a parry loads one more round. | parry 1 |
| 8 | The chamber holds four more rounds. | rounds 4 |

Evolution **Bottomless Drum** (partner `ca_speedload`): Every sixth round fired comes back to the chamber.
Evolved values added: freeEvery 6.
Code: `chamber.ts` (rounds, Bottomless Drum), `reload.ts` (rate), `skills/drumCylinder.ts`, `skills/pointBlank.ts` (parry).

#### `ca_break` Cylinder Break

Ultimate, easy, U. Cylinder Break grows: more cuts, foes drawn in, and a breaching shot to end the run. Grows with attack damage.

Values: values, damage a share of the run's own cut: `power` each cut, `pull` cuts draw foes in, `cooldown` seconds, `charge` charging speed, `cuts` more cuts, `finale` the breaching shot across the screen, `hot` every cut is a hot round.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Cuts hit 30% harder and draw foes in. | power 1.3, pull 1 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: two more cuts. | cuts 2 |
| 4 | New: the run ends in a breaching shot across the screen. | finale 3 |
| 5 | Cut power +30% to +40%. | power 1.4 |
| 6 | New: every cut is a hot round. | hot 1 |
| 7 | New: four more cuts; the shot hits harder. | cuts 4, finale 5 |
| 8 | Cut power +40% to +50%; the shot hits far harder. | power 1.5, finale 6 |

Evolution **Last Cylinder** (partner `ca_trigger`): The run goes on through a second cylinder: twice the cuts, and the shot hits far harder.
Evolved values added: cuts 13, finale 14, power 2.2.
Code: `ultimate/cylinderBreak.ts`, `ultimate/finale.ts`.
