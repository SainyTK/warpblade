import type { SpriteCanvas } from "../../../../engine/sprite";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import { glowEye } from "../../../../game/enemies/day/paint";
import { WHITE } from "../../../../utils/color";
import { VINE_COLORS as VC } from "./colors";

const L = DC.leaf;
const P = VC.petal;

function sepal(s: SpriteCanvas, cx: number, cy: number, angle: number, length: number, width: number): void {
  const ux = Math.sin(angle);
  const uy = -Math.cos(angle);
  s.poly(
    [
      [cx - uy * width, cy + ux * width],
      [cx + ux * length * 0.55 - uy * width * 1.1, cy + uy * length * 0.55 + ux * width * 1.1],
      [cx + ux * length, cy + uy * length],
      [cx + ux * length * 0.55 + uy * width * 1.1, cy + uy * length * 0.55 - ux * width * 1.1],
      [cx + uy * width, cy - ux * width],
    ],
    L[2],
  );
}

export function bud(s: SpriteCanvas, cx: number, cy: number, bloom: number, time: number): void {
  const spread = bloom * 0.95;
  if (bloom > 0.15) {
    s.begin();
    for (const side of [-1, 1]) {
      const a = side * (0.25 + spread * 0.9);
      const ux = Math.sin(a);
      const uy = -Math.cos(a);
      s.taper(cx, cy, cx + ux * 5.5 * bloom, cy + uy * 5.5 * bloom, 2, 0.8, P[2], side * 0.6);
    }
    s.shadeEdges(P[2], P[3], P[1], 2);
    s.commit();
    s.begin();
    const pulse = 0.5 + 0.5 * Math.sin(time * 20);
    s.dot(cx, cy - 1, 1.6 + bloom * 0.6, VC.heart);
    s.dot(cx, cy - 1, 0.6 + bloom * (0.8 + pulse * 0.4), bloom > 0.7 ? DC.crackHot : DC.crack);
    glowEye(s, cx - 0.5, cy - 1.5, bloom > 0.7 ? WHITE : DC.crackHot, WHITE);
    s.set(cx + 1, cy - 2.5, P[4]);
    s.commit();
  }
  s.begin();
  const lean = spread * 1.25;
  sepal(s, cx - 0.5, cy + 1.5, -0.18 - lean, 6.5, 1.7);
  sepal(s, cx + 0.5, cy + 1.5, 0.18 + lean, 6.5, 1.7);
  if (bloom < 0.5) sepal(s, cx, cy + 1.5, 0, 7.5 - bloom * 4, 1.9);
  s.shadeEdges(L[2], L[3], L[1], 2);
  if (bloom < 0.5) {
    s.hairline(cx, cy + 1, cx, cy - 4.5, L[1]);
    s.set(cx - 0.5, cy - 5, L[4]);
    s.set(cx + 0.5, cy - 4, P[3]);
  }
  s.commit();
  s.begin();
  s.dot(cx, cy + 2.6, 1.6, L[1]);
  s.shadeEdges(L[1], L[2], DC.leafDeep);
  s.commit();
}
