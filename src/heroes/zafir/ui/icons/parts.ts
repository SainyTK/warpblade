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

/** a ring of sand round (cx, cy), tilted to lie half flat, its near half lit */
export function sandRing(s: SpriteCanvas, cx: number, cy: number, r: number, n: number, c: Color = ICON.sand[1]): void {
  fill(s, () => {
    const steps = Math.max(n, Math.ceil(r * 6));
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.55, 0.6, Math.sin(a) > 0 ? c : ICON.sand[3]);
    }
  });
}

/** a funnel of whirling sand from a wide top at `top` down to a narrow foot at `foot`, with dark turns across it */
export function funnel(s: SpriteCanvas, cx: number, top: number, foot: number, wide: number, narrow: number): void {
  fill(s, () => {
    s.poly(
      [
        [cx - wide, top],
        [cx + wide, top],
        [cx + narrow, foot],
        [cx - narrow, foot],
      ],
      ICON.sand[1],
    );
    s.shadeEdges(ICON.sand[1], ICON.sand[0], ICON.sand[3]);
  });
  fill(s, () => {
    const turns = 4;
    for (let i = 1; i < turns; i++) {
      const y = top + ((foot - top) * i) / turns;
      const w = wide + ((narrow - wide) * i) / turns;
      s.stroke(cx - w + 0.5, y - 0.6, cx + w - 0.5, y + 0.6, 0.35, ICON.sand[3]);
    }
  });
}

/** a line of wind from (x0, y) to (x1, y), bright at its head */
export function wind(s: SpriteCanvas, x0: number, x1: number, y: number, c: Color): void {
  fill(s, () => {
    s.stroke(x0, y + 0.5, x1, y + 0.5, 0.6, c);
    s.set(x1, y, WHITE);
  });
}

/** a shard of glass falling, its point down at (x, y) */
export function shard(s: SpriteCanvas, x: number, y: number, h: number): void {
  fill(s, () => {
    s.poly(
      [
        [x, y],
        [x + 1.3, y - h * 0.6],
        [x, y - h],
        [x - 1.3, y - h * 0.6],
      ],
      ICON.glass,
    );
    s.shadeEdges(ICON.glass, WHITE, ICON.spine);
  });
}

/** a few grains scattered round a point */
export function grains(s: SpriteCanvas, pts: readonly (readonly [number, number])[], c: Color = ICON.sand[1]): void {
  fill(s, () => {
    for (const [x, y] of pts) s.dot(x, y, 0.6, c);
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
