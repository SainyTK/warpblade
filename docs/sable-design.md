# Sable design

Sable shares the rig with Kael and Ysra and plays nothing like either of them.
Kael is a fast duelist with a warp, a dash and element spells.
Ysra is a heavy reach fighter with a brace, a vault and Heat.
Sable is a ranged hunter: a repeating crossbow, a quiver she has to reload, a grapple that zips her clear, a stock guard whose parry kicks foes away, and a hop back that shoots.
She is the most fragile of the three and wins by keeping foes at range.

## Controls

She plays on the moveset every hero shares (`docs/moveset-design.md`); her kit fills each button with her own move.

| Key | Sable |
| --- | --- |
| A / D | Walk, double tap to run |
| W | One light jump, no double jump, also out of a shot |
| S | With W, drop through a ledge. With J on the floor, reload |
| J tapped | The next bolt of her three-bolt string at the foe ahead, the third a closing bolt. An empty quiver starts the reload. While she reloads, J in the bright window is a perfect reload |
| J held | Grapple: a grapple bolt fired away from the nearest foe, a zip along its cord, and a heavy bolt back at that foe through every foe in the line (10 MP). The zip loads one bolt |
| K | Guard with the crossbow stock; just as a blow lands, Point-Blank: a kick that throws foes in front away and a full quiver with its first 4 bolts primed |
| L | The front dodge every hero shares |
| I tapped | The selected ability: the hop back and its shot, the snare, and her spell skills. On one that is recharging, the next ready one |
| I held | The wide form: the hop becomes a slide forward under blows, the snare is tossed under the foe ahead, Net Bolt throws a wider fan |
| O | Switch ability |
| U | Bolt Storm, charged by holding (shared charge and MP rules) |

On the touch controller the same buttons read Shoot, Jump, Dodge, Guard, Ability, Switch and Special.
The Shoot button taps for bolts and holds for the grapple; stick down with a Shoot tap reloads.

## The quiver and the reload

The quiver holds 9 bolts, three strings (Perfect Rhythm adds 3), and is shown as the QV bar, one notch per bolt, where the combo pips sit for the others.
A reload takes 1.05 s divided by attack speed, and she keeps walking, jumping, guarding and hopping while she cranks it.
The reload starts by itself when the quiver runs dry, on J with an empty quiver, and on J with Down held on the floor (also during a shot).
Down let go up to 0.15 s before the J tap still counts, since a tap is read when J comes up.
While she reloads the bar shows the crank's progress with a bright window from 42% to 62% of the way.
A J tap inside the window is a perfect reload: the quiver is full at once and the next 4 bolts are primed, dealing 35% more and burning white.
A J tap after the first quarter of the crank and outside the window jams it and adds 0.45 s.
Taps in the first quarter do nothing, so the taps that emptied the quiver never jam the reload; mashing J later does.
One try per reload.
MP pays for the grapple, spells and the ultimate; bolts cost nothing but time.

## The grapple warp

J held for 0.25 s is her warp, the shared move with the shared numbers (`WARP` in `src/constants/combat.ts`).
She is a ranged hero, so she turns away from the nearest foe and fires a grapple bolt at a point past her, or past the foe when a wall is close behind.
The bolt flies with its three hooks springing open and a cord paying out from the crossbow; she keeps the crossbow in her hands.
When it lands she zips along the cord, turns to the foe and looses a heavy bolt at it with the warp's power, which passes through every foe in its line.
The heavy bolt slides her back a little with its recoil.
Her extra is small: the zip cranks one bolt into the quiver.
Longshot reaches the warp: long zips add more power, and from its seventh level she holds two warps.

## Guard and Point-Blank

K raises the crossbow across her face, stock toward the blow.
It is a light guard: a block lets 40% of the damage through and costs 14 stamina.
A blow met in the parry window is Point-Blank: on the shared parry's hit-stop her boot is already out, every foe it reaches takes 1.6 times attack damage, a long throw and a 0.8 s stun, and the quiver is full at once with its first 4 bolts primed.
A parry counts as a perfect reload for Bolt Storm.
Heavy Boot makes the kick a weapon, makes the block bash back with the stock and lets less through.

## The hop on I

The hop back is her first ability on I, free, on its own 2 s recharge (Hop Volley shortens it and holds two).
Tapped, she hops back still facing the foe and looses a bolt at the top of the hop, untouchable for 0.32 s from the press.
Held on the floor, she slides forward under blows instead, untouchable for 0.35 s.
A blow met in the first 0.12 s of either is a perfect dodge through the shared `rewardPerfectDodge()`.
Neither costs stamina any more, so the shared dodge on L keeps all of it.

## The string and the aim

A string is three bolts, and each is a whole beat: she draws the crossbow in and holds it for four frames, the string lets go with a snap, the recoil holds and overshoots, and her weight rolls forward onto the front foot where the next bolt starts.
The first bolt is a shoulder shot that kicks the crossbow up, the second sinks low and hunched over the stock, and the closing bolt rocks back into a brace and throws the crossbow high.
After the closing bolt she cocks the crossbow for 6 frames: the muzzle tips down and the far hand hauls the string back.
Each J tap looses one bolt; a tap during a bolt plays the next one where this one ends.
A tap within 0.4 s of the last bolt's end goes on with the string; after that the next tap starts a new string.
The string always plays in the same order, wherever foes stand, and never turns her.
At attack speed 1 the bolts land about 0.32 to 0.34 and 0.37 to 0.38 real seconds apart, and the next string's first bolt lands about 0.65 s after the closing bolt.
Each bolt eases the foe back along the line of fire, the closing bolt twice as far, so three strings carry a walker from about 40 px to about 80 px: still well inside her 250 px reach, and far enough that a fragile hero keeps her range.
Each bolt staggers long enough to reach the next one (0.36 s and 0.4 s), and the closing bolt staggers 0.62 s, through the cock and the next first draw.
The hit-stop, shake and pitch grow through the string: 0.035, 0.045 and 0.075 real seconds of hit-stop.
A walker braces after seven staggers in a row, on the second bolt of the third string; Point-Blank's stun, a primed bolt (which breaks a wind-up), the heavy bolt, the hop and the slide all answer a braced foe.
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
- Grapple: the shared warp (10 MP, 2 s recharge, 1.8 times attack damage plus up to 2.8 for the distance); the heavy bolt flies at 760 px/s for 340 px.
- Guard: 40% chip, 14 stamina a block. Point-Blank: 1.6 times attack damage, a 380 px/s throw, a 0.8 s stun, 4 bolts primed.
- Hop: free, a 2 s recharge, a 3-frame crouch on the floor before the push off, a 16 px rise, back at 150 px/s times move, untouchable for 0.32 s from the press, a free bolt of 0.76 times attack damage 5 frames after the push off.
- Slide (the hop held): a 2-frame plant, then 0.3 s at 210 px/s times move, untouchable for 0.35 s from the press.
- Snare: 20 MP, 3.5 s recharge, two on the floor at once, 6 times ability power and a 1.6 s hold when a foe walks in. Held, 30 MP, tossed up to 110 px ahead under the nearest walking foe.

## Balance check

Mash bot (walk to the nearest foe, mash J, take the first card) and skilled bot, one deterministic run each, no shop upgrades:

| Sable | Mash bot | Skilled bot |
| --- | --- | --- |
| Before the shared moveset (core branch, 13 November 2026) | wave 5, 17 kills | wave 3, 6 kills |
| On the shared moveset | BOT_AFTER_MASH | BOT_AFTER_SKILLED |

The mash bot never reloads by hand, guards or uses I, so it shows her floor; a player who spaces with the hop, parries and times reloads does better.

## Shop items and kit hooks

Every bolt, kick and snare goes through `dealDamage` with `progress.stats.ad` or `progress.stats.ap`, so Honed Edge, Arcana and Precision apply.
The grapple, snares, spells and the ultimate spend MP (Wellspring), the guard spends stamina (Endurance), the hop recharges with spell haste, and the hop, slide and walk scale with `progress.stats.move` (Light Boots).
Attack speed shortens the time between shots and the reload.
Her hop and her slide each call `travelEnded()` when they end, so Aftershock answers both.
Blows on her go through `hurtHero`; the guard, the parry and the opening of the hop and the slide turn them away.

## Skills

Her 20 skills, their levels, evolutions and numbers are in `docs/skills/sable.md`; the data is in `src/constants/characters/sable/skills/`.
Bolt Storm is her one ultimate for the whole run: it shoots one bolt into the sky, and a rain of bolts falls on every foe in reach and the floor around them.
Bolt Storm the skill upgrades it: harder, marking and pinning, each foe struck more than once, doubled after a perfect reload or a parry, back sooner for kills, and evolved (Heartseeker) every bolt seeks a foe.

## Look and motion

Her skin is a pine hood with copper hair under it, an olive jerkin with bone buckles, a rust half-cape and a crossbow of dark wood with jade-steel limbs (`src/constants/characters/sable/look.ts`, `src/game/hero/draw/crossbow.ts`).
Her bolts, rings and sparks use a jade ramp.
Her own clips cover the idle, the shot at each aim on the floor and in the air, the guard, Point-Blank's kick, the hop, the slide and the snare (`src/constants/clips/sable/`).
The warp plays her own string: the grapple loosed as the first beat and held aimed while it flies, and the heavy bolt as the closing beat from its release.
The parry's segment of the guard plays the kick clip from its hit frame, so the boot is out on the parry's hit-stop.
Each bolt of the string has its own draw, release, recoil and follow-through, set as changes from the aim's stance, so every aim plays the same string (`src/constants/clips/sable/shoot.ts`).
The hop crouches before it pushes off and the slide plants before it glides; a longer Slide Kick glide holds the glide pose until she rises.
Walk, run, jump, fall, the dodge, hurt, charge, ultimate and death use the shared clips through Kael's motion layer (jump clock, landings, hand-overs), with her hands moved onto the crossbow (`src/game/hero/sable/carry.ts`).
While she reloads on the move the crossbow tips up and the far hand turns the crank in two-frame steps.

## Code layout

- `src/game/hero/sable/`: the kit (`kit.ts`), memory registered per seat (`memory.ts`), shots and aim, the bolt flight and its hits (`loose.ts`, with the skills' bonuses and hit effects in `bolt/`), the quiver and reload, the grapple warp (`warpStyle.ts`, its bolt and cord in `effects/grapple.ts` and `effects/cord.ts`), the guard and Point-Blank (`guardStyle.ts`), the hop and slide (`evade.ts`), the abilities on I (`abilities.ts`, with the spells in `spells/`: snare, net, decoy and keg), her jump, the pose and the carry layer.
- `src/game/skills/sable/`: the skills that act on their own: Venom Tips, Barbed Jaws, Lodged Bolts, Hunting Hawk, Snare Hound and Shade Archer.
- `src/game/effects/crossbowBolt.ts` and `src/game/effects/snareTrap.ts`: the bolt and the snare as effects.
- `src/game/ultimates/boltStorm.ts`: Bolt Storm, read with the Bolt Storm skill's values.
- `src/ui/quiverBar.ts`: the QV bar; the ability tabs and the touch I button show her selected ability like every hero's.
- Icons in `src/ui/skills/icons/sable/` and touch buttons in `src/ui/touch/icons/sableArt.ts`.

## Later

- Her own walk and run clips built from a gait model; today they are Kael's legs with her hands on the crossbow.
- Showing the chosen angle on the crossbow itself; today the bolt bends and the crossbow keeps the stance's angle.
- A ponytail free look: the hood still trails the shared scarf rope, which reads as a cape tail when she hops back.
