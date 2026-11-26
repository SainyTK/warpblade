import { place } from "../../../engine/frame";
import { fxRng, hero, particles } from "../../../game/state";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { BLIGHT } from "../colors";
import { drawPoolSurface } from "./drawPool";
import { exposure, linger } from "./heroTouch";

const SPREAD = 0.2;
const FADE = 0.5;
const GRACE = 0.18;
const FEET = 3;

export function createPoisonPuddle(x: number, y: number, half: number, life: number, damage: number): Effect {
  const touch = exposure(GRACE);
  let t = 0;
  const strength = (): number => clamp(t / SPREAD) * clamp((life - t) / FADE);
  const standing = (): boolean =>
    hero.x + FEET > x - half && hero.x - FEET < x + half && hero.y >= y - 1.5 && hero.y <= y + 2;
  return {
    update(dt) {
      t += dt;
      if (strength() > 0.6) linger(touch, dt, standing, damage, x);
      if (fxRng.chance(0.12))
        particles.spawn(
          PK.SMOKE,
          x + fxRng.range(-half, half),
          y - 1,
          fxRng.range(-3, 3),
          -fxRng.range(6, 14),
          fxRng.range(0.5, 0.9),
          { col: BLIGHT.poison[2], size: fxRng.range(1, 2) },
        );
      return t < life;
    },
    drawBack() {
      place();
      const k = strength();
      const w = half * (0.4 + 0.6 * clamp(t / SPREAD));
      drawPoolSurface(x - w, x + w, y, t, k, 0);
    },
    draw() {},
  };
}
