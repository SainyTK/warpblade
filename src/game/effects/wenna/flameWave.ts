import { PAL } from "../../../constants/palette";
import { WAVE_LOOK as L } from "../../../constants/wenna/flameLook";
import { glow, place, shade } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { grain } from "../../../utils/grain";
import { clamp, ease } from "../../../utils/math";

/**
 * A wave of violet flame that runs out along the floor from (x, y) to `reach` pixels ahead (both ways when `both`):
 * tongues of uneven height, tallest and palest at the running front and dying down behind it, thin enough that foes
 * show through. It only draws; whatever struck the foes has already done so.
 */
export function createFlameWave(x: number, y: number, face: number, reach: number, both: boolean): Effect {
  const R = PAL.wick;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < L.life;
    },
    draw() {
      place();
      const u = t / L.life;
      const front = ease.outCubic(u) * reach;
      const fade = 1 - u;
      const beat = Math.floor(t * 30);
      const left = both || face < 0 ? x - front : x;
      const right = both || face > 0 ? x + front : x;
      shade(
        left,
        y - L.tall - 1,
        right,
        y,
        (px, py, out) => {
          const d = Math.abs(px - x);
          const behind = front - d;
          if (behind < 0) return;
          const column = Math.floor(px / L.tongue);
          const rise = clamp(1 - behind / L.tail) ** 1.5;
          const within = Math.abs((px / L.tongue) % 1) - 0.5;
          const tall = L.tall * rise * fade * (0.45 + 0.55 * grain(column, beat)) * (1 - within * within * 2);
          const h = y - py;
          if (h > tall) return;
          const q = h / Math.max(tall, 0.5);
          out.c = q < 0.25 && rise > 0.6 ? R[5] : q < 0.55 ? R[4] : q < 0.85 ? R[3] : R[2];
          out.a = L.alpha * (1 - q * 0.5) * Math.min(1, fade * 2.5);
        },
        { soft: true },
      );
      for (const side of both ? [-1, 1] : [face]) glow(x + side * front, y - 5, 16, R[3], 0.3 * fade);
    },
  };
}
