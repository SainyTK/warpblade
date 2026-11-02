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
- **Combos that grow.** Two hits at level 1, six by level 17.
  Every hit is its own move: a step-in cut, a rising backhand, a lunging double stab, a hop into a cleave, a turn that cuts both sides and a falling smash that knocks the foe down.
  Learn launchers, sweeps, dash and running attacks, and finishers that cut through a foe to its back or bounce it into the sky.
- **Combos that read the room.** The next hit follows the fight: Kael turns to cut a foe behind him, spins when foes stand on both sides, stabs a foe lying down, leaps after one in the air, and bounces foes off the edge of the stage.
  In the air the string is a cross cut, a somersault, a drill of stabs and a hammer fall.
- **Keen timing.** Press J just after a blow lands and the next one is a sure critical hit with a gold slash.
  Pressing before the blow lands spoils it, so rhythm beats mashing.
- **Positioning pays.** Hits from behind deal 1.5 times the damage and foes in the air take double, with the numbers popping out of every hit.
- **Fights that need skill.** Husks block blows from the front and strike back, wisps slip away from swings, and missed swings leave you open. Dash through an attack at the last moment for a perfect dodge and slow motion.
- **A skill tree per run.** Paths run left to right, each skill with its own pixel icon. Blade is strong early, Phantom trades power for mobility and crits, Arcane is weak early and strong late. Fusion skills join two paths: shatter frozen foes, set off burning ones, charge foes by dashing through them, and more. Choices joined by "or" lock each other out.
- **Charged specials.** Kael starts with Crystal Nova. Hold U through four levels; level 4 spends a full MP bar. The tree offers stronger ultimates: a storm of blades, a legion of phantoms, falling stars or a lightning tempest.
- **Three elements.** A flask of fire that sets the floor burning, a running line of ice spikes that freezes, and lightning that arcs to a second foe.
- **A 30-wave stage.** Floating wisps and horned husks, a Rift Brute every fifth wave and the Rift Warden at waves 20 and 30.
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
| `A` `D` or arrows | Walk. Tap a side twice and hold to run |
| `W` or `Up` | Jump. Hold `S` and jump to drop through a ledge |
| `J` | Sword combo. Each press is a different hit, picked from where the foes are. Combine with `W`, `S`, a jump, a dash or a run for the variants you have learned |
| `L` | Dash. Nothing can touch you while you dash |
| `K` | Warp strike (10 MP) |
| `I` | Cast the selected spell (18 MP) |
| `O` | Switch element: fire, ice, bolt |
| `U` | Hold to charge the special, release to strike |
| `M` | Sound on or off |

After each wave the skill tree opens.
Move with the arrow keys, learn with `J` or `Enter`, and close it with `Esc` to keep your points for later.

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
  constants/       stage layout, palettes, poses and attack keyframes, tuning, key map, waves, Kael's skill tree
  utils/           pure helpers: math, color, seeded random, stats, experience, skill tree rules, wave plan
  engine/          the pixel renderer: frame buffers and painter, particles, lights, sprite canvas
  services/        Web Audio sound effects, best wave in local storage
  game/            the simulation
    hero/          poses, drawing, rope physics, combos and moves, dash, warp, ultimate charge, per-step update
    enemies/       wisps, husks, the Rift Brute and the Rift Warden: drawing and behavior
    effects/       slash, impact, floor ring, warp line, rift, thrown sword, shadow orb
    spells/        fire, ice, bolt and the explosion they share
    ultimates/     Thousand Edges, Phantom Legion, Starfall, Tempest
  scene/           background and the order layers are drawn in
  ui/              HUD, skill tree window, keyboard and touch input, sound button, stage sizing
docs/
  combo-design.md  what the combo takes from Grand Chase and what it leaves out
  media/           README banner, gameplay GIF and screenshots
```

## References

- Hugo Duprez, [How to make (good) pixel art effects with Claude](https://www.spritefusion.com/blog/how-to-make-good-pixel-art-effects-with-claude)
- Sprite Fusion, [open-source pixel art VFX](https://www.spritefusion.com/pixel-art-vfx)
- [pixelfx](https://github.com/patch-gg/pixelfx), the effect library and authoring guide built on those effects

## License

MIT, see [LICENSE](LICENSE).
The particle kinds, the frame model and the slash crescent are adapted from Sprite Fusion's open-source pixel art VFX, MIT License, Copyright (c) 2026 Hugo Duprez.
