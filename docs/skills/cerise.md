# Cerise skills

Cerise's 20 skills, to the contract in `docs/skill-design.md`.
Her design note is `docs/heroes/cerise.md`.
AD and AP mean her attack damage (10 at hero level 1) and ability power (9).
The data rows are in `src/heroes/cerise/constants/skills/`, one file per skill, and the tables below are written from them.

## Drill set

Solo Adventure runs base Cerise on the shared drill engine (`src/drill`), and all 20 skills are offered there, each upgrading one drill mechanic (`docs/skill-design.md`, "Drill baseline").
The rows keep the numbers her native kit reads (co-op, the wave arena) and add the drill's under a `drill.` prefix (`constants/skills/drillRows.ts`), so the card text is the drill's and the sections after this one still describe the native kit.
Drill code: `src/heroes/cerise/game/drill/skills/`, one file per redesigned skill, folded into `CERISE_DRILL` by `game/drill/hooks.ts`.

| Id | Name | Mechanic | Level 1 | Levels 2 to 8 | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| `ce_measure` | Measured Touch | first thrust | the first thrust strikes again, 0.6 AD | a sure crit, a 0.4 s hold, the Rose mark, a second touch, up to 4 AD | Perfect Measure (`ce_riposte`): every first thrust calls a glass rapier, 4 AD |
| `ce_feint` | Feint | second thrust | opens the foe, +15% for 2 s | stagger, readies the dash, a cut behind, up to +50% for 3.5 s | Phantom Feint (`ce_mirror`): a glass rapier strikes the opened foe from behind |
| `ce_lunge` | Long Lunge | third thrust | the lunge +40% | a pin, a Rose Line streak, stagger, a twin streak, up to +300% | Comet Lunge (`ce_needle`): a lunge that lands readies the warp and the dash |
| `ce_pin` | Pinning Point | air thrust | pins 0.6 s and strikes again, 0.5 AD | two more air thrusts, pinned foes take +20%, up to 4 AD and 1.5 s | Butterfly Pin (`ce_thorns`): each air thrust skewers the foes below, 3 AD |
| `ce_riposte` | Riposte Chain | guard and parry | parry window +50%; a parry ripostes the foe ahead, 1.5 AD sure crit | the Rose mark, readies the dash and an air dash, a piercing riposte, up to 8 AD and +100% window | Endless Riposte (`ce_measure`): 2 s of thrusts +100% after a parry |
| `ce_markwarp` | Rose Mark | warp strike | warp +30%, the arrival sets the Rose mark | recharge down to -45%, stagger, a pierce behind, restores an air dash and the air thrust, up to +250% | Crimson Seal (`ce_lunge`): the arrival marks every foe within 70 px |
| `ce_step` | Passing Touch | dash | dashing through foes cuts them, 0.8 AD | stagger, a dash through a foe readies the dash, the Rose mark, a thrust at the end, up to 5 AD | Petal Step (`ce_measure`): each cut strikes twice more at 50% |
| `ce_poise` | Poise | dash and air dash | one more air dash, crit chance +4% | untouchable dashes, an air dash restores the air thrust, up to three more air dashes, the thrust after a dash up to +200%, crit chance up to +20% | Perfect Poise (`ce_lunge`): every dash readies the warp |
| `ce_grace` | Grace | warp and infusion | the arrival infuses the selected spell for 1 hit | faster preparation (up to 45%), heals on arrival, longer infusions, the arrival shortens a preparation, infused hits heal | Rose Grace (`ce_riposte`): every arrival readies the selected spell |
| `ce_dive` | Swallow Dive | jump, wall kick, air | one more air thrust | a cutting wall kick, a stomp after an air thrust, one more air dash, a pinning stomp, up to 5 AD | Swallow Storm (`ce_step`): the stomp reaches 70 px and draws foes in |
| `ce_mirrorguard` | Mirror Guard | Rose Line | Rose Line strikes again, 1 AP | a mirrored line, +15% taken, Rose Edge strikes, two more mirrored lines, up to 8 AP | Perfect Mirror (`ce_riposte`): Rose Line marks every foe within 50 px |
| `ce_needle` | Needle Rain | Flurry | Flurry rains 3 needles, 0.8 AP each | longer stagger, 5 then 7 needles, pinning needles, Rose Edge needles, up to 4 AP | Starneedle Rain (`ce_markwarp`): Flurry strikes twice |
| `ce_bloom` | Rose Bloom | Rose Bloom | the bloom strikes again, 1.2 AP | a bleed, a lingering petal ring, a longer bind, a launch and Rose Edge strikes, up to 8 AP | Full Bloom (`ce_petals`): the bloom bursts on every foe within 60 px |
| `ce_thorns` | Thorn Wounds | dot on thrusts | a bleeding thorn a thrust, up to 4 | more thorns, the lunge leaves 3 then 5, Rose Edge hits leave 2 more, up to 0.6 AD a tick | Thorn Burst (`ce_pin`): the lunge bursts every thorn for 1 AD each |
| `ce_weep` | Weeping Mark | dot on the Rose mark | marked foes bleed 0.4 AD a second | +10% then +25% taken, blows keep the mark fresh, every spell marks, the mark passes on a kill, up to 3.5 AD a second | Crimson Weep (`ce_markwarp`): the bleed spills onto foes near it at half |
| `ce_curse` | Wilting Curse | dot on parries | a parry lays 3 stacks, 0.2 AD a tick | each thrust on a cursed foe adds a stack, held feet, 5 stacks up to 12, a curse burst on a kill, +20% taken, up to 1.8 AD | Last Petal (`ce_riposte`): the lunge tears the curse out, 3 AD a stack |
| `ce_mirror` | Mirror Blade | summon on parries and perfect dodges | 50% to call a glass rapier, 4 AD | sure call, a lunge back, the Rose mark, two rapiers, stagger, up to 20 AD | Hall of Mirrors (`ce_feint`): rapiers keep lunging for 2 s |
| `ce_petals` | Petal Blades | summon on casts | 40% to call 2 petal blades for 4 s, 0.5 AD | sure call, a third blade, a bleed, 7 s, faster darts, up to 4 blades at 0.9 AD | Rose Guard (`ce_bloom`): five blades circle her for good |
| `ce_sentinel` | Thorn Sentinel | summon on the third thrust | 50% to plant a rapier of light for 3 s, 0.8 AD a thrust | sure plant, two then three at once, pinning thrusts, more reach, faster thrusts, up to 1.5 AD | Thorn Garden (`ce_lunge`): it bursts for 6 AD when it fades |
| `ce_tempest` | Rose Tempest | the four charged tiers | charged skills +30% | the Rose mark on every foe in reach, faster charge, an echo streak, a pull and more reach, up to +250% | Rose Storm (`ce_measure`): four more streaks, two each way |

Count by mechanic: 4 thrust skills, 1 guard skill, 4 warp and dash skills, 1 jump skill, 3 spell skills, 3 damage over time, 3 summons, 1 charged-tier skill.
Poise and Grace moved from `passive` to `movement` for the drill split.
Native-only effects (Points, riposte links, the native string's moves) do nothing in the drill.
Parries, perfect dodges (a dash through a blow), casts and the third thrust trigger the summons and curses in both.
Weeping Mark and Wilting Curse keep their native rows and swap one level each for a drill property (every spell marks; thrusts deepen the curse).

## Identity

Cerise is the duelist: a five-blow string of thrusts on a thin line, Points earned by Keen timing and spent by the lunge, a weak block with the best parry in the roster, and a riposte chain kept going on the beat.
Her skills lean on those: Keen presses, ripostes, the lunge, the Rose mark from the warp, and pins.
Every skill sits on a button the shared moveset already has, or runs on its own.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The string, five blows, the same every time: lead thrust (0.72 AD), second thrust (0.72), rising thrust (0.8, staggers longer), twin flick (0.42 + 0.48), long lunge (2 AD, +0.45 a Point, pierces and pins every foe on its line, ends the string). |
| J (Keen) | J pressed in the 0.1 s after a blow lands: the next blow is a sure crit and the move earns a Point. |
| J (air) | One diving thrust a jump, on a slant, 1.5 AD, pinning what it strikes. |
| J held | The shared warp; the arrival is a thrust, and it sets the Rose mark (her blows +25% on the foe, Keen blows +60% more, 4 s). |
| K | Guard: 45% of a blow through, 20 stamina. |
| K (parry) | The shared parry, a Point, and a riposte at once (1.3 AD, a sure crit). |
| J after a riposte | In the 0.22 s after a riposte lands, the next riposte (+0.25 AD each link, a Point each), six at most. A J pressed early ends the chain. |
| L | The shared dodge. |
| I | Flurry (10 MP, 2.5 s): seven thrusts, 0.36 AP each. Rose Line (14 MP, 4 s): a wave of rose light across the screen, 2.4 AP. Each spends up to two Points, +40% a Point. Pressed in an open string it goes off at once, and in the Keen beat it earns a Point. |
| I held | Flurry: eleven thrusts in a cone that reaches flyers. Rose Line: both ways. 1.5 times the MP. |
| O | Switch ability: Flurry, Rose Line, then the spell skills. |
| U | Rose Tempest: ten thrusts at 0.05 of the charge level's power each, then a lunge whose streak deals 0.45 of it to every foe on her line, 120 to 340 px. |
| W | Jump; again in the air for a double jump. |

## Rules the skills share

- Combo length never changes (`comboHits: 5`).
- Precise payoffs follow `docs/skill-design.md`: Measured Touch's Keen bonus lands only on the foe the Keen move paid off on, and Perfect Measure's star only on that foe.
- Damage source: her own presses (string, ripostes, warp, dodge thrust, abilities, ultimate, dive landing) count as `attacks`, `abilities` or `ultimate` and build Flow; bleeds, curses and summons use the skill's id and build none.
- Counts: attack 5, movement 5, spell 3, dot 3, summon 3, ultimate 1. Risk: easy 6, timed 9, precise 5.
- "New" in a card line marks a level that adds a property; every skill has at least four.

## Balance

Measured on 15 November 2026 in a room after `docs/skills/balance.md`, built for this pass because the playtest harness has no shared room.
The room starts at wave 2 with only the skill under test, keeps a crowd of four husks and two wisps (or one husk at three times its HP), refills a fallen foe 0.35 s later and keeps the hero's HP full.
An in-page scripted player plays 5 s of warm-up and 30 s of measured play: it walks to the nearest foe and thrusts, makes 30% of follow-up presses Keen, guards just before a husk's swipe, casts a held spell first, dodges through a foe every 4 s, jumps and dives every 6 s, warps every 4 s at range and charges U every 10 s when paid for.
Figures are damage a second added over the base kit, raw at hero level 1.

Base kit in this room: Cerise 358 on the crowd and 133 on one foe; Kael, played by the same script, 163 and 92.
Two base runs with different player seeds read 358 and 279 on the crowd, so differences under about 80 a second are noise.
The room is not the one Kael's figures in `docs/skills/balance.md` came from, so compare these figures with each other and with the bands as ratios, not with Kael's table.

| Skill | L1 crowd | L8 crowd | Evolved crowd | L8 one | Evolved one | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `ce_measure` | -46 | 745 | 758 | 228 | 784 | after tuning; one foe in the precise band; the crowd figure comes from the extra Points feeding full lunges |
| `ce_riposte` | 0 | 0 | 0 | 0 | 0 | not measured: parries rare in the room |
| `ce_lunge` | 60 | -11 | - | - | - | after tuning; lunges are rare in the room (a hit taken breaks the string) |
| `ce_pin` | 0 | -6 | 89 | - | - | after tuning |
| `ce_feint` | -140 | -157 | -130 | 169 | - | after tuning (one foe) |
| `ce_markwarp` | 0 | 0 | 0 | - | - | not measured: the crowd stays in reach, so the player never warps |
| `ce_step` | -35 | -125 | -92 | - | - | within noise |
| `ce_dive` | -163 | -99 | -217 | - | - | within noise; the dive pulls her out of the string |
| `ce_bloom` | -107 | -32 | 280 | - | - | after tuning |
| `ce_needle` | -227 | -142 | -142 | - | - | casting it takes the place of Flurry and Rose Line casts in the script |
| `ce_mirrorguard` | -113 | 214 | 675 | 33 | 11 | measured before the stance was cut to one answer; not re-measured |
| `ce_thorns` | -97 | -127 | -114 | - | - | within noise |
| `ce_weep` | 0 | 0 | 0 | - | - | not measured: no warps, so no marks |
| `ce_curse` | 0 | 0 | 0 | 0 | 0 | not measured: parries rare in the room |
| `ce_mirror` | 46 | -40 | -40 | 0 | 0 | not measured: parries and perfect dodges rare |
| `ce_petals` | -98 | 89 | 327 | - | - | after tuning |
| `ce_sentinel` | -28 | -77 | 420 | - | - | after tuning (L8); evolved measured before tuning |
| `ce_poise` | -187 | -100 | -100 | - | - | within noise |
| `ce_grace` | 0 | 0 | 0 | - | - | heals only; the room keeps HP full |
| `ce_tempest` | -2 | 75 | 89 | 21 | 21 | U every 10 s; base ultimate reads 14 on the crowd, so level 8 is about 6 times it |

Changes from the first measurement, data rows only: Measured Touch level 8 bonus 14 to 8 and its star 260 to 90, its seventh level's second strike on the paid-off foe only; Long Lunge power 0.5, 1.2, 3 to 0.3, 0.6, 1.2 and 0.7 to 0.55 a Point; Pinning Point's held bonus 0.3, 0.8, 2, 3 to 0.2, 0.4, 0.6, 1.2; Feint's open bonus 0.25, 0.5, 1.5 to 0.15, 0.25, 0.35 and its glass rapier 6 to 4 AD; Rose Bloom level 8 6 to 5 AP and evolved echoes at half strength; Petal Blades darts 1 and 2.5 to 0.6 and 0.9 AD and Rose Guard six blades to five; Thorn Sentinel 1.6 and 4 to 1 and 1.5 AD; Mirror Guard's stance takes one blow and its bonus lands on that riposte only.
Before tuning: Measured Touch 1,269 crowd and 338 one at level 8; Long Lunge 426; Pinning Point 286; Feint 430 on one foe; Petal Blades 893 and 1,223 evolved; Thorn Sentinel 406; Rose Bloom 869 evolved; Mirror Guard 600 and 2,989 evolved (first stance code).

Still off or unmeasured:

- Measured Touch spills over the precise crowd cap (about 300) through Points and full lunges.
- The parry skills (Riposte Chain, Wilting Curse, Mirror Blade), the mark skills (Rose Mark, Weeping Mark) and Grace need a room that drives parries and warps at the model's rates; they read zero here.
- Rose Tempest was not measured per cast against the base special.

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `ce_measure` | Measured Touch | attack | precise | J | `ce_riposte` | Perfect Measure |
| `ce_riposte` | Riposte Chain | attack | precise | K | `ce_measure` | Endless Riposte |
| `ce_lunge` | Long Lunge | attack | timed | J | `ce_needle` | Comet Lunge |
| `ce_pin` | Pinning Point | attack | easy | J | `ce_thorns` | Butterfly Pin |
| `ce_feint` | Feint | attack | timed | J | `ce_mirror` | Phantom Feint |
| `ce_markwarp` | Rose Mark | movement | timed | U | `ce_lunge` | Crimson Seal |
| `ce_step` | Passing Touch | movement | timed | L | `ce_measure` | Petal Step |
| `ce_dive` | Swallow Dive | movement | timed | jump | `ce_step` | Swallow Storm |
| `ce_bloom` | Rose Bloom | spell | easy | I | `ce_petals` | Full Bloom |
| `ce_needle` | Needle Rain | spell | timed | I | `ce_markwarp` | Starneedle Rain |
| `ce_mirrorguard` | Mirror Guard | spell | precise | I | `ce_riposte` | Perfect Mirror |
| `ce_thorns` | Thorn Wounds | dot | easy | auto | `ce_pin` | Thorn Burst |
| `ce_weep` | Weeping Mark | dot | timed | auto | `ce_markwarp` | Crimson Weep |
| `ce_curse` | Wilting Curse | dot | precise | auto | `ce_riposte` | Last Petal |
| `ce_mirror` | Mirror Blade | summon | precise | auto | `ce_feint` | Hall of Mirrors |
| `ce_petals` | Petal Blades | summon | easy | auto | `ce_bloom` | Rose Guard |
| `ce_sentinel` | Thorn Sentinel | summon | timed | auto | `ce_lunge` | Thorn Garden |
| `ce_poise` | Poise | movement | easy | L | `ce_lunge` | Perfect Poise |
| `ce_grace` | Grace | movement | timed | U | `ce_riposte` | Rose Grace |
| `ce_tempest` | Rose Tempest | ultimate | easy | J | `ce_measure` | Rose Storm |

#### `ce_measure` Measured Touch

Attack, precise, J. Press J in the beat after a thrust lands: the Keen blow hits far harder.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Keen blows deal +150% damage. | bonus 1.5, window 0.1 |
| 2 | Keen beat 0.10 to 0.15 s. | window 0.15 |
| 3 | New: a Keen blow holds its foe in place for 0.4 s. | hold 0.4 |
| 4 | New: Keen thrusts reach 16 px farther. | reach 16 |
| 5 | Keen damage +150% to +400%. | bonus 4 |
| 6 | New: each Keen blow in a row adds +25% to the next, up to +100%. | streak 0.25, streakCap 1 |
| 7 | New: a Keen lunge strikes twice. | twin 1 |
| 8 | Keen damage +400% to +800%. | bonus 8 |
| Evolved | Perfect Measure: Every fourth Keen blow in a row bursts a gold rose star on the foe and gives 2 Points. Partner: Riposte Chain at level 4. | star 90, starEvery 4, starPoints 2 |

#### `ce_riposte` Riposte Chain

Attack, precise, K. Parry, then keep the beat: every riposte link hits far harder.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Riposte links deal +100% damage. | bonus 1 |
| 2 | Riposte beat 0.22 to 0.3 s. | window 0.3 |
| 3 | New: each riposte link sets the Rose mark. | mark 1 |
| 4 | New: riposte links break guards; chains of up to 8 links. | links 8, guardBreak 1 |
| 5 | Riposte damage +100% to +300%. | bonus 3 |
| 6 | New: every third link sends a Rose Line. | line 3, linePower 1 |
| 7 | New: a parry gives 2 Points. | parryPoints 2 |
| 8 | Riposte damage +300% to +900%. | bonus 9 |
| Evolved | Endless Riposte: A blocked blow starts the riposte chain too, and the chain runs to 12 links. Partner: Measured Touch at level 4. | links 12, fromBlock 1 |

#### `ce_lunge` Long Lunge

Attack, timed, J. The lunge at the end of the string hits harder and reaches farther.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The lunge deals +30% damage. | power 0.3 |
| 2 | New: the lunge reaches 20 px farther. | reach 20 |
| 3 | New: the lunge breaks guards. | guardBreak 1 |
| 4 | Lunge damage +30% to +60%. | power 0.6 |
| 5 | New: the lunge pins foes for 1.4 s. | pin 1.4 |
| 6 | New: petals cut the lunge's line again a moment later. | echo 0.5 |
| 7 | New: each Point adds +0.55 AD to the lunge. | perPoint 0.55 |
| 8 | Lunge damage +60% to +120%. | power 1.2 |
| Evolved | Comet Lunge: The lunge sends a streak of rose light across the whole screen along its line. Partner: Needle Rain at level 4. | comet 1.5 |

#### `ce_pin` Pinning Point

Attack, easy, J. Thrusts hold foes where they stand, and held foes take more.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Thrusts hold a walker's feet for 0.4 s. | halt 0.4 |
| 2 | New: held and pinned foes take +20% from your blows. | held 0.2 |
| 3 | Hold 0.4 to 0.8 s. | halt 0.8 |
| 4 | New: the rising thrust also cuts behind you. | behind 1 |
| 5 | Held bonus +20% to +40%. | held 0.4 |
| 6 | New: thrusts reach 8 px farther. | reach 8 |
| 7 | New: Flurry's thrusts hold feet too. | flurryHalt 1 |
| 8 | Held bonus +40% to +60%. | held 0.6 |
| Evolved | Butterfly Pin: Every thrust pins its foe in place, and pinned foes take +120%. Partner: Thorn Wounds at level 4. | held 1.2, pinAll 0.5 |

#### `ce_feint` Feint

Attack, timed, J. The rising thrust is a feint that opens the foe to your next blows.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The rising thrust opens its foe: +15% from your blows for 2 s. | open 0.15, openTime 2 |
| 2 | New: the rising thrust breaks guards. | guardBreak 1 |
| 3 | Open bonus +15% to +25%. | open 0.25 |
| 4 | New: a feint that lands gives a Point. | points 1 |
| 5 | New: the feint turns the foe away from you. | turn 1 |
| 6 | Open 2 to 3.5 s. | openTime 3.5 |
| 7 | New: the feint also cuts behind you. | behind 1 |
| 8 | Open bonus +25% to +35%. | open 0.35 |
| Evolved | Phantom Feint: A glass rapier strikes every opened foe from behind. Partner: Mirror Blade at level 4. | phantom 4 |

#### `ce_markwarp` Rose Mark

Movement, timed, J. J held: the warp's Rose mark grows stronger and lasts longer.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Mark bonus +25% to +40%; it lasts 6 s. | mark 0.4, markTime 6 |
| 2 | New: the arrival thrust gives a Point. | points 1 |
| 3 | New: the arrival thrust pierces to the foe behind. | pierce 1 |
| 4 | Warp recharge 2 to 1.5 s. | recharge 1.5 |
| 5 | New: a marked foe that falls gives the warp back. | refund 1 |
| 6 | Keen blows on a marked foe +60% to +120%. | markKeen 1.2 |
| 7 | New: two warps in a row. | charges 2 |
| 8 | Arrival thrust 1.8 to 3.2 AD. | strike 3.2 |
| Evolved | Crimson Seal: A marked foe that falls marks every foe within 60 px of it. Partner: Long Lunge at level 4. | seal 60 |

#### `ce_step` Passing Touch

Movement, timed, L. L: the dodge ends in a thrust, and cuts the foes it passes.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The dodge ends in a thrust ahead for 1.2 AD. | thrust 1.2 |
| 2 | New: foes you dodge through are cut for 0.6 AD. | pass 0.6 |
| 3 | New: a perfect dodge gives 2 Points. | perfectPoints 2 |
| 4 | Thrust 1.2 to 2.5 AD. | thrust 2.5 |
| 5 | New: after a perfect dodge the thrust is Keen. | keen 1 |
| 6 | New: each foe you pass gives 10 stamina back. | stamina 10 |
| 7 | New: the thrust holds its foe for 1 s. | pin 1 |
| 8 | Thrust 2.5 to 5 AD; passing cut 0.6 to 1.5 AD. | thrust 5, pass 1.5 |
| Evolved | Petal Step: The dodge leaves a ring of petal blades where it began. Partner: Measured Touch at level 4. | petals 1.2 |

#### `ce_dive` Swallow Dive

Movement, timed, jump. The diving thrust hits harder, and the landing cuts.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The diving thrust deals +60% damage. | power 0.6 |
| 2 | New: an air thrust before the dive. | air 1 |
| 3 | New: the landing cuts both sides for 1.2 AD. | land 1.2 |
| 4 | Dive damage +60% to +150%. | power 1.5 |
| 5 | New: the dive pins its foe for 1.2 s. | pin 1.2 |
| 6 | New: a dive that strikes gives a Point. | points 1 |
| 7 | New: the landing cut reaches 16 px farther. | ring 16 |
| 8 | Dive damage +150% to +400%; landing 1.2 to 3 AD. | power 4, land 3 |
| Evolved | Swallow Storm: The dive's landing sends a Rose Line each way along the floor. Partner: Passing Touch at level 4. | lines 1, linePower 1.5 |

#### `ce_bloom` Rose Bloom

Spell, easy, I. I: a burst of petal blades round you that pushes foes off. Held, it is wider and pulls them in.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | I: blades of petal burst round you, 1.6 AP, pushing foes off. | power 1.6, reach 40, recharge 6 |
| 2 | New: petals linger 2 s and cut foes inside. | linger 2, tick 0.3 |
| 3 | New: the bloom throws foes up; reach 40 to 56 px. | reach 56, launch 1 |
| 4 | New: heals 3 HP for each foe struck. | heal 3 |
| 5 | Bloom 1.6 to 3 AP. | power 3 |
| 6 | New: a Point for every two foes struck. | points 1 |
| 7 | Recharge 6 to 4 s. | recharge 4 |
| 8 | Bloom 3 to 5 AP; petals 0.3 to 0.6 AP a tick. | power 5, tick 0.6 |
| Evolved | Garden of Blades: The bloom bursts twice more at half strength, wider each time. Partner: Petal Blades at level 4. | echoes 2 |

#### `ce_needle` Needle Rain

Spell, timed, I. I: needles of light fall in a row along your line. Held, they fall both ways.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | I: 5 needles of light fall along your line, 1.2 AP each. | needles 5, power 1.2, recharge 5 |
| 2 | New: needles pin foes for 0.5 s. | pin 0.5 |
| 3 | Needles 5 to 7. | needles 7 |
| 4 | New: needles leave a bleed. | bleed 0.2 |
| 5 | Needles 1.2 to 2.4 AP. | power 2.4 |
| 6 | New: needles fall on the foes nearest them. | home 1 |
| 7 | New: a second rain falls a moment later. | second 1 |
| 8 | Needles 2.4 to 5 AP. | power 5 |
| Evolved | Starneedle Rain: A needle twice as strong also falls on every marked foe. Partner: Rose Mark at level 4. | marked 1 |

#### `ce_mirrorguard` Mirror Guard

Spell, precise, I. I: a short stance that parries the next blow for you and answers with a riposte.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | I: for 0.4 s the next blow from the front is parried for you. | time 0.4, recharge 6 |
| 2 | New: its riposte deals +200% damage. | bonus 2 |
| 3 | Stance 0.4 to 0.7 s. | time 0.7 |
| 4 | New: blows from behind are parried too. | around 1 |
| 5 | New: a parry in the stance gives 2 more Points. | points 2 |
| 6 | Recharge 6 to 4 s. | recharge 4 |
| 7 | New: a parry in the stance sends a Rose Line. | line 1 |
| 8 | Riposte bonus +200% to +800%. | bonus 8 |
| Evolved | Perfect Mirror: The stance lasts 1.2 s and its riposte deals +1600%. Partner: Riposte Chain at level 4. | time 1.2, bonus 16 |

#### `ce_thorns` Thorn Wounds

Dot, easy, auto. Your thrusts leave thorns that bleed.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Thrusts leave a bleeding thorn: 0.1 AD a tick, up to 4. | damage 0.1, max 4, duration 3 |
| 2 | Up to 4 to 6 thorns. | max 6 |
| 3 | New: the lunge leaves 3 thorns. | lungeStacks 3 |
| 4 | Thorns 0.1 to 0.25 AD a tick. | damage 0.25 |
| 5 | New: bleeding foes take +15% from every source. | taken 0.15 |
| 6 | New: riposte links leave 2 thorns. | riposteStacks 2 |
| 7 | New: a thorn holds a walker's feet 0.4 s; up to 10 thorns, lasting 5 s. | max 10, duration 5, halt 0.4 |
| 8 | Thorns 0.25 to 0.7 AD a tick. | damage 0.7 |
| Evolved | Bloodrose: The lunge tears every thorn out at once for 2.5 AD each. Partner: Pinning Point at level 4. | burst 2.5 |

#### `ce_weep` Weeping Mark

Dot, timed, auto. Foes carrying your Rose mark bleed.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Marked foes bleed 0.4 AD a second. | dps 0.4 |
| 2 | New: marked foes take +10% from every source. | taken 0.1 |
| 3 | New: your blows keep a mark fresh; bleed 0.9 AD a second. | dps 0.9, refresh 1 |
| 4 | New: Rose Line marks every foe it cuts. | lineMark 1 |
| 5 | Bleed 0.9 to 1.6 AD a second. | dps 1.6 |
| 6 | New: a marked foe that falls passes its mark on. | pass 1 |
| 7 | Marked foes take +10% to +25%. | taken 0.25 |
| 8 | Bleed 1.6 to 3.5 AD a second. | dps 3.5 |
| Evolved | Crimson Weep: A marked foe's bleeding spills onto every foe close to it at half strength. Partner: Rose Mark at level 4. | spread 0.5 |

#### `ce_curse` Wilting Curse

Dot, precise, auto. A parry curses the attacker, and the curse eats at it.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry curses the attacker: 3 stacks of 0.2 AD a tick. | stacks 3, max 8, damage 0.2, duration 4 |
| 2 | New: each riposte link adds a stack. | linkStacks 1 |
| 3 | Curse 0.2 to 0.45 AD a tick. | damage 0.45 |
| 4 | New: cursed walkers' feet are held for 1 s. | halt 1 |
| 5 | A parry lays 3 to 5 stacks; up to 12. | stacks 5, max 12 |
| 6 | New: a cursed foe that falls curses the foes round it. | burst 40 |
| 7 | New: cursed foes take +20% from every source; it lasts 6 s. | duration 6, taken 0.2 |
| 8 | Curse 0.45 to 1.8 AD a tick. | damage 1.8 |
| Evolved | Last Petal: The last link of a riposte chain tears the curse out at once for 3 AD a stack. Partner: Riposte Chain at level 4. | tear 3 |

#### `ce_mirror` Mirror Blade

Summon, precise, auto. A parry or a perfect dodge can call a glass rapier that lunges through the foe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry or perfect dodge: 50% to call a glass rapier that lunges through the foe, 4 AD. | chance 0.5, power 4, blades 1 |
| 2 | Chance 50% to 75%. | chance 0.75 |
| 3 | New: the rapier lunges back through it. | twice 1 |
| 4 | Lunge 4 to 8 AD; chance 100%. | chance 1, power 8 |
| 5 | New: the rapier sets the Rose mark. | mark 1 |
| 6 | New: two rapiers come. | blades 2 |
| 7 | New: the rapier gives a Point. | points 1 |
| 8 | Lunge 8 to 20 AD. | power 20 |
| Evolved | Hall of Mirrors: After the call, glass rapiers keep lunging at the foe for 2 s. Partner: Feint at level 4. | every 0.25, hold 2 |

#### `ce_petals` Petal Blades

Summon, easy, auto. Casting an ability can call petal blades that dart at foes round you.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | An ability: 40% to call 2 petal blades that dart at foes for 4 s, 0.5 AD. | chance 0.4, count 2, power 0.5, every 0.6, life 4, cd 3 |
| 2 | Chance 40% to 70%. | chance 0.7 |
| 3 | New: a third blade. | count 3 |
| 4 | Darts 0.5 to 0.6 AD; chance 100%. | chance 1, power 0.6 |
| 5 | New: darts leave a bleed. | bleed 0.2 |
| 6 | New: blades stay 4 to 7 s. | life 7 |
| 7 | New: blades dart twice as often. | every 0.3 |
| 8 | Darts 0.6 to 0.9 AD; 4 blades. | count 4, power 0.9 |
| Evolved | Rose Guard: Five petal blades circle you for good and dart at every foe that comes close. Partner: Rose Bloom at level 4. | count 5, orbit 1 |

#### `ce_sentinel` Thorn Sentinel

Summon, timed, auto. The lunge can plant a rapier of light in the floor that keeps thrusting at foes.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The lunge: 50% to plant a rapier of light that thrusts at foes near it for 3 s, 0.8 AD. | chance 0.5, time 3, power 0.8, every 0.5, reach 40, most 1 |
| 2 | Chance 50% to 80%. | chance 0.8 |
| 3 | New: up to two sentinels at once. | most 2 |
| 4 | Thrusts 0.8 to 1 AD; it stands 4 s. | time 4, power 1 |
| 5 | New: its thrusts pin foes. | pin 0.4 |
| 6 | New: it reaches 40 to 60 px; chance 100%. | chance 1, reach 60 |
| 7 | New: it thrusts twice as often. | every 0.25 |
| 8 | Thrusts 1 to 1.5 AD; three at once. | power 1.5, most 3 |
| Evolved | Thorn Garden: A sentinel bursts into petal blades when it fades, 6 AD round it. Partner: Long Lunge at level 4. | bloom 6 |

#### `ce_poise` Poise

Passive, easy, auto. More crits, more Points, and a full bar hits harder.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Crit chance +4%. | crit 0.04 |
| 2 | New: hold one more Point. | most 1 |
| 3 | Crit chance +4% to +8%. | crit 0.08 |
| 4 | New: +15% damage while the Points bar is full. | full 0.15 |
| 5 | Crit chance +8% to +12%. | crit 0.12 |
| 6 | New: hold two more Points. | most 2 |
| 7 | New: a lunge of five Points or more heals 8 HP. | heal 8 |
| 8 | Crit chance +12% to +20%; full bar +40%. | full 0.4, crit 0.2 |
| Evolved | Perfect Poise: A lunge of five Points or more gives 3 Points back. Partner: Long Lunge at level 4. | refund 3 |

#### `ce_grace` Grace

Passive, timed, K. Parries and ripostes heal you, and your block grows firmer.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry heals 4 HP. | parry 4 |
| 2 | New: each riposte link heals 1 HP. | link 1 |
| 3 | Parry heals 4 to 8 HP. | parry 8 |
| 4 | New: a Keen blow gives 2 MP. | mp 2 |
| 5 | New: blocks let 15% less through and cost 6 less stamina. | chip 0.15, cost 6 |
| 6 | Parry heals 8 to 12 HP. | parry 12 |
| 7 | New: a perfect dodge heals 6 HP. | dodge 6 |
| 8 | Parry heals 12 to 20 HP; links heal 3. | parry 20, link 3 |
| Evolved | Rose Grace: A parry also gives 20 MP. Partner: Riposte Chain at level 4. | parryMp 20 |

#### `ce_tempest` Rose Tempest

Ultimate, easy, U. Rose Tempest grows: more thrusts, marks, a streak behind you. Grows with attack damage. Hold U to charge up to four levels, release to strike. Higher levels cost more MP; level 4 spends a full bar.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Rose Tempest deals +40% damage. | power 1.4 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: the storm sets the Rose mark on every foe it strikes. | mark 1 |
| 4 | New: 6 more thrusts in the storm. | thrusts 6 |
| 5 | Power +40% to +120%. | power 2.2 |
| 6 | New: a second streak runs behind you. | behind 0.6 |
| 7 | New: the streak reaches half again as far; the lunge +50%. | reach 1.5, lunge 1.5 |
| 8 | Power +120% to +400%. | power 5 |
| Evolved | Thousand Roses: Where the lunge stops, a ring of thrusts bursts round you. Partner: Measured Touch at level 4. | power 6, finale 6 |

