import type { ChainBlowSpec } from "../../../constants/orrin/string";
import { SHOULDER_Y, TIP_BAND } from "../../../constants/orrin/string";
import type { Enemy } from "../../../types/enemy";
import type { ChainBlow } from "../../../types/orrin";
import { clamp, TAU } from "../../../utils/math";
import { enemyBox } from "../../enemies/enemy";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { momentumReach } from "./momentum";

/** where a foe sits from his shoulder: the angles its body covers (facing right, up negative) and its near and far edge */
export interface FoeBearing {
  /** the smallest and largest angle of its body's corners */
  lo: number;
  hi: number;
  near: number;
  far: number;
}

/** the shoulder the chain sweeps round, world pixels */
export const shoulder = (): [number, number] => [hero.x, hero.y - SHOULDER_Y];

/** a foe's bearing from his shoulder, mirrored so the side he faces is angle 0 */
export const bearing = (e: Enemy): FoeBearing => bearingFrom(...shoulder(), hero.face, e);

/** a foe's bearing from a shoulder at (ox, oy) facing `face`: his own, or a shade's */
export function bearingFrom(ox: number, oy: number, face: number, e: Enemy): FoeBearing {
  const [x0, y0, x1, y1] = enemyBox(e);
  const nx = clamp(ox, x0, x1) - ox;
  const ny = clamp(oy, y0, y1) - oy;
  const far = Math.hypot(
    Math.max(Math.abs(x0 - ox), Math.abs(x1 - ox)),
    Math.max(Math.abs(y0 - oy), Math.abs(y1 - oy)),
  );
  // the corners' angles, unwrapped round the centre's so a body behind him spans across the back, not the front
  const mid = Math.atan2((y0 + y1) / 2 - oy, ((x0 + x1) / 2 - ox) * face);
  let lo = mid;
  let hi = mid;
  for (const [x, y] of [
    [x0, y0],
    [x1, y0],
    [x0, y1],
    [x1, y1],
  ]) {
    let a = Math.atan2(y - oy, (x - ox) * face);
    while (a - mid > Math.PI) a -= TAU;
    while (mid - a > Math.PI) a += TAU;
    lo = Math.min(lo, a);
    hi = Math.max(hi, a);
  }
  return { lo, hi, near: Math.hypot(nx, ny), far };
}

/** a body covering angles `lo` to `hi` meets a swept span, whichever way the span runs and however it wraps */
export function inSpan(b: FoeBearing, s0: number, s1: number): boolean {
  if (Math.abs(s1 - s0) >= TAU - 1e-6) return true;
  const lo = Math.min(s0, s1);
  const hi = Math.max(s0, s1);
  for (const k of [0, TAU, -TAU]) if (b.hi + k >= lo && b.lo + k <= hi) return true;
  return false;
}

/** how far a blow reaches now: its own reach, Momentum's bonus, and Iron Weight's growth on Full Circle */
export function blowReach(spec: ChainBlowSpec, blow: ChainBlow | "hanging"): number {
  const grow = blow === "circle" ? (skillValues("o_ironweight").radius ?? 0) : 0;
  return spec.reach + momentumReach() + grow;
}

/** the tip band's depth: its own, and Sweet Spot's growth */
export const tipBand = (): number => TIP_BAND + (skillValues("o_sweetspot").band ?? 0);
