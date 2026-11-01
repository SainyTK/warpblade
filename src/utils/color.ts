import type { Color, Ramp } from "../types/color";
import { clamp } from "./math";

export const WHITE: Color = 0xffffff;
export const cr = (c: Color): number => (c >> 16) & 255;
export const cg = (c: Color): number => (c >> 8) & 255;
export const cb = (c: Color): number => c & 255;
/** never returns 0, which buffers read as empty */
export const rgb = (r: number, g: number, b: number): Color =>
  ((clamp(r, 0, 255) | 0) << 16) | ((clamp(g, 0, 255) | 0) << 8) | (clamp(b, 0, 255) | 0) || 0x010101;
export const hex = (s: string): Color => Number.parseInt(s.slice(1), 16) || 0x010101;
export const mix = (a: Color, b: Color, t: number): Color =>
  rgb(cr(a) + (cr(b) - cr(a)) * t, cg(a) + (cg(b) - cg(a)) * t, cb(a) + (cb(b) - cb(a)) * t);
export const scale = (c: Color, k: number): Color => rgb(cr(c) * k, cg(c) * k, cb(c) * k);
export const ramp = (a: readonly string[]): Ramp => a.map(hex);
export const rampAt = (rp: Ramp, t: number): Color => rp[clamp(Math.floor(t * rp.length), 0, rp.length - 1)];
