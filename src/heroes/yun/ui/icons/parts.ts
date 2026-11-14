import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { JADE } from "../../look";

/** Small drawing parts for Yun's 16 by 16 icons. Each part is its own layer, so overlaps get a dark seam. */
type S = SpriteCanvas;

function layer(s: S, draw: () => void): void {
  s.begin();
  draw();
  s.commit();
}

/** the jian from the grip at (x0, y0) to the point at (x1, y1): pale steel, a jade guard and its tassel hanging */
export function jian(s: S, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  layer(s, () => {
    s.stroke(x0 - ux * 3, y0 - uy * 3, x0, y0, 0.5, 0x2c2024);
    s.stroke(x0 - uy * 2, y0 + ux * 2, x0 + uy * 2, y0 - ux * 2, 0.5, JADE[3]);
    s.stroke(x0 + ux, y0 + uy, x1, y1, 0.7, 0xc6e6dc);
    s.stroke(x0 + ux * 2, y0 + uy * 2, x1 - ux * 2, y1 - uy * 2, 0.25, WHITE);
  });
  layer(s, () => {
    s.stroke(x0 - ux * 3.5, y0 - uy * 3.5, x0 - ux * 3.5 - 0.6, y0 - uy * 3.5 + 3, 0.5, JADE[3]);
  });
}

/** a translucent spirit sword from (x0, y0) to its point at (x1, y1) */
export function spirit(s: S, x0: number, y0: number, x1: number, y1: number, c: Color = JADE[4]): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  layer(s, () => {
    s.stroke(x0 - uy * 1.5, y0 + ux * 1.5, x0 + uy * 1.5, y0 - ux * 1.5, 0.4, JADE[3]);
    s.stroke(x0, y0, x1, y1, 0.55, c);
    s.set(x1, y1, WHITE);
  });
}

/** a crescent of qi bowing toward +x, its middle at (x, y), `h` tall */
export function qi(s: S, x: number, y: number, h: number, c: Color = JADE[4]): void {
  layer(s, () => {
    for (let i = -h; i <= h; i += 0.5) {
      const v = i / h;
      s.dot(x + (1 - v * v) * 2.5, y + i, 0.55, c);
    }
  });
  layer(s, () => {
    for (let i = -h + 1; i <= h - 1; i += 0.5) {
      const v = i / h;
      s.set(x + (1 - v * v) * 2.5 + 0.5, y + i, WHITE);
    }
  });
}

/** an arc of radius r round (cx, cy) from a0 to a1 */
export function swirl(s: S, cx: number, cy: number, r: number, a0: number, a1: number, c: Color, w = 0.55): void {
  layer(s, () => {
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) * r * 1.5));
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, w, c);
    }
  });
}
