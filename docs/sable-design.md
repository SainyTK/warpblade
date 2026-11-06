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
| W | One light jump, no double jump. With J held, aim up |
| S | With J held, kneel and shoot low on the floor, or shoot down at a slant in the air |
| J | Shoot a bolt. Hold to keep shooting. An empty quiver starts the reload |
| K | Kick: a front kick that throws foes away, on the floor or in the air |
| L | Hop back, still facing the foe, and shoot a free bolt at the top of the hop. With the side ahead held on the floor, slide forward under blows |
| I | Set a snare at her feet (20 MP) |
| O | Reload. Press again in the bright window for a perfect reload |
| U | Ultimate (shared charge and MP rules) |

On the touch controller the same buttons read Shoot, Jump, Hop, Kick, Snare, Reload and Special, and the stick's up and down aim while Shoot is held.

## The quiver and the reload

The quiver holds 8 bolts (Deep Quiver adds 3 per rank) and is shown as the QV bar, one notch per bolt, where the combo pips sit for the others.
A reload takes 1.05 s divided by attack speed, and she keeps walking, jumping and kicking while she cranks it.
The reload starts on O, on J with an empty quiver, or by itself when the quiver runs dry.
While she reloads the bar shows the crank's progress with a bright window from 42% to 62% of the way.
A second O inside the window is a perfect reload: the quiver is full at once and the next 4 bolts are primed, dealing 35% more and burning white.
A second O outside the window jams the crank and adds 0.45 s.
Only O times the reload, so mashing J never jams it.
MP pays for snares and the ultimate; bolts cost nothing but time.

## Aim

Bolts fly at 430 px/s for 250 px and stop in the first foe they hit unless they pierce.
Up angles the shot about 29 degrees up, Down kneels for a low flat shot on the floor or slants it about 35 degrees down in the air.
Each shot bends toward the foe nearest the aim within 0.4 rad, so the aim chooses between a flier and a walker and does not have to be exact.
The cone widens to 1.35 rad for a foe 70 px away or nearer, so a flier hovering over her can still be shot.
Without that widening the mash bot stood under the wave 1 moths and fell on wave 1 with 2 kills.
A foe pressed up against her is struck between her chest and the muzzle.

## Numbers to start from

- Base stats: HP 85 (Kael 100, Ysra 130), attack 11, ability 8, MP 90, stamina 110, crit 8%, move 1.12, attack speed 1.
- A bolt deals 0.95 times attack damage; one shot every 0.24 s at attack speed 1.
- Kick: hit on frame 4 of 11, a box 2 to 20 px ahead, 0.55 times attack damage, a strong push, a 0.5 s stun. In the air a landed kick springs her up and back.
- Hop: 22 stamina, a 16 px rise, back at 150 px/s times move, untouchable for 0.22 s, a free bolt at 80% on frame 5. Once on the floor and once in the air.
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

## Skill tree

The tree lives in `src/constants/characters/sable/`: Marksman (early), Skirmish (steady), Trapper (late) and Fusion.

- Marksman: Heavy Draw (attack +1 per rank), Piercing Bolts (one more foe per rank), Deep Quiver, Bolt Storm (her special from level 3), Ricochet (a bounce off the floor or edge, and a bolt flies on through a kill), Scattershot (a fan of three for one bolt), and Deadeye (the ultimate that replaces Bolt Storm).
- Skirmish: Fleet Foot (move and stamina), Hop Volley (three bolts from the hop), Heavy Boot (a harder kick that bounces foes off the edge), Slide Kick (the slide trips foes).
- Trapper: Snare (learned from the start), Perfect Rhythm (a wider window and more primed bolts), Barbed Snare, Twin Snare, Hunter's Focus (a perfect reload gives back stamina and MP).
- Fusion: Boot and Bolt (a landed kick loads 2 bolts), Tripwire Volley (a sprung snare shoots at every foe near it).

Bolt Storm shoots one bolt into the sky, and a rain of bolts falls on every foe in reach and the floor around them.
Deadeye is one heavy bolt the length of the stage through every foe at her eye line, one each way at level 3, and a bolt at every foe on the screen at level 4.

## Look and motion

Her skin is a pine hood with copper hair under it, an olive jerkin with bone buckles, a rust half-cape and a crossbow of dark wood with jade-steel limbs (`src/constants/characters/sable/look.ts`, `src/game/hero/draw/crossbow.ts`).
Her bolts, rings and sparks use a jade ramp.
Her own clips cover the idle, the shot at each aim on the floor and in the air, the kick, the hop, the slide and the snare (`src/constants/clips/sable/`).
A shot braces, snaps back on the release frame and settles to the stance it began from, so held shots chain without a seam.
Walk, run, jump, fall, hurt, charge, ultimate and death use the shared clips through Kael's motion layer (jump clock, landings, hand-overs), with her hands moved onto the crossbow (`src/game/hero/sable/carry.ts`).
While she reloads on the move the crossbow tips up and the far hand turns the crank in two-frame steps.

## Code layout

- `src/game/hero/sable/`: the kit (`kit.ts`), memory registered per seat (`memory.ts`), shots and aim, the bolt flight and its hits (`loose.ts`), the quiver and reload, the kick, the hop and slide (`evade.ts`), the snare, her jump, the pose and the carry layer.
- `src/game/effects/crossbowBolt.ts` and `src/game/effects/snareTrap.ts`: the bolt and the snare as effects.
- `src/game/ultimates/boltStorm.ts` and `deadeye.ts`.
- `src/ui/quiverBar.ts`: the QV bar; the K tab shows the snare's recharge for her.
- Icons in `src/ui/skills/icons/sable/` and touch buttons in `src/ui/touch/icons/sableArt.ts`.

## Later

- A grapple or a decoy as a second travel or defence move.
- An Evolution branch, as Kael and Ysra have.
- Her own walk and run clips built from a gait model; today they are Kael's legs with her hands on the crossbow.
- Showing the aim assist's chosen angle on the crossbow itself; today the bolt bends and the crossbow keeps the stance's angle.
- A ponytail free look: the hood still trails the shared scarf rope, which reads as a cape tail when she hops back.
