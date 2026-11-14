# Zafir's skills

Zafir's 20 skills, as designed and as built.
The contract is `docs/skill-design.md`; the hero is described in `docs/heroes/zafir.md`.
Rows live in `src/heroes/zafir/constants/skills/`, one file per skill; code paths below are under `src/heroes/zafir/`.
Icons are in `src/heroes/zafir/ui/icons/` (`skills.ts`, and `evolved.ts` for every evolution).
Numbers in the rows are multiples of attack damage (AD) or ability power (AP) as each skill's values say.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J tapped | Four spins that cut in front and behind, the last a hop spin that throws foes up; he walks through them at 55% of his walk. In the air, one spinning descent. While the scimitar is thrown, a catch cut |
| J held | The shared warp; the arrival spins and cuts both sides, opens a wound round him and adds 12 Whirl |
| K | A veil of sand (25% through, 14 stamina); a parry leaves a mirage that minions strike at and that bursts into sand blades |
| L | The shared front dodge |
| I | Sandspout or the crescent throw, held for the wide form; cast just after a blow of an open string it goes at once and the string carries on |
| O | Switch ability |
| U | Sandstorm, a storm that follows him |
| auto | Every hit of his own opens a wound and feeds the Whirl; at 40 and 80 Whirl a sand ring cuts round him |

## The 20 skills

| Skill | Id | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| Whirling Edge | `za_whirling` | attack | easy | J | Unbroken Whirl | Endless Turn |
| Sirocco Timing | `za_sirocco` | attack | precise | J | Mirage Dancer | Desert Noon |
| Opened Veins | `za_veins` | attack | timed | J | Deep Wounds | Red Wind |
| Two-Faced Cut | `za_twofaced` | attack | timed | J | Dune Walk | Mirror Dance |
| Falling Dune | `za_falling` | attack | timed | jump | Quicksand | Meteor Dune |
| Dune Walk | `za_dune` | movement | easy | J | Two-Faced Cut | Shifting Sands |
| Whirlwind Arrival | `za_arrival` | movement | timed | J | Sirocco Timing | Dust Devil Step |
| Sand Slip | `za_slip` | movement | timed | L | Mirage Dancer | Mirage Slip |
| Hot Gale | `za_gale` | spell | easy | I | Deep Wounds | Simoom |
| Glass Rain | `za_glass` | spell | timed | I | Hot Gale | Glass Storm |
| Quicksand | `za_quicksand` | spell | easy | I | Falling Dune | Sinking Sea |
| Deep Wounds | `za_deep` | dot | easy | auto | Opened Veins | Crimson Tide |
| Scouring Sand | `za_scour` | dot | timed | auto | Unbroken Whirl | Glassing Wind |
| Desert Thirst | `za_thirst` | dot | timed | auto | Desert Hawk | Thirst of the Hawk |
| Sand Wraith | `za_wraith` | summon | easy | auto | Dune Walk | Wraith Caravan |
| Mirage Dancer | `za_mirage` | summon | precise | K | Sand Slip | Court of Mirages |
| Desert Hawk | `za_hawk` | summon | timed | auto | Desert Thirst | Sky of Hawks |
| Unbroken Whirl | `za_unbroken` | passive | easy | auto | Whirling Edge | Eye of the Dune |
| Sand Veil | `za_veil` | passive | timed | K | Sand Slip | Wall of Dunes |
| Sandstorm | `za_storm` | ultimate | easy | U | Whirling Edge | Endless Sirocco |

Kinds: attack 5, movement 3, spell 3, dot 3, summon 3, passive 2, ultimate 1.
Every kind meets its least count (attack 4, movement 3, spell 3, damage over time 3, summon 3, ultimate 1).

### Whirling Edge (`za_whirling`)

Attack, easy, on J. Your spins hit harder and reach farther, then throw sand crescents out both sides.
Code: kit: `game/stringSkills.ts` (`shapeSpin`, `cyclonePull`, crescents), `game/skillHooks.ts`, `game/whirl.ts` (Endless Turn).
Values: `bonus` added damage share on every spin, `reach` spin reach multiple, `crescent` attack damage of each sand crescent a spin's last blow throws out both sides, `pull` the cyclone draws foes in first, `pierce` crescents pass through every foe.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Spins deal 15% more. | bonus 0.15 |
| 2 | Spins +15% to +30%. | bonus 0.3 |
| 3 | New: each spin throws a sand crescent out both sides. | crescent 0.35 |
| 4 | New: spins reach 20% farther. | reach 1.2 |
| 5 | Spins +30% to +35%; crescents 0.35 to 0.4. | bonus 0.35, crescent 0.4 |
| 6 | New: the cyclone pulls foes in before it throws them up. | pull 1 |
| 7 | New: crescents pierce every foe in their way. | pierce 1 |
| 8 | Spins +35% to +45%; crescents 0.4 to 0.5. | bonus 0.45, crescent 0.5 |
| Evolved: Endless Turn (with Unbroken Whirl) | At full Whirl every spin throws two crescents each way, and while you spin the ring never drops below its first turn. | double 1, hold 1 |

### Sirocco Timing (`za_sirocco`)

Attack, precise, on J. A Keen spin hits much harder on the foe it reaches first, then sends a hot gust after it.
Code: kit: `game/stringSkills.ts` (gust, Desert Noon, `keenWindow`), `game/skillHooks.ts`.
Values: `keen` added damage share of a Keen spin on the foe its payoff lands on, `wave` attack damage of the hot gust a Keen spin sends after that foe, `window` the Keen window in seconds, `streak` added share per Keen spin in a row up to `streakCap`, `whirl` Whirl a Keen spin adds, `noon` attack damage of Desert Noon's ring every `noonEvery` Keen spins in a row.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | A Keen spin deals 40% more to the foe it reaches first. | keen 0.4 |
| 2 | Keen bonus 40% to 70%. | keen 0.7 |
| 3 | New: a Keen spin sends a hot gust after that foe. | wave 0.8 |
| 4 | New: the Keen window is half again as long. | window 0.15 |
| 5 | New: each Keen spin in a row adds 15%, up to 60%. | streak 0.15, streakCap 0.6 |
| 6 | Keen bonus 70% to 150%; gust 0.8 to 1.6. | keen 1.5, wave 1.6 |
| 7 | New: a Keen spin adds 20 Whirl. | whirl 20 |
| 8 | Keen bonus 150% to 500%; gust 1.6 to 4. | keen 5, wave 4 |
| Evolved: Desert Noon (with Mirage Dancer) | Every third Keen spin in a row calls a blazing ring of noon light on the foe it reached, for 24 times attack damage. | noon 24, noonEvery 3 |

### Opened Veins (`za_veins`)

Attack, timed, on J. The cyclone hits harder for each wound on the foe, then tears the wounds open.
Code: `game/skills/openedVeins.ts`, `game/skillHooks.ts`.
Values: `perWound` added damage share of the cyclone (and from level 4 the twin turn) for each wound on the foe, `twin` the twin turn counts too, `tear` attack damage each wound deals when the cyclone tears it open, `spread` a foe the cyclone fells passes its wounds on, `splash` share of a tear that cuts the foes beside it, `red` attack damage of the wound every spin's blow tears open once evolved.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | The cyclone deals 10% more for each wound on the foe. | perWound 0.1 |
| 2 | Per wound 10% to 15%. | perWound 0.15 |
| 3 | New: the cyclone tears the wounds open, 0.3 each. | tear 0.3 |
| 4 | New: the twin turn also hits harder per wound. | twin 1 |
| 5 | Per wound 15% to 22%. | perWound 0.22 |
| 6 | New: a foe the cyclone fells passes its wounds to foes beside it. | spread 1 |
| 7 | New: each wound torn open also cuts the foes beside it for half; tear 0.3 to 0.5. | tear 0.5, splash 0.5 |
| 8 | Per wound 22% to 45%; tear 0.5 to 1.2. | perWound 0.45, tear 1.2 |
| Evolved: Red Wind (with Deep Wounds) | Every spin tears one wound open on each foe it cuts, for 1.2 times attack damage. | red 1.2 |

### Two-Faced Cut (`za_twofaced`)

Attack, timed, on J. Your spins hit harder on foes behind you, and cutting both sides at once pays off.
Code: kit: `game/skillHooks.ts`, `game/stringSkills.ts` (both sides), `game/landed.ts`.
Values: `behind` added damage share on a foe behind him, `wounds` extra wounds a cut behind opens, `both` Whirl a spin adds when it cuts both sides at once, `keenBoth` that spin makes the next one Keen, `bothWounds` it opens a wound on every foe it cut, `backAll` foes behind him take his cuts as back attacks.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Spins deal 20% more to foes behind you. | behind 0.2 |
| 2 | Behind 20% to 35%. | behind 0.35 |
| 3 | New: a cut behind you opens an extra wound. | wounds 1 |
| 4 | New: a spin that cuts both sides at once adds 10 Whirl. | both 10 |
| 5 | Behind 35% to 55%. | behind 0.55 |
| 6 | New: a spin that cuts both sides makes the next spin Keen. | keenBoth 1 |
| 7 | New: cutting both sides opens a wound on every foe cut. | bothWounds 1 |
| 8 | Behind 55% to 90%; 20 Whirl for both sides. | behind 0.9, both 20 |
| Evolved: Mirror Dance (with Dune Walk) | Foes behind you take your cuts as back attacks, half again as hard. | backAll 0.5 |

### Falling Dune (`za_falling`)

Attack, timed, on jump. The spinning descent hits harder and lands in a wider ring that throws foes up.
Code: kit: `game/chooseMove.ts`, `game/moves/air.ts`, `game/spells/meteor.ts`.
Values: `air` added damage share of the descent, `ringReach` reach multiple of the landing ring, `descents` descents per jump, `ringLaunch` the landing ring throws foes up this fast, `ringWounds` wounds the ring opens, `ringPower` its power multiple, `meteor` the landing raises a sandspout each way and a pit of quicksand.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | The spinning descent deals 25% more. | air 0.25 |
| 2 | Descent +25% to +45%. | air 0.45 |
| 3 | New: the landing ring reaches half again as far. | ringReach 1.5 |
| 4 | New: two descents per jump. | descents 2 |
| 5 | Descent +45% to +70%. | air 0.7 |
| 6 | New: the landing ring throws foes up. | ringLaunch 220 |
| 7 | New: the landing ring opens two wounds. | ringWounds 2 |
| 8 | Descent +70% to +90%; the ring hits half again as hard. | air 0.9, ringPower 1.5 |
| Evolved: Meteor Dune (with Quicksand) | The landing throws up a sandspout each way and leaves a pit of quicksand under you. | meteor 1 |

### Dune Walk (`za_dune`)

Movement, easy, on J. Walk faster through your spins, leaving a trail of sand that cuts.
Code: `game/skills/duneWalk.ts`, `game/walkThrough.ts`.
Values: `walk` share of his walk speed while he spins, `trail` attack damage the sand trail he leaves while walking through a spin deals to each foe on it every 0.3 s, `trailWounds` wounds it opens, `trailWide` its width multiple, `trailHalt` seconds it holds a walker's feet, `trailLife` its life multiple.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Walk through your spins at 70% speed. | walk 0.7 |
| 2 | Walk 70% to 85%. | walk 0.85 |
| 3 | New: walking through a spin leaves a sand trail that cuts foes on it. | trail 0.25 |
| 4 | Walk at full speed through your spins. | walk 1 |
| 5 | New: the trail opens a wound. | trailWounds 1 |
| 6 | New: the trail spreads twice as wide; trail 0.25 to 0.4. | trailWide 2, trail 0.4 |
| 7 | New: the trail holds walkers' feet. | trailHalt 0.6 |
| 8 | Trail 0.4 to 0.65; it lasts twice as long. | trail 0.65, trailLife 2 |
| Evolved: Shifting Sands (with Two-Faced Cut) | Walk through your spins at run speed; the trail opens two wounds. | walk 1.8, trailWounds 2 |

### Whirlwind Arrival (`za_arrival`)

Movement, timed, on J. Your warp arrives in a wider spin that feeds the Whirl, and its thrown scimitar cuts on the way.
Code: kit: `game/warpStyle.ts` (`tune` and the arrival).
Values: `reach` reach multiple of the arrival spin, `whirl` Whirl it adds, `path` attack damage the thrown scimitar deals to foes it passes, `strike` the arrival blow's power, `wounds` extra wounds the arrival opens, `charges` warps in a row, `ring` the arrival fills the Whirl to the first ring, `cost` MP a warp costs, `keen` the arrival is always Keen.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | The arrival spin reaches 20% farther and adds 10 more Whirl. | reach 1.2, whirl 10 |
| 2 | New: the thrown scimitar cuts foes it passes. | path 0.5 |
| 3 | New: the arrival opens one more wound. | wounds 1 |
| 4 | New: two warps in a row. | charges 2 |
| 5 | Path cut 0.5 to 0.8; the arrival 1.8 to 2.4. | path 0.8, strike 2.4 |
| 6 | New: the arrival fills the Whirl to the first ring. | ring 1 |
| 7 | Warps cost 10 to 7 MP. | cost 7 |
| 8 | Path cut 0.8 to 1.6; the arrival 2.4 to 3; reach 20% to 40%. | path 1.6, strike 3, reach 1.4 |
| Evolved: Dust Devil Step (with Sirocco Timing) | The arrival is always Keen and leaves every foe round you with three more wounds. | keen 1, wounds 3 |

### Sand Slip (`za_slip`)

Movement, timed, on L. A dodge through a foe cuts it and opens wounds, and leaves a cloud of sand behind.
Code: kit: `game/slip.ts`; `game/skills/sandSlip.ts`.
Values: `passCut` attack damage of the cut on each foe the dodge passes through, `passWounds` wounds it opens, `cloud` seconds the sand cloud the dodge leaves blinds minions, `perfectWhirl` Whirl a perfect dodge fills to, `air` the dodge works in the air, `mirage` every dodge leaves a mirage.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | A dodge through a foe cuts it. | passCut 0.6 |
| 2 | Cut 0.6 to 0.9. | passCut 0.9 |
| 3 | New: the cut opens two wounds. | passWounds 2 |
| 4 | New: a dodge leaves a cloud of sand that blinds minions in it. | cloud 1.2 |
| 5 | New: a perfect dodge fills the Whirl to its top ring. | perfectWhirl 80 |
| 6 | Cut 0.9 to 1.8. | passCut 1.8 |
| 7 | New: dodge in the air. | air 1 |
| 8 | Cut 1.8 to 5; three wounds; the cloud blinds twice as long. | passCut 5, passWounds 3, cloud 2.4 |
| Evolved: Mirage Slip (with Mirage Dancer) | Every dodge leaves a mirage where it started, which minions strike at and which bursts into sand blades. | mirage 1 |

### Hot Gale (`za_gale`)

Spell, easy, on I. Learn Hot Gale on I: a cone of hot wind that cuts and pushes every foe in it. Held, it blows both ways.
Code: `game/spells/gale.ts`.
Values: `power` ability power of the gale's cut, `recharge` seconds, `wounds` wounds it opens, `reach` reach multiple of the cone, `halt` seconds walkers it hits stand held, `both` it always blows both ways.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Learn Hot Gale: a cone of hot wind that cuts and pushes foes. | power 1.0, recharge 4 |
| 2 | Power 1 to 1.4. | power 1.4 |
| 3 | New: the gale opens a wound on each foe. | wounds 1 |
| 4 | New: the cone reaches 30% farther. | reach 1.3 |
| 5 | New: walkers it hits stand held 1 s. | halt 1 |
| 6 | Power 1.4 to 3.5; recharge 4 to 3 s. | power 3.5, recharge 3 |
| 7 | New: the gale blows both ways. | both 1 |
| 8 | Power 3.5 to 7; two wounds. | power 7, wounds 2 |
| Evolved: Simoom (with Deep Wounds) | Every open wound the gale meets bleeds out at once, for all it would have bled. | level 8 row |

### Glass Rain (`za_glass`)

Spell, timed, on I. Learn Glass Rain on I: shards of fused sand fall on the ground ahead and shatter on what they meet. Held, twice as many over twice the ground.
Code: `game/spells/glass.ts`.
Values: `shards` shards a cast drops, `power` ability power of each, `recharge` seconds, `splash` pixels added to a shard's shatter, `aim` shards fall on the nearest foes ahead, `wounds` wounds a shard opens.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Learn Glass Rain: shards of glass fall on the ground ahead. | shards 3, power 0.9, recharge 4.5 |
| 2 | Power 0.9 to 1.2. | power 1.2 |
| 3 | New: shards shatter wider. | splash 6 |
| 4 | New: a fourth shard. | shards 4 |
| 5 | Power 1.2 to 2. | power 2 |
| 6 | New: shards fall on the nearest foes ahead. | aim 1 |
| 7 | New: each shard opens a wound; five shards. | wounds 1, shards 5 |
| 8 | Power 2 to 4; recharge 4.5 to 3.5 s. | power 4, recharge 3.5 |
| Evolved: Glass Storm (with Hot Gale) | A second rain falls behind you on the nearest foes there. | level 8 row |

### Quicksand (`za_quicksand`)

Spell, easy, on I. Learn Quicksand on I: a pit opens ahead that holds walkers, pulls them in and cuts them. Held, under your own feet and wider.
Code: `game/spells/quicksand.ts`.
Values: `power` ability power of each cut, `life` seconds the pit lasts, `recharge` seconds, `reach` its width multiple, `mark` share more damage foes in it take, `sink` seconds each cut knocks them down, `wounds` wounds each cut opens, `spout` ability power of the sandspout the Sinking Sea throws up on each cut.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Learn Quicksand: a pit ahead holds walkers and pulls them in. | power 0.35, life 2, recharge 5 |
| 2 | Power 0.35 to 0.5; it lasts 2.5 s. | power 0.5, life 2.5 |
| 3 | New: the pit is a third wider. | reach 1.33 |
| 4 | New: foes in the pit take 15% more from everything. | mark 0.15 |
| 5 | Power 0.5 to 0.7; it lasts 3 s. | power 0.7, life 3 |
| 6 | New: each cut pulls foes under for a moment. | sink 0.3 |
| 7 | New: each cut opens a wound. | wounds 1 |
| 8 | Power 0.7 to 1.5; foes in it take 25% more. | power 1.5, mark 0.25 |
| Evolved: Sinking Sea (with Falling Dune) | Each cut of the pit throws a sandspout up out of its middle. | spout 0.6 |

### Deep Wounds (`za_deep`)

Dot, easy, on auto. Your wounds bleed harder, go deeper and stay open longer.
Code: `game/wounds.ts`, `game/skills/deepWounds.ts`, `game/skillHooks.ts`.
Values: `per` attack damage each wound bleeds a tick, `every` seconds between ticks, `most` wounds a foe can carry, `life` seconds wounds stay open, `spread` a foe that dies bleeding passes half its wounds on, `blows` added damage share of his own blows on a bleeding foe, `tide` wounds stay open while the ring turns.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Wounds bleed 40% harder. | per 0.1 |
| 2 | Bleed 0.1 to 0.13. | per 0.13 |
| 3 | New: foes carry up to 7 wounds. | most 7 |
| 4 | New: wounds stay open 5 s. | life 5 |
| 5 | Bleed 0.13 to 0.17. | per 0.17 |
| 6 | New: a foe that dies bleeding opens half its wounds on foes beside it. | spread 1 |
| 7 | New: your blows deal 15% more to a bleeding foe. | blows 0.15 |
| 8 | Bleed 0.17 to 0.2; up to 9 wounds. | per 0.2, most 9 |
| Evolved: Crimson Tide (with Opened Veins) | Wounds bleed twice as often and never close while the sand ring turns. | every 0.5, tide 1 |

### Scouring Sand (`za_scour`)

Dot, timed, on auto. The sand ring grinds grit into foes that bleeds on its own; full of grit, they fuse to glass and shatter.
Code: `game/skills/scouringSand.ts`, `game/whirl.ts`.
Values: `grit` attack damage each grit grinds a second, `gritMost` the most grit a foe carries, `gritHalt` seconds a foe full of grit stands held, `gritTaken` share more damage a gritted foe takes from the ring, `cyclone` grit the cyclone grinds in, `fuse` attack damage per grit when a full foe shatters, `spin` every spin grinds grit, `splash` the shatter cuts foes round it.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | The sand ring grinds grit into foes, 0.1 a second each. | grit 0.1, gritMost 4 |
| 2 | Grit 0.1 to 0.15. | grit 0.15 |
| 3 | New: a foe full of grit stands held for 0.5 s. | gritHalt 0.5 |
| 4 | New: the ring cuts gritted foes 25% harder. | gritTaken 0.25 |
| 5 | New: the cyclone grinds in two grit; up to 6 grit. | cyclone 2, gritMost 6 |
| 6 | Grit 0.15 to 0.25. | grit 0.25 |
| 7 | New: a foe full of grit fuses to glass and shatters, 1.5 a grit. | fuse 1.5 |
| 8 | Grit 0.25 to 1; shatter 1.5 to 6 a grit. | grit 1, fuse 6 |
| Evolved: Glassing Wind (with Unbroken Whirl) | Every spin grinds grit in, and a shatter cuts every foe round it. | spin 1, splash 1 |

### Desert Thirst (`za_thirst`)

Dot, timed, on auto. Bleeding foes take more from everything, more for each wound; felling them gives back HP.
Code: `game/skillHooks.ts` (`takenBonus`), `game/skills/desertThirst.ts`.
Values: `taken` share more damage a bleeding foe takes from every source, `perWound` more per wound, `heal` HP back for each bleeding foe felled, `low` share more on a bleeding foe under a third of its HP, `burst` wounds a bleeding foe felled opens on each foe beside it, `hawk` a bleeding foe felled calls a desert hawk.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | Bleeding foes take 8% more from everything. | taken 0.08 |
| 2 | New: 3% more for each wound. | perWound 0.03 |
| 3 | Taken 8% to 12%. | taken 0.12 |
| 4 | New: a bleeding foe you fell gives back 2 HP. | heal 2 |
| 5 | Per wound 3% to 5%. | perWound 0.05 |
| 6 | New: a bleeding foe under a third of its HP takes 25% more. | low 0.25 |
| 7 | New: a bleeding foe you fell bursts, opening two wounds on foes beside it. | burst 2 |
| 8 | Taken 12% to 35%; per wound 12%; 4 HP back. | taken 0.35, perWound 0.12, heal 4 |
| Evolved: Thirst of the Hawk (with Desert Hawk) | Every bleeding foe you fell calls a desert hawk at once. | hawk 1 |

### Sand Wraith (`za_wraith`)

Summon, easy, on auto. A spin that lands may call a sand wraith that whirls along the floor through the foes ahead.
Code: `game/skills/sandWraith.ts`, `game/summons/wraith.ts`.
Values: `chance` a landed spin calls a wraith, `power` attack damage of each cut, `cooldown` least seconds between calls, `wounds` wounds a cut opens, `back` the wraith turns back and cuts again, `pair` one goes each way, `drag` it drags foes along, `escort` evolved, a wraith patrols round him all the time.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | A spin that lands may call a sand wraith that whirls through foes ahead. | chance 0.15, power 0.5, cooldown 1.5 |
| 2 | Chance 15% to 25%. | chance 0.25 |
| 3 | New: the wraith opens a wound on each foe it cuts. | wounds 1 |
| 4 | New: it turns back and cuts through them again. | back 1 |
| 5 | Wraith 0.5 to 0.8. | power 0.8 |
| 6 | New: two wraiths, one each way. | pair 1 |
| 7 | New: the wraith drags foes along with it. | drag 1 |
| 8 | Chance 25% to 35%; wraith 0.8 to 1.1. | chance 0.35, power 1.1 |
| Evolved: Wraith Caravan (with Dune Walk) | A sand wraith walks round you all the time, cutting every foe it passes. | escort 1 |

### Mirage Dancer (`za_mirage`)

Summon, precise, on K. A parry may call a mirage dancer beside the attacker that spins through it and the foes round it.
Code: `game/skills/mirageDancer.ts`, `game/summons/dancer.ts`.
Values: `chance` a parry calls a dancer, `power` attack damage of each spin on the attacker (the payoff), `plain` on every other foe, `life` seconds it dances, `wounds` wounds a spin opens, `dodge` a perfect dodge calls one too, `blind` it blinds minions round it, `pair` a dancer each side, `burst` evolved, attack damage of the sand blades its last spin bursts into.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | A parry may call a mirage dancer that spins through the attacker. | chance 0.5, power 0.7, plain 0.3, life 1.5 |
| 2 | Chance 50% to 75%. | chance 0.75 |
| 3 | New: the dancer's spins open wounds. | wounds 1 |
| 4 | New: a perfect dodge calls one too. | dodge 1 |
| 5 | Dancer 0.7 to 1.8; it dances 2 s. | power 1.8, life 2 |
| 6 | New: the dancer blinds the minions round it. | blind 1 |
| 7 | New: two dancers, one each side of the attacker. | pair 1 |
| 8 | A parry always calls them; dancer 1.8 to 5. | chance 1, power 5 |
| Evolved: Court of Mirages (with Sand Slip) | The dancers' last spin bursts into sand blades, 40 times attack damage on the attacker. | burst 40 |

### Desert Hawk (`za_hawk`)

Summon, timed, on auto. A foe you fell may call a desert hawk that dives on the nearest foe and opens its wounds.
Code: `game/skills/desertHawk.ts`, `game/summons/hawk.ts`.
Values: `chance` a kill calls a hawk, `power` attack damage of each dive, `cooldown` least seconds between calls, `wounds` wounds a dive opens, `dives` dives each hawk makes, `stun` seconds a dive knocks a foe down, `any` kills by his skills call one too, `every` evolved, every kill calls one.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | A foe you fell may call a desert hawk that dives on another. | chance 0.3, power 1, cooldown 1, dives 1 |
| 2 | Chance 30% to 45%. | chance 0.45 |
| 3 | New: the hawk opens two wounds. | wounds 2 |
| 4 | New: the hawk dives twice. | dives 2 |
| 5 | Hawk 1 to 1.5. | power 1.5 |
| 6 | New: the dive knocks the foe down. | stun 0.6 |
| 7 | New: kills by your skills call hawks too. | any 1 |
| 8 | Chance 45% to 60%; hawk 1.5 to 3.5; three dives. | chance 0.6, power 3.5, dives 3 |
| Evolved: Sky of Hawks (with Desert Thirst) | Every kill calls a hawk, at most one every 0.6 s, and each dive opens three wounds. | every 1, wounds 3 |

### Unbroken Whirl (`za_unbroken`)

Passive, easy, on auto. The Whirl holds longer and fills faster, and the sand ring turns sooner, wider and harder.
Code: `game/whirl.ts`.
Values: `hold` seconds the Whirl holds before it drains, `gain` its fill multiple, `lower` Whirl the ring's tiers need less, `reach` the ring's reach multiple, `power` attack damage added to its cuts, `floor` evolved, the Whirl never drains below the first ring.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | The Whirl holds 0.5 s longer before it drains. | hold 1.6 |
| 2 | New: hits fill the Whirl 30% faster. | gain 1.3 |
| 3 | New: the ring turns from 10 less Whirl. | lower 10 |
| 4 | New: the ring reaches 20% farther. | reach 1.2 |
| 5 | The Whirl holds 2.2 s. | hold 2.2 |
| 6 | New: the ring cuts 0.1 harder. | power 0.1 |
| 7 | Ring 20% to 35% farther; fills 50% faster. | reach 1.35, gain 1.5 |
| 8 | Ring cuts 0.1 to 0.25 harder; turns from 20 less. | power 0.25, lower 20 |
| Evolved: Eye of the Dune (with Whirling Edge) | The Whirl never drains below the first ring. | floor 1 |

### Sand Veil (`za_veil`)

Passive, timed, on K. Your veil of sand blocks more for less, blinds attackers, and your mirage bursts wider and harder.
Code: kit: `game/guardStyle.ts`, `game/mirage.ts`.
Values: `chip` share of a blocked blow let through, `cost` stamina a block costs, `blind` seconds a block blinds a minion attacker, `mirageReach` the mirage's reach multiple, `miragePower` attack damage added to its blades, `blockWhirl` Whirl a block adds, `twin` evolved, a parry leaves a mirage each side.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | A block lets 20% through and costs 11 stamina. | chip 0.2, cost 11 |
| 2 | New: a block throws sand in a minion attacker's eyes. | blind 1 |
| 3 | New: the mirage bursts 30% wider. | mirageReach 1.3 |
| 4 | Block 15% through, 9 stamina. | chip 0.15, cost 9 |
| 5 | New: the mirage's blades cut 0.6 harder. | miragePower 0.6 |
| 6 | New: a block adds 15 Whirl. | blockWhirl 15 |
| 7 | Mirage 30% to 50% wider; blind 1 to 1.6 s. | mirageReach 1.5, blind 1.6 |
| 8 | Block 10% through, 7 stamina; blades 0.6 to 1.2 harder. | chip 0.1, cost 7, miragePower 1.2 |
| Evolved: Wall of Dunes (with Sand Slip) | A parry leaves two mirages, one each side of you. | twin 1 |

### Sandstorm (`za_storm`)

Ultimate, easy, on U. Sandstorm grows: it cuts harder, lasts longer, blinds minions, opens more wounds and reaches farther. Grows with attack damage.
Code: `game/ultimate/sandstorm.ts`.
Values: each a multiple of the storm's own: `power` its cuts, `cooldown` seconds, `charge` charging speed, `time` how long it lasts (its cuts keep their strength), `grains` its look, `blind` minions in it cannot see him, `wounds` more wounds a cut opens, `reach` its reach, `twin` evolved, a second storm this hard turns round the first.

| Level | Card line | Values |
| --- | --- | --- |
| 1 | The storm cuts 30% harder. | power 1.3 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: the storm lasts half again as long. | time 1.5, grains 1.5 |
| 4 | New: minions inside it cannot see you. | blind 1 |
| 5 | Storm power +30% to +90%. | power 1.9 |
| 6 | New: each cut opens two wounds. | wounds 1 |
| 7 | New: the storm reaches 40% farther. | reach 1.4 |
| 8 | Storm power +90% to +380%. | power 4.8 |
| Evolved: Endless Sirocco (with Whirling Edge) | A second, wider storm turns round the first, and the storm lasts twice as long. | twin 1.5, time 2 |


## Balance, measured

Measured on 15 November 2026 in a measuring room built to the method in `docs/skills/balance.md`, driven through the playtest harness.
The run starts at wave 2, hero level 1, with only the skill under test held; the wave's stream is stopped and the room keeps its own foes, refilled 0.35 s after one falls, with the hero's HP kept full.
Targets: the crowd (four husks and two wisps), and the late target (one husk at 12 times its HP), since the 3 times elite dies to one dancer burst and caps what a precise skill can show.
The scripted player walks to the nearest foe and presses J every 0.2 s, three Keen presses in every ten, I every second, a dodge every 4 s, a jump and descent every 6 s and a warp every 5 s; a perfect dodge and a parry run through the game's own functions every 7 s, and the ultimate at charge level 3 every 10 s.
Figures are raw damage per second added over the base kit in 60 s, on the sources each kind can change.
The script that ran it is not in the repo.

Base kit: about 216 a second on the crowd (two runs, 192 and 240), 79 on the late target (two runs, 79 and 80).
Base runs differ by about 20% from run to run on the crowd, so a skill within about 40 of its band is inside the noise.

| Skill | Kind, risk | Target | Level 8 | Evolved | Band at level 8 |
| --- | --- | --- | --- | --- | --- |
| Whirling Edge | attack, easy | crowd | 102 | 141 | 70 |
| Sirocco Timing | attack, precise | late / crowd | 116 / 138 | not measured after the last step | 175 to 210 on one; crowd under 300 |
| Opened Veins | attack, timed | crowd | 107 | 156 | 112 |
| Two-Faced Cut | attack, timed | crowd | 41 | 137 | 112 |
| Falling Dune | attack, timed | crowd | 82 | 35 | 112 |
| Dune Walk | movement, easy | crowd | 67 | 63 | 56 |
| Whirlwind Arrival | movement, timed | crowd | 39 | 67 | 90 |
| Sand Slip | movement, timed | crowd | 78 | 26 | 90 |
| Hot Gale | spell, easy | crowd | 83 | 55 | 70 |
| Glass Rain | spell, timed | crowd | 43 | 45 | 112 |
| Quicksand | spell, easy | crowd | 60 | 80 | 70 |
| Deep Wounds | damage over time, easy | crowd | 134 | 258 | 77 to 98 |
| Scouring Sand | damage over time, timed | crowd | 33 | 155 | 123 to 157 |
| Desert Thirst | damage over time, timed | crowd | 4 | 85 | 123 to 157 |
| Sand Wraith | summon, easy | crowd | 124 | 143 | 70 |
| Mirage Dancer | summon, precise | late | 201 | 250 | 175 to 210 |
| Desert Hawk | summon, timed | crowd | 38 | 145 | 112 |
| Unbroken Whirl | passive, easy | crowd | -39 (noise) | 124 | none |
| Sand Veil | passive, timed | crowd | 38 | 51 | none |
| Sandstorm | ultimate | crowd | 3.9 times the base special per cast | 7.8 times | 6 and 15 times |

The table is the last full pass (after the second tuning step).
A last step after it raised Sirocco Timing (300% to 500%, gust 3 to 4; measured above), Desert Noon (12 to 24), Court of Mirages (20 to 40), Desert Thirst (taken 25% to 35%, 9% to 12% a wound), Desert Hawk's level 8 dive (2.2 to 3.5) and Sandstorm (level 8 power 4 to 4.8, its evolution's second storm 1 to 1.5); those are not measured again.

The roster review on the same day compared the nine heroes' bots: from wave 11 at level 12 the skilled bot took Zafir to wave 15 with 40 kills while the other eight reached waves 11 to 13 with 5 to 18.
The wound bleed went from 0.1 to 0.07 AD, Deep Wounds' bleed rows from 0.15, 0.2, 0.28 and 0.32 to 0.1, 0.13, 0.17 and 0.2, and the sand ring's cuts from 0.3 and 0.45 AD to 0.25 and 0.38.
The same bot then reached wave 13 with 25 kills; the room figures above predate this cut.

### Still off

- Sirocco Timing sits under its band on one foe: three Keen spins in ten rarely chain onto the same foe in the room, so the bonus moves the figure little.
- Glass Rain, Desert Thirst, Desert Hawk, Two-Faced Cut and Whirlwind Arrival read under band at level 8; the room plays them little (the bar spends I on the base abilities first, foes stand mostly ahead of a hero who walks at them, a warp comes once in 5 s), and their evolutions read near or over twice level 8.
- Deep Wounds and Sand Wraith read over band; Deep Wounds' bleed counts every wound a crowd carries.
- Falling Dune and Sand Slip read lower evolved than at level 8, inside the noise of one run each; their evolutions add spouts, a pit and mirages that the room's routine meets only now and then.
- Sandstorm read 3.9 times the base special per cast at level 8 with power 4 and 7.9 times with 5.3, so 4.8 is set between them; evolved it read 7.8 times against the 15 asked before its second storm went from 1 to 1.5.
- Every figure is one run.
