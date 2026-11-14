import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { fill } from "../../../../ui/skills/icons/parts";
import { hex, WHITE } from "../../../../utils/color";

/** the icon colours of his look and his sand, pale to deep */
export const ICON = {
  steel: hex("#e6dcc6"),
  steelEdge: hex("#fffbea"),
  spine: hex("#a89a80"),
  gold: hex("#e0ac48"),
  hilt: hex("#4a2a1a"),
  saffron: hex("#f2a03a"),
  saffronDeep: hex("#a8521c"),
  sand: [hex("#fff0c8"), hex("#f0cf8a"), hex("#d8a858"), hex("#a8763a")] as const,
  wound: [hex("#ffb0a0"), hex("#e0403a"), hex("#8e1a20")] as const,
  turquoise: hex("#22a49a"),
  glass: hex("#9ee0d8"),
} as const;

/** the scimitar from the grip at (x0, y0) toward (x1, y1), its blade bowing back and widening toward the point */
export function scimitar(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  const at = (d: number, w: number): [number, number] => [x0 + ux * d - uy * w, y0 + uy * d + ux * w];
  fill(s, () => {
    s.stroke(...at(-3, 0), ...at(0, 0), 0.55, ICON.hilt);
    s.stroke(...at(0, -2.4), ...at(0, 2.4), 0.55, ICON.gold);
    for (let d = 1; d <= L; d += 0.5) {
      const u = d / L;
      const bow = -2.2 * u * u;
      const width = u < 0.8 ? 0.5 + u * 0.9 : (1 - u) * 6;
      s.stroke(...at(d, bow - 0.4), ...at(d, bow + width), 0.4, ICON.steel);
    }
    s.set(...at(L - 1, -2), WHITE);
  });
  fill(s, () => s.dot(...at(0, 0), 0.6, ICON.saffron));
}

/** a ring of grains round (cx, cy), lying flat */
export function sandRing(s: SpriteCanvas, cx: number, cy: number, r: number, n: number, c: Color = ICON.sand[1]): void {
  fill(s, () => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.4, 0.45, i % 3 ? c : ICON.sand[0]);
    }
  });
}

/** a few grains scattered round a point */
export function grains(s: SpriteCanvas, pts: readonly (readonly [number, number])[], c: Color = ICON.sand[1]): void {
  fill(s, () => {
    for (const [x, y] of pts) s.dot(x, y, 0.45, c);
  });
}

/** a cut that bleeds: a red slash with a drop under it */
export function wound(s: SpriteCanvas, x: number, y: number): void {
  fill(s, () => {
    s.stroke(x - 2, y - 1, x + 2, y + 1, 0.5, ICON.wound[1]);
    s.dot(x + 1, y + 3, 0.6, ICON.wound[2]);
    s.set(x - 1, y - 1, ICON.wound[0]);
  });
}
