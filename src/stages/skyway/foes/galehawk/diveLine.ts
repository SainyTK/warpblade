import { ellipseRing, fleck, glow, hairline, line, place, px } from "../../../../engine/frame";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { SKY_FOES as C } from "../colors";

const DASH = { every: 7, length: 3.5, crawl: 26 } as const;
const LAST_CALL = 0.2;

export function createDiveLine(e: Enemy, windup: number): Effect {
  let t = 0;
  const live = () => e.state === "wind" && e.hp > 0 && e.stun <= 0 && !e.air && e.stagger <= 0;
  return {
    update(dt) {
      t += dt;
      return live();
    },
    draw() {
      place();
      const u = clamp(t / windup);
      const late = t >= windup - LAST_CALL;
      const dx = e.ax - e.x;
      const dy = e.ay - e.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const shown = len * Math.min(1, 0.35 + u * 1.2);
      const strength = late ? 1 : 0.35 + u * 0.5;
      for (let d = 10 + ((game.t * DASH.crawl) % DASH.every); d < shown; d += DASH.every) {
        const x = e.x + ux * d;
        const y = e.y + uy * d;
        const x1 = x + ux * DASH.length;
        const y1 = y + uy * DASH.length;
        hairline(x, y, x1, y1, late ? C.volt[4] : C.volt[3], strength);
        hairline(x + 0.5, y + 0.5, x1 + 0.5, y1 + 0.5, C.volt[2], strength * 0.8);
      }
      const r = 3 + (1 - u) * 6;
      ellipseRing(e.ax, e.ay + 4, r, r * 0.3, late ? C.volt[4] : C.volt[2], 0.5 + u * 0.5);
      line(e.ax - 2, e.ay + 4, e.ax + 2, e.ay + 4, C.volt[late ? 4 : 3], strength);
      px(e.ax - ux * 4, e.ay - 3, C.volt[3], strength);
      fleck(e.ax - ux * 6, e.ay - 5.5, C.volt[4], strength);
      glow(e.ax, e.ay + 3, 10, C.volt[2], 0.15 + u * 0.25);
    },
  };
}
