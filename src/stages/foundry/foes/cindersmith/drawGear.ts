import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import type { Pt, SmithPose } from "./pose";

const I = FORGE.plate;
const M = FORGE.molten;
const B = FORGE.brass;
const W = FORGE.wood;
const L = FORGE.leather;

export function drawHammer(s: SpriteCanvas, p: SmithPose): void {
  const [hx, hy] = p.hand;
  const [kx, ky] = p.head;
  const len = Math.hypot(kx - hx, ky - hy) || 1;
  const dx = (kx - hx) / len;
  const dy = (ky - hy) / len;
  s.begin();
  s.stroke(hx - dx * 5, hy - dy * 5, kx, ky, 1.2, W[1]);
  s.shadeEdges(W[1], W[2], W[0]);
  s.commit();
  s.begin();
  s.dot(hx - dx * 5.5, hy - dy * 5.5, 1.5, B[2]);
  s.shadeEdges(B[2], B[3], B[0]);
  s.commit();
  const nx = -dy;
  const ny = dx;
  const at = (a: number, b: number): Pt => [kx + dx * a + nx * b, ky + dy * a + ny * b];
  s.begin();
  s.poly(
    [at(-4.5, -7.5), at(4.5, -7.5), at(5, -6.5), at(5, 6.5), at(4.5, 7.5), at(-4.5, 7.5), at(-5, 6.5), at(-5, -6.5)],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0], 2);
  s.commit();
  s.begin();
  const band = (a: number, c: number): void => {
    const [ax, ay] = at(a, -7.2);
    const [bx, by] = at(a, 7.2);
    s.hairline(ax, ay, bx, by, c);
  };
  band(-2.5, B[2]);
  band(2.5, B[2]);
  const face = p.heat > 0.15 ? M[Math.min(5, 2 + Math.floor(p.heat * 3.5))] : I[3];
  for (let v = 6.6; v <= 7.6; v += 0.5) {
    const [ax, ay] = at(-4.2, v);
    const [bx, by] = at(4.2, v);
    s.hairline(ax, ay, bx, by, v > 7 ? face : p.heat > 0.15 ? M[2] : I[3]);
  }
  const [gx, gy] = at(-4, -6.8);
  s.set(gx, gy, FORGE.ironGlint);
  s.commit(false);
}

export function drawBellows(s: SpriteCanvas, p: SmithPose, c: number): void {
  const open = 3 + p.bellows * 5;
  const top = -60 + c;
  const x0 = -17 + p.lean * 0.3;
  s.begin();
  s.poly(
    [
      [x0, top],
      [x0 - 3, top - 1],
      [x0 - 3 - open, top + 6],
      [x0 - 3 - open, top + 18],
      [x0 - 3, top + 24],
      [x0, top + 23],
    ],
    L[1],
  );
  s.shadeEdges(L[1], L[2], L[0]);
  s.commit();
  s.begin();
  const folds = 4;
  for (let i = 1; i <= folds; i++) {
    const u = i / (folds + 1);
    s.hairline(x0 - 3 - open * u, top + 3 + u * 2, x0 - 3 - open * u, top + 21 - u * 2, i % 2 ? L[0] : L[2]);
  }
  s.commit(false);
  s.begin();
  s.poly(
    [
      [x0 - 4 - open, top + 4],
      [x0 - 2 - open, top + 4],
      [x0 - 2 - open, top + 20],
      [x0 - 4 - open, top + 20],
    ],
    W[1],
  );
  s.shadeEdges(W[1], W[2], W[0]);
  s.commit();
  s.begin();
  s.stroke(x0 - 1, top - 2, x0 + 4, top - 9, 1.1, I[2]);
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
}

export function drawHelm(s: SpriteCanvas, p: SmithPose, c: number): void {
  const x = 9 + p.lean;
  const y = -63 + c;
  s.begin();
  s.stroke(x - 6, y - 7, x - 6, y - 14, 1.6, I[2]);
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
  s.begin();
  s.block(x - 7.8, y - 15.5, I[3], 3.6, 1.2);
  s.commit();
  s.begin();
  s.poly(
    [
      [x - 6, y - 6],
      [x - 3, y - 9.5],
      [x + 2, y - 10],
      [x + 5.5, y - 7],
      [x + 6.5, y + 1],
      [x + 5.5, y + 6],
      [x - 6, y + 6],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0], 2);
  s.commit();
  s.begin();
  s.hairline(x - 5, y - 2, x + 6, y - 2, B[2]);
  s.set(x - 2, y - 8.5, FORGE.ironGlint);
  s.set(x - 1.5, y - 8.5, FORGE.ironGlint);
  const glow = p.mouth;
  const slit = glow > 0.8 ? M[5] : glow > 0.5 ? M[4] : M[3];
  for (const [row, w] of [
    [y + 0.5, 4],
    [y + 2.5, 5],
    [y + 4.5, 4.5],
  ] as const) {
    s.block(x + 6.5 - w, row, M[2], w, 1);
    s.hairline(x + 7 - w, row + 0.25, x + 6, row + 0.25, slit);
  }
  s.block(x + 1, y - 5.5, M[3], 3.5, 1.2);
  s.set(x + 3.5, y - 5.5, glow > 0.7 ? WHITE : FORGE.eye);
  s.set(x + 1.5, y - 5.5, FORGE.eye);
  s.commit(false);
}
