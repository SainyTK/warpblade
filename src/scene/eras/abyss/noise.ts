import { grain } from "../../../utils/grain";
import { lerp } from "../../../utils/math";

/** Smooth fixed noise for the abyss's static painting: clouds, ragged edges and wisps that stay put between builds. */

const ease = (v: number): number => v * v * (3 - 2 * v);

/** noise from 0 to 1 that changes over `cell` pixels; `seed` picks another field */
export function cloud(x: number, y: number, cell: number, seed = 0): number {
  const gx = x / cell;
  const gy = y / cell;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const u = ease(gx - x0);
  const v = ease(gy - y0);
  const ox = x0 + seed * 57;
  const oy = y0 + seed * 113;
  const top = lerp(grain(ox, oy), grain(ox + 1, oy), u);
  const bottom = lerp(grain(ox, oy + 1), grain(ox + 1, oy + 1), u);
  return lerp(top, bottom, v);
}

/** three sizes of cloud summed, the largest `cell` pixels across, for billows with ragged edges */
export function billow(x: number, y: number, cell: number, seed = 0): number {
  return cloud(x, y, cell, seed) * 0.5 + cloud(x, y, cell / 2, seed + 1) * 0.3 + cloud(x, y, cell / 4, seed + 2) * 0.2;
}
