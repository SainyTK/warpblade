import { GROUND } from "../../../../constants/stage";
import { glow, hairline, place } from "../../../../engine/frame";
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
      place();
      hairline(a, GROUND - 0.5, b, GROUND - 0.5, FOE.crystal[u > 0.8 ? 4 : 3], 0.5 + u * 0.5);
      hairline(a, GROUND + 0.5, b, GROUND + 0.5, FOE.crystal[1], 0.6);
      for (let x = Math.min(a, b); x < Math.max(a, b); x += 7)
        hairline(x, GROUND - 2 - u * 2, x, GROUND - 0.5, FOE.crystal[3], 0.4 * u);
      glow((a + b) / 2, GROUND - 2, Math.abs(b - a) / 2 + 6, FOE.crystal[2], 0.12 + u * 0.15);
    },
    draw() {},
  };
}
