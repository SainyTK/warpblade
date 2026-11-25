import { GROUND } from "../../../../constants/stage";
import { glow, hairline, line, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy, EnemyState } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { FOE } from "../colors";

export function createFloorWarning(e: Enemy, state: EnemyState, from: number, to: number, windup: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === state && e.hp > 0 && e.stun <= 0;
    },
    drawBack() {
      const u = clamp(t / windup);
      const a = e.x + e.face * from;
      const b = e.x + e.face * (from + (to - from) * u);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      place();
      line(lo, GROUND - 1, hi, GROUND - 1, FOE.crystal[u > 0.8 ? 4 : 3], 0.7 + u * 0.3);
      hairline(lo, GROUND + 0.5, hi, GROUND + 0.5, FOE.crystal[1], 0.8);
      for (let x = lo + ((t * 30) % 6); x < hi; x += 6)
        hairline(x, GROUND - 2 - u * 4, x + 1.5, GROUND - 1, FOE.crystal[4], 0.3 + 0.5 * u);
      glow((lo + hi) / 2, GROUND - 2, (hi - lo) / 2 + 6, FOE.crystal[2], 0.15 + u * 0.2);
    },
    draw() {},
  };
}
