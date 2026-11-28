import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";
import { POUNCE, windTime } from "./pose";

const F = GRAVE.fire;

export function createPounceTell(e: Enemy): Effect {
  return {
    update: () => e.hp > 0 && e.state === "wind" && e.n === POUNCE && game.enemies.includes(e),
    draw() {},
    drawBack() {
      place();
      const u = clamp(e.st / windTime(e));
      const from = e.x + e.face * 10;
      const to = e.ax;
      const run = (to - from) * e.face;
      if (run <= 0) return;
      const lit = run * u;
      for (let d = 0; d < run; d += 4) {
        const x = from + e.face * d;
        const hot = d < lit;
        hairline(x, GROUND + 0.5, x + e.face * 2, GROUND + 0.5, hot ? F[2] : F[0], hot ? 0.9 : 0.5);
      }
      for (let k = -1; k <= 1; k++) {
        const x = to + k * 2;
        hairline(x, GROUND - 1, x + e.face * 2, GROUND - 3, u > 0.7 ? F[3] : F[1], 0.4 + u * 0.6);
      }
      fleck(to, GROUND - 4, F[3], u);
      glow(to, GROUND - 2, 6 + u * 8, F[2], 0.1 + u * 0.3);
    },
  };
}
