import type { SpriteCanvas } from "../../../../engine/sprite";
import type { BodyAxis } from "./axis";
import { BEAR } from "./colors";
import type { BearPose, Pt } from "./pose";

const SH = BEAR.shelf;
const SHELVES: readonly (readonly [u: number, out: number, size: number])[] = [
  [0.02, 7, 3.2],
  [0.35, 8, 4],
  [0.7, 11, 4.8],
  [1.02, 10, 3.6],
];

function shelf(s: SpriteCanvas, a: BodyAxis, u: number, out: number, size: number): void {
  const [x, y] = a.at(u, out);
  const [dx, dy] = a.d;
  const [nx, ny] = a.n;
  const pts: Pt[] = [
    [x - dx * size, y - dy * size],
    [x - dx * size * 0.75 + nx * size * 0.45, y - dy * size * 0.75 + ny * size * 0.45],
    [x + nx * size * 0.6, y + ny * size * 0.6],
    [x + dx * size * 0.8 + nx * size * 0.4, y + dy * size * 0.8 + ny * size * 0.4],
    [x + dx * size * 1.05, y + dy * size * 1.05],
  ];
  s.poly(pts, SH[2]);
}

export function drawShelves(s: SpriteCanvas, a: BodyAxis): void {
  s.begin();
  for (const [u, out, size] of SHELVES) shelf(s, a, u, out, size);
  s.shadeEdges(SH[2], SH[3], SH[1], 2);
  s.commit();
  s.begin();
  for (const [u, out, size] of SHELVES) {
    const [x, y] = a.at(u, out);
    s.hairline(x - a.d[0] * size * 0.9, y - a.d[1] * size * 0.9, x + a.d[0] * size, y + a.d[1] * size, SH[0]);
    const [tx, ty] = a.at(u, out + size * 0.55);
    s.set(tx, ty, SH[3]);
    s.set(tx + a.d[0] * 1.5, ty + a.d[1] * 1.5, BEAR.glow[2]);
  }
  s.commit(false);
}

export function drawStalks(s: SpriteCanvas, p: BearPose, a: BodyAxis, time: number): void {
  const lit = p.stalks > 0.6;
  s.begin();
  for (let i = 0; i < 4; i++) {
    const [bx, by] = a.at(0.5 + i * 0.13, 9 + (i % 2));
    const len = 6 + (i % 3) * 2.2;
    const sway = Math.sin(time * 2.4 + i * 1.3) * 1.1;
    const tx = bx + a.n[0] * len + a.d[0] * (sway - 1);
    const ty = by + a.n[1] * len + a.d[1] * (sway - 1);
    s.hairline(bx, by, tx, ty, BEAR.stalk[3]);
    s.dot(tx, ty, 1.1, lit ? BEAR.glow[3] : BEAR.glow[2]);
    s.set(tx - 0.5, ty - 0.5, lit ? BEAR.glow[4] : BEAR.glow[3]);
  }
  s.commit(false);
}
