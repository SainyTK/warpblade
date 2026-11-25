import { grain } from "../../../utils/grain";

const fade = (t: number): number => t * t * (3 - 2 * t);

export function valueNoise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const u = fade(x - x0);
  const v = fade(y - y0);
  const a = grain(x0, y0);
  const b = grain(x0 + 1, y0);
  const c = grain(x0, y0 + 1);
  const d = grain(x0 + 1, y0 + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x: number, y: number, octaves = 3): number {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise(x * f + i * 17.3, y * f + i * 9.1) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}
