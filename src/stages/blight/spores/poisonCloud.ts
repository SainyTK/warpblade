import { place } from "../../../engine/frame";
import { fxRng, particles } from "../../../game/state";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp, TAU } from "../../../utils/math";
import { BLIGHT } from "../colors";
import { type CloudTones, drawSporeCloud } from "./drawCloud";
import { circleTouchesHero, exposure, linger } from "./heroTouch";

export const POISON_TONES: CloudTones = {
  deep: BLIGHT.puff[1],
  body: BLIGHT.poison[2],
  lit: BLIGHT.poison[3],
  hot: BLIGHT.poison[4],
  grain: BLIGHT.spore[2],
};

const GROW = 0.25;
const FADE = 0.6;
const GRACE = 0.22;

export function createPoisonCloud(x: number, y: number, radius: number, life: number, damage: number): Effect {
  const seed = fxRng.range(0, TAU);
  const touch = exposure(GRACE);
  const o = { t: 0, y };
  const strength = (): number => clamp(o.t / GROW) * clamp((life - o.t) / FADE);
  return {
    update(dt) {
      o.t += dt;
      o.y -= dt * 2;
      const k = strength();
      if (k > 0.5) linger(touch, dt, () => circleTouchesHero(x, o.y, radius * 0.85), damage, x);
      if (fxRng.chance(0.25))
        particles.spawn(
          PK.MOTE,
          x + fxRng.range(-radius, radius),
          o.y + fxRng.range(-radius, radius) * 0.6,
          fxRng.range(-5, 5),
          -fxRng.range(4, 12),
          fxRng.range(0.4, 0.8),
          { col: fxRng.pick(BLIGHT.spore), size: 0.5 },
        );
      return o.t < life;
    },
    draw() {
      place();
      drawSporeCloud(x, o.y, radius, o.t, strength(), seed, POISON_TONES);
    },
  };
}
