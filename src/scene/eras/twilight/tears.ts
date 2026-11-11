import { RES } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { lerp } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { hairline, lighten } from "./brush";
import { OTHER_SKY, TEAR } from "./colors";
import { sizeAt } from "./growth";

/** Thin tears in the sky where the veil has split, each showing the bright sky of the other world. */

export interface Tear {
  /** its middle, in art pixels */
  x: number;
  y: number;
  /** half its length and its widest half width, in art pixels */
  half: number;
  width: number;
  /** its direction, in radians from the x axis */
  angle: number;
  /** the k at which it opens */
  from: number;
}
export const TEARS: readonly Tear[] = [
  { x: 77, y: 36, half: 14, width: 2.3, angle: 1.9, from: 0 },
  { x: 203, y: 60, half: 10, width: 1.8, angle: 1.25, from: 0.25 },
  { x: 126, y: 44, half: 8, width: 1.5, angle: 1.75, from: 0.5 },
  { x: 306, y: 22, half: 9, width: 1.6, angle: 1.4, from: 0.75 },
];
const OPEN_SKY = [LAYER.sky, LAYER.celestial] as const;
/** the violet light that spills around a tear, in image pixels */
const SPILL = { reach: 9, strength: 0.5 };
const RIM = 1.1;
const OTHER_STARS = 0.04;
const CRACK = { steps: 7, stride: 2.2, strength: 0.75 };

/** half the tear's width at share t along it, from -1 to 1: a lens with a ragged edge */
function halfWidth(tear: Tear, t: number, size: number, side: number): number {
  const lens = Math.max(0, 1 - t * t) ** 0.75;
  const cell = (t + 1) * tear.half * 0.55;
  const i = Math.floor(cell);
  const seed = tear.x + side * 3;
  const ragged = lerp(grain(i, seed), grain(i + 1, seed), cell - i);
  return tear.width * size * RES * lens * (0.6 + 0.8 * ragged);
}

function otherSky(t: number, ix: number, iy: number): Color {
  if (grain(ix * 1.7, iy * 2.3) < OTHER_STARS) return TEAR.star;
  const v = ((t + 1) / 2) * (OTHER_SKY.length - 1);
  const i = Math.min(OTHER_SKY.length - 2, Math.floor(v));
  return mix(OTHER_SKY[i], OTHER_SKY[i + 1], v - i);
}

/** a hair crack running on from one end of a tear */
function crack(paint: PlatePaint, r: Rng, x: number, y: number, angle: number): void {
  let a = angle;
  for (let i = 0; i < CRACK.steps; i++) {
    a += r.range(-0.5, 0.5);
    const nx = x + Math.cos(a) * CRACK.stride;
    const ny = y + Math.sin(a) * CRACK.stride;
    hairline(paint, x, y, nx, ny, TEAR.crack, CRACK.strength * (1 - i / CRACK.steps), OPEN_SKY);
    x = nx;
    y = ny;
  }
}

function paintTear(paint: PlatePaint, r: Rng, tear: Tear, size: number): void {
  const cx = tear.x * RES;
  const cy = tear.y * RES;
  const half = tear.half * size * RES;
  const ux = Math.cos(tear.angle);
  const uy = Math.sin(tear.angle);
  const reach = half + SPILL.reach;
  for (let iy = Math.floor(cy - reach); iy <= cy + reach; iy++)
    for (let ix = Math.floor(cx - reach); ix <= cx + reach; ix++) {
      const rx = ix + 0.5 - cx;
      const ry = iy + 0.5 - cy;
      const along = rx * ux + ry * uy;
      const across = ry * ux - rx * uy;
      const t = along / half;
      const edge =
        Math.abs(t) >= 1
          ? Math.hypot(Math.abs(along) - half, across)
          : Math.abs(across) - halfWidth(tear, t, size, across < 0 ? 0 : 1);
      if (edge >= SPILL.reach) continue;
      if (edge >= 0) lighten(paint, ix, iy, TEAR.halo, SPILL.strength * (1 - edge / SPILL.reach) ** 2, OPEN_SKY);
      else paint.put(ix, iy, edge > -RIM ? TEAR.rim : otherSky(t, ix, iy), OPEN_SKY);
    }
  crack(paint, r, cx + ux * half, cy + uy * half, tear.angle);
  crack(paint, r, cx - ux * half, cy - uy * half, tear.angle + Math.PI);
}

export function paintTears(paint: PlatePaint, r: Rng, k: number): void {
  for (const tear of TEARS) {
    const size = sizeAt(k, tear.from);
    if (size > 0) paintTear(paint, r, tear, size);
  }
}
