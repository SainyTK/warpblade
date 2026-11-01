<p align="center">
  <a href="https://warpblade.sainytk.com"><img src="docs/media/banner.png" alt="Warpblade: Kael stands in the night ruins as lightning strikes beside him" width="100%"></a>
</p>

<p align="center">
  <b>Throw the sword. Become the sword.</b><br>
  A pixel art action game where every sprite and every spark is drawn by code.
</p>

<p align="center">
  <a href="https://warpblade.sainytk.com"><img alt="Play in your browser" src="https://img.shields.io/badge/%E2%96%B6%20PLAY-warpblade.sainytk.com-7fe3ff?style=for-the-badge&labelColor=0c0a18"></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/LICENSE-MIT-e0ac48?style=for-the-badge&labelColor=0c0a18"></a>
  <img alt="No image files" src="https://img.shields.io/badge/ASSETS-0%20image%20files-b4a8ff?style=for-the-badge&labelColor=0c0a18">
</p>

---

## The story so far

The old city fell to the night a long time ago.
Its towers still stand under the moon, and rifts keep opening between them.

Kael is the last warp knight.
His crystal sword can be thrown, and wherever it lands, he follows.

<p align="center">
  <img src="docs/media/gameplay.gif" alt="Gameplay: a three-hit combo, a warp strike, then fire, ice and lightning spells against shadow creatures" width="100%">
</p>

## Features

- **Warp strike.** Throw the sword at a foe and appear beside it mid-swing. The farther you travel, the harder you hit.
- **Warp crystals.** Hold up and warp to a floating crystal, hang from it and recover MP while the fight goes on below.
- **Three-hit combo.** Cross cut, rising cut, falling smash, each with hit-stop and screen shake.
- **Three elements.** A flask of fire that sets the floor burning, a running line of ice spikes that freezes, and lightning that arcs to a second foe.
- **Phase dodge.** A dash that leaves afterimages, and nothing can touch you while you're in it.
- **Endless waves.** Floating wisps that lunge and horned husks that swipe, more each wave. They drop orbs that fly back to you as MP and HP.
- **Plays anywhere.** Keyboard on desktop, on-screen buttons on phones, no install.

<table>
  <tr>
    <td><img src="docs/media/shot-fire.png" alt="A fire flask bursts into flame and sparks"></td>
    <td><img src="docs/media/shot-ice.png" alt="Ice spikes erupt along the floor"></td>
    <td><img src="docs/media/shot-warp.png" alt="Kael in mid-air after a warp"></td>
  </tr>
  <tr>
    <td align="center">Fire</td>
    <td align="center">Ice</td>
    <td align="center">Warp</td>
  </tr>
</table>

## Controls

| Key | Action |
| --- | --- |
| `A` `D` or arrows | Run |
| `W`, `Up` or `Space` | Jump, press again in the air to double jump |
| `S` + jump | Drop through a ledge |
| `J` | Sword combo |
| `K` | Warp strike (10 MP). Hold `W` to warp to a crystal |
| `L` | Cast the selected spell (18 MP) |
| `Q` | Switch element: fire, ice, bolt |
| `Shift` | Phase dodge |
| `M` | Sound on or off |

`Z`, `X`, `C` and `V` also work for slash, warp, cast and switch.

## Run it locally

```sh
npm install
npm run dev
```

Other commands: `npm run build`, `npm run preview`, `npm run typecheck`, `npm run lint`, `npm run format`.

The stack is TypeScript, Vite and Biome.
There are no runtime dependencies besides three web fonts.

## How the pixels are made

This game is also my sandbox for learning how to make pixel art and effects that look good.
There are no image files in the game: the hero, the enemies, the stage and every effect are drawn pixel by pixel at runtime.

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

The README images are frames captured straight from the game canvas at 320 by 180 and scaled up with nearest-neighbour, so they show the real pixels.

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
docs/media/        README banner, gameplay GIF and screenshots
```

## References

- Hugo Duprez, [How to make (good) pixel art effects with Claude](https://www.spritefusion.com/blog/how-to-make-good-pixel-art-effects-with-claude)
- Sprite Fusion, [open-source pixel art VFX](https://www.spritefusion.com/pixel-art-vfx)
- [pixelfx](https://github.com/patch-gg/pixelfx), the effect library and authoring guide built on those effects

## License

MIT, see [LICENSE](LICENSE).
The particle kinds, the frame model and the slash crescent are adapted from Sprite Fusion's open-source pixel art VFX, MIT License, Copyright (c) 2026 Hugo Duprez.
