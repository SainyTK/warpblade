import { PAL } from "../../constants/palette";
import { glow, place, shade } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { ease, TAU } from "../../utils/math";
import { game, lights, particles, rng } from "../state";

const OPEN_AT = 0.45;
const LIFE = 1.0;

/** a rift that gathers streaks, opens, lets a shadow through at OPEN_AT and seals; waits `delay` before starting */
export function createRift(x: number, y: number, height: number, delay: number, onOpen: () => void): Effect {
  const S = PAL.shadow;
  let t = -delay;
  let opened = false;
  return {
    rift: true,
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (t < OPEN_AT && rng.chance(0.5)) {
        const a = rng.range(0, TAU);
        const d = rng.range(16, 30);
        particles.spawn(
          PK.STREAK,
          x + Math.cos(a) * d,
          y + Math.sin(a) * d,
          -Math.cos(a) * 30,
          -Math.sin(a) * 30,
          rng.range(0.12, 0.2),
          {
            col: rng.pick([S[4], S[5]]),
          },
        );
      }
      if (!opened && t >= OPEN_AT) {
        opened = true;
        onOpen();
        lights.add(x, y, 40, S[4], 0.7, 0.4);
        for (let i = 0; i < 10; i++)
          particles.spawn(
            PK.MOTE,
            x,
            y + rng.range(-height, height) * 0.6,
            rng.range(-80, 80),
            rng.range(-50, 50),
            rng.range(0.3, 0.6),
            {
              col: rng.pick([S[3], S[4], S[5]]),
              size: 0.7,
            },
          );
      }
      return t < LIFE;
    },
    draw() {
      if (t < 0) return;
      place();
      const open = t < 0.35 ? ease.outBack(t / 0.35) : t < 0.6 ? 1 : 1 - ease.outCubic((t - 0.6) / 0.4);
      const ry = height * open;
      const rx = 5 * open;
      if (ry < 1) return;
      shade(x - rx - 2, y - ry - 2, x + rx + 2, y + ry + 2, (lx, ly, out) => {
        const d = Math.hypot((lx - x) / Math.max(1, rx), (ly - y) / ry);
        if (d > 1) return;
        const swirl = Math.sin(d * 9 - game.t * 10 + Math.atan2(ly - y, lx - x) * 2);
        out.c = d > 0.85 ? S[5] : d > 0.7 ? S[4] : swirl > 0.6 ? S[2] : S[0];
      });
      glow(x, y, ry * 1.6, S[3], 0.45 * open);
    },
  };
}
