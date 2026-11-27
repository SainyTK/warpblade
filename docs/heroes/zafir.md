# Zafir, the dervish

The eighth hero of the sword roster (patch 0.11.0).
Id `zafir`, name Zafir (he/him), title "The dervish".
Blurb: "Never stops moving. He walks through his spins, cuts both sides at once, leaves bleeding wounds and turns a ring of sand round himself."
Price 1350 coins (the fixed roster price).
Accent `#f2a03a`, saffron orange, his colour family for the menu, the sword light, slashes and effects (`SAND_RAMP` in `src/heroes/zafir/constants/palette.ts`).
Special: Sandstorm.

Everything of his lives in `src/heroes/zafir/`, laid out as `docs/hero-module.md` describes.
His 20 skills are in `docs/skills/zafir.md`.

## Identity

A desert blade dancer who answers being surrounded.
He keeps walking while he attacks, every spin of his string cuts in front and behind at once, his cuts leave wounds that bleed, and while his blows keep landing a ring of sand and wind turns round him and cuts whatever touches it.
His loop is: keep moving, keep hitting, and let the Whirl, the ring and the wounds do the rest.

## Look

- Silhouette: a tall saffron head wrap wound in diagonal bands with dark curls spilling out at the nape and over the brow, a long saffron wrap panel at the back over a short cream one in front, a turquoise sash with two long ends, loose cream trousers gathered at the shin, soft low boots, and a broad scimitar.
- Asymmetry: a saffron drape over the far shoulder only, and a wrap crossing the chest from the near shoulder to the far hip.
- Two main colours (saffron wraps, cream under-layers), one accent (turquoise sash) and one metal trim (gold bangles, guard and pommel). Skin is warm brown, eyes amber.
- The scimitar bows back to a clipped point and is widest near the tip, with a lit edge, a dark spine and a fuller. Its guard's quillons turn down and hold a saffron warp crystal.
- At rest he stands with his weight sunk on the back leg, the scimitar laid back across his shoulders with its point trailing behind him, the other hand on his sash.
- The head wrap's tail and the sash's ends trail and settle on the rope physics every hero shares.
- Every part is his own drawing on the shared rig (`look/`): torso, wraps, arms with bangles, trousers and boots, head, trails and the shoulder drape.

## Base kit by button

| Key | Zafir |
| --- | --- |
| A / D | Walk; a double tap runs |
| W | Jump, and again in the air |
| J tapped | The string: four spins, the same every time, each cutting in front and behind. He can walk through it either way at 55% of his walk speed, still facing where he faced. In the air: the spinning descent. While the scimitar is thrown: call it back into a catch cut round him |
| J held | The shared warp; he arrives spinning and cuts both sides. While the scimitar is thrown, J held also calls it back |
| K | Guard, a veil of sand; a parry leaves a mirage |
| L | The shared front dodge, a low turn on the move |
| I tapped | Sandspout, the crescent throw, or a spell a skill teaches |
| I held | The wide form: a sandspout each way, the scimitar circling him, a wider spell |
| O | Switch ability |
| U | Sandstorm (shared charge and MP rules) |

### The string

| Blow | Clip | Hit frame | Power (AD) | Shape |
| --- | --- | --- | --- | --- |
| Sweep turn | `turn1` | 5 | 0.95 | a level ring at the waist |
| Rising turn | `turn2` | 5 | 1.0 | a ring that climbs, up onto his toes |
| Twin turn | `turn3` | 5 and 10 | 0.6 + 0.65 | a low ring then a high ring in one double turn |
| Dune cyclone | `cyclone` | 8 | 1.85 | a hop spin that throws foes up on both sides (launch 230) and stuns them 0.5 s |

- Every blow has `around` set, so the same box is mirrored behind him. His string on a lone foe in front deals 5.05 AD against Kael's 6.25, and twice that on a foe on each side.
- Every spin coils with his back turned by frame 2 and holds the coil to the strike, then snaps round into the ring slash (`constants/clips/string.ts`).
- Cancels (`STRING_CANCEL`) are 0.1 s after the first two spins, 0.08 after the twin turn, and the cyclone closes the combo 0.16 s after it lands, so the next string starts over its recovery.
- Walking through: each spin's `step` sets his speed from the held direction (`walkThrough` in `game/walkThrough.ts`). His legs take the walk clip's stride under the spin's body while he moves, sampled by the ground he covers.
- The cyclone hops 16 px on frame 5 and drifts 40 px/s with the walk held.

The string contract on a lone walker: the first three spins push the foe 6 to 10 px and stagger it into the next blow; the cyclone launches it and keeps it out of the fight; the next string's first spin lands about 0.55 s after the cyclone.

### The air string

One spinning descent per jump (`spinDrop`): he is pushed down at 140 px/s and turns over and over, cutting both sides on frames 2, 6, 10, 14 and 18 (0.4 AD each), until he lands, where a ring of sand cuts 30 px each side for 0.9 AD and knocks foes down 0.5 s.
After the cyclone's launch, a jump and J lands the descent on the foes he threw up: that is his way to carry on after a launch.

### Whirl (WH bar)

- 0 to 100 (`WHIRL` in `constants/whirl.ts`). Each of his own hits that lands adds 7, a Keen spin 10 more.
- It holds 1.1 s after his last hit, then drains 32 a second.
- At 40 a ring of sand turns round his waist, 26 px out, and cuts each foe it touches every 0.45 s for 0.25 AD.
- At 80 it widens to 34 px, cuts every 0.4 s for 0.38 AD and opens a wound with each cut; the bar glows.
- The ring's own cuts feed neither the Whirl nor the base wound, so it lives only while he keeps hitting.

### Wounds

- Every one of his own hits opens a wound on the foe (a Keen spin two), up to 5 (`WOUND` in `constants/wounds.ts`).
- Each wound bleeds 0.07 AD a second; the wounds close 3 s after the last one opened. The bleed counts with his attacks.
- Wounds show as red cuts on the foe, and a bleeding foe sheds drops.
- His damage over time skills grow from them (Deep Wounds, Opened Veins, Desert Thirst, Hot Gale's evolution).

### Timing reward

Keen timing is shared: a J pressed just after a spin lands makes the next spin a sure critical hit.
On top of that a Keen spin opens two wounds and adds 10 Whirl, and Sirocco Descent's native rows build on it.

### Cancel rule

An ability cast just after a blow of an open string goes off at once (no wind-up), and the string carries on after it: the next J plays the next spin.
So a string can go spin, spin, Sandspout, spin, cyclone.

### K: the sand veil and the mirage

- A block lets 25% through and costs 14 stamina (`SAND_VEIL`), the middle of the roster.
- Parry: he slips 14 px back out of the blow and leaves a mirage in his pose where he stood (`game/mirage.ts`).
  Minions within 44 px lose sight of him for 1.1 s, so they strike at the mirage.
  After 0.6 s it bursts into sand blades: 1.4 AD to every foe within 44 px, a heavy blow that breaks guards, and two wounds each.
  His next blow is Keen.

### J held: the warp

The shared warp in every number.
His arrival spins: the blow cuts in front and behind at the warp's own power, then every foe within 30 px bleeds one more wound and his Whirl rises by 12 (`ARRIVAL` in `constants/warp.ts`).
The thrown scimitar is his own blade drawing turned along the flight.

### I: abilities

| Ability | Cost | Recharge | Tapped | Held (wide, 1.5 times the MP) |
| --- | --- | --- | --- | --- |
| Sandspout (SPOUT) | 14 MP | 3.5 s | a small whirl of sand runs 126 px ahead along the floor; it lifts the first time it catches a foe (0.7 AP) and cuts it again every 0.3 s while it stays in it | a spout each way |
| Crescent throw (CRESCENT) | 12 MP | 3 s | the scimitar flies out on a curve 92 px ahead and back to his hand, cutting each foe once out and once back (1 AD) and opening a wound | the scimitar circles him twice, 34 px out, cutting every foe it passes every 0.3 s (0.6 AD) |

- While the scimitar flies he is unarmed but free: he walks, jumps, guards and dodges. J calls it back at once into a catch cut round him (0.8 AD, 30 px each side).
- Spells his skills teach join the list: Hot Gale (GALE), Glass Rain (GLASS) and Quicksand (SINK).

### U: Sandstorm

A storm rises round him and follows him while he fights on (`game/ultimate/sandstorm.ts`, `constants/storm.ts`).

| Charge level | Seconds | Reach each side |
| --- | --- | --- |
| 1 | 3 | 44 px |
| 2 | 4 | 58 px |
| 3 | 5 | 72 px |
| 4 | 6 | 96 px |

It cuts every foe in it every 0.25 s, drags it a little toward him and opens a wound.
A foe that stays in it the whole time takes 1.1 times the level's power in attack damage (Crystal Nova's ring deals 0.75 times once).
The storm's own skill, Sandstorm (`za_storm`), makes it larger, longer and harder and adds a second storm when evolved.

## The drill kit

Solo Adventure runs Zafir on the shared drill engine through `ZAFIR_DRILL` (`src/heroes/zafir/game/drill/index.ts`).
His movement numbers (`constants/drill/motion.ts`) make him the quickest on the roster: a faster run and acceleration and a snappier dash.
His own poses (`constants/drill/locomotion.ts`) keep the scimitar laid back over his shoulders with the other hand on the sash at rest, and the dash is a low spinning turn with his back to the camera.
His run (`game/drill/runPose.ts`) is fitted to the shared reference trace with the blade trailing low behind him.
The chain is three spins sampled from his native clips (`constants/drill/strikes.ts`): the sweep turn, the rising turn and the twin turn, plus the spinning descent in the air.
Every spin also cuts behind him at 75%, and the twin turn adds a high ring 0.1 s after the low one.
Every cut opens a wound and feeds the Whirl, so the sand ring still turns round him.
The warp arrives in a full ring, and the enhanced parry stays open 0.25 s; a parry still leaves his mirage.
His spells are Sandspout (slows and opens a wound), Crescent (opens two wounds) and Glass Rain (blinds minions and holds feet); each status also rides on infused hits.
Held J charges Sandstorm I to IV, every tier striking both sides, with sand crescents, sandspouts and, from the third tier, a storm that follows him; his cut-in (`ui/cutIn.ts`) shows his portrait over blown sand.

## Numbers

`base: { ad: 10, ap: 9, hp: 105, mp: 90, stamina: 100, crit: 0.05, move: 1.05, aspd: 1, haste: 1 }`, growth `{ hp: 1.15, mp: 0.4 }`, `comboHits: 4`.
He has a little more HP and walks a little faster than Kael, and less MP and ability power, since his abilities are short and his damage is mostly the sword.

## How he differs from the other eight

- Kael casts elemental spells into his sword string and stands planted while he cuts. Zafir casts sand into his string and the string carries on after it, and he walks while he cuts.
- Cerise pins one foe on a long thin line with fast thrusts and lives on the parry. Zafir cuts round himself, front and back, at short reach, and his parry hands the fight to a mirage.
- Aldric advances behind a raised shield and blocks almost everything. Zafir's block is middling, and his defence is moving and blinding.
- Vesper lives in the air and grows faster the longer she hits. Zafir stays on the floor, gets one descent per jump, and what grows with his hits is the ring round him, which cuts on its own clock.
- Saya stores cuts and releases them at the sheathe, in beats. Zafir's damage never waits: wounds bleed at once and the ring cuts all the time.
- Yun repeats his blows at range through spirit swords. Zafir has no copies of his blade beside him; his reach is his own spin, the spout and the thrown scimitar coming back.
- Brynn swings slow and wide with armour. Zafir spins light and fast with no armour; he gets out of the way by walking and dodging.
- Calder fires rounds at the moment of impact and counts a chamber. Zafir's meter fills itself while he keeps hitting and drains when he stops, and spends nothing.

## What I chose not to build

- No turning attacks: his spins hit both sides, so he never needs to face a foe that got behind him, and nothing turns him.
- No auto-targeting: Sandspout and the crescent go where he faces.
- No long travel move: Sandspout travels, he does not. The cyclone's hop is 16 px.
- No armour while spinning: that is Brynn's.
- No resource spent by the string: the Whirl only fills from his hits and drains when he stops, so he never waits on it.
- No sand clones that copy the string at range (Yun's spirit swords). The mirage stands still and bursts.
