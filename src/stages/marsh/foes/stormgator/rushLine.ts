import { GROUND } from "../../../../constants/stage";
import { glow, line, place } from "../../../../engine/frame";
import { RAIN_FOES as C, STORM_VOLT } from "../../../../game/enemies/rain/colors";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";

const DASH = { every: 7, length: 4 } as const;
const LAST_CALL = 0.22;

export function createRushLine(owner: Enemy, from: number, to: number, windup: number): Effect {
  const dir = Math.sign(to - from) || 1;
  return {
    update: () => owner.state === "charge" && owner.hp > 0 && owner.stun <= 0,
    drawBack() {
      place();
      const u = clamp(owner.st / windup);
      const flash = owner.st >= windup - LAST_CALL;
      const hot = flash ? STORM_VOLT[4] : C.wartHot;
      const reach = Math.abs(to - from) * Math.min(1, u * 1.6);
      for (let d = 0; d <= reach; d += DASH.every) {
        const x = from + dir * d;
        const end = x + dir * (DASH.length - 1);
        line(x, GROUND + 1, end, GROUND + 1, C.veinDeep);
        line(x, GROUND, end, GROUND, C.wart, 0.5 + u * 0.5);
        line(x, GROUND - 1, end, GROUND - 1, hot, flash ? 1 : u * 0.8);
      }
      const tip = from + dir * reach;
      line(tip, GROUND - 6, tip, GROUND, hot, 0.4 + u * 0.6);
      glow(tip, GROUND - 2, 10, C.wart, 0.15 + u * 0.25);
    },
    draw() {},
  };
}
