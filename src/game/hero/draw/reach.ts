import { clamp } from "../../../utils/math";

export type Vec = [number, number];

/** two-bone reach: the joint, and the end clamped to the limb's length. s picks which way the joint bends. */
export function reach(ax: number, ay: number, tx: number, ty: number, l1: number, l2: number, s: number): [Vec, Vec] {
  const a = Math.atan2(ty - ay, tx - ax);
  const d = clamp(Math.hypot(tx - ax, ty - ay), 0.01, l1 + l2 - 0.01);
  const al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  return [
    [ax + Math.cos(a + s * al) * l1, ay + Math.sin(a + s * al) * l1],
    [ax + Math.cos(a) * d, ay + Math.sin(a) * d],
  ];
}
