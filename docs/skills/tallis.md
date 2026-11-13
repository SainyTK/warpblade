# Tallis's skills

Tallis's 20 skills, written from the skill data in `src/constants/characters/tallis/skills/`, which is the source of truth.
His kit, Gloam, the Veil, Sink, his warp and guard, and the foe awareness rule are in `docs/tallis-design.md`; the rules every hero's skills follow are in `docs/skill-design.md`.

## Units

Damage is a multiple of attack damage (x AD) from `progress.stats.ad`, or of ability power (x AP) from `progress.stats.ap` where a skill's values say so.
At the start of a run AD is 11 and AP is 8.
His knives and his warp read AD; Hamstring, his spells and Nightshade read AP.
Every melee hit of his own from behind deals 2.25 times: the shared 1.5 times, and half again from his kit's damage hook.
Distances are art pixels, times are seconds, speeds are pixels a second.

## Base kit

Every button does something from the first second of a run.

| Key | With no skill |
| --- | --- |
| A / D | Walk at 1.08 times the shared speed, 15% faster in the Veil; a double tap runs. In the pool, glide at 115 px/s. |
| W | One jump of 58 px. No double jump. |
| J tapped | The string Flick, Cross, Heel Kick, the same wherever foes stand; blows from behind deal 2.25x. In the air, Drop Stab, once per airtime. In the pool, rise with Rising Cut. |
| J held | The shared warp: a knife into the foe, and he steps out of its shadow at its back to strike, scaled so it deals the shared warp's damage; then 0.5 s veiled. |
| K | Guard with crossed knives: 9 stamina a block, 45% through. Fade, the parry: 2 s of free Veil, his next blow an Ambush. |
| L | The shared front dodge. |
| I | The selected ability: Smoke Knot, Hamstring, a spell skill, the Veil (20 Gloam, then 8 a second) or Sink (20 stamina, then 40 a second; tapped a dip, held while I is held). Held, Smoke Knot and Hamstring cast their wide forms. |
| O | Switch ability. |
| U | Gloaming, the base special, with the shared charge levels. |

## The 20 skills

| Id | Name | Kind | Risk | Button | Evolves with |
| --- | --- | --- | --- | --- | --- |
| `t_backbiter` | Backbiter | attack | precise | J | `t_shroud` |
| `t_ambush` | Ambush | attack | precise | J | `t_quietStep` |
| `t_quickKnives` | Quick Knives | attack | easy | J | `t_needles` |
| `t_turnabout` | Turnabout | attack | timed | J | `t_sink` |
| `t_plunge` | Plunge | attack | timed | J | `t_nightLeap` |
| `t_cutTendon` | Cut Tendon | attack | timed | I | `t_openVeins` |
| `t_sink` | Deep Shadow | movement | timed | I | `t_ambush` |
| `t_quietStep` | Quiet Step | movement | timed | J | `t_nightLeap` |
| `t_nightLeap` | Night Leap | movement | timed | jump | `t_plunge` |
| `t_needles` | Needle Fan | spell | easy | I | `t_quickKnives` |
| `t_markDusk` | Mark of Dusk | spell | precise | I | `t_backbiter` |
| `t_caltrops` | Caltrops | spell | timed | I | `t_nightshade` |
| `t_openVeins` | Open Veins | dot | easy | auto | `t_nightshade` |
| `t_nightshade` | Nightshade | dot | timed | J | `t_cutTendon` |
| `t_inkWound` | Ink Wound | dot | precise | J | `t_ambush` |
| `t_crows` | Gloam Crows | summon | easy | auto | `t_needles` |
| `t_double` | Shadow Double | summon | timed | K | `t_sink` |
| `t_wraith` | Hollow Wraith | summon | timed | auto | `t_openVeins` |
| `t_shroud` | Shroud | passive | easy | auto | `t_quietStep` |
| `t_gloaming` | Gloaming | ultimate | timed | U | `t_shroud` |

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.
Risk: precise 4, easy 5, timed 11.

Kit events he emits through the shared function: `veil` (the Veil came on or ended, and why), `sink` (a Sink ended in a rise), `ambush` (an Ambush landed) and `backstab` (one of his blows from behind landed), declared in `src/types/tallis.ts`; and the shared `cast`, `jump`, `dash` (each rise from the pool), `perfectDodge` (a blow in the Sink's first moment), `warp`, `block` and `parry`.

### t_backbiter: Backbiter

attack, precise, J. His knife blows from behind cut deeper.

Values: power: share more his knife blows from behind deal; refund: Gloam a kill from behind gives back; slow: seconds more a foe he struck from behind takes to turn; twice: 1 Cross from behind strikes twice; bleed: 1 Heel Kick from behind bleeds; lastBreath: 1 a blow from behind fells a minion or elite under 25% HP, and deals 3x to a mini boss under it (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.2 | Blows from behind deal 20% more. |
| 2 | refund 0 to 10 | A kill from behind gives 10 Gloam back. |
| 3 | power 0.2 to 0.4 | Blows from behind deal 40% more. |
| 4 | slow 0 to 0.2 | Foes struck from behind turn 0.2 s slower. |
| 5 | twice 0 to 1 | Cross from behind strikes twice. |
| 6 | power 0.4 to 0.7 | Blows from behind deal 70% more. |
| 7 | bleed 0 to 1 | Heel Kick from behind leaves a bleed. |
| 8 | power 0.7 to 1.5 | Blows from behind deal 150% more. |
| Evolved | lastBreath 0 to 1 | Blows from behind fell weakened foes. |

Evolution: **Last Breath** (partner `t_shroud`). A blow from behind fells a minion or elite under 25% HP outright; a mini boss under it takes 3x.

### t_ambush: Ambush

attack, precise, J. His Ambush, the first blow out of the Veil or out of the pool behind a foe, hits harder.

Values: power: share more an Ambush deals; gloam: Gloam an Ambush gives back; stun: seconds an Ambush stuns its foe; keep: 1 an Ambush that fells its foe keeps the Veil up; cleave: pixels round its foe an Ambush also cuts; window: seconds after a rise in which a blow is an Ambush; nightHunter: 1 an Ambush kill raises the Veil for free (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.4, window 0.5 | Ambush deals 40% more. |
| 2 | stun 0 to 0.6 | Ambush stuns for 0.6 s. |
| 3 | power 0.4 to 0.8 | Ambush deals 80% more. |
| 4 | keep 0 to 1 | An Ambush kill keeps the Veil up. |
| 5 | cleave 0 to 20 | Ambush also cuts foes within 20 px. |
| 6 | window 0.5 to 0.8 | The Ambush window after a rise is 0.8 s. |
| 7 | power 0.8 to 1.2, gloam 0 to 15 | An Ambush gives 15 Gloam back; 120% more. |
| 8 | power 1.2 to 2 | Ambush deals 200% more. |
| Evolved | nightHunter 0 to 1 | An Ambush kill raises the Veil for free. |

Evolution: **Night Hunter** (partner `t_quietStep`). A foe felled by an Ambush raises the Veil again for free.

### t_quickKnives: Quick Knives

attack, easy, J. His knife string strikes harder and faster, and starts throwing knives.

Values: power: share more his string blows deal; speed: share faster his blows play; heel: 1 Heel Kick throws a knife; all: 1 Flick and Cross throw knives too; pierce: foes a thrown knife passes through; knife: attack damage a thrown knife deals; range: pixels a thrown knife flies; storm: 1 every blow throws a fan of three knives (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.15, knife 0.5, range 50 | String blows deal 15% more. |
| 2 | speed 0 to 0.08 | Blows play 8% faster. |
| 3 | power 0.15 to 0.3 | String blows deal 30% more. |
| 4 | heel 0 to 1 | Heel Kick throws a knife 50 px. |
| 5 | all 0 to 1 | Flick and Cross throw knives too. |
| 6 | power 0.3 to 0.5 | String blows deal 50% more. |
| 7 | pierce 0 to 1 | Thrown knives pierce one foe. |
| 8 | power 0.5 to 0.9 | String blows deal 90% more. |
| Evolved | storm 0 to 1 | Every blow throws a fan of three knives. |

Evolution: **Knife Storm** (partner `t_needles`). Every blow of his string throws a fan of three knives.

### t_turnabout: Turnabout

attack, timed, J. Heel Kick spins the foe it strikes round, its back to him.

Values: chance: share of minions a Heel Kick turns round; hold: seconds a turned foe cannot turn back; stagger: seconds Heel Kick staggers; elites: 1 it turns elites too; daze: seconds a turned foe stands dazed; power: share more Heel Kick deals; pirouette: 1 Heel Kick turns every foe within 30 px and dazes them 1 s (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.25 | Heel Kick turns a minion round 25% of the time. |
| 2 | hold 0 to 0.5 | A turned foe cannot turn back for 0.5 s. |
| 3 | chance 0.25 to 0.5, power 0 to 0.2 | It turns a minion round 50% of the time; 20% more. |
| 4 | chance 0.5 to 1 | It always turns a minion round. |
| 5 | elites 0 to 1 | It turns elites round too. |
| 6 | daze 0 to 0.4 | Turned foes stand dazed 0.4 s. |
| 7 | power 0.2 to 0.4, stagger 0 to 0.5 | Heel Kick staggers foes 0.5 s; 40% more. |
| 8 | power 0.4 to 0.8 | Heel Kick deals 80% more. |
| Evolved | pirouette 0 to 1, daze 0.4 to 1 | Heel Kick turns all near foes round. |

Evolution: **Pirouette** (partner `t_sink`). Heel Kick turns every foe within 30 px round and dazes them for 1 s.

### t_plunge: Plunge

attack, timed, J. Drop Stab hits harder and shakes the floor where he lands.

Values: power: share more Drop Stab deals; ring: radius of a shock ring where it lands (0 for none); stun: seconds the ring stuns; spike: 1 it drives a foe in the air into the floor; jumpBack: 1 a Drop Stab that lands a hit gives his jump back; ring power is half the stab's; fallingNight: 1 a Drop Stab from the Veil keeps the Veil and its ring blinds 2 s (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.3 | Drop Stab deals 30% more. |
| 2 | ring 0 to 24 | Landing sends out a 24 px shock ring. |
| 3 | power 0.3 to 0.45 | Drop Stab deals 45% more. |
| 4 | spike 0 to 1 | Drop Stab spikes foes in the air. |
| 5 | jumpBack 0 to 1 | A Drop Stab hit gives the jump back. |
| 6 | ring 24 to 36, stun 0 to 0.4 | The ring reaches 36 px and stuns 0.4 s. |
| 7 | power 0.45 to 0.65 | Drop Stab deals 65% more. |
| 8 | power 0.65 to 1 | Drop Stab deals 100% more. |
| Evolved | fallingNight 0 to 1 | Drop Stab keeps the Veil; its ring blinds. |

Evolution: **Falling Night** (partner `t_nightLeap`). A Drop Stab from the Veil keeps the Veil up, and its ring blinds foes for 2 s.

### t_cutTendon: Cut Tendon

attack, timed, I. Hamstring cuts deeper and leaves the foes it trips open.

Values: power: share more Hamstring deals; tripBack: share more a tripped foe takes from his blows from behind; foes: foes one Hamstring trips; bleed: 1 Hamstring bleeds; stun: seconds more it trips; chill: 1 tripped foes are chilled; wave: 1 Hamstring runs along the floor as a 90 px wave (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.25, foes 1 | Hamstring deals 25% more. |
| 2 | tripBack 0 to 0.2 | Tripped foes take 20% more from behind. |
| 3 | power 0.25 to 0.4 | Hamstring deals 40% more. |
| 4 | foes 1 to 2 | Hamstring trips two foes. |
| 5 | bleed 0 to 1 | Hamstring leaves a bleed. |
| 6 | stun 0 to 0.3, chill 0 to 1 | Tripped foes stay down 0.3 s longer, chilled. |
| 7 | power 0.4 to 0.6 | Hamstring deals 60% more. |
| 8 | power 0.6 to 1 | Hamstring deals 100% more. |
| Evolved | wave 0 to 1, foes 2 to 9 | Hamstring runs along the floor as a wave. |

Evolution: **Crippling Line** (partner `t_openVeins`). Hamstring runs along the floor as a 90 px wave that trips every foe on it.

### t_sink: Deep Shadow

movement, timed, I. His shadow pool lasts longer and cuts the foes it passes under.

Values: longer: seconds more a Sink may last; pass: attack damage foes the pool passes under take, once each per Sink; rising: share more Rising Cut deals; sinks: Sinks before the wait; cheaper: share less stamina a Sink spends; power: share more the pool's cut and Rising Cut deal; tide: 1 the first foe he rises behind is dragged down and stunned 1 s (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | longer 0.3, sinks 1 | Sink lasts 0.3 s longer. |
| 2 | pass 0 to 0.4 | Foes the pool passes under take 0.4x. |
| 3 | rising 0 to 0.5 | Rising Cut deals 50% more. |
| 4 | sinks 1 to 2 | Two Sinks before the wait. |
| 5 | cheaper 0 to 0.3 | Sink spends 30% less stamina. |
| 6 | longer 0.3 to 0.5 | Sink lasts 0.5 s longer. |
| 7 | pass 0.4 to 0.7 | Foes the pool passes under take 0.7x. |
| 8 | power 0 to 0.6 | The pool and Rising Cut deal 60% more. |
| Evolved | tide 0 to 1 | The foe he rises behind is dragged down. |

Evolution: **Shadow Tide** (partner `t_ambush`). The first foe he rises behind is dragged down into the pool and stunned for 1 s.

### t_quietStep: Quiet Step

movement, timed, J. His warp steps out of the foe's shadow quieter: veiled longer, more often, and cutting on the way.

Values: breath: seconds more he stays veiled after a warp; refund: Gloam a warp gives; path: attack damage foes the thrown knife passes through take; charges: warps in a row before the recharge; ambush: 1 the veil after a warp primes an Ambush; blind: seconds the arrival blinds minions within 40 px; phantom: 1 the arrival leaves a cloud of smoke (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | breath 0.3, charges 1 | His warp leaves him veiled 0.3 s longer. |
| 2 | refund 0 to 8 | A warp gives 8 Gloam back. |
| 3 | path 0 to 0.5 | The thrown knife cuts foes it passes, 0.5x. |
| 4 | charges 1 to 2 | Two warps in a row. |
| 5 | ambush 0 to 1 | The veil after a warp primes an Ambush. |
| 6 | blind 0 to 1 | Arriving blinds near minions 1 s. |
| 7 | path 0.5 to 0.8, breath 0.3 to 0.6 | The knife cuts for 0.8x; veiled 0.6 s longer. |
| 8 | charges 2 to 3 | Three warps in a row. |
| Evolved | phantom 0 to 1 | A warp leaves a cloud of smoke. |

Evolution: **Phantom Step** (partner `t_nightLeap`). Every warp leaves a cloud of smoke (0.7 of a Smoke Knot's width, 2 s) where he steps out, hiding him and blinding the minions in it.

### t_nightLeap: Night Leap

movement, timed, jump. He can jump again in the air while veiled or just after a rise.

Values: leaps: jumps in the air; smoke: 1 the leap blinds minions under it for 1 s; keep: 1 the leap keeps the Veil; rise: pixels the leap rises; drop: share more a Drop Stab after a leap deals; window: seconds after a rise the leap stays open; raven: 1 every Drop Stab after a leap is an Ambush (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | leaps 1, rise 40, window 0.5 | One more jump in the air while veiled or just after a rise. |
| 2 | smoke 0 to 1 | The leap blinds minions under it 1 s. |
| 3 | keep 0 to 1 | The leap keeps the Veil. |
| 4 | rise 40 to 56 | The leap rises higher. |
| 5 | drop 0 to 0.4 | Drop Stab after a leap deals 40% more. |
| 6 | window 0.5 to 0.8 | The leap stays open 0.8 s after a rise. |
| 7 | drop 0.4 to 0.6 | Drop Stab after a leap deals 60% more. |
| 8 | leaps 1 to 2 | Two extra jumps. |
| Evolved | raven 0 to 1 | Drop Stab after a leap is an Ambush. |

Evolution: **Raven Drop** (partner `t_plunge`). Every Drop Stab after a Night Leap lands as an Ambush.

### t_needles: Needle Fan

spell, easy, I. A spell on I: a fan of needles thrown ahead.

Values: mp: MP; cooldown: seconds; count: needles; power: ability power each deals; range: pixels they fly; pierce: 1 they pierce; bleed: 1 they bleed; chill: 1 they chill; ironRain: 1 needles also fall from above on every foe on screen (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 16, cooldown 5, count 5, power 0.6, range 90 | A fan of 5 needles out to 90 px, 0.6x each. |
| 2 | pierce 0 to 1 | Needles pierce. |
| 3 | power 0.6 to 0.75 | Needles deal 0.75x. |
| 4 | count 5 to 7 | 7 needles. |
| 5 | bleed 0 to 1 | Needles leave a bleed. |
| 6 | cooldown 5 to 3.5 | Recharges in 3.5 s. |
| 7 | power 0.75 to 0.8, chill 0 to 1 | Needles chill; 0.8x. |
| 8 | power 0.8 to 0.96 | Needles deal 0.96x. |
| Evolved | ironRain 0 to 1 | Needles also fall on every foe on screen. |

Evolution: **Iron Rain** (partner `t_quickKnives`). Every cast also drops needles from above on every foe on screen.

### t_markDusk: Mark of Dusk

spell, precise, I. A spell on I: marks the nearest foe so every hit on it counts as from behind.

Values: mp: MP; cooldown: seconds; life: seconds a mark lasts; pass: 1 the mark passes to the nearest foe when its foe dies; gloam: 1 his blows on a marked foe give double Gloam; marks: foes marked at once; taken: share more a marked foe takes; sentence: 1 a marked foe under 30% HP dies at once, a mini boss takes 3x (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 20, cooldown 8, life 4, marks 1 | Mark the nearest foe 4 s: every hit on it is from behind. |
| 2 | cooldown 8 to 6 | Recharges in 6 s. |
| 3 | pass 0 to 1 | The mark passes on when its foe dies. |
| 4 | life 4 to 6 | Marks last 6 s. |
| 5 | gloam 0 to 1 | Blows on a marked foe give double Gloam. |
| 6 | marks 1 to 2 | Two foes are marked. |
| 7 | taken 0 to 0.2 | Marked foes take 20% more. |
| 8 | taken 0.2 to 0.4 | Marked foes take 40% more. |
| Evolved | sentence 0 to 1 | Marked foes under 30% HP die. |

Evolution: **Death Sentence** (partner `t_backbiter`). A marked foe that falls under 30% HP dies at once; a mini boss takes 3x instead.

### t_caltrops: Caltrops

spell, timed, I. A spell on I: a strip of caltrops on the floor that cuts the foes on it.

Values: mp: MP; cooldown: seconds; width: pixels; life: seconds; power: ability power each cut deals every 0.5 s; slow: 1 foes on them are slowed; still: 1 foes on them cannot turn; ignite: 1 they add Nightshade; trip: seconds a foe first stepping on a strip lies tripped; thornRoad: 1 every Sink path leaves caltrops (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 18, cooldown 7, width 60, life 5, power 0.3 | Caltrops 60 px wide for 5 s, 0.3x each 0.5 s. |
| 2 | slow 0 to 1 | Foes on them are slowed. |
| 3 | power 0.3 to 0.4 | Caltrops cut for 0.4x. |
| 4 | width 60 to 90 | Caltrops spread 90 px. |
| 5 | still 0 to 1 | Foes on them cannot turn. |
| 6 | ignite 0 to 1 | Caltrops add Nightshade. |
| 7 | power 0.4 to 0.45, trip 0 to 0.3 | A foe stepping on them trips 0.3 s once; 0.45x. |
| 8 | power 0.45 to 0.54 | Caltrops cut for 0.54x. |
| Evolved | thornRoad 0 to 1 | Every Sink path leaves caltrops. |

Evolution: **Thorn Road** (partner `t_nightshade`). Every Sink path leaves a strip of caltrops behind it.

### t_openVeins: Open Veins

dot, easy, auto. His blows from behind leave a Bleed that stacks.

Values: damage: attack damage a stack deals a second; max: most stacks; life: seconds stacks last; front: 1 blows from the front add stacks too; gloam: Gloam a hit on a bleeding foe gives; slow: 1 bleeding foes are slowed; spread: 1 Bleed passes to the nearest foe when its foe dies; burst: 1 a foe at most stacks bursts, 1.0x per stack to foes within 30 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | damage 0.06, max 5, life 4 | Blows from behind add a Bleed, 0.06x a second. |
| 2 | front 0 to 1 | Blows from the front add Bleed too. |
| 3 | max 5 to 10 | Up to 10 stacks. |
| 4 | gloam 0 to 2 | A hit on a bleeding foe gives 2 Gloam. |
| 5 | damage 0.06 to 0.1, slow 0 to 1 | Bleeding foes are slowed; 0.1x. |
| 6 | damage 0.1 to 0.14 | Bleed deals 0.14x. |
| 7 | life 4 to 6, spread 0 to 1 | Bleed spreads when its foe dies; 6 s. |
| 8 | damage 0.14 to 0.2 | Bleed deals 0.2x. |
| Evolved | burst 0 to 1 | A foe at most Bleed bursts. |

Evolution: **Exsanguinate** (partner `t_nightshade`). A foe at most Bleed bursts, 1.0x per stack to every foe within 30 px.

### t_nightshade: Nightshade

dot, timed, J. Heel Kick, the last blow of his string, poisons with Nightshade.

Values: stacks: stacks the third blow adds; damage: ability power a stack deals a second; max: most stacks; life: seconds; slow: 1 poisoned foes are slowed; spread: 1 a poisoned foe that dies passes it on; rising: 1 Rising Cut adds stacks; burst: ability power a poisoned foe bursts for on death, within 20 px; lotus: 1 Hamstring coats every foe within 40 px with full stacks (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stacks 2, damage 0.12, max 6, life 4 | The third blow adds 2 Nightshade, 0.12x a second. |
| 2 | stacks 2 to 3 | It adds 3 stacks. |
| 3 | slow 0 to 1 | Poisoned foes are slowed. |
| 4 | spread 0 to 1 | It spreads when its foe dies. |
| 5 | damage 0.12 to 0.2 | Nightshade deals 0.2x. |
| 6 | rising 0 to 1 | Rising Cut adds stacks. |
| 7 | damage 0.2 to 0.27, burst 0 to 0.5 | A poisoned foe that dies bursts; 0.27x. |
| 8 | damage 0.27 to 0.35 | Nightshade deals 0.35x. |
| Evolved | lotus 0 to 1 | Hamstring coats near foes in full. |

Evolution: **Black Lotus** (partner `t_cutTendon`). Hamstring coats every foe within 40 px with full Nightshade.

### t_inkWound: Ink Wound

dot, precise, J. An Ambush leaves Ink in its foe's wound.

Values: damage: attack damage Ink deals a second; life: seconds; slow: 1 Inked foes are slowed; spread: 1 Ink passes to the nearest foe when its foe dies; still: 1 Inked foes cannot turn; back: share more an Inked foe takes from behind; spreading: 1 an Ambush Inks every foe within 60 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | damage 0.2, life 3 | An Ambush leaves Ink, 0.2x a second for 3 s. |
| 2 | life 3 to 5, slow 0 to 1 | Ink lasts 5 s and slows. |
| 3 | spread 0 to 1 | Ink spreads when its foe dies. |
| 4 | still 0 to 1 | Inked foes cannot turn. |
| 5 | damage 0.2 to 0.3 | Ink deals 0.3x. |
| 6 | damage 0.3 to 0.4 | Ink deals 0.4x. |
| 7 | damage 0.4 to 0.5 | Ink deals 0.5x. |
| 8 | back 0 to 0.2 | Inked foes take 20% more from behind. |
| Evolved | spreading 0 to 1 | An Ambush Inks every near foe. |

Evolution: **Spreading Night** (partner `t_ambush`). An Ambush Inks every foe within 60 px.

### t_crows: Gloam Crows

summon, easy, auto. A blow from behind may send crows diving at foes.

Values: chance: chance a blow from behind sends them; cooldown: seconds between flocks; count: crows; power: attack damage each dive deals; blind: seconds a dive blinds its foe; circle: seconds they circle him after; bleed: 1 their dives bleed; murder: 1 every cast on I sends a flock (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.15, cooldown 2, count 3, power 0.4 | 15%: three crows dive at foes, 0.4x each. |
| 2 | chance 0.15 to 0.25 | 25% chance. |
| 3 | count 3 to 5 | Five crows. |
| 4 | blind 0 to 0.5 | Crows blind for 0.5 s. |
| 5 | power 0.4 to 0.6 | Crows deal 0.6x. |
| 6 | circle 0 to 5 | Crows circle him for 5 s and dive again. |
| 7 | power 0.6 to 0.8, bleed 0 to 1 | Crow dives bleed; 0.8x. |
| 8 | power 0.8 to 1 | Crows deal 1.0x. |
| Evolved | murder 0 to 1 | Every cast on I sends a flock. |

Evolution: **Murder of Crows** (partner `t_needles`). Every cast on I sends a flock as well.

### t_double: Shadow Double

summon, timed, K. A Fade (his parry) or a rise from the pool may call a shade of him behind the nearest foe.

Values: chance: chance a Fade or a rise calls it; stabs: stabs it strikes; power: attack damage a stab deals, from behind; linger: seconds it stays after, stabbing again; shades: shades called; stun: seconds its last stab on a foe stuns; twoMoons: 1 every Fade and every rise calls one (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.2, stabs 3, power 0.5, shades 1 | 20%: a shade stabs the nearest foe 3 times from behind, 0.5x. |
| 2 | chance 0.2 to 0.35 | 35% chance. |
| 3 | stabs 3 to 4 | Four stabs. |
| 4 | linger 0 to 3 | The shade lingers 3 s. |
| 5 | power 0.5 to 0.7 | Stabs deal 0.7x. |
| 6 | shades 1 to 2 | Two shades. |
| 7 | power 0.7 to 0.9, stun 0 to 0.5 | The last stab stuns 0.5 s; 0.9x. |
| 8 | chance 0.35 to 0.55 | 55% chance. |
| Evolved | twoMoons 0 to 1 | Every Fade and rise calls a shade. |

Evolution: **Two Moons** (partner `t_sink`). Every Fade and every rise from the pool leaves a shade behind the nearest foe.

### t_wraith: Hollow Wraith

summon, timed, auto. A foe he fells from behind may rise as a wraith that fights for him.

Values: chance: chance a kill from behind raises one; cooldown: seconds between wraiths; life: seconds it fights; power: attack damage a slash deals; bleed: 1 its slashes bleed; blind: seconds a slash blinds a minion; burst: attack damage it bursts for as it ends, within 24 px; wraiths: wraiths that may stand at once; legion: 1 every kill from behind raises one, and its slashes bleed (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.25, cooldown 2, life 4, power 0.5, wraiths 1 | 25%: a wraith slashes for 4 s, 0.5x every 0.6 s. |
| 2 | chance 0.25 to 0.4 | 40% chance. |
| 3 | bleed 0 to 1 | Wraith slashes bleed. |
| 4 | life 4 to 6 | Wraiths fight for 6 s. |
| 5 | power 0.5 to 0.7, blind 0 to 0.5 | Slashes blind minions 0.5 s; 0.7x. |
| 6 | wraiths 1 to 2 | Two wraiths at once. |
| 7 | power 0.7 to 0.9, burst 0 to 1 | A wraith bursts as it ends; 0.9x. |
| 8 | power 0.9 to 1.2 | Slashes deal 1.2x. |
| Evolved | legion 0 to 1, wraiths 2 to 4, cooldown 2 to 0 | Every kill from behind raises a wraith. |

Evolution: **Legion of Dusk** (partner `t_openVeins`). Every kill from behind raises a wraith, and its slashes bleed.

### t_shroud: Shroud

passive, easy, auto. More Gloam, faster refills and a cheaper Veil.

Values: max: Gloam the bar holds more; refill: share faster Gloam refills; cost: Gloam less to raise the Veil; trickle: Gloam a second even while seen; drain: share less the Veil drains; endless: 1 the Veil does not drain while he stands still (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | max 20, refill 0.25 | Gloam holds 20 more and refills 25% faster. |
| 2 | cost 0 to 5 | The Veil costs 5 less. |
| 3 | trickle 0 to 1 | 1 Gloam a second even while seen. |
| 4 | drain 0 to 0.2 | The Veil drains 20% less. |
| 5 | crit +0.03 (a stat) | Crit +3%. |
| 6 | refill 0.25 to 0.4 | Gloam refills 40% faster. |
| 7 | max 20 to 30 | Gloam holds 30 more. |
| 8 | refill 0.4 to 0.6 | Gloam refills 60% faster. |
| Evolved | endless 0 to 1 | The Veil holds while he stands still. |

Evolution: **Endless Night** (partner `t_quietStep`). The Veil does not drain while he stands still.

### t_gloaming: Gloaming

ultimate, timed, U. His Gloaming visits more foes, strikes each more often and leaves him in the Veil.
It upgrades his special through `ultimateValues()`; the plain special's stab is the charge level's power x 0.25 x (AD + AP), from behind.

Values: power: share of the charge level's power each stab deals; more: foes visited more at every charge level; hits: stabs on each foe; veil: seconds of free Veil he returns in, his next blow an Ambush; stun: seconds struck minions lie stunned; refill: 1 Gloam refills in full; smoke: 1 a Smoke Knot rises where he returns; stage: 1 every foe on the stage is visited (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.25, more 1, hits 1 | Gloaming visits one more foe; stabs deal 1.25x. |
| 2 | veil 0 to 2 | He returns veiled for 2 s; his next blow is an Ambush. |
| 3 | hits 1 to 2 | Each foe is struck twice. |
| 4 | stun 0 to 1 | Struck minions lie stunned 1 s. |
| 5 | more 1 to 2, power 1.25 to 1.6 | Two more foes; stabs deal 1.6x. |
| 6 | refill 0 to 1 | Gloam refills in full. |
| 7 | smoke 0 to 1, power 1.6 to 2 | A Smoke Knot rises where he returns; 2x. |
| 8 | hits 2 to 3 | Each foe is struck three times. |
| Evolved | stage 0 to 1, hits 3 to 4, power 2 to 3.75 | The whole stage; every foe struck 4 times. |

On one foe, level 8 deals 2 x 3 = 6 times the plain special, and evolved 3.75 x 4 = 15 times.

Evolution: **Night Without End** (partner `t_shroud`). The whole stage goes dark, and every foe on it is struck four times.

## Shape check

The contract asks that at least four of a skill's seven level ups add a new property and that the rest are large number steps.
The table counts, from the data, the level ups that turn a value on from 0 or add another foe, needle, mark, shade, wraith, Sink, warp, stab, leap or hit (a new property), and those that only raise a number; Shroud's crit step adds a stat.

| Skill | Level ups adding a property | Number steps |
| --- | --- | --- |
| Backbiter | 4 | 3 |
| Ambush | 4 | 3 |
| Quick Knives | 4 | 3 |
| Turnabout | 5 | 2 |
| Plunge | 4 | 3 |
| Cut Tendon | 4 | 3 |
| Deep Shadow | 5 | 2 |
| Quiet Step | 6 | 1 |
| Night Leap | 4 | 3 |
| Needle Fan | 4 | 3 |
| Mark of Dusk | 4 | 3 |
| Caltrops | 4 | 3 |
| Open Veins | 4 | 3 |
| Nightshade | 4 | 3 |
| Ink Wound | 4 | 3 |
| Gloam Crows | 4 | 3 |
| Shadow Double | 4 | 3 |
| Hollow Wraith | 4 | 3 |
| Shroud | 4 | 3 |
| Gloaming | 6 | 1 |
