import type { SpriteCanvas } from "../../../../engine/sprite";
import { mix, WHITE } from "../../../../utils/color";
import { SENTINEL_COLORS as C } from "./colors";
import { HALBERD } from "./constants";
import type { SentinelPose } from "./pose";

type Pt = readonly [number, number];

const BLADE: readonly Pt[] = [
  [-10, 0.6],
  [-12, 4],
  [-9, 7.2],
  [-3.5, 6.8],
  [-0.4, 3.6],
  [-1, 0.6],
];
const SPIKE: readonly Pt[] = [
  [-5, -0.6],
  [-7.5, -3.2],
  [-3.5, -0.6],
];
const TIP: readonly Pt[] = [
  [-0.5, -1.1],
  [5.5, 0],
  [-0.5, 1.1],
];

export function drawHalberd(s: SpriteCanvas, p: SentinelPose): void {
  const ux = Math.cos(p.angle);
  const uy = Math.sin(p.angle);
  const at = (u: number, v: number): Pt => [p.handX + ux * u - uy * v, p.handY + uy * u + ux * v];
  const head = (pts: readonly Pt[]): Pt[] => pts.map(([u, v]) => at(HALBERD.head + u, v));
  const [bx, by] = at(-HALBERD.butt, 0);
  const [tx, ty] = at(HALBERD.head - 1, 0);
  s.begin();
  s.stroke(bx, by, tx, ty, 0.6, C.shaft[2]);
  s.shadeEdges(C.shaft[2], C.shaft[3], C.shaft[1]);
  for (const u of [3, 10, 17]) {
    const [rx, ry] = at(u, 0);
    s.dot(rx, ry, 0.9, C.shaft[1]);
  }
  s.commit();
  s.begin();
  s.poly(head(BLADE), C.stone[3]);
  s.poly(head(SPIKE), C.stone[3]);
  s.poly(head(TIP), C.stone[3]);
  s.shadeEdges(C.stone[3], C.stone[4], C.stone[1], 2);
  const [gx, gy] = at(HALBERD.head - 4, 6.2);
  s.set(gx, gy, C.stoneGlint);
  const rune = p.heat > 0.7 ? WHITE : mix(C.crackDeep, C.crackHot, p.heat);
  const [r0x, r0y] = at(HALBERD.head - 8.5, 2.5);
  const [r1x, r1y] = at(HALBERD.head - 3.5, 4);
  s.hairline(r0x, r0y, r1x, r1y, rune);
  const [cx, cy] = at(HALBERD.head - 1, 0);
  s.block(cx - 0.5, cy - 0.5, C.stone[1], 1.5, 1.5);
  s.commit();
}
