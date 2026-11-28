import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { COLOSSUS as K } from "./colors";
import { SLAM } from "./constants";

export function createSlamMark(e: Enemy, windup: number): Effect {
  let t = 0;
  const live = () => e.state === "wind" && e.hp > 0 && e.stun <= 0 && !e.air;
  return {
    update(dt) {
      t += dt;
      return live();
    },
    drawBack() {
      place();
      const u = clamp(t / windup);
      const late = u > 0.8;
      const shown = SLAM.reach * Math.min(1, 0.3 + u);
      for (const dir of [-1, 1])
        for (let d = 8 + ((game.t * 30) % 8); d < shown; d += 8) {
          const x = e.x + dir * d;
          if (x < stageLeft() || x > stageRight()) continue;
          hairline(x, GROUND + 0.5, x + dir * 4, GROUND + 0.5, late ? K.core[4] : K.core[3], 0.35 + u * 0.6);
        }
      for (const dir of [-1, 1]) {
        const end = clamp(e.x + dir * SLAM.reach, stageLeft(), stageRight());
        fleck(end, GROUND - 1, late ? K.core[4] : K.core[2], u);
        fleck(end, GROUND - 2, K.core[3], u * 0.7);
      }
      ellipseRing(e.x, GROUND, 10 + u * 8, 2, late ? K.core[4] : K.core[2], 0.4 + u * 0.5);
      glow(e.x, GROUND - 2, 16 + u * 10, K.core[2], 0.1 + u * 0.25);
    },
    draw() {},
  };
}
