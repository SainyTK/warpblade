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
