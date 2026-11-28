import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { mouthOf } from "./breath";
import { WYRM } from "./colors";
import { BREATH } from "./constants";

export function createAimLine(e: Enemy, windup: number): Effect {
  let t = 0;
  const live = () => e.state === "wind" && e.hp > 0 && e.stun <= 0 && !e.air;
  return {
    update(dt) {
      t += dt;
      return live();
    },
    draw() {
      place();
      const u = clamp(t / windup);
      const locked = u >= BREATH.lock;
      const [x, y] = mouthOf(e);
      const ux = Math.cos(e.ax);
      const uy = Math.sin(e.ax);
      const shown = BREATH.reach * Math.min(1, 0.3 + u);
      for (let d = 6 + ((game.t * 40) % 8); d < shown; d += 8)
        hairline(
          x + ux * d,
          y + uy * d,
          x + ux * (d + 4),
          y + uy * (d + 4),
          locked ? WYRM.volt[4] : WYRM.volt[2],
          0.35 + u * 0.6,
        );
      fleck(x + ux * shown, y + uy * shown, WYRM.volt[4], u);
      glow(x, y, 4 + u * 8, WYRM.volt[3], 0.2 + u * 0.5);
    },
  };
}
