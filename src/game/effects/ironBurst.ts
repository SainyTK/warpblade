import { fleck, glow, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { grain } from "../../utils/grain";
import { ease } from "../../utils/math";
import { ray } from "./fine";

const LIFE = 0.28;
/** spokes of the burst, in radians from straight ahead */
const SPOKES = [-0.9, -0.45, 0, 0.45, 0.9] as const;
/** the arc at the front of the burst: half its span in radians, and how far out along the spokes it rides */
const FRONT_SPAN = 0.8;
const FRONT_AT = 0.85;
/** the widest its soft light gets */
const LIGHT = 14;

/**
 * Iron Wall's release: a fan of iron-lit spokes thrown out from her fist, ahead of her or all round her, wider the more
 * blows it carries.
 */
export function createIronBurst(x: number, y: number, face: number, ring: boolean, size: number, ramp: Ramp): Effect {
  let t = 0;
  const sides = ring ? [1, -1] : [face];
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const u = t / LIFE;
      const k = 1 - u;
      const r = size * (0.35 + 0.65 * ease.outExpo(u));
      for (const side of sides) {
        for (const a of SPOKES) {
          const angle = side > 0 ? a * 0.7 : Math.PI - a * 0.7;
          ray(x, y, angle, r * 0.45, r, ramp[6], ramp[Math.max(3, Math.round(2 + k * 3))], k * 1.6);
        }
        // the front of the shove: an arc of iron-lit air with a dark rim, breaking up as it thins
        const n = Math.ceil(r * 4);
        for (let i = 0; i <= n; i++) {
          const g = ((i / n) * 2 - 1) * FRONT_SPAN;
          if (u > 0.5 && grain(Math.floor(i / 3), size) < (u - 0.5) * 2) continue;
          const fx = x + Math.cos(g) * side * r * FRONT_AT;
          const fy = y + Math.sin(g) * r * FRONT_AT * 0.75;
          fleck(fx + side * 0.5, fy, ramp[2], k * 2);
          fleck(fx, fy, ramp[5], k * 2);
          if (Math.abs(g) < FRONT_SPAN * 0.5) fleck(fx - side * 0.5, fy, ramp[4], k * 2);
        }
      }
      glow(x, y, Math.min(LIGHT, r * 0.5), ramp[3], 0.3 * k);
    },
  };
}
