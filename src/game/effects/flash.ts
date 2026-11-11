import { circle, place, sparkle } from "../../engine/frame";
import type { Color } from "../../types/color";
import type { Effect } from "../../types/effect";
import { scale, WHITE } from "../../utils/color";
import { grain } from "../../utils/grain";
import { ease, TAU } from "../../utils/math";
import { fineRing, ray } from "./fine";

/** a short glint, for a spell leaving the hand; `grow` makes its arms longer */
export function createGlint(x: number, y: number, c: Color, grow = 0): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < 0.12;
    },
    draw() {
      place();
      sparkle(x, y, 7 * (1 - t / 0.12) + 1 + grow, WHITE, c, 0.6);
    },
  };
}

const CORE_LIFE = 0.14;
const CORE_RAYS = 9;
/** the widest the solid heart gets, small enough to leave the fighters around it in view */
const CORE_RADIUS = 5;
const CORE_REACH = 17;

/** the first frames of an explosion: a small white heart in a hot shell, rays thrown out of it and a ring that opens */
export function createBlastCore(x: number, y: number, hot: Color): Effect {
  let t = 0;
  const dim = scale(hot, 0.8);
  return {
    update(dt) {
      t += dt;
      return t < CORE_LIFE;
    },
    draw() {
      place();
      const u = t / CORE_LIFE;
      const f = 1 - u;
      const open = ease.outCubic(u);
      for (let i = 0; i < CORE_RAYS; i++) {
        const a = ((i + grain(i, x) * 0.7) / CORE_RAYS) * TAU;
        const reach = CORE_REACH * (0.55 + 0.45 * grain(i, y)) * open;
        ray(x, y, a, reach * u, reach, u < 0.4 ? WHITE : hot, hot, f * 1.5);
      }
      const ring = CORE_REACH * 0.8 * open + 2;
      fineRing(x, y, ring, ring, hot, f * f * 1.3);
      fineRing(x, y, ring - 0.5, ring - 0.5, dim, f * f * 0.9);
      if (u < 0.7) {
        const r = CORE_RADIUS * (1 - u / 0.7) + 1;
        circle(x, y, r + 1.5, dim, 0.5);
        circle(x, y, r, hot);
        circle(x, y, r * 0.55, WHITE);
      }
    },
  };
}
