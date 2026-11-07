import type { ChainBlowSpec } from "../../../constants/orrin/string";
import { SHOULDER_Y, TIP_BAND } from "../../../constants/orrin/string";
import type { Enemy } from "../../../types/enemy";
import type { ChainBlow } from "../../../types/orrin";
import { clamp, TAU } from "../../../utils/math";
import { enemyBox } from "../../enemies/enemy";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { momentumReach } from "./momentum";

/** where a foe sits from his shoulder: the angle (facing right, up negative) and the near and far edge of its body */
export interface FoeBearing {
  angle: number;
  near: number;
  far: number;
}

/** the shoulder the chain sweeps round, world pixels */
export const shoulder = (): [number, number] => [hero.x, hero.y - SHOULDER_Y];

/** a foe's bearing from his shoulder, mirrored so the side he faces is angle 0 */
export function bearing(e: Enemy): FoeBearing {
  const [ox, oy] = shoulder();
  const [x0, y0, x1, y1] = enemyBox(e);
  const nx = clamp(ox, x0, x1) - ox;
  const ny = clamp(oy, y0, y1) - oy;
  const cx = (x0 + x1) / 2 - ox;
  const cy = (y0 + y1) / 2 - oy;
  const far = Math.hypot(
    Math.max(Math.abs(x0 - ox), Math.abs(x1 - ox)),
    Math.max(Math.abs(y0 - oy), Math.abs(y1 - oy)),
  );
  return { angle: Math.atan2(cy, cx * hero.face), near: Math.hypot(nx, ny), far };
}

/** an angle lies within a swept span, whichever way the span runs and however it wraps */
export function inSpan(angle: number, s0: number, s1: number): boolean {
  if (Math.abs(s1 - s0) >= TAU - 1e-6) return true;
  const lo = Math.min(s0, s1);
  const hi = Math.max(s0, s1);
  for (const a of [angle, angle + TAU, angle - TAU]) if (a >= lo && a <= hi) return true;
  return false;
}

/** how far a blow reaches now: its own reach, Momentum's bonus, and Iron Weight's growth on Full Circle */
export function blowReach(spec: ChainBlowSpec, blow: ChainBlow | "hanging"): number {
  const grow = blow === "circle" ? (skillValues("o_ironweight").radius ?? 0) : 0;
  return spec.reach + momentumReach() + grow;
}

/** the tip band's depth: its own, and Sweet Spot's growth */
export const tipBand = (): number => TIP_BAND + (skillValues("o_sweetspot").band ?? 0);
