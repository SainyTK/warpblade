import { DENT } from "../../../../constants/hulda/look";
import { fleck, place, px } from "../../../../engine/frame";
import type { Ramp } from "../../../../types/color";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { clamp } from "../../../../utils/math";

/**
 * A dent where something heavy met the floor: a notch with cracks running out each way, glowing in her ramp at the
 * middle, then cooling to dark and closing in patches. `half` is how far the cracks reach each way.
 */
export function createFloorDent(x: number, floor: number, half: number, ramp: Ramp, seed: number): Effect {
  let t = 0;
  const life = DENT.run + DENT.glow + DENT.cool;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {},
    drawBack() {
      place();
      // the cracks are part way out on the first frame, which a hit-stop holds
      const run = Math.ceil(half * clamp(0.4 + (0.6 * t) / DENT.run));
      const cool = clamp((t - DENT.run - DENT.glow) / DENT.cool);
      const heat = 1 - clamp((t - DENT.run) / DENT.glow);
      for (const side of [-1, 1]) {
        let depth = 0;
        for (let i = 0; i <= run; i++) {
          const g = grain(i * side + seed, seed);
          depth = clamp(depth + (g < 0.3 ? -1 : g > 0.6 ? 1 : 0), 0, DENT.depth);
          if (cool > 0 && grain(i, seed + side) < cool) continue;
          const cx = x + side * i;
          const near = 1 - i / (half + 1);
          px(cx, floor + depth, ramp[0], 0.5 + near * 0.5);
          if (near > 0.55) px(cx, floor + depth + 1, ramp[1], near);
          if (heat > 0 && near * heat > 0.35)
            fleck(cx + 0.25, floor + depth + 0.25, ramp[heat > 0.6 ? 5 : 3], heat * 2);
        }
      }
    },
  };
}
