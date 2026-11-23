import { glow, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { game } from "../../state";
import { RAIN_FOES as C } from "./colors";
import { hulkGathered } from "./hulkGathered";
import { cracked, HULK_TIMES, lying, SINKING } from "./hulkMoves";

const CRACK_LIGHT = { radius: 24, strength: 0.6, chestY: -20, lyingY: -8 } as const;
const WARNING = { radius: 30, strength: 0.45, pulse: 18 } as const;

export function createHulkLight(e: Enemy): Effect {
  return {
    update: () => e.hp > 0 && game.enemies.includes(e),
    draw() {
      place();
      if (e.state === "burrow") {
        const left = HULK_TIMES.sink - e.st;
        if (left > SINKING.warn) return;
        const k = 1 - left / SINKING.warn;
        const beat = 0.5 + 0.5 * Math.sin(e.st * WARNING.pulse);
        glow(e.x, e.y - 6, WARNING.radius, C.wart, WARNING.strength * k * beat);
        return;
      }
      if (!cracked(e)) return;
      const u = hulkGathered(e);
      if (u <= 0) return;
      const y = e.y + (lying(e) ? CRACK_LIGHT.lyingY : CRACK_LIGHT.chestY);
      glow(e.x - e.face * 3, y, CRACK_LIGHT.radius, C.wart, CRACK_LIGHT.strength * u);
    },
  };
}
