import { SHOCK_ARC } from "../../../../constants/hulda/look";
import { fleck, hairline, place } from "../../../../engine/frame";
import type { Ramp } from "../../../../types/color";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { ease } from "../../../../utils/math";

export interface Shock {
  x: number;
  y: number;
  /** the way the blow went, in radians */
  angle: number;
  /** how far the outer arc opens */
  size: number;
  arcs: number;
  /** speed lines thrown on past the arcs */
  streaks: number;
  ramp: Ramp;
  seed: number;
}

/** one arc of pushed air: two image pixels thick in the middle, one at its ends, breaking into dashes as it ages */
function arc(s: Shock, index: number, u: number): void {
  const r = s.size * (1 - index * 0.22) * (0.5 + 0.5 * ease.outCubic(u));
  const span = SHOCK_ARC.span * (1 - 0.35 * u);
  const top = s.ramp.length - 1;
  const c = s.ramp[Math.max(3, top - Math.floor(u * 3) - index)];
  const wear = Math.max(0, (u - SHOCK_ARC.breakFrom) / (1 - SHOCK_ARC.breakFrom));
  const cx = s.x - Math.cos(s.angle) * s.size * 0.5;
  const cy = s.y - Math.sin(s.angle) * s.size * 0.5;
  const n = Math.max(6, Math.ceil(r * span * 5));
  for (let i = 0; i <= n; i++) {
    const v = (i / n) * 2 - 1;
    if (wear > 0 && grain(Math.floor(i / 3), s.seed + index) < wear) continue;
    const g = s.angle + v * span;
    const px = cx + Math.cos(g) * r;
    const py = cy + Math.sin(g) * r;
    const ux = Math.cos(g) * 0.5;
    const uy = Math.sin(g) * 0.5;
    // a dark rim outside the bright line, so the arc reads on a pale scene as well as a dark one
    fleck(px + ux, py + uy, s.ramp[2], (1 - u) * 2);
    fleck(px, py, c, (1 - u) * 2);
    if (Math.abs(v) < 0.55) fleck(px - ux, py - uy, s.ramp[top - index], (1 - u) * 2);
  }
}

/** a speed line flung on along the blow, shortening from its tail as it flies */
function streak(s: Shock, index: number, u: number): void {
  const side = (index - (s.streaks - 1) / 2) * 3.2 + (grain(index, s.seed) - 0.5) * 2;
  const ux = Math.cos(s.angle);
  const uy = Math.sin(s.angle);
  const head = s.size * (0.7 + 1.1 * ease.outCubic(u)) + grain(s.seed, index) * 4;
  const tail = head - s.size * 0.9 * (1 - u);
  const ox = s.x - uy * side;
  const oy = s.y + ux * side;
  hairline(ox + ux * tail, oy + uy * tail, ox + ux * head, oy + uy * head, s.ramp[4], (v) => (1 - u) * (0.4 + v));
}

/**
 * The air a heavy blow pushes ahead of it: crescents that open along the blow one after another, with speed lines past
 * them. They are open from the first frame, so the shape shows through the hit-stop.
 */
export function createShockArcs(s: Shock): Effect {
  const life = SHOCK_ARC.life + SHOCK_ARC.gap * (s.arcs - 1);
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      for (let i = 0; i < s.arcs; i++) {
        const u = (t - i * SHOCK_ARC.gap) / SHOCK_ARC.life;
        if (u >= 0 && u < 1) arc(s, i, u);
      }
      const u = t / SHOCK_ARC.life;
      if (u >= 1) return;
      for (let i = 0; i < s.streaks; i++) streak(s, i, u);
    },
  };
}
