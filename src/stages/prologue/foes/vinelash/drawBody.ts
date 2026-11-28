import type { SpriteCanvas } from "../../../../engine/sprite";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";

type Pt = readonly [number, number];

const K = DC.bark;
const B = DC.bramble;
const MASS: readonly (readonly [number, number, number])[] = [
  [-6, -9, 4.6],
  [-2, -12, 6.2],
  [3, -14, 5.6],
  [5, -9, 4.4],
];
const STRANDS: readonly (readonly [Pt, Pt, Pt])[] = [
  [
    [-9, -12],
    [-4, -18],
    [5, -18],
  ],
  [
    [-8, -6],
    [-2, -10],
    [3, -6],
  ],
  [
    [-5, -16],
    [0, -9],
    [7, -12],
  ],
  [
    [1, -19],
    [7, -15],
    [8, -7],
  ],
];
const LEAVES: readonly Pt[] = [
  [-8.5, -13],
  [-3, -18.5],
  [6, -17],
  [-6, -6.5],
  [7.5, -10],
];
const THORNS: readonly (readonly [number, number, number, number])[] = [
  [-7, -15, -1, -1],
  [-1, -18.5, 0, -1],
  [4, -18.5, 1, -1],
  [-10, -10, -1, 0],
];
const CRACK: readonly Pt[] = [
  [-3, -14],
  [-2.2, -12.4],
  [-2.8, -11],
  [-1.8, -9.6],
];

const lean = (y: number, hunch: number): number => (y < -6 ? hunch * ((-6 - y) / 12) : 0);

function strand(s: SpriteCanvas, a: Pt, m: Pt, b: Pt, hunch: number): void {
  const steps = 8;
  let px = a[0] + lean(a[1], hunch);
  let py = a[1];
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    const v = 1 - u;
    const x = v * v * a[0] + 2 * v * u * m[0] + u * u * b[0];
    const y = v * v * a[1] + 2 * v * u * m[1] + u * u * b[1];
    s.stroke(px, py, x + lean(y, hunch), y, 0.7, K[2]);
    px = x + lean(y, hunch);
    py = y;
  }
}

export function knot(s: SpriteCanvas, hunch: number, breath: number, hot: boolean): void {
  s.begin();
  for (const [x, y, r] of MASS) s.dot(x + lean(y, hunch), y, r + breath, B[1]);
  s.shadeEdges(B[1], B[2], B[0], 3);
  for (let y = -19; y <= -5; y += 1.5)
    for (let x = -10; x <= 9; x += 1.5) {
      if (grain(x, y) < 0.66) continue;
      if (!MASS.some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) < r - 1.3)) continue;
      s.hairline(x + lean(y, hunch), y, x + 1.2 + lean(y, hunch), y + 0.8, DC.leafDeep);
    }
  s.set(-4 + lean(-17, hunch), -17.5, DC.brambleLit);
  s.set(-3.5 + lean(-17, hunch), -17.5, DC.leaf[4]);
  s.commit();
  s.begin();
  for (let i = 1; i < CRACK.length; i++) {
    const [ax, ay] = CRACK[i - 1];
    const [bx, by] = CRACK[i];
    s.stroke(ax + lean(ay, hunch), ay, bx + lean(by, hunch), by, 0.55, DC.crack);
  }
  for (const [x, y] of CRACK.slice(1, -1)) s.set(x + lean(y, hunch), y, hot ? WHITE : DC.crackHot);
  s.commit();
  s.begin();
  for (const [a, m, b] of STRANDS) strand(s, a, m, b, hunch);
  s.shadeEdges(K[2], K[4], K[1]);
  for (const [x, y, dx, dy] of THORNS) {
    const lx = x + lean(y, hunch);
    s.set(lx + dx * 0.5, y + dy * 0.5, DC.thorn);
    s.set(lx + dx, y + dy, DC.thornTip);
  }
  s.commit();
  s.begin();
  for (const [x, y] of LEAVES) {
    const lx = x + lean(y, hunch);
    s.block(lx - 0.5, y - 0.5, B[3], 1.5);
    s.set(lx - 0.5, y - 0.5, DC.brambleLit);
    s.set(lx + 0.5, y + 0.5, B[2]);
  }
  s.commit();
}

export function neck(s: SpriteCanvas, hunch: number, from: Pt, to: Pt): void {
  s.begin();
  s.taper(from[0] + hunch * 0.8, from[1], to[0], to[1], 1.6, 1.1, B[1], -0.8);
  s.shadeEdges(B[1], B[2], B[0]);
  s.commit();
}
