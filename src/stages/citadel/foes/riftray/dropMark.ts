import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, hairline, place } from "../../../../engine/frame";
import { VOID } from "../../../../game/enemies/abyss/colors";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { RAY } from "./constants";

export function createDropMark(e: Enemy, windup: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === "wind" && e.hp > 0 && e.stun <= 0 && e.stagger <= 0;
    },
    drawBack() {
      const u = clamp(t / windup);
      place();
      const r = 14 - u * 5;
      ellipseRing(e.x, GROUND, r, r * 0.24, VOID[u > 0.8 ? 5 : 3], 0.5 + u * 0.5);
      hairline(e.x - RAY.dropHalf * u, GROUND - 0.5, e.x + RAY.dropHalf * u, GROUND - 0.5, VOID[4], 0.9);
      glow(e.x, GROUND - 2, 12, VOID[3], 0.1 + u * 0.3);
    },
    draw() {},
  };
}
