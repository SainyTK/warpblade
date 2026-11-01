# Warpblade

A small pixel art action game, and my sandbox for learning how to make good pixel art and effects in code.

Play it at [warpblade.sainytk.com](https://warpblade.sainytk.com).

You play Kael, a warp knight of the night ruins.
He fights with a crystal sword, throws it and appears wherever it lands, and casts fire, ice and lightning.
Shadow creatures come through rifts in waves.

There are no image files.
The hero, the enemies, the stage and every effect are drawn pixel by pixel by the code at runtime.

## Controls

| Key | Action |
| --- | --- |
| `A` `D` or arrows | Run |
| `W`, `Up` or `Space` | Jump, press again in the air to double jump |
| `S` + jump | Drop through a ledge |
| `J` | Sword combo: cross cut, rising cut, falling smash |
| `K` | Warp strike (10 MP). Hold `W` to warp to a floating crystal and hang there |
| `L` | Cast the selected spell (18 MP) |
| `Q` | Switch element: fire, ice, bolt |
| `Shift` | Phase dodge |
| `M` | Sound on or off |

On touch screens, buttons appear under the stage.
`Z`, `X`, `C` and `V` also work for slash, warp, cast and switch.

## Run it

```sh
npm install
npm run dev
```

Other commands: `npm run build`, `npm run preview`, `npm run typecheck`, `npm run lint`, `npm run format`.

The stack is TypeScript, Vite and Biome, with no runtime dependencies other than three web fonts.

## How the pixels are made

The stage is 320 by 180 art pixels, scaled up by a whole number so every pixel stays square.
Each frame is drawn into two buffers, as in Sprite Fusion's effects:

- a color buffer for opaque pixels, faded with a 4 by 4 Bayer dither, or truly blended for smoke and mist;
- a light buffer for additive glow, composited on top.

The rules I took from the references, and where they show up:

- Build effects from lines, rims, sparks and light, not flat fills. The slash is a crescent that whips out white at the rim and cools down a blue ramp as its tail follows (`src/game/effects/slash.ts`).
- Put light everywhere. Hits, spells and pickups add lights that flare and fall away with life squared (`src/engine/lights.ts`).
- Use real motion. Sparks stretch with speed and bounce, smoke swells and thins, fire cools down its ramp into smoke, shards tumble and settle (`src/engine/particles.ts`).
- Choreograph in phases: gather, release with a white flash, spread, linger, fade. The lightning bolt marks its target before it strikes, and the ice spikes erupt one after another, stand, then shatter.
- Give every blow an act. Each attack winds up the opposite way, snaps to a new silhouette on the hit frame, freezes the game for a few hundredths of a second on contact, shakes the screen and follows through (`src/constants/hero.ts`).

Kael is drawn from a small skeleton every frame (`src/game/hero/drawHero.ts`).
Arms and legs are placed by two-bone reach, each body part is outlined where it overlaps the one behind it, and the whole figure gets a dark outline.
His scarf and ponytail are verlet ropes, so they trail behind him as he runs and warps (`src/game/hero/chain.ts`).

## Project layout

```text
src/
  main.ts          wires everything and runs the 120 Hz loop
  types/           shared types
  constants/       stage layout, palettes, poses and attack keyframes, tuning, key map
  utils/           pure helpers: math, color, seeded random
  engine/          the pixel renderer: frame buffers and painter, particles, lights, sprite canvas
  services/        Web Audio sound effects, best score in local storage
  game/            the simulation
    hero/          poses, drawing, rope physics, actions, per-step update
    enemies/       wisps and husks: drawing and behavior
    effects/       slash, impact, floor ring, warp line, rift, thrown sword
    spells/        fire, ice, bolt
  scene/           background and the order layers are drawn in
  ui/              HUD, keyboard and touch input, sound button, stage sizing
```

## References

- Hugo Duprez, [How to make (good) pixel art effects with Claude](https://www.spritefusion.com/blog/how-to-make-good-pixel-art-effects-with-claude)
- Sprite Fusion, [open-source pixel art VFX](https://www.spritefusion.com/pixel-art-vfx)
- [pixelfx](https://github.com/patch-gg/pixelfx), the effect library and authoring guide built on those effects

## License

MIT, see [LICENSE](LICENSE).
The particle kinds, the frame model and the slash crescent are adapted from Sprite Fusion's open-source pixel art VFX, MIT License, Copyright (c) 2026 Hugo Duprez.
