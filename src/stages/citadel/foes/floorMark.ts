import { GROUND } from "../../../constants/stage";
import { glow, hairline, line, place } from "../../../engine/frame";
import { VOID } from "../../../game/enemies/abyss/colors";
import type { Effect } from "../../../types/effect";
import type { Enemy, EnemyState } from "../../../types/enemy";
import { clamp } from "../../../utils/math";

export function createFloorMark(e: Enemy, state: EnemyState, from: number, to: number, windup: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === state && e.hp > 0 && e.stun <= 0 && e.stagger <= 0;
    },
    drawBack() {
      const u = clamp(t / windup);
      const a = e.x + e.face * from;
      const b = e.x + e.face * (from + (to - from) * u);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      place();
      line(lo, GROUND - 1, hi, GROUND - 1, VOID[u > 0.8 ? 5 : 3], 0.6 + u * 0.4);
      hairline(lo, GROUND + 0.5, hi, GROUND + 0.5, VOID[1], 0.8);
      for (let x = lo + ((t * 30) % 6); x < hi; x += 6)
        hairline(x, GROUND - 2 - u * 4, x + 1.5, GROUND - 1, VOID[4], 0.3 + 0.5 * u);
      glow((lo + hi) / 2, GROUND - 2, (hi - lo) / 2 + 6, VOID[3], 0.12 + u * 0.22);
    },
    draw() {},
  };
}
