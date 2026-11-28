import { GROUND } from "../../../../constants/stage";
import { glow, hairline, line, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { COLOSSUS_COLORS } from "./colors";
import { COLOSSUS } from "./constants";

const C = COLOSSUS_COLORS.ice;

export function createQuakeWarning(e: Enemy, windup: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === "wind" && e.hp > 0;
    },
    drawBack() {
      const u = clamp(t / windup);
      const reach = COLOSSUS.slamReach * (0.4 + u * 0.6);
      const far = COLOSSUS.spikeGaps[COLOSSUS.spikeGaps.length - 1] * u;
      place();
      line(e.x - reach, GROUND - 1, e.x + reach, GROUND - 1, C[u > 0.8 ? 5 : 4], 0.6 + u * 0.4);
      hairline(e.x - far, GROUND + 0.5, e.x + far, GROUND + 0.5, C[1], 0.5 + u * 0.3);
      for (const gap of COLOSSUS.spikeGaps)
        for (const side of [-1, 1]) {
          if (gap > far) continue;
          const x = e.x + side * gap;
          hairline(x - 2, GROUND - 1, x + 2, GROUND - 1, C[3], 0.4 + u * 0.5);
        }
      glow(e.x, GROUND - 2, reach + 8, C[2], 0.12 + u * 0.22);
    },
    draw() {},
  };
}
