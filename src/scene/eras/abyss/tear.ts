import { RES } from "../../../constants/stage";
import { glowLine, place } from "../../../engine/frame";
import { clamp } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import type { PlatePaint } from "../../platePaint";
import { banded, hair } from "./brush";
import { TEAR } from "./colors";
import { cloud } from "./noise";

/** The rift torn across the sky: a white seam with hot pink lips, soft light around it and fine cracks running off it. */

export type TearPath = readonly (readonly [number, number])[];

/** the widest the rift opens, at its middle, and how thin its ends stay, in art pixels */
const WIDTH = { middle: 3.6, ends: 0.6 };
/** how far the soft light around the rift reaches, in rift widths */
const HALO_REACH = 5;

/** the points of the tear across the sky in art pixels, longer as the era goes on */
export function tearPath(k: number, r: Rng): [number, number][] {
  const n = 4 + Math.round(k * 6);
  const pts: [number, number][] = [];
  let x = 118;
  let y = 22;
  for (let i = 0; i <= n; i++) {
    pts.push([x, y]);
    x -= r.range(7, 12);
    y += r.range(-2, 5);
  }
  return pts;
}

/** the nearest point of the path to an image pixel: how far it is and how far along the path, 0 to 1 */
const near = { d: 0, u: 0 };
function findNearest(path: TearPath, ix: number, iy: number): void {
  const n = path.length - 1;
  let best = Number.POSITIVE_INFINITY;
  let at = 0;
  for (let s = 0; s < n; s++) {
    const ax = path[s][0] * RES;
    const ay = path[s][1] * RES;
    const dx = path[s + 1][0] * RES - ax;
    const dy = path[s + 1][1] * RES - ay;
    const q = clamp(((ix - ax) * dx + (iy - ay) * dy) / (dx * dx + dy * dy));
    const d = Math.hypot(ix - ax - dx * q, iy - ay - dy * q);
    if (d < best) {
      best = d;
      at = (s + q) / n;
    }
  }
  near.d = best;
  near.u = at;
}

/** fine cracks that fork off the rift into the sky, fading as they go */
function branches(p: PlatePaint, path: TearPath, r: Rng, k: number): void {
  const n = path.length - 1;
  const count = 5 + Math.round(k * 7);
  for (let c = 0; c < count; c++) {
    const at = r.range(0.12, 0.88) * n;
    const s = Math.floor(at);
    const f = at - s;
    let x = (path[s][0] + (path[s + 1][0] - path[s][0]) * f) * RES;
    let y = (path[s][1] + (path[s + 1][1] - path[s][1]) * f) * RES;
    const side = r.chance(0.5) ? 1 : -1;
    let heading = side * r.range(0.9, 1.9);
    const steps = 2 + Math.floor(r.range(0, 3));
    for (let i = 0; i < steps; i++) {
      const len = r.range(3, 7);
      const nx = x + Math.cos(heading) * len;
      const ny = y + Math.sin(heading) * len;
      hair(p, x, y, nx, ny, i === 0 ? TEAR[3] : TEAR[2], 1 - i / (steps + 1));
      x = nx;
      y = ny;
      heading += r.range(-0.7, 0.7);
    }
  }
}

/** static: the rift at the frame's full detail */
export function paintTear(p: PlatePaint, path: TearPath, r: Rng, k: number): void {
  let x0 = Number.POSITIVE_INFINITY;
  let x1 = Number.NEGATIVE_INFINITY;
  let y0 = Number.POSITIVE_INFINITY;
  let y1 = Number.NEGATIVE_INFINITY;
  for (const [x, y] of path) {
    x0 = Math.min(x0, x * RES);
    x1 = Math.max(x1, x * RES);
    y0 = Math.min(y0, y * RES);
    y1 = Math.max(y1, y * RES);
  }
  const pad = Math.ceil(WIDTH.middle * RES * HALO_REACH);
  for (let iy = Math.floor(y0 - pad); iy <= y1 + pad; iy++) {
    for (let ix = Math.floor(x0 - pad); ix <= x1 + pad; ix++) {
      findNearest(path, ix + 0.5, iy + 0.5);
      const { d, u } = near;
      if (d > pad) {
        continue;
      }
      // the rift's lips are ragged: its width wanders along it and its edge is chipped
      const wide = (Math.sin(u * Math.PI) * WIDTH.middle + WIDTH.ends) * RES * (0.7 + 0.6 * cloud(u * 40, 0, 1, 3));
      const q = (d + (cloud(ix, iy, 3, 7) - 0.5) * 1.6) / wide;
      if (q < 0.22 && wide > 3) {
        p.put(ix, iy, TEAR[4]);
      } else if (q < 0.55) {
        p.put(ix, iy, TEAR[3]);
      } else if (q < 0.9) {
        p.put(ix, iy, TEAR[2]);
      } else if (q < 1.25) {
        p.put(ix, iy, TEAR[1]);
      } else if (q < HALO_REACH) {
        const fall = 1 - (q - 1.25) / (HALO_REACH - 1.25);
        p.blend(ix, iy, TEAR[1], banded(fall * fall * 0.6, ix, iy, 10));
      }
    }
  }
  branches(p, path, r, k);
}

/** each frame: the rift glows, and now and then swells a soft red */
export function drawTearLight(t: number, k: number, path: TearPath): void {
  place();
  // two slow waves multiplied: a soft swell every several seconds, never a strobe
  const surge = Math.max(0, Math.sin(t * 0.55) * Math.sin(t * 1.7 + 1)) ** 3;
  const lit = 0.16 + 0.05 * Math.sin(t * 2.1) + surge * (0.22 + k * 0.08);
  const [x0, y0] = path[0];
  const [x1, y1] = path[path.length - 1];
  glowLine(x0, y0, x1, y1, 16, TEAR[2], lit);
}
