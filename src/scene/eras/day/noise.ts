import { grain } from "../../../utils/grain";
import { lerp } from "../../../utils/math";

/** smooth noise from 0 to 1 that changes over `cell` pixels, fixed for a place so texture stays put */
export function smoothNoise(x: number, y: number, cell: number): number {
  const gx = x / cell;
  const gy = y / cell;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const u = gx - x0;
  const v = gy - y0;
  const top = lerp(grain(x0, y0), grain(x0 + 1, y0), u);
  const bottom = lerp(grain(x0, y0 + 1), grain(x0 + 1, y0 + 1), u);
  return lerp(top, bottom, v);
}
