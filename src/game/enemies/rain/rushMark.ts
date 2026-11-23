import { GROUND } from "../../../constants/stage";
import { fleck, glow, line, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { clamp } from "../../../utils/math";
import { RAIN_FOES as C } from "./colors";
import { RUSH } from "./hulkMoves";
import { type RushPath, rushing } from "./rushPath";

const DASH = { every: 6, length: 2, least: 0.3, most: 0.9, endTall: 4 } as const;

export function createRushMark(path: RushPath): Effect {
  const { owner, from, to, dir } = path;
  const strength = (): number => {
    const k = owner.state === "dive" ? clamp(owner.st / path.windup) : 1;
    return DASH.least + (DASH.most - DASH.least) * k;
  };
  return {
    update: () => rushing(path),
    draw() {
      place();
      const a = strength();
      const front = owner.state === "lunge" ? owner.x + dir * RUSH.slideHalfWidth : from;
      const span = Math.abs(to - from);
      for (let d = 0; d <= span; d += DASH.every) {
        const x = from + dir * d;
        if ((x - front) * dir < 0) continue;
        line(x, GROUND, x + dir * DASH.length, GROUND, C.wart, Math.min(1, a + 0.2));
        line(x, GROUND - 1, x + dir * DASH.length, GROUND - 1, C.wartHot, a * 0.8);
        glow(x, GROUND - 1, 4, C.wart, 0.2 * a);
      }
      line(to, GROUND - DASH.endTall, to, GROUND, C.wart, a);
      fleck(to + 0.5, GROUND - DASH.endTall + 0.5, C.wartHot, a);
      glow(to, GROUND - 1, 8, C.wart, 0.25 * a);
    },
  };
}
