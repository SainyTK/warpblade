# Wenna's skills

Wenna's 20 skills, written from the skill data in `src/constants/characters/wenna/skills/`, which is the source of truth.
Her kit, Wicks, Wax, Swap and the Quarry are in `docs/wenna-design.md`; the rules every hero's skills follow are in `docs/skill-design.md`.

## Units

Damage is a multiple of attack damage (x AD) from `progress.stats.ad`, or of ability power (x AP) from `progress.stats.ap` where a skill's values say so.
At the start of a run AD is 6 and AP is 11.
Most of her damage comes from her Wicks, so most of her skills read AP.
Distances are art pixels, times are seconds, speeds are pixels a second.

## Base kit

Every button does something from the first second of a run.

| Key | With no skill |
| --- | --- |
| A / D | Walk, about 60 px/s. No run. |
| W | One jump of 48 px. No double jump. |
| J | The lamp string: Tap, Swing, Flare. In the air, Lamp Drop, one per airtime. The last foe a blow hits becomes her Quarry for 4 s. |
| K | Light a Wick for 25 Wax. At the cap, relight the weakest for 10 Wax. With S held, at her feet. |
| L | Swap with a Wick within 160 px: 15 stamina, 1.0 s cooldown, the Wick arrives with a 0.6x AP flare in 24 px. |
| I | The selected ability: Kindle, Beckon, or a spell skill. |
| O | Switch ability. |
| U | Great Wick, the base special, with the shared charge levels. |

### Wicks

A Wick is a wax figure about 12 px tall with a violet flame for a head.
It has 30% of her max HP, lives 18 s and she can keep 4 at once.
It bites every 0.8 s for 0.4x AP, knockback 20, as source `abilities` with no Flow.
It goes for the Quarry if it can reach it, else the nearest foe within 140 px, else it walks back to stand behind her.
Ground minions that walk into a Wick stop at its front edge and burn it for their contact damage once a second.
Elites, mini bosses and the Rift Warden push through.
A blow or shot about to land on her from a side where a Wick stands within 20 px of her lands on the Wick, at most once each 0.3 s for each Wick.
At 0 HP or the end of its life the Wick melts away.
If she has no Wick at the start of a wave, one lights for free at her side.

### Wax

The WX bar runs from 0 to 100, and a run starts at 60.
It trickles in at 3 a second, always.
A foe killed by her, her Wicks or her skills drips 10 Wax (minion), 20 (elite) or 40 (mini boss), which flies to her within 80 px and lies on the floor for 6 s otherwise.

### The lamp string

| Blow | Reach | Power | Extra |
| --- | --- | --- | --- |
| Tap | a jab 8 to 30 px ahead | 0.8x AD | stagger 0.25 s |
| Swing | an arc of radius 30 | 0.9x AD | |
| Flare | a violet cone 12 to 46 px ahead, 30 degree half angle | 0.6x AD + 0.6x AP | every Wick within 100 px of the first foe bites it at once |
| Lamp Drop | a downward swing of radius 26 | 0.8x AD | one per airtime |

A Quarry wears a violet lamplight ring.
Every Wick that can reach it goes for it and bites it every 0.55 s.

### Abilities on I

Kindle (16 MP, 3 s): the Wick nearest her within 120 px bursts for 2.0x AP in 36 px and is spent; she gets back half its cost.
Beckon (12 MP, 6 s): every Wick within 200 px hops to a ring round her for 2 s and takes 50% less damage.
The spell skills Lamp Volley, Wax Pool and Wax Effigy join the rotation.

### Great Wick

A giant Wick rises from a pool of wax at her lamp pole and swings one arm across the level's reach: every foe in reach takes the level's power as a multiple of AP, knockback 160 and up 120.
It then melts into 1 to 4 new Wicks by charge level, allowed up to 2 past her cap, living 8 s.
Thousand Candles replaces it.

## The 20 skills

| Id | Name | Kind | Risk | Button | Evolves with |
| --- | --- | --- | --- | --- | --- |
| `w_quarry` | Hunting Call | attack | easy | J | `w_tallow` |
| `w_fangs` | Bright Fangs | attack | easy | auto | `w_singe` |
| `w_flare` | Open Shutter | attack | timed | J | `w_lampVolley` |
| `w_packLunge` | Pack Lunge | attack | precise | J | `w_quarry` |
| `w_gutter` | Guttering | attack | timed | K | `w_kindle` |
| `w_kindle` | Chain Kindle | attack | timed | I | `w_gutter` |
| `w_swap` | Changeling Step | movement | timed | L | `w_procession` |
| `w_hop` | Wick Hop | movement | timed | jump | `w_fangs` |
| `w_procession` | Procession | movement | easy | auto | `w_waxPool` |
| `w_lampVolley` | Lamp Volley | spell | easy | I | `w_flare` |
| `w_waxPool` | Wax Pool | spell | timed | I | `w_procession` |
| `w_effigy` | Wax Effigy | spell | timed | I | `w_gutter` |
| `w_singe` | Singe | dot | easy | auto | `w_hotWax` |
| `w_hotWax` | Hot Wax | dot | timed | K | `w_singe` |
| `w_smoulder` | Smoulder | dot | timed | L | `w_swap` |
| `w_lampflies` | Lampflies | summon | easy | J | `w_lampVolley` |
| `w_twinWick` | Twin Wick | summon | timed | K | `w_tallow` |
| `w_ghost` | Remembrance | summon | timed | auto | `w_hotWax` |
| `w_tallow` | Deep Tallow | passive | easy | auto | `w_twinWick` |
| `w_thousand` | Thousand Candles | ultimate | timed | U | `w_tallow` |

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.
Risk: precise 1, easy 7, timed 12.

Kit events she emits through the shared function: `wick` (a Wick was lit or ended), `swap` (a Swap traded her place with a Wick), `quarry` (a foe became her Quarry), `kindle` (a Wick burst under Kindle) and `bite` (a Wick bit a foe), declared in `src/types/wenna.ts`; and the shared `cast`, `jump`, `dash` (each Swap) and `perfectDodge`.

### w_quarry: Hunting Call

attack, easy, J. Her Quarry lasts longer and her Wicks bite it harder.

Values: life: seconds a Quarry lasts; bite: share more Wick bites deal to a Quarry; chill: 1 her blows chill the Quarry; pass: 1 a Quarry's death passes the mark to the nearest foe; rush: share faster Wicks walk toward a Quarry; count: Quarries she holds at once; pack: 1 every foe she hits becomes a Quarry and the Wicks split between them (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | life 6, bite 0.1, count 1 | The Quarry lasts 6 s; bites on it deal 10% more. |
| 2 | chill 0 to 1 | Your blows chill the Quarry. |
| 3 | bite 0.1 to 0.3 | Bites on the Quarry deal 30% more. |
| 4 | pass 0 to 1 | A Quarry's death passes the mark on. |
| 5 | rush 0 to 0.3 | Wicks walk 30% faster toward the Quarry. |
| 6 | count 1 to 2 | Two Quarries at once. |
| 7 | life 6 to 8, bite 0.3 to 0.45 | The Quarry lasts 8 s; bites on it deal 45% more. |
| 8 | bite 0.45 to 0.6 | Bites on the Quarry deal 60% more. |
| Evolved | bite 0.6 to 1, pack 0 to 1 | Every foe you hit is a Quarry; 100% more. |

Evolution: **Pack Law** (partner `w_tallow`). Every foe she hits becomes a Quarry, the Wicks split between them, and bites on Quarries deal 100% more.

### w_fangs: Bright Fangs

attack, easy, auto. Her Wicks bite harder, further and faster.

Values: power: share more every Wick bite deals; reach: pixels added to a bite's reach; knock: 1 bites knock minions back; twice: 1 every third bite of a Wick hits twice; every: seconds between a Wick's bites, the base kit's 0.8; blue: 1 every bite also strikes the next foe behind its target and adds 2 Singe (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.3, every 0.8 | Wick bites deal 30% more. |
| 2 | reach 0 to 8 | Bites reach 8 px further. |
| 3 | power 0.3 to 0.45 | Wick bites deal 45% more. |
| 4 | knock 0 to 1 | Bites knock minions back. |
| 5 | twice 0 to 1 | Every third bite hits twice. |
| 6 | power 0.45 to 0.6 | Wick bites deal 60% more. |
| 7 | every 0.8 to 0.6 | Wicks bite every 0.6 s. |
| 8 | power 0.6 to 0.9 | Wick bites deal 90% more. |
| Evolved | blue 0 to 1 | Bites strike the foe behind and Singe. |

Evolution: **Blue Flame** (partner `w_singe`). Every bite also strikes the next foe behind its target and adds 2 Singe.

### w_flare: Open Shutter

attack, timed, J. Flare, the third blow of her string, burns harder and further.

Values: power: share more the Flare deals; cone: pixels added to the far edge of the Flare's cone (46 in the base kit); ignite: 1 the Flare ignites the foes it hits (the shared burn); wick: 1 a kill by the Flare lights a free Wick; echo: share of the Flare each Wick within 100 px repeats from where it stands; beam: 1 the Flare becomes a 160 px beam and every Wick fires one too (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.3, cone 8 | The Flare deals 30% more; its cone grows 8 px. |
| 2 | ignite 0 to 1 | The Flare ignites. |
| 3 | power 0.3 to 0.45 | The Flare deals 45% more. |
| 4 | wick 0 to 1 | A kill by the Flare lights a free Wick. |
| 5 | cone 8 to 14 | The cone reaches 60 px. |
| 6 | echo 0 to 0.4 | Wicks within 100 px repeat the Flare at 0.4x. |
| 7 | power 0.45 to 0.6 | The Flare deals 60% more. |
| 8 | power 0.6 to 0.8 | The Flare deals 80% more. |
| Evolved | beam 0 to 1 | A 160 px beam from you and every Wick. |

Evolution: **Lighthouse** (partner `w_lampVolley`). The Flare becomes a 160 px beam, and every Wick fires one too.

### w_packLunge: Pack Lunge

attack, precise, J. A blow on a Quarry ringed by Wicks sends them all lunging at it.

Values: power: ability power of each lunge, on the Quarry only; need: Wicks within 40 px of the Quarry a blow needs to send them lunging; stun: seconds a lunge stuns; crit: 1 lunges always crit; heal: share of its HP a lunging Wick heals; frenzy: 1 each lunge strikes three times and a kill by a lunge relights every Wick (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.2, need 3 | A blow with 3 Wicks by the Quarry: lunges for 1.2x. |
| 2 | stun 0 to 0.4 | Lunges stun for 0.4 s. |
| 3 | power 1.2 to 1.5 | Lunges deal 1.5x. |
| 4 | crit 0 to 1 | Lunges always crit. |
| 5 | need 3 to 2 | Two Wicks by the Quarry are enough. |
| 6 | heal 0 to 0.2 | Lunging Wicks heal 20%. |
| 7 | power 1.5 to 1.9 | Lunges deal 1.9x. |
| 8 | power 1.9 to 2.4 | Lunges deal 2.4x. |
| Evolved | frenzy 0 to 1 | Lunges strike thrice; a kill relights all. |

Evolution: **Feeding Frenzy** (partner `w_quarry`). Each lunge strikes three times, and a kill by a lunge relights every Wick.

### w_gutter: Guttering

attack, timed, K. A Wick that dies or burns out bursts.

Values: power: ability power of the burst when a Wick dies or burns out; radius: the burst's radius; launch: 1 the burst launches minions; wax: Wax each burst leaves; chill: 1 the burst chills; wildfire: 1 the burst leaves a 2 s fire on the floor (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.4, radius 24 | An ending Wick bursts for 0.4x in 24 px. |
| 2 | radius 24 to 32 | The burst reaches 32 px. |
| 3 | launch 0 to 1 | The burst launches minions. |
| 4 | power 0.4 to 0.8 | The burst deals 0.8x. |
| 5 | wax 0 to 5 | Each burst leaves 5 Wax. |
| 6 | chill 0 to 1 | The burst chills. |
| 7 | power 0.8 to 1.2 | The burst deals 1.2x. |
| 8 | power 1.2 to 1.6 | The burst deals 1.6x. |
| Evolved | power 1.6 to 2.5, wildfire 0 to 1 | Bursts deal 2.5x and leave a 2 s fire. |

Evolution: **Wildfire** (partner `w_kindle`). Bursts deal 2.5x and leave a fire on the floor for 2 s.

### w_kindle: Chain Kindle

attack, timed, I. Kindle bursts harder, pays back the Wick and chains to another.

Values: power: share more Kindle deals; refund: 1 Kindle refunds all of the Wick's Wax, not half; radius: pixels added to Kindle's burst (36 in the base kit); chain: share of Kindle one more Wick within 40 px bursts for (0: no chain); stun: seconds Kindle stuns; free: 1 the next Wick lit after a Kindle costs nothing; bonfire: 1 Kindle leaves a bonfire for 3 s where Wicks bite twice as fast (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.25, refund 1 | Kindle deals 25% more and refunds all Wax. |
| 2 | radius 0 to 10 | Kindle reaches 10 px further. |
| 3 | power 0.25 to 0.4 | Kindle deals 40% more. |
| 4 | chain 0 to 0.6 | Kindle chains to one more Wick at 0.6x. |
| 5 | stun 0 to 0.5 | Kindle stuns for 0.5 s. |
| 6 | power 0.4 to 0.6 | Kindle deals 60% more. |
| 7 | free 0 to 1 | The next Wick after a Kindle is free. |
| 8 | power 0.6 to 1 | Kindle deals 100% more. |
| Evolved | bonfire 0 to 1 | Kindle leaves a 3 s bonfire. |

Evolution: **Bonfire** (partner `w_gutter`). Kindle leaves a bonfire for 3 s where Wicks bite twice as fast.

### w_swap: Changeling Step

movement, timed, L. Swap reaches further, and the Wick she trades with arrives burning.

Values: range: pixels Swap reaches for a Wick (160 in the base kit); flare: share more the arriving Wick's flare deals; charges: Swaps she can make before the cooldown; untouch: seconds she cannot be hit after arriving; line: attack damage foes on the line between the two ends take; dodge: seconds after the press a blow counts as a perfect dodge; heal: 1 the swapped Wick heals to full; mirror: 1 every Swap also lights a free Wick where she arrives, if under the cap (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | range 220, flare 0.5, charges 1, untouch 0.15, dodge 0.1 | Swap reaches 220 px; the flare deals 50% more. |
| 2 | charges 1 to 2 | A second Swap charge. |
| 3 | flare 0.5 to 0.8 | The flare deals 80% more. |
| 4 | untouch 0.15 to 0.3 | Untouchable 0.3 s after a Swap. |
| 5 | line 0 to 0.6 | Foes on the line between take 0.6x. |
| 6 | dodge 0.1 to 0.2 | The perfect dodge window is 0.2 s. |
| 7 | heal 0 to 1 | The swapped Wick heals to full. |
| 8 | flare 0.8 to 1.5 | The flare deals 150% more. |
| Evolved | mirror 0 to 1 | Each Swap lights a free Wick. |

Evolution: **Mirror Wick** (partner `w_procession`). Every Swap also lights a free Wick where she arrives, if she is under the cap.

### w_hop: Wick Hop

movement, timed, jump. In the air above a Wick, jump again off its head.

Values: hops: hops off a Wick's head per airtime; flare: ability power the hopped Wick flares for (0: no flare); rise: pixels a hop rises; drop: share more Lamp Drop deals after a hop; stair: 1 no hop limit while over Wicks, and each hop makes that Wick bite at once (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | hops 1, rise 40 | Above a Wick, jump again off its head. |
| 2 | flare 0 to 0.6 | The hopped Wick flares for 0.6x. |
| 3 | hops 1 to 2 | Two hops per airtime. |
| 4 | rise 40 to 52 | Hops rise 52 px. |
| 5 | drop 0 to 0.3 | Lamp Drop after a hop deals 30% more. |
| 6 | flare 0.6 to 0.9 | The hopped Wick flares for 0.9x. |
| 7 | drop 0.3 to 0.6 | Lamp Drop after a hop deals 60% more. |
| 8 | flare 0.9 to 1.4 | The hopped Wick flares for 1.4x. |
| Evolved | stair 0 to 1 | Endless hops; each Wick bites. |

Evolution: **Candle Stair** (partner `w_fangs`). No hop limit while over Wicks, and each hop makes that Wick bite at once.

### w_procession: Procession

movement, easy, auto. She walks faster with every Wick lit, and her Wicks keep pace.

Values: walk: share faster she walks for each Wick lit; beside: 1 Wicks with no foe to chase walk beside her; wickWalk: share faster Wicks walk; slowBurn: share of their life Wicks lose while she walks (1: all of it); cap: Wicks added to her cap; vigil: 1 Wicks walking beside her leave wax that chills foes (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | walk 0.05, slowBurn 1 | Walk 5% faster for each Wick lit. |
| 2 | beside 0 to 1 | Idle Wicks walk beside you. |
| 3 | walk 0.05 to 0.06 | Walk 6% faster for each Wick. |
| 4 | wickWalk 0 to 0.3 | Wicks walk 30% faster. |
| 5 | slowBurn 1 to 0.5 | Wicks burn half as fast while you walk. |
| 6 | walk 0.06 to 0.07 | Walk 7% faster for each Wick. |
| 7 | cap 0 to 1 | One more Wick. |
| 8 | walk 0.07 to 0.08 | Walk 8% faster for each Wick. |
| Evolved | vigil 0 to 1 | Wicks beside you leave chilling wax. |

Evolution: **Vigil March** (partner `w_waxPool`). Wicks walking beside her leave wax that chills foes.

### w_lampVolley: Lamp Volley

spell, easy, I. Every Wick spits a flame bolt at the Quarry or its nearest foe.

Values: mp: MP a cast costs; cooldown: seconds; power: ability power of each bolt; bolts: bolts each Wick spits; pierce: foes a bolt passes through; ignite: 1 bolts ignite; starfire: 1 bolts curve to foes and burst for 24 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 18, cooldown 6, power 1, bolts 1 | Every Wick spits a bolt for 1.0x. |
| 2 | bolts 1 to 2 | Two bolts from each Wick. |
| 3 | power 1 to 1.2 | Bolts deal 1.2x. |
| 4 | pierce 0 to 1 | Bolts pass through a foe. |
| 5 | ignite 0 to 1 | Bolts ignite. |
| 6 | cooldown 6 to 4 | Recharge 4 s. |
| 7 | power 1.2 to 1.4 | Bolts deal 1.4x. |
| 8 | power 1.4 to 1.8 | Bolts deal 1.8x. |
| Evolved | starfire 0 to 1 | Bolts curve and burst for 24 px. |

Evolution: **Starfire** (partner `w_flare`). Bolts curve to foes and burst for 24 px.

### w_waxPool: Wax Pool

spell, timed, I. Pour a pool of hot wax ahead that chills foes and mends Wicks.

Values: mp: MP a cast costs; cooldown: seconds; width: the pool's width on the floor ahead; life: seconds it lies; foes on it are chilled; heal: HP a second Wicks on it heal; power: ability power foes on it take each 0.5 s; bite: share faster Wicks on it bite; pools: pools each cast lays; hearth: 1 the pool follows her and covers 140 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 20, cooldown 8, width 70, life 5, heal 4, pools 1 | A 70 px pool for 5 s chills foes, mends Wicks. |
| 2 | width 70 to 90 | The pool is 90 px wide. |
| 3 | power 0 to 0.3 | Foes on it take 0.3x each 0.5 s. |
| 4 | bite 0 to 0.25 | Wicks on it bite 25% faster. |
| 5 | life 5 to 8 | The pool lasts 8 s. |
| 6 | power 0.3 to 0.4 | Foes on it take 0.4x. |
| 7 | pools 1 to 2 | Two pools. |
| 8 | power 0.4 to 0.5 | Foes on it take 0.5x. |
| Evolved | hearth 0 to 1 | The pool follows you, 140 px wide. |

Evolution: **Hearth** (partner `w_procession`). The pool follows her and covers 140 px.

### w_effigy: Wax Effigy

spell, timed, I. Raise a tall wax effigy that lures minions, then bursts.

Values: mp: MP a cast costs; cooldown: seconds; lure: pixels it lures ground minions from; life: seconds it stands before it bursts; power: ability power of its burst; radius: the burst's radius; bite: share faster Wicks near it bite; hold: 1 it holds foes like a Wick; ignite: 1 the burst ignites; martyr: 1 the burst lights two free Wicks (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 24, cooldown 10, lure 90, life 4, power 0.8, radius 40 | An effigy lures minions for 4 s, bursts 0.8x. |
| 2 | lure 90 to 130 | It lures from 130 px. |
| 3 | bite 0 to 0.3 | Wicks near it bite 30% faster. |
| 4 | power 0.8 to 1.4 | The burst deals 1.4x. |
| 5 | hold 0 to 1 | It holds foes like a Wick. |
| 6 | ignite 0 to 1 | The burst ignites. |
| 7 | power 1.4 to 2.2 | The burst deals 2.2x. |
| 8 | power 2.2 to 3 | The burst deals 3.0x. |
| Evolved | martyr 0 to 1 | The burst lights two free Wicks. |

Evolution: **Martyr's Light** (partner `w_gutter`). The effigy's burst lights two free Wicks.

### w_singe: Singe

dot, easy, auto. Wick bites leave Singe, a slow violet burn.

Values: stacks: Singe each Wick bite adds; max: most stacks; damage: ability power a stack deals a second; life: seconds stacks last; own: 1 her own blows add stacks too; weak: share more Singed foes take from Wicks; ash: ability power each consumed stack deals to foes within 30 px when a foe at max stacks bursts (0: no burst; evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stacks 1, max 6, damage 0.05, life 3 | Wick bites add Singe: 0.05x a second a stack. |
| 2 | own 0 to 1 | Your own blows add Singe. |
| 3 | damage 0.05 to 0.13 | Singe burns for 0.13x. |
| 4 | max 6 to 10 | Up to 10 stacks. |
| 5 | weak 0 to 0.1 | Singed foes take 10% more from Wicks. |
| 6 | damage 0.13 to 0.17 | Singe burns for 0.17x. |
| 7 | life 3 to 5 | Stacks last 5 s. |
| 8 | damage 0.17 to 0.22 | Singe burns for 0.22x. |
| Evolved | ash 0 to 1.2 | Full Singe bursts for 1.2x a stack. |

Evolution: **Ashfall** (partner `w_hotWax`). A foe at max stacks bursts, consuming them for 1.2x each to foes within 30 px.

### w_hotWax: Hot Wax

dot, timed, K. A Wick that lands splashes hot wax on the foes round it.

Values: stacks: Hot Wax stacks a splash adds; damage: ability power a stack deals a second; life: seconds stacks last; radius: the splash's radius round a landing Wick; chill: 1 splashed foes are chilled; relight: 1 relights splash too; swap: 1 Swap arrivals splash; candle: 1 splashed foes that die drip double Wax (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stacks 2, damage 0.15, life 4, radius 24 | A landing Wick splashes 2 Hot Wax in 24 px. |
| 2 | radius 24 to 32 | The splash reaches 32 px. |
| 3 | chill 0 to 1 | Splashed foes are chilled. |
| 4 | damage 0.15 to 0.2 | Hot Wax burns for 0.2x. |
| 5 | relight 0 to 1 | Relights splash too. |
| 6 | swap 0 to 1 | Swap arrivals splash. |
| 7 | damage 0.2 to 0.27 | Hot Wax burns for 0.27x. |
| 8 | damage 0.27 to 0.35 | Hot Wax burns for 0.35x. |
| Evolved | candle 0 to 1 | Splashed foes drip double Wax. |

Evolution: **Candlemaker** (partner `w_singe`). Splashed foes that die drip double Wax.

### w_smoulder: Smoulder

dot, timed, L. Both ends of a Swap smoulder, burning the foes that stand there.

Values: burn: seconds both ends of a Swap burn; damage: ability power a Smoulder stack deals a second; life: seconds a stack lasts; thread: 1 the flame thread between the ends burns too; width: pixels wide each burn is; spread: 1 Smoulder spreads to the nearest foe on a kill; pyre: 1 each Swap leaves a burning trail along the thread for 4 s (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | burn 2, damage 0.2, life 3, width 24 | Both Swap ends burn 2 s, adding Smoulder. |
| 2 | burn 2 to 3 | The ends burn 3 s. |
| 3 | thread 0 to 1 | The thread between them burns too. |
| 4 | damage 0.2 to 0.27 | Smoulder burns for 0.27x. |
| 5 | width 24 to 32 | The burns are 32 px wide. |
| 6 | spread 0 to 1 | Smoulder spreads on a kill. |
| 7 | damage 0.27 to 0.35 | Smoulder burns for 0.35x. |
| 8 | damage 0.35 to 0.45 | Smoulder burns for 0.45x. |
| Evolved | pyre 0 to 1 | Swaps leave a 4 s burning trail. |

Evolution: **Pyre Path** (partner `w_swap`). Each Swap leaves a burning trail along the thread for 4 s.

### w_lampflies: Lampflies

summon, easy, J. A blow that lands may shake lampflies out of her lantern.

Values: chance: chance a J hit sends them; cooldown: seconds between swarms; count: lampflies it sends; power: ability power of each lampfly's strike; chill: 1 their strikes chill; stay: seconds they stay circling her after their dart (0: they fade); swarm: 1 every cast on I sends a swarm too (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.15, cooldown 2, count 3, power 0.3 | 15% on a J hit: three lampflies dart for 0.3x. |
| 2 | chance 0.15 to 0.25 | 25% chance. |
| 3 | count 3 to 5 | Five lampflies. |
| 4 | power 0.3 to 0.4 | Lampflies deal 0.4x. |
| 5 | chill 0 to 1 | Lampflies chill. |
| 6 | stay 0 to 5 | They circle you 5 s. |
| 7 | power 0.4 to 0.6 | Lampflies deal 0.6x. |
| 8 | power 0.6 to 0.8 | Lampflies deal 0.8x. |
| Evolved | swarm 0 to 1 | Every cast sends a swarm. |

Evolution: **Lantern Swarm** (partner `w_lampVolley`). Every cast on I sends a swarm too.

### w_twinWick: Twin Wick

summon, timed, K. Lighting a Wick may light a twin beside it, past the cap.

Values: chance: chance a K lights a twin beside the Wick, past the cap; bite: share faster twins bite; life: seconds a twin lives; count: twins it lights; candelabra: 1 every K lights three Wicks (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.2, life 6, count 1 | 20% on K: a twin Wick for 6 s. |
| 2 | chance 0.2 to 0.35 | 35% chance. |
| 3 | bite 0 to 0.3 | Twins bite 30% faster. |
| 4 | life 6 to 10 | Twins live 10 s. |
| 5 | chance 0.35 to 0.45 | 45% chance. |
| 6 | count 1 to 2 | Two twins. |
| 7 | chance 0.45 to 0.5 | 50% chance. |
| 8 | chance 0.5 to 0.55 | 55% chance. |
| Evolved | candelabra 0 to 1 | Every K lights three Wicks. |

Evolution: **Candelabra** (partner `w_tallow`). Every K lights three Wicks.

### w_ghost: Remembrance

summon, timed, auto. A Wick that ends may rise again as a ghost candle that shoots.

Values: chance: chance a Wick's end raises a ghost candle; cooldown: seconds between ghosts; life: seconds a ghost stays; power: ability power of each bolt; every: seconds between its bolts; pierce: foes a bolt passes through; count: ghosts it raises; vigil: 1 every ended Wick leaves a ghost whose bolts add Hot Wax (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.25, cooldown 2, life 4, power 0.5, every 0.6, count 1 | 25% as a Wick ends: a ghost shoots 0.5x for 4 s. |
| 2 | chance 0.25 to 0.4 | 40% chance. |
| 3 | pierce 0 to 1 | Ghost bolts pass through a foe. |
| 4 | power 0.5 to 0.7 | Bolts deal 0.7x. |
| 5 | life 4 to 6 | Ghosts stay 6 s. |
| 6 | count 1 to 2 | Two ghosts. |
| 7 | power 0.7 to 0.9 | Bolts deal 0.9x. |
| 8 | power 0.9 to 1.2 | Bolts deal 1.2x. |
| Evolved | vigil 0 to 1 | Every ended Wick leaves a ghost. |

Evolution: **Vigil of the Lost** (partner `w_hotWax`). Every ended Wick leaves a ghost whose bolts add Hot Wax.

### w_tallow: Deep Tallow

passive, easy, auto. More Wax, a faster trickle, and more and sturdier Wicks.

Values: wax: Wax added to her most; trickle: share more Wax trickles in; cap: Wicks added to her cap; hp: share more Wick HP; cost: Wax less a Wick costs; eternal: 1 Wicks never burn out on their own (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | wax 20, trickle 0.25 | Hold 20 more Wax; it trickles 25% faster. |
| 2 | cap 0 to 1 | One more Wick. |
| 3 | trickle 0.25 to 0.35 | Wax trickles 35% faster. |
| 4 | hp 0 to 0.25 | Wicks have 25% more HP. |
| 5 | cost 0 to 5 | Wicks cost 5 less Wax. |
| 6 | trickle 0.35 to 0.45 | Wax trickles 45% faster. |
| 7 | cap 1 to 2 | Two more Wicks. |
| 8 | trickle 0.45 to 0.6 | Wax trickles 60% faster. |
| Evolved | eternal 0 to 1 | Wicks never burn out. |

Evolution: **Eternal Flame** (partner `w_twinWick`). Wicks never burn out on their own.

### w_thousand: Thousand Candles

ultimate, timed, U. Replaces Great Wick: a field of candles rises across the reach, and every Wick flares with them.

Values: power: share of the level's power each foe in reach takes from the candles; flare: share of that hit every Wick she has flares for; great: seconds every Wick becomes a Great Wick (0: none); knock: 1 the candles knock foes up; leave: Wicks the candles leave when they melt; night: 1 the whole stage fills with candles and every foe takes the hit three times (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, flare 0.5 | Candles rise for 1.0x; every Wick flares half. |
| 2 | knock 0 to 1 | The candles knock foes up. |
| 3 | power 1 to 1.4 | The candles deal 1.4x. |
| 4 | great 0 to 3 | Every Wick is a Great Wick for 3 s. |
| 5 | power 1.4 to 1.8 | The candles deal 1.8x. |
| 6 | leave 0 to 4 | The candles leave 4 Wicks. |
| 7 | power 1.8 to 2.3 | The candles deal 2.3x. |
| 8 | power 2.3 to 3 | The candles deal 3x. |
| Evolved | night 0 to 1 | Candles fill the stage; three hits. |

Evolution: **Night of Lamps** (partner `w_tallow`). The whole stage fills with candles, and every foe takes the hit three times.
## Budget check

Figures follow the measuring room in `docs/skills/balance.md`: raw damage per second each skill adds over the base kit at hero level 1 (AD 6, AP 11), against the bands there (easy 70, timed 112, precise 175 to 210 on one foe, movement 0.8 of its band, damage over time 1.1 to 1.4 times the attack band of its risk).
They are estimates from this play model and need a pass in the room once the kit runs.

- Three Wicks stand on average.
  A bite deals 4.4.
  70% of bites go to a Quarry while she keeps striking, so a Wick bites 1.65 times a second and her Wicks deal about 22 a second together, 17 of it on Quarries.
- Her blows land 2 a second, with one Flare every 1.4 s reaching 2 foes at base.
- She lights 0.3 Wicks a second, Wicks end 0.25 a second, she swaps 0.25 times a second, hops off a Wick 0.15 times a second and casts Kindle 0.2 times a second on 3 foes.
- Spells are cast at their recharge.

| Skill | Risk, target | Level ups adding a property | L1 | L8 | L8 / L1 | Evolved | Band |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hunting Call | easy, crowd | chill, pass, rush, count | 2 | 17 | 8.5 | 28 | 70 |
| Bright Fangs | easy, crowd | reach, knock, twice, every | 6.5 | 39 | 6 | 78 | 70 |
| Open Shutter | timed, crowd | ignite, wick, 60 px cone, echo | 7 | 65 | 9 | 140 | 112 |
| Pack Lunge | precise, one | stun, crit, need 2, heal | 32 | 190 | 6 | 570 | 175 to 210 |
| Guttering | timed, crowd | 32 px, launch, wax, chill | 2.2 | 16 | 7.3 | 25 | 112 |
| Chain Kindle | timed, crowd | radius, chain, stun, free | 6.3 | 44 | 7 | 90 | 112 |
| Changeling Step | timed movement, crowd | charges, untouchable, line, dodge window, heal | 1.2 | 10 | 8 | 20 | 90 |
| Wick Hop | timed movement, crowd | flare, two hops, rise, drop | 0 | 6.7 | movement only at L1 | 14 | 90 |
| Procession | easy movement, crowd | beside, Wick walk, slow burn, cap | 0 | 9 | movement only at L1 | 15 | 56 |
| Lamp Volley | easy spell, crowd | two bolts, pierce, ignite, 4 s recharge | 5.5 | 48 | 9 | 95 | 70 |
| Wax Pool | timed spell, crowd | width, damage, faster bites, 8 s, two pools | 0 | 47 | control only at L1 | 90 | 112 |
| Wax Effigy | timed spell, crowd | lure 130, faster bites, hold, ignite | 3.5 | 22 | 6.3 | 40 | 112 |
| Singe | easy dot, crowd | own blows, 10 stacks, weak, 5 s | 5 | 35 | 7 | 75 | 77 to 98 |
| Hot Wax | timed dot, crowd | 32 px, chill, relight, Swap | 7.9 | 51 | 6.4 | 100 | 123 to 157 |
| Smoulder | timed dot, crowd | 3 s, thread, 32 px, spread | 6.6 | 44 | 6.7 | 95 | 123 to 157 |
| Lampflies | easy summon, crowd | five flies, chill, stay 5 s (and 25%) | 2.7 | 52 | 19 | 110 | 70 |
| Twin Wick | timed summon, crowd | faster bites, 10 s, two twins (and 55%) | 2.6 | 31 | 12 | 70 | 112 |
| Remembrance | timed summon, crowd | pierce, 6 s, two ghosts (and 40%) | 2.3 | 40 | 17 | 85 | 112 |
| Deep Tallow | easy passive | cap +1, HP, cost, cap +2 | 2 | 13 | 6.5 | 22 | none |

Pack Lunge assumes 40% of her blows on the Quarry find 3 Wicks within 40 px at level 1 and 80% find 2 at level 8, with a crit at 1.5x.
Its payoff lands on the Quarry only, so its crowd figure is the same as its one foe figure.

### Where the table misses the contract

- Hunting Call, Guttering, Wax Effigy and Singe start lower than the plan's first draft (bite 0.1, burst 0.4, effigy burst 0.8, Singe 0.05 a stack), so each grows 6 to 8.5 times by level 8 and Singe deals less than an attack skill at levels 1 to 4.
- Wick Hop, Procession and Wax Pool deal nothing at level 1 (movement and control), so their ratio is read from the first level that deals damage.
- Most skills sit under their band at level 8, as her bites are the base kit's damage and most skills raise a share of them.
  Every figure grows with the number of Wicks she keeps standing (Deep Tallow, Procession, Twin Wick).
  The balance pass should measure her in the room before any number moves.

### Thousand Candles

Budgeted per cast against Great Wick, counted in S, Great Wick's one hit on every foe in its reach.

- Level 1: the candles deal 1.0 S, and three Wicks flaring for half of it reach about 40% of the foes each, another 0.6 S: about 1.6 S, with no Wicks left behind.
- Level 8: the candles deal 3 S, the flares 1.8 S, and 3 s of Great Wicks biting three times as hard about 1 S: about 6 S, and the candles leave 4 Wicks, as much as Great Wick's top charge.
- Evolved (Night of Lamps): every foe on the stage, about 1.5 times the foes in reach, takes the candles three times, 13.5 S, plus the flares and the Great Wicks: about 15 S.
