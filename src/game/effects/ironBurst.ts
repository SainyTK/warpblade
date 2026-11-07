import { glow, line, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { ease } from "../../utils/math";

const LIFE = 0.28;
/** spokes of the burst, in radians from straight ahead */
const SPOKES = [-0.9, -0.45, 0, 0.45, 0.9] as const;

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
      const r = size * ease.outExpo(u);
      for (const side of sides)
        for (const a of SPOKES) {
          const dx = Math.cos(a) * side;
          const dy = Math.sin(a) * 0.7;
          line(
            x + dx * r * 0.45,
            y + dy * r * 0.45,
            x + dx * r,
            y + dy * r,
            ramp[Math.max(2, Math.round(2 + k * 4))],
            k,
          );
        }
      glow(x, y, r * 0.8, ramp[4], 0.45 * k);
    },
  };
}
