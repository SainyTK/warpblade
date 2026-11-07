# Skill balance, measured

The first balance pass on the 80 skills in the real game, 7 and 8 November 2026 (after main 8f3fa9f).
It measures every skill at level 1, level 8 and evolved, tunes the clear outliers in the data rows and records what is still off.
The play model and bands come from the design review of the four hero designs; this file states them as used.

## How it was measured

Every figure comes from the game itself through the playtest harness (`agent-studio/playtest`), in a test room.

- The run starts at wave 2 and hero level 1 with only the skill under test (`?build=<id>:1`, `<id>:8` or `evolve:<id>`), so levels from picks and charms stay out.
- Once the first wave starts, the wave's stream is stopped and the room keeps its own foes: a crowd of 6 (four husks and two wisps), or one foe with an elite's HP (a husk at three times its HP, with no chest).
  A fallen foe comes back 0.35 s later near the hero, as the stream refills; the hero's HP is kept full.
- A fixed scripted player plays 5 s of warm-up and 60 s of measured play: the skilled bot's movement, dodges and J, plus every button an ordinary player uses at fixed intervals (Kael: a jump string every 6 s and a dash through a foe every 4 s; Ysra: a vault and crash every 4 s, a dive every 5 s, a held lunge every 4 s; Sable: a kick every 3.3 s, a hop every 3 s, a slide every 5 s, an air string every 4 s, a cast every 2 s; Hulda: a grab and throw every 8 s, a Bull Rush every 3.3 s, a Skyfall Grab every 10 s).
  It casts a skill's spell first when that spell is ready, and Blink Step's K once per string.
  The same routine runs with the base kit, so the difference is the skill's own.
- Hard triggers run at the model's rates through the kits' own functions: a perfect dodge every 7 s (Kael, Sable), a parry every 6.7 s (every 5 s once Counter Thrust widens the window), an armoured counter every 6.7 s and a counter grab every 10 s (Hulda), a Keen blow on 30% of follow-up blows (40% with the wider window), 60% of Sable's reloads perfect.
  Where the bot made a skill's trigger more often on its own (Mirror Knight and Shade Archer perfect dodges, Ancestor's Fist armoured counters, Sun Hawk and Ember Brand parries), the skill's figure is scaled down to the model's rate.
- A skill's figure is the damage per second it adds over the base kit, counted on the sources it can change: attacks and its own id for attack, movement, dot, summon and passive skills, abilities and its own id for spells, the ultimate and its own id for ultimates.
  The base kit was measured three times with different room seeds; its spread is the noise column below (5 to 35 a second).
- Figures are raw damage per second at hero level 1 (Kael AD 10, Ysra 13, Sable 11, Hulda 12), so heroes compare directly; divide by the stat for AD or AP multiples.

Limits of the room: the bot attacks almost all the time and the crowd stands within reach, so absolute figures sit above an ordinary player's; the bands below are set from the same room, so the ratios hold.
Skills the scripted player cannot drive well read near zero and are marked unmeasured: Giant Swing, Crushing Grip, Wrecking Throw, Spirit Bear (they need specific grabs and throws), Skyhook (a flyer overhead), Impale and Deep Heft (the string's last blow and a full lunge), Warpath, Overheat, Kindling, Brazier (Heat spent elsewhere), Rift Wound, Skybreaker, Sky Dance, Barbed Jaws, Longshot, Powder Keg.

## Bands in the room

The anchor is the median of the easy attack, spell and summon skills of all four heroes at level 8 on a crowd: about 70 a second.

| Kind | Level 8 target, raw per second |
| --- | --- |
| Easy, crowd | 70 |
| Timed | 112 |
| Precise, one foe | 175 to 210; on a crowd at most about 300 |
| Movement | 0.8 of its band: easy 56, timed 90 |
| Damage over time | 1.1 to 1.4 times the attack band of its risk |
| Evolution | easy about 2 times its level 8, timed about 2.2, precise about 3 (crowd at most about 900) |
| Ultimate | per cast about 6 times the base special at level 8, about 15 times evolved |

Base kit in the room (raw per second): Kael 146 crowd / 42 one, Ysra 120 / 47, Sable 60 / 53, Hulda 54 / 12.

## Measured table (before tuning)

Damage per second each skill adds; "one" is the lone foe, "crowd" the six.

| Hero | Skill | Kind | Risk | Target | L1 one | L1 crowd | L8 one | L8 crowd | Evolved one | Evolved crowd |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hulda | h_ancestorFist | summon | precise | one | -3 | 9 | 102 | 275 | 377 | 784 |
| hulda | h_bruise | dot | easy | crowd | 3 | 4 | 12 | 48 | 35 | 53 |
| hulda | h_bullHorns | movement | timed | crowd | 5 | 15 | 11 | 80 | 23 | 111 |
| hulda | h_counterGrab | attack | precise | one | 11 | 27 | 76 | 170 | 51 | 124 |
| hulda | h_fracture | dot | timed | one | 4 | -4 | 9 | -2 | 9 | -2 |
| hulda | h_giantSwing | attack | easy | crowd | 1 | 2 | 1 | -2 | 1 | 4 |
| hulda | h_haymaker | attack | timed | crowd | 8 | 10 | 22 | 129 | 33 | 81 |
| hulda | h_ironChain | spell | timed | crowd | -0 | 1 | 9 | 80 | 13 | 103 |
| hulda | h_ironHide | passive | easy | crowd | 1 | -1 | -3 | -6 | -2 | -4 |
| hulda | h_ironWall | spell | precise | one | 1 | 42 | 74 | 873 | 263 | 4950 |
| hulda | h_knuckleWave | attack | easy | crowd | 5 | 2 | 23 | 22 | 35 | 148 |
| hulda | h_rustShards | dot | easy | crowd | 4 | 4 | 8 | 33 | 19 | 165 |
| hulda | h_shieldSister | summon | easy | crowd | 1 | 6 | 19 | 66 | 27 | 181 |
| hulda | h_skyfall | movement | precise | one | 4 | 23 | 16 | 30 | 210 | 371 |
| hulda | h_spiritBear | summon | timed | crowd | 6 | 3 | 11 | -2 | 61 | 136 |
| hulda | h_stampede | movement | easy | crowd | 3 | 10 | 3 | 14 | 7 | 69 |
| hulda | h_titanThrow | ultimate | easy | crowd | 0 | 1 | 0 | 21 | 0 | 39 |
| hulda | h_tremorStomp | spell | easy | crowd | -0 | 5 | 4 | 72 | 6 | 123 |
| hulda | h_unbroken | ultimate | timed | crowd | 0 | -11 | 0 | 1 | - | 12 |
| hulda | h_wreckingThrow | attack | timed | crowd | 1 | 6 | 1 | -6 | - | - |
| kael | k_blink | movement | timed | one | 18 | 33 | 110 | 152 | 150 | 196 |
| kael | k_echo | summon | precise | one | -5 | -0 | 14 | 34 | 40 | 41 |
| kael | k_familiar | summon | easy | one | 25 | 30 | 107 | 269 | 87 | 306 |
| kael | k_flame | spell | easy | crowd | -4 | -12 | 5 | 16 | 22 | 94 |
| kael | k_frost | spell | timed | crowd | -3 | 3 | 12 | 78 | 50 | 146 |
| kael | k_keen | attack | precise | one | 20 | 11 | 91 | 286 | 39 | 256 |
| kael | k_legion | ultimate | easy | crowd | 0 | -36 | 0 | -9 | 0 | 94 |
| kael | k_mirror | summon | precise | one | 21 | 9 | 168 | 394 | 456 | 1230 |
| kael | k_passing | movement | timed | crowd | -0 | 18 | 14 | 62 | 26 | 159 |
| kael | k_phase | attack | timed | one | 3 | 28 | 91 | 225 | 91 | 180 |
| kael | k_reap | attack | easy | crowd | 20 | -2 | 35 | 24 | 57 | 127 |
| kael | k_rift | dot | timed | one | -3 | 6 | 5 | -20 | 5 | -20 |
| kael | k_skydance | movement | timed | crowd | -3 | -8 | 11 | 16 | 6 | 37 |
| kael | k_skyward | attack | timed | crowd | 2 | 10 | 10 | -7 | 103 | -7 |
| kael | k_splinters | dot | easy | crowd | 6 | 27 | 9 | 30 | 6 | 45 |
| kael | k_starfall | ultimate | timed | crowd | - | -40 | 0 | 33 | - | 106 |
| kael | k_volt | spell | easy | crowd | 7 | -1 | 18 | 64 | 60 | 130 |
| sable | s_barbed | dot | timed | crowd | -15 | -2 | 1 | 5 | 25 | 9 |
| sable | s_breach | attack | timed | one | 6 | -6 | 73 | 98 | 89 | 118 |
| sable | s_deadeye | ultimate | precise | crowd | 0 | 12 | 0 | 123 | 0 | 169 |
| sable | s_decoy | spell | easy | crowd | 2 | 6 | 22 | 21 | 60 | - |
| sable | s_featherdraw | movement | easy | crowd | 2 | 2 | -3 | 30 | 20 | 87 |
| sable | s_hawk | summon | easy | one | -0 | -8 | 120 | 98 | 224 | 251 |
| sable | s_heavyBoot | attack | timed | one | -14 | -2 | -10 | 60 | -9 | 60 |
| sable | s_hopVolley | movement | timed | crowd | -3 | 13 | 29 | 222 | 6 | 134 |
| sable | s_hound | summon | timed | one | -13 | -18 | -13 | 116 | -13 | 152 |
| sable | s_keg | spell | timed | crowd | 1 | 1 | 9 | 11 | 13 | 48 |
| sable | s_lodged | dot | timed | one | -14 | 4 | 45 | 25 | 45 | 21 |
| sable | s_longshot | attack | timed | one | -2 | 6 | 14 | -0 | 3 | -3 |
| sable | s_net | spell | timed | crowd | 2 | 8 | 9 | 55 | 9 | 55 |
| sable | s_pierce | attack | easy | crowd | -15 | 22 | -7 | 118 | -3 | 120 |
| sable | s_rhythm | attack | precise | one | 2 | 8 | 114 | 531 | 140 | 408 |
| sable | s_ricochet | attack | timed | crowd | -13 | 12 | -9 | 172 | -9 | 236 |
| sable | s_scatter | attack | easy | crowd | 6 | 6 | 58 | 141 | 70 | 113 |
| sable | s_shade | summon | precise | one | -11 | 1 | 18 | 102 | 54 | 315 |
| sable | s_slideKick | movement | timed | crowd | 3 | 2 | 24 | 155 | 33 | 155 |
| sable | s_venom | dot | easy | crowd | 4 | -8 | - | 42 | - | - |
| ysra | y_ashen | dot | timed | crowd | -5 | 29 | 47 | 161 | 60 | 135 |
| ysra | y_brand | dot | precise | one | -6 | -10 | 1 | 18 | 1 | 18 |
| ysra | y_brazier | spell | easy | crowd | -2 | -20 | 10 | -2 | 23 | 17 |
| ysra | y_counter | attack | precise | one | -1 | 37 | 61 | 174 | 191 | 1135 |
| ysra | y_dive | movement | timed | crowd | -3 | -1 | 3 | 51 | 40 | 85 |
| ysra | y_hawk | summon | precise | one | 15 | 30 | 73 | 194 | 176 | 1007 |
| ysra | y_heft | attack | timed | crowd | -7 | 11 | 1 | 26 | 11 | 26 |
| ysra | y_impale | attack | timed | crowd | -1 | -5 | 23 | -5 | 22 | 4 |
| ysra | y_kindling | passive | easy | crowd | -2 | 11 | -15 | -13 | 6 | -10 |
| ysra | y_overheat | spell | timed | crowd | -3 | -24 | -2 | -25 | -5 | -32 |
| ysra | y_pillar | spell | timed | crowd | -2 | 11 | 34 | 313 | 45 | 379 |
| ysra | y_rift | ultimate | easy | crowd | 0 | -12 | 0 | 94 | 0 | 198 |
| ysra | y_salamander | summon | timed | crowd | 4 | 15 | -1 | 34 | 19 | 100 |
| ysra | y_searing | dot | easy | crowd | 3 | -1 | 14 | 29 | 14 | 116 |
| ysra | y_shade | summon | easy | crowd | -6 | 19 | 20 | 87 | 24 | 68 |
| ysra | y_skyhook | attack | timed | one | -0 | -5 | -0 | -5 | -0 | -5 |
| ysra | y_sunspear | ultimate | timed | crowd | 0 | 70 | 0 | 106 | 0 | 276 |
| ysra | y_vault | movement | timed | crowd | -2 | 4 | 6 | 76 | 59 | 80 |
| ysra | y_warpath | movement | easy | crowd | -5 | -5 | 3 | -5 | 34 | - |
| ysra | y_windmill | attack | easy | crowd | -0 | -6 | - | -5 | - | - |

Ultimates (whole 60 s window against the base special's): Volcanic Rift 5.3 times at level 8 and 10 evolved, Sunspear 5.9 and 13.7 (Solar Lance on target), Deadeye 19 and 26, Titan Throw 3.0 and 4.7, Phantom Legion 0.8 and 3.2, Starfall 1.8 and 3.5; Unbroken is a damage buff and does not show on its own source.

## What changed

Data rows only; the code change of this pass is G3 (below).

| Skill | Change | Why |
| --- | --- | --- |
| `h_ironWall` | L8 release 50 to 12 per blow; Unbreakable Wall 130 to 15 | 873 a second on a crowd at L8 and 4,950 evolved: three blows taken in a crowd times a full ring |
| `h_ancestorFist` | ring 40 to 24 px (L5 on) | 275 crowd at L8 and 784 evolved, from the ring; one foe 102 stays |
| `h_counterGrab` | L8 counter 45 to 65; Executioner's Grip 45 to 90 on every foe | precise one foe 76, evolved below L8 on anything but a mini or boss |
| `h_bruise` | L8 and evolved 0.3 to 0.5 a second a stack | dot at 48, under its 77 to 98 |
| `h_rustShards` | L8 and evolved 0.3 to 0.6 | 33, under |
| `h_knuckleWave` | L8 wave 1.3 to 2.6; Thunder Knuckles 1.3 to 1.8 | 22, a third of easy |
| `h_stampede` | L8 and evolved shoulder 0.8 to 1.5, trail 0.6 to 1.2 | 14, a quarter of its band |
| `h_titanThrow` | L8 burst 3 to 5, path 1 to 1.5; Mountain Hurl burst 4 to 9 | 3 times the base special, 6 asked |
| `k_mirror` | knight targets 3 to 2 (L4 on); Perfect Reflection area 40 to 15 | 394 crowd at L8, 1,230 evolved (one foe 168 and 456 stay) |
| `k_familiar` | shard 0.8 to 0.3 at L1, 1.4 to 0.5 at L8 | an easy summon at 269 on a crowd, 3.8 times easy |
| `s_hawk` | L8 and evolved dive 2.8 to 1.6 | easy at 120 on one foe and 251 evolved |
| `s_rhythm` | primed bolts pierce 2 to 1 (L3 on) | 531 on a crowd |
| `s_hopVolley` | hop bolts pierce 2 to 1 (L6 on) | movement at 222, 2.5 times its band |
| `s_deadeye` | L8 power 4 to 2; Heartseeker 4 to 2.5 | 19 times Bolt Storm over the window |
| `s_scatter` | L8 and evolved side bolts 0.85 to 0.7 | 141, twice easy |
| `s_slideKick` | L8 and evolved trip 6 to 3.5 | movement at 155 |
| `y_pillar` | L7 11, L8 12, Pyre Colonnade 14 AP (from 18, 22, 26) | a timed spell at 313 |
| `y_counter` | Sun Piercer 60 to 45 AD | 1,135 evolved on a crowd |
| `y_hawk` | Sunflock dives 10 to 8 AD | 1,007 evolved on a crowd |

## Framework

- G3: `markFoe` now takes a source; marks of different sources add, with the kit's own damage-taken bonuses, under the +100% cap (`DAMAGE.takenCap`), and a source's new mark refreshes its own.
  Before, the stronger mark won and a mark without a kit bonus was not capped.
  Every caller passes its skill id (Impale, Sunspear and the stakes share `pin`); the measured table above already runs with it.

## Card economy

`docs/growth-review/skill-sim.mts` now also deals the four real heroes' 20 skills and partners, with the game's own card and chest code over 2,000 runs each.

| Hero | Greedy median | Steering median | Steering 4 or more |
| --- | --- | --- | --- |
| Kael | 2 | 3 | 8.6% |
| Ysra | 2 | 3 | 8.9% |
| Sable | 2 | 3 | 9.2% |
| Hulda | 2 | 3 | 8.8% |

On target: about 3 evolutions for a steering player and under 10% with 4 or more; the first evolution comes at wave 24 (median).
The in-game bot does not steer, so full in-game runs were not used for this.

## Cross-hero fairness

The skilled bot (`agent-studio/playtest`, `skilled` policy) played each hero's two example builds from the design docs, started at wave 8 (hero level 10, all eight skills at level 3) and wave 15 (level 20, all at level 5), for two waves or until it fell, in one 3-minute game limit.
Game seconds to clear the two waves, or the second it fell:

| Hero | Build | From wave 8 | From wave 15 |
| --- | --- | --- | --- |
| Kael | duelist (precise) | 30 s, cleared | 57 s, cleared |
| Kael | storm (crowd) | 32 s, cleared | fell at 52 s |
| Ysra | temple guard (precise) | 46 s, cleared | fell at 30 s |
| Ysra | wildfire (crowd) | fell at 46 s | fell at 37 s |
| Sable | volley (crowd) | 22 s, cleared | 44 s, cleared |
| Sable | cadence (precise) | fell at 42 s | fell at 33 s |
| Hulda | brawler (crowd) | 122 s, cleared | fell at 63 s |
| Hulda | iron wall (precise) | 87 s, cleared | fell at 63 s |

The best build of each hero is far from the 15% the target asks: Kael and Sable clear both stages fast, Ysra clears only wave 8, and Hulda clears wave 8 three to four times slower and falls from wave 15.
One run per build, and the bot uses only J, a reactive L, the HUD tabs and U, so it never plays Sable's kick and reload or Hulda's grabs, and these figures say as much about the bot as about the heroes.
They agree with the room's base kits, which put Kael and Ysra at about 2.5 times Sable and Hulda on a crowd.

## Still off

- Precise skills on one foe sit under their 175 to 210 band at the model's trigger rates (Keen Edge 91, Counter Thrust 61, Sun Hawk 73, Iron Counter 76 then about 110, Ancestor's Fist 102, Shade Archer 18, Phantom Edge 14 without Phase Cut); raising them more needs a decision on how large a single parry or perfect dodge may hit.
- Ancestor's Fist and Iron Wall answer armoured counters, which the rush and the haymaker's wind-up make on their own (0.2 a second in a crowd): they are less precise than their tag.
- Several timed skills read under band partly because the room cannot drive them (see the list above); they need a scripted check of their own before their numbers move.
- Phantom Legion and Starfall reach about 1 to 2 times Crystal Nova over the window; Unbroken was not measured.
- Base kits differ by about 2.5 times in the room (Kael 146 and Ysra 120 against Sable 60 and Hulda 54 on a crowd).

## Round 2 (8 November 2026)

The orchestrator's decisions on the open points: raise Hulda's and Sable's base kits, bring every precise skill to its band on one foe at the model's trigger rates, bring the three weak ultimates to about 6 times the base special per cast, and drive the unmeasured skills.
The room gained two modes: ultimates cast through the game's `castUltimate` at charge level 3 every 10 s (per-cast figures), and Ysra's Heat kept full for her rites.
The scripted player no longer spends Hulda's I on Taunt, which the bot used to cast every 3 s.

### Changes

| Skill or kit | Change | Measured after (raw per second, or per cast) |
| --- | --- | --- |
| Hulda base | jab 0.6 to 1.4, hook 0.9 to 2.2 and breaks guards, haymaker 1.5 to 4.5, pushes 40/90/240 to 30/60/70; Bellow 0.6 to 4 AP | crowd 54 to about 60, one foe 12 to about 15 (measured at the step before the last raise) |
| Sable base | closing bolt 1.3A to 1.8A and passes through one foe; snare 2.6P to 6P | crowd 60 to 85, one foe 53 to 63 |
| `k_keen` | L8 Keen bonus 10 to 20, wave 10 kept | one foe 91 to 227, crowd 545 |
| `k_mirror` | L8 knight strike 50 to 70 | one foe 198, crowd 407 at 0.29 dodges a second (about 200 at the model's rate) |
| `y_counter` | L7 20 to 35, L8 25 to 70 AD; Sun Piercer 45 to 60 | one foe 61 to 162; evolved crowd 1,244 at 90 before the trim to 60 |
| `y_hawk` | L7 5 to 9, L8 6 to 15 AD; Sunflock 8 to 12 | crowd 467; the lone-foe parries did not fire in the room (0.03 a second), so one foe reads 66 |
| `y_brand` | L8 10 AP a second a stack, a parry lays 4 | one foe 25, crowd 69: still under |
| `h_counterGrab` | L8 65 to 110, evolved 90 to 160 | one foe 143, crowd 483 |
| `h_ancestorFist` | L8 55 to 100, Hand of the Mountain 150 to 250 | one foe 146, crowd 368; evolved 482 and 1,210 |
| `s_rhythm` | L8 primed bonus 6 to 8 | crowd 604 at 10; one foe 51 |
| `s_shade` | L7 1.5 to 3, L8 and evolved 2 to 8 | one foe 18 to 193, crowd 404 |
| `k_legion` | L8 power 2 to 16; Phantom Army 4.5 | per cast 0.7 to 5.9 times Crystal Nova; Phantom Army 36 times at 11, cut to 4.5 (about 15) |
| `k_starfall` | L8 power 3 to 12 | per cast 2.3 times at 3, 3.8 at 8; 12 is set from those two points |

Ancestor's Fist and Iron Wall: in the room, armoured counters beyond the injected ones came at about 0.06 to 0.08 a second (0.2 to 0.23 in all on a crowd with 0.15 injected), well under the 0.2 that would call for a rush-start window, so no window was added.

### Still off after round 2

- Hulda's base kit stays near 60 on a crowd and 15 on one foe in the room, against about 80 and 35 asked; doubling her blows barely moved it, because the scripted player and the bot lose contact with a lone foe (rush, grab and knockback carry her past it).
  Settled in round 3 below.
- Base kits on the average of one foe and crowd: Kael 85, Ysra 77, Sable 74, Hulda about 37.
- Ember Brand, Perfect Rhythm on one foe and Iron Counter on one foe stay under their band; Keen Edge, Counter Thrust, Sun Hawk and Iron Counter spill far over the precise crowd cap of about 300.
- Unbroken shows no gain in the room (its damage buff did not show over the noise; settled in round 3); Titan Throw reads 4.8 to 5.7 times Quake Drop per cast and Deadeye 4.1 to 7.4 times Bolt Storm.
- The Heat top-up did not get Brazier, Overheat or Kindling cast by the scripted player (they read 0); together with Giant Swing, Crushing Grip, Wrecking Throw, Spirit Bear, Skyhook, Impale, Deep Heft, Warpath, Rift Wound, Skybreaker, Sky Dance, Barbed Jaws, Longshot and Powder Keg they still need a scripted check that drives their own functions.

### Cross-hero bot runs, round 2

| Hero | Build | From wave 8 | From wave 15 |
| --- | --- | --- | --- |
| Kael | duelist | 30 s, cleared | 57 s, cleared |
| Kael | storm | 32 s, cleared | fell at 52 s |
| Ysra | temple guard | 46 s, cleared | fell at 30 s |
| Ysra | wildfire | fell at 46 s | fell at 37 s |
| Sable | volley | 22 s, cleared | 47 s, cleared |
| Sable | cadence | fell at 33 s | fell at 36 s |
| Hulda | brawler | fell at 72 s | fell at 60 s |
| Hulda | iron wall | 71 s, cleared | fell at 93 s |

These ran while the last numbers of the round were still moving (Hulda's first job ran on the middle step of her base raise); they are no closer to the 15% target than round 1.

## Round 3: Hulda's contact and Unbroken (8 November 2026)

### Cause

A player-style test drove Hulda with real keys against one walking husk (three times its HP) and measured the gap after every blow, rush and grab.
Her string keeps contact on its own: each jab, hook and haymaker landed 4 to 13 px from the foe, about 80 raw a second at the round 2 numbers.
Contact broke on the rush: it ran 21 to 31 px past the foe and left her back to it, and with the foe behind her it charged the way she faced, 110 px away.
Her string and grab never turned to a foe behind her, so the jab after a rush or a suplex swung at air.
The suplex leaves a lone foe 14 px behind her, which the turn now covers; the knockback of her blows was never the problem.

The room's scripted player had a fault of its own for Hulda: when Bellow was recharging and Taunt was selected, it answered the policy's I with O on every tick, so for about 40% of the lone-foe minute it only switched tabs and threw no punch.
It now treats the Taunt tab as not ready, so the policy punches instead; the other heroes' routines are unchanged.
This explains why raising her blows 2.3 times barely moved the room's figure.

### Changes

- Bull Rush charges the way she is pushed when L is pressed; once she has run into a foe and none waits within 24 px ahead, the charge stops at its next stride key and she wheels round to the foe as she settles; its shove is 60 (from 180).
- The first blow of a string and the grab face the held direction, or turn to a foe within reach only behind her.
- Blows 1.4/2.2/4.5 to 0.9/1.3/2.8 (8.1x to 5.0x a string).
- Unbroken: in iron every landed blow quakes the floor 40 px each way (one each 0.2 s; was the haymaker only); level 8 quake 2 to 9, Iron Titan 2 to 20.

### Measured

Base kit, total raw a second over all sources, room as above; "one" averages six seeds after the change and three before.

| Kit and player | One foe | Crowd | Average |
| --- | --- | --- | --- |
| Round 2 kit, round 2 player | 23 | 83 | 53 |
| Round 2 kit, fixed player | 28 | 99 | 64 |
| Contact fix, round 2 blows, fixed player | 50 | 111 | 80 |
| Contact fix, round 3 blows, fixed player | 47 | 92 | 69 |

The one-foe figure sits above the 35 asked and the crowd figure near the 80 asked; a lone foe in the room dies about every 5 s and the walk to the next one caps the one-foe figure, so lower blows move it little and cost the crowd figure more.
Kael reads 42 on one foe and Sable 63, so 47 is inside the other heroes' range.

Unbroken per cast at charge level 3 against Quake Drop's per cast (Quake Drop about 760 on the crowd over four runs), counting all the damage it adds over the base kit, not only its own source:

| Unbroken | Crowd before | Crowd after | One foe after |
| --- | --- | --- | --- |
| Level 8 | 0.2x | 6.4x | 5.0x |
| Iron Titan | 0.4x | 15.8x | 11.5x |

Before, it was a damage buff on a base kit that barely landed in the room, plus quakes on haymakers, which the bot seldom finished; counted in full it reached 0.2 times Quake Drop.
Doubling her own damage for eight seconds is worth under one Quake Drop on a crowd, so the quakes carry the cast.

### Bot runs, round 3

Skilled bot, same jobs as above, plus a wave 1 start with the build's eight skills at level 1; game seconds to clear two waves, or the second it fell.

| Hulda build | From wave 1 | From wave 8 | From wave 15 |
| --- | --- | --- | --- |
| brawler, round 2 kit | 44 s, cleared | 69 s, cleared | fell at 61 s |
| brawler, round 3 | 62 s, cleared | 62 s, cleared | 66 s, cleared |
| iron wall, round 2 kit | 45 s, cleared | 59 s, cleared | fell at 67 s |
| iron wall, round 3 | 32 s, cleared | 57 s, cleared | fell at 76 s |

The brawler now clears wave 15 in about the time Kael's duelist takes (57 s), where Kael's storm, both Ysra builds and Sable's cadence fall; from wave 8 both builds are still two to three times slower than Kael and Sable.
The bot never grabs or throws on purpose, so these remain her floor.


## Round 3: precise payoffs and unmeasured skills (8 November 2026)

The open points from round 2: precise skills spilled onto crowds (Keen Edge 545, Perfect Rhythm 604, Iron Counter 483, Sun Piercer about 1,244), Ember Brand, Perfect Rhythm and Iron Counter sat under their band on one foe, many skills had never been driven, and two ultimates were extrapolated.

### Precise payoff

A precise skill's payoff now lands on the foe the hard move was aimed at: at most `PRECISE_TARGETS` (1) foe per pull-off, the first its move, wave or bolt reaches, nearest first.
Every other foe takes the plain move.
The rule and its code are in `docs/skill-design.md`, "Precise payoff".

- Keen Edge: the Keen bonus and the crystal wave share the Keen move's payoff; the wave passes other foes by.
- Counter Thrust: the counter's power lands on the first foe in its line; the rest of the line (the whole stage for Sun Piercer) takes the plain 3.75 AD thrust.
- Perfect Rhythm: a primed bolt's prime lands on the first foe it strikes and a foe it passes through takes the plain prime; the volley flies at the nearest foe.
- Iron Counter already struck only the caught foe; its crowd figure came from counters landing more often in a crowd, so only its number moved.

### Room changes

- The scripted player treats Hulda's Taunt tab as never ready (the fault round 3 of Hulda's contact work found); Hulda was measured after merging that work.
- Drives: a skill the scripted player never used is measured by playing the move it attaches to at the model's rate, the same way in the skill's run and in the base run, with the hero placed through the game's own state before real keys.
  Kael: a warp strike every 4 s (Rift Wound), a four-hit string every 5.5 s (Skybreaker).
  Ysra: her own Heat spent on the skill's rite whenever it pays (Brazier, Overheat), on any rite (Kindling), a flyer moved over her and J every 3 s (Skyhook), a three-blow string every 3.4 s (Impale), a full heft lunge every 4 s (Deep Heft), a walk into the charge and J every 5 s (Warpath).
  Sable: a snare bite every 5 s (Barbed Jaws), a string from 150 px every 3 s (Longshot), a keg rolled at the foe and shot every 6 s (Powder Keg).
  Hulda: a grab, three knees and the throw every 3.3 s (Wrecking Throw, Giant Swing, Crushing Grip, Spirit Bear), a jump and Skyfall Grab every 5 s (Skyfall Breaker).
- A third target, "late": the lone foe at 12 times its HP (four times the room's elite), the HP against hero damage that level 8 skills meet around wave 20.
  The room's elite dies to one big hit and the next one walks in, so it caps damage over time and overstates bursts, which count their overkill.

### Changes and measurements

Raw added damage a second in the room at the model's trigger rates; level 8 unless marked.
Before is main at ef383d3, after is this round; one or two runs per figure for driven skills, two to five for precise ones (a single precise run swings by 30 to 50%).

| Skill | Change | Before crowd / one | After crowd / one |
| --- | --- | --- | --- |
| `k_keen` | payoff rule | 514 / 146 | 277 / 176 |
| `k_keen` evolved | payoff rule | 433 / 132 | 467 / 229 |
| `s_rhythm` | payoff rule, volley at one foe; primed bonus 8 to 9 | 564 / 60 | 209 / 144 |
| `s_rhythm` evolved | payoff rule; bonus 8 to 9 | 839 / 137 | about 420 to 460 / 180 to 270 |
| `y_counter` | payoff rule; L8 70 to 45 AD | 404 / 326 | 245 / 154 (late 213) |
| `y_counter` evolved | payoff rule; Sun Piercer 60 to 120 AD | 781 / 214 | 440 / 389 (late 498) |
| `h_counterGrab` | L8 110 to 70 (Hulda's contact fix merged) | 389 / 154 | 261 / 100 (141 at 0.1 counters a second) |
| `h_counterGrab` evolved | unchanged | 608 / 203 | 864 / 604 |
| `y_brand` | L8 10 to 25 AP a stack a second | 89 / 21 (late 78) | 172 / 85 (late 180) |
| `k_rift` | L8 2.4 to 8 AD a layer a second | 6 / 28 | 6 / 47 |
| `s_keg` | L8 blast 8 to 20; Powder Effigy 12 | 16 / -8, evolved 142 / 28 | 102 / 43, evolved 176 / 30 |
| `s_longshot` | far bonus 2.5 to 8 (L8 and Horizon Shot) | 27 / 31, evolved 60 / 51 | evolved 107 / 123 |
| `y_brazier` | L8 ember 1 to 1.8 AP | 8 / -2, evolved 76 / 5 | 92 / 24, evolved 160 / 14 |
| `y_overheat` | L8 burst 3 to 5 AD | 54 / 4 | 96 / 15 |
| `y_skyhook` | L8 hook and slam 9 to 14 AD | 31 / 16 | 69 / 20 |
| `y_impale` | L8 14 to 20 AD, Pillory 16 to 24 | 67 / 20, evolved 75 / 27 | 92 / 98, evolved 92 / 25 |
| `y_heft` | L8 lunge 6 to 10 AD | 19 / 40 | 44 / 5 |

Measured without a change: Skybreaker 10 / 25 crowd and one with the four-hit string (raising launch and crash to 9 and 7 moved nothing measurable, so it went back); Barbed Jaws 113 / 18 and evolved 93 / 10; Kindling about 0 (a Heat economy, no damage of its own); Warpath -12 / -23 and evolved 59 / 9.
Hulda after her contact fix, with the grab drive: Wrecking Throw 19 / -1, Giant Swing 9 / -1, Crushing Grip 19 / 16, Spirit Bear 61 / 13 (evolved 174 / 55), Skyfall Breaker 230 / 281 (level 1 5 / 23, evolved 707 / 730).

Ultimates per cast at charge level 3 against Crystal Nova's per cast:

| Ultimate | Before | After |
| --- | --- | --- |
| Starfall L8 | 5.1x at 12 | 5.6x and 6.6x at 14 |
| Starfall evolved | 12.8x | 14.2x |
| Phantom Legion L8 | 4.6x at 16 | 5.8x and 5.9x at 21 |
| Phantom Army | 5.4x at 4.5 | 10.3x and 12.1x at 9, 6.8x and 7.1x at 11 |

### Sun Hawk, Skyfall Breaker and Peerless Edge

A short follow-up put the last precise skills on the rule and measured them on the late target (three or four runs) and the crowd (two runs), at the model's trigger rates (parries 0.2 a second, a Skyfall catch every 5 s).

- Sun Hawk: a call's hawks dive only the foe the parry met and fly off once it falls (before, they hunted the nearest foes for 6 s).
- Peerless Edge: the cross cut strikes only the foe the Keen move paid off on; its 15 AD ring in 50 px is gone.
- Skyfall Breaker already struck only the caught foe with its slam and pounds; dragged foes take only the ring, its own area.

| Skill | Change | Before crowd / one | After crowd / late |
| --- | --- | --- | --- |
| `y_hawk` | rule; L8 dive 15 to 42 AD | 467 / 66 (round 2) | 289 / 181 |
| `y_hawk` evolved | rule; Sunflock 12 to 90 AD | about 1,000 (round 1) | 544 / 378 |
| `h_skyfall` | L8 slam 45 to 46 | 230 / 281 | about 200 / 170 to 250 |
| `h_skyfall` evolved | Comet Grab 120 to 65 | 707 / 730 | 506 / 444 |
| `k_keen` evolved | cross cut 60 AD with a ring to 330 AD on one foe | 467 / 229 (late 292 at 250) | 314 / 378 |

Keen Edge level 8 reads 208 on the late target (three runs), so Peerless Edge is 1.8 times it there; at 600 AD it read 834 late but 692 on a crowd, since each cross cut on a husk counts its whole overkill, so 330 is the compromise with the crowd figure near 300.
Skyfall Breaker's runs at 45 and 48 spread from 128 to 297 on the late target; 46 sits in the middle.

### Still off after round 3

- Perfect Rhythm reads about 144 on one foe: each primed bolt is its own pull-off, so a crowd finds a fresh foe for every bolt while a lone foe dies to the first and the next walks in; raising the bonus lifts the crowd figure as fast.
- Iron Counter's one-foe figure follows how often a counter grab lands on a lone foe (0.07 a second against 0.1 injected); at the injected rate it reads 141.
- Peerless Edge is 1.8 times level 8 on the late target, a little under the 2 to 3 asked, held there by the crowd figure.
- Phantom Army is noisy, 7 to 12 times Crystal Nova at 9 and 11; 15 is not reached.
- Hulda's grab and throw skills (Wrecking Throw, Giant Swing, Crushing Grip) barely move the room: a wave 2 husk dies to the knees before the throw. These rows were left to Hulda's own pass.
- Sky Dance was not measured: in the room the air string ends after one whiff on ground foes, so the stomp never comes.
- Warpath and Deep Heft on one foe still read near zero; the charge and the lunge carry her past the lone foe.
- Rift Wound and Ember Brand on one foe are capped by the room's elite dying; the late target is the better read for damage over time.
