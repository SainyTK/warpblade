# Yun skills

Yun's part of the sword roster (`docs/skill-design.md`), with his design note in `docs/heroes/yun.md`.
Numbers are the values in `src/heroes/yun/constants/`.
AD and AP mean Yun's attack damage and ability power (10 and 11 at hero level 1, `YUN.base`).

## Drill set

Solo Adventure runs base Yun on the shared drill engine; all 20 skills are offered there, each upgrading one drill mechanic, to the contract in `docs/skill-design.md` ("Drill baseline").
The rows keep the numbers the native kit reads, so the sections after this one still describe the native kit, and the card text is the drill's.
Drill code: `src/heroes/yun/game/drill/skills/`, folded into `YUN_DRILL` by `game/drill/hooks.ts`; the drill numbers sit under a `drill.` prefix (`constants/skills/drill.ts`).

| Id | Name | Mechanic | Level 1 | Levels 2 to 8 | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| `yu_flow` | Flowing Water | first cut | a landed Willow Cut sends a qi wave | stagger, a wave behind, +15% reach on every cut, a second wave, up to 6 AD | Still Water (`yu_echo`): waves run 160 px and hold feet |
| `yu_echo` | Twin Echo | second cut | Crane Wheel sends 2 spirit swords thrusting | Willow Cut echoed, a cut on the way back, four swords, every cut echoed, up to 2.6 AD | Myriad Echo (`yu_breath`): echoes always crit and reach 110 px |
| `yu_tide` | High Tide | third cut | Returning Tide runs a floor crescent | knockdown, finisher +30% to +120%, a launch, a second crescent, up to 7 AD | Spring Tide (`yu_bleed`): crescents both ways |
| `yu_petal` | Petal Storm | air cut | one more air cut | cutting petals below, air dash back, two more air cuts, stagger, up to 4.5 AD | Blossom Fall (`yu_cloud`): landing sends crescents both ways |
| `yu_crane` | Crane's Reach | guard and parry | parry window +40% | a parry wave, a block wave, window +80%, held feet, up to 8 AD | White Crane (`yu_tide`): three parry waves |
| `yu_ride` | Sword Riding | warp strike | recharge -15%, damage +30% | spirit swords follow the arrival, air dash and cut back, four swords, recharge -40%, damage +200% | Riding the Wind (`yu_echo`): every 4 s an arrival recharges the warp |
| `yu_drift` | Drifting Leaf | dash | dashing through foes cuts them | stagger, a dash through a foe recharges it, one more air dash, a damage mark, up to 6 AD | Leaf on the Wind (`yu_cloud`): two cuts |
| `yu_harmony` | Harmony | warp and infusion | an arrival fills the jian for 1 hit | faster preparation (up to 50%), longer infusions, an arrival shortens a preparation | Perfect Harmony (`yu_breath`): every arrival readies the art |
| `yu_breath` | Sage's Breath | dash and air dash | one more air dash | the air dash restores air cuts, a qi ring at each dash end, two more air dashes, stagger, up to 5 AD | Sword Sea (`yu_guardian`): air dashes send three swords |
| `yu_cloud` | Cloud Step | jump, wall kick, air | one more air cut | a cutting wall kick, a landing ring, one more air dash, two more air cuts, up to 7 AD | Cloud Walker (`yu_drift`): a 70 px landing ring that holds feet |
| `yu_fan` | Sword Fan | Sword Stream | Stream +0.5 AP | piercing, knockback, three more swords, preparation -25%, up to +4.5 AP | Peacock Fan (`yu_guardian`): eight more swords |
| `yu_cage` | Sword Cage | Sword Lotus | longer hold, +0.4 AP | a pull, a damage mark, a second cut, a pin, up to +4 AP | Jade Prison (`yu_needle`): three more cuts |
| `yu_crescent` | Qi Crescent | Qi Crescent | Crescent +0.5 AP | a wave on past the foe, stagger, waves from crescent-filled cuts, a launch, up to +4.5 AP | Moon Crescent (`yu_tide`): crescents split in two |
| `yu_wound` | Lingering Qi | dot on cuts | cuts and infused hits lay qi wounds, 0.04 AD a tick | stacks to 6, sword arts lay wounds, a slow, a dying foe passes its wounds on, up to 0.24 AD | Qi Burst (`yu_fan`): full wounds burst for 0.8 AD a stack |
| `yu_bleed` | Thousand Cuts | dot on sword arts | sword art cuts lay bleeding wounds, 0.05 AP a tick | stacks to 8, Jade Rain lays wounds, wounds last twice as long and bleed twice as fast, up to 0.24 AP | Thousand Petals (`yu_crescent`): a Sword Lotus ends by striking every wound at once |
| `yu_needle` | Jade Needle | dot on parries | a parry lodges 2 needles in the nearest foe, 0.3 AD a tick | Keen blows lodge needles, stacks to 12, +15% damage taken, perfect dodges lodge needles, up to 1.5 AD | Acupuncture (`yu_flow`): 12 needles burst for 6 AD each |
| `yu_guardian` | Guardian Blade | summon on landed blows | a landed blow may call a guardian blade, 0.4 AD a strike | two foes a strike, two guardians, longer and faster, a slow, three guardians, up to 1.2 AD | Heavenly Guard (`yu_breath`): three guardians always out |
| `yu_heron` | Jade Heron | summon on casts | a cast may call a jade heron for 1 AD | it flies back, two herons, a knockdown, Jade Rain calls them, up to 2.6 AD | Heron Flight (`yu_fan`): every cast calls three |
| `yu_shade` | Sage's Shade | summon on parries | a parry calls the shade for one 4 AD cut | perfect dodges call it, two cuts, the last cut recharges the warp, +25% damage taken, up to 20 AD | Many Shades (`yu_needle`): three cuts of 30 AD |
| `yu_rain` | Heaven's Grove | the four Jade Rain tiers | Jade Rain +30% | swords on every foe, faster charge, +25% reach, a lingering rain, up to +250% | Endless Rain (`yu_heron`): the rain keeps falling 4 s |

Count by mechanic: 4 cut skills, 1 guard skill, 4 warp and dash skills, 1 jump skill, 3 sword-art skills, 3 damage over time, 3 summons, 1 charged-tier skill.
Harmony and Sage's Breath were passives on the spirit swords and are movement skills now; Crane's Reach moved from the string to the guard.
Keen presses and perfect dodges (a blow met during a dash) fire in the drill, so Jade Needle and Sage's Shade work there in full, and Thousand Petals answers the drill's Sword Lotus.
The summons and Jade Needle answer the shared `blow`, `cast`, `ultimate`, `parry` and `perfectDodge` events (`game/skills/`), so they need no drill file.

## Identity

Yun is the sword sage: a flowing string of circular cuts, spirit swords that hover behind him and repeat each blow as a thrust at range, and abilities that send the swords out.
His skills lean on the spirit swords: more of them, stronger echoes, new ways to send them, and summons and wounds that grow from them.
He plays on the moveset every hero shares (`docs/moveset-design.md`).
Every skill is on a single button press or runs on its own; nothing asks for a direction, a dash or a double tap during or after a combo.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The ground string, fixed at 4 cuts and the same wherever the foes stand: Willow Cut (0.95 AD), Turning Leaf (1 AD), Crane Wheel (1.15 AD), Returning Tide (2.1 AD, knocks down, sends a qi crescent along the floor for 0.5 AD, and gives a spirit sword when it lands). No blow turns Yun around. |
| J (echo) | After every blow each held spirit sword thrusts ahead, one after another, from 22 to 64 px in front, for 0.22 AD each. Guards do not stop it. |
| J (Keen) | J pressed in the 0.1 s after a blow lands makes the next blow a sure crit; its echo is a sure crit too and reaches a third farther. |
| J (air) | Air string of 2 per jump: Drifting Cut (0.9 AD) and Falling Petal (1.05 AD, drives the foe down), each echoed. His fall is floatier (gravity 0.8). |
| J held | The shared warp: the jian flies with its tassel streaming and Yun's wisp riding it; on arrival each held spirit sword dives onto the foe for 0.12 AD. 10 MP, 2 s recharge. |
| K | Guard: the held swords fan out before him; a block lets 30% through and costs 14 stamina. |
| K (parry) | Deflecting Qi: the shared parry, then a qi wave runs 120 px ahead for 1.2 AD to each foe, and a spirit sword joins him. |
| L | The shared dodge. |
| I | Cast the selected ability; on a recharging one, the next ready one. Sword Stream and Sword Lotus spend every held sword and need one; they cost no MP. |
| I held | The wide form of the selected ability, for the same cost. |
| I in an open string | Free Hand: after a blow has landed, the ability leaves his sword fingers at once with no cast pose, and the string stays open. |
| O | Switch to the next ability. |
| U | Jade Rain, charged in four levels: three spirit swords fall on each foe on screen (up to 6), together 75% of the level power. Heaven's Grove upgrades it. |
| Up | Jump; Up again in the air is a double jump. |

Spirit swords (the SW bar): he holds up to 4, starts a run with 2, and one comes back every 2.5 s while he holds fewer than 2.
Returning Tide landing and a parry each give one.

Base abilities:

- **Sword Stream**: every held sword flies 150 px along the line ahead and back, cutting each foe once each way for 0.8 AP. Held: the swords fan out at three heights and fly 210 px. 1.2 s.
- **Sword Lotus**: every held sword spins in a ring 44 px ahead for 2.4 s, each cutting the foes it passes every 0.35 s for 0.3 AP. Held: the ring spins round Yun and follows him for 3 s, a little wider. 3.5 s.

The ability order is Stream, Lotus, Fan, Cage, Crescent, the last three shown once their skill is held.
Sword Fan and Sword Cage spend the swords like the base abilities; Qi Crescent costs 14 MP, so it works with no sword out.

### Combo hits and the air string

- `comboHits: 4`. The string is Willow Cut, Turning Leaf, Crane Wheel, Returning Tide; skills reshape the blows (Crane's Reach, Flowing Water) and the tide's crescent (High Tide), never the length.
- Air string limit: 2 per jump, 3 with Petal Storm at level 3 and 4 evolved; the cuts go round Drifting Cut, Falling Petal again.
- Each blow holds its wind-up from frame 2 to its hit frame (5, Crane Wheel 6, Returning Tide 7) and keeps the tempo in `src/heroes/yun/constants/string.ts`.

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `yu_echo` | Twin Echo | attack | easy | J | `yu_breath` | Myriad Echo |
| `yu_flow` | Flowing Water | attack | precise | J | `yu_echo` | Still Water |
| `yu_tide` | High Tide | attack | timed | J | `yu_bleed` | Spring Tide |
| `yu_crane` | Crane's Reach | attack | easy | K | `yu_tide` | White Crane |
| `yu_petal` | Petal Storm | attack | timed | J (air) | `yu_cloud` | Blossom Fall |
| `yu_cloud` | Cloud Step | movement | timed | Up | `yu_drift` | Cloud Walker |
| `yu_ride` | Sword Riding | movement | timed | J held | `yu_echo` | Riding the Wind |
| `yu_drift` | Drifting Leaf | movement | easy | L | `yu_cloud` | Leaf on the Wind |
| `yu_fan` | Sword Fan | spell | easy | I | `yu_guardian` | Peacock Fan |
| `yu_cage` | Sword Cage | spell | timed | I | `yu_needle` | Jade Prison |
| `yu_crescent` | Qi Crescent | spell | timed | I | `yu_tide` | Moon Crescent |
| `yu_wound` | Lingering Qi | dot | easy | auto (echo thrusts) | `yu_fan` | Qi Burst |
| `yu_bleed` | Thousand Cuts | dot | timed | auto (sword art cuts) | `yu_crescent` | Thousand Petals |
| `yu_needle` | Jade Needle | dot | precise | K (parry) | `yu_flow` | Acupuncture |
| `yu_guardian` | Guardian Blade | summon | easy | auto (blow landed) | `yu_breath` | Heavenly Guard |
| `yu_heron` | Jade Heron | summon | timed | auto (cast) | `yu_fan` | Heron Flight |
| `yu_shade` | Sage's Shade | summon | precise | K (parry) | `yu_needle` | Many Shades |
| `yu_breath` | Sage's Breath | movement | easy | L | `yu_guardian` | Sword Sea |
| `yu_harmony` | Harmony | movement | timed | L | `yu_breath` | Perfect Harmony |
| `yu_rain` | Heaven's Grove | ultimate | easy | J | `yu_heron` | Endless Rain |

Counts: attack 5, movement 5, spell 3, dot 3, summon 3, ultimate 1.
Risk: easy 8, timed 9, precise 3.
The Values column shows only the numbers a level changes; the data rows carry the whole state.
In the Code lines, file names are under `src/heroes/yun/game/`.

"New" in a card line marks a level that adds a property; the rest are number steps.
Damage source: hits of Yun's own presses (string blows, echoes, the tide's crescent, the warp's swords, the parry's wave, Cloud Step's ring, Drifting Leaf's cuts, abilities, Jade Rain) count as `attacks`, `abilities` or `ultimate` and build Flow; wounds, needles, guardians, herons and the shade use the skill id and build no Flow.

#### `yu_echo` Twin Echo

Attack, easy, J. Sword Echo grows: harder and longer thrusts that cut twice and slow.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Echo thrusts hit 30% harder. | power 1.3 |
| 2 | Echo power +30% to +60%. | power 1.6 |
| 3 | New: echoes reach 16 px further. | reach 16 |
| 4 | Echo power +60% to +100%. | power 2 |
| 5 | New: each echo cuts again on its way back. | back 0.5 |
| 6 | New: echoes slow foes for 1 s. | chill 1 |
| 7 | Echo power +100% to +200%. | power 3 |
| 8 | New: with no sword out, the jian thrusts an echo of its own; +250%. | ghost 1, power 3.5 |

Evolution, with `yu_breath` at level 4: **Myriad Echo**. Every spirit sword thrusts twice for each of your blows. (twice 1)

Values: `power` multiplies each echo thrust, `reach` pixels it reaches further, `back` share of a second cut on its way back, `chill` seconds it slows a foe, `ghost` the jian thrusts an echo of its own when no sword is out, `twice` each sword thrusts twice.

Code: `echo.ts` and `effects/echoThrust.ts`.

#### `yu_flow` Flowing Water

Attack, precise, J. Keen blows hit far harder, give spirit swords and send qi waves.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A Keen blow hits twice as hard on its foe. | keen 1 |
| 2 | Keen bonus 100% to 160%. | keen 1.6 |
| 3 | New: Keen timing is 0.05 s longer. | window 0.05 |
| 4 | Keen bonus 160% to 250%. | keen 2.5 |
| 5 | New: a Keen blow gives a spirit sword, once every 2 s. | sword 2 |
| 6 | Keen bonus 250% to 400%. | keen 4 |
| 7 | New: a Keen blow sends a qi wave at its foe. | wave 1, waves 1 |
| 8 | New: a Keen blow on a foe in the air throws it higher; bonus 600%. | keen 6, wave 4, lift 1 |

Evolution, with `yu_echo` at level 4: **Still Water**. Keen blows deal ten times their power on their foe and send three qi waves. (keen 9, waves 3)

Values: `keen` share of extra power a Keen blow deals on its foe, `window` seconds added to Keen timing, `sword` seconds between spirit swords a Keen blow gives, `wave` power of the qi wave a Keen blow sends, in attack damage, `waves` how many waves, `lift` a Keen blow throws an airborne foe up.

Code: `shapeHit.ts` (the Keen bonus with its payoff) and `skills/flowingWater.ts` (window, sword, waves).

#### `yu_tide` High Tide

Attack, timed, J. Returning Tide's crescent grows: harder, taller, it lifts foes and brings more swords.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Returning Tide's crescent cuts three times as hard. | wave 3 |
| 2 | Crescent power x3 to x4.5; it runs 20 px further. | wave 4.5, reach 20 |
| 3 | New: the crescent is twice as tall. | tall 2 |
| 4 | Crescent power x4.5 to x6.5. | wave 6.5 |
| 5 | New: a landed tide gives two spirit swords. | gain 2 |
| 6 | New: the crescent throws foes up. | launch 1 |
| 7 | Crescent power x6.5 to x9; it runs 50 px further. | wave 9, reach 50 |
| 8 | New: a second crescent follows the first. | twin 1, wave 11 |

Evolution, with `yu_bleed` at level 4: **Spring Tide**. The tide sends its crescents both ways at once. (both 1)

Values: `wave` multiplies the crescent's power, `reach` pixels it runs further, `tall` multiplies its height, `gain` spirit swords a landed tide gives, `launch` the crescent throws foes up, `twin` a second crescent follows, `both` crescents run both ways.

Code: `moves/string.ts` (`tideImpact`).

#### `yu_crane` Crane's Reach

Attack, easy, J. The string reaches further and hits harder, and Crane Wheel cuts behind.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | String blows reach 6 px further. | reach 6 |
| 2 | String power +10%. | power 1.1 |
| 3 | New: Crane Wheel also cuts behind you. | behind 1 |
| 4 | Reach +10 px; power +20%. | reach 10, power 1.2 |
| 5 | New: string blows stagger foes 50% longer. | stagger 1.5 |
| 6 | Reach +14 px; power +30%. | reach 14, power 1.3 |
| 7 | New: Returning Tide cuts behind you too. | tideBehind 1 |
| 8 | New: blows draw foes in to you; power +40%. | pull 1, power 1.4 |

Evolution, with `yu_tide` at level 4: **White Crane**. Every blow of the string cuts behind you as well as ahead. (around 1)

Values: `reach` pixels every blow of the string reaches further, `power` multiplies the string's blows, `behind` Crane Wheel cuts behind too, `stagger` multiplies the stagger, `tideBehind` Returning Tide cuts behind too, `pull` blows draw foes in, `around` every blow cuts behind.

Code: `shapeHit.ts`.

#### `yu_petal` Petal Storm

Attack, timed, J (air). The air string grows: harder cuts, a third cut, a qi wave and spirit swords.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Air cuts hit 30% harder. | power 1.3 |
| 2 | Air power +30% to +60%. | power 1.6 |
| 3 | New: a third air cut each jump. | air 1 |
| 4 | Air power +60% to +90%. | power 1.9 |
| 5 | New: Falling Petal sends a qi wave ahead. | wave 0.8 |
| 6 | New: the first air cut that lands each jump gives a spirit sword. | sword 1 |
| 7 | Air power +90% to +130%. | power 2.3 |
| 8 | New: air cuts are echoed twice; power +160%. | airEcho 2, power 2.6 |

Evolution, with `yu_cloud` at level 4: **Blossom Fall**. Four air cuts a jump, every one a sure critical hit. (air 2, crit 1)

Values: `power` multiplies the air cuts, `air` air cuts added per jump, `wave` power of the qi wave Falling Petal sends, `sword` the first air cut that lands each jump gives a spirit sword, `airEcho` echo thrusts per sword after an air cut, `crit` air cuts are sure critical hits.

Code: `shapeHit.ts`, `skills/petalStorm.ts` and `chooseMove.ts` (the longer air string).

#### `yu_cloud` Cloud Step

Movement, timed, Up. The second jump sends out a ring of qi, and you float, dodge in the air and land with waves.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A second jump sends a ring of qi round you. | ring 0.6, radius 26 |
| 2 | Ring power 0.6 to 0.9. | ring 0.9 |
| 3 | New: dodge in the air. | airDodge 1 |
| 4 | Ring power 0.9 to 1.2; it reaches further. | ring 1.2, radius 32 |
| 5 | New: you fall even more slowly. | float 0.68 |
| 6 | New: landing from a jump sends qi waves both ways. | land 1.5 |
| 7 | Ring power 1.2 to 2.4; it reaches further. | ring 2.4, radius 38 |
| 8 | New: a second jump gives a spirit sword, once every 3 s; ring power 3. | sword 3, ring 3 |

Evolution, with `yu_drift` at level 4: **Cloud Walker**. The ring draws foes in to you, and landing waves strike twice as hard. (pull 1, land 1.6)

Values: `ring` power of the qi ring a second jump sends, in attack damage, `radius` its reach in pixels, `airDodge` the front dodge works in the air, `float` gravity while falling, `land` power of the qi waves a landing from a jump sends both ways, `sword` seconds between spirit swords a second jump gives, `pull` the ring draws foes in.

Code: `skills/cloudStep.ts`; the float in `kit.ts`.

#### `yu_ride` Sword Riding

Movement, timed, J held. The warp grows: harder arrival swords, a shorter recharge, a cutting throw and more warps.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Arrival swords strike twice as hard. | arrive 2 |
| 2 | Warp recharge 2 s to 1.6 s. | recharge 1.6 |
| 3 | New: the thrown jian cuts every foe it passes. | path 0.6 |
| 4 | Arrival swords x2 to x3. | arrive 3 |
| 5 | New: a spirit sword joins you on arrival. | gain 1 |
| 6 | Warp recharge 1.6 s to 1.2 s. | recharge 1.2 |
| 7 | New: two warps in a row. | charges 2 |
| 8 | New: arrival swords also strike foes near the one you reach; x4. | spread 40, arrive 4 |

Evolution, with `yu_echo` at level 4: **Riding the Wind**. Warps cost half the MP, and every sword echoes the arrival blow. (cost 5, echo 1)

Values: `arrive` multiplies the spirit swords' arrival strikes, `recharge` seconds a warp takes to come back, `path` attack damage the thrown jian deals to each foe it passes, `gain` spirit swords that join on arrival, `charges` warps in a row, `spread` pixels round the foe the arrival swords also strike, `cost` MP a warp costs, `echo` the arrival is echoed by every sword.

Code: `warpStyle.ts` (`tune` and `arrived`).

#### `yu_drift` Drifting Leaf

Movement, easy, L. Spirit swords cut every foe you dodge through, and the dodge brings swords, waves and slows.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A spirit sword cuts each foe you dodge through. | cut 0.6 |
| 2 | Cut power 0.6 to 0.9. | cut 0.9 |
| 3 | New: dodging through a foe gives a spirit sword, once every 3 s. | sword 3 |
| 4 | Cut power 0.9 to 1.2. | cut 1.2 |
| 5 | New: a third of the dodge's stamina comes back. | refund 0.33 |
| 6 | Cut power 1.2 to 2.2. | cut 2.2 |
| 7 | New: where the dodge ends a qi wave runs on ahead. | wave 1 |
| 8 | New: foes you dodge through are slowed 1.5 s; cut power 3.5. | chill 1.5, cut 3.5 |

Evolution, with `yu_cloud` at level 4: **Leaf on the Wind**. The cut lands twice and the wave runs both ways. (twice 1)

Values: `cut` attack damage of the cut on each foe dodged through, `sword` seconds between spirit swords a dodge through a foe gives, `refund` share of the dodge's stamina given back, `wave` power of the qi wave sent where the dodge ends, `chill` seconds foes dodged through are slowed, `twice` the cut lands twice and the wave runs both ways.

Code: `skills/driftingLeaf.ts` on the kit's `dodge` hook.

#### `yu_fan` Sword Fan

Spell, easy, I. Learn Sword Fan: send your spirit swords out in a fan that cuts everything ahead.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Sword Fan: your swords fly out in a fan ahead. | power 0.7, reach 90, extra 0, recharge 2 |
| 2 | Fan power 0.7 to 0.9. | power 0.9 |
| 3 | New: one more sword is conjured for the fan. | extra 1 |
| 4 | Fan power 0.9 to 1.1; recharge 2 s to 1.6 s. | power 1.1, recharge 1.6 |
| 5 | New: the fan's swords cut again on their way back. | back 1 |
| 6 | Fan power 1.1 to 1.4. | power 1.4 |
| 7 | New: two more swords are conjured. | extra 2 |
| 8 | New: foes the fan cuts are knocked down; power 1.7. | stun 0.5, power 1.7 |

Evolution, with `yu_guardian` at level 4: **Peacock Fan**. The fan opens all round you, with twice as many conjured swords. (around 1, extra 4)

Values: `power` ability power of each sword's cut, `reach` pixels the fan flies, `extra` swords conjured for each fan besides the ones held, `recharge` seconds, `back` the swords return through foes, `stun` seconds foes cut are knocked down, `around` half the fan flies behind.

Code: `spells/fan.ts`.

#### `yu_cage` Sword Cage

Spell, timed, I. Learn Sword Cage: your swords fall round the foe ahead and pin it in place.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Sword Cage: your swords fall round the foe ahead and pin it. | power 0.9, pin 1, foes 1, recharge 3 |
| 2 | Cage power 0.9 to 1.2. | power 1.2 |
| 3 | New: the cage takes two foes. | foes 2 |
| 4 | Pin 1 s to 1.6 s; power 1.5. | pin 1.6, power 1.5 |
| 5 | New: a caged foe takes 20% more damage. | mark 0.2 |
| 6 | Cage power 1.5 to 1.9. | power 1.9 |
| 7 | New: one more sword falls on each caged foe. | extra 1 |
| 8 | New: the cage takes three foes; power 2.3. | foes 3, power 2.3 |

Evolution, with `yu_needle` at level 4: **Jade Prison**. Caged foes are pinned for 3 s and take 40% more damage. (pin 3, mark 0.4)

Values: `power` ability power of each falling sword, `pin` seconds a caged foe is held, `foes` foes caged at once, `mark` extra damage a caged foe takes, `extra` swords conjured for each foe besides the ones held, `recharge` seconds.

Code: `spells/cage.ts`.

#### `yu_crescent` Qi Crescent

Spell, timed, I. Learn Qi Crescent: a wave of qi from the jian, paid with MP, for when your swords are out.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Qi Crescent: a wave of qi from the jian, 14 MP. | power 1.6, reach 140, tall 1, recharge 2.5 |
| 2 | Crescent power 1.6 to 2. | power 2 |
| 3 | New: the crescent is twice as tall. | tall 2 |
| 4 | Crescent power 2 to 2.5. | power 2.5 |
| 5 | New: the first foe it cuts gives a spirit sword. | sword 1 |
| 6 | Crescent power 2.5 to 3. | power 3 |
| 7 | New: a second crescent follows. | twin 1 |
| 8 | New: crescents knock foes down; power 3.5. | stun 0.6, power 3.5 |

Evolution, with `yu_tide` at level 4: **Moon Crescent**. Crescents cross the whole stage. (reach 320)

Values: `power` ability power of the wave, `reach` pixels it runs, `tall` multiplies its height, `sword` a foe it cuts gives a spirit sword, once a cast, `twin` a second wave follows, `stun` seconds foes are knocked down, `recharge` seconds.

Code: `spells/crescent.ts`.

#### `yu_wound` Lingering Qi

Dot, easy, auto (echo thrusts). Echo thrusts leave qi wounds that cut foes over time.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Echo thrusts leave qi wounds that cut over time. | damage 0.04, max 3 |
| 2 | Wound damage 0.04 to 0.06. | damage 0.06 |
| 3 | New: wounds stack to 6. | max 6 |
| 4 | Wound damage 0.06 to 0.08. | damage 0.08 |
| 5 | New: the string's own blows lay wounds too. | blade 1 |
| 6 | Wound damage 0.08 to 0.16. | damage 0.16 |
| 7 | New: wounded foes are slowed. | chill 0.6 |
| 8 | New: a foe that dies wounded passes its wounds on; damage 0.24. | spread 1, damage 0.24 |

Evolution, with `yu_fan` at level 4: **Qi Burst**. Wounds burst when a foe carries the most it can, for 0.8 attack damage a stack. (burst 0.8)

Values: `damage` attack damage a wound deals each tick per stack, `max` stacks, `blade` the string's own blows lay wounds, `chill` seconds a wound slows, `spread` a foe that dies wounded passes its wounds on, `burst` attack damage per stack when a foe reaches its most.

Code: `skills/lingeringQi.ts`; echoes lay wounds through `echo.ts`.

#### `yu_bleed` Thousand Cuts

Dot, timed, auto (sword art cuts). Your sword arts' cuts leave bleeding wounds.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Sword art cuts leave bleeding wounds. | damage 0.05, max 4, duration 3, every 0.5 |
| 2 | Wound damage 0.05 to 0.07. | damage 0.07 |
| 3 | New: wounds stack to 8. | max 8 |
| 4 | Wound damage 0.07 to 0.09. | damage 0.09 |
| 5 | New: Jade Rain lays wounds too. | ult 1 |
| 6 | Wound damage 0.09 to 0.18. | damage 0.18 |
| 7 | New: wounds last twice as long. | duration 6 |
| 8 | New: wounds bleed twice as fast; damage 0.24. | every 0.25, damage 0.24 |

Evolution, with `yu_crescent` at level 4: **Thousand Petals**. When a Sword Lotus ends, every wounded foe takes all its wounds at once. (burst 1)

Values: `damage` ability power a wound deals each tick per stack, `max` stacks, `ult` Jade Rain lays wounds too, `duration` seconds the wounds last, `every` seconds between ticks, `burst` when a lotus ends, foes take this share of their wounds' remaining damage at once.

Code: `skills/thousandCuts.ts`; the lotus calls `lotusEnded`.

#### `yu_needle` Jade Needle

Dot, precise, K (parry). A parry lodges jade needles in the attacker that bleed qi.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry lodges 2 jade needles in the nearest foe. | needles 2, damage 0.3, max 6 |
| 2 | Needle damage 0.3 to 0.5. | damage 0.5 |
| 3 | New: Keen blows lodge needles too. | keen 1 |
| 4 | Needle damage 0.5 to 0.8. | damage 0.8 |
| 5 | New: needles stack to 12. | max 12 |
| 6 | Needle damage 0.8 to 1.1. | damage 1.1 |
| 7 | New: a needled foe takes 15% more damage. | mark 0.15 |
| 8 | New: perfect dodges lodge needles too; damage 1.5. | dodge 1, damage 1.5 |

Evolution, with `yu_flow` at level 4: **Acupuncture**. At 12 needles they all burst at once for 6 attack damage each. (burst 6)

Values: `needles` needles a pull-off lodges, `damage` attack damage each needle deals a tick, `max` needles a foe can carry, `keen` Keen blows lodge needles too, `mark` extra damage a needled foe takes, `dodge` perfect dodges lodge needles in the nearest foe, `burst` attack damage per needle when a foe reaches its most.

Code: `skills/jadeNeedle.ts`; Keen blows through `afterStrike.ts`.

#### `yu_guardian` Guardian Blade

Summon, easy, auto (blow landed). A landed blow may call a guardian blade that circles you and strikes foes near.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A landed blow may call a guardian blade that strikes foes near you. | chance 0.15, life 4, power 0.4, every 0.8, targets 1, most 1, cooldown 1 |
| 2 | Chance 15% to 25%. | chance 0.25 |
| 3 | New: each strike reaches two foes. | targets 2 |
| 4 | Strike power 0.4 to 0.8. | power 0.8 |
| 5 | New: two guardians at once. | most 2 |
| 6 | Guardians stay 7 s and strike faster. | life 7, every 0.6 |
| 7 | New: strikes slow foes. | chill 0.8 |
| 8 | New: three guardians at once; power 1.2. | most 3, power 1.2 |

Evolution, with `yu_breath` at level 4: **Heavenly Guard**. Three guardian blades circle you all the time. (always 1)

Values: `chance` a landed blow calls one, `life` seconds it stays, `power` attack damage of each strike, `every` seconds between strikes, `targets` foes each strike reaches, `most` guardians at once, `chill` seconds a strike slows, `always` the guardians stay, `cooldown` least seconds between calls.

Code: `skills/guardianBlade.ts`.

#### `yu_heron` Jade Heron

Summon, timed, auto (cast). Casting may call a jade heron that flies through the line ahead.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Casting may call a jade heron that flies through the line ahead. | chance 0.35, power 1, count 1, cooldown 0.6 |
| 2 | Chance 35% to 50%. | chance 0.5 |
| 3 | New: the heron flies back too. | back 1 |
| 4 | Heron power 1 to 1.6. | power 1.6 |
| 5 | New: two herons, one high and one low. | count 2 |
| 6 | Chance 50% to 70%. | chance 0.7 |
| 7 | New: herons knock foes down. | stun 0.5 |
| 8 | New: Jade Rain calls herons too; power 2.6. | ult 1, power 2.6 |

Evolution, with `yu_fan` at level 4: **Heron Flight**. Every cast calls three herons. (chance 1, count 3)

Values: `chance` a cast calls one, `power` attack damage the heron deals each foe, `back` it flies back too, `count` herons a call sends, `stun` seconds foes are knocked down, `ult` Jade Rain calls them too, `cooldown` least seconds between calls.

Code: `skills/jadeHeron.ts` and `effects/heron.ts`.

#### `yu_shade` Sage's Shade

Summon, precise, K (parry). A parry calls your shade behind the attacker for a heavy cut.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry calls your shade behind the attacker for one heavy cut. | power 4, cuts 1 |
| 2 | Shade power 4 to 6. | power 6 |
| 3 | New: perfect dodges call it too. | dodge 1 |
| 4 | Shade power 6 to 9. | power 9 |
| 5 | New: the shade cuts twice. | cuts 2 |
| 6 | Shade power 9 to 13. | power 13 |
| 7 | New: the shade's last cut gives a spirit sword. | sword 1 |
| 8 | New: its foe takes 25% more damage for 3 s; power 20. | mark 0.25, power 20 |

Evolution, with `yu_needle` at level 4: **Many Shades**. The shade cuts three times at half again the power. (cuts 3, power 30)

Values: `power` attack damage of each of the shade's cuts on its foe, `cuts` how many, `dodge` perfect dodges call it too, `sword` its last cut gives a spirit sword, `mark` extra damage its foe takes for 3 s.

Code: `skills/sagesShade.ts` and `effects/shade.ts`.

#### `yu_breath` Sage's Breath

Movement, easy, L. Spirit swords come back faster, and you hold more of them.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Spirit swords come back every 2.2 s. | regen 2.2 |
| 2 | New: hold one more spirit sword. | most 1 |
| 3 | Swords come back every 1.9 s. | regen 1.9 |
| 4 | New: three swords come back on their own. | rest 1 |
| 5 | Swords come back every 1.6 s. | regen 1.6 |
| 6 | New: hold two more spirit swords. | most 2 |
| 7 | New: four swords come back on their own. | rest 2 |
| 8 | New: every sword is back as each wave starts; every 1.2 s. | wave 1, regen 1.2 |

Evolution, with `yu_guardian` at level 4: **Sword Sea**. Hold eight spirit swords, and all of them come back on their own. (most 4, rest 6)

Values: `regen` seconds between swords coming back, `most` swords held beyond the usual, `rest` swords that come back on their own beyond the usual, `wave` every sword is back at the start of each wave.

Code: `swords.ts` (`mostSwords`, the regen) and `skills/sagesBreath.ts`.

#### `yu_harmony` Harmony

Movement, timed, L. With every spirit sword held you deal more damage, heal and take less.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | With every sword held, deal 8% more damage. | bonus 0.08 |
| 2 | Bonus 8% to 12%. | bonus 0.12 |
| 3 | New: with every sword held, recover 1 HP a second. | heal 1 |
| 4 | Bonus 12% to 16%. | bonus 0.16 |
| 5 | New: Harmony holds with one sword short. | short 1 |
| 6 | Bonus 16% to 20%. | bonus 0.2 |
| 7 | New: take 15% less damage while it holds. | guard 0.15 |
| 8 | New: Returning Tide gives a sword even when it misses; bonus 25%. | tide 1, bonus 0.25 |

Evolution, with `yu_breath` at level 4: **Perfect Harmony**. Harmony deals 40% more damage and heals 3 HP a second. (bonus 0.4, heal 3)

Values: `bonus` extra damage while it holds, `heal` HP a second while it holds, `short` it holds with one sword short, `guard` share less damage taken while it holds, `tide` Returning Tide gives a sword even when it misses.

Code: `skills/harmony.ts`, read by the kit's `damageScale` and `hurtScale`.

#### `yu_rain` Heaven's Grove

Ultimate, easy, J. Jade Rain on held J hits harder, charges faster and drops spirit swords on the foes near you.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Jade Rain falls 30% harder. | power 1.3 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: four swords fall on each foe. | perFoe 4 |
| 4 | Rain power x1.3 to x3. | power 3 |
| 5 | New: the rain falls on 10 foes. | foes 10 |
| 6 | New: the rain fills your spirit swords. | fill 1 |
| 7 | New: a second rain falls a moment later at half power. | again 0.5 |
| 8 | Rain power x3 to x6; five swords to a foe. | power 6, perFoe 5 |

Evolution, with `yu_heron` at level 4: **Endless Rain**. The rain keeps falling on foes near you for 4 seconds after it strikes. (linger 4)

Values: `power` multiplies each falling sword, `cooldown` seconds, `charge` charging speed, `perFoe` swords on each foe, `foes` foes it falls on, `fill` it fills your spirit swords, `again` a second rain at this share, `linger` seconds the rain keeps falling round you.

Code: `ultimate/jadeRain.ts`.

## Balance

Measured on 15 November 2026 in a measuring room built by the method in `docs/skills/balance.md`: wave 2, hero level 1, only the skill under test, the stream stopped and the room's own foes (a crowd of four husks and two wisps, or one husk at three times its HP), a fallen foe back 0.35 s later, HP kept full, 5 s warm-up and 60 s measured.
The scripted player walks to the nearest foe, mashes J, casts when the selected tab is ready, switches ability every 3 s, jumps into the air string every 6 s, dodges every 4 s and warps at a far foe every 4 s.
A parry and a perfect dodge each fire every 7 s through the game's own functions.
Jade Rain is cast at charge level 3 every 10 s.
The room script is not in the repo; it lives in the agent's scratch folder.

The base kit, raw damage a second on the sources it counts (attacks and abilities):

| Run | Crowd | One foe |
| --- | --- | --- |
| Yun, three runs | 112, 117, 178 | 28, 10, 38 |
| Kael, one run | 111 | 31 |

So Yun's base kit sits with Kael's, and the room's noise is large: one base run reads half again another.
The figures below are the damage a second a skill adds over the mean of Yun's base runs, on the sources it can change.

### Round 1 (before tuning)

| Skill | Kind | Risk | L1 crowd | L8 crowd | L8 one | Evolved crowd | Evolved one |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `yu_echo` | attack | easy | 22 | 45 | 13 | 39 | 14 |
| `yu_flow` | attack | precise | 7 | 11 | -7 | 42 | -1 |
| `yu_tide` | attack | timed | 31 | 11 | 9 | 12 | 9 |
| `yu_crane` | attack | easy | 12 | 65 | -6 | 29 | 13 |
| `yu_petal` | attack | timed | -13 | 35 | 7 | 54 | 10 |
| `yu_cloud` | movement | timed | 9 | 15 | 11 | 39 | 5 |
| `yu_ride` | movement | timed | 36 | -23 | -2 | 17 | -4 |
| `yu_drift` | movement | easy | 0 | 10 | 0 | 14 | 11 |
| `yu_fan` | spell | easy | -8 | 7 | -1 | 5 | 5 |
| `yu_cage` | spell | timed | -8 | 7 | 5 | -6 | 6 |
| `yu_crescent` | spell | timed | -12 | -3 | 1 | 6 | - |
| `yu_wound` | dot | easy | 15 | 38 | 4 | 1 | 11 |
| `yu_bleed` | dot | timed | 45 | 35 | 8 | 35 | 10 |
| `yu_needle` | dot | precise | - | -2 | 25 | - | - |
| `yu_guardian` | summon | easy | - | 19 | 11 | 77 | 14 |
| `yu_heron` | summon | timed | - | -28 | 6 | 18 | 37 |
| `yu_shade` | summon | precise | 7 | 56 | 35 | 3 | 34 |
| `yu_breath` | passive | easy | -15 | -4 | -11 | 9 | -1 |
| `yu_harmony` | passive | timed | -1 | 7 | 6 | 4 | 10 |
| `yu_rain` | ultimate | easy | - | - | - | - | - |

A dash marks a run that did not report.
Fan, Cage and Crescent read near zero because the scripted player rarely has their tab selected while it holds swords; the same held for Kael's spells in his first round.

### Changes

| Skill | Change |
| --- | --- |
| `yu_flow` | Keen bonus 0.4 to 1 at level 1, 2 to 6 at level 8, 3 to 9 evolved; the wave 1.6 to 4 AD |
| `yu_tide` | Crescent power x2 to x3 at level 1, x5 to x11 at level 8 |
| `yu_echo` | Echo power x2.8 to x3.5 at level 8 |
| `yu_cloud` | Ring power 1.6 to 3 at level 8; landing waves 0.8 to 1.5 |
| `yu_drift` | Cut power 2 to 3.5 at level 8 |
| `yu_wound` | Wound damage 0.14 to 0.24 at level 8 |
| `yu_bleed` | Wound damage 0.14 to 0.24 at level 8 |
| `yu_needle` | Needle damage 0.15 to 0.3 at level 1, 0.5 to 1.5 at level 8; Acupuncture's burst 2.5 to 6 |
| `yu_guardian` | Strike power 0.8 to 1.2 at level 8 |
| `yu_heron` | Heron power 1.8 to 2.6 at level 8 |
| `yu_shade` | Shade power 1.5 to 4 at level 1, 4 to 20 at level 8, 6 to 30 evolved |
| `yu_rain` | Rain power x2.2 to x6 at level 8; Endless Rain's swords fall every 0.5 s at half power |

### Round 2 (after tuning, one run each)

| Run | Added a second | The skill's own source |
| --- | --- | --- |
| `yu_tide` level 8, crowd | 50 | |
| `yu_drift` level 8, crowd | 41 | |
| `yu_cloud` level 8, crowd | 9 | |
| `yu_echo` level 8, crowd | -25 | |
| `yu_wound` level 8, crowd | 34 | 72 |
| `yu_bleed` level 8, crowd | -12 | 9 |
| `yu_guardian` level 8, crowd | 31 | 93 |
| `yu_heron` level 8, crowd | 57 | 31 |
| `yu_needle` level 8, one | 25 | 20 |
| `yu_flow` level 8, one | 1 | |
| `yu_flow` evolved, one | -2 | |
| `yu_shade` level 8, one | 72 | 73 |
| `yu_shade` evolved, one | 212 | 205 |

Jade Rain per cast against the base cast (30 a second at one cast every 10 s, the mean of two runs): level 1 1.2 times, level 8 5.3 times, evolved 3.2 times.

### Still off

- Most skills read under their level 8 band, and a single run cannot tell a 30 a second change from noise; each needs three to five runs a figure, as Kael's precise skills did.
- Flowing Water reads near zero: the scripted player rarely lands a Keen press, so the room does not drive it; it needs the Keen blow driven at the model's rate (30% of follow-up blows) through the kit.
- Twin Echo's round 2 run read under its round 1 run after a raise, which is the noise.
- Endless Rain read under level 8 in its one run; the hero in that run dealt a sixth of his usual string damage, so the run itself looks broken, and it needs measuring again.
- The spells and the air and warp skills need scripted drives of their own before their numbers move.

## Example builds

Each has 8 skills; three evolve, steered with skips and banishes.

**Sword sea** (easy, crowd): Twin Echo, Sage's Breath, Guardian Blade, Lingering Qi, Sword Fan, Crane's Reach, Harmony, Heaven's Grove.
Evolve Twin Echo (Sage's Breath), Sage's Breath (Guardian Blade), Lingering Qi (Sword Fan).
Hold as many swords as he can, let every blow echo eight times, and let the wounds spread through the crowd.

**Still water** (precise, one target): Flowing Water, Jade Needle, Sage's Shade, Twin Echo, Sword Riding, Sword Cage, Qi Crescent, Heaven's Grove.
Evolve Flowing Water (Twin Echo), Jade Needle (Flowing Water), Sage's Shade (Jade Needle).
Keen presses, parries and perfect dodges load one foe with needles and shades; the cage holds a boss's minion still.

**Spring tide** (timed, waves): High Tide, Thousand Cuts, Qi Crescent, Cloud Step, Drifting Leaf, Petal Storm, Jade Heron, Heaven's Grove.
Evolve High Tide (Thousand Cuts), Cloud Step (Drifting Leaf), Qi Crescent (High Tide).
Every finisher, landing and dodge sends qi along the floor; the herons and the crescents keep the line clear.

## Code map

Yun's folder is `src/heroes/yun/`, laid out as `docs/hero-module.md` describes: `character.ts` exports `YUN` and `index.ts` exports `YUN_MODULE`.

- Data: `src/heroes/yun/constants/skills/` (one file per skill), the ids in `constants/skillIds.ts`.
- Kit hooks: `shapeHit` and `keenWindow` (`game/shapeHit.ts`, `game/skills/flowingWater.ts`), `airDodge` and `gravityScale` (Cloud Step), `dodge` (Drifting Leaf), `damageScale` and `hurtScale` (Harmony), all in `game/kit.ts`.
- The spirit swords: `game/swords.ts` (count, regen, Sage's Breath), `game/hover.ts` (where they hover), `game/echo.ts` (Sword Echo, Twin Echo), drawn by `game/drawSwords.ts`.
- Abilities on I: `YUN_SLOTS` in `game/abilities.ts`, the casts in `game/spells/`.
- Warp: `game/warpStyle.ts` (Sword Riding); guard and parry: `game/guardStyle.ts`.
- Behaviors on their own: `game/skills/`, registered in `YUN_SKILLS` (`HeroModule.skills`).
- Ultimate: `castJadeRain` in `game/ultimate/jadeRain.ts`.
- Icons: `ui/icons/` (every skill, every evolution, and Yun's three damage sources).
