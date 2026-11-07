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

A string is three bolts; the third is a closing bolt that deals 1.3 times attack damage, pushes twice as far and staggers longer, then the crossbow cocks for 0.18 s.
A shot pressed after she has settled starts a new string.
In the air she looses two bolts per airtime, the second a closing bolt; Featherdraw raises it to three.
Bolts fly at 430 px/s for 250 px and stop in the first foe they hit unless they pierce.
Up and Down do not aim: each shot picks the nearest foe ahead, from steeply above to a little below, and takes the stance that fits it (up, level, kneeling low, or slanted down in the air).
Each shot bends toward the foe nearest the stance's aim within 0.6 rad.
The cone widens to 1.35 rad for a foe 70 px away or nearer, so a flier hovering over her can still be shot.
Without that widening the mash bot stood under the wave 1 moths and fell on wave 1 with 2 kills.
A foe pressed up against her is struck between her chest and the muzzle.

## Numbers to start from

- Base stats: HP 85 (Kael 100, Ysra 130), attack 11, ability 8, MP 90, stamina 110, crit 8%, move 1.12, attack speed 1.
- A bolt deals 0.95 times attack damage; one shot every 0.24 s at attack speed 1.
- Kick: hit on frame 4 of 11, a box 2 to 20 px ahead, 0.55 times attack damage, a strong push, a 0.5 s stun. In the air a landed kick springs her up and back.
- Hop: 22 stamina, a 16 px rise, back at 150 px/s times move, untouchable for 0.22 s, a free bolt at 80% on frame 5. Once on the floor and once in the air.
  A blow met in its first 0.12 s is a perfect dodge (the shared reward through `rewardPerfectDodge`), and the same for the slide.
- Slide: 18 stamina, 0.3 s at 210 px/s times move, untouchable for 0.28 s.
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
A shot braces, snaps back on the release frame and settles to the stance it began from, so held shots chain without a seam.
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
