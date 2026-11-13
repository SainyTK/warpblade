# Sable's skills

Sable's skills under the skill contract (`docs/skill-design.md`), as built.
The level tables below are generated from the skill data in `src/constants/characters/sable/skills/`, where each file explains its value names; change numbers there.
Damage figures are at her base stats (attack 11, ability 8), with no charms, no Flow, no crit unless the skill grants it, and no hero level growth.
`A` is attack damage, `P` is ability power.

## Base kit

Every button does something from the first second, on the moveset every hero shares (`docs/moveset-design.md`).

| Key | With no skill |
| --- | --- |
| J tapped | The string: three bolts, one per tap, the third a closing bolt. An empty quiver reloads. While reloading, a tap in the bright window is a perfect reload (full quiver, next 4 bolts primed at +35%); Perfect Rhythm builds on it. Down and J on the floor reload by hand. |
| J held | Grapple warp: a grapple bolt away from the nearest foe, a zip, and a heavy bolt back through the line at the warp's power (10 MP). The zip loads a bolt. |
| K | Stock guard: 40% chip, 14 stamina a block. Parry, Point-Blank: a kick of 1.6A with a long throw and a 0.8 s stun, and the quiver full with 4 bolts primed. |
| L | The shared front dodge. |
| I | Abilities: the hop back with a free bolt of 0.76A (free, 2 s recharge; held, a slide forward under blows), then the snare at her feet (20 MP, 3.5 s recharge, two on the floor, 6P and a 1.6 s hold; held, tossed under the foe ahead for 30 MP) and her spell skills. |
| O | Switch ability. |
| U | Bolt Storm, her one ultimate, with the shared charge levels. |
| Up | One light jump, also out of a shot. Down and Up drops through a ledge. |

### The string

String length is 3.
Each J tap looses the next of bolt, bolt, closing bolt, each with a full draw; a tap during a bolt plays the next one where it ends, and a tap within 0.4 s of a bolt's end goes on with the string.
A normal bolt deals 1.11A and staggers 0.36 s (first) or 0.4 s (second).
The closing bolt deals 2.1A, passes through one foe, pushes twice as far as a bolt and staggers 0.62 s, so the foe is still held when the next string's first bolt lands.
After the closing bolt the crossbow cocks for 6 frames (0.2 s) before the next string.
A tap after that starts again from the first bolt.
The quiver holds 9 bolts, three full strings.
Tapping without a break, her damage on one foe holds: 47.5 per string, 3 strings in 2.7 s plus a 1.05 s reload is 38.0 per second.

Three fits a ranged hero: a string is a short burst she can fire between dodges, and the closing bolt gives attack skills a "last hit" to build on, the same hook Kael's and Ysra's last blows give theirs.

### Air limit

Two bolts per air time (a jump or a hop), the second a closing bolt.
Landing refills it.
The hop's free bolt does not count.
Featherdraw raises the limit to 3.

### Aim

Up and Down no longer aim while J is held.
The bolt aims itself at the nearest foe ahead within range, anywhere from 60 degrees up to 40 degrees down.
The stance follows the chosen angle (up, level, kneeling low, slanted down in the air), and each plays the same three-beat string.
The aim never turns her: it only tilts the shot at a foe ahead of where she faces.
With no foe in reach she shoots level on the floor and slanted down in the air.
Up while shooting now jumps, which is ordinary movement.

### Perfect dodge

A blow that meets her in the first 0.12 s of a hop or a slide is a perfect dodge through the shared `rewardPerfectDodge()` (Flow, slow motion, MP and stamina, the cue and the `perfectDodge` event), and so is one in the first moments of the shared dodge on L.

### Abilities on I

The hop is the first ability on I, free and on its own recharge; the snare is the second; Net Bolt, Straw Decoy and Powder Keg join them.
Each has its own recharge and none waits on another.
I on one that is recharging casts the next ready one; O switches by hand.
The hop goes from the floor or the air; spells are cast kneeling, on the floor only.
The HUD's ability tabs and the touch I button show the selected ability and its recharge.
Wide forms (I held): the hop slides forward, the snare is tossed under the foe ahead, Net Bolt throws two more nets in a wider fan; the decoy and the keg have none.

## The shared moveset (13 November 2026)

| Before | Now |
| --- | --- |
| J held kept shooting | J held is the grapple warp; each tap looses one bolt. |
| K kick | Point-Blank, the parry's kick, refills the quiver. Heavy Boot rebound to it. |
| L hop back, slide from a walk ahead | The hop is an ability on I with its own recharge; the slide is its wide form. Hop Volley and Slide Kick moved to I. L is the shared dodge. |
| O reload, a second O for a perfect reload | Down and J reload by hand; J in the bright window is the perfect reload. Perfect Rhythm moved to J. O switches ability. |
| Spells turned on their own after each cast | The shared ability bar picks the next ready one. |
| Deadeye replaced Bolt Storm | Deadeye is gone; Bolt Storm, the skill, upgrades her one ultimate and takes Deadeye's mark, pin, perfect reload bonus and kill refund. |
| Shade Archer's wider perfect dodge window | A parry also leaves a shade. |
| Lodged Bolts and Snare Hound answered the kick | They answer Point-Blank's kick and the warp's heavy bolt. |
| Powder Keg's kicked keg | The slide or Point-Blank's kick sends a keg flying. |

## What left the first kit

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
| Deadeye | `s_deadeye`, later cut; its ideas live on in Bolt Storm (`s_storm`). |
| Fleet Foot | Dropped as stats; Featherdraw's higher jump and Slide Kick's longer slide take its place. |
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
- Only bolts a perfect reload primed take Perfect Rhythm's bonus; bolts primed by Point-Blank, a slide, a hop or a standing shade take the base +35%.
- Copies and a skill's own bolts (shades, decoys, snare volleys, torn-out bolts) are plain: their own damage and the base back, air and crit rules, no skill bonuses.
- Hits a skill deals on its own carry its id as source, so they show under the skill's name on the end of run screen and call no other skill; hits carried by her presses (bolts, bursts, kicks, the net and keg blasts) count as her attacks or abilities.
- A poison spread or a cloud does not spread again from the same foe within 0.5 s.
- Summons have their own cooldown in their data, so several triggers at once call one summon.

## The 20 skills

Kinds: attack 7, movement 3, spell 3, dot 3, summon 3, ultimate 1.
Risk: easy 6, timed 10, precise 4.

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
| 8 | every 4 | Every bolt fans out into five. |

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

Bolts and the warp's heavy bolt hit harder the farther they fly or zip, so keeping range pays.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | far 120, bonus 0.3, range 250, perPx 0.018, cap 2.8, charges 1, strike 1.8 | Bolts past half range, and long warp zips, hit harder. |
| 2 | bonus 0.5 | Far hits are stronger. |
| 3 | crit 0.2 | Far hits crit more often. |
| 4 | range 320, cap 3.6 | Bolts fly farther, and long zips hit harder. |
| 5 | mark 0.15, markTime 3 | Far hits mark the foe. |
| 6 | bonus 1.2 | Far hits are much stronger. |
| 7 | refund 1, charges 2 | A far kill puts the bolt back, and you hold two warps. |
| 8 | bonus 8, mark 0.3, sweet 1, strike 2.4 | Far hits and the heavy bolt are far stronger; the end of the flight crits. |

Evolution Horizon Shot (with `s_ricochet`): bolts fly twice as far, every far hit crits and splits into two bolts that seek other foes, and long zips hit harder still. (crit 1, range 640, split 2, perPx 0.022, cap 4.4)
Built: the bolt counts the pixels it has flown; `isFar`, `sureCrit` in `bolt/power.ts`; the mark is the shared `markFoe`; Horizon Shot's splits are offshoots that never split again.
The warp reads `perPx`, `cap`, `charges` and `strike` through `SABLE_WARP.tune` (`hero/sable/warpStyle.ts`).
### s_rhythm Perfect Rhythm (attack, precise, J)

The perfect reload pays far more.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | bonus 2, primed 5 | Primed bolts hit three times as hard, and one more is primed. |
| 2 | window 0.04 | A wider perfect window. |
| 3 | pierce 1 | Primed bolts pass through a foe. |
| 4 | quiver 3 | The quiver holds 3 more bolts. |
| 5 | stamina 25, mp 10 | A perfect reload restores stamina and MP. |
| 6 | bonus 3.5, primed 8 | Primed bolts hit much harder, and eight are primed. |
| 7 | volley 3 | A perfect reload fires three primed bolts at once. |
| 8 | bonus 9, volley 4, sureCrit 1, haste 0.25, hasteTime 3 | Primed bolts always crit, and a perfect reload quickens your shots. |

Evolution Clockwork Cadence (with `s_breach`): a perfect reload primes the whole quiver, every primed closing bolt bursts (4A in 60 px), and blows do not throw her while primed bolts remain.
Built: `quiver.ts` (`primedBolts`, `reloadWindow`, `quiverSize`) and `perfect()` in `reload.ts` (stamina, MP, volley, haste); Clockwork Cadence's burst in `bolt/landed.ts` and its steadfast in the kit.

### s_heavyBoot Heavy Boot (attack, precise, K)

Point-Blank, the parry's kick, hits like a ram, and the guard bashes back.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 8, stun 1, chip 1, wide 1 | Point-Blank kicks far harder and stuns longer. |
| 2 | wall 1 | Kicked foes bounce off the edge. |
| 3 | bash 0.8 | A block bashes the foe back with the stock. |
| 4 | power 14, bodies 1 | Kicked foes knock down others, and the kick hits harder. |
| 5 | power 20, chip 0.5 | Blocks let half as much through; the kick hits harder. |
| 6 | power 26, wide 1.6 | A wider kick that hits harder. |
| 7 | power 32, shock 5, radius 60 | Point-Blank hits harder and lands with a shockwave. |
| 8 | power 60, bash 2 | Point-Blank hits far harder, and so does the bash. |

Evolution Thunder Heel (with `s_slideKick`): point-Blank rings a wide shockwave and hits harder still, and every block bashes hard. (power 140, bash 4, shock 15, radius 100)
Heavy Boot is precise: its power lands on the nearest foe the boot reaches, and every other foe takes Point-Blank's own 1.6A.
Built: `hero/sable/guardStyle.ts` reads the values; the kick emits Sable's `kick` event with the foes it struck, which Lodged Bolts and Snare Hound answer; the chip share scales the guard's.
### s_hopVolley Hop Volley (movement, timed, I)

The hop back looses a primed fan.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | bolts 3, recharge 2, charges 1, carry 1 | The hop looses three primed bolts. |
| 2 | recharge 1.4 | The hop comes back sooner. |
| 3 | seek 1 | Hop bolts seek foes. |
| 4 | charges 2 | Hold two hops ready. |
| 5 | bolts 5 | The hop looses five bolts. |
| 6 | pierce 1 | Hop bolts pass through a foe. |
| 7 | caltrops 1 | Landing from a hop scatters caltrops. |
| 8 | slow 0.3, slowTime 1, carry 1.3 | Hop bolts slow foes, and the hop carries farther. |

Evolution Wheeling Volley (with `s_scatter`): the hop turns her in the air and looses a full ring of twelve primed bolts. (bolts 12, seek 0, ring 1)
Built: `castHop()`, `tickHop()` and `hopShot()` in `hero/sable/evade.ts`; caltrops in `hero/sable/effects/caltrops.ts` (their hits are the skill's own); the hop emits Sable's `hop` event for Twin Shadows.
### s_slideKick Slide Kick (movement, timed, I)

The slide trips foes into the air and she rises facing them.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, trip 0.9, time 0.3 | The slide trips every foe it passes. |
| 2 | launch 160 | Tripped foes fly into the air. |
| 3 | time 0.4 | A longer slide. |
| 4 | turn 1 | You rise facing the foes you slid under. |
| 5 | power 2.5 | The slide hits harder. |
| 6 | charged 3 | Your next 3 bolts after a slide are primed. |
| 7 | refund 3 | A slide through a crowd gives the hop back and loads bolts. |
| 8 | power 3.5, launch 220 | Tripped foes take much more and fly higher. |

Evolution Tangle Slide (with `s_net`): foes the slide throws hang tangled in a net in the air, taking 25% more. (tangle 1.5)
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

Evolution Skyhunter (with `s_hawk`): shooting in the air hovers her up to 1.5 s firing full strings, each bolt a fan of 3, and every air string calls a hawk.
Built: the air limit and closing air bolt in `shoot.ts`, the jump and second jump in `jump.ts`, the landing volley and Skyhunter's hover (gravity at 0.05 while she shoots in the air) in `kit.ts`; Skyhunter's hawk answers the `airString` event.

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
| 7 | kick 1 | Slide into or kick a keg to send it flying. |
| 8 | blast 20, primedMul 1.6, mpBack 15 | A far bigger blast; a primed one gives back MP. |

Evolution Powder Effigy (with `s_decoy`): the keg wears a decoy cloak, foes crowd it, and the blast covers twice the area (blast 12).
Built: `spells/keg.ts`; bolts test kegs along their flight (`kegsOnSegment`), the slide and Point-Blank's kick send them flying (`kickKegs`), blasts set off kegs near them, pitch is the shared `ignite`.

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

Bolts stay in the foe and fester; Point-Blank's kick or the warp's heavy bolt tears them out.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | rate 0.1, max 3, closing 1 | Bolts stay lodged and fester. |
| 2 | max 5 | More bolts stay lodged. |
| 3 | tear 0.5 | A parry kick or a warp's heavy bolt rips them out. |
| 4 | rate 0.2, max 6 | Lodged bolts fester faster. |
| 5 | slow 2 | Lodged bolts slow the foe. |
| 6 | max 10, closing 2 | The closing bolt lodges two. |
| 7 | rate 0.4, flyOn 1 | Torn-out bolts fly at other foes. |
| 8 | rate 0.9, max 12, tear 1.5 | Lodged bolts fester much faster. |

A bolt that pierces lodges only in the last foe it hits, so this skill pulls against Piercing Bolts.
Evolution Pincushion (with `s_heavyBoot`): up to 20 lodged; a parry kick or a heavy bolt tears them out as a burst of seeking bolts at 2A each through every foe around.
Built: `boltStopped()` in `bolt/landed.ts` lays the stacks; `skills/sable/lodgedBolts.ts` draws the shafts, slows, and tears them out on her `kick` and `warpBolt` events.

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
| 8 | power 1.6, stay 6 | The hawks hunt longer. |

Evolution Shrike Flock (with `s_venom`): four hawks that never leave, each dive adding 3 poison stacks.
Built: `skills/sable/huntingHawk.ts`, its own small flock with a perch over her shoulder; Shrike Flock lays Venom Tips' stacks with Venom's numbers.

### s_hound Snare Hound (summon, timed, auto)

A hound bounds in and drags foes away from her.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.25, cooldown 4, power 2, hold 1, every 1.5, hounds 1 | A hound may bite a foe you snare, kick or warp-shoot. |
| 2 | chance 0.4 | The hound comes more often. |
| 3 | stay 5 | The hound stays and hunts. |
| 4 | power 3 | The hound bites harder. |
| 5 | drag 1 | The hound drags its foe away from you. |
| 6 | hounds 2 | Two hounds hunt at once. |
| 7 | howl 0.8 | The hound howls and stuns foes. |
| 8 | power 5, stay 8 | The hounds hunt longer and harder. |

Evolution Bloodhound (with `s_barbed`): three hounds that hunt bleeding foes first; a bite doubles the bleed's stacks.
Built: `skills/sable/snareHound.ts`, answering her `kick`, `warpBolt` and `snareBite` events; Bloodhound lays one more bleed per bleed the foe carries.

### s_shade Shade Archer (summon, precise, auto)

A shade of Sable stays where the blow missed her and shoots.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, cooldown 3, shades 1 | A perfect dodge leaves a shade that shoots. |
| 2 | power 1.3 | The shade's bolts hit harder. |
| 3 | stay 3 | The shade stays and keeps shooting. |
| 4 | power 1.5 | The shade hits harder. |
| 5 | parry 1 | A parry also leaves a shade. |
| 6 | pierce 2 | The shade's bolts pass through two foes. |
| 7 | power 3, prime 1 | While a shade stands your bolts are primed. |
| 8 | power 8, stay 6 | The shade stays longer and hits far harder. |

Evolution Twin Shadows (with `s_hopVolley`): two shades that copy her hop volley; while one stands blows do not throw her, and a perfect dodge refills the quiver. (shades 2, copyHop 1, steadfast 1, refill 1)
Built: `skills/sable/shadeArcher.ts` draws her shooting pose once with `drawHero` into `ghostCanvas` and blits it tinted; its bolts are plain; it answers the `perfectDodge` and `parry` events, and Twin Shadows the `hop` event.
### s_storm Bolt Storm (ultimate, precise, U)

Bolt Storm rains harder and longer, and strikes each foe more than once.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.2, cooldown 20, hits 1, perfect 1 | Bolt Storm hits harder. |
| 2 | mark 0.3, markTime 4 | The storm marks the foes it strikes. |
| 3 | hits 2 | Each foe is struck twice. |
| 4 | power 1.5, cooldown 15 | Harder, and back sooner. |
| 5 | pin 1.2 | The storm pins foes to the floor. |
| 6 | perfect 2 | A perfect reload or a parry just before doubles it. |
| 7 | refund 2, refundCap 8 | Kills bring it back sooner. |
| 8 | power 2, hits 3 | Each foe is struck three times, much harder. |

Level 8 is about 6 times the plain storm on one foe (power 2, struck three times), 12 times after a perfect reload or a parry.
Evolution Heartseeker (with `s_rhythm`): every bolt of the storm seeks a foe, each foe can be struck five times, and a perfect reload or a parry just before doubles it. (power 2.5, cooldown 12, hits 5, seek 1)
Built: `src/game/ultimates/boltStorm.ts` reads the skill through `ultimateValues()`: power, hits, mark, pin, the perfect reload or parry window (`sable.sincePerfect`), the kill refund and Heartseeker's seeking open-floor bolts; the shared ultimate reads its cooldown.

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
| `s_storm` | `s_rhythm` | Heartseeker |

## Balance

Figures follow the shared play model of the balance review (7 November 2026): bolts landed 0.98 a second, closing bolts 0.33, hop 0.35, slide 0.2, a quarter of the time in the air, about 0.1 casts a second for each spell, a perfect reload 0.077 a second and a perfect dodge 0.14.
On the shared moveset Heavy Boot is measured at a parry every 6.7 s, the model's parry rate, and Bolt Storm per cast.
Each figure is the damage per second a skill adds on its intended target, in multiples of her attack (A) or ability power (P).
Bands at level 8: easy 3.8 A, timed 6.1 A, precise 9.5 to 11.5 A; movement 0.8 of those; spells 5.3, 8.4 and 13 to 16 P; dots 1.1 to 1.4 times the attack band of their risk.
Level 1 is level 8 divided by 6 to 12, dots and summons by up to 25; evolutions about 2 times (easy), 2.2 times (timed) or 3 times (precise).

| Skill | Risk, target | L1 | L8 | Evolved | Band |
| --- | --- | --- | --- | --- | --- |
| Piercing Bolts | easy, crowd | 0.6 | 4.2 | 9 | 3.8 |
| Scattershot | easy, crowd | 0.4 | 3.6 | 8 | 3.8 |
| Ricochet | timed, crowd | 0.6 | 6.2 | 12.7 | 6.1 |
| Breaching Bolt | timed, one | 0.5 | 4.6 (7.5 on a crowd) | 11 | 6.1 |
| Longshot | timed, one at range | 0.3 | 5 with the mark | 10 | 6.1 |
| Perfect Rhythm | precise, one | 1 | 10.7 | 25 | 9.5 to 11.5 |
| Heavy Boot | precise, one that strikes her | 1.2 (8A a parry every 6.7 s) | 9.3 (60A a parry, and a 2A bash on blocks) | 21 and a 15A shockwave on a crowd | 9.5 to 11.5 |
| Hop Volley | timed movement, crowd | 0.5 | 3.9 | 9 | 4.9 |
| Slide Kick | timed movement, crowd | 0.35 | 4.2 | 8.6 | 4.9 |
| Featherdraw | easy movement, crowd | 0.3 | 3.7 | 8 | 3.1 |
| Net Bolt | timed spell, crowd | 0.5 P | 6 P and +60% taken | 14 P | 8.4 P |
| Straw Decoy | easy spell, crowd | 0.8 P | 6.5 P | 9 P | 5.3 P |
| Powder Keg | timed spell, crowd | 1.2 P | 10 P | 20 P | 8.4 P |
| Venom Tips | easy dot, one | 0.2 | 5.5 | 11 | 4.2 to 5.3 |
| Barbed Jaws | timed dot, crowd | 0.15 P | 11 P | 24 P | 9.2 to 11.8 P |
| Lodged Bolts | timed dot, one | 0.1 | 7.5 | 15 | 6.7 to 8.5 |
| Hunting Hawk | easy summon, one | 0.15 | 4.2 | 9 | 3.8 |
| Snare Hound | timed summon, one | 0.2 | 5 | 11 | 6.1 |
| Shade Archer | precise summon, one | 0.4 | 9 (pierce 2 on a crowd: 20) | 24 | 9.5 to 11.5 |
| Bolt Storm | precise ultimate, per cast | 1.2 times the plain storm | 6 times (power 2, three strikes a foe; 12 after a perfect reload or a parry) | 12.5 times (power 2.5, five strikes, seeking bolts; 25 pulled off) | 6 and 15 times |

Damage over time against attack skills of the same level, on their intended target: Venom Tips 0.2, 0.9, 3.5 and 5.5 A at levels 1, 4, 7 and 8; Lodged Bolts 0.1, 1.3, 3.5 and 7.5 A; Barbed Jaws 0.15, 0.6, 4.5 and 11 P.
They stay under the attack skills at 1 to 4 and pass them at 7 and 8.

### Checked in play

Each skill was played in headless Chromium at levels 1, 4 and 8 and evolved, from wave 4 with hero level 1, for 10 s each, with a driver that shoots, kicks, slides, hops at foes winding up, casts and charges the ultimate; stills and logs are kept out of the repository.
Skills that deal their own hits show under their own name on the end of run screen and grew level by level, for example over 10 s: Hunting Hawk 45, 63, 900 and 1487; Venom Tips 47, 50, 576 and 1113; Straw Decoy 18, 185, 211 and 226; Shade Archer 780 at level 8 over 14 timed hops.
Skills carried by her presses raised her attacks or abilities over the base run's 375 attacks: Breaching Bolt 383, 1506, 3046 and 2658; Scattershot 1076, 1537 and 1542; Perfect Rhythm 1928 at level 8 and 3096 evolved; Net Bolt 140 abilities at level 1 and 843 at level 8.
The mash bot still falls on wave 5 (18 kills, 14 before); the skilled bot falls on wave 5 too (14 kills, 17 before, with a different set of cards).

## Example builds

Volley, easy and timed, kills crowds from range.
`s_pierce`, `s_longshot`, `s_ricochet`, `s_scatter`, `s_featherdraw`, `s_hawk`, `s_venom`, `s_breach`.
Evolves Railbolt, Hailfall and Blight; Shrike Flock and Horizon Shot are the tempting fourth.

Trapline, slow start, huge late game, MP-hungry.
`s_barbed`, `s_net`, `s_keg`, `s_decoy`, `s_hound`, `s_lodged`, `s_heavyBoot`, `s_rhythm` (for MP from perfect reloads).
Evolves Bloodtrap, Powder Effigy and Pincushion; Bloodhound and Pitch Net compete for the same partners.

Cadence, precise, one foe at a time with huge spikes.
`s_rhythm`, `s_breach`, `s_shade`, `s_hopVolley`, `s_storm`, `s_heavyBoot`, `s_slideKick`, `s_scatter`.
Evolves Clockwork Cadence, Twin Shadows and Heartseeker; Siege Bolt and Thunder Heel are ready too, so skips and banishes decide.

## Contract points

All seven points of the design were accepted into `docs/skill-design.md`.
The framework has since met both remaining ones:

- `markFoe` takes a source, and marks of different sources add under the +100% cap (rule G3). Sable's marks (Longshot, Net Bolt, Siege Bolt, Tangle Slide, Bolt Storm) each mark under their own skill id.
- `SkillButton` gained `O`, for Perfect Rhythm; on the shared moveset Perfect Rhythm is on J again.
