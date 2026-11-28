import { GROUND } from "../../../../constants/stage";
import { glow, hairline, place } from "../../../../engine/frame";
import { VOID } from "../../../../game/enemies/abyss/colors";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";

export function createRiftDoor(e: Enemy, x: number, windup: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === "blink" && e.hp > 0;
    },
    drawBack() {
      const u = clamp(t / windup);
      const h = 48 * u;
      const w = 1 + u * 3;
      place();
      for (let y = 0; y < h; y += 1) {
        const k = Math.sin((y / Math.max(1, h)) * Math.PI);
        const half = w * k + Math.sin(t * 30 + y) * 0.4;
        hairline(x - half, GROUND - y, x + half, GROUND - y, VOID[u > 0.8 ? 4 : 3], 0.7);
        hairline(x - half * 0.3, GROUND - y, x + half * 0.3, GROUND - y, VOID[5], 0.8);
      }
      hairline(x - 14 * u, GROUND - 0.5, x + 14 * u, GROUND - 0.5, VOID[4], 0.9);
      glow(x, GROUND - h / 2, h / 2 + 8, VOID[3], 0.2 + u * 0.3);
    },
    draw() {},
  };
}
