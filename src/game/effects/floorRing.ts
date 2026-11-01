import { ellipseRing, glow, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { scale } from "../../utils/color";
import { ease } from "../../utils/math";

/** a ring that runs out along the floor: its far half behind the characters, its near half in front */
export function createFloorRing(x: number, y: number, radius: number, ramp: Ramp, life = 0.4, sy = 0.24): Effect {
  let t = 0;
  const draw = (half: number) => {
    place();
    const u = t / life;
    const r = radius * ease.outExpo(u);
    const k = 1 - u;
    const c = ramp[Math.min(ramp.length - 1, Math.floor(k * ramp.length))];
    ellipseRing(x, y, r, r * sy, c, k * 1.2, half);
    ellipseRing(x, y, r - 1.5, (r - 1.5) * sy, scale(c, 0.7), k * 0.7, half);
    if (half > 0) glow(x, y, r, ramp[ramp.length - 2], 0.18 * k);
  };
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    drawBack: () => draw(-1),
    draw: () => draw(1),
  };
}
