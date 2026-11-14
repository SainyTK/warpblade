# Skill balance, measured

The balance passes on Kael's skills in the real game, 7 and 8 November 2026 (after main 8f3fa9f).
They measure every skill at level 1, level 8 and evolved, tune the clear outliers in the data rows and record what is still off.
The play model and bands come from the design review of the skill designs; this file states them as used.
The method and the bands are the ones every hero is measured with, and Kael's figures are the reference.

## How it was measured

Every figure comes from the game itself through the playtest harness (`agent-studio/playtest`), in a test room.

- The run starts at wave 2 and hero level 1 with only the skill under test (`?build=<id>:1`, `<id>:8` or `evolve:<id>`), so levels from picks and charms stay out.
- Once the first wave starts, the wave's stream is stopped and the room keeps its own foes: a crowd of 6 (four husks and two wisps), or one foe with an elite's HP (a husk at three times its HP, with no chest).
  A fallen foe comes back 0.35 s later near the hero, as the stream refills; the hero's HP is kept full.
- A fixed scripted player plays 5 s of warm-up and 60 s of measured play: the skilled bot's movement, dodges and J, plus every button an ordinary player uses at fixed intervals (for Kael, a jump string every 6 s and a dash through a foe every 4 s).
  It casts a skill's spell first when that spell is ready, and Blink Step's K once per string.
  The same routine runs with the base kit, so the difference is the skill's own.
- Hard triggers run at the model's rates through the kit's own functions: a perfect dodge every 7 s and a Keen blow on 30% of follow-up blows (40% with the wider window).
  Where the bot made a skill's trigger more often on its own (Mirror Knight's perfect dodges), the skill's figure is scaled down to the model's rate.
- A skill's figure is the damage per second it adds over the base kit, counted on the sources it can change: attacks and its own id for attack, movement, dot, summon and passive skills, abilities and its own id for spells, the ultimate and its own id for ultimates.
  The base kit was measured three times with different room seeds; its spread is the noise (5 to 35 a second).
- Figures are raw damage per second at hero level 1 (Kael's AD is 10), so heroes compare directly; divide by the stat for AD or AP multiples.

Limits of the room: the bot attacks almost all the time and the crowd stands within reach, so absolute figures sit above an ordinary player's; the bands below are set from the same room, so the ratios hold.
Skills the scripted player cannot drive well read near zero and were marked unmeasured in the first round: Rift Wound, Skybreaker and Sky Dance.

## Bands in the room

The anchor is the median of the easy attack, spell and summon skills measured in the first round, at level 8 on a crowd: about 70 a second.

| Kind | Level 8 target, raw per second |
| --- | --- |
| Easy, crowd | 70 |
| Timed | 112 |
| Precise, one foe | 175 to 210; on a crowd at most about 300 |
| Movement | 0.8 of its band: easy 56, timed 90 |
| Damage over time | 1.1 to 1.4 times the attack band of its risk |
| Evolution | easy about 2 times its level 8, timed about 2.2, precise about 3 (crowd at most about 900) |
| Ultimate | per cast about 6 times the base special at level 8, about 15 times evolved |

Kael's base kit in the room (raw per second): 146 on the crowd and 42 on one foe.

## Measured table (before tuning)

Damage per second each skill adds; "one" is the lone foe, "crowd" the six.

| Skill | Kind | Risk | Target | L1 one | L1 crowd | L8 one | L8 crowd | Evolved one | Evolved crowd |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| k_blink | movement | timed | one | 18 | 33 | 110 | 152 | 150 | 196 |
| k_echo | summon | precise | one | -5 | -0 | 14 | 34 | 40 | 41 |
| k_familiar | summon | easy | one | 25 | 30 | 107 | 269 | 87 | 306 |
| k_flame | spell | easy | crowd | -4 | -12 | 5 | 16 | 22 | 94 |
| k_frost | spell | timed | crowd | -3 | 3 | 12 | 78 | 50 | 146 |
| k_keen | attack | precise | one | 20 | 11 | 91 | 286 | 39 | 256 |
| k_legion | ultimate | easy | crowd | 0 | -36 | 0 | -9 | 0 | 94 |
| k_mirror | summon | precise | one | 21 | 9 | 168 | 394 | 456 | 1230 |
| k_passing | movement | timed | crowd | -0 | 18 | 14 | 62 | 26 | 159 |
| k_phase | attack | timed | one | 3 | 28 | 91 | 225 | 91 | 180 |
| k_reap | attack | easy | crowd | 20 | -2 | 35 | 24 | 57 | 127 |
| k_rift | dot | timed | one | -3 | 6 | 5 | -20 | 5 | -20 |
| k_skydance | movement | timed | crowd | -3 | -8 | 11 | 16 | 6 | 37 |
| k_skyward | attack | timed | crowd | 2 | 10 | 10 | -7 | 103 | -7 |
| k_splinters | dot | easy | crowd | 6 | 27 | 9 | 30 | 6 | 45 |
| k_starfall | ultimate | timed | crowd | - | -40 | 0 | 33 | - | 106 |
| k_volt | spell | easy | crowd | 7 | -1 | 18 | 64 | 60 | 130 |

`k_legion` (Phantom Legion) and `k_starfall` (Starfall) were ultimate skills when they were measured; their phantoms and falling stars are now levels of Crystal Nova's own skill (`docs/skills/kael.md`).
Over the whole 60 s window against Crystal Nova's, Phantom Legion read 0.8 times at level 8 and 3.2 evolved, and Starfall 1.8 and 3.5.

## What changed

Data rows only; the code change of this pass is G3 (below).

| Skill | Change | Why |
| --- | --- | --- |
| `k_mirror` | knight targets 3 to 2 (L4 on); Perfect Reflection area 40 to 15 | 394 crowd at L8, 1,230 evolved (one foe 168 and 456 stay) |
| `k_familiar` | shard 0.8 to 0.3 at L1, 1.4 to 0.5 at L8 | an easy summon at 269 on a crowd, 3.8 times easy |

## Framework

- G3: `markFoe` now takes a source; marks of different sources add, with the kit's own damage-taken bonuses, under the +100% cap (`DAMAGE.takenCap`), and a source's new mark refreshes its own.
  Before, the stronger mark won and a mark without a kit bonus was not capped.
  Every caller passes its skill id; the measured table above already runs with it.

## Card economy

`docs/growth-review/skill-sim.mts` dealt Kael's 20 skills and partners with the game's own card and chest code over 2,000 runs.

| Hero | Greedy median | Steering median | Steering 4 or more |
| --- | --- | --- | --- |
| Kael | 2 | 3 | 8.6% |

On target: about 3 evolutions for a steering player and under 10% with 4 or more; the first evolution comes at wave 24 (median).
The in-game bot does not steer, so full in-game runs were not used for this.

## Bot runs

The skilled bot (`agent-studio/playtest`, `skilled` policy) played Kael's two example builds from his skill note, started at wave 8 (hero level 10, all eight skills at level 3) and wave 15 (level 20, all at level 5), for two waves or until it fell, in one 3-minute game limit.
Game seconds to clear the two waves, or the second it fell:

| Build | From wave 8 | From wave 15 |
| --- | --- | --- |
| duelist (precise) | 30 s, cleared | 57 s, cleared |
| storm (crowd) | 32 s, cleared | fell at 52 s |

One run per build, and the bot uses only J, a reactive L, the HUD tabs and U, so these figures say as much about the bot as about the hero.
The cross-hero target is each hero's best build within 15% of the others' on these jobs, and Kael's times are the reference.

## Still off

- Precise skills on one foe sit under their 175 to 210 band at the model's trigger rates (Keen Edge 91, Phantom Edge 14 without Phase Cut); raising them more needs a decision on how large a single parry or perfect dodge may hit.
- Several timed skills read under band partly because the room cannot drive them (see the list above); they need a scripted check of their own before their numbers move.
- Phantom Legion and Starfall reach about 1 to 2 times Crystal Nova over the window.

## Round 2 (8 November 2026)

The orchestrator's decisions on the open points: bring every precise skill to its band on one foe at the model's trigger rates, bring the weak ultimates to about 6 times the base special per cast, and drive the unmeasured skills.
The room gained a mode: ultimates cast through the game's `castUltimate` at charge level 3 every 10 s (per-cast figures).

### Changes

| Skill | Change | Measured after (raw per second, or per cast) |
| --- | --- | --- |
| `k_keen` | L8 Keen bonus 10 to 20, wave 10 kept | one foe 91 to 227, crowd 545 |
| `k_mirror` | L8 knight strike 50 to 70 | one foe 198, crowd 407 at 0.29 dodges a second (about 200 at the model's rate) |
| `k_legion` | L8 power 2 to 16; Phantom Army 4.5 | per cast 0.7 to 5.9 times Crystal Nova; Phantom Army 36 times at 11, cut to 4.5 (about 15) |
| `k_starfall` | L8 power 3 to 12 | per cast 2.3 times at 3, 3.8 at 8; 12 is set from those two points |

### Still off after round 2

- Kael's base kit reads 85 on the average of one foe and crowd.
- Keen Edge spills far over the precise crowd cap of about 300.
- Rift Wound, Skybreaker and Sky Dance still need a scripted check that drives their own functions.

The bot runs of round 2 gave the same times for both of Kael's builds as round 1.

## Round 3: precise payoffs and unmeasured skills (8 November 2026)

The open points from round 2: precise skills spilled onto crowds (Keen Edge 545), some skills had never been driven, and two ultimates were extrapolated.

### Precise payoff

A precise skill's payoff now lands on the foe the hard move was aimed at: at most `PRECISE_TARGETS` (1) foe per pull-off, the first its move, wave or bolt reaches, nearest first.
Every other foe takes the plain move.
The rule and its code are in `docs/skill-design.md`, "Precise payoff".

- Keen Edge: the Keen bonus and the crystal wave share the Keen move's payoff; the wave passes other foes by.

### Room changes

- Drives: a skill the scripted player never used is measured by playing the move it attaches to at the model's rate, the same way in the skill's run and in the base run, with the hero placed through the game's own state before real keys.
  For Kael: a warp strike every 4 s (Rift Wound) and a four-hit string every 5.5 s (Skybreaker).
- A third target, "late": the lone foe at 12 times its HP (four times the room's elite), the HP against hero damage that level 8 skills meet around wave 20.
  The room's elite dies to one big hit and the next one walks in, so it caps damage over time and overstates bursts, which count their overkill.

### Changes and measurements

Raw added damage a second in the room at the model's trigger rates; level 8 unless marked.
Before is main at ef383d3, after is this round; one or two runs per figure for driven skills, two to five for precise ones (a single precise run swings by 30 to 50%).

| Skill | Change | Before crowd / one | After crowd / one |
| --- | --- | --- | --- |
| `k_keen` | payoff rule | 514 / 146 | 277 / 176 |
| `k_keen` evolved | payoff rule | 433 / 132 | 467 / 229 |
| `k_rift` | L8 2.4 to 8 AD a layer a second | 6 / 28 | 6 / 47 |

Measured without a change: Skybreaker 10 / 25 crowd and one with the four-hit string (raising launch and crash to 9 and 7 moved nothing measurable, so it went back).

Ultimates per cast at charge level 3 against Crystal Nova's per cast:

| Ultimate | Before | After |
| --- | --- | --- |
| Starfall L8 | 5.1x at 12 | 5.6x and 6.6x at 14 |
| Starfall evolved | 12.8x | 14.2x |
| Phantom Legion L8 | 4.6x at 16 | 5.8x and 5.9x at 21 |
| Phantom Army | 5.4x at 4.5 | 10.3x and 12.1x at 9, 6.8x and 7.1x at 11 |

### Peerless Edge

A short follow-up put Peerless Edge on the rule and measured it on the late target (three or four runs) and the crowd (two runs), at the model's trigger rates.

- Peerless Edge: the cross cut strikes only the foe the Keen move paid off on; its 15 AD ring in 50 px is gone.

| Skill | Change | Before crowd / one | After crowd / late |
| --- | --- | --- | --- |
| `k_keen` evolved | cross cut 60 AD with a ring to 330 AD on one foe | 467 / 229 (late 292 at 250) | 314 / 378 |

Keen Edge level 8 reads 208 on the late target (three runs), so Peerless Edge is 1.8 times it there; at 600 AD it read 834 late but 692 on a crowd, since each cross cut on a husk counts its whole overkill, so 330 is the compromise with the crowd figure near 300.

### Still off after round 3

- Peerless Edge is 1.8 times level 8 on the late target, a little under the 2 to 3 asked, held there by the crowd figure.
- Phantom Army is noisy, 7 to 12 times Crystal Nova at 9 and 11; 15 is not reached.
- Sky Dance was not measured: in the room the air string ends after one whiff on ground foes, so the stomp never comes.
- Rift Wound on one foe is capped by the room's elite dying; the late target is the better read for damage over time.

## Since these rounds

The moveset rework of 13 November 2026 gave Kael the guard, the counter, the wide forms, Crystal Aegis and Spellwarp, and folded Phantom Legion and Starfall into Crystal Nova's skill.
Those have not been through the room; their budgets are the design estimates in `docs/skills/kael.md`, "Balance".
The eight sword heroes of patch 0.11.0 were each measured in a room of their own built to this method; their figures and what is still off are in each hero's skill note (`docs/skills/<id>.md`).
Those rooms differ from this one and from each other, so their figures compare only within one hero.
