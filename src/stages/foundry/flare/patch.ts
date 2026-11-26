import { fleck, glow, hairline, place, px } from "../../../engine/frame";
import { ignite } from "../../../game/enemies/burn";
import { enemyBox } from "../../../game/enemies/enemy";
import { fxRng, game, particles } from "../../../game/state";
import { boxHit } from "../../../game/world";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../colors";

const TICK = 0.3;
const BURN = 1.6;
const COOL = 0.5;
const HEIGHT = 16;

export function igniteAround(x: number, y: number, radius: number, seconds: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    if (boxHit(enemyBox(e), [x - radius, y - radius - HEIGHT, x + radius, y + 4])) ignite(e, seconds);
  }
}

export function createSlagPatch(x: number, y: number, half: number, life: number): Effect {
  let t = 0;
  let tick = 0;
  return {
    update(dt) {
      t += dt;
      tick -= dt;
      if (tick <= 0 && t < life - COOL) {
        tick = TICK;
        for (const e of game.enemies)
          if (e.hp > 0 && boxHit(enemyBox(e), [x - half, y - HEIGHT, x + half, y + 2])) ignite(e, BURN);
      }
      if (t < life - COOL && fxRng.chance(dt * 14))
        particles.spawn(
          PK.FIRE,
          x + fxRng.range(-half, half),
          y - 1,
          fxRng.range(-4, 4),
          -fxRng.range(14, 30),
          fxRng.range(0.2, 0.4),
          {
            size: fxRng.range(1, 2),
          },
        );
      if (fxRng.chance(dt * 6))
        particles.spawn(PK.EMBER, x + fxRng.range(-half, half), y - 1, 0, -fxRng.range(10, 30), 0.5, {
          sparks: FORGE_SPARKS.ember,
        });
      return t < life;
    },
    drawBack() {
      place();
      const grow = clamp(t / 0.1);
      const cool = clamp((t - (life - COOL)) / COOL);
      const w = half * grow;
      for (let dx = -w; dx <= w; dx++) {
        const edge = Math.abs(dx) > w - 2;
        const hot = edge ? FORGE.molten[2] : FORGE.molten[3];
        px(x + dx, y - 0.5, cool > 0.6 ? FORGE.crust[2] : cool > 0.2 ? FORGE.molten[1] : hot);
      }
      if (cool < 0.7) {
        hairline(x - w * 0.6, y - 0.75, x + w * 0.4, y - 0.75, FORGE.molten[4], 1 - cool);
        for (let i = 0; i < 3; i++) {
          const lick = (t * 3 + i / 3) % 1;
          fleck(
            x + (i - 1) * w * 0.55 + Math.sin(t * 9 + i) * 1.5,
            y - 1 - lick * 5,
            FORGE.molten[4],
            (1 - lick) * (1 - cool),
          );
        }
      }
      glow(x, y - 2, half + 8, FORGE.molten[2], 0.3 * (1 - cool));
    },
    draw() {},
  };
}
