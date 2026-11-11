import { grain } from "../../../utils/grain";

/** Smooth noise for painting the static storm scene: a fixed lattice of speckle values read with soft interpolation. */

const SIZE = 256;
const MASK = SIZE - 1;
const LATTICE = Float32Array.from({ length: SIZE * SIZE }, (_, i) => grain(i % SIZE, Math.floor(i / SIZE) + 0.5));

const soften = (t: number): number => t * t * (3 - 2 * t);

/** smooth noise from 0 to 1 that changes about once per unit of x and y */
export function noise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const u = soften(x - x0);
  const v = soften(y - y0);
  const row0 = (y0 & MASK) * SIZE;
  const row1 = ((y0 + 1) & MASK) * SIZE;
  const a = LATTICE[row0 + (x0 & MASK)];
  const b = LATTICE[row0 + ((x0 + 1) & MASK)];
  const c = LATTICE[row1 + (x0 & MASK)];
  const d = LATTICE[row1 + ((x0 + 1) & MASK)];
  const top = a + (b - a) * u;
  return top + (c + (d - c) * u - top) * v;
}

/**
 * billows from 0 to 1: noise folded about its middle and summed over `octaves` scales, each twice as fine and half as
 * strong, which gives round heaps with sharp creases between them, the way cumulus piles up
 */
export function billows(x: number, y: number, octaves: number): number {
  let sum = 0;
  let weight = 0;
  let amp = 1;
  let fx = x;
  let fy = y;
  for (let o = 0; o < octaves; o++) {
    sum += Math.abs(noise(fx, fy) * 2 - 1) * amp;
    weight += amp;
    amp *= 0.5;
    fx = fx * 2 + 37.2;
    fy = fy * 2 + 11.7;
  }
  return sum / weight;
}
