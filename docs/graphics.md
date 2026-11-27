# Graphics and frame cost

How Warpblade draws a frame, what each layer is for, and what a frame may cost.
Read this before changing how anything looks.

## The frame

The stage is 320 x 180 art pixels and the frame is 640 x 360 image pixels (`RES = 2` in `src/constants/stage.ts`).
Game positions, hitboxes and effect coordinates are in art pixels.
Everything is drawn in software into two buffers in `src/engine/frame.ts`.
The color buffer holds one opaque color per image pixel.
The light buffer holds additive light per art pixel.
`composite` adds the light to the color through a curve: dim light adds one for one, and stacked light eases toward a cap well short of white (`TONE_MOST`).
Light alone never turns a dark pixel white, so outlines under a burst stay readable, and stacking more glow on one spot adds little.
Put the brightest part of an effect in the color buffer as pixels, and use light for the bloom around it.

Drawing order is in `src/scene/renderScene.ts`: static scene, ambient light, effects behind, shadows, foes, heroes, effects in front, particles, pickups, weather, mist, flaring lights, numbers.

## The static scene

`src/scene/background.ts` paints the scene part by part in art pixels and notes each pixel's layer (`LAYER` in `src/scene/plate.ts`): sky, celestial, ridge, tower, ground, slab, prop.
`developPlate` turns that picture into the full detail plate: Scale2x half steps on slopes and curves, sky bands dithered on the image grid, haze on the ridge and towers toward the horizon color, and weathering on stone.
The world beyond the stage (`src/scene/backdrop.ts`) mirrors this plate outward without its slabs and braziers, so whatever an era paints continues past the edge.
A little way out it turns into a second plate built without bodies (`buildBackground(def, k, arena, false)`), so the sun or moon shows only once, on the stage.
An era leaves its sun, moons, rings and their light out of its `sky` hook and its detail when `PlatePaint.bodies` is false.
Above the stage the sky rises out of the stage's top rows and fades into the era's top sky band.
An era then paints fine detail on the plate through `SceneDef.detail`, with a `PlatePaint` that can hold a write to chosen layers.
The plate is built once when the wave's look changes, so anything static costs nothing per frame.
Prefer the plate for anything that does not move.

## Sprites

Heroes and foes are built from parts each time they are drawn, on a `detailCanvas` at image pixel detail (`src/engine/sprite.ts`).
Every hero is drawn on the shared rig (`src/rig/`) from a pose and the hero's skin (`docs/hero-module.md`, "The look").
A foe keeps its picture for about a thirtieth of a second of game time (`src/scene/foeSprites.ts`), and redraws at once when its state changes.
A foe's draw function must not change game state, spawn particles or read the play generator `rng`.
The game keeps two seeded generators in `src/game/state.ts`.
`rng` is for play only: AI choices, cooldowns, spawns, hit and crit chances, drops, pickups and level-up cards.
`fxRng` is for every draw whose value only reaches the picture: particle spawns, the screen shake, light flicker, afterimage and damage number jitter, and effect fields that only `draw()` reads.
So adding, removing or repainting an effect never changes a fight, and the screen's frame rate never changes what a foe does.
`npm run lint` forbids importing `rng` anywhere under `src/scene/`, and forbids namespace imports (`import * as`) there so no import can reach it another way.
`drawShadows` puts a soft shadow under every foe and hero on the floor below it.

## Drawing tools

- `px`, `line`, `circle`, `polygon`, `ellipseRing`: whole art pixels, dithered when alpha is under 1.
- `fleck`, `hairline`: single image pixels, for tips, tails, glints and thin edges.
- `disc`, `shade` with `soft`: true blends, for smoke, mist and vapour.
- `glow`, `glowLine`, `sparkle` and the `Lights` list: light.
- `Particles` (`src/engine/particles.ts`): sparks, motes, streaks, flakes, vapour, dust, smoke, fire, brands, embers, shards, stars.
  Its own draws come from `fxRng`. A brand (a burning chunk) is play, since it lights a damaging blaze where it lands: spawn it with `rng`, and it is never dropped at the particle cap.
- `SpriteCanvas`: `dot`, `stroke`, `taper`, `poly`, `block`, `hairline`, `pixels`, `shadeEdges`, `commit`, `outline`, `shift` (move the shapes that follow, for a body that leans or sinks as one) and `clipBelow` (erase what sank under the floor).

## What makes it look good

- One light direction per scene. The sun and the moon sit at the upper right, so far things are lit on their right side.
- Value separation first. A foe must read against its era's background at a glance: a lighter rim, a darker outline or a different hue from what is behind it.
- Ramps of three to five tones per material, with hue shifting toward warm in light and cool in shadow. No flat fills on anything larger than a few pixels.
- Motion has anticipation, a smear on the fastest frame and a settle. Effects start fast and bright and end slow and dim.
- Effects are layered: a white or near-white core, a mid tone body, a dark or saturated edge, fine image pixel tips, then light around it.
- Fades break up with dither or thin out in size. A shape that only fades in alpha looks flat.
- The fight must stay readable. An effect never hides a foe's wind-up, the hero or a telegraph for longer than a few frames.

## Frame cost

The simulation steps at 120 Hz and costs little; drawing is the cost.
Measure with a 60 Hz equivalent loop (two steps and one `renderScene` a frame) in a busy fight.
On an M-series Mac the busiest abyss fight (20 foes) takes about 2.5 ms a frame; a phone is four to five times slower, so a frame there has to stay under about 12 ms.

- Per frame cost scales with the image pixels touched. A full-screen `shade` or a glow of radius 100 each frame is expensive; a dozen small glows are cheap.
- Light is per art pixel and costs a quarter of the same area in color.
- Allocate nothing per frame in hot paths: reuse arrays, avoid closures per pixel.
- Static detail belongs on the plate.

## Skill effects

Every skill's in-game effect goes through one module, `src/game/skillFx`, so an early skill reads clean and small and a late or evolved one reads extreme, the same way on every hero.
Kael is the worked example: every one of his 20 skills calls it (`src/heroes/kael/game/drill/skills/` and `src/heroes/kael/game/skills/`).

### The call

```ts
import { skillFx } from "../../../../../game/skillFx";

skillFx("k_flame", "burst", { x, y, reach: 12 }, { damage });
```

- `id` is the skill id. Its level, mastery and evolution are read from the build, and its element from the skill's `element`.
- `shape` is one of `burst`, `slash`, `pillar`, `wave`, `trail`, `bolt`, `nova`, `spikes`, `mark`.
- `at` is where it draws, in world art pixels: `x`, `y`, `face`, `reach` (the shape's base size before the tier grows it), and `toX`, `toY` for a trail or a bolt that runs between two points.
  Grounded shapes (`pillar`, `wave`, `nova`, `spikes`) take the floor as `y`: use `surfaceBelow(x, y)`.
- `damage` is the hit the effect stands for. Pass the real number the skill deals.
- `quiet: true` marks a secondary part (a tick, a repeat, a splash on the second foe). It draws one step smaller, with no shake, hit stop, flash, sound or light, and is the first thing the budget drops.
- `delay` waits before it shows, for follow-up hits.
- `element` overrides the skill's element for one cast, and `signature` draws a hero's own shape over the shared one with the same arguments as a shape (`FxShapeDraw`).

`playSkillFx(shape, cast, at, options)` takes a cast you built with `castFrom(id, element, input)`, for previews and tests.

### Tiers

The intensity of a cast is the skill level (0 at level 1, 1 at level 8), plus 0.1 per mastery level, plus 1 when evolved, plus the damage punch: a third for each doubling of the hit over the hero's expected hit at this hero level (base attack damage times the level power), from -0.3 to +0.6.
A quiet cast takes 0.5 off.

| Tier | Intensity | What it adds |
| --- | --- | --- |
| early | under 0.35 | the bare shape, thin and small, a little light, one quiet sound layer |
| mid | 0.35 to 0.8 | element motifs along the shape, a ground ring or rays, an arrival core, a branch, one afterimage, embers, a light shake |
| late | 0.8 and up | a crossing or flanking second shape (cross cut, side pillars, side bolts, flank streaks), ground cracks, debris, hit stop, two sound layers |
| evolved | evolved and 1.8 and up | the shape at twice the size or more, a field or wall of it, satellites and arcs to nearby foes, a brief screen dim on bolts, a scorch on the floor, bloom, a short flash, three sound layers |

An evolved cast of 2.4 and up also fills the screen: a column to the sky, a cut across the stage or a ring to the stage edge.
Mastery moves a cast up inside its tier (`gradeInTier`), and each shape grows by up to a third with it, so mastery 4 reads larger than level 8.
Every mastered cast also shows its mastery marks (`src/game/skillFx/mastery.ts`, numbers in `FX_MASTERY`): one element star per mastery level on an arc above the cast, clear of the hero, the same count as the Mastery pips on the skill card.
Each shape sizes itself from tables by tier rank (for example `RADIUS_BY_RANK` in `slash.ts`, `TALL_BY_RANK` in `spikes.ts` and `pillar.ts`), so the order is the same for every skill whatever its base `reach`.
Numbers live in `src/constants/skillFx.ts` (`FX_TIERS`, `FX_INTENSITY`).

### Element kits

Each element has a kit in `src/game/skillFx/kits/` with its ramp, particles and sounds and four building blocks every shape uses: `motif` (a flame tongue, an ice shard, a lightning fork, a venom tendril with a bubble, a void tear), `core`, `spray` and `linger`.
Shapes never pick colours themselves, so the same shape is a fire scythe for Blaze and a crescent tear for Void.
A hero-specific picture goes in `signature`; it may call `ELEMENT_KITS[element].motif` to stay in the element's style.

### Settings, readability and budget

- Screen shake goes through `shake()`, which the Options toggle and reduced motion already silence.
  With reduced motion (`src/services/reducedMotion.ts`) there is no flash and no afterimage, and hit stop is halved.
- Skill effects draw no damage numbers, so the Options toggle for numbers is untouched.
- After its first 0.05 s an effect over a foe that is winding up (any state but drift, walk or recover) fades: to 0.6 over a minion, to 0.3 over a mini boss or boss, with a wider margin around bosses, so wind-ups and telegraphs stay readable.
- Light is capped so silhouettes survive a bright stage: tier light strength 0.2 to 0.32, bloom only on evolved casts, core glows 0.12, and quiet casts add no light.
- No light washes a body to white, whatever the tier or how much is stacked.
  The frame tones a pixel's summed light by its brightest channel, so stacked colour keeps its hue, and light may never lift a pixel's darkest channel past 180 (`BLEACH_FLOOR` in `src/engine/frame.ts`), so a glow tints a hero or a foe in its element colour and stops short of white.
  Shared shapes and kits draw no pure white: their hottest stroke is the element ramp's top colour, and hits landing close together share one impact light.
- The budget (`FX_BUDGET`): each live effect costs 1, 2, 3 or 5 by tier; past 15 quiet casts are dropped and the rest shed particles, past 28 new casts are dropped.
  At most 180 particles a step, 8 live lights, glow radius 80, shake amplitude 5, one shake per 0.12 s and one hit stop per 0.3 s, and glows only on strokes drawn at half alpha or more.
- Measured in Chromium on an M-series Mac with 20 foes on screen and four evolved casts spawned every frame (far past real play): 4.8 ms a frame without skill effects, 7.7 ms with them, the budget holding the screen at five evolved effects.
  One evolved slash costs about 1.5 ms to draw, an evolved burst 0.8 ms, a late one 0.2 to 0.5 ms.

### Matching the icon

Open the hero's contact sheet of skill icons and, for each skill, name the icon's subject and colour, then pick the shape that draws that subject:

| Icon subject | Shape |
| --- | --- |
| a crescent or blade sweep | `slash` |
| an explosion, a shatter, a flask | `burst` |
| a column, a launch, a plunged sword, a fountain | `pillar` |
| crystals or spikes rising from the ground | `spikes` |
| a ground-running crest | `wave` |
| a dash, a streak, a phase | `trail` |
| lightning from above | `bolt` |
| a ring on the floor, a vortex, a stomp | `nova` |
| a stack, a curse, a sigil on a foe | `mark` |

The colour comes from the skill's `element`; if the icon's colour and the element disagree, fix the element in the skill data, never the kit.
Kael's Rift Wound is Venom in its icon, so its wound and collapse now draw in the Venom ramp.

### Per-skill checklist

1. Find where the skill's hit happens (drill hook, skill behaviour or kit move) and call `skillFx` there with the real damage.
2. One main cast per press; secondary hits, ticks and splashes are `quiet`.
3. Place it on the hero for presses (`hero.x`, `hero.y - 16`, `face`) and on the foe for what lands on it (`enemyCenter(foe)`, or the floor under it for grounded shapes).
4. Keep the skill's own existing effect; the tiered effect sits on top of it.
5. Check it in the Training room (`?training=<hero>`) at level 1, level 8, mastery 4 and evolved, at game scale: no blur, no halo washing out the hero, aligned to the hero and the foe.
6. Check a busy fight with a boss wind-up: the wind-up stays readable.
