import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { fill } from "../../../../ui/skills/icons/parts";
import { hex, WHITE } from "../../../../utils/color";
import { CRIMSON } from "../../constants/colors";

/** the steel, bronze and grip of Anvilheart in the icons */
const STEEL = { light: hex("#f6f2f0"), body: hex("#b9b2b8"), back: hex("#767079") } as const;
const BRONZE = hex("#c48a3c");
const GRIP = hex("#4c3322");

/** Anvilheart from the grip at (x0, y0) to the point at (x1, y1): a broad slab, a crimson crystal, a heavy guard */
export function greatsword(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number, width = 1.6): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => s.stroke(x0 - ux * 3.5, y0 - uy * 3.5, x0, y0, 0.55, GRIP));
  fill(s, () => s.stroke(x0 + ux * 1.5, y0 + uy * 1.5, x1, y1, width, STEEL.body));
  fill(s, () => {
    s.stroke(
      x0 + ux * 2 - uy * width * 0.6,
      y0 + uy * 2 + ux * width * 0.6,
      x1 - ux * 1.5 - uy * width * 0.6,
      y1 - uy * 1.5 + ux * width * 0.6,
      0.3,
      STEEL.light,
    );
    s.set(x1, y1, WHITE);
  });
  fill(s, () => s.stroke(x0 - uy * 3, y0 + ux * 3, x0 + uy * 3, y0 - ux * 3, 0.6, BRONZE));
  fill(s, () => s.dot(x0 + ux * 2.4, y0 + uy * 2.4, 0.6, CRIMSON[3]));
}

/** a floor line along the bottom in crimson */
export function floor(s: SpriteCanvas, c: Color = CRIMSON[2]): void {
  fill(s, () => s.stroke(1, 14.5, 15, 14.5, 0.6, c));
}

/** a crest of light standing on the floor at x, h tall, w wide, its front to the right */
export function crest(s: SpriteCanvas, x: number, h: number, w: number): void {
  fill(s, () => {
    s.poly(
      [
        [x - w, 14],
        [x, 14],
        [x, 14 - h],
      ],
      CRIMSON[3],
    );
    s.stroke(x, 14 - h, x, 14, 0.35, CRIMSON[5]);
    s.set(x, 14 - h, WHITE);
  });
}

/** a jagged crack across the floor from x0 to x1 */
export function crack(s: SpriteCanvas, x0: number, x1: number, c: Color = CRIMSON[4]): void {
  fill(s, () => {
    const n = Math.max(2, Math.round(Math.abs(x1 - x0) / 2));
    for (let i = 0; i < n; i++) {
      const a = x0 + ((x1 - x0) * i) / n;
      const b = x0 + ((x1 - x0) * (i + 1)) / n;
      s.stroke(a, 14 + (i % 2 ? 0.6 : -0.4), b, 14 + (i % 2 ? -0.4 : 0.6), 0.35, c);
    }
  });
}

/** a heavy crescent arc of crimson round (cx, cy) from angle a0 to a1 */
export function heavyArc(s: SpriteCanvas, cx: number, cy: number, r: number, a0: number, a1: number, w = 1.1): void {
  fill(s, () => {
    const n = 14;
    for (let i = 0; i < n; i++) {
      const g0 = a0 + ((a1 - a0) * i) / n;
      const g1 = a0 + ((a1 - a0) * (i + 1)) / n;
      const k = Math.sin((Math.PI * (i + 0.5)) / n);
      s.stroke(
        cx + Math.cos(g0) * r,
        cy + Math.sin(g0) * r,
        cx + Math.cos(g1) * r,
        cy + Math.sin(g1) * r,
        0.3 + w * k,
        CRIMSON[4],
      );
    }
  });
  fill(s, () => s.set(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, WHITE));
}
