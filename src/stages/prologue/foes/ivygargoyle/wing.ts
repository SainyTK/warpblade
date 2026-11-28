import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { GARGOYLE_COLORS as C } from "./colors";

type Pt = readonly [number, number];

const SHAPE: readonly Pt[] = [
  [0, -1],
  [9, -3.6],
  [16, -2.4],
  [22, -1],
  [19, 4],
  [15.5, 9],
  [12, 6.5],
  [8, 11],
  [4.5, 7.5],
  [0, 7],
];
const ELBOW: Pt = [9, -3];
const TIP: Pt = [21.5, -1.2];
const FINGERS: readonly Pt[] = [
  [19, 4],
  [15.5, 9],
  [8, 11],
];

export function drawWing(s: SpriteCanvas, rx: number, ry: number, angle: number, span: number, near: boolean): void {
  const ux = Math.cos(angle) * span;
  const uy = Math.sin(angle) * span;
  const nx = -Math.sin(angle);
  const ny = Math.cos(angle);
  const at = ([u, v]: Pt): Pt => [rx + ux * u - nx * v, ry + uy * u - ny * v];
  const skin: Color = near ? C.wing[2] : C.wing[1];
  s.begin();
  s.poly(SHAPE.map(at), skin);
  s.shadeEdges(skin, near ? C.wing[3] : C.wing[2], C.wing[0], 2);
  for (const tip of FINGERS) {
    const [ax, ay] = at(ELBOW);
    const [bx, by] = at(tip);
    s.hairline(ax, ay, bx, by, C.wing[0]);
  }
  s.commit();
  s.begin();
  const [ex, ey] = at(ELBOW);
  const [tx, ty] = at(TIP);
  s.stroke(rx, ry, ex, ey, near ? 1 : 0.8, near ? C.slate[3] : C.slate[2]);
  s.stroke(ex, ey, tx, ty, 0.55, near ? C.slate[3] : C.slate[2]);
  s.shadeEdges(near ? C.slate[3] : C.slate[2], C.slate[4], C.slate[1]);
  s.set(ex, ey, near ? C.slateGlint : C.slate[3]);
  s.commit();
  if (!near) return;
  s.begin();
  const [vx, vy] = at([4, 1]);
  const [wx, wy] = at([14, 2]);
  s.taper(vx, vy, wx, wy, 0.5, 0.3, C.ivy[2], 0.8);
  s.shadeEdges(C.ivy[2], C.ivy[3], C.ivy[1]);
  for (const k of [6, 10, 13.5]) {
    const [lx, ly] = at([k, 2.8]);
    s.block(lx - 0.5, ly - 0.5, C.ivy[3], 1.5);
    s.set(lx - 0.5, ly - 0.5, C.ivy[4]);
  }
  s.commit();
}
