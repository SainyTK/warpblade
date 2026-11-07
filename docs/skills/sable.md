# Sable's skills

Sable's skills under the skill contract (`docs/skill-design.md`), as built.
The level tables below are generated from the skill data in `src/constants/characters/sable/skills/`, where each file explains its value names; change numbers there.
Damage figures are at her base stats (attack 11, ability 8), with no charms, no Flow, no crit unless the skill grants it, and no hero level growth.
`A` is attack damage, `P` is ability power.

## Base kit

Every button does something from the first second.

| Key | With no skill |
| --- | --- |
| J | The string: three bolts, the third a closing bolt. Tap or hold. |
| K | Kick: front kick, 0.55A, strong push, 0.5 s stun. A landed air kick springs her up and back. |
| L | Hop back with a free bolt at 0.8 (once on the floor, once in the air). From a walk or run toward the facing side, a slide instead. |
| I | Snare at her feet: 20 MP, 3.5 s recharge, two on the floor, 2.6P and a 1.6 s hold. |
| O | Reload; a second O in the bright window is a perfect reload (full quiver, next 4 bolts primed at +35%). Perfect Rhythm builds on it. |
| U | Bolt Storm, the base special, with the shared charge levels. |
| Up | One light jump, also out of a shot. Down and Up drops through a ledge. |

### The string

String length is 3.
A held or tapped J looses bolt, bolt, closing bolt.
The closing bolt deals 1.3A (a normal bolt is 0.95A), pushes twice as far and staggers 0.35 s, so the foe ends the string out at range again.
After the closing bolt the crossbow cocks for 0.18 s before the next string.
A string pressed after she has settled starts again from the first bolt.
The quiver holds 9 bolts (was 8), three full strings.
Firing without a break, her damage on one foe stays where it was: 35.2 per string, 3 strings in 2.7 s plus a 1.05 s reload is 28.2 per second (before, 28.1).

Three fits a ranged hero: a string is a short burst she can fire between dodges, and the closing bolt gives attack skills a "last hit" to build on, the same hook Kael's and Ysra's last blows give theirs.

### Air limit

Two bolts per air time (a jump or a hop), the second a closing bolt.
Landing refills it.
The hop's free bolt does not count.
Featherdraw raises the limit to 3.

### Aim

Up and Down no longer aim while J is held.
The bolt aims itself at the nearest foe ahead within range, anywhere from 60 degrees up to 40 degrees down.
The stance follows the chosen angle (up, level, kneeling low, slanted down in the air), so her existing clips still play.
With no foe in reach she shoots level on the floor and slanted down in the air.
Up while shooting now jumps, which is ordinary movement.

### Perfect dodge

A blow that meets her in the first 0.12 s of a hop or a slide is a perfect dodge through the shared `rewardPerfectDodge()` (Flow, slow motion, MP and stamina, the cue and the `perfectDodge` event).
Before, her guard swallowed the blow with no reward.

### Spell rotation

The snare is the first spell in her I rotation; Net Bolt, Straw Decoy and Powder Keg join it.
O stays the reload, so for Sable the rotation advances on its own: after a cast, I points at the next spell that is ready and affordable.
The K tab of the HUD (and the touch Spell button) shows the selected spell and its recharge.
Every spell is cast with the snare's kneeling clip and goes off on its set frame.

## What leaves today's kit

| Today | Where it goes |
| --- | --- |
| Up and Down aim while J is held | Automatic aim by the target's angle. |
| L with the side ahead held out of a shot's recovery (slide during a string) | Out of a shot L always hops back. The slide stays from a walk or run, outside the string. |
| Open-ended held fire | The three-bolt string with a cock beat; the quiver holds 9. |
| Snare as a learned skill | Base kit. |
| Bolt Storm unlocked at level 6 | Base kit special. |
| Skill tree: Marksman, Skirmish, Trapper, Fusion | Removed. |
| Heavy Draw (+8% attack per rank) | Dropped; Might covers it, Longshot gives the steps. |
| Piercing Bolts | `s_pierce`. |
| Deep Quiver | `s_rhythm` level 4. |
| Ricochet | `s_ricochet` levels 1 and 2. |
| Scattershot | `s_scatter`. |
| Deadeye | `s_deadeye`, the ultimate skill. |
| Fleet Foot | Dropped as stats; Featherdraw's higher jump and Slide Kick's cheaper slide take its place. |
| Hop Volley | `s_hopVolley` level 1. |
| Heavy Boot | `s_heavyBoot` levels 1 and 2. |
| Slide Kick | `s_slideKick` level 1. |
| Perfect Rhythm | `s_rhythm`. |
| Barbed Snare | `s_barbed` level 1. |
| Twin Snare | `s_barbed` levels 3 and 4. |
| Hunter's Focus | `s_rhythm` level 5. |
| Boot and Bolt | `s_heavyBoot` level 3. |
| Tripwire Volley | `s_barbed` level 7. |
| Relic ideas | Seeker Wisp becomes Hunting Hawk, Echo Blade becomes Shade Archer, Thorn Trail becomes Hop Volley's caltrops, Frost Bell's chill becomes Decoy smoke. |

## Rules every skill follows

- Bonuses to one bolt add into one sum: the prime, Piercing Bolts per foe passed, Longshot far, Featherdraw in the air, Ricochet per bounce and Breaching Bolt on the closing bolt (`src/game/hero/sable/bolt/power.ts`).
- Only bolts a perfect reload primed take Perfect Rhythm's bonus; bolts primed by a kick, a slide, a hop or a standing shade take the base +35%.
- Copies and a skill's own bolts (shades, decoys, snare volleys, torn-out bolts) are plain: their own damage and the base back, air and crit rules, no skill bonuses.
- Hits a skill deals on its own carry its id as source, so they show under the skill's name on the end of run screen and call no other skill; hits carried by her presses (bolts, bursts, kicks, the net and keg blasts) count as her attacks or abilities.
- A poison spread or a cloud does not spread again from the same foe within 0.5 s.
- Summons have their own cooldown in their data, so several triggers at once call one summon.

## The 20 skills

Kinds: attack 7, movement 3, spell 3, dot 3, summon 3, ultimate 1.
Risk: easy 6, timed 11, precise 3.

### s_pierce Piercing Bolts (attack, easy, J)

Bolts fly on through foes.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | pierce 1, range 250 | Bolts pass through one foe. |
| 2 | pierce 2 | Bolts pass through one more foe. |
| 3 | perFoe 0.12 | Each foe a bolt passes through makes it 12% stronger. |
| 4 | range 340 | Bolts fly a third farther. |
| 5 | pierce 4 | Bolts pass through two more foes. |
| 6 | closingAll 1 | The closing bolt passes through every foe. |
| 7 | stagger 0.3 | Foes a bolt passes through stagger. |
| 8 | perFoe 0.18 | Each foe passed makes the bolt 18% stronger. |

Evolution Railbolt (with `s_longshot`): every bolt passes through every foe and crosses the whole stage at double speed, +18% for each foe passed.
Built: `pierceOf`, `rangeOf` and `speedOf` in `hero/sable/bolt/power.ts`; the per-foe bonus counts foes passed in `loose.ts`; Railbolt flies at 860 px/s across the stage.

### s_scatter Scattershot (attack, easy, J)

The string fans out.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | sides 2, share 0.5 | The closing bolt fans out with two side bolts. |
| 2 | share 0.6 | Side bolts hit harder. |
| 3 | every 2 | Every bolt fans out. |
| 4 | sides 4 | The closing bolt fans out into five. |
| 5 | share 0.7 | Side bolts hit harder. |
| 6 | bend 1 | Side bolts bend toward foes. |
| 7 | pierce 1 | Side bolts pass through a foe. |
| 8 | every 4, share 0.85 | Every bolt fans out into five, harder. |

Side bolts take nothing from the quiver.
Evolution Hailfall (with `s_featherdraw`): in the air every bolt bursts into 7 slanting down; on the floor every bolt fans into 5.
Built: `fan()` in `hero/sable/shoot.ts`; side bolts bend with `assisted()` in `aim.ts`; Hailfall slants the air fan down.

### s_ricochet Ricochet (attack, timed, J)

Bolts bounce on to the next foe; best near walls and in packs.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chain 1, share 0.7, reach 80 | A bolt that hits bounces to a nearby foe. |
| 2 | wall 1 | Bolts bounce off the floor and the edge. |
| 3 | killOn 1 | A bolt that kills flies on. |
| 4 | chain 2 | Bolts bounce one more time. |
| 5 | share 0.8, stagger 0.25 | Bounced bolts hit harder and stagger. |
| 6 | edgePrime 1 | A bolt off the edge comes back primed. |
| 7 | chain 4, reach 120 | Bolts bounce farther, four times. |
| 8 | perBounce 0.3 | Each bounce makes the bolt 30% stronger. |

Evolution Splinter Storm (with `s_scatter`): each bounce splits the bolt in two, up to 8 bolts from one shot.
Built: `ricochet()` in `hero/sable/bolt/landed.ts` looses a new bolt from the struck foe toward the nearest unstruck one, sharing the family's struck set; floor and edge bounces use `createCrossbowBolt`'s bounces, and its `edge` hook primes the bolt.

### s_breach Breaching Bolt (attack, timed, J)

The closing bolt hits like a ram.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | bonus 0.6, push 1.6 | The closing bolt hits harder and pushes farther. |
| 2 | breaks 1, stun 0.4 | The closing bolt breaks guards and stuns. |
| 3 | radius 30, burst 0.8 | The closing bolt bursts on impact. |
| 4 | bonus 1.5 | The closing bolt hits much harder. |
| 5 | bodies 1 | Foes it throws hurt the foes they hit. |
| 6 | radius 45, burst 1.6 | A bigger, harder burst. |
| 7 | pin 1, pinPower 1.5 | Foes slammed into the edge are pinned. |
| 8 | bonus 7, burst 4 | The closing bolt hits eight times as hard. |

Evolution Siege Bolt (with `s_heavyBoot`): the closing bolt pierces the whole line, bursts on every foe and pins them to the floor 1.2 s; pinned foes take 50% more from her.
Built: `breach()` in `bolt/landed.ts`: `burst()` (`bolt/burst.ts`), a thrown foe (`bolt/flyingFoe.ts`), `e.pinned` near the edge; Siege Bolt pins and marks every foe in the line.

### s_longshot Longshot (attack, timed, J)

Bolts hit harder the farther they fly, so keeping range pays.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | far 120, bonus 0.3, range 250 | Bolts that fly past half range hit 30% harder. |
| 2 | bonus 0.5 | Far hits are stronger. |
| 3 | crit 0.2 | Far hits crit more often. |
| 4 | range 320 | Bolts fly farther. |
| 5 | mark 0.15, markTime 3 | Far hits mark the foe. |
| 6 | bonus 1.2 | Far hits are much stronger. |
| 7 | refund 1 | A far kill puts the bolt back in the quiver. |
| 8 | bonus 2.5, mark 0.3, sweet 1 | Far hits are far stronger, and the end of the flight always crits. |

Evolution Horizon Shot (with `s_ricochet`): range doubles, every far hit crits and splits into two bolts that seek the nearest foes.
Built: the bolt counts the pixels it has flown; `isFar`, `sureCrit` in `bolt/power.ts`; the mark is the shared `markFoe`; Horizon Shot's splits are offshoots that never split again.

### s_rhythm Perfect Rhythm (attack, precise, O)

The perfect reload pays far more.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | bonus 2, primed 5 | Primed bolts hit three times as hard, and one more is primed. |
| 2 | window 0.04 | A wider perfect window. |
| 3 | pierce 2 | Primed bolts pass through two foes. |
| 4 | quiver 3 | The quiver holds 3 more bolts. |
| 5 | stamina 25, mp 10 | A perfect reload restores stamina and MP. |
| 6 | bonus 3.5, primed 8 | Primed bolts hit much harder, and eight are primed. |
| 7 | volley 3 | A perfect reload fires three primed bolts at once. |
| 8 | bonus 6, volley 4, sureCrit 1, haste 0.25, hasteTime 3 | Primed bolts always crit, and a perfect reload quickens your shots. |

Evolution Clockwork Cadence (with `s_breach`): a perfect reload primes the whole quiver, every primed closing bolt bursts (4A in 60 px), and blows do not throw her while primed bolts remain.
Built: `quiver.ts` (`primedBolts`, `reloadWindow`, `quiverSize`) and `perfect()` in `reload.ts` (stamina, MP, volley, haste); Clockwork Cadence's burst in `bolt/landed.ts` and its steadfast in the kit.

### s_heavyBoot Heavy Boot (attack, timed, K)

The kick becomes a weapon and a reload.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.6, stun 1, wide 1 | The kick hits much harder and stuns longer. |
| 2 | wall 1 | Kicked foes bounce off the edge. |
| 3 | load 2 | A kick that lands loads 2 bolts. |
| 4 | bodies 1 | Kicked foes knock down the foes behind them. |
| 5 | power 4, stun 1.4 | The kick hits much harder. |
| 6 | charged 3 | After a kick your next 3 bolts are primed. |
| 7 | wide 1.6, airRefill 1 | A wider kick, and an air kick refills your air shots. |
| 8 | power 13, shock 4, radius 60 | The kick hits far harder and lands with a shockwave. |

Evolution Thunder Heel (with `s_slideKick`): every kick rings a 100 px shockwave at 6A, kicked foes fly into others, and a kick that hits 3 or more foes refills the quiver.
Built: `kick.ts` reads the values; the kick emits Sable's `kick` event with the foes it struck, which Lodged Bolts and Snare Hound answer.

### s_hopVolley Hop Volley (movement, timed, L)

The hop back looses a primed fan.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | bolts 3, cost 22, airHops 1, carry 1 | The hop looses three primed bolts. |
| 2 | cost 16 | The hop costs less stamina. |
| 3 | seek 1 | Hop bolts seek foes. |
| 4 | airHops 2 | Hop once more in the air. |
| 5 | bolts 5 | The hop looses five bolts. |
| 6 | pierce 2 | Hop bolts pass through two foes. |
| 7 | caltrops 1 | Landing from a hop scatters caltrops. |
| 8 | slow 0.3, slowTime 1, carry 1.3 | Hop bolts slow foes, and the hop carries farther. |

Evolution Wheeling Volley (with `s_scatter`): the hop turns her in the air and looses a full ring of 12 primed bolts.
Built: `hopShot()` in `evade.ts`; caltrops in `hero/sable/effects/caltrops.ts` (their hits are the skill's own); the hop emits Sable's `hop` event for Twin Shadows.

### s_slideKick Slide Kick (movement, timed, L)

The slide trips foes into the air and she rises facing them.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, trip 0.9, time 0.3, cost 18 | The slide trips every foe it passes. |
| 2 | launch 160 | Tripped foes fly into the air. |
| 3 | time 0.4, cost 12 | A longer, cheaper slide. |
| 4 | turn 1 | You rise facing the foes you slid under. |
| 5 | power 2.5 | The slide hits harder. |
| 6 | charged 3 | Your next 3 bolts after a slide are primed. |
| 7 | refund 3 | A slide through a crowd refunds itself and loads bolts. |
| 8 | power 6, launch 220 | Tripped foes take much more and fly higher. |

Evolution Tangle Slide (with `s_net`): foes the slide throws hang tangled in a net at the top of their rise for 1.5 s, taking 25% more.
Built: `trip()` and `rise()` in `evade.ts`; the turn to face the foes uses the kit's hand-over; Tangle Slide in `effects/tangle.ts` holds the thrown foe at the top of its rise and marks it.

### s_featherdraw Featherdraw (movement, easy, jump)

She hangs in the air while she shoots. The one skill that raises the air limit.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | airLimit 3, bonus 0.25, rise 1, jumps 1 | Three shots per jump, and air bolts hit harder. |
| 2 | hang 0.15 | Air shots hold you up. |
| 3 | pierce 1 | Air bolts pass through a foe. |
| 4 | rise 1.25 | A higher jump. |
| 5 | bonus 0.6 | Air bolts hit harder. |
| 6 | landing 0.6 | Landing after air shots fires along the floor. |
| 7 | jumps 2 | Jump once more in the air. |
| 8 | bonus 1, split 1 | Air bolts hit twice as hard and split. |

Evolution Skyhunter (with `s_hawk`): hold J in the air to hover up to 1.5 s firing full strings, each bolt a fan of 3, and every air string calls a hawk.
Built: the air limit and closing air bolt in `shoot.ts`, the jump and second jump in `jump.ts`, the landing volley and Skyhunter's hover (gravity at 0.12 while J is held) in `kit.ts`; Skyhunter's hawk answers the `airString` event.

### s_net Net Bolt (spell, timed, I)

A weighted net that pins foes where it lands.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 25, cooldown 5, width 20, power 3, hold 1.5, nets 1 | Shoot a net that pins foes where it lands. |
| 2 | mp 20, cooldown 4 | Cheaper and quicker. |
| 3 | mark 0.25 | Netted foes take 25% more damage. |
| 4 | width 30 | A wider net. |
| 5 | drag 1 | The net drags foes together. |
| 6 | power 7, hold 2.5 | Holds longer and bites harder. |
| 7 | nets 2 | Shoot two nets at once. |
| 8 | power 12, mark 0.6 | Netted foes take 60% more from everything. |

Evolution Pitch Net (with `s_keg`): the net is soaked in pitch; any bolt sets it alight, burning every foe in it and spreading the burn to foes that touch them.
Built: `hero/sable/spells/net.ts`: a spinning bundle that opens on the first foe or where it comes down; Pitch Net lights on a bolt hit through `netHolding()`.

### s_decoy Straw Decoy (spell, easy, I)

A cloaked decoy that draws foes, then bursts.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 30, cooldown 6, life 4, lure 120, burst 2, radius 40, every 0.8, decoys 1 | Set a decoy that lures foes, then bursts. |
| 2 | life 6 | The decoy stands longer. |
| 3 | shoot 0.6 | The decoy shoots back. |
| 4 | burst 3.5, radius 60 | A bigger burst. |
| 5 | stun 0.6 | Foes that reach the decoy are stunned. |
| 6 | mp 20 | Cheaper. |
| 7 | smoke 3 | The burst leaves slowing smoke. |
| 8 | burst 6, decoys 2 | Two decoys, and the burst hits harder. |

Evolution Bait Pit (with `s_barbed`): each decoy stands in a ring of four armed snares, which do not count toward her own snares.
Built: `spells/decoy.ts`. Foes read only the hero's place, so the lure walks lured minions toward the decoy and turns them to it; fliers and big foes are not fooled. Bait Pit sets four snares that do not count toward her snare limit.

### s_keg Powder Keg (spell, timed, I)

Roll a keg ahead, then shoot it as foes reach it. A primed bolt makes it far stronger.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 30, cooldown 6, wait 6, blast 4, radius 30, primedMul 1, kegs 1 | Roll a keg; shoot it to blow it up. |
| 2 | primedMul 1.3 | A primed bolt makes the blast bigger. |
| 3 | launch 180 | The blast throws foes into the air. |
| 4 | blast 6, radius 35 | A bigger blast. |
| 5 | pitch 3 | The blast leaves burning pitch. |
| 6 | kegs 2 | Roll two kegs; one sets off the other. |
| 7 | kick 1 | Kick a keg to send it flying. |
| 8 | blast 8, primedMul 1.6, mpBack 15 | A primed blast hits harder and gives back MP. |

Evolution Powder Effigy (with `s_decoy`): the keg wears a decoy cloak, foes crowd it, and the blast covers twice the area.
Built: `spells/keg.ts`; bolts test kegs along their flight (`kegsOnSegment`), the kick sends them flying (`kickKegs`), blasts set off kegs near them, pitch is the shared `ignite`.

### s_venom Venom Tips (dot, easy, J)

Bolts poison; stacks pile up on one foe.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | rate 0.08, max 4, time 3, closing 1, crit 1 | Bolts poison foes. |
| 2 | max 6, closing 2 | The closing bolt lays two stacks. |
| 3 | creep 1 | Poison creeps to foes nearby. |
| 4 | rate 0.12 | Poison bites harder. |
| 5 | slow 1 | Poisoned foes are slowed. |
| 6 | max 12, time 4, crit 3 | A crit lays three stacks, and poison stacks higher. |
| 7 | rate 0.3 | Poison bites much harder. |
| 8 | rate 0.5, max 15, time 6, passOn 0.5 | Poison runs deep and passes on when a foe falls. |

Evolution Blight (with `s_ricochet`): stacks cap at 30, and a poisoned foe that falls bursts in a 60 px cloud that gives every foe in it all its stacks.
Built: `skills/sable/venom.ts` answers her bolts' `blow` events with `addStacks`; creep, slow, pass on and the Blight cloud in the same file.

### s_barbed Barbed Jaws (dot, timed, I)

Snares tear and bleed, and more of them.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | rate 0.15, time 4, max 1, snares 2, mp 20, cooldown 3.5, moving 1 | Snares leave a bleed. |
| 2 | rate 0.25, time 6 | Bleeds run longer and deeper. |
| 3 | snares 3 | One more snare on the floor. |
| 4 | mp 15, cooldown 1.75 | Snares are cheaper and quicker. |
| 5 | moving 2 | Moving foes bleed twice as fast. |
| 6 | rate 0.6, max 3 | Bleeds stack. |
| 7 | volley 70 | A sprung snare shoots every foe near it. |
| 8 | rate 1.2, time 8, rearm 1 | Snares re-arm once, and bleeds run deep. |

Evolution Bloodtrap (with `s_net`): a sprung snare throws a bramble net 60 px wide; when the net closes every bleeding foe in it takes all its remaining bleed at once.
Built: `spells/snare.ts` lays the bleed, shoots the volley and throws Bloodtrap's bramble (`spells/bramble.ts`); `skills/sable/barbedJaws.ts` adds the moving foe's ticks; the snare effect re-arms itself.

### s_lodged Lodged Bolts (dot, timed, J)

Bolts stay in the foe and fester; a kick tears them out.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | rate 0.1, max 3, closing 1 | Bolts stay lodged and fester. |
| 2 | max 5 | More bolts stay lodged. |
| 3 | tear 0.5 | A kick rips the bolts out. |
| 4 | rate 0.2, max 6 | Lodged bolts fester faster. |
| 5 | slow 2 | Lodged bolts slow the foe. |
| 6 | max 10, closing 2 | The closing bolt lodges two. |
| 7 | rate 0.4, flyOn 1 | Torn-out bolts fly at other foes. |
| 8 | rate 0.9, max 12, tear 1.5 | Lodged bolts fester much faster. |

A bolt that pierces lodges only in the last foe it hits, so this skill pulls against Piercing Bolts.
Evolution Pincushion (with `s_heavyBoot`): up to 20 lodged; a kick tears them out as a burst of seeking bolts at 2A each through every foe around.
Built: `boltStopped()` in `bolt/landed.ts` lays the stacks; `skills/sable/lodgedBolts.ts` draws the shafts, slows, and tears them out on her `kick` event.

### s_hawk Hunting Hawk (summon, easy, auto)

A hawk dives on the foe she hits.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.1, cooldown 2, power 1.2, every 1.2, hawks 1 | A hawk may dive on the foe you hit. |
| 2 | chance 0.18 | The hawk comes more often. |
| 3 | stay 4 | The hawk stays and dives again. |
| 4 | cooldown 1.5, power 2 | The hawk strikes harder. |
| 5 | launch 140 | The hawk throws foes into the air. |
| 6 | hawks 2 | Two hawks hunt at once. |
| 7 | carry 2 | The hawk carries foes up and drops them. |
| 8 | power 2.8, stay 6 | The hawks hunt longer and harder. |

Evolution Shrike Flock (with `s_venom`): four hawks that never leave, each dive adding 3 poison stacks.
Built: `skills/sable/huntingHawk.ts`, its own small flock with a perch over her shoulder; Shrike Flock lays Venom Tips' stacks with Venom's numbers.

### s_hound Snare Hound (summon, timed, auto)

A hound bounds in and drags foes away from her.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.25, cooldown 4, power 2, hold 1, every 1.5, hounds 1 | A hound may bite the foe you kick or snare. |
| 2 | chance 0.4 | The hound comes more often. |
| 3 | stay 5 | The hound stays and hunts. |
| 4 | power 3 | The hound bites harder. |
| 5 | drag 1 | The hound drags its foe away from you. |
| 6 | hounds 2 | Two hounds hunt at once. |
| 7 | howl 0.8 | The hound howls and stuns foes. |
| 8 | power 5, stay 8 | The hounds hunt longer and harder. |

Evolution Bloodhound (with `s_barbed`): three hounds that hunt bleeding foes first; a bite doubles the bleed's stacks.
Built: `skills/sable/snareHound.ts`, answering her `kick` and `snareBite` events; Bloodhound lays one more bleed per bleed the foe carries.

### s_shade Shade Archer (summon, precise, auto)

A shade of Sable stays where the blow missed and shoots.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, cooldown 3, window 0.12, shades 1 | A perfect dodge leaves a shade that shoots. |
| 2 | power 1.3 | The shade's bolts hit harder. |
| 3 | stay 3 | The shade stays and keeps shooting. |
| 4 | power 1.5 | The shade hits harder. |
| 5 | window 0.2 | Perfect dodges are easier. |
| 6 | pierce 2 | The shade's bolts pass through two foes. |
| 7 | prime 1 | While a shade stands your bolts are primed. |
| 8 | power 2, stay 6 | The shade stays longer and hits harder. |

Evolution Twin Shadows (with `s_hopVolley`): two shades, each copying her hop volley at its base damage; while one stands blows do not throw her, and a perfect dodge refills the quiver.
Built: `skills/sable/shadeArcher.ts` draws her shooting pose once with `drawHero` into `ghostCanvas` and blits it tinted; its bolts are plain; Twin Shadows answers the `hop` event.

### s_deadeye Deadeye (ultimate, precise, U)

Replaces Bolt Storm with one heavy bolt through a line.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.2, cooldown 20, perfect 1 | Bolt Storm becomes Deadeye: one heavy bolt through a line. |
| 2 | cooldown 16 | Deadeye is ready sooner. |
| 3 | mark 0.3, markTime 4 | Deadeye marks the foes it strikes. |
| 4 | power 1.6 | Deadeye hits harder. |
| 5 | split 1 | A kill splits the bolt toward fliers and the floor. |
| 6 | perfect 2 | A perfect reload just before Deadeye doubles it. |
| 7 | pin 1.5 | Deadeye pins the foes it strikes. |
| 8 | power 4, refund 2.5, refundCap 8 | Deadeye hits far harder, and kills bring it back sooner. |

Evolution Heartseeker (with `s_rhythm`): every charge level fires both ways and sends a seeking bolt at every foe on screen; a perfect reload just before triples it.
Built: `src/game/ultimates/deadeye.ts` reads the skill's values: power, cooldown, mark, pin, split, the perfect reload window and the kill refund.

## Evolutions

| Skill | Partner | Evolution |
| --- | --- | --- |
| `s_pierce` | `s_longshot` | Railbolt |
| `s_scatter` | `s_featherdraw` | Hailfall |
| `s_ricochet` | `s_scatter` | Splinter Storm |
| `s_breach` | `s_heavyBoot` | Siege Bolt |
| `s_longshot` | `s_ricochet` | Horizon Shot |
| `s_rhythm` | `s_breach` | Clockwork Cadence |
| `s_heavyBoot` | `s_slideKick` | Thunder Heel |
| `s_hopVolley` | `s_scatter` | Wheeling Volley |
| `s_slideKick` | `s_net` | Tangle Slide |
| `s_featherdraw` | `s_hawk` | Skyhunter |
| `s_net` | `s_keg` | Pitch Net |
| `s_decoy` | `s_barbed` | Bait Pit |
| `s_keg` | `s_decoy` | Powder Effigy |
| `s_venom` | `s_ricochet` | Blight |
| `s_barbed` | `s_net` | Bloodtrap |
| `s_lodged` | `s_heavyBoot` | Pincushion |
| `s_hawk` | `s_venom` | Shrike Flock |
| `s_hound` | `s_barbed` | Bloodhound |
| `s_shade` | `s_hopVolley` | Twin Shadows |
| `s_deadeye` | `s_rhythm` | Heartseeker |

## Balance

Added damage per second over the base kit (28 on one foe), on one foe and on a crowd of 6.
Sable's level 8 budget on the intended target, from the contract's ratios: easy about 45 one / 110 crowd, timed about 72 / 175, precise about 115 to 135 / 275 to 330.
Spells and the ultimate share about one 20 MP cast every 8 s, so each spell's figure assumes it gets that MP.

| Skill | Risk | Target | L1 one / crowd | L8 one / crowd | Evolved one / crowd | Budget | Assumption |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Piercing Bolts | easy | crowd | 0 / 17 | 0 / 125 | 0 / 260 | ok | 1.6 foes per bolt at L1, 4.5 at L8 |
| Scattershot | easy | crowd | 2 / 10 | 16 / 80 | 30 / 220 | a bit under | 75% of side bolts find a foe |
| Ricochet | timed | crowd | 0 / 16 | 8 / 165 | 15 / 340 | ok | 80% of bounces find a foe |
| Breaching Bolt | timed | one | 7 / 9 | 65 / 110 | 140 / 260 | ok | 0.8 closing bolts a second |
| Longshot | timed | one at range | 6 / 6 | 60 / 70 | 130 / 220 | ok with the mark | 70% of bolts fly past half range |
| Perfect Rhythm | precise | one | 9 / 9 | 114 / 150 | 280 / 400 | ok | perfect on 80% of quivers |
| Heavy Boot | timed | one that closes in | 5 / 8 | 70 / 110 | 110 / 240 | ok | 0.4 kicks a second, 0.6 at L8 |
| Hop Volley | timed | crowd | 5 / 14 | 55 / 140 | 120 / 300 | 20% under | 0.4 hops a second, 0.5 at L8 |
| Slide Kick | timed | crowd | 2 / 10 | 50 / 120 | 100 / 260 | 30% under | 0.3 slides a second, 3 foes per slide |
| Featherdraw | easy | crowd | 6 / 8 | 40 / 100 | 80 / 220 | ok | 30% of time in the air |
| Net Bolt | timed | crowd | 1 / 7 | 15 / 60, plus 19% on everything | 30 / 200 | ok at a mid build | 2 nets cover 5 foes; 30% uptime |
| Straw Decoy | easy | crowd | 3 / 8 | 40 / 125 | 50 / 200 | ok | one cast per 8 s at 20 MP |
| Powder Keg | precise | crowd | 4 / 21 | 70 / 285 | 100 / 520 | ok | shot primed, 4 foes per blast, MP refund |
| Venom Tips | easy dot | one | 3.5 / 3.5 | 66 / 150 | 120 / 350 | dot rule ok | stacks held at the cap |
| Barbed Jaws | timed dot | crowd | 1 / 2 | 67 / 180 | 120 / 380 | dot rule ok | a bite every 4 s with re-arm |
| Lodged Bolts | timed dot | one | 3 / 3 | 85 / 110 | 170 / 300 | dot rule ok | lodged count held at the cap, a kick every 3 s |
| Hunting Hawk | easy summon | one | 3 / 3 | 45 / 55 | 95 / 150 | ok | two hawks up 70% of the time |
| Snare Hound | timed summon | one | 3 / 4 | 65 / 90 | 120 / 220 | ok | hounds up 80% of the time |
| Shade Archer | precise summon | one | 4 / 4 | 115 / 280 | 260 / 550 | ok | a perfect dodge every 6 s once the window widens |
| Deadeye | precise ultimate | line | 1 / 5 | 38 / 190 | 90 / 400 | under (see contract points) | charge level 3, a cast every 10 s |

Damage over time check, against attack skills of the same level:

| Level | Venom (one) | Barbed (crowd) | Lodged (one) | Attack skills at that level |
| --- | --- | --- | --- | --- |
| 1 | 3.5 | 2 | 3 | 6 to 17 |
| 4 | 8 | 20 | 13 | 25 to 60 |
| 7 | 40 | 120 | 45 | 40 to 140 |
| 8 | 66 | 180 | 85 | 45 to 165 |

They stay under at 1 to 4 and pass the attack skills at 7 and 8.

Level 8 over level 1 runs about 7 to 12 for attack, movement and spell skills, and 15 to 25 for dots and summons.

## Example builds

Volley, easy and timed, kills crowds from range.
`s_pierce`, `s_longshot`, `s_ricochet`, `s_scatter`, `s_featherdraw`, `s_hawk`, `s_venom`, `s_breach`.
Evolves Railbolt, Hailfall and Blight; Shrike Flock and Horizon Shot are the tempting fourth.

Trapline, slow start, huge late game, MP-hungry.
`s_barbed`, `s_net`, `s_keg`, `s_decoy`, `s_hound`, `s_lodged`, `s_heavyBoot`, `s_rhythm` (for MP from perfect reloads).
Evolves Bloodtrap, Powder Effigy and Pincushion; Bloodhound and Pitch Net compete for the same partners.

Cadence, precise, one foe at a time with huge spikes.
`s_rhythm`, `s_breach`, `s_shade`, `s_hopVolley`, `s_deadeye`, `s_heavyBoot`, `s_slideKick`, `s_scatter`.
Evolves Clockwork Cadence, Twin Shadows and Heartseeker; Siege Bolt and Thunder Heel are ready too, so skips and banishes decide.

## Contract points

- O is Sable's reload, so her I rotation cannot switch on O. Proposed: her rotation advances on its own to the next ready spell after each cast.
- Heavy Boot and Perfect Rhythm change K and O, which are her attack buttons; the contract's `attack` kind speaks only of J. Proposed: `attack` covers the hero's own attack presses.
- The shared perfect dodge only fires in Kael's `dash` state; the perfect dodge event needs a kit-reported form for the hop and slide.
- The 6 to 10 times rule fights the dot rule: a dot below attack skills at level 1 and above them at level 8 lands at 15 to 25 times. Summons whose levels raise chance, count and stay together land there too. Proposed: about 6 to 12, dots and summons up to 25.
- An ultimate on a 16 to 20 s cooldown, sharing MP with spells, cannot reach a per-second budget. Proposed: budget ultimate skills per cast against the base special (level 8 about 6 times the base special, evolved about 15 times).
- Movement skills land 20 to 30% under the timed line on raw damage because their uses are limited by stamina and space. Proposed: accept movement at about 0.8 of its risk's budget.
- A shared stacking status (poison, bleed, lodged count) and a shared mark (damage taken up) would serve every hero; Sable needs both.
