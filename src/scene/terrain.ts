import { GROUND } from "../constants/stage";
import { bayerAt } from "../engine/frame";
import type { Color } from "../types/color";
import { scale } from "../utils/color";
import { clamp } from "../utils/math";
import type { ScenePalette } from "./eras/sceneDef";

/** The parts of the night scene that go on forever, as functions of any art pixel, inside the stage or beyond it. */

/** the sky's band at height y in art pixels, the step between two bands broken up by a dither threshold from 0 to 1 */
export function skyBandAt(y: number, threshold: number, P: ScenePalette): Color {
  const S = P.sky;
  const v = clamp(y / 150) * (S.length - 1);
  const i = Math.floor(v);
  return S[Math.min(S.length - 1, v - i > threshold ? i + 1 : i)];
}

/** the sky darkens upward in dithered bands */
export const skyAt = (x: number, y: number, P: ScenePalette): Color => skyBandAt(y, bayerAt(x, y), P);

/** the top row of the far ridge in column x */
export const ridgeTopAt = (x: number): number =>
  Math.floor(112 + Math.sin(x * 0.021) * 8 + Math.sin(x * 0.057 + 1.3) * 5 + Math.sin(x * 0.13) * 2);

export function ridgeAt(x: number, y: number, P: ScenePalette): Color {
  return y === ridgeTopAt(x) ? P.ridgeTop : P.ridge;
}

/** stone courses with a lit lip, for any y at or below the ground line */
export function groundAt(x: number, y: number, P: ScenePalette): Color {
  const row = y - GROUND;
  const offset = Math.floor((row - 2) / 7) % 2 ? 8 : 0;
  let c = row === 0 ? P.groundLip : row === 1 ? P.groundEdge : P.stone;
  if (row > 1 && ((row - 2) % 7 === 6 || (((x + offset) % 16) + 16) % 16 === 0)) c = P.mortar;
  else if (row > 1 && (row - 2) % 7 === 0) c = P.stoneTop;
  return row > 9 ? scale(c, 0.8) : c;
}
