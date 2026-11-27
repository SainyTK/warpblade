import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";

export const GATOR_SCALE = 1.3;

export interface GatorCanvas {
  begin(): void;
  commit(innerLines?: boolean): void;
  shadeEdges(base: Color, light: Color, dark: Color, depth?: number): void;
  set(x: number, y: number, c: Color): void;
  block(x: number, y: number, c: Color, w?: number, h?: number): void;
  dot(x: number, y: number, r: number, c: Color): void;
  stroke(x0: number, y0: number, x1: number, y1: number, r: number, c: Color): void;
  taper(x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, c: Color, bend?: number): void;
  hairline(x0: number, y0: number, x1: number, y1: number, c: Color): void;
  poly(points: readonly (readonly [number, number])[], c: Color): void;
}

export function scaled(s: SpriteCanvas, k = GATOR_SCALE): GatorCanvas {
  return {
    begin: () => s.begin(),
    commit: (innerLines = true) => s.commit(innerLines),
    shadeEdges: (base, light, dark, depth = 1) => s.shadeEdges(base, light, dark, depth),
    set: (x, y, c) => s.set(x * k, y * k, c),
    block: (x, y, c, w = 1, h = w) => s.block(x * k, y * k, c, w, h),
    dot: (x, y, r, c) => s.dot(x * k, y * k, r * k, c),
    stroke: (x0, y0, x1, y1, r, c) => s.stroke(x0 * k, y0 * k, x1 * k, y1 * k, r * k, c),
    taper: (x0, y0, x1, y1, r0, r1, c, bend = 0) =>
      s.taper(x0 * k, y0 * k, x1 * k, y1 * k, r0 * k, r1 * k, c, bend * k),
    hairline: (x0, y0, x1, y1, c) => s.hairline(x0 * k, y0 * k, x1 * k, y1 * k, c),
    poly: (points, c) =>
      s.poly(
        points.map(([x, y]) => [x * k, y * k] as const),
        c,
      ),
  };
}

export function glintAt(s: GatorCanvas, x: number, y: number, c: Color): void {
  s.set(x, y, c);
  s.set(x + 0.4, y, c);
}
