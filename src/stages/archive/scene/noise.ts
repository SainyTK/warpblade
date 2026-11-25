import { grain } from "../../../utils/grain";

const SIZE = 128;
const MASK = SIZE - 1;
const LATTICE = Float32Array.from({ length: SIZE * SIZE }, (_, i) => grain(i % SIZE, Math.floor(i / SIZE) + 0.25));

const soften = (t: number): number => t * t * (3 - 2 * t);

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

export function fbm(x: number, y: number, octaves: number): number {
  let sum = 0;
  let weight = 0;
  let amp = 1;
  let fx = x;
  let fy = y;
  for (let o = 0; o < octaves; o++) {
    sum += noise(fx, fy) * amp;
    weight += amp;
    amp *= 0.5;
    fx = fx * 2 + 17.3;
    fy = fy * 2 + 5.1;
  }
  return sum / weight;
}
