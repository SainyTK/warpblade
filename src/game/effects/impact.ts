import { SPARKS } from "../../constants/palette";
import { circle, line, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { ease, TAU } from "../../utils/math";
import { lights, particles, rng } from "../state";

/** a hit: a star of spikes, a white core, sparks thrown forward and a light that flares and dies */
export function createImpact(x: number, y: number, dir: number, big: boolean, sparks: Ramp = SPARKS.crystal): Effect {
  const R = rng;
  const count = big ? 7 : 5;
  const spikes = Array.from({ length: count }, (_, i) => ({
    a: (i / count) * TAU + R.range(-0.3, 0.3) + (dir < 0 ? Math.PI : 0),
    len: R.range(5, big ? 13 : 9),
  }));
  lights.add(x, y, big ? 48 : 30, sparks[2], big ? 0.9 : 0.6, big ? 0.3 : 0.18);
  lights.add(x, y, 14, WHITE, 0.8, 0.08);
  for (let i = 0; i < (big ? 14 : 8); i++) {
    const a = (dir > 0 ? 0 : Math.PI) + R.range(-1.1, 1.1);
    const sp = R.range(120, big ? 380 : 280);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 40, R.range(0.12, 0.35), { sparks });
  }
  const life = big ? 0.14 : 0.1;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      const f = 1 - t / life;
      const sc = ease.outCubic(Math.min(1, t / 0.03)) * f;
      for (const s of spikes) {
        const L = s.len * sc;
        line(x, y, x + Math.cos(s.a) * L, y + Math.sin(s.a) * L, (u) => (u < 0.4 ? WHITE : sparks[2]));
      }
      circle(x, y, 2.6 * f + 0.4, WHITE);
    },
  };
}
