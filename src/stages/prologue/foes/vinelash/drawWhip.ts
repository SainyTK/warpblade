import type { SpriteCanvas } from "../../../../engine/sprite";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import { WHITE } from "../../../../utils/color";
import type { Pt } from "./pose";

const B = DC.bramble;

export function whip(s: SpriteCanvas, links: readonly Pt[], crack: number): void {
  const last = links.length - 1;
  s.begin();
  for (let i = 1; i <= last; i++) {
    const u = i / last;
    const [ax, ay] = links[i - 1];
    const [bx, by] = links[i];
    s.stroke(ax, ay, bx, by, 1.35 - u * 0.8, B[1]);
  }
  s.shadeEdges(B[1], B[2], B[0]);
  for (let i = 2; i < last; i += 2) {
    const [ax, ay] = links[i - 1];
    const [bx, by] = links[i + 1];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const nx = (ay - by) / len;
    const ny = (bx - ax) / len;
    const side = i % 4 ? 1 : -1;
    const [x, y] = links[i];
    const r = 1.4 - (i / last) * 0.7;
    s.set(x + nx * r * side, y + ny * r * side, DC.thorn);
    s.set(x + nx * (r + 0.6) * side, y + ny * (r + 0.6) * side, DC.thornTip);
  }
  s.commit();
  const [tx, ty] = links[last];
  const [px, py] = links[last - 1];
  const len = Math.hypot(tx - px, ty - py) || 1;
  const ux = (tx - px) / len;
  const uy = (ty - py) / len;
  s.begin();
  s.poly(
    [
      [tx - uy * 1.2, ty + ux * 1.2],
      [tx + ux * 3, ty + uy * 3],
      [tx + uy * 1.2, ty - ux * 1.2],
      [tx - ux * 1, ty - uy * 1],
    ],
    B[3],
  );
  s.shadeEdges(B[3], DC.brambleLit, B[2]);
  s.set(tx + ux * 2.5, ty + uy * 2.5, DC.thornTip);
  s.commit();
  if (crack <= 0) return;
  s.begin();
  for (const [dx, dy] of [
    [0, -3],
    [0, 3],
    [3, 0],
    [2, -2],
    [2, 2],
  ] as const) {
    s.hairline(tx + ux * 2, ty + uy * 2, tx + ux * 2 + dx, ty + uy * 2 + dy, DC.crackHot);
  }
  s.set(tx + ux * 2, ty + uy * 2, WHITE);
  s.commit(false);
}
