import { GROUND } from "../../../constants/stage";
import { hairline, line, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { RAIN_FOES as C } from "./colors";
import { RUSH } from "./hulkMoves";
import { type RushPath, rushing } from "./rushPath";

const STREAK = { fade: 1.5, glintEvery: 5, glintLength: 2 } as const;

export function createRushStreak(path: RushPath): Effect {
  const { owner, from, dir } = path;
  const start = from - dir * RUSH.slideHalfWidth;
  let end = start;
  let gone = 0;
  return {
    update(dt) {
      if (owner.state === "lunge" && rushing(path)) {
        end = owner.x - dir * (RUSH.slideHalfWidth - 4);
        return true;
      }
      gone += dt;
      return gone < STREAK.fade;
    },
    draw() {
      if ((end - start) * dir <= 0) return;
      place();
      const a = Math.min(1, 2 * (1 - gone / STREAK.fade));
      line(start, GROUND, end, GROUND, C.mudDeep, a);
      line(start, GROUND - 1, end, GROUND - 1, C.mudDark, a * 0.8);
      const span = Math.abs(end - start);
      for (let d = 1; d + STREAK.glintLength <= span; d += STREAK.glintEvery) {
        const x = start + dir * d;
        hairline(x, GROUND - 1.25, x + dir * STREAK.glintLength, GROUND - 1.25, C.wetSky, a * 0.9);
      }
    },
  };
}
