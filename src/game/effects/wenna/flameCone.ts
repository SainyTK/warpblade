import { PAL } from "../../../constants/palette";
import { glow, place, shade } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { lights, particles, rng } from "../../state";

/** a violet cone of flame from the lamp's shutter: where it starts, its reach, its half angle and how bright */
export interface FlameConeSpec {
  x: number;
  y: number;
  face: number;
  near: number;
  far: number;
  half: number;
  /** 1 for her own Flare, less for a Wick's repeat */
  power: number;
}

const LIFE = 0.22;

/** the cone flares out from the shutter, white at its root and violet at its edge, then gutters back down the ramp */
export function createFlameCone(c: FlameConeSpec): Effect {
  let t = 0;
  const R = PAL.wick;
  const n = R.length;
  lights.add(c.x + c.face * c.far * 0.5, c.y, c.far * 0.7, R[3], 0.3 * c.power, LIFE + 0.1);
  for (let i = 0; i < Math.round(10 * c.power); i++) {
    const a = rng.range(-c.half, c.half);
    const sp = rng.range(60, 160);
    particles.spawn(PK.SPARK, c.x, c.y, Math.cos(a) * sp * c.face, Math.sin(a) * sp, rng.range(0.2, 0.4), {
      col: rng.chance(0.5) ? R[4] : R[5],
    });
  }
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const u = t / LIFE;
      const reach = c.near + (c.far - c.near) * Math.min(1, u * 3);
      const fade = 1 - u;
      shade(c.x - c.far - 2, c.y - c.far - 2, c.x + c.far + 2, c.y + c.far + 2, (x, y, out) => {
        const dx = (x - c.x) * c.face;
        const dy = y - c.y;
        const d = Math.hypot(dx, dy);
        if (dx <= 0 || d > reach) return;
        const a = Math.abs(Math.atan2(dy, dx));
        const edge = c.half * (0.4 + 0.6 * Math.min(1, d / Math.max(1, c.far * 0.4)));
        if (a > edge) return;
        // white at the root, violet toward the rim and the far end, cooling with age
        const q = Math.max(a / edge, d / c.far);
        const ci = clamp(Math.round(1 + q * 3 + u * 2), 1, n - 1);
        out.c = R[n - 1 - ci];
        out.a = clamp((1 - q * 0.7) * fade * 1.4, 0, 1) * c.power;
      });
      glow(c.x + c.face * reach * 0.4, c.y, reach * 0.5, R[3], 0.16 * fade * c.power);
    },
  };
}
