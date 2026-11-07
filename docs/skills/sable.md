# Sable's skills

Working design for Sable under the skill contract (`docs/skill-design.md`).
Numbers are starting values; balance moves them in the constants files.
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
| O | Reload; a second O in the bright window is a perfect reload (full quiver, next 4 bolts primed at +35%). |
| U | Bolt Storm, the base special, with the shared charge levels. |
| Up | One light jump. Down and Up drops through a ledge. |

### The string

String length is 3.
A held or tapped J looses bolt, bolt, closing bolt.
The closing bolt deals 1.3A (a normal bolt is 0.95A), pushes twice as far and staggers 0.35 s, so the foe ends the string out at range again.
After the closing bolt the crossbow cocks for 0.18 s before the next string.
The quiver holds 9 bolts (was 8), three full strings.
Her damage per second on one foe stays where it is today: 35.2 per string, 3 strings in 2.7 s plus a 1.05 s reload is 28.2 per second (today 28.1).
A perfect reload on every quiver lifts that to about 37.

Three fits a ranged hero: a string is a short burst she can fire between dodges, and the closing bolt gives attack skills a "last hit" to build on, the same hook Kael's and Ysra's last blows give theirs.

### Air limit

Two bolts per air time (a jump or a hop), the second a closing bolt.
Landing refills it.
The hop's free bolt does not count.
Featherdraw raises the limit to 3.

### Aim

Up and Down no longer aim while J is held.
The bolt aims itself at the foe the assist picks: the nearest foe ahead within range, anywhere from 60 degrees up to 40 degrees down.
The stance follows the chosen angle (up, level, kneeling low, slanted down in the air), so her existing clips still play.
With no foe in reach she shoots level on the floor and slanted down in the air.
Up while shooting now jumps, which is ordinary movement.

### Perfect dodge

A blow that meets her in the first 0.12 s of a hop or a slide is a perfect dodge (Flow +5, slow motion, 8 MP), as Kael's dash has.
Today her guard silently swallows the blow.
Precise skills need this trigger.

### Spell rotation

The snare is the first spell in her I rotation.
Spell skills join it.
O stays the reload, so for Sable the rotation advances on its own: after a cast, I points at the next spell that is ready and affordable, shown on the I tab.
This is a contract point (see the end).

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

## Ordinary play assumed in the numbers

- Bolts 2.4 a second, closing bolts 0.8 a second, an average bolt 11.7.
- Hop 0.4 a second (0.5 with a cheaper hop), slide 0.3, kick 0.4 (0.6 in a kick-led build), 30% of the time in the air.
- MP: 90 bar, 2 a second, 8 per perfect dodge: about one 20 MP cast every 8 s, shared by every spell and the ultimate.
- A precise player: a perfect reload on 80% of quivers, a perfect dodge every 8 s.
- A crowd is 6 foes: about 3 in a bolt's line, 3 to 4 in a 60 px blast.

## The 20 skills

Kinds: attack 7, movement 3, spell 3, dot 3, summon 3, ultimate 1.
Risk: easy 6, timed 10, precise 4.
"New" marks a level that adds a property.

### s_pierce Piercing Bolts (attack, easy, J)

Bolts fly on through foes.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: pierce 1 | Bolts pass through one foe. |
| 2 | pierce 2 | Bolts pass through one more foe. |
| 3 | New: +12% per foe passed | Each foe a bolt passes through makes it 12% stronger. |
| 4 | New: range 250 to 340 px | Bolts fly a third farther. |
| 5 | pierce 4 | Bolts pass through two more foes. |
| 6 | New: closing bolt pierces all | The closing bolt passes through every foe. |
| 7 | New: pierced foes stagger 0.3 s | Foes a bolt passes through stagger. |
| 8 | +25% per foe passed | Each foe passed makes the bolt 25% stronger. |

Evolution Railbolt (with `s_longshot`): every bolt pierces everything and crosses the stage at 900 px/s, +25% per foe passed, leaving a jade line for 0.3 s.
Build: `pierceOf()` and the bolt's `range` in `loose.ts` read `skillValues`; a per-bolt count in `pass` for the growth; `stagger` on `dealDamage`; Railbolt uses Deadeye's speed and range options of `createCrossbowBolt`.

### s_scatter Scattershot (attack, easy, J)

The string fans out.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: closing bolt adds 2 side bolts at 50% | The closing bolt fans out with two side bolts. |
| 2 | side 60% | Side bolts hit harder. |
| 3 | New: every bolt fans | Every bolt fans out. |
| 4 | New: closing bolt fans into 5 | The closing bolt fans out into five. |
| 5 | side 70% | Side bolts hit harder. |
| 6 | New: side bolts bend toward foes | Side bolts bend toward foes. |
| 7 | New: side bolts pierce 1 | Side bolts pass through a foe. |
| 8 | every bolt fans into 5 | Every bolt fans out into five. |

Side bolts take nothing from the quiver.
Evolution Hailfall (with `s_featherdraw`): in the air every bolt bursts into 7 slanting down at 80%; on the floor every fan is 5 at 80%.
Build: the existing fan loop in `shoot.ts` `fire()` with count and share from `skillValues`; the bend reuses `assisted()` in `aim.ts` per side bolt.

### s_ricochet Ricochet (attack, timed, J)

Bolts bounce on to the next foe; best near walls and in packs.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: a hit bounces to a foe within 80 px at 70% | A bolt that hits bounces to a nearby foe. |
| 2 | New: bolts bounce off the floor and stage edge | Bolts bounce off the floor and the edge. |
| 3 | New: a kill flies on at full damage | A bolt that kills flies on. |
| 4 | 2 foe bounces | Bolts bounce one more time. |
| 5 | bounced bolts 80% | Bounced bolts hit harder. |
| 6 | New: an edge bounce comes back primed | A bolt off the edge comes back primed. |
| 7 | 4 bounces, 120 px | Bolts bounce farther, four times. |
| 8 | +30% per bounce | Each bounce makes the bolt 30% stronger. |

Evolution Splinter Storm (with `s_scatter`): each bounce splits the bolt in two, up to 8 bolts from one shot.
Build: `bounces` already exists on `createCrossbowBolt`; the foe bounce is a new `looseBolt` call from `strike` toward the nearest unstruck foe, carrying the `struck` set.

### s_breach Breaching Bolt (attack, timed, J closing bolt)

The closing bolt hits like a ram.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | closing bolt +60%, push x1.6 | The closing bolt hits harder and pushes farther. |
| 2 | New: breaks guards, 0.4 s stun | The closing bolt breaks guards and stuns. |
| 3 | New: bursts 30 px at 0.8A | The closing bolt bursts on impact. |
| 4 | +150% | The closing bolt hits much harder. |
| 5 | New: a thrown foe hits foes it meets for 1A | Foes it throws hurt the foes they hit. |
| 6 | burst 45 px, 1.4A | A bigger, harder burst. |
| 7 | New: a foe slammed into the edge is pinned 1 s and takes 1.5A | Foes slammed into the edge are pinned. |
| 8 | +350%, burst 2A | The closing bolt hits four times as hard. |

Evolution Siege Bolt (with `s_heavyBoot`): the closing bolt pierces the whole line, bursts on every foe and pins them to the floor 1.2 s; pinned foes take 50% more from her.
Build: a `closing` flag on `Loose` from the string counter in `shoot.ts`; burst with `createFloorRing` and `createImpact`; thrown foes reuse Hulda's `thrownBody.ts`; pin is the existing `e.pinned`.

### s_longshot Longshot (attack, timed, J)

Bolts hit harder the farther they fly, so keeping range pays.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: +30% past 120 px | Bolts that fly past half range hit 30% harder. |
| 2 | +50% | Far hits are stronger. |
| 3 | New: far hits +20% crit chance | Far hits crit more often. |
| 4 | New: range 320 px | Bolts fly farther. |
| 5 | New: a far hit marks the foe 3 s, +15% from all her damage | Far hits mark the foe. |
| 6 | +120% | Far hits are much stronger. |
| 7 | New: a far kill puts the bolt back | A far kill puts the bolt back in the quiver. |
| 8 | New: the last 20% of flight always crits at x2.5 | Bolts at the end of their flight always crit. |

Evolution Horizon Shot (with `s_ricochet`): range doubles, every far hit crits and splits into two bolts that seek the nearest foes.
Build: `createCrossbowBolt` passes `flown` to `pass`; `dealDamage` gets a crit override; the mark is a new foe status (`mark` time), shared with Deadeye and Net Bolt.

### s_rhythm Perfect Rhythm (attack, precise, O)

The perfect reload pays far more.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | primed +80%, 5 primed | Primed bolts hit harder, and one more is primed. |
| 2 | New: window wider by 0.04 each side | A wider perfect window. |
| 3 | New: primed bolts pierce 2 | Primed bolts pass through two foes. |
| 4 | New: quiver +3 | The quiver holds 3 more bolts. |
| 5 | New: perfect reload gives 25 stamina, 10 MP | A perfect reload restores stamina and MP. |
| 6 | primed +150%, 8 primed | Primed bolts hit much harder. |
| 7 | New: perfect reload looses 3 primed bolts at the nearest foes | A perfect reload fires three primed bolts at once. |
| 8 | New: primed bolts always crit; +25% attack speed for 3 s | Primed bolts always crit, and a perfect reload quickens your shots. |

Evolution Clockwork Cadence (with `s_breach`): a perfect reload primes the whole quiver, every primed closing bolt is a Breaching burst at double size, and she cannot be staggered while primed bolts remain.
Build: `primedBolts()`, `reloadWindow()` and `quiverSize()` in `quiver.ts` read `skillValues`; the volley calls `looseBolt` from `perfect()` in `reload.ts`; the haste is a timed attack speed factor in kit memory.

### s_heavyBoot Heavy Boot (attack, timed, K)

The kick becomes a weapon and a reload.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | kick 1.6A, stun 1 s | The kick hits much harder and stuns longer. |
| 2 | New: kicked foes bounce off the edge | Kicked foes bounce off the edge. |
| 3 | New: a landed kick loads 2 bolts | A kick that lands loads 2 bolts. |
| 4 | New: the kicked foe flies and hits foes behind for 1A | Kicked foes knock down the foes behind them. |
| 5 | kick 3A, stun 1.4 s | The kick hits much harder. |
| 6 | New: after a landed kick the next 3 bolts are primed | After a kick your next 3 bolts are primed. |
| 7 | New: wider box; an air kick refills the air string | A wider kick, and an air kick refills your air shots. |
| 8 | kick 6A and a 60 px shockwave at 2.5A | The kick lands with a shockwave. |

Evolution Thunder Heel (with `s_slideKick`): every kick rings a 100 px shockwave at 3A, kicked foes chain into others, and a kick that hits 3 or more foes refills the quiver.
Build: `kick.ts` reads `skillValues` for power, stun and `wall`; `loadBolts` already exists (Boot and Bolt); the flying foe reuses `thrownBody.ts`; the shockwave reuses `createFloorRing`.

### s_hopVolley Hop Volley (movement, timed, L)

The hop back looses a primed fan.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: 3 primed bolts at full damage | The hop looses three primed bolts. |
| 2 | hop costs 16 stamina | The hop costs less stamina. |
| 3 | New: hop bolts bend toward the nearest foes | Hop bolts seek foes. |
| 4 | New: a second hop in the air | Hop once more in the air. |
| 5 | 5 bolts | The hop looses five bolts. |
| 6 | New: hop bolts pierce 2 | Hop bolts pass through two foes. |
| 7 | New: landing scatters caltrops 60 px, 1A and a trip | Landing from a hop scatters caltrops. |
| 8 | hop bolts x2.5, hop 30% longer | Hop bolts hit far harder and the hop carries farther. |

Evolution Wheeling Volley (with `s_scatter`): the hop turns her in the air and looses a full ring of 12 primed bolts.
Build: `hopShot()` in `evade.ts` with count, share and primed from `skillValues`; `sable.airHopped` becomes a count; caltrops are a new small floor effect modelled on `snareTrap.ts`.

### s_slideKick Slide Kick (movement, timed, L from a walk or run)

The slide trips foes into the air and she rises facing them.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: slid-through foes take 1A and trip 0.9 s | The slide trips every foe it passes. |
| 2 | New: tripped foes are thrown up (bolts deal x2 to air foes) | Tripped foes fly into the air. |
| 3 | slide 0.4 s, 12 stamina | A longer, cheaper slide. |
| 4 | New: she rises facing the foes she slid under | You rise facing the foes you slid under. |
| 5 | trip 2.5A | The slide hits harder. |
| 6 | New: the next 3 bolts after a slide are primed | Your next 3 bolts after a slide are primed. |
| 7 | New: a slide through 3 foes refunds stamina and loads 3 bolts | A slide through a crowd refunds itself and loads bolts. |
| 8 | trip 6A, foes fly 1 s | Tripped foes take much more and fly higher. |

Evolution Tangle Slide (with `s_net`): the slide leaves a net line; foes it throws hang tangled in the air for 1.5 s.
Build: `trip()` in `evade.ts` already exists (Slide Kick perk); launch through `dealDamage` `ky`; the face turn sets `hero.face` at the rise with a two-frame turn hand-over per the motion standard.

### s_featherdraw Featherdraw (movement, easy, jump)

She hangs in the air while she shoots. The one skill that raises the air limit.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: air limit 3; air bolts +25% | Three shots per jump, and air bolts hit harder. |
| 2 | New: each air shot holds her up 0.15 s | Air shots hold you up. |
| 3 | New: air bolts pierce 1 | Air bolts pass through a foe. |
| 4 | jump 25% higher | A higher jump. |
| 5 | air bolts +60% | Air bolts hit harder. |
| 6 | New: landing after an air string looses bolts both ways along the floor at 0.6A | Landing after air shots fires along the floor. |
| 7 | New: a second jump, refilling the air string | Jump once more in the air. |
| 8 | New: air bolts +100% and split in two on a hit | Air bolts hit twice as hard and split. |

Evolution Skyhunter (with `s_hawk`): hold J in the air to hover up to 1.5 s firing full strings, each bolt a fan of 3, and every air string calls a hawk.
Build: an air string counter in kit memory; the hold-up scales `gravityScale()`; the second jump reuses Kael's jump clock for a clean apex.

### s_net Net Bolt (spell, timed, I)

A weighted net that pins foes where it lands.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: 25 MP, net 40 px, 3P, holds 1.5 s | Shoot a net that pins foes where it lands. |
| 2 | 20 MP, 4 s recharge | Cheaper and quicker. |
| 3 | New: netted foes take +25% from bolts | Netted foes take more from bolts. |
| 4 | net 60 px | A wider net. |
| 5 | New: the net drags foes to its centre | The net drags foes together. |
| 6 | 7P, holds 2.5 s | Holds longer and bites harder. |
| 7 | New: two nets in a fan | Shoot two nets at once. |
| 8 | New: 12P; netted foes take +60% from every source | Netted foes take 60% more from everything. |

Evolution Pitch Net (with `s_keg`): the net is soaked in pitch; any bolt sets it alight, burning every foe in it and spreading the burn to foes that touch them.
Build: the net flies as a `createCrossbowBolt` and opens as a new effect drawn like `snareTrap.ts`; the hold is `stun`; the damage taken bonus is the shared mark status.

### s_decoy Straw Decoy (spell, easy, I)

A cloaked decoy that draws foes, then bursts.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: 30 MP, 4 s, draws foes within 120 px, bursts 4P in 40 px | Set a decoy that draws foes, then bursts. |
| 2 | lasts 6 s | The decoy lasts longer. |
| 3 | New: the decoy shoots a 0.6A bolt every 0.8 s | The decoy shoots back. |
| 4 | burst 60 px, 7P | A bigger burst. |
| 5 | New: foes that strike the decoy are stunned 0.6 s | Foes that strike the decoy are stunned. |
| 6 | 20 MP | Cheaper. |
| 7 | New: the burst leaves slowing smoke 3 s | The burst leaves slowing smoke. |
| 8 | New: two decoys; burst 14P | Two decoys, and the burst hits much harder. |

Evolution Bait Pit (with `s_barbed`): the decoy stands in a ring of four armed snares and re-sets them once.
Build: foes target the decoy through a target override in the enemy AI (new, small); its bolts reuse `looseBolt` with the skill as source; the slow is the existing `e.chill`.

### s_keg Powder Keg (spell, precise, I)

Roll a keg ahead, then shoot it as foes reach it. A primed bolt makes it far stronger.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: 30 MP; keg waits 6 s; a bolt or kick sets it off, 8P in 60 px; fizzles for 1P | Roll a keg; shoot it to blow it up. |
| 2 | New: a primed bolt makes the blast x1.6 | A primed bolt makes the blast bigger. |
| 3 | New: the blast throws foes up | The blast throws foes into the air. |
| 4 | 10P, 70 px | A bigger blast. |
| 5 | New: the blast leaves burning pitch 3 s | The blast leaves burning pitch. |
| 6 | New: two kegs; one sets off the other | Roll two kegs; one sets off the other. |
| 7 | New: a kicked keg flies 150 px and blows on the first foe | Kick a keg to send it flying. |
| 8 | primed x2.5; a primed blast gives back 15 MP | A primed blast hits far harder and gives back MP. |

Evolution Powder Effigy (with `s_decoy`): the keg wears a decoy cloak, foes crowd it, and the blast covers twice the area.
Build: the blast is `explode()` from `src/game/spells/explosion.ts`; pitch burn is the existing `e.burn`; the keg is a new effect that bolts and kicks test against.

### s_venom Venom Tips (dot, easy, J)

Bolts poison; stacks pile up on one foe.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: each bolt adds a stack, 3 s, 0.08A a second, up to 4 | Bolts poison foes. |
| 2 | up to 6 | Poison stacks higher. |
| 3 | New: poison creeps to a touching foe each second | Poison spreads to foes nearby. |
| 4 | 0.12A a second | Poison bites harder. |
| 5 | New: poisoned foes deal 20% less | Poisoned foes hit weaker. |
| 6 | up to 12, 4 s | Poison stacks much higher. |
| 7 | 0.3A a second | Poison bites much harder. |
| 8 | New: 0.4A, up to 15; a kill passes half its stacks on | Poison runs deep and passes on when a foe falls. |

Evolution Blight (with `s_ricochet`): stacks cap at 30, and a poisoned foe that falls bursts in a 60 px cloud that gives every foe in it all its stacks.
Build: a stacking status on the foe (`stacks`, `time` per skill id) ticked in `updateStatus` with `dot: true` and the skill as source; a shared helper if the framework offers one.

### s_barbed Barbed Jaws (dot, timed, I snare)

Snares tear and bleed, and more of them.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: a bite bleeds 0.25P a second for 4 s | Snares leave a bleed. |
| 2 | 0.4P, 6 s | Bleeds run longer. |
| 3 | New: three snares on the floor | One more snare on the floor. |
| 4 | 15 MP, 1.75 s recharge | Snares are cheaper and quicker. |
| 5 | New: a bleeding foe that moves bleeds twice as fast | Moving foes bleed twice as fast. |
| 6 | New: 1P; bleeds stack up to 3 | Bleeds stack. |
| 7 | New: a sprung snare shoots every foe within 70 px, each bolt a bleed | A sprung snare shoots every foe near it. |
| 8 | New: 2P, 8 s; jaws re-arm once | Snares re-arm once, and bleeds run deep. |

Evolution Bloodtrap (with `s_net`): a sprung snare throws a bramble net 60 px wide; when the net closes every bleeding foe in it takes all its remaining bleed at once.
Build: `snare.ts` `spring()` and `maxSnares()` read `skillValues`; the volley is the existing Tripwire Volley code; the bleed is the stacking status with a "moving" multiplier.

### s_lodged Lodged Bolts (dot, timed, J and K)

Bolts stay in the foe and fester; a kick tears them out.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: a bolt that stops in a foe stays, 0.1A a second each, up to 3 | Bolts stay lodged and fester. |
| 2 | up to 5 | More bolts stay lodged. |
| 3 | New: a kick tears them all out for 0.5A each | A kick rips the bolts out. |
| 4 | 0.2A, up to 6 | Lodged bolts fester faster. |
| 5 | New: each lodged bolt slows the foe 5% | Lodged bolts slow the foe. |
| 6 | New: up to 10; the closing bolt lodges two | The closing bolt lodges two. |
| 7 | New: 0.4A; torn bolts fly on at the nearest foe for 1A | Torn-out bolts fly at other foes. |
| 8 | 0.6A, up to 12 | Lodged bolts fester much faster. |

A bolt that pierces lodges only in the last foe it hits, so this skill pulls against Piercing Bolts.
Evolution Pincushion (with `s_heavyBoot`): up to 20 lodged; a kick tears them out as a burst of seeking bolts at 2A each through every foe around.
Build: the stuck bolt is drawn from the stacking status count on the foe; the tear-out loops `looseBolt` from the foe's centre with the skill as source.

### s_hawk Hunting Hawk (summon, easy, auto on bolt hit)

A hawk dives on the foe she hits.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: 10% on a hit (2 s guard), dive 1.5A | A hawk may dive on the foe you hit. |
| 2 | 18% | The hawk comes more often. |
| 3 | New: it stays 4 s and dives every 1.2 s | The hawk stays and dives again. |
| 4 | dive 2.2A, 1.5 s guard | The hawk strikes harder. |
| 5 | New: a dive throws the foe up | The hawk throws foes into the air. |
| 6 | New: two hawks | Two hawks hunt at once. |
| 7 | New: a hawk carries a foe up and drops it for 2A | The hawk carries foes up and drops them. |
| 8 | dive 3.5A, stays 6 s | The hawks hunt longer and harder. |

Evolution Shrike Flock (with `s_venom`): four hawks that never leave, each dive adding 3 poison stacks.
Build: the flight and perch come from the Seeker Wisp relic code (`src/game/relics/wisp.ts`) before it is removed; a new hawk drawing in `src/game/skills/sable/`.

### s_hound Snare Hound (summon, timed, auto on kick landed or snare bite)

A hound bounds in and drags foes away from her.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: 25% on a kick or bite (4 s guard), bite 2A and a 1 s hold | A hound may bite the foe you kick or snare. |
| 2 | 40% | The hound comes more often. |
| 3 | New: it stays 5 s, biting the nearest foe every 1.5 s | The hound stays and hunts. |
| 4 | bite 3A | The hound bites harder. |
| 5 | New: it drags the bitten foe away from her | The hound drags its foe away from you. |
| 6 | New: two hounds | Two hounds hunt at once. |
| 7 | New: a howl on arrival stuns foes within 60 px 0.8 s | The hound howls and stuns foes. |
| 8 | bite 5A, stays 8 s | The hounds hunt longer and harder. |

Evolution Bloodhound (with `s_barbed`): three hounds that hunt bleeding foes first; a bite doubles the bleed's speed.
Build: a ground runner with the walk logic of `walks()` in `enemies/enemy.ts`, drawn as a new hound; the drag reuses the glaive's `e.pinned` hold while moving the foe.

### s_shade Shade Archer (summon, precise, auto on perfect dodge)

A shade of Sable stays where the blow missed and shoots.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: every perfect dodge (3 s guard), a shade fires one string at 1A a bolt | A perfect dodge leaves a shade that shoots. |
| 2 | New: shade bolts primed | The shade's bolts are primed. |
| 3 | New: the shade stays 3 s firing strings | The shade stays and keeps shooting. |
| 4 | 1.5A | The shade hits harder. |
| 5 | New: perfect dodge window 0.12 to 0.2 s | Perfect dodges are easier. |
| 6 | New: shade strings pierce all | The shade's bolts pass through every foe. |
| 7 | New: while a shade stands, her own bolts are primed | While a shade stands your bolts are primed. |
| 8 | 3A, stays 6 s | The shade stays longer and hits much harder. |

Evolution Twin Shadows (with `s_hopVolley`): two shades, each copying her hop volley; while one stands she takes no knockback, and a perfect dodge refills the quiver.
Build: drawn with `ghostCanvas` and `drawHero` as Phantom Legion does; bolts are `looseBolt` from the shade's place with the skill as source; needs the kit's perfect dodge event.

### s_deadeye Deadeye (ultimate, precise, U)

Replaces Bolt Storm with one heavy bolt through a line.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | New: Deadeye replaces Bolt Storm at x1.2 power | Bolt Storm becomes Deadeye: one heavy bolt through a line. |
| 2 | cooldown 16 s | Deadeye is ready sooner. |
| 3 | New: struck foes are marked 4 s, +30% from her bolts | Deadeye marks the foes it strikes. |
| 4 | x1.6 | Deadeye hits harder. |
| 5 | New: a kill splits the bolt up and down | A kill splits the bolt toward fliers and the floor. |
| 6 | New: a perfect reload in the last second before the cast doubles it | A perfect reload just before Deadeye doubles it. |
| 7 | New: struck foes are pinned 1.5 s | Deadeye pins the foes it strikes. |
| 8 | x2.5; each kill takes 2.5 s off the cooldown, up to half | Deadeye hits far harder, and kills bring it back sooner. |

Evolution Heartseeker (with `s_rhythm`): every charge level fires both ways and sends a seeking bolt at every foe on screen; a perfect reload just before triples it.
Build: `src/game/ultimates/deadeye.ts` as it is, with power, mark and pin from `skillValues`; the level 4 seeking bolts already exist.

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
