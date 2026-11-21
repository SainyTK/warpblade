# Cerise, the duelist

The second hero of the sword roster (patch 0.11.0).
Id `cerise`, name Cerise (she/her), title "The duelist".
Blurb: "A young duelist with the longest reach. Quick thrusts on a thin line, and a parry that answers with ripostes on the beat."
Price 0: she is open from the start, with Kael.
Accent `#ff8fb0` (rose pink), the colour of her menu tile, her ability tabs, her Points bar, her sword light and every effect she makes.

Her module is `src/heroes/cerise/` (`docs/hero-module.md`), and her 20 skills are in `docs/skills/cerise.md`.

## Identity

Cerise fences.
She holds a slim rapier point first and pins one foe at a time on a long thin line in front of her.
Every press answers at once, and each thrust is light.
Her damage comes from rhythm: a thrust pressed in the beat after the last one lands is Keen, a Keen thrust earns a Point, and the lunge at the end of the string spends every Point for one hard, piercing blow.
Her parry is the best in the roster and her block is one of the weakest, so the guard is a timing tool for her.
A parry answers with a riposte at once, and each J pressed on the beat after a riposte lands is another riposte.
Mashed, she is weak; played on the beat, she is the deadliest single-target hero.

## Look

A young duelist in a fitted white fencing coat with a rose lining, buttoned on the bias across the chest, with silver buttons and trim.
A short rose-lined cape hangs over the sword-side shoulder and trails when she moves.
Cherry-red hair, long, in a side tail tied with a rose ribbon, and a side-swept fringe over large green eyes.
Dark plum breeches, high black boots to the knee with silver cuffs, white gloves.
Two main colours (white and plum), one accent (rose) and one metal (silver).
No hat.

The rapier is the longest blade in the roster by reach and the thinnest: a needle blade with a white edge, a swept silver guard that curls round the hand in two bars, and a rose warp crystal set where the bars meet.
At rest she stands with her weight on the back leg, the front foot pointed at the foe, the rapier held low and forward with the point down, and the off hand on her hip.
Her guard is the fencer's line: the blade raised point up across her face, the off hand back for balance.

Effects are rose: thrusts leave thin rose streaks with a white core, Keen thrusts turn gold as for every hero, Points show as rose pips, and her mark is a small rose sigil over a foe.

## On the drill engine

Every solo Adventure plays base Cerise on the shared drill engine (`src/drill`, `docs/hero-module.md`, "The drill engine").
Her profile is `src/heroes/cerise/game/drill/index.ts`, registered as `drill: CERISE_DRILL` on her module.
The native kit described below still plays in co-op and the wave arena.

### Movement

She runs on the shared drill model with lighter numbers than Kael: run 118 against 110, a quicker dash (292) with a shorter recovery (0.23 s), a slightly higher jump (rise 338) and a softer fall (1150).
Her poses are her own (`game/drill/poses.ts`).
The run is fitted to the shared reference trace with `fitRunFeet` over a fencer's upper body: the torso upright, the rapier held forward at chest height with its point toward the foe, and the off hand on her hip.
The stance is her en garde, the rise lifts the point up, the dash and dash-jump are a flying lunge with the blade fully extended, the fall points the rapier down and forward with the off hand up, and the wall and kick poses keep the point toward the foe.
Guard is the fencer's line with the blade raised across her face, and the parry flicks the point up and returns it straight out for the riposte.

### Chain and follow-ups

The three ground strikes sample her `thrust1`, `thrust2` and `lunge` clips, and the air strike samples `airThrust` (`constants/drill/strikes.ts`).
Arcs are flat and narrow; the lunge is the longer, harder finisher.
The warp strike throws the rapier and lands as a straight thrust; the enhanced parry window is 0.25 s.

### Spells

I prepares the selected spell for 3 seconds, I again casts it, I during a thrust is Rose Edge (the spell rides the next three hits that land), and O cycles the set while nothing is prepared.
The set is in `game/drill/spells.ts`, with its own looks in `game/drill/looks/` and statuses in `game/drill/statuses.ts`.

| Spell | How it flies | Status (also on Rose Edge hits) | Look |
| --- | --- | --- | --- |
| Rose Line | a fast needle of rose light, 300 px a second, 160 px | the Rose mark | a long white-cored needle trailing three petals; the hit opens a five-petal rose with a cross glint |
| Flurry | strikes the nearest foe ahead after 0.08 s | a 0.24 s stagger | seven thrust streaks converge on the foe, with petals scattering |
| Rose Bloom | a slow spinning rose bud, 150 px a second, 120 px | binds the foe in place for 0.8 s | a thorned bud with a leaf trail; the hit raises a ring of thorns and leaves |

### Charged skills

J held charges through the four tiers on the shared thresholds, and release uses the highest reached with her face cut-in (`ui/cutIn.ts`).
Each tier has its own pose (`constants/drill/tiers.ts`) and its own look (`game/drill/looks/tempest.ts`); every release also sends a Rose Line streak along her line (`game/drill/release.ts`), both ways for the fourth.

| Tier | Name | Pose | Look |
| --- | --- | --- | --- |
| 1 | Rose Thrust | a deep low lunge, the blade level | one long needle with petals along it |
| 2 | Rising Rose | a rising thrust, the point high | a fan of three needles rising, petals lifting |
| 3 | Thorn Gale | a flying lunge close to the floor | a tunnel of turning petals and thorn lines across her line |
| 4 | Rose Tempest | the salute, blade straight up | a rose of three turning petal rings round her and a column of light, striking both sides |

## Base kit by button

| Key | Cerise |
| --- | --- |
| J tapped | The string, five blows, the same every time: lead thrust, second thrust, rising thrust, twin flick (two quick touches), long lunge. The lunge spends every Point. |
| J (Keen) | J pressed in the beat after a blow lands makes the next blow a sure crit and earns a Point. |
| J (air) | One diving thrust per jump: she drops on a slant, point first, and pins what it strikes. |
| J held | The shared warp. The arrival is a thrust, and it sets a Rose mark on the foe. |
| K | Guard: lets 45% of a blow through and costs 20 stamina. |
| K (parry) | The shared parry, then a riposte at once (a sure crit) and a Point. |
| J after a riposte | J pressed in the beat after a riposte lands is the next riposte, harder each time and a Point each, up to six in a chain. A J pressed before the riposte lands ends the chain after it. |
| L | The shared dodge. |
| I | Cast the selected ability. Pressed in an open string just after a blow lands, it goes off at once; pressed in the Keen beat, it also earns a Point. Her spells (Rose Bloom, Needle Rain, Mirror Guard) may be cut by the warp, the guard, the dodge or the ultimate once they let loose, and a press made earlier waits for that moment; another ability waits until she is free. |
| I held | The wide form of the selected ability for half again the MP. |
| O | Switch ability. |
| U | Rose Tempest, charged in four levels. |
| W | Jump; W again in the air is a double jump. |

### The string

| Blow | Power (AD) | Hit frame | What it does |
| --- | --- | --- | --- |
| Lead thrust | 0.72 | 4 | a straight thrust at the chest from the back foot |
| Second thrust | 0.72 | 4 | a step in and a thrust a little lower |
| Rising thrust | 0.8 | 4 | a thrust from low that rises, staggering longer |
| Twin flick | 0.42 + 0.48 | 3 and 7 | two quick touches from the wrist |
| Long lunge | 2, +0.45 a Point | 5 | a full lunge that pierces every foe on its line, pins them and ends the string |

Each thrust reaches 46 px ahead on a line 30 px tall round chest height, the longest reach in the roster in the narrowest line (Kael's cuts are 36 px tall and reach 30 to 38).
The lunge reaches 62 px, 10 px more for each Point it spends; with three Points it breaks guards and with five it is a sure crit.
A thrust strikes on frame 4 and the string runs at about 0.27 real seconds from one blow to the next with J pressed on the beat, against Kael's 0.45, so the string's damage a second is a little under Kael's when mashed and far over it on the beat.
The lunge closes the combo once its follow-through starts, so J starts the next string over its recovery.

### Points (PT bar)

Points are pips on a bar under stamina, label PT, five at most.

- A Keen blow that lands gives one Point.
- A parry gives one, and each riposte that lands one more.
- The warp's arrival thrust gives none in the base kit.
- The long lunge spends every Point: +0.45 AD and +10 px reach each, and a sure crit at five.
- An ability spends up to two Points as it goes off, each one making it 40% stronger.

The bar glows when it is full.
Points stay until spent, so a player can bank them through a lull.

### Guard and parry

Her block is weak: 45% of the blow comes through and it costs 20 stamina (the shared range is 0 to 50% and 8 to 25).
Her parry reward is the strongest in the roster: a riposte at once, a Point, and a chain of ripostes for as long as the player keeps the beat.

A riposte is a thrust on the same thin line as the string, 1.3 AD, a sure crit, +0.25 AD for each link before it.
After a riposte lands, J pressed within 0.22 s is the next link.
J pressed before the riposte lands ends the chain after it, so the chain cannot be mashed.
Six links at most; the chain also ends when the beat passes.
The guard, the dodge, an ability or the ultimate cut a riposte once it has struck.

### Warp extra: the Rose mark

The arrival is a thrust on her line in place of the shared slash, at the shared power.
It sets a Rose mark on the foe it was thrown at for 4 s: her blows on that foe deal 25% more, and Keen blows 60% more on top.
The mark is drawn as a small rose sigil over the foe.

### Abilities

| Ability | Tab | MP | Recharge | Plain | Wide (I held, 1.5x MP) |
| --- | --- | --- | --- | --- | --- |
| Flurry | FLURRY | 10 | 2.5 s | seven quick thrusts in a narrow cone ahead, 0.36 AP each, the last one knocks back | eleven thrusts in a cone tall enough to reach flyers, the last one throws foes up |
| Rose Line | LINE | 14 | 4 s | a thin wave of rose light runs across the whole screen on her line, 2.4 AP to each foe once | the line runs both ways, ahead and behind |

Each Point an ability spends (two at most) makes it 40% stronger, and Flurry adds two thrusts for each.

The warp, the guard, the dodge or the ultimate may cut Flurry once its last thrust is out, Rose Line once the line has gone and a riposte once it has struck, and one pressed earlier waits for that moment.
Another ability pressed during Flurry or Rose Line waits until she is free; after a riposte has struck it goes off at once.

### Ultimate: Rose Tempest

She plants her feet and drives a storm of thrusts into the foes ahead, then lunges along her line while a streak of rose light runs on ahead of her.
The storm is ten thrusts at 0.05 of the charge level's power each on every foe within 64 px ahead.
The lunge carries her up to 96 px and strikes every foe on the line for 0.45 of the level's power; the line runs 120, 170, 230 px, and at level 4 across the whole screen.
She cannot be touched for the whole move, which lasts 0.9 s, and the end of the lunge counts as a travel move for Aftershock.
Her one ultimate skill, Rose Tempest, upgrades it.

## The four qualities of Kael, her way

- Cancel rule: an ability pressed in an open string goes off at once, and in the Keen beat it also earns a Point.
- Parry follow-up: the riposte chain.
- After a launch: Cerise pins instead of launching. The lunge and the diving thrust pin a foe where it stands, and the next string's first thrust reaches it there.
- Timing reward: Keen blows earn Points, and Points become the lunge.

## Numbers

`base: { ad: 10, ap: 9, hp: 100, mp: 100, stamina: 100, crit: 0.08, move: 1.04, aspd: 1, haste: 1 }`, growth `{ hp: 1, mp: 0.45 }`, `comboHits: 5`.
HP matches Kael's; her crit is a little over his because Precision suits her.
Every value lives in `src/heroes/cerise/constants/`.

The skill contract allows two to four blows for the new heroes; the director's roster asks for four or five thrusts ending in the lunge.
Cerise has five because her blows are the lightest and fastest in the roster, so five of hers take about as long as three of Kael's.

## How she differs from the other eight

- Kael casts elemental spells into a string of wide cuts and blinks behind the attacker after a parry. Cerise's blows are thrusts on one thin line, and her parry answers on the spot with a chain of ripostes that only the beat keeps going.
- Aldric blocks almost everything behind a shield and walks forward guarding. Cerise's block lets nearly half through; she parries or she pays.
- Vesper lives in the air and grows faster with every hit she lands. Cerise keeps her feet, has one air thrust per jump, and her string keeps one tempo; her reward is a stored Point, spent at the end.
- Saya stores cuts that land late, all at once, at the sheathe. Every blow of Cerise's lands the moment it strikes.
- Yun's spirit swords repeat his blows at range. Cerise fights alone at the tip of her own blade; her reach comes from the rapier and the lunge.
- Brynn swings wide through hits with armour. Cerise has no armour and the narrowest blows in the roster.
- Zafir walks while he attacks and cuts both sides at once. Cerise plants her feet and strikes one side, along one line.
- Calder fires rounds at the moment of impact and counts a chamber. Cerise counts Points, earned by timing, and spends them all on one lunge.

## What was left out

- A feathered hat, by the director's look note.
- A grab or bind of the foe's blade: the riposte chain carries the parry reward, and a second K mechanic would crowd it.
- A launch in the string. Pinning is her answer to a foe she wants to keep in reach.
- Points that fade with time. They stay until spent, so a player can carry them into the next string.
- A second air thrust in the base kit. Swallow Dive adds one.
