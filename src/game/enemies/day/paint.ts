import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

/** a square of size by size art pixels with its top left corner at this local point, filled image pixel by image pixel */
export function block(s: SpriteCanvas, x: number, y: number, c: Color, size = 1): void {
  const n = Math.round(size * s.res);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      s.set(x + i / s.res, y + j / s.res, c);
    }
}

/** a glowing eye one art pixel across: a ring of glow round a hot core in its top left image pixel */
export function glowEye(s: SpriteCanvas, x: number, y: number, glow: Color, core: Color): void {
  block(s, x, y, glow);
  s.set(x, y, core);
}

/** a fixed speckle value from 0 to 1 for this grid cell, so texture stays put from frame to frame */
export function grain(i: number, j: number): number {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** whether a point lies inside this polygon, by the even-odd rule */
export function inside(poly: readonly (readonly [number, number])[], x: number, y: number): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      hit = !hit;
    }
  }
  return hit;
}
