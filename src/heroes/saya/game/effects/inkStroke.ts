import { hairline, line, place } from "../../../../engine/frame";
import { skin } from "../../../../game/hero/skin";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";

/** how long Brushline's stroke shows and how thick it is at its widest */
const STROKE = { life: 0.55, width: 2.4 } as const;

/**
 * Brushline's stroke: a long ink band laid along the line she dashed, thickest in the middle and tapering to both
 * ends, with a white edge on top; it dries from the ends inward and breaks up as it goes.
 */
export function createInkStroke(x0: number, x1: number, y: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < STROKE.life;
    },
    draw() {
      place();
      const u = clamp(t / STROKE.life);
      const ramp = skin.ramp;
      const span = x1 - x0;
      const cut = u * 0.5;
      const a = x0 + span * cut;
      const b = x1 - span * cut;
      const steps = Math.max(2, Math.ceil(Math.abs(b - a)));
      for (let i = 0; i < steps; i++) {
        const v = i / steps;
        const x = a + (b - a) * v;
        const w = STROKE.width * Math.sin(Math.PI * v) * (1 - u * 0.7);
        if ((i + Math.floor(t * 40)) % 7 === 0 && u > 0.4) continue;
        line(x, y - w, x, y + w, ramp[w > 1.2 ? 1 : 2]);
      }
      hairline(a, y - STROKE.width - 0.5, b, y - STROKE.width - 0.5, WHITE, 1 - u);
    },
  };
}
