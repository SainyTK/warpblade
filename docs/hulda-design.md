# Hulda design

Hulda is the fourth hero and the first one the studio built in the hero sprint.
She shares the rig with Kael, Ysra and Sable and plays nothing like any of them.
She is a slow, heavy, unarmed wrestler in iron gauntlets with the shortest reach in the game.
She wins by getting her hands on foes: grabs, throws that turn one foe into a weapon against the others, and armour that lets her walk through blows to get there.
She is never untouchable.
Every other hero escapes blows; she absorbs them.

## How she differs from every hero in the game

- Kael is a fast warp swordsman with a run, a double jump, an untouchable dash, a warp throw and MP element spells, his combo picked by the situation.
  Hulda walks slowest of all and has no run, no double jump and no untouchable frame anywhere in her kit.
  She fights with fists that reach 16 px ahead, and her key moves are grabs and throws that move a foe's body.
  Her defence is armour plates, and her MP pays only for Bellow and the ultimate.
- Ysra is a planted glaive fighter with long piercing pokes, a front brace that blocks and parries, a pole vault, and Heat spent on fire rites.
  Hulda has no block or parry button; her armour works from every side and breaks one plate per blow.
  Grit is never spent by a button: blows she takes spend it, and grabbing, throwing, taunting and getting hit build it.
  Her travel is a charge along the floor through foes, never over them.
- Sable is a ranged hunter who keeps foes away with bolts, a kick, a hop back and snares, and manages ammo.
  Hulda does the opposite: Bellow pulls foes in, Bull Rush closes the distance, and she wants foes in her hands.
  She has no projectile of her own; the only things she throws are foes.

The axes that differ: movement (a slow walk, an armoured charge, a low jump and an air grab dive), defence (armour plates), resource (Grit as armour), range (the shortest melee, plus foes as projectiles) and the shape of her attacks (grab, then throw by direction).

## Controls

| Key | Hulda |
| --- | --- |
| A / D | Walk. No run; a double tap does nothing |
| W | One low, heavy jump (44 px). No double jump |
| S | With W, drop through a ledge |
| J | Fist string: jab, body hook, haymaker. In the air one hammer fist. While holding a foe, a knee |
| K | Grab. While holding a foe, throw it: the throw picks itself by where the foes stand. In the air, Skyfall Grab |
| L | Bull Rush, an armoured shoulder charge (25 stamina) |
| I | The selected ability: Bellow (20 MP), the taunt, or a spell skill |
| O | Switch to the next ability on I |
| U | Ultimate (shared charge and MP rules) |

On the touch controller the buttons read Punch, Jump, Rush, Grab, Bellow, Taunt and Special, with icons drawn in `src/ui/touch/icons/huldaArt.ts`.
While she holds a foe, the stick pushed behind her picks the suplex and pushed up picks the toss.

## Grit and armour plates

Grit is her second bar, 0 to 100, shown as GR under stamina and split into four iron plates of 25 (`src/ui/gritBar.ts`).
Full plates are bright steel with a lit top edge; the plate filling is a dim fill.
A run starts with 25 Grit, one plate.

Grit comes from her blows (4 for each foe a J blow lands on), a grab (10), a knee (5), a throw or Skyfall slam (15), Bellow (10), each taunt slap (12), and each blow she takes without spending a plate (10).
It drains 4 a second once 4 seconds pass with no blow landed or taken.

A blow on her with a full plate deals half its damage (40% with Iron Plates), breaks one plate with steel shards from her shoulder, and leaves her doing whatever she was doing, safe for 0.8 s, as long as after any hurt.
With no full plate, a blow hurts her as it hurts any hero: the knockback, the hurt state and a dropped foe.
During the Bull Rush every blow deals half and never flinches her, and spends no plate.
The haymaker's wind-up is armoured from its second frame until it lands.

The engine hook is `steadfast` on `HeroKit` (`src/types/kit.ts`): `hurtHero` takes the HP as before, then when the hero still stands and the kit's `steadfast()` says its armour took the blow, it skips the knockback, the hurt state and the combo reset.
Last Light and death run exactly as before.
Kael, Ysra and Sable leave the hook out, so their play is unchanged.

## The fist string

Three blows (`comboHits: 3`), J by J, each carried on within 0.35 s of the last.

| Blow | Frames | Hit on | Damage | Knockback | Extra |
| --- | --- | --- | --- | --- | --- |
| Jab | 8 | 3 | 0.9x | 30 | stagger 0.3 s |
| Body Hook | 11 | 5 | 1.3x | 60 | breaks a guard, stagger 0.6 s |
| Haymaker | 16 | 8 | 2.8x | 70 | heavy, stun 0.5 s, hit-stop 0.07 s |

Jab and hook reach a box 2 to 16 px ahead at head height, the shortest reach in the game.
The haymaker is an overhand: the arm cocks back past her head, holds four calm frames and comes down over it, so its box reaches 42 px up, as far as the fist travels, and no further ahead than the jab.
Light blows are blocked by guarding husks as for every hero; the haymaker breaks a guard, and the grab beats one.
In the air, J is one hammer fist per airtime that spikes a foe into the floor.
The first blow of a string faces the held direction; with none held, she turns to a foe within reach only behind her, as Kael's turning moves do.
The grab starts the same way, so a foe left behind her by a suplex or the rush is in front of her fists again.

## The grab and the throws

K on the floor reaches with both hands and catches the nearest foe in a box 0 to 18 px ahead on frames 3 to 5.
A minion is held; a mini boss or boss is crushed in both hands instead (1.3x, heavy) and never held.
A held foe sits at her hands, its near side a few pixels ahead of them, and stays stunned there.
The hold lasts 1.4 s (longer with Crushing Grip), she walks at half speed and cannot jump, rush or Bellow, and J lands up to three knees (0.5x each).
When the hold runs out she throws the foe on her own.
A blow that breaks no plate makes her drop it.

The throw picks itself: a Giant Swing when foes crowd her and she holds that skill, a forward throw when foes stand within 100 px ahead and fewer within 40 px behind, otherwise a suplex, which is also the hardest throw on a lone foe.

| Throw | When | What it does |
| --- | --- | --- |
| Forward | foes ahead | 1.2x, then the foe flies ahead as a body that hits each other foe it touches for 1.0x, knocks it back and stuns it, and lands for 0.6x more |
| Suplex | alone, or foes behind | lifted overhead, swung over her head and slammed 14 px behind her: 2.2x, heavy, stun 1.2 s, and a 30 px ring that hits the others for 0.8x |
| Giant Swing | foes crowd her, with the skill | turns round her that strike every foe near her each turn, then a forward throw |

Skyfall Grab is K in the air, once per airtime: a lunge down and ahead with both hands.
On a minion it catches it, rides it down at 300 px/s and slams it into the floor for 2.0x with a 34 px ring (0.8x, stun 1.0 s).
This is how she deals with fliers.
A whiff lands with a short recovery, and both landings call `travelEnded()`.

## Bull Rush, Bellow and the taunt

Bull Rush: floor only, 25 stamina, a two-frame load, 0.32 s at 200 px/s times move speed, a six-frame skid, 0.4 s before the next.
She charges the way she is pushed when L is pressed, so L toward a foe behind her turns her first.
Every foe she runs into takes 0.6x, a short 60 shove and a 0.4 s stun once per rush, and a guard breaks.
Once she has run into a foe (one she did not lift onto her shoulder) and no other foe stands within 24 px ahead of her shoulder, the charge stops at its next stride key and the clip's own last stride and skid play from the same pose (`stopCharge` in `rushClock.ts`).
She skids out 10 to 20 px past the foe and, as she settles, wheels round to it when it is the only foe in reach.
Through a packed crowd she still runs the whole charge.

### Keeping contact with a lone foe (8 November 2026)

A player-style test (real keys, a walking husk with three times its HP, every gap measured) showed the string itself keeps contact: each jab, hook and haymaker landed 4 to 13 px from the foe and a human-paced string dealt about 80 a second.
What broke contact was the rush: it ran 21 to 31 px past the foe and left her back to it, so the next jab whiffed; pressed with the foe behind her it charged the way she faced, 110 px away from it.
Neither the string nor the grab turned to a foe behind her, so the jab after a suplex or a rush also swung at air.
After the fix the same test ends each rush 10 to 19 px past the foe, facing it, and the jab lands.
Bellow: 20 MP, 4 s recharge on the HUD tab where Sable shows her snare's.
Every foe within 80 px takes 0.6x ability power, minions reel 0.5 s, and all of them are dragged 36 px toward her over 0.25 s, under three expanding crimson rings.
Flying minions are also dragged up to 48 px down to her hands and reel 0.9 s, so Bellow then a grab catches a flier that hovers out of reach.
Taunt: 0.7 s rooted, two chest slaps worth 12 Grit each, 3 s before the next.

## Balance check

Mash bot (walk to the nearest foe, mash J, take the first card), one deterministic run each, no shop upgrades:

| Hero | Falls on wave | Kills |
| --- | --- | --- |
| Kael | 4 | 10 |
| Ysra | 5 | 14 |
| Sable | 5 | 15 |
| Hulda | 4 | 10 |

The first build fell on wave 1 with no kills: the day's Glimmer Moths hover 35 to 50 px over the floor, out of reach of a 22 px fist, and the mash bot never jumps or grabs.
The haymaker and the uppercut now follow the fist up over her head (their boxes reach 42 and 44 px up), which took her to wave 3 with 6 kills.
Raising Grit per landed J blow from 3 to 4, the plan's first lever, took her to wave 3 with 9 kills.
The haymaker's lunge, a step in on its seventh frame that carries the overhand into a foe the string pushed back, took her to wave 4 with 10 kills, level with Kael.
A small step in on every blow was tried and dropped: it walked her under the moths and she fell on wave 2.

Skilled bot, the same way:

| Hero | Falls on wave | Kills |
| --- | --- | --- |
| Kael | 5 | 15 |
| Ysra | 7 | 24 |
| Sable | 5 | 15 |
| Hulda | 4 | 11 |

After the skill rework (7 November 2026) the skilled bot reached wave 5 with 18 kills (wave 3 with 6 on the commit before); her abilities moved to their own HUD tabs on I, so it casts Bellow, which drags the opening wave's moths down to her fists.
The bots never grab, throw or rush on purpose, so they show her floor; a player who grabs fliers out of the air and throws foes into each other does far better.

## Shop items and kit hooks

- Vitality: her HP.
- Honed Edge: every blow, knee, throw, thrown body, slam ring and both ultimates scale with `progress.stats.ad`.
- Arcana: Bellow scales with `progress.stats.ap`.
- Wellspring: Bellow and the ultimate spend MP.
- Precision: every blow and throw goes through `dealDamage`, which rolls crits.
- Light Boots: her walk, her walk while holding and the Bull Rush scale with `progress.stats.move`.
- Endurance: the Bull Rush spends stamina.
- Aftershock: the Bull Rush ending and each Skyfall Grab landing call `travelEnded()`.
- Lodestone and Head Start live in shared code.
- Last Light: blows reach `hurtHero`, where Last Light answers a fatal one before her armour is asked.

## Skills

Her 20 skills, their levels, evolutions and balance are in `docs/skills/hulda.md`; their data is in `src/constants/characters/hulda/skills/`.
Quake Drop is her special from the start; Titan Throw and Unbroken are the ultimate skills that replace it.

Quake Drop: she hops with both fists raised and slams them into the floor, and a crack in her ramp runs out to the level's reach, throwing rock chunks.
Each foe standing on the floor in reach takes the level's power once; minions are thrown up and bigger foes reel 0.6 s.
Titan Throw: crimson tethers yank every minion in reach into a heap over her head, she spins once and hurls the heap ahead as one body.
It strikes every foe in its path for 0.6x the level's power and bursts where it lands for the full power on each foe in the heap.
Minis and bosses are never pulled; they take the burst when it reaches them.
Unbroken: an iron form for a few seconds (more per charge level) in which no blow breaks a plate or flinches her and her damage is up; from level 3 every blow she lands sends a quake 40 px each way along the floor (one each 0.2 s).
Most of its value is these quakes: doubling her own blows for eight seconds alone is under one Quake Drop.

## Look and motion

Her skin is ash-grey hair cropped to dark stubble at the sides with a lighter crest and a braid, a scar through the brow, deep brown skin, a dark leather harness with an iron pauldron, a crimson sash, wrapped trousers and iron-toed boots (`src/constants/characters/hulda/look.ts`).
Both fists wear iron-banded gauntlets with wrapped wrists and knuckle studs, drawn with the arms (`src/game/hero/draw/gauntlets.ts`), and her rings, trails and sparks use a rust ramp.
Her own clips cover the guard idle, every blow, the hammer fist, the grab, the crush, the hold, the knee, the three throws, Skyfall, the Skyfall ride, the spell clips, the rush, Bellow, the taunt, the charge pose and both ultimates (`src/constants/clips/hulda/`).
Blows wind up the other way, snap on the hit frame and settle back to the guard, so the string chains without a seam; the haymaker holds four calm frames before it snaps.
Walk, jump, fall, hurt and death use the shared clips through Kael's motion layer (jump clock, landings, hand-overs) with her fists up before her chin (`src/game/hero/hulda/carry.ts`), and her stride is 20 px, shorter and heavier than Kael's.
A broken plate shoves her torso back a pixel for four frames over whatever she is doing.

## Code layout

- `src/game/hero/hulda/`: the kit (`kit.ts`), memory registered per seat (`memory.ts`), Grit and the plates (`grit.ts`, `armour.ts`), the string (`fists.ts`), the grab and crush (`grab.ts`), the hold (`hold.ts`), knees and throws (`throws.ts`), Skyfall (`skyfall.ts`), the slam ring (`slam.ts`), the rush, Bellow, the taunt, her jump, the pose and the carry layer, and the claims on held foes shared by every Hulda in a room (`claims.ts`).
- `src/game/effects/thrownBody.ts`, `bellowRing.ts`, `quakeLine.ts` and `plateShards.ts`.
- `src/game/ultimates/quakeDrop.ts` and `titanThrow.ts`.
- `src/ui/gritBar.ts`: the GR bar; the K tab shows Bellow's recharge for her.
- Numbers in `src/constants/hulda/`, skill icons in `src/ui/skills/icons/hulda/`.

## Co-op

Her memory registers per seat like Sable's.
A held foe belongs to the hero holding it, and a second Hulda cannot grab it.
A hold counts only while its holder refreshes it each step, so a downed or departed Hulda lets go at once.
Effects she spawns (the thrown body, Bellow's pull, the quake, Titan Throw) credit her through the shared owner path.

## Later

- An Evolution branch, as Kael and Ysra have.
- Her own walk built from a gait model; today it is Kael's legs with her fists up.
- Throws that read the foe's weight: today a Thornback and a Wisp fly the same.
- A grab cue on foes in reach, so a new player sees when K will catch.
