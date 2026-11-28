import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { TAU } from "../../../utils/math";

export type Pt = readonly [number, number];

const OVAL_STEPS = 20;

export function oval(s: SpriteCanvas, cx: number, cy: number, rx: number, ry: number, c: Color): void {
  const pts: Pt[] = [];
  for (let i = 0; i < OVAL_STEPS; i++) {
    const a = (i / OVAL_STEPS) * TAU;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  s.poly(pts, c);
}

export function facet(s: SpriteCanvas, pts: readonly Pt[], base: Color, light: Color, dark: Color): void {
  s.begin();
  s.poly(pts, base);
  s.shadeEdges(base, light, dark);
  s.hairline(pts[0][0], pts[0][1], pts[1][0], pts[1][1], light);
  s.commit();
}

export function shardPoints(x: number, y: number, len: number, angle: number, half: number): Pt[] {
  const nx = -Math.sin(angle) * half;
  const ny = Math.cos(angle) * half;
  return [
    [x + Math.cos(angle) * len, y + Math.sin(angle) * len],
    [x + nx, y + ny],
    [x - nx, y - ny],
  ];
}
