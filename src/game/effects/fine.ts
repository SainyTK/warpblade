import { RES } from "../../constants/stage";
import { fleck, hairline, line, putImage, toScreenX, toScreenY } from "../../engine/frame";
import type { Color } from "../../types/color";
import { grain } from "../../utils/grain";
import { TAU } from "../../utils/math";

/** a ring one image pixel wide; half 0 draws all of it, -1 the far half, 1 the near half */
export function fineRing(x: number, y: number, rx: number, ry: number, c: Color, a = 1, half = 0): void {
  const n = Math.max(8, Math.ceil(TAU * Math.max(rx, ry) * 2.6));
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU;
    const s = Math.sin(g);
    if (half && (s < 0 ? -1 : 1) !== half) continue;
    fleck(x + Math.cos(g) * rx, y + s * ry, c, a);
  }
}

/** a ray from r0 to r1 out of (x, y): a full art pixel of `hot` near its root, thinning to one image pixel of `body` */
export function ray(x: number, y: number, angle: number, r0: number, r1: number, hot: Color, body: Color, a = 1): void {
  if (r1 - r0 < 0.4) return;
  const cx = Math.cos(angle);
  const cy = Math.sin(angle);
  const mid = r0 + (r1 - r0) * 0.4;
  line(x + cx * r0, y + cy * r0, x + cx * mid, y + cy * mid, hot, a);
  hairline(x + cx * mid, y + cy * mid, x + cx * r1, y + cy * r1, body, a);
}

/** how far round toward the viewer a floor ring's line grows to two, then three image pixels thick */
const NEAR_RIM = [0.2, 0.6] as const;

/**
 * an arc of a ring lying on a floor seen edge on: the near side is three image pixels thick, the sides and the far
 * side thin to one, and it breaks into dashes as `breakup` rises from 0 to 1. `seed` keeps the dashes in place.
 */
export function floorArc(
  x: number,
  y: number,
  rx: number,
  ry: number,
  c: Color,
  a: number,
  half: number,
  breakup: number,
  seed: number,
): void {
  if (rx < 0.5 || a <= 0) return;
  const n = Math.max(8, Math.ceil(TAU * rx * 2.6));
  const dashes = Math.max(6, Math.round(rx * 0.8));
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const s = Math.sin(u * TAU);
    if ((s < 0 ? -1 : 1) !== half) continue;
    if (breakup > 0 && grain(Math.floor(u * dashes), seed) < breakup) continue;
    const px = x + Math.cos(u * TAU) * rx;
    const py = y + s * ry;
    fleck(px, py, c, a);
    if (s > NEAR_RIM[0]) fleck(px, py + 0.5, c, a);
    if (s > NEAR_RIM[1]) fleck(px, py - 0.5, c, a);
  }
}

/**
 * draw a small picture given as rows of image pixels, centered on (x, y) in local art pixels; each letter takes its
 * color from `colors` and anything else is left empty
 */
export function stampPixels(
  rows: readonly string[],
  x: number,
  y: number,
  colors: Readonly<Record<string, number>>,
  a = 1,
): void {
  const left = Math.round(toScreenX(x) * RES - rows[0].length / 2);
  const top = Math.round(toScreenY(y) * RES - rows.length / 2);
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      const c = colors[row[i]];
      if (c) putImage(left + i, top + j, c, a);
    }
  }
}
