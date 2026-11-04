import { glowLine, line, place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { ease, lerp } from "../../utils/math";
import { skin } from "../hero/skin";
import { particles, rng } from "../state";

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
      line(
        sx,
        sy,
        x1,
        y1,
        (v) => (v > 0.8 ? WHITE : skin.ramp[4]),
        (v) => k * (0.4 + 0.6 * v),
      );
      line(sx, sy + 1, x1, y1 + 1, skin.ramp[2], k * 0.6);
      glowLine(sx, sy, x1, y1, 7, skin.ramp[3], 0.4 * k);
    },
  };
}
