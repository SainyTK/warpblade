import type { Color } from "../../../types/color";
import { cb, cg, cr, rgb } from "../../../utils/color";
import type { Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";

/** Shapes painted on the static plate. Every coordinate here is in image pixels. */

export type Pt = readonly [number, number];
export type Only = readonly Layer[] | undefined;

/** fill a polygon, asking `tone` for each pixel's color */
export function fillPoly(
  paint: PlatePaint,
  pts: readonly Pt[],
  tone: (ix: number, iy: number) => Color,
  only?: Only,
): void {
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const p of pts) {
    top = Math.min(top, p[1]);
    bottom = Math.max(bottom, p[1]);
  }
  for (let y = Math.floor(top); y <= Math.ceil(bottom); y++) {
    const yc = y + 0.5;
    const xs: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc))
        xs.push(a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
    }
    xs.sort((m, n) => m - n);
    for (let k = 0; k + 1 < xs.length; k += 2)
      for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) paint.put(x, y, tone(x, y), only);
  }
}

/** a line one image pixel wide, mixed over what is there by a */
export function hairline(
  paint: PlatePaint,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  c: Color,
  a = 1,
  only?: Only,
): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  for (let i = 0; i <= n; i++)
    paint.blend(Math.floor(x0 + ((x1 - x0) * i) / n), Math.floor(y0 + ((y1 - y0) * i) / n), c, a, only);
}

/** add c times a to what is there, as light does */
export function lighten(paint: PlatePaint, ix: number, iy: number, c: Color, a: number, only?: Only): void {
  if (a <= 0 || !paint.on(ix, iy, only)) return;
  const under = paint.get(ix, iy);
  paint.put(ix, iy, rgb(cr(under) + cr(c) * a, cg(under) + cg(c) * a, cb(under) + cb(c) * a));
}

/** a soft round stain of light: a at the center, falling to nothing at radius r */
export function halo(paint: PlatePaint, cx: number, cy: number, r: number, c: Color, a: number, only?: Only): void {
  for (let iy = Math.floor(cy - r); iy <= Math.ceil(cy + r); iy++)
    for (let ix = Math.floor(cx - r); ix <= Math.ceil(cx + r); ix++) {
      const d = Math.hypot(ix + 0.5 - cx, iy + 0.5 - cy) / r;
      if (d < 1) lighten(paint, ix, iy, c, a * (1 - d) * (1 - d), only);
    }
}
