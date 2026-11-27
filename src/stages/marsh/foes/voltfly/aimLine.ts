import { glow, hairline, place, px } from "../../../../engine/frame";
import { fxRng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { VOLTFLY_COLORS as C } from "./colors";

const SEGMENT = 7;

export function createAimLine(e: Enemy, windup: number): Effect {
  let t = 0;
  const live = () => e.state === "wind" && e.hp > 0 && e.stun <= 0 && !e.air && e.stagger <= 0;
  return {
    update(dt) {
      t += dt;
      return live();
    },
    draw() {
      const u = clamp(t / windup);
      const x0 = e.x + Math.sign(e.ax - e.x) * 6;
      const y0 = e.y;
      const dx = e.ax - x0;
      const dy = e.ay - y0;
      const len = Math.hypot(dx, dy) || 1;
      const steps = Math.max(2, Math.floor(len / SEGMENT));
      const nx = -dy / len;
      const ny = dx / len;
      const hot = u > 0.7;
      const shown = Math.ceil(steps * (0.35 + u * 0.65));
      place();
      let ax = x0;
      let ay = y0;
      for (let i = 1; i <= shown; i++) {
        const k = i / steps;
        const jitter = i === steps ? 0 : fxRng.range(-1.2, 1.2) * (0.4 + u);
        const bx = x0 + dx * k + nx * jitter;
        const by = y0 + dy * k + ny * jitter;
        hairline(ax, ay, bx, by, hot ? C.veinHot : C.vein, 0.35 + u * 0.6);
        ax = bx;
        ay = by;
      }
      if (hot) hairline(x0, y0, x0 + dx * (shown / steps), y0 + dy * (shown / steps), WHITE, 0.25);
      glow(e.ax, e.ay, 6 + u * 6, C.vein, 0.15 + u * 0.25);
      px(e.ax, e.ay, hot ? WHITE : C.veinHot, 0.6 + u * 0.4);
    },
  };
}
