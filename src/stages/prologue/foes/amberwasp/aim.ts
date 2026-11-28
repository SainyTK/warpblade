import { fleck, glowLine, place, px } from "../../../../engine/frame";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { WASP } from "./constants";
import { aimLocked, windTime } from "./moves";

export function createAimLine(e: Enemy): Effect {
  return {
    update: () => e.state === "wind" && e.hp > 0 && e.stagger <= 0 && e.stun <= 0,
    draw() {},
    drawBack() {
      const k = clamp(e.st / windTime());
      const locked = aimLocked(e);
      const ux = Math.cos(e.ax);
      const uy = Math.sin(e.ax);
      place(e.x, e.y);
      if (locked) glowLine(ux * 10, uy * 10, ux * WASP.aimLength, uy * WASP.aimLength, 3, DC.crack, 0.35);
      for (let d = 10; d < WASP.aimLength; d += locked ? 5 : 8) {
        const fade = 1 - (d / WASP.aimLength) * 0.6;
        if (locked) fleck(ux * d, uy * d, DC.crackHot, fade);
        if (locked) fleck(ux * d + 0.5, uy * d, DC.crackHot, fade);
        else px(ux * d, uy * d, DC.crack, fade * (0.35 + k * 0.5));
      }
      place();
    },
  };
}
