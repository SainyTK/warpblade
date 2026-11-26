import { bayerAt } from "../../../engine/frame";
import type { Color, Ramp } from "../../../types/color";
import { clamp } from "../../../utils/math";
import { GLACIER } from "../colors";

export function dithered(r: Ramp, t: number, ix: number, iy: number): Color {
  const v = clamp(t) * (r.length - 1);
  const i = Math.floor(v);
  return r[Math.min(r.length - 1, v - i > bayerAt(ix, iy) ? i + 1 : i)];
}

export function auroraColor(k: number, shift = 0): Color {
  const r = GLACIER.aurora;
  return r[Math.round(clamp(1 + k * 3.4 + shift, 0, r.length - 1))];
}
