# Saya skills

Saya's 20 skills, to the contract in `docs/skill-design.md`.
Her design note is `docs/heroes/saya.md`.
AD and AP mean Saya's attack damage and ability power (11 and 8 at hero level 1, `SAYA.base`).

## Drill set

Solo Adventure runs Saya on the shared drill engine, and all 20 skills upgrade a drill mechanic, to the baseline in `docs/skill-design.md` ("Drill baseline").
Rows keep the native numbers and add the drill's under `drill.`; card text describes the drill.
Drill code: `src/heroes/saya/game/drill/skills/`, folded into `SAYA_DRILL` by `game/drill/hooks.ts`.
Three skills change job on the drill: Ink Flow becomes the warp and infusion skill, Calm Mind the guard skill, and Deep Breath becomes Feather Step, the jump skill.

| Id | Name | Mechanic | Level 1 | Levels 2 to 8 | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| `sa_edge` | Honed Draw | first slash | draw cut +40%, stores +40% | stagger, an ink cut ahead, sure crit, +15% reach on every slash, up to +300% | Moonlit Draw (`sa_clean`): a twin ink cut and an instant release |
| `sa_reverse` | Reverse Edge | second slash | also cuts behind | launch, +50% to +250%, the cut behind stores, chill, pulls foes to her front | Full Circle (`sa_flow`): cuts all around twice |
| `sa_clean` | Clean Sheathe | third slash | sheathe +50%, release +20% | sure crit release, stagger, MP per foe, a 40% second release, up to +300% and +120% | Perfect Stillness (`sa_edge`): every sheathe releases twice in full |
| `sa_falling` | Falling Moon | air slash | one more air slash | drives foes down, +50% to +250%, landing releases, a third air slash, a landing ring | Moonfall (`sa_pass`): the landing crashes for 4x AD |
| `sa_calm` | Calm Mind | guard and parry | parry window +40% | a parry releases, a counter draw of 2x to 8x AD, a block stores, 10 MP | Empty Mind (`sa_breath`): 3 s of sure critical slashes after a parry |
| `sa_pass` | Passing Draw | warp strike | recharge -15%, damage +30% | double store, refreshed air dash and slash, a 30 px sweep, a release a beat later, up to -40% and +250% | Thousand Paces (`sa_step`): every 3 s an arrival recharges the warp |
| `sa_step` | Shadow Step | dash and air dash | untouchable while dashing | up to 3 air dashes, the air dash restores the air slash, an afterimage cut that stores | Ghost Passage (`sa_pass`): afterimages cut twice, twice as wide |
| `sa_stroke` | Long Stroke | dash | dashing through foes cuts them | stores, stagger, an ink stroke on the floor, a dash recharge, up to 6x AD | Ink Horizon (`sa_trail`): the cut reaches 60 px past her |
| `sa_flow` | Ink Flow | warp and infusion | an arrival infuses for 1 hit | faster preparation (up to 45%), longer infusions, an arrival shortens a preparation | Spreading Ink (`sa_reverse`): every arrival readies the selected spell |
| `sa_breath` | Feather Step | jump, wall kick, air | a wall kick cuts | an air dash, a cutting dash-jump, an air slash, a wall kick restores the air dash, up to 7x AD | Boundless Breath (`sa_calm`): every jump sends a storing ink crescent |
| `sa_crescent` | Crescent Wave | Crescent Wave | stores 1x AP | +40% to +320%, stagger, infused hits store more, chill | Tide Moon (`sa_rain`): a hit calls a shower of Ink Rain |
| `sa_rain` | Ink Rain | Ink Rain | holds foes 0.5 s longer | +40% to +320%, a 15% to 30% mark, a second shower | Monsoon (`sa_stain`): three more showers |
| `sa_still` | Still Water | Still Water | stills 0.6 s longer | +40% to +320%, MP per foe, releases stored cuts, stores 1x AP | Mirror Lake (`sa_shade`): its release is full and sure critical |
| `sa_weep` | Weeping Cut | dot on releases | as in the native kit | as in the native kit | as in the native kit |
| `sa_stain` | Ink Stain | dot on stored cuts | as in the native kit | as in the native kit | as in the native kit |
| `sa_trail` | Lingering Line | dot on infused hits | infused hits bleed 0.3x AP | longer, stacks up to 5, every slash stores more, up to 1.05x AP | Ink Sea (`sa_stroke`): every slash leaves the line |
| `sa_crane` | Ink Crane | summon on releases | as in the native kit | as in the native kit | as in the native kit |
| `sa_shade` | Ink Shade | summon on parries and perfect dodges | a shade may draw on the nearest foe | chance up to 100%, it stores, a +25% mark, a Keen sheathe calls one, sure crit, up to 20x AD | Twin Moon (`sa_still`): two shades, each drawing twice |
| `sa_paper` | Paper Blades | summon on kills and releases | as in the native kit | as in the native kit | as in the native kit |
| `sa_moon` | Silent Moon | the four charged tiers on held J | charged skills +30% | faster charge, tiers store cuts, +20% reach, tiers 1 and 2 also release, up to +250% | New Moon (`sa_clean`): every charged skill releases twice |

Count by mechanic: 4 slash skills, 1 guard skill, 4 warp and dash skills, 1 jump skill, 3 spell skills, 3 damage over time, 3 summons, 1 charged-tier skill.
A dash that meets a blow is the drill's perfect dodge, so Ink Shade answers it there too.
The drill has no clean sheathe, so Ink Shade's fifth level answers a Keen sheathe there (the J press just after the return cut lands).

## Identity

Saya is the quickdraw: her cuts store damage in the foe, and her sheathe releases all of it at once.
Her skills grow the three beats of her kit: what a draw stores, what a release pays, and the rest between strings that fills Focus.
She plays on the moveset every hero shares (`docs/moveset-design.md`).
Every skill is on a single button press or runs on its own; nothing asks for a direction, a dash or a double tap during or after a combo.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The string, three presses and the same wherever foes stand: draw cut (0.55 AD at once, 1.35 AD stored, breaks guards), return cut (0.55 AD, 1.35 AD stored), sheathe (a 0.4 AD click, then every stored cut releases and knocks its foe down). No blow turns her around. |
| J (Keen) | The sheathe pressed in the 0.1 s after the return cut lands is a clean sheathe: its release is a sure crit on every foe and gives a breath. |
| J (air) | One falling draw per airtime (0.6 AD at once, 1.3 AD stored, drives a foe in the air down); landing releases every stored cut. |
| J held | The shared warp: she arrives past the foe, deals 20% of the shared power at once and stores the rest with a fifth more, then sheathes. 10 MP, 2 s recharge. |
| K | Guard with the sheathed katana: blocks blows from the front for 14 stamina and lets 25% through. |
| K (parry) | The shared parry, then the counter draw: one cut at the attacker, 3.4 AD and a sure crit, then a sheathe that releases every stored cut, and a breath. |
| L | The shared dodge. A perfect dodge gives a breath. |
| I | Cast the selected ability; on a recharging one, the next ready one. Each ability ends in a sheathe that releases every stored cut, so I in the middle of the string cashes it in. |
| I held | The wide form of the selected ability for 1.5 times its MP. |
| O | Switch to the next ability. |
| U | Silent Moon: the foes on screen held still, 3, 5, 8 or 12 lines by charge level, each bursting for 0.6 of the level's power on the foes it crosses. |
| Up | Jump; Up again in the air is a double jump. |

Focus: three breaths, one every 1.4 s while the blade rests; each draw cut and falling draw spends one for 14 px more reach and 1.6 times the store.
A cut that is never sheathed by a keyed sheathe still releases, at 60%, once the blade has rested 0.25 s.

Base abilities:

- Brushline (`LINE`): a 44 px dash through the foes ahead; each takes 0.3 AP at once and stores 2.4 AP, and she sheathes past them. 12 MP, 3.5 s. Held: she cuts back along the same line too.
- Moonrise (`RISE`): a rising draw that lifts her 20 px and sends an ink wave 92 px ahead that throws each foe up for 0.6 AP and stores 1.6 AP. 14 MP, 4.5 s. Held: a second wave runs behind her.

The ability order is Brushline, Moonrise, Crescent Wave, Ink Rain, Still Water, the spells shown once their skill is held.

Damage source: hits of her own presses (string blows, the warp, the counter draw, releases of what they stored, the dodge's stored cuts, casts and Silent Moon) count as `attacks`, `abilities` or `ultimate` and build Flow.
A release counts for the source that stored the cut.
Ticks, cranes, shades and paper blades use the skill id and build no Flow.

### Combo hits and the air string

- `comboHits: 3`: draw cut, return cut, sheathe. No skill changes the length or the order; skills change what each blow stores, its reach and what it leaves behind.
- Air: one falling draw per airtime; two with Falling Moon's fourth level.
- Moonrise throws foes up; J pressed once its wave is out starts the falling draw at once, which drives them down and releases on landing.

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `sa_edge` | Honed Draw | attack | timed | J | `sa_clean` | Moonlit Draw |
| `sa_clean` | Clean Sheathe | attack | precise | J | `sa_edge` | Perfect Stillness |
| `sa_reverse` | Reverse Edge | attack | easy | J | `sa_flow` | Full Circle |
| `sa_flow` | Ink Flow | movement | timed | L | `sa_reverse` | Spreading Ink |
| `sa_falling` | Falling Moon | attack | timed | jump | `sa_pass` | Moonfall |
| `sa_pass` | Passing Draw | movement | timed | L | `sa_step` | Thousand Paces |
| `sa_step` | Shadow Step | movement | timed | L | `sa_pass` | Ghost Passage |
| `sa_stroke` | Long Stroke | movement | easy | L | `sa_trail` | Ink Horizon |
| `sa_crescent` | Crescent Wave | spell | easy | I | `sa_rain` | Tide Moon |
| `sa_rain` | Ink Rain | spell | easy | I | `sa_stain` | Monsoon |
| `sa_still` | Still Water | spell | timed | I | `sa_shade` | Mirror Lake |
| `sa_weep` | Weeping Cut | dot | easy | auto (releases) | `sa_flow` | Weeping Moon |
| `sa_stain` | Ink Stain | dot | timed | auto (stored cuts) | `sa_weep` | Indelible |
| `sa_trail` | Lingering Line | dot | timed | I | `sa_stroke` | Ink Sea |
| `sa_crane` | Ink Crane | summon | easy | auto (releases) | `sa_crescent` | Thousand Cranes |
| `sa_shade` | Ink Shade | summon | precise | K | `sa_still` | Twin Moon |
| `sa_paper` | Paper Blades | summon | easy | auto (kills) | `sa_breath` | Paper Storm |
| `sa_breath` | Feather Step | movement | easy | jump | `sa_calm` | Boundless Breath |
| `sa_calm` | Calm Mind | attack | timed | K | `sa_breath` | Empty Mind |
| `sa_moon` | Silent Moon | ultimate | easy | J | `sa_clean` | New Moon |

Counts: attack 5, movement 5, spell 3, dot 3, summon 3, ultimate 1. Risk: timed 9, precise 2, easy 9.
The cards show the drill text (the Drill set table); the sections below keep the native kit that co-op and the wave arena play.
The Values column shows only the numbers a level changes; the data rows (`src/heroes/saya/constants/skills/`) carry the whole state.
In the Code lines, a file name is a file under `src/heroes/saya/game/`.

#### `sa_edge` Honed Draw

Attack, timed, J. Draw cuts store more in the foe and reach farther. Spend a breath on a draw for more.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Draw cuts store +40%. | store 1.4 |
| 2 | New: draw cuts reach 8 px farther. | reach 8 |
| 3 | New: return cuts break guards too. | guard 1 |
| 4 | Draw store +40% to +100%. | store 2 |
| 5 | New: a draw with a breath sends an ink cut ahead that stores in each foe. | wave 1.2 |
| 6 | Draw store +100% to +160%; reach 8 to 14 px. | store 2.6, reach 14 |
| 7 | New: a draw with a breath is a sure critical hit. | crit 1 |
| 8 | Draw store +160% to +300%; the ink cut stores far more. | store 4, wave 4 |
| Evolved | Every draw sends the ink cut; a breath draw stores double. | waveAlways 1, breathStore 2 |

Evolution: Moonlit Draw, with `sa_clean` at level 4 or more. Every draw cut sends the ink cut ahead, and a draw with a breath stores twice as much.

Code: `strike.ts` (store, reach, guard, crit, the ink cut), `effects/inkCut.ts`.

#### `sa_clean` Clean Sheathe

Attack, precise, J. Press the sheathe just as the return cut lands: its release hits far harder on the first foe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A clean sheathe's release deals +100% on the first foe. | bonus 1 |
| 2 | Clean window 0.10 to 0.15 s. | window 0.15 |
| 3 | New: a clean release marks its foes: +20% damage taken for 3 s. | mark 0.2, markTime 3 |
| 4 | Clean bonus +100% to +250%. | bonus 2.5 |
| 5 | New: a clean sheathe gives Brushline and Moonrise back at once. | reset 1 |
| 6 | New: a clean sheathe gives the warp back; mark +20% to +35%. | mark 0.35, warp 1 |
| 7 | New: a clean sheathe gives two breaths. | breaths 2 |
| 8 | Clean bonus +250% to +700%; window 0.2 s. | bonus 7, window 0.2 |
| Evolved | A clean sheathe releases twice. | twice 1 |

Evolution: Perfect Stillness, with `sa_edge` at level 4 or more. A clean sheathe releases twice: the second burst follows a beat later at full strength.

Code: `clean.ts`, `strike.ts` (`keenWindow`), `effects/echoRelease.ts`.

#### `sa_reverse` Reverse Edge

Attack, easy, J. The return cut stores more, then cuts behind her too and leaves an ink crescent.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Return cuts store +40%. | store 1.4 |
| 2 | New: the return cut also cuts behind her. | behind 1 |
| 3 | Return store +40% to +80%. | store 1.8 |
| 4 | New: the return cut throws light foes up. | launch 150 |
| 5 | New: the return cut leaves an ink crescent that cuts what touches it. | crescent 0.6, crescentTime 0.6 |
| 6 | Return store +80% to +150%. | store 2.5 |
| 7 | New: the crescent stores its cut and lasts 1 s. | crescentTime 1, crescentStore 1 |
| 8 | Return store +150% to +160%; the crescent cuts harder. | store 2.6, crescent 1 |
| Evolved | The crescent turns round you as a ring for 2 s. | ring 2 |

Evolution: Full Circle, with `sa_flow` at level 4 or more. The return cut's crescent becomes a ring of ink that turns round her for 2 seconds.

Code: `strike.ts` (store, behind, launch, the crescent), `effects/inkArc.ts`.

#### `sa_flow` Ink Flow

Attack, timed, auto (releases). Each cut stored in a foe makes its release hit harder. Store many, then sheathe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A release deals +15% for each cut stored past the first. | perLine 0.15 |
| 2 | New: foes holding stored cuts are slowed. | slow 1 |
| 3 | Per cut +15% to +30%. | perLine 0.3 |
| 4 | New: a release splashes 30% onto foes beside it. | splash 0.3, reach 24 |
| 5 | New: the splash stores a cut in the foes it reaches. | splashStore 0.5 |
| 6 | Per cut +30% to +45%; splash 30% to 50%. | perLine 0.45, splash 0.5 |
| 7 | New: a full release gives 4 MP for each foe. | mp 4 |
| 8 | Per cut +45% to +80%. | perLine 0.8 |
| Evolved | Releases splash in full within 40 px. | splash 1, reach 40 |

Evolution: Spreading Ink, with `sa_reverse` at level 4 or more. A release splashes in full onto every foe within 40 px.

Code: `store.ts` (`releaseFactor`, `splash`, the slow, MP).

#### `sa_falling` Falling Moon

Attack, timed, Up then J. The falling draw stores more, and its landing cuts along the floor.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The falling draw stores +50%. | store 1.5 |
| 2 | New: its landing sends a ring along the floor. | ring 0.8, ringReach 34 |
| 3 | Store +50% to +100%. | store 2 |
| 4 | New: a second falling draw in the same airtime. | air 1 |
| 5 | Ring 0.8 to 2 attack damage, wider. | ring 2, ringReach 46 |
| 6 | New: the falling draw is a sure critical hit on foes in the air. | airCrit 1 |
| 7 | Store +100% to +200%. | store 3 |
| 8 | New: the landing throws the foes near her up. | lift 220 |
| Evolved | The landing ring reaches 60 px and hits three times as hard. | ring 6, ringReach 60 |

Evolution: Moonfall, with `sa_pass` at level 4 or more. The landing's ring and release reach every foe within 60 px, and the ring hits three times as hard.

Code: `chooseMove.ts` (second draw), `strike.ts` (store, air crit), `landing.ts` (ring, lift).

#### `sa_pass` Passing Draw

Movement, timed, J. J held: the thrown katana cuts what it passes, and the warp comes back sooner.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The thrown katana cuts the foes it passes. | path 0.8 |
| 2 | Warp recharge 2 to 1.6 s. | recharge 1.6 |
| 3 | New: foes the katana passes store a cut. | pathStore 1.2 |
| 4 | New: two warps in a row. | charges 2 |
| 5 | Arrival power 1.8 to 2.3. | strike 2.3 |
| 6 | New: each arrival gives a breath. | breath 1 |
| 7 | Warp cost 10 to 6 MP. | cost 6 |
| 8 | New: the arrival stores twice as much. | arrival 2 |
| Evolved | Free warps every 1 s; each click is clean. | recharge 1, cost 0, clean 1 |

Evolution: Thousand Paces, with `sa_step` at level 4 or more. Warps cost no MP and recharge in 1 second, and every arrival's click is a clean sheathe.

Code: `warpStyle.ts` (`tune`, arrival, breath, clean click), `strike.ts` (path store).

#### `sa_step` Shadow Step

Movement, timed, L. L: dodge through foes to store a cut in each, then sheathe as you stop.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Dodging through a foe stores a cut in it. | store 1 |
| 2 | Stored cut +50%. | store 1.5 |
| 3 | New: the dodge ends in a sheathe that releases every stored cut. | sheathe 1 |
| 4 | New: a perfect dodge gives two breaths. | perfect 2 |
| 5 | Stored cut +50% to +150%. | store 2.5 |
| 6 | New: a dodge in the air. | air 1 |
| 7 | New: foes dodged through take +20% damage for 3 s. | mark 0.2 |
| 8 | Stored cut +150% to +300%. | store 4 |
| Evolved | Foes dodged through are cut twice; the sheathe is clean. | twice 1 |

Evolution: Ghost Passage, with `sa_pass` at level 4 or more. Every foe the dodge passes through is cut twice, and the dodge's sheathe is clean.

Code: `dodge.ts`, `focus.ts` (perfect dodge breaths).

#### `sa_stroke` Long Stroke

Movement, easy, I. Brushline dashes a little farther, comes back sooner and stores more.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Brushline dashes 44 to 56 px. | length 56 |
| 2 | Brushline recharge 3.5 to 2.8 s. | recharge 2.8 |
| 3 | New: Brushline breaks guards. | guard 1 |
| 4 | New: Brushline gives back 20 stamina. | stamina 20 |
| 5 | Brushline stores +60%. | store 1.6 |
| 6 | New: Brushline costs no MP. | free 1 |
| 7 | New: Brushline's click throws its foes up. | launch 200 |
| 8 | Brushline stores +60% to +150%; recharge 2.2 s. | recharge 2.2, store 2.5 |
| Evolved | The cut runs on 120 px past you. | horizon 120 |

Evolution: Ink Horizon, with `sa_trail` at level 4 or more. Brushline's cut runs on along the floor 120 px past where she stops, cutting every foe on the line.

Code: `brushline.ts`, `abilities.ts` (cost and recharge).

#### `sa_crescent` Crescent Wave

Spell, easy, I. An ability on I: an ink crescent flies ahead through every foe and stores a cut in each. Held, three of them.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Crescent Wave: an ink crescent flies ahead, storing a cut in each foe. | now 0.5, store 1.2, recharge 4, tall 1, range 150 |
| 2 | Store +50%. | store 1.8 |
| 3 | New: the crescent slows the foes it cuts. | slow 1.5 |
| 4 | New: the crescent throws light foes up; recharge 3 s. | recharge 3, launch 160 |
| 5 | New: a second crescent flies low beside the first. | pair 1 |
| 6 | Store +50% to +150%. | store 3 |
| 7 | New: the crescent bursts where its flight ends. | burst 1.5 |
| 8 | Cut +40%; store +33%. | now 0.7, store 4 |
| Evolved | Twice as tall; crosses the whole stage. | tall 2, range 320 |

Evolution: Tide Moon, with `sa_rain` at level 4 or more. The crescent is twice as tall and crosses the whole stage.

Code: `spells.ts`, `effects/crescent.ts`.

#### `sa_rain` Ink Rain

Spell, easy, I. An ability on I: a cloud of ink rains on the foes ahead, each drop storing a small cut. Held, it falls twice as long.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Ink Rain: ink falls ahead for 1.5 s, each drop storing a cut. | drop 0.25, store 0.4, time 1.5, width 50, recharge 6, clouds 1 |
| 2 | Rain lasts 1.5 to 2 s. | time 2 |
| 3 | New: each drop staggers the foe it hits. | stagger 0.18 |
| 4 | Drop store +50%. | store 0.6 |
| 5 | New: the cloud drifts after the nearest foe. | follow 1 |
| 6 | New: the rain ends in one great drop that knocks foes down; width 70 px. | width 70, last 2 |
| 7 | New: a foe struck by five drops is pinned for a moment. | pin 0.6 |
| 8 | Drop cut and store +150%. | drop 0.6, store 1.5 |
| Evolved | Two clouds; each drop stores twice. | store 3, clouds 2 |

Evolution: Monsoon, with `sa_stain` at level 4 or more. Two clouds rain at once, one each side of her, and every drop stores twice.

Code: `spells.ts`, `effects/inkRainCloud.ts`.

#### `sa_still` Still Water

Spell, timed, I. An ability on I: she waits with her hand on the hilt, and the first blow that comes meets a counter draw. Held, it also catches blows from behind.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Learn Still Water: stand still a moment; a blow from the front meets a counter draw. | time 0.8, recharge 7, power 1 |
| 2 | Stillness 0.8 to 1.1 s. | time 1.1 |
| 3 | New: the counter draw stores a cut in every foe ahead. | store 1.5 |
| 4 | Recharge 7 to 5.5 s. | recharge 5.5 |
| 5 | New: Still Water gives a breath as it starts. | breath 1 |
| 6 | New: its counter draw's click is a clean sheathe; draw +50%. | power 1.5, clean 1 |
| 7 | New: foe shots break on her stillness. | ward 1 |
| 8 | Stillness 1.1 to 1.5 s; counter draw +150%. | time 1.5, power 2.5 |
| Evolved | Waits up to 3 s; catches blows from behind. | time 3, behind 1 |

Evolution: Mirror Lake, with `sa_shade` at level 4 or more. Still Water waits up to 3 seconds for its blow and catches blows from behind.

Code: `spells.ts` (`runStill`, `stillTakes`), `counter.ts`.

#### `sa_weep` Weeping Cut

Dot, easy, auto (releases). Released cuts keep weeping: the foe bleeds for a while after each release.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A full release leaves the foe bleeding. | stacks 1, max 3, damage 0.06, every 0.5, time 3 |
| 2 | New: bleeding foes take +10% from releases; most stacks 5. | max 5, weak 0.1 |
| 3 | New: early releases leave it bleeding too. | early 1 |
| 4 | Bleed +60%. | damage 0.1 |
| 5 | New: a release lays a stack for each cut stored. | perCut 1 |
| 6 | Bleed +60% to +150%; most stacks 8. | max 8, damage 0.15 |
| 7 | New: a foe that dies bleeding passes its stacks to the foes near it. | spread 1 |
| 8 | Bleed +150% to +400%. | damage 0.3 |
| Evolved | Six stacks or more burst on release. | burst 2, burstAt 6 |

Evolution: Weeping Moon, with `sa_flow` at level 4 or more. A release on a foe with 6 or more stacks bursts them all at once for 2 attack damage each.

Code: `skills/weepingCut.ts`, `store.ts` (release bonus).

#### `sa_stain` Ink Stain

Dot, timed, auto (stored cuts). A cut waiting in a foe stains it: the foe takes a share of it every second until the sheathe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Foes holding stored cuts take 5% of them each second. | share 0.05 |
| 2 | New: a release takes +20% from the stain. | consume 0.2 |
| 3 | Stain 5% to 9% a second. | share 0.09 |
| 4 | New: stored cuts grow 5% each second they wait. | grow 0.05 |
| 5 | Stain 9% to 14% a second. | share 0.14 |
| 6 | New: the stain keeps ticking 2 s after the release. | linger 2 |
| 7 | New: each tick staggers the foe. | stagger 0.12 |
| 8 | Stain 14% to 30% a second; cuts grow 10%. | share 0.3, grow 0.1 |
| Evolved | Half of each cut stays stored after a release. | keep 0.5 |

Evolution: Indelible, with `sa_weep` at level 4 or more. A release leaves half of each foe's cut stored in it for the next sheathe.

Code: `skills/inkStain.ts`, `store.ts` (consume, keep).

#### `sa_trail` Lingering Line

Dot, timed, I. Brushline's ink stays on the floor and burns the foes that stand in it.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Brushline's stroke stays on the floor 2 s; foes on it take ink damage. | time 2, damage 0.4, every 0.4, wide 1 |
| 2 | The trail stays 2 to 3 s. | time 3 |
| 3 | New: Moonrise leaves a trail too. | rise 1 |
| 4 | Trail damage +60%. | damage 0.65 |
| 5 | New: foes on the trail are slowed. | slow 1 |
| 6 | Trail damage +60% to +150%; 4 s. | time 4, damage 1 |
| 7 | New: Focus fills twice as fast while she stands on her trail. | focus 2 |
| 8 | New: trail ticks store a small cut; damage +150% to +200%. | damage 1.2, store 0.3 |
| Evolved | Twice as wide; releases burst on the trail. | wide 2, burst 1.5 |

Evolution: Ink Sea, with `sa_stroke` at level 4 or more. Trails are twice as wide, and every release adds 1.5 ability power to each foe on a trail.

Code: `trail.ts`, `skills/lingeringLine.ts`, `brushline.ts`, `moonrise.ts`, `focus.ts`.

#### `sa_crane` Ink Crane

Summon, easy, auto (releases). When stored cuts release, an ink crane may fold itself from the splash and fly at a foe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A full release may fold an ink crane that flies at a foe and cuts it. | chance 0.3, power 1, cd 1.2, count 1, turns 1 |
| 2 | Chance 30% to 45%. | chance 0.45 |
| 3 | New: the crane stores its cut too. | store 1 |
| 4 | Crane +100%. | power 2 |
| 5 | New: two cranes at once. | count 2 |
| 6 | New: early releases fold cranes too; chance 70%. | chance 0.7, early 1 |
| 7 | New: each crane turns and cuts a second foe. | turns 2 |
| 8 | Crane +100% to +400%. | power 5, store 3 |
| Evolved | A crane for every foe a release strikes. | chance 1, perFoe 1 |

Evolution: Thousand Cranes, with `sa_crescent` at level 4 or more. Every full release folds a crane for each foe it struck.

Code: `skills/inkCrane.ts`.

#### `sa_shade` Ink Shade

Summon, precise, K. A parry or a perfect dodge may leave an ink shade of her that draws once on the nearest foe.
On the drill a dash that meets a blow is the perfect dodge, and the fifth level answers a Keen sheathe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry or perfect dodge may call an ink shade that draws on the nearest foe. | chance 0.5, power 4, count 1, cd 1 |
| 2 | Chance 50% to 75%. | chance 0.75 |
| 3 | New: the shade's draw stores a cut as well. | store 3 |
| 4 | New: the foe the shade cuts takes +25% damage for 3 s. | mark 0.25 |
| 5 | New: a clean sheathe calls a shade too; on the drill, a Keen sheathe. | clean 1, drill.keen 1 |
| 6 | Chance 75% to 100%; shade +150%. | chance 1, power 10 |
| 7 | New: the shade's draw is a sure critical hit. | crit 1 |
| 8 | Shade +150% to +400%. | power 20, store 8 |
| Evolved | Two shades, each drawing twice. | count 2, twice 1 |

Evolution: Twin Moon, with `sa_still` at level 4 or more. Two shades come each time, one each side of the foe, and each draws twice.

Code: `skills/shade.ts` (the Keen sheathe on the drill answers the shared `blow` event with `keen` and `finisher`).

#### `sa_paper` Paper Blades

Summon, easy, auto (kills). A foe that falls may leave a paper blade that circles her and cuts.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A kill may fold a paper blade that circles her and cuts foes it touches. | chance 0.35, time 4, power 0.5, every 0.5, most 2 |
| 2 | New: a full release may fold a blade too; blades last 6 s. | time 6, release 0.5 |
| 3 | New: blades store their cuts too. | store 0.4 |
| 4 | Chance 35% to 55%; cut +60%. | chance 0.55, power 0.8 |
| 5 | New: up to 4 blades at once. | most 4 |
| 6 | Cut +60% to +150%. | power 1.25 |
| 7 | New: a blade's last act is to fly at a foe. | fly 3 |
| 8 | Cut +150% to +400%. | power 2.5, store 1 |
| Evolved | Every kill folds a blade, up to 8. | chance 1, most 8, wider 1 |

Evolution: Paper Storm, with `sa_breath` at level 4 or more. Every kill folds a blade, up to 8, and they circle wider.

Code: `skills/paperBlades.ts`.

#### `sa_breath` Deep Breath

Passive, easy, auto. Focus fills faster, holds more breaths and heals her a little as it fills.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Breaths fill 20% faster. | rest 0.8 |
| 2 | New: Focus holds 4 breaths. | more 1 |
| 3 | Breaths fill 20% to 35% faster. | rest 0.65 |
| 4 | New: each breath filled heals 2 HP. | heal 2 |
| 5 | New: she walks 10% faster with Focus full. | move 1.1 |
| 6 | Breaths fill 35% to 50% faster. | rest 0.5 |
| 7 | New: Focus holds 5 breaths. | more 2 |
| 8 | Each breath heals 2 to 5 HP. | heal 5 |
| Evolved | A draw keeps its breath half the time. | refund 0.5 |

Evolution: Boundless Breath, with `sa_calm` at level 4 or more. A draw spends its breath only half the time.

Code: `focus.ts` (rest, breaths, heal, walk, refund).

#### `sa_calm` Calm Mind

Passive, timed, auto (full Focus). While her Focus is full she is calm: her hits deal more and her guard holds better.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | With Focus full her hits deal +10%. | bonus 0.1 |
| 2 | New: with Focus full her guard lets half as much through. | chip 0.5 |
| 3 | Bonus +10% to +20%. | bonus 0.2 |
| 4 | New: with Focus full releases deal +25% more. | release 0.25 |
| 5 | Bonus +20% to +30%. | bonus 0.3 |
| 6 | New: calm holds with one breath short of full. | need 1 |
| 7 | Release bonus +25% to +60%. | release 0.6 |
| 8 | New: bonus +30% to +50%, and calm holds 1 s after it breaks. | bonus 0.5, hold 1 |
| Evolved | Calm holds 3 s after it breaks; bonus doubled. | bonus 1, release 1.2, hold 3 |

Evolution: Empty Mind, with `sa_breath` at level 4 or more. Calm holds for 3 seconds after Focus drops, and the bonus doubles.

Code: `calm.ts`, `strike.ts` (`hitBonus`), `guardStyle.ts`, `store.ts`.

#### `sa_moon` Silent Moon

Ultimate, easy, J. On the drill, the four charged skills on held J (Quickdraw, Crescent Edge, Thousand Lines and Silent Moon) hit harder, charge faster, store cuts and release them (the Drill set table).
The native kit below keeps Silent Moon on U: more lines, harder bursts, and its click doubles stored cuts.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Silent Moon's lines burst 30% harder. | power 1.3 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: two more lines. | lines 2 |
| 4 | Power +30% to +40%. | power 1.4 |
| 5 | New: its click releases stored cuts at double. | stored 2 |
| 6 | New: foes it strikes take +30% damage for 4 s. | mark 0.3 |
| 7 | Power +40% to +50%. | power 1.5 |
| 8 | New: two more lines; power +50% to +60%. | power 1.6, lines 4 |
| Evolved | The lines burst twice. | twice 1 |

Evolution: New Moon, with `sa_clean` at level 4 or more. Every line bursts a second time a beat after the first.

Code: `ultimate/silentMoon.ts`, `ultimate/moonLines.ts`.

## Balance

Measured in a measuring room built to the method of `docs/skills/balance.md` (scripts in the agent's scratch folder, not in the repo): wave 2, hero level 1, only the skill under test held, the stream stopped, a crowd of six (four husks, two wisps), one husk at three times its HP ("one") or at twelve times ("late"), foes back 0.35 s after they fall and HP kept full.
A scripted player plays 5 s of warm-up and 60 s of measured play: it walks to the nearest foe, presses J every 0.43 s, dashes every 4 s, makes a falling draw every 6 s, casts whatever ability tab is ready, gets a perfect dodge every 7 s through the shared reward, warps every 4 s for Passing Draw, and charges Silent Moon to level 3 every 10 s for the ultimate.
Its play is weaker than the scripted player behind Kael's published figures, so every figure is scaled by Kael's base kit measured in the same room: the crowd by 146 / 17.1 and one foe by 42 / 10.2.

Base kits in this room, raw damage a second:

| Kit | Crowd | One | Late |
| --- | --- | --- | --- |
| Kael | 17.1 | 10.2 | 7.4 |
| Saya | 12.3 | 9.9 | 13.5 |

Saya matches Kael on one foe and reads about 70% of him on a crowd in this room; her release lands as one hit per foe, so on the room's crowd of small husks much of a release is overkill that the ledger counts but that cannot grow.

Added damage a second at level 8 (and evolved) on each skill's target, scaled to the bands of `docs/skills/balance.md` (easy 70, timed 112, precise one foe 175 to 210):

| Skill | Target | L8 | Evolved | Band |
| --- | --- | --- | --- | --- |
| `sa_edge` Honed Draw | one | 94 | 220 | timed 112 |
| `sa_clean` Clean Sheathe | late | 50 | 50 | precise 175 to 210 |
| `sa_reverse` Reverse Edge | crowd | 275, cut after | 31 | easy 70 |
| `sa_flow` Ink Flow | crowd | 60 | failed to load | timed 112 |
| `sa_falling` Falling Moon | crowd | 25 | 182 | timed 112 |
| `sa_pass` Passing Draw | crowd | 9 | 46 | movement, timed 90 |
| `sa_crescent` Crescent Wave | crowd | 3 | 208 | easy 70 |
| `sa_trail` Lingering Line | crowd | -24 | -35 | dot, timed 123 to 157 |
| `sa_crane` Ink Crane | crowd | 65 own | 52 own | summon, easy 70 |
| `sa_paper` Paper Blades | crowd | 45 own | 57 own | summon, easy 70 |
| `sa_shade` Ink Shade | late | 165 own | 130 own | summon, precise 175 to 210 |
| `sa_stain` Ink Stain | one | 54 | failed to load | dot, timed 123 to 157 |
| `sa_moon` Silent Moon | crowd | 10 times the base over the minute, cut after | the same | 6 times the base per cast |

"Own" is the skill's own source; the other figures are the change in the sources the skill can reach.
Silent Moon level 8 first read 34 times the base ultimate over the minute with power 3.5 and six more lines; at power 2 and four more lines it read 10 times, and its power at levels 4, 7 and 8 is now 1.4, 1.5 and 1.6.
Reverse Edge level 8 read far over the easy band; its store went to 2.6 and its crescent to 1 attack damage.
Lingering Line level 8 lost 40% of its damage after a first reading of 278.

### Limits of these figures

- The room's scripted player never rests and rarely presses in the Keen beat, so Deep Breath, Calm Mind and the first levels of Clean Sheathe read as the base kit: their triggers (full Focus, a clean sheathe) do not happen in it. Clean Sheathe on the late target, where its bonus could show, read 50, under its band.
- Shadow Step never passed through a foe in the room (the dodge starts at the foe's edge and the release knocks foes away), so it read as the base kit and is unmeasured.
- Single runs swing widely: the same kit's deltas move by 20 to 40 a second between runs of different builds, and several skills read lower at level 8 than at level 1 (Ink Crane, Ink Rain, Weeping Cut), where the skill changed what the scripted player did. Skills inside the noise are unmeasured in effect.
- Eleven runs failed to load the game under the load of six runs at once; the reruns covered most of them, and Ink Flow, Ink Rain and Ink Stain evolved, Long Stroke level 8 and Lingering Line level 1 are unmeasured.
- The changes after the readings (Silent Moon, Reverse Edge) were not measured again.

### Bot runs

The playtest bots on the finished kit (`agent-studio`, one run each, deterministic), beside Kael's on the same commit:

| Run | Saya | Kael |
| --- | --- | --- |
| Skilled from wave 1 | wave 5, level 6, 16 kills, 29 coins, 97 s | wave 5, level 6, 17 kills, 27 coins, 100.5 s |
| Mash from wave 1 | wave 5, level 5, 15 kills, 24 coins, 95.9 s | wave 5, level 5, 14 kills, 28 coins, 94 s |
| Skilled from wave 11, levels 12, 13 and 14 | waves 11, 14 and 12; 5, 28 and 9 kills | waves 12, 12 and 13; 15, 10 and 18 kills |

From wave 11 a single run swings by two waves with the start level, so three are listed.
At wave 11 she first fell in 27.7 s at every damage setting tried, so that run is chance in the opening crowd more than her numbers.
The draw cut breaks guards in the base kit, so husks from wave 11 cannot stop the blow that stores her largest cut.

## Example builds

Each has 8 skills; three evolve, steered with skips and banishes.

**Clean blade** (precise, one target): Clean Sheathe, Honed Draw, Calm Mind, Deep Breath, Ink Shade, Still Water, Ink Stain, Silent Moon.
Evolve Clean Sheathe (Honed Draw), Honed Draw (Clean Sheathe), Calm Mind (Deep Breath).
Rest to fill Focus, spend a breath on each draw, sheathe in the Keen beat; parries and Still Water call shades. Boss killer, needs rhythm.

**Ink storm** (easy, crowd): Long Stroke, Lingering Line, Ink Rain, Crescent Wave, Ink Crane, Ink Flow, Weeping Cut, Silent Moon.
Evolve Long Stroke (Lingering Line), Crescent Wave (Ink Rain), Ink Crane (Crescent Wave).
Store cuts in the whole crowd with crescents and rain, dash through it, and let every release fold cranes and bleed the crowd.

**Moonfall** (timed, juggle): Falling Moon, Passing Draw, Shadow Step, Reverse Edge, Ink Flow, Weeping Cut, Paper Blades, Silent Moon.
Evolve Falling Moon (Passing Draw), Passing Draw (Shadow Step), Reverse Edge (Ink Flow).
Moonrise and the return cut throw foes up, the falling draw brings them down, and each landing releases into a ring.

## Code map

Saya's folder is `src/heroes/saya/`, laid out as `docs/hero-module.md` describes: `character.ts` exports `SAYA` and `index.ts` exports `SAYA_MODULE`.
Skill rows are in `constants/skills/`, one file per skill, listed in `constants/skills/index.ts`; ids are named in `constants/skills/ids.ts`.
Code that runs on its own is in `game/skills/` (Weeping Cut, Ink Stain, Lingering Line's burst, Ink Crane, Ink Shade, Paper Blades), registered in `game/skills/index.ts`.
The rest is read where the kit acts: `store.ts` (every release), `strike.ts` (the string), `clean.ts`, `warpStyle.ts`, `dodge.ts`, `brushline.ts`, `spells.ts`, `focus.ts`, `calm.ts`, `trail.ts` and `ultimate/`.
Icons are in `ui/icons/`: `skills.ts` (one per skill), `evolved.ts` (one per evolution, with the gold star) and `sources.ts`.
