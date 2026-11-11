import { PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { bayerAt, fleck, glow, place, putImage, toScreenX, toScreenY } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { ease, TAU } from "../../../utils/math";
import { lights, particles, rng } from "../../state";

/** how flat the ring stands: it is drawn round his body, a little wider than tall */
const SQUASH = 0.78;
/** the ring is broken into this many arcs, which part as it runs out */
const ARCS = 10;

/**
 * A ring of sound out of the drum: cobalt arcs that run out to `radius` round (x, y), a thin dithered falloff behind
 * them, a white flash at the drum head and dust lifted off the floor under the ring. A loud one (on the beat, a
 * Drumroll beat) is brighter and doubled.
 */
export function createBoomRing(
  x: number,
  y: number,
  floor: number,
  radius: number,
  loud: boolean,
  life = 0.28,
): Effect {
  let t = 0;
  const seed = Math.floor(x * 5 + radius * 7);
  lights.add(x, y, radius * 0.7, PAL.beat[3], loud ? 0.5 : 0.3, life);
  lights.add(x, y, 10, WHITE, loud ? 0.6 : 0.35, 0.08);
  for (let i = 0; i < (loud ? 10 : 5); i++) {
    const side = rng.chance(0.5) ? 1 : -1;
    particles.spawn(
      PK.DUST,
      x + side * rng.range(4, radius * 0.6),
      floor - 1,
      side * rng.range(20, 60),
      -rng.range(10, 30),
      rng.range(0.25, 0.5),
    );
  }
  const ring = (r: number, k: number, c: number) => {
    const n = Math.max(16, Math.ceil(TAU * r * 2.4));
    for (let i = 0; i < n; i++) {
      const u = i / n;
      // the gaps between the arcs widen as the ring dies
      const arc = (u * ARCS) % 1;
      if (arc < 0.12 + (1 - k) * 0.3) continue;
      const g = u * TAU;
      fleck(x + Math.cos(g) * r, y + Math.sin(g) * r * SQUASH, c, k * 2);
    }
  };
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      const u = t / life;
      const k = 1 - u;
      const r = Math.max(2, radius * ease.outExpo(u));
      ring(r, k, PAL.beat[loud ? 5 : 4]);
      ring(r - 1.5, k * 0.8, PAL.beat[3]);
      if (loud) ring(r - 4, k * 0.6, PAL.beat[4]);
      // the falloff behind the front: a thin dither that thins toward the middle
      const inner = r * 0.55;
      const cx = toScreenX(x) * RES;
      const cy = toScreenY(y) * RES;
      const ir = r * RES;
      const step = 2;
      for (let iy = -ir; iy <= ir; iy += step)
        for (let ix = -ir; ix <= ir; ix += step) {
          const d = Math.hypot(ix, iy / SQUASH) / RES;
          if (d > r - 2 || d < inner) continue;
          const v = (d - inner) / (r - inner);
          const sx = Math.floor(cx + ix);
          const sy = Math.floor(cy + iy);
          if (bayerAt(sx, sy) > v * k * 0.5 || grain(sx, sy + seed) < 0.3) continue;
          putImage(sx, sy, PAL.beat[2], 0.6);
        }
      if (t < 0.06) glow(x, y, 9, WHITE, 0.6);
    },
  };
}
