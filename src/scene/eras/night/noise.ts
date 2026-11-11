import { grain } from "../../../utils/grain";
import { lerp } from "../../../utils/math";

/** smooth noise from 0 to 1 that changes over one unit of x and y */
export function valueNoise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const u = x - x0;
  const v = y - y0;
  const su = u * u * (3 - 2 * u);
  const sv = v * v * (3 - 2 * v);
  const top = lerp(grain(x0, y0), grain(x0 + 1, y0), su);
  const bottom = lerp(grain(x0, y0 + 1), grain(x0 + 1, y0 + 1), su);
  return lerp(top, bottom, sv);
}

/** two layers of smooth noise, the second twice as fine and half as strong, from 0 to 1 */
export const cloudNoise = (x: number, y: number): number =>
  (valueNoise(x, y) * 2 + valueNoise(x * 2 + 17.3, y * 2 + 9.1)) / 3;
