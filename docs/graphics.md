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
An era then paints fine detail on the plate through `SceneDef.detail`, with a `PlatePaint` that can hold a write to chosen layers.
The plate is built once when the wave's look changes, so anything static costs nothing per frame.
Prefer the plate for anything that does not move.

## Sprites

Heroes and foes are built from parts each time they are drawn, on a `detailCanvas` at image pixel detail (`src/engine/sprite.ts`).
A foe keeps its picture for about a thirtieth of a second of game time (`src/scene/foeSprites.ts`), and redraws at once when its state changes.
A foe's draw function must not change game state, spawn particles or read the game's random stream.
`drawShadows` puts a soft shadow under every foe and hero on the floor below it.

## Drawing tools

- `px`, `line`, `circle`, `polygon`, `ellipseRing`: whole art pixels, dithered when alpha is under 1.
- `fleck`, `hairline`: single image pixels, for tips, tails, glints and thin edges.
- `disc`, `shade` with `soft`: true blends, for smoke, mist and vapour.
- `glow`, `glowLine`, `sparkle` and the `Lights` list: light.
- `Particles` (`src/engine/particles.ts`): sparks, motes, streaks, flakes, vapour, dust, smoke, fire, brands, embers, shards, stars.
- `SpriteCanvas`: `dot`, `stroke`, `taper`, `poly`, `block`, `hairline`, `pixels`, `shadeEdges`, `commit`, `outline`.

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
