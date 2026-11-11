# Sable design

Sable shares the rig with Kael and Ysra and plays nothing like either of them.
Kael is a fast duelist with a warp, a dash and element spells.
Ysra is a heavy reach fighter with a brace, a vault and Heat.
Sable is a ranged hunter: a repeating crossbow, a quiver she has to reload, a kick to make space, a hop back that shoots and a slide under blows.
She is the most fragile of the three and wins by keeping foes at range.

## Controls

| Key | Sable |
| --- | --- |
| A / D | Walk, double tap to run |
| W | One light jump, no double jump, also out of a shot |
| S | With W, drop through a ledge |
| J | Shoot a string of three bolts at the foe ahead, the last a closing bolt. Hold to keep shooting. An empty quiver starts the reload |
| K | Kick: a front kick that throws foes away, on the floor or in the air |
| L | Hop back, still facing the foe, and shoot a free bolt at the top of the hop. From a walk or run toward the side she faces, slide forward under blows |
| I | Cast the selected spell: a snare at her feet (20 MP) from the start, and her spell skills. After each cast the next ready spell is selected |
| O | Reload. Press again in the bright window for a perfect reload |
| U | Ultimate (shared charge and MP rules) |

On the touch controller the same buttons read Shoot, Jump, Hop, Kick, Spell, Reload and Special.

## The quiver and the reload

The quiver holds 9 bolts, three strings (Perfect Rhythm adds 3), and is shown as the QV bar, one notch per bolt, where the combo pips sit for the others.
A reload takes 1.05 s divided by attack speed, and she keeps walking, jumping and kicking while she cranks it.
The reload starts on O, on J with an empty quiver, or by itself when the quiver runs dry.
While she reloads the bar shows the crank's progress with a bright window from 42% to 62% of the way.
A second O inside the window is a perfect reload: the quiver is full at once and the next 4 bolts are primed, dealing 35% more and burning white.
A second O outside the window jams the crank and adds 0.45 s.
Only O times the reload, so mashing J never jams it.
MP pays for snares and the ultimate; bolts cost nothing but time.

## The string and the aim

A string is three bolts, and each is a whole beat: she draws the crossbow in and holds it for four frames, the string lets go with a snap, the recoil holds and overshoots, and her weight rolls forward onto the front foot where the next bolt starts.
The first bolt is a shoulder shot that kicks the crossbow up, the second sinks low and hunched over the stock, and the closing bolt rocks back into a brace and throws the crossbow high.
After the closing bolt she cocks the crossbow for 6 frames: the muzzle tips down and the far hand hauls the string back.
J pressed during a bolt, or held, plays the next bolt where this one ends; the string always plays in the same order, wherever foes stand, and never turns her.
A shot pressed after she has settled starts a new string.
At attack speed 1 the bolts land about 0.32 to 0.34 and 0.37 to 0.38 real seconds apart, and the next string's first bolt lands about 0.65 s after the closing bolt.
Each bolt eases the foe back along the line of fire, the closing bolt twice as far, so three strings carry a walker from about 40 px to about 80 px: still well inside her 250 px reach, and far enough that a fragile hero keeps her range.
Each bolt staggers long enough to reach the next one (0.36 s and 0.4 s), and the closing bolt staggers 0.62 s, through the cock and the next first draw.
The hit-stop, shake and pitch grow through the string: 0.035, 0.045 and 0.075 real seconds of hit-stop.
A walker braces after seven staggers in a row, on the second bolt of the third string; the kick's stun, a primed bolt (which breaks a wind-up), the hop and the slide all answer a braced foe.
In the air she looses two bolts per airtime, the second a closing bolt; Featherdraw raises it to three.
Bolts fly at 430 px/s for 250 px and stop in the first foe they hit unless they pierce.
Up and Down do not aim: each shot picks the nearest foe ahead, from steeply above to a little below, and takes the stance that fits it (up, level, kneeling low, or slanted down in the air).
This only tilts the shot at a foe she already faces; it never turns her and never changes which bolt of the string plays.
Each shot bends toward the foe nearest the stance's aim within 0.6 rad.
The cone widens to 1.35 rad for a foe 70 px away or nearer, so a flier hovering over her can still be shot.
Without that widening the mash bot stood under the wave 1 moths and fell on wave 1 with 2 kills.
A foe pressed up against her is struck between her chest and the muzzle.

## Numbers to start from

- Base stats: HP 85 (Kael 100, Ysra 130), attack 11, ability 8, MP 90, stamina 110, crit 8%, move 1.12, attack speed 1.
- A bolt deals 1.11 times attack damage and the closing bolt 2.1 (0.95 and 1.8 before the string's bolts each took a full draw, raised so the damage per second holds).
- A string runs 27 animation frames at attack speed 1: 7 for each bolt and 6 for the cock.
- Kick: hit on frame 4 of 11, a box 2 to 20 px ahead, 0.55 times attack damage, a strong push, a 0.5 s stun. In the air a landed kick springs her up and back.
- Hop: 22 stamina, a 3-frame crouch on the floor before the push off, a 16 px rise, back at 150 px/s times move, untouchable for 0.32 s from the press, a free bolt of 0.76 times attack damage 5 frames after the push off. Once on the floor and once in the air.
  A blow met in its first 0.12 s is a perfect dodge (the shared reward through `rewardPerfectDodge`), and the same for the slide.
- Slide: 18 stamina, a 2-frame plant, then 0.3 s at 210 px/s times move, untouchable for 0.35 s from the press.
- Snare: 20 MP, 3.5 s recharge, two on the floor at once, 2.6 times ability power and a 1.6 s hold when a foe walks in.

## Balance check

Mash bot (walk to the nearest foe, mash J, take the first card), one deterministic run each, no shop upgrades:

| Hero | Falls on wave | Kills |
| --- | --- | --- |
| Kael | 4 | 10 |
| Ysra | 5 | 14 |
| Sable | 5 | 15 |

The mash bot never reloads by hand, hops or kicks, so it shows her floor; a player who spaces and times reloads does better.

## Shop items and kit hooks

Every bolt, kick and snare goes through `dealDamage` with `progress.stats.ad` or `progress.stats.ap`, so Honed Edge, Arcana and Precision apply.
Snares and the ultimate spend MP (Wellspring), the hop and slide spend stamina (Endurance), and the hop, slide and walk scale with `progress.stats.move` (Light Boots).
Attack speed shortens the time between shots and the reload.
Her hop and her slide each call `travelEnded()` when they end, so Aftershock answers both.
Blows on her go through `hurtHero`; only the opening of the hop and the slide turns them away.

## Skills

Her 20 skills, their levels, evolutions and numbers are in `docs/skills/sable.md`; the data is in `src/constants/characters/sable/skills/`.
Bolt Storm is her base special: it shoots one bolt into the sky, and a rain of bolts falls on every foe in reach and the floor around them.
Deadeye, the ultimate skill, replaces it with one heavy bolt the length of the stage through every foe at her eye line.

## Look and motion

Her skin is a pine hood with copper hair under it, an olive jerkin with bone buckles, a rust half-cape and a crossbow of dark wood with jade-steel limbs (`src/constants/characters/sable/look.ts`, `src/game/hero/draw/crossbow.ts`).
Her bolts, rings and sparks use a jade ramp.
Her own clips cover the idle, the shot at each aim on the floor and in the air, the kick, the hop, the slide and the snare (`src/constants/clips/sable/`).
Each bolt of the string has its own draw, release, recoil and follow-through, set as changes from the aim's stance, so every aim plays the same string (`src/constants/clips/sable/shoot.ts`).
The hop crouches before it pushes off and the slide plants before it glides; a longer Slide Kick glide holds the glide pose until she rises.
Walk, run, jump, fall, hurt, charge, ultimate and death use the shared clips through Kael's motion layer (jump clock, landings, hand-overs), with her hands moved onto the crossbow (`src/game/hero/sable/carry.ts`).
While she reloads on the move the crossbow tips up and the far hand turns the crank in two-frame steps.

## Code layout

- `src/game/hero/sable/`: the kit (`kit.ts`), memory registered per seat (`memory.ts`), shots and aim, the bolt flight and its hits (`loose.ts`, with the skills' bonuses and hit effects in `bolt/`), the quiver and reload, the kick, the hop and slide (`evade.ts`), the spells on I (`spells/`: the rotation, snare, net, decoy and keg), her jump, the pose and the carry layer.
- `src/game/skills/sable/`: the skills that act on their own: Venom Tips, Barbed Jaws, Lodged Bolts, Hunting Hawk, Snare Hound and Shade Archer.
- `src/game/effects/crossbowBolt.ts` and `src/game/effects/snareTrap.ts`: the bolt and the snare as effects.
- `src/game/ultimates/boltStorm.ts` and `deadeye.ts`.
- `src/ui/quiverBar.ts`: the QV bar; the K tab shows the selected spell and its recharge for her.
- Icons in `src/ui/skills/icons/sable/` and touch buttons in `src/ui/touch/icons/sableArt.ts`.

## Later

- A grapple or a decoy as a second travel or defence move.
- Her own walk and run clips built from a gait model; today they are Kael's legs with her hands on the crossbow.
- Showing the chosen angle on the crossbow itself; today the bolt bends and the crossbow keeps the stance's angle.
- A ponytail free look: the hood still trails the shared scarf rope, which reads as a cape tail when she hops back.
