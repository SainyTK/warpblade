import { GROUND } from "../../../constants/stage";
import { fleck, glow, glowLine, hairline, place, polygon } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { ease } from "../../../utils/math";
import { RUNE_RAMP } from "./colors";

const LIFE = 0.42;
/** spikes of rune light thrown up from the floor around the fists, each as offset, lean and height */
const SPIKES = Array.from({ length: 7 }, (_, i) => ({
  dx: (i - 3) * 4.5 + (grain(i, 2) - 0.5) * 3,
  lean: (i - 3) * 0.9,
  height: 7 + grain(i, 9) * 9 - Math.abs(i - 3) * 1.5,
}));
const CRACKS = 5;

/** where a golem's fists hit the floor: spikes of rune light stab up and die back, and cracks of light run out along the stone */
export function createSlamBurst(x: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const u = t / LIFE;
      const rise = ease.outExpo(Math.min(1, u * 3));
      const fade = 1 - u;
      for (const s of SPIKES) {
        const h = s.height * rise * (1 - u * u);
        if (h < 1) continue;
        const bx = x + s.dx;
        const tx = bx + s.lean * rise;
        const half = 1.4 * fade + 0.4;
        polygon(
          [
            [bx - half, GROUND],
            [tx, GROUND - h],
            [bx + half, GROUND],
          ],
          (_sx, sy = 0) => RUNE_RAMP[Math.min(4, 2 + Math.floor(((GROUND - sy) / h) * 2 + fade))],
          Math.min(1, fade * 1.6),
        );
        hairline(bx, GROUND - 0.5, tx, GROUND - h, WHITE, fade);
        fleck(tx, GROUND - h - 0.5, WHITE, fade);
      }
      for (let i = 0; i < CRACKS; i++) {
        const side = i % 2 ? 1 : -1;
        const reach = (10 + grain(i, 4) * 16) * rise;
        const y = GROUND + 1 + (i >> 1) * 1.5;
        hairline(
          x + side * 3,
          y,
          x + side * (3 + reach),
          y + (grain(i, 7) - 0.5) * 2,
          (v) => RUNE_RAMP[v < 0.5 ? 4 : 3],
          fade,
        );
      }
      glowLine(x - 16, GROUND, x + 16, GROUND, 10, RUNE_RAMP[3], 0.5 * fade);
      glow(x, GROUND - 4, 22, RUNE_RAMP[2], 0.35 * fade * fade);
    },
  };
}
