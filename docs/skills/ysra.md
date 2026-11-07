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
| J, middle blow | Reverse sweep (1.4) by default; twirl (0.85 each side) when foes stand on both sides; haft ram (1.1) when the foe is only behind; sky thrust (1.2) when a foe hovers overhead; ground lash (1.0, drags the foe in) when the nearest foe ahead stands past the thrust's reach (40 to 60 px), which is where the hip thrust's knockback leaves it. |
| Hold J | Heft on the first blow: quick poke (1.0) or the lunge (1.3 to 3.0, pierces the line, 60 px). |
| J in the air | One air reap (1.3). |
| J in a vault's flight | The vault crash (1.9 AD in 36 px), moved into the base kit from Vault Strike. |
| K | Vault on the floor, also out of a brace or a backstep's hop. In the air: the dive (1.5 impact, 0.75 on the way down). |
| L | Hold to brace, a press just before a blow parries (stun 1 s, slow motion, 25 stamina back, 5 Flow). L with a side held away is the backstep. |
| Up | Her one jump. |
| I | Flare: 30 Heat, 4 AP around her, throws foes back, heals 5% HP. |
| O | Switches rites once a second rite skill is owned. With Flare only it has nothing to switch. |
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

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Wind 25% faster; full lunge 4.2 AD (from 3.0). | Hold J: a faster wind and a harder lunge. |
| 2 | Lunge travels 80 px; every glaive blow reaches 6 px further. | The lunge runs farther and every blow reaches further. |
| 3 | Skewer: a full lunge carries the first minion and slams it down for the lunge's damage. | A full lunge carries a foe and slams it down. |
| 4 | Full lunge 5 AD. | Lunge damage +20%. |
| 5 | Rail: the whole line is struck again 0.08 s after the lunge stops, at 0.5 times. | The line is struck again after the lunge. |
| 6 | Wind 60% faster than base; untouchable for the whole travel. | Winds faster; nothing touches you in the lunge. |
| 7 | The lunge ends in a 1.5 AD burst, 24 px around the tip. | The lunge bursts at its tip. |
| 8 | Full lunge 6 AD. | Lunge damage +20%. |

Evolution, Rail Lance (with `y_warpath`): a full lunge travels 140 px and the rail runs out and back, three strikes per foe; J while Warpath charges releases a full lunge with no wind.
Build: `heft.ts` and `lunge.ts` already hold the wind rate, Skewer and the rail; their numbers move from `progress.ranks` and perks to `skillValues("y_heft")`. `haftReach()` reads the level 2 reach. The tip burst grows the existing `heftLunge` hit. The evolution adds a return pass to `rail()` and a `runningImpale`-to-`heftLunge` pick in `choose.ts`.

### `y_impale` Impale

Attack, timed, the string's last blow. The finisher pins foes, and pinned foes take more from everything.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Impale 3 AD; pins struck foes 1 s; pinned foes take +25%. | The last blow pins foes, and pinned foes take more damage. |
| 2 | Pin 1.5 s, +40%. | Pins last longer and hurt more. |
| 3 | The point bursts 24 px past the tip and pins foes there too. | The impale reaches past its tip. |
| 4 | Impale 4.5 AD. | Impale damage +50%. |
| 5 | A pinned foe that dies bursts for 2 AD and pins its neighbours 1 s. | Pinned foes burst when they fall. |
| 6 | Pin 2 s, +70%. | Pins last longer and hurt more. |
| 7 | The glaive twists in: a second hit at half damage. | The impale strikes twice. |
| 8 | Impale 7 AD; pinned foes take +100%. | Impale damage up; pinned foes take double. |

Evolution, Pillory (with `y_skyhook`): the impale drives a row of burning stakes 80 px ahead; every foe in the row is pinned 3 s at +150%, the impale deals 12 AD, and pinned foes burst for 4 AD when they die.
Build: `pin.ts` and `pinMark.ts` exist. The impale's move is built from the level's row at move start (a small move factory, shared with the windmill). The death burst listens to the kill event and reads `e.pinned`. The stakes are a new effect (the `burningSpear` sprite planted in the floor).

### `y_windmill` Windmill

Attack, easy, J when foes stand on both sides. The twirl becomes a spinning windmill that draws the crowd in.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Surrounded, the twirl becomes the windmill: 4 passes of 0.35 AD both sides, foes drawn 20 px in. | Surrounded, the twirl becomes a windmill that draws foes in. |
| 2 | 5 passes. | One more pass. |
| 3 | Draws foes in from 40 px. | Draws from farther away. |
| 4 | Passes 0.45 AD. | Windmill damage +30%. |
| 5 | Ends in a ring of flame, 2 AP in 36 px. | The windmill ends in a ring of fire. |
| 6 | Each pass flings an ember 50 px out, 0.2 AD. | Each pass throws an ember. |
| 7 | Also replaces the sweep when 3 or more foes stand in front. | Spins into a crowd in front too. |
| 8 | Passes 0.6 AD. | Windmill damage +30%. |

Evolution, Fire Wheel (with `y_searing`): the windmill keeps spinning for 1.5 s while she walks, draws from 70 px, every pass adds a Scorch stack, and it starts on a lone foe too.
Build: the `windmill` move and `yWindmill` clip exist (`variants.ts`); passes are generated from the level row. The ring reuses `castFlare` at its own power, the embers reuse `emberShot`. Fire Wheel needs a looping windmill segment in the clip (a held loop, per the motion standard) and a walk speed inside the move.

### `y_counter` Counter Thrust

Attack, precise, a parry then J. The parry opens a counter that hits very hard and turns into a buff.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | J within 0.8 s of a parry is the counter thrust, 5 AD. | After a parry, J is a counter thrust. |
| 2 | Parry window 0.18 s (from 0.12); blocks cost 30% less stamina. | A wider parry window and cheaper blocks. |
| 3 | The counter always crits and stuns 1.5 s. | The counter always crits. |
| 4 | Counter 7 AD. | Counter damage +40%. |
| 5 | The counter pierces a 70 px line. | The counter runs through the line. |
| 6 | Parry window 0.24 s; a counter refunds all stamina. | Wider parry window; counters refill stamina. |
| 7 | Riposte: string blows deal +50% for 3 s after a counter. | Counters empower your next blows. |
| 8 | Counter 11 AD. | Counter damage +55%. |

Evolution, Sun Piercer (with `y_brand`): the counter is a burning thrust across the whole stage for 22 AD (always a crit), and for 4 s after it every blow is a crit.
Build: `counterThrust` move, `stance.counter`, `parryWindow()` and `BRACE.firmCut` exist; they read `skillValues("y_counter")`. Riposte is a timer in skill memory read by the damage scale. Sun Piercer reuses the Sunspear's line hit and `burningSpear` effect.

### `y_skyhook` Skyhook

Attack, timed, J when a foe hovers overhead. Her answer to flyers: hook them down where the glaive reaches.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | The sky thrust becomes the hook: 1.5 AD, drags the flyer to the floor, stun 0.8 s. | A foe overhead is hooked down to the floor. |
| 2 | Hook 2.2 AD, stun 1.2 s. | A harder hook and a longer stun. |
| 3 | Hooks every flyer in a 50 px cone over her. | Hooks every flyer above you. |
| 4 | The hooked foe hits the floor for 1.5 AD to it and to foes it lands on. | Hooked foes slam into the floor. |
| 5 | Hooked flyers stay grounded 4 s. | Hooked flyers cannot fly for a while. |
| 6 | Hook 3.5 AD. | Hook damage +60%. |
| 7 | Reaches 70 px up; she rises 20 px with the hook and may air sweep. | Reaches higher and lifts you with it. |
| 8 | Hook 4.5 AD, slam 4.5 AD. | Hook and slam much harder. |

Evolution, Heaven's Hook (with `y_vault`): every flyer within 100 px is hooked into one heap at her feet, the heap slams for 8 AD around her, and the vault recharges at once.
Build: the `skyhook` move and `ySkyhook` clip exist; its launch turns into a spike like Skewer's slam. Grounding needs a new `grounded` timer in `enemies/status.ts` that flyer AI respects. The cone is a wider box.

### `y_vault` Vault Strike

Movement, timed, K then J in flight. The vault crash grows, the air opens up, and landings shake the floor.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Crash 3.2 AD in 44 px. | The vault crash hits harder and wider. |
| 2 | An air sweep can follow a vault; two air sweeps before landing. | Air string +1, and sweeps can follow a vault. |
| 3 | Crash and dive landings send a shockwave 96 px both ways, 0.7 AD. | Landings send a shockwave along the floor. |
| 4 | Crash 4.5 AD. | Crash damage +40%. |
| 5 | K in the vault's flight vaults once more off the haft; the next K dives. | Vault again in the air. |
| 6 | Vault recharge 0.7 s; the crash throws foes up. | Vaults recharge faster; the crash launches. |
| 7 | Shockwave 1.6 AD, 130 px, stun 0.5 s. | A stronger, longer shockwave. |
| 8 | Crash 6 AD and leaves a 2 AP ring of fire. | The crash burns. |

Evolution, Skyfall (with `y_ashen`): the crash comes down as a burning meteor, 10 AD in 60 px, the shockwave crosses the whole floor, and the crater burns for 3 s.
Build: `CRASH`, `QUAKE`, `AIR_SWEEPS`, `VAULT.cooldown` and `VAULT.airPeak` read the level row; `vaultStrike()` in `stance.ts`, `quake()` in `landing.ts` and `airVault()` exist. Skyfall reuses `createShockwave`, `castFlare`'s ring and `game.blazes`.

### `y_dive` Falling Star

Movement, timed, K in the air. The dive becomes a weapon: a pull, a second drop, a burning line.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Impact 3 AD, 36 px each side. | The dive hits harder and wider. |
| 2 | She springs 24 px up out of the impact and may air sweep. | Spring out of the impact. |
| 3 | The impact pulls foes within 50 px in first. | The impact draws foes in. |
| 4 | Impact 4.5 AD. | Impact damage +50%. |
| 5 | Two dives per airtime. | Dive twice before you land. |
| 6 | The point sets foes on the way down burning; 1.5 AD on the way. | The dive's line burns. |
| 7 | The impact throws foes high and leaves a 2.5 AP ring of fire. | The impact launches and burns. |
| 8 | Impact 6.5 AD. | Impact damage +45%. |

Evolution, Phoenix Dive (with `y_hawk`): she dives as a burning phoenix, 12 AD in 70 px, floods the floor with fire for 3 s, three dives per airtime.
Build: `dive.ts`, `DIVE`, `diveImpact()` exist. The spring reuses `lift()`. Phoenix Dive moves `drawPhoenix` and the floor flood from `ultimates/phoenixDive.ts` into the dive; the ultimate file goes.

### `y_warpath` Warpath

Movement, easy, automatic. Her steady stride builds into a charge on its own, with no new input.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | After 0.6 s walking one way she charges at 170 px/s, shouldering minions for 0.35 AD; J while charging is the running impale (1.7 + 0.9 AD). Turning or bracing stops it. | Keep walking to charge; J while charging impales. |
| 2 | Charges after 0.4 s, 15% faster. | Charge sooner and faster. |
| 3 | Shoulder 1.0 AD and throws minions up; elites stagger instead of stopping her. | Shoulder harder, through bigger foes. |
| 4 | Running impale 2.6 + 1.4 AD. | Running impale +50%. |
| 5 | Blows from the front while charging are blocked like the brace. | Your charge blocks blows from the front. |
| 6 | Shoulder 2.0 AD. | Shoulder damage doubled. |
| 7 | The running impale carries its foe 40 px into the others, 2 AD to each. | The impale bowls foes over. |
| 8 | Running impale 3.5 + 2.0 AD. | Running impale +35%. |

Evolution, Juggernaut (with `y_impale`): the charge gathers every minion it meets on the glaive; J or the end of the charge slams them all for 8 AD and pins them.
Build: `warpath.ts`, `WARPATH`, `WARPATH_RUN` and the `runningImpale` move exist; `startCharge` starts from a walk timer in place of the double tap. Juggernaut extends Skewer's carry (`lunge.ts`) to many foes.

### `y_pillar` Flame Pillar

Spell, timed, I (rite). A pillar under the foe ahead; aim matters.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Rite, 40 Heat: a pillar under the nearest foe ahead, 6 AP, throws it up. | A rite: a pillar of fire under the foe ahead. |
| 2 | Costs 32 Heat. | Costs less Heat. |
| 3 | The pillar is 60% wider. | A wider pillar. |
| 4 | 11 AP. | Pillar damage +80%. |
| 5 | The column burns on for 1 s, 2 AP to foes falling through it. | The pillar keeps burning. |
| 6 | Costs 26 Heat; each pillar heals 3% HP. | Cheaper, and it heals you. |
| 7 | A second pillar bursts under the next foe. | Two pillars. |
| 8 | 22 AP. | Pillar damage doubled. |

Evolution, Pyre Colonnade (with `y_kindling`): each pillar burns 20% hotter and two flank pillars burst 30 px either side 0.12 s later at 0.7 times, as today's evolution does.
Build: `castFlamePillar`, `castPyreColonnade`, `FLAME_PILLAR` and `PYRE_COLONNADE` exist; their power and shape read the level row.

### `y_brazier` Brazier

Spell, easy, I (rite). A planted turret that spits embers on its own.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Rite, 50 Heat: a brazier ahead spits an ember at the nearest foe every 0.9 s for 6 s, 0.6 AP and a burn. | A rite: a brazier that spits embers at foes. |
| 2 | Foes touching the brazier burn, 0.5 AP per 0.4 s. | The brazier burns foes that touch it. |
| 3 | Embers pierce on to the foe behind. | Embers pierce. |
| 4 | Ember 1.0 AP; lasts 10 s. | Hotter embers, a longer fire. |
| 5 | Two embers per shot, at two foes. | Two embers each shot. |
| 6 | A shot every 0.5 s. | Shoots faster. |
| 7 | It bursts when it burns out, 6 AP in 50 px. | The brazier bursts at the end. |
| 8 | Ember 1.6 AP; burns 2.5 s. | Ember damage +60%. |

Evolution, Forge Altar (with `y_salamander`): an altar that stands 15 s, fires three embers a shot, and lets out a salamander every 3 s.
Build: `plantBrazier`, `emberShot`, `BRAZIER` exist; the burst reuses `burstEmbers`.

### `y_overheat` Overheat

Spell, timed, I (rite, needs 60 Heat, spends all of it). Bank Heat, then burn it in a short frenzy.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Rite: spend all Heat for Overheat, 6 s per 100 Heat: attack speed +20%, each blow bursts 0.9 AD in 16 px. | A rite: spend all your Heat to burn hot. |
| 2 | Blows during Overheat build Heat at half rate, extending it. | Overheat feeds on your blows. |
| 3 | Bursts 28 px wide. | Wider bursts. |
| 4 | Attack speed +35%, bursts 1.5 AD. | Faster and hotter. |
| 5 | Overheat ends in a nova, 8 AP in 60 px. | Overheat ends in a nova. |
| 6 | Blows reach 16 px further on a tongue of flame. | Your blows reach further. |
| 7 | Each kill adds 0.5 s. | Kills extend Overheat. |
| 8 | Attack speed +60%, bursts 3 AD. | Much faster and hotter. |

Evolution, Sunheart (with `y_searing`): Overheat holds 1.5 s past each landed blow and so lasts while she keeps hitting, each burst adds 2 Scorch stacks, and the end nova is 20 AP.
Build: `startOverheat`, `OVERHEAT`, `igniteOverheat` and `burnGlaive` exist; Overheat becomes a `RiteDef` in the rotation. The nova reuses `castFlare`.

### `y_searing` Searing Edge

Dot, easy, automatic on J blows. Blows lay Scorch stacks; weak alone, a furnace late.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Above half Heat each blow adds a Scorch stack: 0.4 AP per second for 3 s, up to 3. | Hot blows scorch foes. |
| 2 | Blocks and parries scorch the attacker. | Your guard scorches too. |
| 3 | Up to 5 stacks, 4 s. | More stacks, burning longer. |
| 4 | 0.5 AP per second per stack. | Scorch +25%. |
| 5 | Scorches at any Heat. | Every blow scorches. |
| 6 | Lunges, crashes, dives, counters and impales add 2 stacks. | Heavy blows scorch twice. |
| 7 | Up to 8 stacks, 0.85 AP per second; at 8 the foe flares and takes +10% from blows. | Scorch stacks to 8 and flares. |
| 8 | 0.95 AP per second per stack, 5 s. | Scorch hotter and longer. |

Evolution, Wildfire (with `y_kindling`): a scorched foe that dies throws its stacks onto every foe within 50 px, and a foe that reaches 8 stacks bursts for twice their remaining damage in 30 px and drops back to 0.
Build: needs the new Scorch status (stack count, timer and tick per foe, source `y_searing`). The flame on the glaive reuses `burnGlaive`. Wildfire's burst reuses `burstEmbers`.

### `y_ashen` Ashen Wake

Dot, timed, automatic on her travel. Her path burns; she has to travel through and over the crowd.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Vaults and dives leave burning ground for 3 s, 0.45 AP per 0.4 s. | Your vaults and dives leave burning ground. |
| 2 | Lunges and Warpath charges do too. | Lunges and charges burn the floor too. |
| 3 | Patches last 4 s and are wider. | The fire lasts longer and spreads wider. |
| 4 | 0.8 AP per tick. | Fire damage +80%. |
| 5 | Overlapping patches burn together. | Fire on fire burns twice. |
| 6 | A vault or dive landing rings 40 px with fire. | Landings ring the floor with fire. |
| 7 | 1.8 AP per tick; foes in the fire are slowed 30%. | Hotter fire that slows. |
| 8 | 2.2 AP per tick, 5 s. | Hotter, longer fire. |

Evolution, Scorched Earth (with `y_dive`): a vault or dive landing detonates every patch she has laid, each erupting as a small pillar for 5 AP.
Build: `ashenWake.ts`, `cinder.ts`, `ASHEN_WAKE` and the `travel` event exist; overlap drops the one-patch-per-spot rule. The eruption reuses `castFlamePillar` with a small shape.

### `y_brand` Ember Brand

Dot, precise, a parry. The parried foe is branded, and every blow on it feeds the brand.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | A parried foe is branded for 4 s; each of her blows on it adds a stack (up to 4), each 0.8 AP per second. | A parry brands the attacker; your blows feed the brand. |
| 2 | Brand lasts 6 s; branded foes are slowed 20%. | The brand lasts longer and slows. |
| 3 | Up to 6 stacks. | More stacks. |
| 4 | 1.2 AP per second per stack. | Brand +50%. |
| 5 | A block brands the attacker with one stack. | Blocks brand too. |
| 6 | A parry also brands foes within 30 px of the attacker. | The brand spreads on a parry. |
| 7 | 1.7 AP per second, up to 8 stacks. | Hotter brand, more stacks. |
| 8 | 2.0 AP per second; branded foes take +20% from your blows. | Branded foes take more from you. |

Evolution, Pyre Mark (with `y_impale`): an impale or counter on a branded foe spends the brand: its stacks times 4 AP at once in 40 px, which brands every foe it hits with 2 stacks.
Build: a new Brand status beside Scorch (same stacking status code, its own source). Listens to Ysra's `parry` and `block` events. The mark is a new small effect over the foe's head.

### `y_shade` Glaive Shade

Summon, easy, automatic on a landed blow. A spectral temple guard steps out behind her and thrusts through the line.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | 15% on a landed blow (2 s cooldown): a shade thrusts through the line ahead, 1.8 AD. | Your blows may call a shade that thrusts through the line. |
| 2 | The shade thrusts twice. | The shade thrusts twice. |
| 3 | 20%, 1.5 s cooldown. | Shades come more often. |
| 4 | 2.0 AD a thrust. | Shade damage up. |
| 5 | The shade stays 2 s, thrusting three times at the nearest foe. | The shade stays and fights. |
| 6 | Shade thrusts stagger foes 0.5 s. | Shade thrusts stagger. |
| 7 | Two shades, one each side. | Two shades, back to back. |
| 8 | 35%; 2.5 AD a thrust. | Shades come often and hit harder. |

Evolution, Temple Host (with `y_windmill`): three shades stand behind her for good and thrust in a fan whenever she lands a blow (at most every 0.4 s).
Build: new `src/game/skills/ysra/shade.ts`. The shade is her own rig drawn translucent in the `yHipThrust` clip (the afterimage drawing in `afterimages.ts`), its hit a plain `meleeHit` box with source `y_shade`.

### `y_salamander` Salamander

Summon, timed, automatic on a rite. A fire salamander runs out along the floor and bites what it meets.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | 50% on a rite (3 s cooldown): a salamander runs ahead for 4 s, biting the foe in front every 0.5 s for 1.2 AP. | Rites may call a salamander. |
| 2 | 65%. | Salamanders come more often. |
| 3 | It leaves a burning trail. | The salamander's trail burns. |
| 4 | Bite 1.4 AP. | Bites harder. |
| 5 | Two salamanders. | Two salamanders. |
| 6 | Lasts 6 s and leaps at flyers. | Lasts longer and leaps at flyers. |
| 7 | Bursts when it ends, 5 AP in 30 px. | Salamanders burst at the end. |
| 8 | 80%; bite 1.8 AP. | Comes more often and bites harder. |

Evolution, Magma Drake (with `y_pillar`): a rite calls a drake that walks with her for 10 s and breathes fire 80 px along the floor every second, 4 AP to each foe.
Build: new summon file and a new small sprite (4 frames of a run). The trail reuses `layCinder`. The drake's breath reuses the Pyre Wave's rolling flame drawing.

### `y_hawk` Sun Hawk

Summon, precise, automatic on a parry. A bird of fire answers the parry and keeps diving.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | 60% on a parry (3 s cooldown): a sun hawk dives on the attacker, then twice more on the nearest foes, 2.5 AD a dive. | A parry may call a sun hawk. |
| 2 | 80%. | The hawk answers more often. |
| 3 | It stays 6 s, diving every second. | The hawk stays and hunts. |
| 4 | 3 AD a dive. | Dives hit harder. |
| 5 | A block calls it at 25%. | Blocks may call the hawk too. |
| 6 | Every parry calls it; dives set foes burning. | Every parry calls a burning hawk. |
| 7 | Dives burst in 24 px. | Dives burst. |
| 8 | 3.5 AD, a dive every 0.8 s, up to 2 hawks. | Two hawks, faster dives. |

Evolution, Sunflock (with `y_counter`): a parry calls five hawks that dive the attacker together for 6 AD each and then hunt for 6 s; while two or more fly she takes 20% less damage.
Build: new summon file. The hawk is `drawPhoenix` (`effects/phoenix.ts`) at a smaller scale; the dive impact reuses `emberBurst`.

### `y_kindling` Kindling

Passive, easy. Heat economy and her sustain, gathered in one skill.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Heat +20% from blows. | Heat builds faster. |
| 2 | A parry gives 25 Heat, a block 5. | Your guard builds Heat. |
| 3 | Rites cost 15% less. | Rites cost less. |
| 4 | Heat +40%; it waits 4 s before draining. | Heat builds faster and holds longer. |
| 5 | Each rite heals 3% max HP. | Rites heal you. |
| 6 | Rites cost 30% less. | Rites cost even less. |
| 7 | Below a third of HP: 30% less damage taken, double Heat. | Burn brighter when near death. |
| 8 | Heat +70%; at full Heat blows deal +15%. | A full bar empowers your blows. |

Evolution, Eternal Hearth (with `y_overheat`): Heat never drains, rites cost 40% less, and each rite lights the glaive for 3 s (blows +30%, each bursting 1 AD).
Build: `heat.ts` (`gainScale`, `addHeat`, drain), `fusion.ts` (Molten Guard), `hearthfire.ts` and the stance part's Unbroken scale exist and read the level row.

### `y_sunspear` Sunspear

Ultimate, timed, U (replaces Pyre Wave). A thrown spear down a line; aim it.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Sunspear as today: each foe in the line takes the charge's power in AD; it bursts at the end. | U throws a burning spear down the line. |
| 2 | The line burns for 2 s. | The spear's line burns. |
| 3 | One spear each way at every charge. | Throw both ways. |
| 4 | Power x1.6; cooldown 17 s. | Harder, and back sooner. |
| 5 | Struck foes are pinned 2 s at +30% taken. | The spear pins. |
| 6 | Cooldown 14 s. | Back sooner. |
| 7 | Three more spears rain across the stage. | Spears rain down. |
| 8 | Power x3.2; cooldown 12 s. | Much harder, back sooner. |

Evolution, Solar Lance (with `y_heft`): three spears in a fan each way, every end burst is a Flame Pillar, cooldown 10 s.
Build: `ultimates/sunspear.ts` exists with the rain; the level row sets power, both ways, rain and pin. The ultimate cooldown needs a per-skill value.

### `y_rift` Volcanic Rift

Ultimate, easy, U (replaces Pyre Wave). A crack both ways that erupts under the whole crowd.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Volcanic Rift as today, eruptions at 1.2 times the charge's power in AP. | U splits the floor in eruptions both ways. |
| 2 | The crack burns for 3 s. | The crack keeps burning. |
| 3 | Reaches 50% farther; cooldown 17 s. | A longer crack, back sooner. |
| 4 | Power x2. | Eruptions much harder. |
| 5 | A second wave erupts 1 s later at 0.6 times. | A second eruption. |
| 6 | The crack runs the whole floor at every charge. | The whole floor splits. |
| 7 | Eruptions throw foes up and refill 5 Heat each. | Eruptions refill Heat. |
| 8 | Power x3.2; cooldown 14 s. | Much harder, back sooner. |

Evolution, Caldera (with `y_overheat`): the rift stays open 6 s, erupting across the floor every second, each eruption refilling Heat.
Build: `ultimates/volcanicRift.ts` exists; the burn reuses `layCinder`.

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
