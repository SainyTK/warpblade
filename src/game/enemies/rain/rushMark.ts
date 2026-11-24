import { GROUND } from "../../../constants/stage";
import { glow, line, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { clamp } from "../../../utils/math";
import { RAIN_FOES as C, STORM_VOLT } from "./colors";
import { RUSH } from "./hulkMoves";
import { type RushPath, rushing } from "./rushPath";

const DASH = { every: 8, length: 4, least: 0.55, most: 0.9, glow: 4 } as const;
const POST = { tall: 8, wide: 2, cap: 3, glow: 12 } as const;
const LAST_CALL_SECONDS = 0.25;
const FLASH = STORM_VOLT[4];

export function createRushMark(path: RushPath): Effect {
  const { owner, from, to, dir } = path;
  const winding = (): boolean => owner.state === "dive";
  const strength = (): number => {
    const k = winding() ? clamp(owner.st / path.windup) : 1;
    return DASH.least + (DASH.most - DASH.least) * k;
  };
  const lastCall = (): boolean => winding() && owner.st >= path.windup - LAST_CALL_SECONDS;
  return {
    update: () => rushing(path),
    draw() {
      place();
      const a = strength();
      const flash = lastCall();
      const hot = flash ? FLASH : C.wartHot;
      const hotStrength = flash ? 1 : a * 0.8;
      const front = owner.state === "lunge" ? owner.x + dir * RUSH.slideHalfWidth : from;
      const span = Math.abs(to - from);
      for (let d = 0; d <= span; d += DASH.every) {
        const x = from + dir * d;
        if ((x - front) * dir < 0) continue;
        const end = x + dir * (DASH.length - 1);
        line(x, GROUND + 1, end, GROUND + 1, C.veinDeep);
        line(x, GROUND, end, GROUND, C.wart, Math.min(1, a + 0.2));
        line(x, GROUND - 1, end, GROUND - 1, hot, hotStrength);
        glow(x, GROUND - 1, DASH.glow, C.wart, 0.2 * a);
      }
      const top = GROUND - POST.tall + 1;
      const outside = to + dir * POST.wide;
      line(outside, top, outside, GROUND + 1, C.veinDeep);
      for (let i = 0; i < POST.wide; i++) {
        const x = to + dir * i;
        line(x, top + POST.cap, x, GROUND, C.wart, a);
        line(x, top, x, top + POST.cap - 1, hot, flash ? 1 : a);
      }
      glow(to, GROUND - 1, POST.glow, C.wart, 0.25 * a);
    },
  };
}
