import { glowLine, hairline, line, place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { ease, lerp } from "../../utils/math";
import { skin } from "../hero/skin";
import { particles, rng } from "../state";

/** how far along the line, from its collapsing end, the full width head begins */
const HEAD_FROM = 0.55;

/** the line of light left where the hero warped, collapsing toward where he arrived */
export function createWarpLine(x0: number, y0: number, x1: number, y1: number): Effect {
  const life = 0.32;
  for (let i = 0; i < 18; i++) {
    const u = rng.next();
    particles.spawn(
      PK.MOTE,
      lerp(x0, x1, u),
      lerp(y0, y1, u) + rng.range(-6, 6),
      rng.range(-30, 30),
      rng.range(-40, 10),
      rng.range(0.25, 0.55),
      {
        col: rng.pick(skin.ramp.slice(3)),
        size: 0.7,
      },
    );
  }
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      const u = ease.outCubic(t / life);
      const sx = lerp(x0, x1, u);
      const sy = lerp(y0, y1, u);
      const k = 1 - t / life;
      // a thread of light that thickens toward where he arrived: a fine tail, a full head, a white seam through both
      const mx = lerp(sx, x1, HEAD_FROM);
      const my = lerp(sy, y1, HEAD_FROM);
      hairline(sx, sy + 0.75, x1, y1 + 0.75, skin.ramp[2], (v) => k * (0.3 + 0.5 * v));
      hairline(sx, sy, mx, my, skin.ramp[4], (v) => k * (0.4 + 0.6 * v));
      line(mx, my, x1, y1, skin.ramp[4], k);
      hairline(mx, my + 0.25, x1, y1 + 0.25, WHITE, (v) => k * (0.5 + v));
      glowLine(sx, sy, x1, y1, 7, skin.ramp[3], 0.4 * k);
    },
  };
}
