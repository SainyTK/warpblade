import { glow, hairline, place } from "../../../../engine/frame";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { RAY } from "./colors";
import { RAY_VOLLEY } from "./constants";

const DASH = { every: 9, length: 4, reach: 70 } as const;

export const volleyAngles = (e: Enemy): number[] =>
  [-1, 0, 1].map((i) => {
    const local = e.ax + i * RAY_VOLLEY.spread;
    return e.face > 0 ? local : Math.PI - local;
  });

export function createAimMark(e: Enemy, windup: number): Effect {
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
      const late = u > 0.78;
      const shown = DASH.reach * (0.3 + u * 0.7);
      for (const a of volleyAngles(e)) {
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        for (let d = 12 + ((game.t * 24) % DASH.every); d < shown; d += DASH.every) {
          const x = e.x + ux * d;
          const y = e.y + uy * d;
          hairline(
            x,
            y,
            x + ux * DASH.length,
            y + uy * DASH.length,
            late ? RAY.bladeEdge[4] : RAY.blade[2],
            0.3 + u * 0.6,
          );
        }
      }
      glow(e.x + e.face * 6, e.y, 8 + u * 6, RAY.bladeEdge[2], 0.15 + u * 0.3);
    },
  };
}
