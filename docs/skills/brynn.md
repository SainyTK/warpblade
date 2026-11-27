# Brynn skills

Brynn's part of the skill contract (`docs/skill-design.md`).
Her kit, numbers and look are in `docs/heroes/brynn.md`.
AD and AP mean her attack damage and ability power (12 and 9 at hero level 1, `BRYNN.base`).

## Drill set

Solo Adventure runs base Brynn on the shared drill engine (`src/drill`).
All 20 skills are offered there and each one upgrades a drill mechanic; the reward pool has no filter.
The rows keep the numbers the native kit reads (the wave arena, co-op) under their old keys and add the drill's under `drill.`, so the sections after this one still describe her native kit, and the card text is the drill's.
Drill code: `src/heroes/brynn/game/drill/skills/` (one file per redesigned skill), folded into `BRYNN_DRILL` by `game/drill/hooks.ts`.

| Id | Name | Mechanic | Level 1 | Levels 2 to 8 | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| `br_cleave` | Wide Arc | first slash | an extra 0.4 AD cut | stagger, a drag, a cut behind, burn, up to 3 AD | Horizon Cleave (`br_launch`): crescents both ways |
| `br_launch` | Skyward Heave | second slash | the heave throws foes up | +0.4 to +2.6 AD on foes in the air, up to two more air slashes, stagger | Skyfall (`br_cleave`): thrown foes crash down for 2 AD |
| `br_slam` | Anvil Weight | third slash | a 0.8 AD shockwave along the floor | finisher +30% to +200%, both ways, stagger, a second wave, up to 5 AD | Split Earth (`br_heavy`): pillars rise ahead of every slam |
| `br_heavy` | Heavy Hands | air slash | an extra 0.4 AD cut | up to two more air slashes, a spike, a landing ring, up to 3.5 AD | Meteor Hands (`br_slam`): every air slash quakes the floor below |
| `br_counter` | Counter Cleave | guard and parry | a parry cleaves foes in front for 1.2 AD | a 30% longer parry window, stagger, sure crits, a shockwave, up to 8 AD | Iron Answer (`br_ironskin`): a block cleaves at half power |
| `br_spin` | Spinning Throw | warp strike | recharge -15%, damage +30% | an arrival shock ring, refreshed air dash and air slash, stagger, recharge -45%, damage +200% | Anvil Drop (`br_crater`): every arrival quakes the floor |
| `br_charge` | Shoulder Charge | dash | the dash shoulders foes for 0.8 AD | stagger, knockback, an air dash, burn, up to 5.5 AD | Battering Ram (`br_cry`): a shouldering dash ends in a floor wave |
| `br_ironskin` | Iron Skin | dash and air dash | untouchable while dashing | untouchable after a dash and a warp, up to two more air dashes, the air dash restores the air slash | Living Anvil (`br_cry`): every dash leaves a shock ring |
| `br_cry` | War Cry | warp and infusion | an arrival infuses the blade for 1 hit | faster preparation (up to 40%), longer infusions, an arrival shortens a preparation, 2 hits | Battle Roar (`br_bellows`): every arrival readies the selected spell |
| `br_crater` | Crater Leap | jump, wall kick, air | a hard landing rings foes for 0.8 AD | a shoving wall kick, an air dash, an air slash, a wider ring that throws foes up, up to 4 AD | Crater Pull (`br_spin`): the landing drags foes in and splits fissures |
| `br_arc` | Ember Arc | Ember Arc | burns 1.5 s longer | wider blasts, a flare on slashing burning foes, an extra blast up to 3.5 AD, a crescent with each cast | Wildfire Arc (`br_cinder`): each hit sends a crescent on |
| `br_pillars` | Brand Pillars | Quake | two pillars rise where Quake strikes | three then five pillars, longer stagger, wider quakes, burning pillars, up to 3 AD | Aftershock (`br_fault`): Quake strikes again after 0.5 s |
| `br_bellows` | Bloodletter | Rend | Rend lays 2 more bleed stacks | a blast, a slash opens bleeding wounds, Rend splits into two then three shards, up to 4 AD | Red Tide (`br_crush`): Rend runs a floor wave on |
| `br_cinder` | Cinder Edge | dot on slashes and dashes | each slash lays an ember (0.06 AD a tick, 4 at most) | the third slash lays 3, the third slash spreads them, a dash lays 2, each slash 2, up to 0.45 AD and 12 | Forge Heart (`br_arc`): a foe full of embers bursts |
| `br_crush` | Crushing Weight | dot on the second and third slash | the heave lays one crush stack, the slam two | blows on foes in the air crush, the third slash on a foe in the air lays 3, a kill passes the stacks on, crushed foes are held | Grindstone (`br_launch`): the third slash grinds out every stack |
| `br_fault` | Fault Lines | dot on the third slash and floor waves | the third slash leaves a 60 px burning crack ahead, and so do shockwaves | slowed, fissures crack too, held in place, 90 px, both ways, up to 1.1 AD a tick | Rift Floor (`br_slam`): a crack bursts up as it burns out |
| `br_echo` | Echo Swing | summon on parries | as in the native kit | perfect dodges and Keen blows call it too; the rest as in the native kit | as in the native kit |
| `br_falling` | Falling Blade | summon on kills | as in the native kit | as in the native kit | as in the native kit |
| `br_splinter` | Heart Splinter | summon on warp strikes | a warp strike may leave a red splinter that darts at foes | the third slash chips one, a mark, two per warp, pierce, up to 2 AD and four out | Crimson Halo (`br_heavy`): four splinters circle her for good |
| `br_fall` | Crimson Fall | the four charged tiers | charged skills +30% | faster charge, a pull, more reach, an echo strike, up to +250% | Crimson Cataclysm (`br_heavy`): every charged skill shakes twice more |

Count by mechanic: 4 slash skills, 1 guard skill, 4 warp and dash skills, 1 jump skill, 3 spell skills, 3 damage over time, 3 summons, 1 charged-tier skill.
Effects that exist only in the drill (the `drill.` numbers) do nothing in the native kit.
Heft and armour do not exist in the drill, so native levels that read them only fire in the native kit.
Cinder Edge, Crushing Weight, Echo Swing, Falling Blade and Heart Splinter answer shared events (`blow` with its `finisher`, `keen` and `airborne` flags, `dash`, `warp`, `parry`, `perfectDodge`, `kill`), so the same code runs in both kits.
Their card text describes the drill.

## Identity

Brynn is the heavy blade: three slow, wide blows with armour while she swings, Heft built by every blow that lands, Keen blows that swing wider on the beat after a blow, a costly flat-blade guard whose parry is the Counter Cleave, and abilities that shake the floor.
Her skills lean on what makes her different: the slam and its shockwave, the fissure full Heft makes, the launch the slam catches, Keen blows, the Counter Cleave and her armour.
Every skill is on a single button press or runs on its own.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The ground string, fixed at 3 blows: Wide Sweep (1.5 AD), Rising Heave (1.6 AD, throws foes up), Anvil Slam (2.6 AD, drives airborne foes into the floor, knocks down, shockwave 70 px ahead at 0.9 AD). Armour while she swings. |
| J (heavy) | J pressed in the 0.14 s after a blow lands makes the next swing heavy: a sure crit, 30% more reach ahead, a guard break and a crimson crescent at 0.8 AD. |
| J at full Heft | The next Anvil Slam is a fissure: 170 px along the floor at 2.4 AD, knocking foes down, and it spends the bar. |
| J (air) | The Falling Slam, once per jump: 1.4 AD on the way down and a 40 px ring each side at 1.0 AD on landing. |
| J held | The shared warp: Anvilheart spins to the foe, an overhead chop at the shared power and a 36 px shock ring at 0.3 AD. |
| K | Guard on the flat of the blade: lets 10% through and costs 22 stamina. |
| K (parry) | The shared parry, then the Counter Cleave at once: 2.4 AD in front and behind, a knockdown, 30 Heft, and a Keen next swing. |
| L | The shared dodge. |
| I | Rend (14 MP, 4.5 s): a floor wave 170 px ahead, 2.4 AP, throws foes up. Quake (16 MP, 6 s): 1.9 AP within 64 px, throws foes up. |
| I held | Rend both ways; Quake to 100 px with an aftershock at 60%. Half again the MP. |
| I in the string | Carry: once a string blow lands, the ability goes at once, 1.3 times as hard, and the next J goes on with the string. |
| O | Switch ability. |
| U | Crimson Fall, charged in four levels: a crescent in front and behind to 70, 110, 160 or 340 px at 0.8 of the level's power. |
| Up | Jump; again in the air for a double jump. |

The ability order is Rend, Quake, Ember Arc, Brand Pillars, War Cry, the spells shown once their skill is held.
Ember Arc and Brand Pillars play Rend's cut and Quake's plunge as their casts; War Cry plays the plunge as she roars.

## The 20 skills

Counts: attack 5, movement 5, spell 3, dot 3, summon 3, ultimate 1.
Risk: easy 6, timed 11, precise 3.
The sections below keep the native level tables; where a skill's drill card differs, the Drill set table above and the data rows hold the drill's.
The Values column shows only the numbers a level changes; the data rows (`src/heroes/brynn/constants/skills/`) carry the whole state.
"New" in a card line marks a level that adds a property; the rest are number steps.
Damage source: hits of her own presses (string blows and their waves, the Counter Cleave, the dodge's shoulder, the abilities, Crimson Fall) count as `attacks`, `abilities` or `ultimate` and build Flow; embers, cracks, crush, falling blades, echoes, shards, crashes and the Iron Wheel use the skill id and build no Flow.

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `br_heavy` | Heavy Hands | attack | precise | J | `br_slam` | Meteor Hands |
| `br_cleave` | Wide Arc | attack | easy | J | `br_launch` | Horizon Cleave |
| `br_launch` | Skyward Heave | attack | timed | J | `br_cleave` | Skyfall |
| `br_slam` | Anvil Weight | attack | timed | J | `br_heavy` | Split Earth |
| `br_counter` | Counter Cleave | attack | precise | K | `br_ironskin` | Iron Answer |
| `br_spin` | Spinning Throw | movement | timed | J | `br_crater` | Anvil Drop |
| `br_crater` | Crater Leap | movement | timed | jump | `br_spin` | Crater Pull |
| `br_charge` | Shoulder Charge | movement | timed | L | `br_cry` | Battering Ram |
| `br_arc` | Ember Arc | spell | easy | I | `br_cinder` | Wildfire Arc |
| `br_pillars` | Brand Pillars | spell | timed | I | `br_fault` | Aftershock |
| `br_cry` | War Cry | movement | easy | J | `br_bellows` | Battle Roar |
| `br_cinder` | Cinder Edge | dot | easy | auto | `br_arc` | Forge Heart |
| `br_fault` | Fault Lines | dot | timed | auto | `br_slam` | Rift Floor |
| `br_crush` | Crushing Weight | dot | timed | auto | `br_launch` | Grindstone |
| `br_falling` | Falling Blade | summon | easy | auto | `br_fall` | Blade Rain |
| `br_echo` | Echo Swing | summon | precise | auto | `br_counter` | Twin Echo |
| `br_splinter` | Heart Splinter | summon | timed | auto | `br_heavy` | Crimson Halo |
| `br_ironskin` | Iron Skin | movement | easy | L | `br_cry` | Living Anvil |
| `br_bellows` | Bloodletter | spell | timed | I | `br_crush` | Red Tide |
| `br_fall` | Crimson Fall | ultimate | timed | J | `br_heavy` | Crimson Cataclysm |

#### `br_heavy` Heavy Hands

Attack, precise, J. Press J just after a blow lands: the Keen blow hits far harder.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Keen blows deal +150% to the foe they hit first. | bonus 1.5 |
| 2 | The Keen beat lasts 0.14 to 0.18 s. | window 0.18 |
| 3 | New: the crescent off a Keen blow flies farther and hits harder. | wave 0.6, waveReach 0.5 |
| 4 | New: a Keen blow gives 10 more Heft. | heft 10 |
| 5 | Heavy bonus +150% to +350%. | bonus 3.5 |
| 6 | New: each Keen blow in a row adds +30% to the next, up to +90%. | streak 0.3, streakCap 0.9 |
| 7 | New: a Keen slam is a fissure from half Heft. | halfFissure 1 |
| 8 | Heavy bonus +350% to +2000%; the crescent hits far harder. | bonus 20, wave 4 |

Evolution **Meteor Hands** (partner `br_slam`): Every air slash quakes the floor below her and throws foes up.
Evolved values: drill.quake 1.5 (native: bonus 30, heavyFissure 0.8).

#### `br_cleave` Wide Arc

Attack, easy, J. The opening sweep reaches farther, cuts behind and drags the crowd into the string.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The sweep hits harder and reaches 10 px farther. | power 0.4, reach 10 |
| 2 | New: the sweep cuts behind her too. | behind 1 |
| 3 | Reach +10 to +20 px. | reach 20 |
| 4 | New: the sweep drags foes in toward her. | drag 1 |
| 5 | Sweep power +0.4 to +1.2. | power 1.2 |
| 6 | New: the sweep reaches flying foes overhead. | tall 1 |
| 7 | New: foes it strikes take +25% for 2 s. | mark 0.25, markTime 2 |
| 8 | Sweep power +1.2 to +2.2; reach +30 px. | power 2.2, reach 30 |

Evolution **Horizon Cleave** (partner `br_launch`): The sweep throws a crimson crescent both ways along its arc.
Evolved values: wave 1.

#### `br_launch` Skyward Heave

Attack, timed, J. The heave throws foes higher, and the slam crashes them down onto the crowd.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The heave hits harder and throws foes higher. | power 0.6, launch 60 |
| 2 | New: launched foes take +20% until they land. | airBonus 0.2 |
| 3 | Heave power +0.6 to +1.4. | power 1.4 |
| 4 | New: the heave reaches 16 px farther ahead. | reach 16 |
| 5 | New: a foe the slam drives down bursts on the foes round it. | crash 1.2 |
| 6 | Launched foes take +20% to +40%. | airBonus 0.4 |
| 7 | New: the heave cuts behind her too. | behind 1 |
| 8 | Heave power +1.4 to +3.4; the crash hits far harder. | power 3.4, crash 3.5 |

Evolution **Meteor Heave** (partner `br_cleave`): Every foe the slam drives down cracks the floor both ways where it lands.
Evolved values: crashFissure 1.5.

#### `br_slam` Anvil Weight

Attack, timed, J. The slam's shockwave runs farther and harder, and fissures split more of the floor.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The slam's shockwave hits harder. | wave 0.6 |
| 2 | The shockwave runs 40% farther. | reach 0.4 |
| 3 | New: the shockwave runs both ways. | both 1 |
| 4 | Shockwave power +0.6 to +1.2. | wave 1.2 |
| 5 | New: foes it knocks down stay down 0.5 s longer. | stun 0.5 |
| 6 | New: fissures run 40% farther. | fissureReach 0.4 |
| 7 | New: fissures hit 1.5 AD harder. | fissure 1.5 |
| 8 | Shockwave power +1.2 to +2.5; it runs 80% farther. | wave 2.5, reach 0.8 |

Evolution **Split Earth** (partner `br_heavy`): Every slam is a fissure, and full Heft no longer needs spending on it.
Evolved values: alwaysFissure 1.

#### `br_counter` Counter Cleave

Attack, precise, K. Parry: the Counter Cleave hits the attacker far harder.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The Counter Cleave hits the attacker 1.5 AD harder. | power 1.5 |
| 2 | New: it reaches 12 px farther. | reach 12 |
| 3 | New: it is a sure crit. | crit 1 |
| 4 | Counter power +1.5 to +7. | power 7 |
| 5 | New: a parry gives 20 more Heft. | heft 20 |
| 6 | New: it throws a crescent ahead. | wave 2 |
| 7 | New: her next 2 swings after a parry deal +50%. | after 0.5, afterBlows 2 |
| 8 | Counter power +7 to +25; the crescent hits harder. | power 25, wave 5 |

Evolution **Iron Answer** (partner `br_ironskin`): A block also answers with a Counter Cleave at half its power.
Evolved values: blockCleave 0.5.

#### `br_spin` Spinning Throw

Movement, timed, J. The warp costs less and comes back sooner, and the spinning sword cuts on its way.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Warp costs 7 MP and recharges in 1.6 s. | cost 7, recharge 1.6, charges 1 |
| 2 | New: the spinning sword cuts every foe it passes. | path 0.8 |
| 3 | New: the shock ring reaches 16 px farther and hits harder. | ring 16, ringPower 0.4 |
| 4 | Recharge 1.6 to 1.2 s. | recharge 1.2 |
| 5 | New: two warp charges. | charges 2 |
| 6 | The passing cut 0.8 to 2 AD. | path 2 |
| 7 | New: the arrival chop hits 3 AD. | strike 3 |
| 8 | Chop 3 to 6 AD; the ring and the cut hit far harder. | path 3, ringPower 1.5, strike 6 |

Evolution **Iron Wheel** (partner `br_crater`): Where she lands, a crimson wheel of the sword keeps spinning and cutting foes round her for 1.5 s.
Evolved values: wheel 1.5, wheelPower 1.2.

#### `br_crater` Crater Leap

Movement, timed, Up. The falling slam lands harder and wider, and sends shockwaves along the floor.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The falling slam lands 0.8 AD harder. | ring 0.8 |
| 2 | Its ring reaches 12 px farther. | reach 12 |
| 3 | New: the landing sends shockwaves both ways. | waves 0.8 |
| 4 | Landing power +0.8 to +2. | ring 2 |
| 5 | New: the landing gives 20 Heft. | heft 20 |
| 6 | New: foes the landing strikes are thrown up. | launch 1 |
| 7 | New: the landing drags foes within 60 px in to her first. | reach 24, waves 2, pull 60 |
| 8 | Landing power +2 to +4.5; shockwaves +2 to +4. | ring 4.5, waves 4 |

Evolution **Star Crater** (partner `br_spin`): Every falling slam splits the floor with fissures both ways.
Evolved values: fissures 1.

#### `br_charge` Shoulder Charge

Movement, timed, L. The dodge shoulders through foes, and ends in a shockwave.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The dodge shoulders every foe it passes through. | power 0.8 |
| 2 | New: each foe shouldered gives 8 Heft. | heft 8 |
| 3 | Shoulder power 0.8 to 1.6. | power 1.6 |
| 4 | New: a shockwave runs ahead where the dodge ends. | wave 1 |
| 5 | Shoulder power 1.6 to 3. | power 3 |
| 6 | New: foes shouldered are knocked down. | stun 0.7 |
| 7 | New: each foe shouldered gives 12 stamina back. | stamina 12 |
| 8 | Shoulder power 3 to 5.5; the shockwave hits harder. | power 5.5, wave 3 |

Evolution **Battering Ram** (partner `br_cry`): The dodge splits the floor behind her into a fissure that strikes every foe she passed.
Evolved values: trail 3.

#### `br_arc` Ember Arc

Spell, easy, I. An ability: throw a tall crimson crescent that cuts every foe along the line. Held, a fan of three.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Ember Arc: throw a tall crimson crescent along the line ahead. | power 2, recharge 4, reach 200, count 1 |
| 2 | Recharge 4 to 3 s. | recharge 3 |
| 3 | New: the crescent sets foes burning. | burn 2 |
| 4 | New: the crescent is half again as tall. | size 0.5 |
| 5 | Power 2 to 3.5 AP. | power 3.5 |
| 6 | New: two crescents, one after the other. | count 2 |
| 7 | New: crescents fly the whole screen. | reach 320 |
| 8 | Power 3.5 to 5 AP; three crescents. | power 5, count 3 |

Evolution **Wildfire Arc** (partner `br_cinder`): Each foe Ember Arc hits sends a crimson crescent on along the line.
Evolved values: drill.chain 1.5 (native: back 1).

#### `br_pillars` Brand Pillars

Spell, timed, I. An ability: crimson pillars burst out of the floor in a line ahead and throw foes up. Held, both ways.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Brand Pillars: crimson pillars burst from the floor one after another ahead. | power 1.3, count 4, recharge 6, gap 22 |
| 2 | New: five pillars, and foes they strike are held in place a moment. | count 5, halt 0.8 |
| 3 | New: pillars set foes burning. | burn 2 |
| 4 | Power 1.3 to 2.2 AP. | power 2.2 |
| 5 | New: foes a pillar throws up lie down after. | stun 0.8 |
| 6 | Seven pillars; recharge 6 to 5 s. | count 7, recharge 5 |
| 7 | New: the line erupts again a moment later. | again 0.6 |
| 8 | Power 2.2 to 4.4 AP; the second line as hard. | power 4.4, again 1 |

Evolution **Aftershock** (partner `br_fault`): Quake strikes again half a second later where it struck.
Evolved values: drill.again 1 (native: again 1, third 2).

#### `br_cry` War Cry

Spell, easy, I. An ability: a roar that knocks foes back, fills Heft and makes her hit harder for a while.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn War Cry: a roar knocks foes back and fills 25 Heft. | reach 60, heft 25, recharge 8, buff 0.1, time 4 |
| 2 | New: the roar hits 1 AP. | power 1 |
| 3 | Her damage +10% to +20% for 4 s after. | buff 0.2 |
| 4 | New: the roar heals 8% of her HP. | heal 0.08 |
| 5 | Reach 60 to 90 px; 40 Heft. | reach 90, heft 40 |
| 6 | New: stamina comes back 25 a second while it lasts; damage +35%. | buff 0.35, time 6, stamina 25 |
| 7 | New: she is armoured the whole time. | armour 1 |
| 8 | Roar 1 to 4 AP; Heft fills to full. | heft 100, power 4 |

Evolution **Battle Roar** (partner `br_bellows`): Every warp arrival readies the selected spell at once.
Evolved values: drill.ready 1 (native: heavy 1, taken 0.33).

#### `br_cinder` Cinder Edge

Dot, easy, auto. Her slashes lay searing embers, and the third slash lays the most.
It replaced Searing Edge (`br_embers`), which laid embers only on blows of a native combo move, so it never fired in the drill.
It answers the shared `blow` event (a sword blow, with the third slash as the finisher) and the `dash` event, so it runs in both kits.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Her slashes lay searing embers that burn foes. | damage 0.06, max 4, stacks 1, finisher 1 |
| 2 | New: the third slash lays 3 embers. | finisher 3 |
| 3 | New: the third slash spreads a foe's embers to the foes beside it. | spread 1 |
| 4 | Embers burn 0.06 to 0.12 AD a tick; a foe holds 8. | damage 0.12, max 8 |
| 5 | New: a dash lays 2 embers on each foe it passes through. | dash 2 |
| 6 | Embers burn 0.12 to 0.22 AD. | damage 0.22 |
| 7 | New: each slash lays 2 embers; a foe holds 12. | stacks 2, max 12 |
| 8 | Embers burn 0.22 to 0.45 AD. | damage 0.45 |

Evolution **Forge Heart** (partner `br_arc`): A foe filled with embers bursts into a crimson blast that burns those round it.
Evolved values: burst 0.5 AD per ember.
A full foe at level 8 burns 12 times 0.45 AD a tick against 4 times 0.06 at level 1, about 22 times.

#### `br_fault` Fault Lines

Dot, timed, auto. The third slash and her shockwaves leave burning cracks in the floor that hurt foes standing on them.
In the drill only other skills made shockwaves, so on its own it did nothing until a charged tier made a fissure; the third slash now cracks the floor itself (`game/drill/skills/faultLines.ts`, `drill.reach` and `drill.both`).
The table shows the drill card; values without the `drill.` prefix are shared with the native kit.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The third slash and her shockwaves leave burning cracks in the floor. | damage 0.15, time 2, every 0.5, drill.reach 60 |
| 2 | New: foes walking over a crack are slowed; cracks burn 3 s. | time 3, chill 0.6 |
| 3 | New: fissures leave burning cracks too. | fissure 1 |
| 4 | Cracks burn 0.15 to 0.3 AD a tick. | damage 0.3 |
| 5 | New: foes on a crack are held in place. | halt 1 |
| 6 | Cracks tick every 0.35 s; the third slash cracks 90 px. | every 0.35, heft 2 (native only), drill.reach 90 |
| 7 | New: the third slash cracks both ways; cracks burn 0.6 AD for 4 s. | damage 0.6, time 4, drill.both 1 |
| 8 | Cracks burn 0.6 to 1.1 AD. | damage 1.1 |

Evolution **Rift Floor** (partner `br_slam`): When a crack burns out, it bursts up along its whole length.
Evolved values: erupt 4.

#### `br_crush` Crushing Weight

Dot, timed, auto. Her second and third slashes crush foes, and crushed foes bleed.
The spike and Grindstone read the `blow` event's finisher flag (the slam natively, the third slash in the drill); they read the native `slam` move before, which the drill never sets.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Her second and third slashes crush foes, and crushed foes bleed. | damage 0.12, max 3, every 0.5, time 2 |
| 2 | Crush 0.12 to 0.2 AD a tick. | damage 0.2 |
| 3 | New: her blows crush foes in the air too. | air 1 |
| 4 | A foe holds 6 stacks; they last 3 s and tick every 0.35 s. | max 6, every 0.35, time 3 |
| 5 | New: the third slash on a foe in the air lays 3 stacks at once. | spike 3 |
| 6 | New: a crushed foe that falls passes its stacks to the foes round it; crush 0.4 AD. | damage 0.4, spread 1 |
| 7 | New: crushed foes are held in place while they bleed. | halt 1 |
| 8 | Crush 0.4 to 0.8 AD; a foe holds 10. | damage 0.8, max 10 |

Evolution **Grindstone** (partner `br_launch`): Her third slash on a crushed foe grinds all its stacks out at once.
Evolved values: grind 1.5.

#### `br_falling` Falling Blade

Summon, easy, auto. Kills may call a phantom greatsword down from the sky onto the next foe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A kill may drop a phantom greatsword on the nearest foe. | chance 0.35, power 1, reach 18, count 1, cooldown 1.2 |
| 2 | Chance 35% to 55%. | chance 0.55 |
| 3 | New: the blade knocks foes round it down. | stun 0.6 |
| 4 | Power 1 to 1.6 AD. | power 1.6 |
| 5 | New: two blades fall on two foes. | count 2 |
| 6 | New: the blade throws foes up; its ring reaches 30 px. | reach 30, launch 1 |
| 7 | New: a kill drops one 3 times in 4. | chance 0.75 |
| 8 | Power 1.6 to 2.6 AD. | power 2.6 |

Evolution **Blade Rain** (partner `br_fall`): Blades keep falling on foes near her for 1.5 s after a kill calls them.
Evolved values: rain 1.5.

#### `br_echo` Echo Swing

Summon, precise, auto. A parry calls a crimson echo of her behind the attacker that brings down a heavy cleave.
Its sixth level answers a Keen sword blow through the shared `blow` event; it answered the native kit's own heavy-swing event before, which the drill never sent.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry may call a crimson echo of her that cleaves the attacker. | power 3, chance 0.5, cooldown 1, cuts 1 |
| 2 | New: its cleave also hits foes beside the attacker; chance 100%. | chance 1, ring 0.5 |
| 3 | New: perfect dodges call it too. | both 1 |
| 4 | Echo power 3 to 6 AD. | power 6 |
| 5 | New: the echo swings twice. | cuts 2 |
| 6 | New: Keen blows call it 25% of the time. | heavy 0.25 |
| 7 | Echo power 6 to 10 AD. | power 10 |
| 8 | Echo power 10 to 30 AD. | power 30 |

Evolution **Twin Echo** (partner `br_counter`): Two echoes, one on each side, and each cleave hits half again as hard.
Evolved values: power 45, twin 1.

#### `br_splinter` Heart Splinter

Summon, timed, auto. A warp strike splinters the crystal in Anvilheart, and the red splinters dart at foes on their own.
It replaced Red Shard (`br_shard`), which chipped shards only on blows of a native combo move, so it never fired in the drill.
It answers the shared `warp` event and the `blow` event's finisher flag, so it runs in both kits.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A warp strike may leave a red splinter that darts at foes. | chance 0.6, warp 1, power 0.5, strikes 3, count 2, cooldown 0.5 |
| 2 | New: the third slash may chip one off too. | finisher 0.3 |
| 3 | New: a splinter's strike marks the foe, +10% from her for 2 s. | mark 0.1 |
| 4 | Power 0.5 to 0.9 AD; 5 strikes each. | power 0.9, strikes 5 |
| 5 | New: a warp strike leaves two splinters. | warp 2 |
| 6 | Power 0.9 to 1.4 AD; every warp strike leaves them. | power 1.4, chance 1 |
| 7 | New: splinter strikes pass through to a second foe. | pierce 1 |
| 8 | Power 1.4 to 2 AD; four out at once. | power 2, count 4 |

Evolution **Crimson Halo** (partner `br_heavy`): Four splinters circle her for good and dart out at every foe near her.
Evolved values: count 4, orbit 1.
One warp strike is worth 0.6 times 3 strikes of 0.5 AD at level 1 and 2 splinters of 5 strikes of 2 AD at level 8, about 22 times.

#### `br_ironskin` Iron Skin

Passive, easy, auto. Her armour stops more of each blow, and she stands longer.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Her armour takes 10% more off each blow. | armour 0.1, max hp +10 |
| 2 | New: while armoured, stamina comes back 15 a second; max HP +20. | stamina 15, max hp +20 |
| 3 | New: a block costs 25% less stamina. | block 0.25 |
| 4 | Armour takes 10% to 20% more. | armour 0.2 |
| 5 | New: each blow her armour takes gives 10 Heft. | heft 10 |
| 6 | New: each blow her armour takes gives 4 MP; max HP +40. | mp 4, max hp +40 |
| 7 | Armour takes 20% to 35% more. | armour 0.35 |
| 8 | Max HP +40 to +60; a block costs 40% less. | block 0.4, max hp +60 |

Evolution **Living Anvil** (partner `br_cry`): Every dash leaves a shock ring round her.
Evolved values: drill.ring 1.5 (native: living 1).

#### `br_bellows` Bellows

Passive, timed, auto. Heft builds faster and holds longer, and a full bar makes her swing faster.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Heft builds 20% faster. | heftGain 0.2 |
| 2 | New: Heft waits 2 s longer before it drains. | hold 2 |
| 3 | New: at full Heft her swings are 15% faster. | speed 0.15 |
| 4 | Heft builds 20% to 40% faster. | heftGain 0.4 |
| 5 | New: at full Heft stamina comes back 20 a second. | stamina 20 |
| 6 | Swings at full Heft 15% to 25% faster. | speed 0.25 |
| 7 | New: at full Heft her hits deal +20%. | damage 0.2 |
| 8 | Heft builds 40% to 80% faster; full Heft hits +35%. | heftGain 0.8, damage 0.35 |

Evolution **Furnace** (partner `br_crush`): A fissure leaves half the bar full.
Evolved values: keep 0.5.

#### `br_fall` Crimson Fall

Ultimate, timed, J held. The four tiers of Crimson Fall on held J hit harder, reach farther and charge faster.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Crimson Fall hits 30% harder. | power 1.3 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: fissures run out both ways from where it lands. | fissures 0.5 |
| 4 | New: foes past its reach are dragged in first; power +70%. | power 1.7, reach 0.25, pull 1 |
| 5 | New: two aftershocks shake the floor round her. | quakes 2, after 0.4 |
| 6 | Fissures hit 0.5 to 0.8 of the blow. | fissures 0.8 |
| 7 | New: a second crescent comes down behind her. | falls 2 |
| 8 | Power +70% to +120%; three aftershocks. | power 2.2, quakes 3 |

Evolution **Sundered Sky** (partner `br_heavy`): Three crescents fall one after another, each wider than the last.
Evolved values: power 3, falls 3, widen 0.35.

## Balance

Measured 15 November 2026 in a measuring room built for this hero to the method in `docs/skills/balance.md`: the run starts at wave 2 and hero level 1 with only the skill under test, the wave's stream is stopped, and the room keeps a crowd of six (four husks and two wisps) or one husk at three times its HP, refilled 0.35 s after a foe falls, with her HP kept full.
A scripted player walks to the nearest foe and plays the string, pressing 30% of follow-ups in the Keen beat, casts the selected ability when it is ready, warps every 4 s at a distant foe, and makes a parry and a perfect dodge in turn every 7 s through the game's own functions.
Each figure is damage a second over 30 to 40 s of game time, on her sources (`attacks`, `abilities`, `ultimate` and the skill's own id).
The script lives in the task's scratch folder, outside the repo.

The same room run with Kael read 81 a second on the crowd and 42 on one foe, against 146 and 42 in `docs/skills/balance.md`, so this room's figures are its own scale and only compare within it.
Two runs of Brynn's base kit read 150 and 177 on the crowd and 74 and 119 on one foe: one run swings by 20 to 40%.

| Skill | Target | Base kit | Level 8 | Evolved |
| --- | --- | --- | --- | --- |
| Heavy Hands | one | 74 to 119 | 114 at bonus 12 (before tuning) | 149 at bonus 18 (before tuning) |
| Wide Arc | crowd | 150 to 177 | 284 at power 3.2 (before tuning) | 611 at wave 2.5 (before tuning) |
| Skyward Heave | crowd | 150 to 177 | 277 | 225 |
| Anvil Weight | crowd | 150 to 177 | 444 at wave 5 (before tuning) | 315 (before tuning) |
| Counter Cleave | one | 74 to 119 | 92 at power 14 (before tuning) | the same: Iron Answer needs blocks, which the room has none of |
| Spinning Throw | one | 74 to 119 | 117 | 125 |
| Ember Arc | crowd | 150 to 177 | 251 at power 7 (before tuning) | 251: the returning crescents flew off the stage before they turned, fixed since and not measured again |
| Brand Pillars | crowd | 150 to 177 | 251 | 152 |
| War Cry | crowd | 150 to 177 | no run | 271 |
| Fault Lines | crowd | 150 to 177 | 297 (106 its own) | 297 (101 its own) |
| Crushing Weight | one | 74 to 119 | 39 (23 its own) | 124 (57 its own) |
| Falling Blade | crowd | 150 to 177 | 689 (392 its own, before tuning); 170 (73 its own) after | 1677 (before tuning); 126 (86 its own) after |
| Echo Swing | one | 74 to 119 | 105 (42 its own, before tuning); 123 (110 its own) after | 126 (63 its own, before tuning); 178 (164 its own) after |
| Bellows | crowd | 150 to 177 | 137 | 267 |
| Crimson Fall | crowd, cast every 10 s | 54 a second from the ultimate | 467 (8.7 times the base special) | 293 (5.4 times) |

Tuning from those runs, in the data rows: Falling Blade's power, its seventh level's chance and its evolution's rain came down, and a rain no longer restarts while it falls; Wide Arc's last level and Horizon Cleave came down; Anvil Weight's shockwave came down; Ember Arc's last level came down; Heavy Hands (bonus 20, evolved 30), Counter Cleave (25 at level 8) and Echo Swing (30, evolved 45) went up on the foe they are aimed at.

### Still off or not measured

- Crater Leap and Shoulder Charge read the same as the base kit in the first room, since its scripted player never jumped or dodged out of a free state; a second room that did jumped onto the ledges and stood out of reach, so its figures were not used. Both were seen working in play (stills and the build runs) and are unmeasured.
- Counter Cleave after tuning, War Cry at level 8, Iron Skin (no damage of its own), Cinder Edge, Heart Splinter and every level 1 figure but two were not measured.
- Crimson Fall evolved read lower than level 8, which the overkill of a refilling crowd can explain; per cast it sits near the 6 times asked at level 8 and under the 15 times asked evolved.
- Precise skills sit under the precise band on one foe at the model's trigger rates, as Kael's did before his round 2.

## Bot runs

Every run from the start menu in a fresh session, on this branch (`agent-studio/playtest`, one run each, deterministic).

| Run | Wave | Level | Kills | Coins | Seconds |
| --- | --- | --- | --- | --- | --- |
| Kael, skilled | 5 | 6 | 17 | 27 | 100.5 |
| Brynn, skilled | 5 | 6 | 18 | 29 | 96.4 |
| Kael, mash | 5 | 5 | 14 | 28 | 94 |
| Brynn, mash | 5 | 6 | 18 | 27 | 104.9 |
| Kael, skilled from wave 11 at level 12 | 12 | 14 | 15 | 20 | 44.8 |
| Brynn, skilled from wave 11 at level 12 | 13 | 15 | 18 | 24 | 75.3 |

## Where the code is

| Skill | Code |
| --- | --- |
| Heavy Hands | `game/heavy.ts` (window, crescent, streak, Mountain Hands), `game/bonus.ts` (the bonus on the payoff foe), `game/slam.ts` (half-Heft fissure) |
| Wide Arc | `game/shapeHit.ts` (the sweep), `game/skills/wideArc.ts` (the mark), `game/afterStrike.ts` (Horizon Cleave) |
| Skyward Heave | `game/shapeHit.ts` (the heave), `game/bonus.ts` (airborne taken), `game/skills/skywardHeave.ts` (crash, Meteor Heave) |
| Anvil Weight | `game/slam.ts` |
| Counter Cleave | `game/guardStyle.ts`, `game/bonus.ts` (the swings after a parry) |
| Spinning Throw | the shared warp's tune in `game/warpStyle.ts`, `game/skills/spinningThrow.ts` (Iron Wheel) |
| Crater Leap | `game/moves/air.ts`, `game/craterLanding.ts` |
| Shoulder Charge | `game/shoulderCharge.ts` on the shared dodge's hooks |
| Ember Arc, Brand Pillars, War Cry | `game/spells.ts`, `game/abilities.ts`, `game/effects/pillars.ts`, `game/effects/heavyWave.ts` |
| Cinder Edge, Fault Lines, Crushing Weight | `game/skills/cinderEdge.ts`, `faultLines.ts`, `crushingWeight.ts`, `game/effects/crack.ts`, `game/drill/skills/faultLines.ts`, `game/drill/skills/crushingWeight.ts` |
| Falling Blade, Echo Swing, Heart Splinter | `game/skills/fallingBlade.ts`, `echoSwing.ts`, `heartSplinter.ts` |
| Iron Skin, Bellows | `game/armour.ts`, `game/heft.ts`, `game/stamina.ts`, `game/bonus.ts` |
| Crimson Fall | `game/ultimate/crimsonFall.ts` |

Paths are under `src/heroes/brynn/`.
Icons are in `src/heroes/brynn/ui/icons/`: one per skill, and an evolved form for each (`<id>_evo`) that adds to the skill's icon and carries the gold star.
