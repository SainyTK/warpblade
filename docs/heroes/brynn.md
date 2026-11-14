# Brynn, the heavy blade

The seventh hero of the sword roster (patch 0.11.0).
Id `brynn`, name Brynn (she/her), title "The heavy blade".
Blurb: "Small, loud, and carrying a sword as tall as she is. Her swings do not stop for anything, sweep a crowd off its feet and end in a slam that shakes the floor."
Price: 1000 coins, the seventh price of the roster (`docs/achievements.md`).
Accent `#ff4f5e` (crimson): the hero screen, the ability tabs, the HF bar, her slashes, rings and sparks.

Her module is `src/heroes/brynn/`, laid out as `docs/hero-module.md` says.
Her skill tables are in `docs/skills/brynn.md`.

## Identity

Brynn commits to every swing.
Her string is slow and wide, and while she swings she wears armour: blows that land on her hurt less and never stop the swing.
Each blow that lands builds Heft, and a press in the beat after a blow makes the next swing heavy: wider, with a crimson wave off the blade.
A full Heft bar turns her next slam into a fissure that runs along the floor through the whole line.
She has few presses, and each one matters.

The sword is Anvilheart: a broad slab of steel almost as tall as she is, with a fuller down its middle, a heavy cross guard, a grip long enough for two hands and a crimson warp crystal set in the blade just above the guard.

## How she differs from the other eight

- Kael casts elemental spells into a quick four-hit string. Brynn has three slow blows, no spells into the string, and armour while she swings; her abilities shake the floor.
- Cerise chains ripostes and thrusts along one thin line. Brynn's blows are the widest in the roster and hit everything in an arc, and her parry is one heavy cleave with no chain after it.
- Aldric advances behind a raised shield and turns blocks into Valor. Brynn has no shield; her block is the flat of her blade, strong but costly, and her armour works only while she swings.
- Vesper lives in the air and speeds up with every hit. Brynn has one air blow, a falling slam that takes her down to the floor, and her speed never changes.
- Saya stores cuts that land when her blade is sheathed. Brynn's damage lands on the blow, all of it, and her payoff is the shockwave.
- Yun sends spirit swords out to strike at range. Brynn reaches far only along the floor, with waves and fissures from her own blade.
- Zafir keeps walking while he attacks and cuts both sides at once. Brynn plants her feet for every swing.
- Calder fires rounds at the moment of impact and counts a chamber. Brynn's timing reward is a heavy swing, and her meter fills from hits and empties into one fissure.

## Stats

`base: { ad: 12, ap: 9, hp: 115, mp: 90, stamina: 110, crit: 0.05, move: 0.94, aspd: 1, haste: 1 }`, growth `{ hp: 1.3, mp: 0.4 }`, `comboHits: 3`.
She hits harder and stands longer than Kael (AD 10, HP 100) and walks a little slower.

## Base kit by button

| Key | Brynn |
| --- | --- |
| A / D | Walk; a double tap runs. The sword rides on her shoulder |
| W | Jump; again in the air for a double jump |
| J tapped | The string: Wide Sweep, Rising Heave, Anvil Slam, the same wherever foes stand. In the air, the Falling Slam, once per jump |
| J (Keen) | J pressed in the beat after a blow lands makes the next swing heavy: a sure crit, wider, and a crimson wave off the blade |
| J held | The warp: the sword spins end over end to the foe, she lands beside it with an overhead chop and a small shock ring |
| K | Guard on the flat of the blade: a strong block at a high stamina price |
| K (parry) | The shared parry, then the Counter Cleave at once, and the next swing is heavy |
| L | The shared front dodge |
| I tapped | The selected ability: Rend or Quake, then the spells her skills teach. On a recharging one, the next ready one |
| I held | The wide form of the selected ability |
| I in the string | Carry: once a blow of the string has landed, the ability goes at once with the swing's weight, 30% harder, and the next J goes on with the string |
| O | Switch ability |
| U | Crimson Fall, charged in four levels |

### The string

Her clips run at 30 frames a second like every hero's.
Each blow winds up the other way and holds the wind-up for at least three frames, snaps on its hit frame, holds through the hit-stop, follows through onto the front foot and settles to her guard.
The greatsword is held in both hands for every blow.

| Blow | Hit on frame | Reach | Power | What it does |
| --- | --- | --- | --- | --- |
| Wide Sweep | 7 | 10 px behind to 42 px ahead, 34 px up | 1.5 AD | staggers every foe in the arc long enough for the next blow |
| Rising Heave | 7 | 4 px behind to 34 px ahead, 58 px up | 1.6 AD | throws the foes up |
| Anvil Slam | 9 | 2 px behind to 40 px ahead, 62 px up | 2.6 AD | drives a foe in the air into the floor, knocks down, and sends a shockwave 70 px along the floor at 0.9 AD |
| Falling Slam (air) | 6 | under her as she drops | 1.4 AD | spikes what it meets, and on landing a ring of 40 px either side at 1.0 AD knocks foes down |

The way to go on after a launch is the slam: the Rising Heave throws foes up just high enough that the Anvil Slam's tall arc catches them on the way down and drives them into the floor.
The numbers are in `src/heroes/brynn/constants/string.ts` and the timing in the same file.

Measured on a lone thornback with J pressed every 0.1 s, a blow lands 0.51 s after the one before, the slam 0.59 s after the heave, and the next string's sweep 0.67 s after the slam.
Kael's string runs at 0.45, 0.5 and 0.6, so she is a little slower and each blow is worth more.
In that run every blow landed on the same foe: the sweep's 0.8 s stagger outlasts the gap to the heave, and the heave's launch keeps the foe in the air until the slam catches it.

### Armour

From the first frame of a swing until a moment after its last blow is out, Brynn wears armour: a blow on her takes 60% of its damage (`ARMOUR` in `src/heroes/brynn/constants/armour.ts`) and does not stop the swing, push her back or end the string.
Her abilities and Crimson Fall carry the same armour.
Outside a swing she takes blows as any hero does, so the guard and the dodge still matter.
A blow her armour takes shows as a crimson flash on her pauldron.

### Heft (HF bar)

A bar under stamina, label HF, in four cells.

- A string blow that lands adds 14, and 4 more for each foe past the first, up to 26 a blow.
- A heavy swing that lands adds 10 more. A parry adds 30.
- After 3 seconds without a blow landing, Heft drains 15 a second.
- Full Heft (100) lights the bar, and the next Anvil Slam is a Fissure: a crack runs 170 px along the floor ahead, 2.4 AD to every foe on it, and knocks them down. The Fissure spends the whole bar.

### Heavy swings (Keen timing)

The shared Keen rule, with Brynn's own window and payoff.
J pressed within 0.14 s after a blow lands makes the next swing heavy.
A heavy swing is a sure crit, reaches 30% farther ahead, and sends a crimson wave 90 px along its arc at 0.8 AD.
J pressed before a blow has landed spoils it, so a slow, timed rhythm beats mashing.

### J held: the warp

The shared warp in every number.
Anvilheart spins end over end through the air on its flight, and the crimson crystal leaves a trail.
She lands beside the foe with an overhead chop at the shared power, and a shock ring 36 px round her deals 0.3 AD and knocks foes off their feet for 0.4 s.

### K: guard and Counter Cleave

The flat of the blade held across her body.
A blocked blow lets 10% through and costs 22 stamina: the strongest block of the roster's swords bar Aldric's, and the dearest.
A parry answers with the Counter Cleave at once: a wide two-handed cleave in front and behind, 2.4 AD, a knockdown, 30 Heft, and her next swing is heavy.

### I: abilities

Each has its own recharge, and none waits on another.

| Ability | Cost | Recharge | Tapped | Held (wide form) |
| --- | --- | --- | --- | --- |
| Rend | 14 MP | 4.5 s | an upward cut sends a crimson wave 170 px along the floor ahead, 2.4 AP to each foe once, throwing it up | for 21 MP, waves run both ways |
| Quake | 16 MP | 6 s | she drives the blade into the floor; foes within 64 px take 1.9 AP and are thrown up | for 24 MP, 100 px, and an aftershock 0.4 s later at 60% |

Carry, her string cancel: I pressed once a blow of the string has landed casts the ability at once from the swing, 30% harder, and the string is kept, so the next J plays the next blow.

Three more abilities join the row when their skills are held: Ember Arc (a tall crimson crescent along the line), Brand Pillars (pillars of crimson fire bursting from the floor in a line) and War Cry (a roar that pushes foes back, fills Heft and lifts her damage).
Their numbers are in `docs/skills/brynn.md`.

### U: Crimson Fall

She crouches, leaps with the sword overhead, and brings it down in one enormous crimson crescent.
The crescent hits every foe in front and behind within a reach set by the charge level (70, 110, 160 and 340 px) and up to 70 px above the floor, at 0.8 of the charge level's power, and knocks them down.
Crimson Fall's skill (`br_fall`) upgrades it.

## Timing reward, parry follow-up, cancel and launch follow-up

The roster asks each hero for its own version of four of Kael's qualities.

| Quality | Kael | Brynn |
| --- | --- | --- |
| Timing reward | Keen: a sure crit | Heavy swing: a sure crit, wider, a wave |
| Parry follow-up | riposte and a counter blink on J | Counter Cleave at once, 30 Heft, next swing heavy |
| String cancel into abilities | Spellblade: 1.5x, ends the combo | Carry: 1.3x, the string goes on |
| After a launch | air string | the Anvil Slam catches and spikes the launched foes |

## Achievements

| Name | Goal | Coins |
| --- | --- | --- |
| Groundbreaker | As Brynn, split the floor with 50 fissures | 60 |
| Clean Sweep | As Brynn, strike 6 foes with one Wide Sweep | 40 |

The kit counts `brynn.fissures` with a `heroCount` feat on every fissure and keeps the best `brynn.sweepCrowd` with a `heroBest` feat after every sweep (`src/heroes/brynn/constants/achievements.ts`).

## Every shop item

Honed Edge and Arcana feed her blows and abilities through `progress.stats.ad` and `ap`.
Endurance pays for her dear block and the dodge, Wellspring for her abilities and Crimson Fall.
Light Boots speed her walk through the shared physics, Vitality and Last Light act on every blow through `hurtHero`, and her armour only scales what reaches it.
Aftershock answers the shared warp and dodge, and the Falling Slam's landing calls `travelEnded()`.

## Co-op

Her kit state (Heft, the recharges, the cast under way, the carried string, the heavy streak, the War Cry timer) is one object registered with `rememberPerSeat`, so each player on Brynn keeps their own HF bar.
The dodge's start point for Battering Ram is host-only seat memory, and every wave, crack, shard and blade is a host-side effect.

## What I chose not to build

- No charged blows on J held. J held is the warp for every hero, so her heavy blows come from timing.
- No spinning attack that cuts both sides as she walks: that is Zafir's.
- No block that grows a resource: that is Aldric's Valor.
- No long charge-up before a swing or a recharge longer than the shared ones, which the owner removed from old heroes.
- No move that carries her far across the stage. Rend and the Fissure reach far along the floor while she stays planted.
- Her armour never covers the time between swings, so standing still in a crowd is still a mistake.
