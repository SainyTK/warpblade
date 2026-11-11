import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { clamp } from "../../../utils/math";
import type { Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";

/** Brushes for painting the abyss on the static plate, in image pixels. */

export type Only = readonly Layer[] | undefined;

/** a strength from 0 to 1 in `steps` flat levels, the step between two broken up on the image grid, so a soft falloff keeps a pixel grain */
export function banded(a: number, ix: number, iy: number, steps = 8): number {
  return Math.floor(clamp(a) * steps + bayerAt(ix, iy)) / steps;
}

/** a line one image pixel wide */
export function hair(
  p: PlatePaint,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  c: Color,
  a = 1,
  only?: Only,
): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  for (let i = 0; i <= n; i++) {
    p.blend(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c, a, only);
  }
}

/** a soft spot of colour of radius r, strongest at its centre, as light soaking into what is there */
export function halo(p: PlatePaint, cx: number, cy: number, r: number, c: Color, a: number, only?: Only): void {
  for (let iy = Math.floor(cy - r); iy <= Math.ceil(cy + r); iy++) {
    for (let ix = Math.floor(cx - r); ix <= Math.ceil(cx + r); ix++) {
      const d = Math.hypot(ix - cx, iy - cy) / r;
      if (d < 1) {
        p.blend(ix, iy, c, a * (1 - d) * (1 - d), only);
      }
    }
  }
}

/** a solid disc of radius r */
export function dab(p: PlatePaint, cx: number, cy: number, r: number, c: Color, only?: Only): void {
  for (let iy = Math.floor(cy - r); iy <= Math.ceil(cy + r); iy++) {
    for (let ix = Math.floor(cx - r); ix <= Math.ceil(cx + r); ix++) {
      if (Math.hypot(ix + 0.5 - cx, iy + 0.5 - cy) <= r) {
        p.put(ix, iy, c, only);
      }
    }
  }
}

/** a solid shape with straight sides, filled row by row */
export function fill(p: PlatePaint, points: readonly (readonly [number, number])[], c: Color, only?: Only): void {
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const [, y] of points) {
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  for (let iy = Math.floor(top); iy <= Math.ceil(bottom); iy++) {
    const yc = iy + 0.5;
    const xs: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) {
        xs.push(a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
      }
    }
    xs.sort((m, n) => m - n);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      for (let ix = Math.ceil(xs[k] - 0.5); ix <= Math.floor(xs[k + 1] - 0.5); ix++) {
        p.put(ix, iy, c, only);
      }
    }
  }
}
