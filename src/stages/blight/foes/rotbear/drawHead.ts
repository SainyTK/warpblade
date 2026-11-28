import type { SpriteCanvas } from "../../../../engine/sprite";
import { BEAR } from "./colors";
import type { BearPose, Pt } from "./pose";

const F = BEAR.fur;
const B = BEAR.bone;

function skull(s: SpriteCanvas, rot: (x: number, y: number) => Pt, gape: number): void {
  s.begin();
  s.poly([rot(2, 1.2), rot(9, 1.8 + gape * 0.4), rot(9.5, 2.6 + gape), rot(2.5, 4.6)], BEAR.maw);
  s.commit(false);
  s.begin();
  s.poly([rot(-0.5, -4), rot(4.5, -3.8), rot(9, -1.6), rot(9.8, 1.2), rot(2, 1.8), rot(-1, 0)], B[2]);
  s.poly([rot(2, 3 + gape * 0.3), rot(8.5, 2.2 + gape), rot(8.5, 3.6 + gape), rot(2.5, 5.2)], B[1]);
  s.shadeEdges(B[2], B[3], B[1]);
  s.commit();
}

function teeth(s: SpriteCanvas, rot: (x: number, y: number) => Pt, gape: number, glare: boolean): void {
  s.begin();
  for (let i = 0; i < 3; i++) {
    const [ux, uy] = rot(4.5 + i * 1.8, 2 + gape * 0.1 * i);
    const [lx, ly] = rot(4 + i * 1.7, 2.6 + gape * (0.35 + 0.2 * i));
    s.set(ux, uy, BEAR.tooth);
    s.set(lx, ly, BEAR.tooth);
  }
  const [fx, fy] = rot(9, 2.2 + gape * 0.6);
  s.block(fx, fy, BEAR.tooth, 0.5, 1.5);
  const [sx, sy] = rot(2.2, -1.6);
  s.block(sx - 1.2, sy - 1, BEAR.maw, 2.5, 2.5);
  s.block(sx - 0.5, sy - 0.5, glare ? BEAR.eyeHot : BEAR.eye, 1.5, 1);
  s.set(sx - 0.5, sy - 0.5, BEAR.eyeHot);
  const [ox, oy] = rot(8.8, -0.6);
  s.set(ox, oy, BEAR.maw);
  for (let i = 0; i < 3; i++) {
    const [cx, cy] = rot(3.5 + i * 2, -3.2 + i * 0.6);
    s.set(cx, cy, B[0]);
  }
  s.commit(false);
}

export function drawHead(s: SpriteCanvas, p: BearPose, time: number): void {
  const [hx, hy] = p.head;
  const c = Math.cos(p.tilt);
  const sn = Math.sin(p.tilt);
  const rot = (x: number, y: number): Pt => [hx + x * c - y * sn, hy + x * sn + y * c];
  const [nx, ny] = p.shoulder;
  s.begin();
  s.stroke(nx + 3, ny - 2, hx - 1, hy, 6, F[2]);
  s.dot(hx - 0.5, hy - 0.5, 5.8, F[2]);
  const [ex, ey] = rot(-3.5, -5.5);
  s.dot(ex, ey, 2.2, F[2]);
  s.shadeEdges(F[2], F[3], F[1], 2);
  s.set(ex, ey, F[0]);
  s.commit();
  const gape = p.jaw * 3;
  skull(s, rot, gape);
  teeth(s, rot, gape, p.glare);
  s.begin();
  const [mx, my] = rot(-1, -6.4);
  s.dot(mx, my, 1.3, BEAR.guard[2]);
  s.set(mx - 0.5, my - 1, BEAR.guard[4]);
  if (p.jaw > 0.7 && Math.sin(time * 30) > -0.3) {
    const [gx, gy] = rot(7, 2.4 + gape * 0.6);
    s.set(gx, gy, BEAR.glow[3]);
  }
  s.commit(false);
}
