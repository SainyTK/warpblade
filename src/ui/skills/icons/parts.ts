import { FIRE_RAMP, HERO_COLORS as HC, PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";

/** Small drawing parts for the 16 x 16 skill icons. Each part is its own layer, so overlaps get a dark seam. */
type S = SpriteCanvas;

function layer(s: S, draw: () => void): void {
  s.begin();
  draw();
  s.commit();
}

/** a sword from the grip at (x0, y0) to the point at (x1, y1) */
export function sword(s: S, x0: number, y0: number, x1: number, y1: number, blade: Color = HC.blade): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  layer(s, () => {
    s.stroke(x0 - ux * 3, y0 - uy * 3, x0, y0, 0.55, HC.hilt);
    s.stroke(x0 - uy * 2.5, y0 + ux * 2.5, x0 + uy * 2.5, y0 - ux * 2.5, 0.55, HC.trim);
    s.stroke(x0 + ux, y0 + uy, x1, y1, 0.75, blade);
    s.stroke(x0 + ux * 2 + uy * 0.5, y0 + uy * 2 - ux * 0.5, x1 - ux * 2, y1 - uy * 2, 0.3, HC.bladeEdge);
    s.set(x1, y1, WHITE);
  });
}

/** an arrow from (x0, y0) pointing to (x1, y1) */
export function arrow(s: S, x0: number, y0: number, x1: number, y1: number, c: Color, head = 3): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  layer(s, () => {
    s.stroke(x0, y0, x1, y1, 0.6, c);
    s.stroke(x1, y1, x1 - ux * head - uy * head, y1 - uy * head + ux * head, 0.6, c);
    s.stroke(x1, y1, x1 - ux * head + uy * head, y1 - uy * head - ux * head, 0.6, c);
  });
}

/** a chevron pointing along (dx, dy) with its tip at (x, y) */
export function chevron(s: S, x: number, y: number, dx: number, dy: number, size: number, c: Color): void {
  layer(s, () => {
    s.stroke(x, y, x - dx * size - dy * size, y - dy * size + dx * size, 0.7, c);
    s.stroke(x, y, x - dx * size + dy * size, y - dy * size - dx * size, 0.7, c);
  });
}

/** an arc of radius r around (cx, cy) from angle a0 to a1 */
export function arc(s: S, cx: number, cy: number, r: number, a0: number, a1: number, c: Color, w = 0.6): void {
  layer(s, () => {
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) * r * 1.5));
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, w, c);
    }
  });
}

export function ring(s: S, cx: number, cy: number, r: number, c: Color, w = 0.55): void {
  arc(s, cx, cy, r, 0, TAU, c, w);
}

/** a crescent slash, thick in the middle */
export function crescent(s: S, cx: number, cy: number, r: number, a0: number, a1: number, c: Color): void {
  layer(s, () => {
    const n = 20;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const a = a0 + (a1 - a0) * u;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.4 + Math.sin(Math.PI * u) * 0.9, c);
    }
  });
}

/** a four-point sparkle */
export function sparkle(s: S, cx: number, cy: number, r: number, c: Color = WHITE): void {
  layer(s, () => {
    s.stroke(cx - r, cy, cx + r, cy, 0.4, c);
    s.stroke(cx, cy - r, cx, cy + r, 0.4, c);
    s.set(cx, cy, WHITE);
  });
}

/** a flame rising from base to base - h */
export function flame(s: S, cx: number, base: number, h: number): void {
  layer(s, () => {
    s.poly(
      [
        [cx - h * 0.45, base],
        [cx + h * 0.45, base],
        [cx + h * 0.3, base - h * 0.55],
        [cx + h * 0.05, base - h],
        [cx - h * 0.35, base - h * 0.5],
      ],
      FIRE_RAMP[5],
    );
  });
  layer(s, () => {
    s.poly(
      [
        [cx - h * 0.22, base],
        [cx + h * 0.24, base],
        [cx + h * 0.12, base - h * 0.5],
        [cx, base - h * 0.72],
        [cx - h * 0.18, base - h * 0.35],
      ],
      FIRE_RAMP[2],
    );
    s.set(cx, base - 1, WHITE);
  });
}

export function snowflake(s: S, cx: number, cy: number, r: number): void {
  layer(s, () => {
    for (let k = 0; k < 3; k++) {
      const a = (k * Math.PI) / 3;
      const dx = Math.cos(a) * r;
      const dy = Math.sin(a) * r;
      s.stroke(cx - dx, cy - dy, cx + dx, cy + dy, 0.45, PAL.ice[4]);
    }
    s.set(cx, cy, WHITE);
  });
}

/** a zigzag through the given points */
export function bolt(s: S, pts: readonly (readonly [number, number])[], c: Color = PAL.volt[3]): void {
  layer(s, () => {
    for (let i = 1; i < pts.length; i++) s.stroke(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], 0.65, c);
    s.set(pts[0][0], pts[0][1], WHITE);
  });
}

/** a faceted crystal, lit on its left face */
export function gem(s: S, cx: number, cy: number, w: number, h: number, ramp = PAL.crystal): void {
  layer(s, () => {
    s.poly(
      [
        [cx, cy - h],
        [cx, cy + h],
        [cx - w, cy],
      ],
      ramp[4],
    );
    s.poly(
      [
        [cx, cy - h],
        [cx + w, cy],
        [cx, cy + h],
      ],
      ramp[2],
    );
    s.set(cx - 1, cy - h + 2, WHITE);
  });
}

/** a small hooded figure, its feet at (x, y) */
export function figure(s: S, x: number, y: number, c: Color, dark: Color): void {
  layer(s, () => {
    s.dot(x, y - 8, 1.6, c);
    s.poly(
      [
        [x - 2.5, y],
        [x + 2.5, y],
        [x + 1.5, y - 6.5],
        [x - 1.5, y - 6.5],
      ],
      dark,
    );
  });
}

/** a drop of liquid */
export function drop(s: S, cx: number, cy: number, r: number, c: Color, light: Color): void {
  layer(s, () => {
    s.dot(cx, cy, r, c);
    s.poly(
      [
        [cx - r * 0.75, cy - r * 0.5],
        [cx + r * 0.75, cy - r * 0.5],
        [cx, cy - r * 2.2],
      ],
      c,
    );
    s.set(cx - r * 0.4, cy - r * 0.2, light);
  });
}

/** speed lines trailing to the left of x */
export function speedLines(s: S, x: number, ys: readonly number[], len: number, c: Color): void {
  layer(s, () => {
    for (const [i, y] of ys.entries()) s.stroke(x - len + i, y, x, y, 0.35, c);
  });
}

export function fill(s: S, draw: () => void): void {
  layer(s, draw);
}
