import { px } from "../../../engine/frame";
import type { Color } from "../../../types/color";

/** one pixel of a shape: its colour, or a material lit from the top left with its light and dark edge colours */
interface ShapePixel {
  c: Color;
  light: Color;
  dark: Color;
}

/** room for coordinates either side of zero when packing a pixel's place into one key */
const SPAN = 4096;
const HALF = SPAN / 2;
const key = (x: number, y: number): number => (y + HALF) * SPAN + (x + HALF);

/**
 * A figure built pixel by pixel in whole art pixels, then drawn with a dark outline round its silhouette. A lit pixel
 * takes its light colour where nothing of the shape sits to its left or above it, and its dark colour where nothing
 * sits to its right or below, so a fill reads as lit from the top left. Pixels on or below a cut-off row are left out
 * (the floor a figure rises out of or melts into), and so is the outline there.
 */
export class LitShape {
  private readonly pixels = new Map<number, ShapePixel>();

  /** a flat pixel, kept as it is */
  set(x: number, y: number, c: Color): void {
    this.pixels.set(key(Math.round(x), Math.round(y)), { c, light: c, dark: c });
  }

  /** a pixel of a material lit from the top left */
  lit(x: number, y: number, c: Color, light: Color, dark: Color): void {
    this.pixels.set(key(Math.round(x), Math.round(y)), { c, light, dark });
  }

  has(x: number, y: number): boolean {
    return this.pixels.has(key(Math.round(x), Math.round(y)));
  }

  /** draw it in the placement already set, outlined, leaving out every row from `cut` down */
  draw(outline: Color, cut = Number.POSITIVE_INFINITY, alpha = 1): void {
    const ring = new Set<number>();
    const near = (x: number, y: number) => this.pixels.has(key(x, y));
    for (const k of this.pixels.keys()) {
      const x = (k % SPAN) - HALF;
      const y = Math.floor(k / SPAN) - HALF;
      if (y >= cut) continue;
      for (const [dx, dy] of NEIGHBOURS) {
        const nx = x + dx;
        const ny = y + dy;
        if (ny < cut && !near(nx, ny)) ring.add(key(nx, ny));
      }
    }
    for (const k of ring) px((k % SPAN) - HALF, Math.floor(k / SPAN) - HALF, outline, alpha);
    for (const [k, p] of this.pixels) {
      const x = (k % SPAN) - HALF;
      const y = Math.floor(k / SPAN) - HALF;
      if (y >= cut) continue;
      const c = !near(x - 1, y) || !near(x, y - 1) ? p.light : !near(x + 1, y) || !near(x, y + 1) ? p.dark : p.c;
      px(x, y, c, alpha);
    }
  }
}

const NEIGHBOURS: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
