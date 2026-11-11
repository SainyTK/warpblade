import { PAL } from "../../constants/palette";
import { glow, hairline, place, shade } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { grain } from "../../utils/grain";
import { ease, TAU } from "../../utils/math";
import { game, lights, particles, rng } from "../state";

const OPEN_AT = 0.45;
/**
 * the tear's shape: its half width in art pixels, how sharply it narrows to its points, how much its edge wavers,
 * where its white edge, bright rim and violet shell begin as shares of the half width, the share of the void's pixels
 * that are stars, and how far the forks at its points reach
 */
const TEAR = { width: 5.5, point: 0.7, waver: 0.1, edge: 0.84, rim: 0.66, shell: 0.5, stars: 0.975, fork: 5 };
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
      const rx = TEAR.width * open;
      if (ry < 1) return;
      const now = game.t;
      // a tear pointed at both ends: a white hot edge that wavers, then the void with a slow swirl and stars in it
      shade(x - rx - 2, y - ry - 1, x + rx + 2, y + ry + 1, (lx, ly, out) => {
        const v = (ly - y) / ry;
        if (v <= -1 || v >= 1) return;
        const half = rx * (1 - v * v) ** TEAR.point * (1 + TEAR.waver * Math.sin(ly * 0.8 + now * 14));
        const d = Math.abs(lx - x) / Math.max(0.5, half);
        if (d > 1) return;
        if (d > TEAR.edge || half < 0.8) out.c = S[5];
        else if (d > TEAR.rim) out.c = S[4];
        else if (d > TEAR.shell) out.c = S[3];
        else if (grain(Math.floor(lx * 2), Math.floor(ly * 2) + Math.floor(now * 9)) > TEAR.stars) out.c = S[5];
        else out.c = Math.sin(d * 7 - now * 10 + v * 5) > 0.55 ? S[2] : S[0];
      });
      // forks of light crackle from both points
      for (const end of [-1, 1])
        for (let i = 0; i < 2; i++) {
          const flick = grain(Math.floor(now * 22) + i * 7, end * 3 + x);
          const reach = TEAR.fork * open * (0.4 + 0.6 * flick);
          hairline(
            x,
            y + end * ry,
            x + (flick - 0.5) * 5 + (i ? 1.5 : -1.5),
            y + end * (ry + reach),
            S[i ? 4 : 5],
            0.9,
          );
        }
      glow(x, y, ry * 1.6, S[3], 0.45 * open);
      glow(x, y, Math.max(3, rx * 2), S[5], 0.16 * open);
    },
  };
}
