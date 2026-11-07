# Ysra skills

Ysra's half of the skill rework (`docs/skill-design.md`).
Working design: the numbers are starting values, checked against the contract's budget below.
Damage is written as a multiple of attack damage (AD) for glaive blows and of ability power (AP) for fire, the way her kit already deals it.
At hero level 1 her AD is 13 and her AP is 7.

## Base kit

Her walk, jump, vault, dive, brace, parry and backstep stay exactly as they are: the owner's movement standard.
`comboHits` is 3.
The air string limit is 1 sweep; `y_vault` raises it to 2 from its level 2.

| Button | With no skill |
| --- | --- |
| J on the floor | The glaive string, 3 blows: hip thrust (1.25 AD), a middle blow picked by the situation, impale finisher (2.3 AD, no pin). |
| J, middle blow | Reverse sweep (1.4) by default; twirl (0.85 each side) when foes stand on both sides; haft ram (1.1) when the foe is only behind; overhead cleave (1.9) on a foe knocked down in front; sky thrust (1.2) when a foe hovers overhead; ground lash (1.0, drags the foe in) when the nearest foe ahead stands past the thrust's reach (40 to 60 px), which is where the hip thrust's knockback leaves it. |
| Hold J | Heft on the first blow: quick poke (1.0) or the lunge (1.3 to 3.0, pierces the line, 60 px). |
| J in the air | One air reap (1.3). |
| J in a vault's flight | The vault crash (1.9 AD in 36 px), moved into the base kit from Vault Strike. |
| K | Vault on the floor, also out of a brace or a backstep's hop. In the air: the dive (1.5 impact, 0.75 on the way down). |
| L | Hold to brace, a press just before a blow parries (stun 1 s, slow motion, 25 stamina back, 5 Flow). L with a side held away is the backstep. |
| Up | Her one jump. |
| I | The selected rite. Flare: 30 Heat, 4 AP around her, throws foes back, heals 5% HP. Cinder Lash: 25 Heat, a whip of fire 70 px along the floor ahead, 3 AP to each foe on it, the nearest dragged 30 px in. |
| O | Switches between Flare and Cinder Lash, and the rite skills she owns. |
| U | Pyre Wave, her special. |

Heat works as today: 6 per foe for a string blow, 12 for a lunge, crash, dive or counter, drains after 2.5 s.

## What goes away and where it went

| Today | Change |
| --- | --- |
| Up + J Skyhook (in a string and out of a jump) | Input removed. The hook comes back as `y_skyhook`, picked by the situation: it replaces the sky thrust when a foe hovers overhead. |
| Down + J Ground lash | Input removed. The lash stays in the base kit as the middle blow when the foe stands just out of reach. |
| Down + J Windmill (skill) | `y_windmill`: replaces the twirl when she is surrounded. |
| Long String, combo growing with level | Gone. The string is 3 blows all run. |
| Warpath double tap | Input removed. `y_warpath` charges on its own after she walks one way for a moment. |
| Vault Strike | The crash is base kit. `y_vault` grows it. |
| High Reaper, Skyline, Earthshaker | Levels of `y_vault` (second air sweep, air vault, shockwave). |
| Deep Heft, Skewer, Rail Lance, Long Haft reach | Levels of `y_heft`. Long Haft's damage share is left to the Might charm. |
| Impale pin | `y_impale`. |
| Counter Thrust, Ember Parry window, Firm Stance | Levels of `y_counter`. |
| Kindling, Molten Guard, Hearthfire, Unbroken | Levels of `y_kindling`. |
| Searing Edge, Ashen Wake | `y_searing`, `y_ashen`, now stacking damage over time. |
| Flame Pillar, Brazier, Overheat | Spell skills in the rite rotation. Overheat becomes a rite of its own (no longer hidden behind a full bar). |
| Pyre Colonnade | `y_pillar`'s evolution, with the same partner idea (Kindling). |
| Sunspear, Volcanic Rift | Ultimate skills. |
| Phoenix Dive | `y_dive`'s evolution. Its phoenix drawing and floor flood are reused there. |
| Bulwark, Hot Iron | Dropped. Bulwark's push cut was a small effect; Hot Iron tied three skills together in one rule. |

Kept inputs: brace then K, and backstep then K, still vault.
They are her escape and part of the movement the owner likes, and they follow a guard, never a combo.

## Ordinary play model

Every DPS figure below uses these assumptions, at hero level 1 with no charm and no Flow.

- A full string takes about 2.4 s (clip times at 0.92 attack speed, the 0.5 s combo cooldown and hit stops). In ordinary play she lands one every 3.4 s: 0.29 strings and 0.88 blows per second.
- Base string on one foe: 4.95 AD per string, about 19 DPS. Flare adds about 5 (Heat income about 5.3 per second on one foe). Base kit total: about 24 DPS on one foe.
- Crowd of 6: a glaive blow strikes 3 of them. Heat income about 16 per second. Base kit: about 100 DPS (string 57, Flare 45).
- A heft player lunges about every 3.5 s; a vault player crashes about every 3 s; a diver dives about every 4 s.
- A good player parries about once every 5 s (0.2 per second) in a crowded fight.
- Rites: one foe gives a 40 Heat rite about every 7.5 s; a crowd about every 2.5 to 3 s, since casting stops her attacking.
- Burn (the existing status) is 0.5 AP per second and does not stack. Scorch and Brand are new stacking statuses.
- Ultimates are averaged over their cooldown with a charge of level 3 (power 7) each time.

A skill's DPS is what it adds to the base kit, except spells and ultimates, which show their own gross damage (Flare is 5 / 45 and Pyre Wave about 3 / 12 for comparison).

Budget targets I tuned to, from the contract's ratios:

| Risk | Level 1, one foe | Level 8, one foe | Level 8, crowd |
| --- | --- | --- | --- |
| easy | about 4 | about 30 | about 90 |
| timed | about 6 | about 48 | about 145 |
| precise | about 10 | 75 to 90 | single target |

Attack, movement, spell, summon and ultimate skills grow about 6.5 times from level 1 to 8.
Damage over time skills grow about 10 times, so they start below an attack skill of their risk and pass it at level 7.

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner |
| --- | --- | --- | --- | --- | --- |
| `y_heft` | Deep Heft | attack | timed | J (hold) | `y_warpath` |
| `y_impale` | Impale | attack | timed | J (finisher) | `y_skyhook` |
| `y_windmill` | Windmill | attack | easy | J (surrounded) | `y_searing` |
| `y_counter` | Counter Thrust | attack | precise | L (parry), then J | `y_brand` |
| `y_skyhook` | Skyhook | attack | timed | J (foe overhead) | `y_vault` |
| `y_vault` | Vault Strike | movement | timed | K, J in flight | `y_ashen` |
| `y_dive` | Falling Star | movement | timed | K in the air | `y_hawk` |
| `y_warpath` | Warpath | movement | easy | auto (walking) | `y_impale` |
| `y_pillar` | Flame Pillar | spell | timed | I | `y_kindling` |
| `y_brazier` | Brazier | spell | easy | I | `y_salamander` |
| `y_overheat` | Overheat | spell | timed | I | `y_searing` |
| `y_searing` | Searing Edge | dot | easy | auto (J blows) | `y_kindling` |
| `y_ashen` | Ashen Wake | dot | timed | auto (travel) | `y_dive` |
| `y_brand` | Ember Brand | dot | precise | L (parry) | `y_impale` |
| `y_shade` | Glaive Shade | summon | easy | auto (blow landed) | `y_windmill` |
| `y_salamander` | Salamander | summon | timed | auto (rite cast) | `y_pillar` |
| `y_hawk` | Sun Hawk | summon | precise | auto (parry) | `y_counter` |
| `y_kindling` | Kindling | passive | easy | auto | `y_overheat` |
| `y_sunspear` | Sunspear | ultimate | timed | U | `y_heft` |
| `y_rift` | Volcanic Rift | ultimate | easy | U | `y_overheat` |

Kinds: attack 5, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 2.
The precise skills all hang off the parry, her one hard read.

### `y_heft` Deep Heft

Attack, timed, J held. The held lunge winds faster and learns to carry, rail and burst.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | windRate 1.25, power 4.2, travel 60, reach 0, skewer 0, rail 0, guardAll 0, tip 0 | Hold J: a faster wind and a harder lunge. |
| 2 | travel 80, reach 6 | The lunge runs farther and every blow reaches further. |
| 3 | skewer 1 | A full lunge carries a foe and slams it down. |
| 4 | power 5 | Lunge damage +20%. |
| 5 | rail 0.5 | The line is struck again after the lunge. |
| 6 | windRate 1.6, guardAll 1 | Winds faster; nothing touches you in the lunge. |
| 7 | tip 1.5 | The lunge bursts at its tip. |
| 8 | power 6 | Lunge damage +20%. |

Evolution, Rail Lance (with `y_warpath`): a full lunge travels 140 px and the rail runs out and back at 0.6 times; J while Warpath charges releases a full lunge at once (`railLunge`).
Built in `glaive/heft.ts` and `glaive/lunge.ts` (wind rate, travel, Skewer, rail, return rail, untouchable travel, tip burst through `burstEmbers`); reach in `glaive/reach.ts`.

### `y_impale` Impale

Attack, timed, the string's last blow. The finisher pins foes, and pinned foes take more from everything.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | power 4, pin 1, taken 0.25, ignite 0, past 0, burst 0, twist 0, stakes 0 | The last blow pins foes, and pinned foes take more damage. |
| 2 | power 4.8, taken 0.4, ignite 2 | Pins hurt more and set foes burning. |
| 3 | power 5.5, pin 1.5, past 24 | The impale bursts past its tip; pins last longer. |
| 4 | power 7 | Impale damage +25%. |
| 5 | power 8.5, burst 2 | Pinned foes burst when they fall. |
| 6 | power 10, pin 2, taken 0.7 | Pins last longer and hurt more. |
| 7 | power 12, twist 0.5 | The impale strikes twice. |
| 8 | power 14, taken 1 | Impale damage up; pinned foes take double. |

Evolution, Pillory (with `y_skyhook`): the impale drives a row of burning stakes 80 px ahead; every foe in the row is struck at half the impale and pinned 3 s, the impale deals 16 AD, and pinned foes burst for 4 AD when they die. The pin bonus stays capped at +100% (G3).
Built in `glaive/blows/string.ts` (impale and `impaleTwist` from the row), `ysra/pin.ts` (pin through `markFoe`, so it sums under the cap), `glaive/stakes.ts` with `glaive/effects/stakes.ts`, and the death burst in `src/game/skills/ysra/impale.ts` (a burst kill never bursts again).

### `y_windmill` Windmill

Attack, easy, J when foes stand on both sides. The twirl becomes a spinning windmill that draws the crowd in.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | passes 4, power 0.2, pull 20, stagger 0, ring 0, embers 0, ahead 0 | Surrounded, the twirl becomes a windmill that draws foes in. |
| 2 | passes 5, power 0.22 | One more pass. |
| 3 | power 0.25, pull 40, stagger 0.5 | Draws from farther away and staggers foes. |
| 4 | power 0.3 | Windmill damage +20%. |
| 5 | ring 1.5 | The windmill ends in a ring of fire. |
| 6 | power 0.33, embers 0.15 | Each pass throws an ember. |
| 7 | power 0.36, ahead 1 | Spins into a crowd in front too. |
| 8 | power 0.4, ring 2, embers 0.2 | Windmill damage +10%, a hotter ring. |

Evolution, Fire Wheel (with `y_searing`): after the windmill a wheel of fire spins around her for 1.5 s as she walks, six passes a second at the windmill pass power, drawing from 70 px and laying a Scorch stack each pass; the windmill also starts on a lone foe.
Built in `glaive/blows/variants.ts` (`windmill` and `windmillFull`), `glaive/windmill.ts` (pull, stagger, embers, ring through `castFlare`), and the wheel in `src/game/skills/ysra/windmill.ts` on the kit's `spin` event. The wheel is a drawn ring of fire around her, so her walk and clips stay as they are.

### `y_counter` Counter Thrust

Attack, precise, a parry then J. The parry opens a counter that hits very hard and turns into a buff.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | power 8, window 0.12, firm 0, crit 0, stun 1.1, line 0, refill 0, riposte 0 | After a parry, J is a counter thrust. |
| 2 | power 9, window 0.18, firm 0.3 | A wider parry window and cheaper blocks. |
| 3 | power 11, crit 1, stun 1.5 | The counter always crits and stuns longer. |
| 4 | power 13 | Counter damage +20%. |
| 5 | power 15, line 70 | The counter runs through the line. |
| 6 | power 17, window 0.24, refill 1 | Wider parry window; counters refill stamina. |
| 7 | power 20, riposte 1, riposteTime 3 | Counters empower your next blows. |
| 8 | power 25 | Counter damage +25%. |

Evolution, Sun Piercer (with `y_brand`): the counter is a burning thrust across the whole stage for 60 AD (always a crit), and for 4 s after it every glaive blow is a crit.
Built in `glaive/counter.ts` (power, reach, sure crit, stun, stamina refill, Riposte and crits in `ysra/buffs.ts`) and `stance/parry.ts`, `stance/brace.ts` (window and block cost). Riposte adds into the one blow bonus sum (G4).

### `y_skyhook` Skyhook

Attack, timed, J when a foe hovers overhead. Her answer to flyers: hook them down where the glaive reaches.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | power 2, stun 0.8, cone 0, slam 0, ground 0, reach 0, rise 0, heap 0 | A foe overhead is hooked down to the floor. |
| 2 | power 2.8, stun 1.2 | A harder hook and a longer stun. |
| 3 | power 3.5, cone 1 | Hooks every flyer above you. |
| 4 | power 4.2, slam 3 | Hooked foes slam into the floor. |
| 5 | power 5, slam 4, ground 4 | Hooked flyers cannot fly for a while. |
| 6 | power 6, slam 5 | Hook damage +20%. |
| 7 | power 7.5, slam 6.5, reach 70, rise 20 | Reaches higher and lifts you with it. |
| 8 | power 9, slam 9 | Hook and slam much harder. |

Evolution, Heaven's Hook (with `y_vault`): every flyer within 100 px is hauled into a heap at her feet and slammed for 12 AD, and the vault recharges at once.
Built in `glaive/hook.ts`: struck flyers are dragged down at spike speed along a burning hook line, slam on landing, and stay pinned (grounded) for the level's seconds. No new enemy field: grounding uses the pin.

### `y_vault` Vault Strike

Movement, timed, K then J in flight. The vault crash grows, the air opens up, and landings shake the floor.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | crash 2.4, reach 44, sweeps 1, quake 0, quakeRange 0, quakeStun 0, airVault 0, cooldown 0.95, launch 0, ring 0 | The vault crash hits harder and wider. |
| 2 | crash 2.6, sweeps 2 | Air string +1, and sweeps can follow a vault. |
| 3 | crash 2.8, quake 0.5, quakeRange 96 | Landings send a shockwave along the floor. |
| 4 | crash 3, quake 0.6 | Crash damage +7%, a stronger wave. |
| 5 | crash 3.2, airVault 1 | Vault again in the air. |
| 6 | crash 3.5, cooldown 0.7, launch 1 | Vaults recharge faster; the crash launches. |
| 7 | crash 3.7, quake 0.9, quakeRange 130, quakeStun 0.5 | A stronger, longer shockwave that stuns. |
| 8 | crash 4, ring 1 | The crash burns. |

Evolution, Skyfall (with `y_ashen`): the crash comes down as a burning meteor, 8 AD in 60 px, the shockwave crosses the whole floor, the floor cracks both ways and the crater burns for 3 s.
Built in `stance/moves.ts` (crash power, width, launch, ring), `stance/stance.ts` (crash in the base kit, second sweep, air vault), `stance/landing.ts` (shockwave) and `stance/skyfall.ts`.

### `y_dive` Falling Star

Movement, timed, K in the air. The dive becomes a weapon: a pull, a second drop, a burning line.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | power 2, reach 36, spring 0, pull 0, dives 1, skewer 0.75, burn 0, launch 0, ring 0 | The dive hits harder and wider. |
| 2 | power 2.2, spring 24 | Spring out of the impact. |
| 3 | power 2.5, pull 50 | The impact draws foes in. |
| 4 | power 2.8 | Impact damage +12%. |
| 5 | power 3, dives 2 | Dive twice before you land. |
| 6 | power 3.3, skewer 1, burn 2 | The dive's line burns. |
| 7 | power 3.6, launch 1, ring 1 | The impact launches and burns. |
| 8 | power 4, ring 1.2 | Impact damage +11%, a hotter ring. |

Evolution, Phoenix Dive (with `y_hawk`): she dives wrapped in a burning phoenix, 9 AD in 70 px, floods the floor with fire for 3 s, three dives per airtime.
Built in `stance/dive.ts`, `stance/landing.ts` (pull, ring), `stance/spring.ts` and `stance/phoenixCrash.ts` (wings and flood); the Phoenix Dive ultimate and `densestSpot.ts` are deleted.

### `y_warpath` Warpath

Movement, easy, automatic. Her steady stride builds into a charge on its own, with no new input.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | after 0.6, shoulder 0.35, launch 0, elites 0, impale 1.7, impale2 0.9, block 0, knock 0, bowl 0 | Keep walking to charge; J while charging impales. |
| 2 | after 0.4, shoulder 0.4 | Charge sooner, shoulder harder. |
| 3 | shoulder 0.6, launch 1, elites 1 | Shoulder harder, through bigger foes. |
| 4 | impale 1.9, impale2 1 | Running impale +10%. |
| 5 | block 1 | Your charge blocks blows from the front. |
| 6 | shoulder 0.8, knock 0.6 | Shoulders knock foes down. |
| 7 | impale 2, impale2 1.1, bowl 0.8 | The impale bowls foes over. |
| 8 | shoulder 1, impale 2.2, impale2 1.2 | Harder shoulders and impale. |

Evolution, Juggernaut (with `y_impale`): the charge gathers every minion it meets on the glaive; the end of the charge slams them all for 8 AD and pins them.
Built in `stance/warpath.ts`: a walk timer starts the charge (the run key or a far stick push charges at once), shoulders, front block, carry and slam; the bowl is `glaive/bowl.ts`. The charge runs at her shared run speed, so the design's speed step was dropped.

### `y_pillar` Flame Pillar

Spell, timed, I (rite). A pillar under the foe ahead; aim matters.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | cost 40, power 6, pull 0, width 1, column 0, heal 0, count 1, colonnade 0 | A rite: a pillar of fire under the foe ahead. |
| 2 | cost 32, power 7, pull 12 | Costs less Heat; the sigil draws foes in. |
| 3 | power 8, width 1.6 | A wider pillar. |
| 4 | power 11 | Pillar damage +35%. |
| 5 | power 13, column 2 | The pillar keeps burning. |
| 6 | cost 26, power 15, heal 0.03 | Cheaper, and it heals you. |
| 7 | power 18, count 2 | Two pillars. |
| 8 | power 22 | Pillar damage +20%. |

Evolution, Pyre Colonnade (with `y_kindling`): pillars burst at 26 AP under a ringed sigil, and two flank pillars burst 30 px either side 0.12 s later at 0.7 times.
Built in `pyre/release.ts` and `spells/rites/flamePillar.ts` (power, width, sigil pull, burning column, source); `pyreColonnade.ts` is folded into `release.ts`.

### `y_brazier` Brazier

Spell, easy, I (rite). A planted turret that spits embers on its own.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | cost 50, every 0.9, life 6, ember 0.6, burn 1.5, aura 0, pierce 0, shots 1, burst 0, altar 0 | A rite: a brazier that spits embers at foes. |
| 2 | aura 0.5 | The brazier burns foes that touch it. |
| 3 | ember 0.65, pierce 1 | Embers pierce. |
| 4 | life 10, ember 0.75 | Hotter embers, a longer fire. |
| 5 | ember 0.8, shots 2 | Two embers each shot. |
| 6 | every 0.5, ember 0.85 | Shoots faster. |
| 7 | ember 0.9, burst 6 | The brazier bursts at the end. |
| 8 | ember 1, burn 2.5 | Hotter embers that burn longer. |

Evolution, Forge Altar (with `y_salamander`): an altar that stands 15 s, fires three embers a shot, and lets out a salamander every 3 s through the kit's `altar` event (with or without Salamander held at that moment, it uses Salamander's current level).
Built in `spells/rites/brazier.ts` and `emberShot.ts` from a spec (life, rate, shots, pierce, aura, burst, altar); its hits count as `y_brazier`.

### `y_overheat` Overheat

Spell, timed, I (rite, needs 60 Heat, spends all of it). Bank Heat, then burn it in a short frenzy.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | least 60, time 6, rate 1.2, burst 0.9, radius 16, feed 0, nova 0, reach 0, perKill 0 | A rite: spend all your Heat to burn hot. |
| 2 | feed 0.5 | Overheat feeds on your blows. |
| 3 | radius 28 | Wider bursts. |
| 4 | rate 1.35, burst 1.5 | Faster and hotter. |
| 5 | nova 8 | Overheat ends in a nova. |
| 6 | reach 16 | Your blows reach further. |
| 7 | perKill 0.5 | Kills extend Overheat. |
| 8 | rate 1.6, burst 3 | Much faster and hotter. |

Evolution, Sunheart (with `y_searing`): Overheat holds while blows keep landing (1.5 s grace), each burst adds 2 Scorch stacks, and the end nova is 20 AP.
Built in `pyre/heat.ts` (length from Heat spent, feed, hold, kills), `pyre/strikeHeat.ts` (bursts), `pyre/pyre.ts` (attack speed, reach, nova) and `src/game/skills/ysra/overheat.ts` (kills).

### `y_searing` Searing Edge

Dot, easy, automatic on J blows. Blows lay Scorch stacks; weak alone, a furnace late.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | from 0.5, perSecond 0.3, duration 3, max 3, guard 0, heavy 1, flare 0 | Hot blows scorch foes. |
| 2 | guard 1 | Your guard scorches too. |
| 3 | perSecond 0.4, duration 4, max 5 | More stacks, burning longer. |
| 4 | perSecond 0.45 | Scorch +12%. |
| 5 | from 0, perSecond 0.5 | Every blow scorches. |
| 6 | perSecond 0.55, heavy 2 | Heavy blows scorch twice. |
| 7 | perSecond 0.65, max 8, flare 0.1 | Scorch stacks to 8 and flares. |
| 8 | perSecond 0.75, duration 5 | Scorch hotter and longer. |

Evolution, Wildfire (with `y_kindling`): a scorched foe that dies throws its stacks onto every foe within 50 px, and a foe at full stacks bursts for twice their remaining damage in 30 px and drops to 0; a foe a spread reached cannot spread or burst for 0.5 s (G5).
Built in `src/game/skills/ysra/searing.ts` and `scorch.ts` on the shared `addStacks`; the glaive flame is `pyre/glaiveFire.ts`.

### `y_ashen` Ashen Wake

Dot, timed, automatic on her travel. Her path burns; she has to travel through and over the crowd.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | life 3, tick 0.45, lunge 0, halfWidth 5, overlap 1, ring 0, slow 0 | Your vaults and dives leave burning ground. |
| 2 | tick 0.5, lunge 1 | Lunges and charges burn the floor too. |
| 3 | life 4, tick 0.6, halfWidth 7 | The fire lasts longer and spreads wider. |
| 4 | tick 0.8 | Fire damage +33%. |
| 5 | tick 1, overlap 2 | Fire on fire burns twice. |
| 6 | tick 1.2, ring 40 | Landings ring the floor with fire. |
| 7 | tick 1.5, slow 0.3 | Hotter fire that slows. |
| 8 | life 5, tick 1.8 | Hotter, longer fire. |

Evolution, Scorched Earth (with `y_dive`): a vault or dive landing sets off every settled patch she has laid (up to 14), each erupting as a small pillar for 5 AP.
Built in `pyre/ashenWake.ts` and `spells/rites/cinder.ts`; at most `overlap` patches burn one foe per tick (1, then 2 from level 5).

### `y_brand` Ember Brand

Dot, precise, a parry. The parried foe is branded, and every blow on it feeds the brand.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | duration 4, perSecond 0.8, max 4, parry 2, slow 0, block 0, spread 0, taken 0 | A parry brands the attacker; your blows feed the brand. |
| 2 | duration 6, perSecond 0.9, slow 0.2 | The brand lasts longer and slows. |
| 3 | perSecond 1, max 6 | More stacks. |
| 4 | perSecond 1.4 | Brand +40%. |
| 5 | perSecond 1.8, block 1 | Blocks brand too. |
| 6 | perSecond 2.3, spread 30 | The brand spreads on a parry. |
| 7 | perSecond 3, max 8 | Hotter brand, more stacks. |
| 8 | perSecond 4, taken 0.2 | Branded foes take more from you. |

Evolution, Pyre Mark (with `y_impale`): an impale or counter on a branded foe spends the brand: its stacks times 12 AP at once in 40 px, which brands every foe it reaches with 2 stacks (those cannot be set off for 0.5 s).
Built in `src/game/skills/ysra/brand.ts` and `brandMark.ts`; a parry lays 2 stacks.

### `y_shade` Glaive Shade

Summon, easy, automatic on a landed blow. A spectral temple guard steps out behind her and thrusts through the line.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | chance 0.15, cooldown 2, power 0.8, thrusts 1, stay 0, stagger 0, sides 1, host 0 | Your blows may call a shade that thrusts through the line. |
| 2 | thrusts 2 | The shade thrusts twice. |
| 3 | chance 0.2, cooldown 1.5 | Shades come more often. |
| 4 | power 0.9 | Shade damage +12%. |
| 5 | power 0.95, thrusts 3, stay 2 | The shade stays and fights. |
| 6 | power 1, stagger 0.5 | Shade thrusts stagger. |
| 7 | power 1.1, sides 2 | Two shades, back to back. |
| 8 | chance 0.35, power 1.2 | Shades come often and hit harder. |

Evolution, Temple Host (with `y_windmill`): three shades stand behind her for good and thrust in a fan whenever she lands a blow (at most every 0.4 s).
Built in `src/game/skills/ysra/shade.ts` and `shadeBody.ts`: her hip thrust guard and hit poses drawn once and blitted pale blue; copies deal their own power only (G2).

### `y_salamander` Salamander

Summon, timed, automatic on a rite. A fire salamander runs out along the floor and bites what it meets.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | chance 0.5, cooldown 3, life 4, bite 1.2, every 0.5, trail 0, count 1, flyers 0, burst 0, drake 0 | Rites may call a salamander. |
| 2 | chance 0.65 | Salamanders come more often. |
| 3 | trail 0.2 | The salamander's trail burns. |
| 4 | bite 1.4 | Bites harder. |
| 5 | count 2 | Two salamanders. |
| 6 | life 6, flyers 1 | Lasts longer and leaps at flyers. |
| 7 | burst 5 | Salamanders burst at the end. |
| 8 | chance 0.8, bite 1.8 | Comes more often and bites harder. |

Evolution, Magma Drake (with `y_pillar`): a rite calls a drake that walks behind her for 10 s and breathes fire 80 px along the floor every second, 4 AP to each foe.
Built in `src/game/skills/ysra/salamander.ts` and `salamanderBody.ts` (a code-drawn lizard, twice the size for the drake).

### `y_hawk` Sun Hawk

Summon, precise, automatic on a parry. A bird of fire answers the parry and keeps diving.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | chance 0.6, cooldown 3, dives 3, life 0, every 0.5, power 2.5, block 0, burn 0, burst 0, most 1 | A parry may call a sun hawk. |
| 2 | chance 0.8 | The hawk answers more often. |
| 3 | dives 0, life 6, every 1, power 3 | The hawk stays and hunts. |
| 4 | power 3.5 | Dives hit harder. |
| 5 | power 4, block 0.25 | Blocks may call the hawk too. |
| 6 | chance 1, power 4.5, burn 2 | Every parry calls a burning hawk. |
| 7 | power 5, burst 24 | Dives burst. |
| 8 | every 0.8, power 6, most 2 | Two hawks, faster dives. |

Evolution, Sunflock (with `y_counter`): a parry calls five hawks that dive the attacker together for 10 AD each and then hunt for 6 s; while two or more fly she takes 20% less damage.
Built in `src/game/skills/ysra/hawk.ts` with `drawPhoenix` at a third of its size; the guard is read by the kit through `buffs.guard`. Every call keeps the 3 s cooldown.

### `y_kindling` Kindling

Passive, easy. Heat economy and her sustain, gathered in one skill.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | gain 1.2, parry 0, block 0, cost 1, drainDelay 2.5, heal 0, low 0, full 0 | Heat builds faster. |
| 2 | parry 25, block 5 | Your guard builds Heat. |
| 3 | cost 0.85 | Rites cost less. |
| 4 | gain 1.4, drainDelay 4 | Heat builds faster and holds longer. |
| 5 | heal 0.03 | Rites heal you. |
| 6 | cost 0.7 | Rites cost even less. |
| 7 | low 0.3 | Burn brighter when near death. |
| 8 | gain 1.7, full 0.15 | A full bar empowers your blows. |

Evolution, Eternal Hearth (with `y_overheat`): Heat never drains, rites cost 40% less (replacing the level 6 cut), and each rite lights the glaive for 3 s (blows +30%, each bursting 1 AD).
Built in `pyre/heat.ts`, `pyre/guardHeat.ts`, `pyre/hearthfire.ts` (`afterRite`) and `pyre/pyre.ts` (full-bar bonus, near-death damage cut).

### `y_sunspear` Sunspear

Ultimate, timed, U (replaces Pyre Wave). A thrown spear down a line; aim it.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | power 1, cooldown 20, line 0, both 0, pin 0, taken 0, rain 0, fan 1, pillars 0 | U throws a burning spear down the line. |
| 2 | line 2 | The spear's line burns. |
| 3 | both 1 | Throw both ways. |
| 4 | power 1.6, cooldown 17 | Harder, and back sooner. |
| 5 | pin 2, taken 0.3 | The spear pins. |
| 6 | cooldown 14 | Back sooner. |
| 7 | rain 1 | Spears rain down. |
| 8 | power 3.2, cooldown 12 | Much harder, back sooner. |

Evolution, Solar Lance (with `y_heft`): three spears in a fan each way at 4 times the charge's power, each ending in a Flame Pillar, cooldown 10 s; at charge 3 about 28 AD a foe from the spear plus the pillar, about 6 times Pyre Wave on one foe and about 15 times on a crowd (measured: one cast about 25 times Pyre Wave's in a wave 6 crowd before this trim).
Built in `ultimates/sunspear.ts`; the cast sets the hero's ultimate cooldown from the row.

### `y_rift` Volcanic Rift

Ultimate, easy, U (replaces Pyre Wave). A crack both ways that erupts under the whole crowd.

| Lv | Numbers | Card |
| --- | --- | --- |
| 1 | power 1.2, cooldown 20, burn 0, reach 1, wave 0, floor 0, heat 0, open 0 | U splits the floor in eruptions both ways. |
| 2 | burn 3 | The crack keeps burning. |
| 3 | cooldown 17, reach 1.5 | A longer crack, back sooner. |
| 4 | power 2 | Eruptions much harder. |
| 5 | wave 0.6 | A second eruption. |
| 6 | floor 1 | The whole floor splits. |
| 7 | heat 5 | Eruptions refill Heat. |
| 8 | power 3.2, cooldown 14 | Much harder, back sooner. |

Evolution, Caldera (with `y_overheat`): the rift stays open 6 s, erupting across the floor every second at 0.25 times the cast's power, each eruption refilling Heat; about 15 times Pyre Wave per cast.
Built in `ultimates/volcanicRift.ts` (`aftermath`: burning crack, second wave, open rift).

## Balance review applied

The shared balance review (`/tmp/wb-skills/balance-review.md`, section 4) replaced this file's play model with one for all four heroes; its figures are the ones to tune against, and the table below is this design's first estimate, kept for the reasoning.
Applied from it, all in the skill data rows (`src/constants/characters/ysra/skills/`):

- Base kit: Cinder Lash as a second base rite, so O switches from the first second.
- `y_impale` level 8 impale 14 AD, and a fourth new property (level 2 sets pinned foes burning).
- `y_counter` level 8 counter 25 AD, always a crit; Riposte +100%; Sun Piercer 60 AD.
- `y_skyhook` level 8 hook 9 AD and slam 9 AD.
- `y_vault` level 8 crash 4 AD, shockwave 0.9 AD, ring 1 AP.
- `y_dive` level 8 impact 4 AD, ring 1.2 AP.
- `y_warpath` level 8 shoulder 1 AD, running impale 2.2 + 1.2 AD, and a fourth new property (level 6 shoulders knock foes down).
- `y_pillar` a fourth new property (level 2 the sigil draws foes in).
- `y_windmill` a fourth new property (level 3 staggers), and the suggested level 8 pass 0.4 AD.
- `y_brazier` level 8 ember 1.0 AP.
- `y_ashen` at most two patches burn one foe at once (level 5), and the suggested level 8 tick 1.8 AP.
- `y_brand` level 8 4 AP a second per stack, a parry lays 2 stacks, Pyre Mark 12 AP per stack.
- `y_searing` the suggested level 8 0.75 AP a second per stack; Wildfire's spreads cannot burst for 0.5 s.
- `y_shade` level 8 thrust 1.2 AD.
- `y_hawk` level 8 dive 6 AD, every call keeps the 3 s cooldown, Sunflock 10 AD.
- `y_rift` Caldera eruptions at 0.25 times the cast.
- `y_kindling` Eternal Hearth's 40% replaces the level 6 cut.
- Shared rules: summons and copies are triggered only by her own hits (skill hits never emit `blow` or `cast`); pin, brand and flare bonuses go through `markFoe`, so one foe's bonus never passes +100%; Riposte, the full-bar bonus and the Eternal Hearth glow add into one blow bonus.

Deviation: the pin and the brand take the stronger of the two marks on a foe, where G3 asks for their sum; both are capped at +100%, and the sum only matters with Impale and Ember Brand on the same foe.

## Balance table

DPS added to the base kit (spells and ultimates gross), hero level 1, no charms, no Flow.
"One" is one foe, "crowd" six foes; the intended target is marked with a star.

| Skill | Risk | L1 one / crowd | L8 one / crowd | Evolved one / crowd | Assumption |
| --- | --- | --- | --- | --- | --- |
| `y_heft` | timed | 6* / 20 | 45* / 140 | 80 / 300 | Lunge every 3.5 s (3.2 at level 6+), line of 4 in a crowd; slam only on minions. |
| `y_impale` | timed | 6* / 17 | 41* / 122 | 74 / 280 | One impale per string; pin bonus on the next 2 blows; 3 of 6 struck. |
| `y_windmill` | easy | 0 / 12* | 0 / 90* | 15 / 200* | Windmill needs a surround; 4 foes drawn into it; about 1.3 windmills per string at level 7+. |
| `y_counter` | precise | 10* / 10 | 75* / 215 | 156* / 450 | 0.2 parries per second, 0.28 at level 6 (wider window); Riposte on 3 blows; line of 3 at level 5+. |
| `y_skyhook` | timed | 6* / 8 | 39* / 115 | 85 / 260 | On flyers only: one hook per string lets the sweep and impale reach the flyer; 3 flyers in the cone. |
| `y_vault` | timed | 6* / 17 | 40* / 120 | 85 / 290 | A crash every 3 s (2.5 s at level 6+); crash strikes 3, shockwave 5. |
| `y_dive` | timed | 5* / 14 | 38* / 130 | 80 / 300 | A dive every 4 s, 0.37 per second with two per airtime; the pull gathers 4. |
| `y_warpath` | easy | 7 / 12* | 21 / 82* | 35 / 190* | A charge pass every 3.5 s through 4 minions, the running impale opening the string. |
| `y_pillar` | timed | 6* / 10 | 37* / 160 | 70 / 380 | All Heat spent on pillars: one foe 5.3 Heat/s; crowd a cast every 3 s, 1.3 foes per pillar. |
| `y_brazier` | easy | 5* / 8 | 30* / 95 | 45 / 200 | All Heat spent on braziers, one standing at a time; pierce and two embers spread it in a crowd. |
| `y_overheat` | timed | 4 / 19* | 23 / 122* | 50 / 260* | Uptime 24% on one foe, 40 to 50% in a crowd; the nova once per cycle. |
| `y_searing` | easy | 3.6* / 11 | 38* / 114 | 50 / 250 | 0.88 blows/s; average stacks 1.3 at level 1, 5.4 at level 8; 3 foes struck per blow. |
| `y_ashen` | timed | 5.5* / 20 | 52* / 156 | 100 / 380 | The foe stands in fire 70% (level 1) to 90% (level 7+) of the time; 3 of 6 in the fire. |
| `y_brand` | precise | 9* / 9 | 88* / 100 | 220* / 400 | Brand on the parried foe always up from level 2; average 2 stacks at level 1, 6 at level 8. |
| `y_shade` | easy | 3* / 8 | 30* / 80 | 45 / 200 | Triggers 0.13/s at level 1, 0.31/s at level 8; a line of 3 in a crowd. |
| `y_salamander` | timed | 6* / 15 | 54* / 150 | 100 / 300 | 0.18 rites/s on one foe, the cooldown caps it in a crowd; two salamanders on one foe. |
| `y_hawk` | precise | 12* / 14 | 76* / 110 | 200* / 320 | 0.2 parries/s plus blocks at level 5+; 1.7 hawks flying on average at level 8. |
| `y_kindling` | easy | 1 / 5 | 9 / 50 | 25 / 90 | Damage only through more rites (casts x2.4 at level 8) and the full-bar bonus. |
| `y_sunspear` | timed | 4.6* / 18 | 47* / 200 | 95 / 350 | Charge level 3 every cooldown; one foe in the line, 4 to 5 in a crowd line. |
| `y_rift` | easy | 2 / 12* | 20 / 120* | 40 / 240* | Charge level 3 every cooldown; the whole floor from level 6. |

Checks against the contract:

- easy at level 8: 30 on one foe (`y_brazier`, `y_shade`, `y_searing` 38) and 80 to 120 on a crowd.
- timed at level 8: 37 to 54 on one foe, about 1.3 to 1.8 times easy, centred near 1.5.
  `y_pillar` and `y_overheat` sit low on one foe on purpose: Heat comes slowly from one foe, and both are crowd rites.
- precise at level 8: 75 to 88, 2.5 to 2.9 times easy.
- Level 8 over level 1: 6.5 to 10 for every skill on its intended target except `y_warpath` on one foe (3) and `y_kindling` (no damage of its own).
- Damage over time against an attack skill of the same risk: `y_searing` 11 / 114 against `y_windmill` 12 / 90 (crowd), `y_ashen` 5.5 / 52 against `y_heft` 6 / 45, `y_brand` 9 / 88 against `y_counter` 10 / 75. At level 4 each dot is about a third to a half below its attack skill; at levels 7 and 8 above it.
- Evolutions: easy ones about double the crowd figure and add a little on one foe; timed ones about double; precise ones about 2.5 times on one foe and add a buff (Riposte crits, Sunflock's guard).

## Evolution pairs and builds

Partners form short chains so a build of eight keeps two or three ready at most:
heft to warpath to impale to skyhook to vault to ashen to dive to hawk to counter to brand to impale;
windmill to searing to kindling to overheat to searing;
pillar to kindling; brazier to salamander to pillar; shade to windmill; sunspear to heft; rift to overheat.

**Temple Guard** (precise, parry everything): `y_counter`, `y_brand`, `y_hawk`, `y_impale`, `y_kindling`, `y_heft`, `y_skyhook`, `y_sunspear`.
Evolves Sun Piercer (counter, brand at 4+), Pyre Mark (brand, impale at 4+) and Sunflock (hawk, counter at 4+).
She stands in the crowd braced, parries, counters, and impales branded foes to spend the brand.
Highest damage when the parries land; a missed read is a hit taken with nothing to show.

**Wildfire** (easy and dot, crowds melt late): `y_searing`, `y_kindling`, `y_overheat`, `y_windmill`, `y_brazier`, `y_salamander`, `y_shade`, `y_rift`.
Evolves Wildfire (searing, kindling at 4+), Fire Wheel (windmill, searing at 4+) and Eternal Hearth or Forge Altar.
Slow first ten waves, then the stacks spread through every crowd and the glaive never cools.

**Skyfall Vaulter** (timed, all movement): `y_vault`, `y_ashen`, `y_dive`, `y_hawk`, `y_warpath`, `y_impale`, `y_pillar`, `y_skyhook`.
Evolves Skyfall (vault, ashen at 4+), Scorched Earth (ashen, dive at 4+) and Phoenix Dive (dive, hawk at 4+).
She never stops travelling: vault over, crash, dive, land on her own burning trail and set it off.

## Code notes for the base kit

- `kit.ts`: drop `pressSkyhook` and the double tap; Up only jumps.
- `choose.ts`: drop the `s.up`, `s.down`, `rising` and `windmill` branches; add the far-foe read for the ground lash and the skill checks for windmill, skyhook, counter and running impale.
- `CharacterDef.comboHits: 3` replaces `stringLimit` and `GLAIVE_STRING_BONUS`.
- `vaultStrike()` runs the crash without a skill.
- Perks and ranks read by the kit (`hasPerk`, `progress.ranks`) move to `skillLevel`, `skillEvolved` and `skillValues`.
- Scorch and Brand need a stacking status per foe, ticked by the skill and dealing damage with the skill's id as source.
- Every skill and evolution gets a code-drawn icon under `src/ui/skills/icons/ysra/`.
