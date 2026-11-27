import type { SpriteCanvas } from "../../../../engine/sprite";
import type { BodyAxis } from "./axis";
import { BEAR } from "./colors";
import type { BearPose } from "./pose";

const F = BEAR.fur;
const HIP_R = 8.5;
const SHOULDER_R = 10;

export function drawTorso(s: SpriteCanvas, p: BearPose, a: BodyAxis): void {
  const [hx, hy] = p.hip;
  const [sx, sy] = p.shoulder;
  const [qx, qy] = a.at(0.85, 4);
  s.begin();
  s.dot(hx, hy, HIP_R, F[2]);
  s.dot(sx, sy, SHOULDER_R, F[2]);
  s.stroke(hx, hy, sx, sy, 8.5, F[2]);
  s.dot(qx, qy, 7.5, F[2]);
  s.shadeEdges(F[2], F[3], F[1], 3);
  s.commit();
  s.begin();
  for (let i = 0; i < 9; i++) {
    const u = 0.05 + i * 0.11;
    const [bx, by] = a.at(u, -6.5 - (i % 2));
    s.hairline(bx, by, bx - a.n[0] * 2.5 + (i % 3) * 0.3, by - a.n[1] * 2.5, F[1]);
  }
  for (let i = 0; i < 6; i++) {
    const [tx, ty] = a.at(0.1 + i * 0.15, 3 + (i % 2) * 2);
    s.hairline(tx, ty, tx - a.d[0] * 2, ty - a.d[1] * 2 + 0.5, F[1]);
  }
  for (let i = 0; i < 7; i++) {
    const [rx, ry] = a.at(-0.1 + i * 0.13, i > 4 ? 13 : 9.2);
    s.set(rx, ry, i % 2 ? F[4] : BEAR.glow[1]);
  }
  s.commit(false);
}

export function drawChest(s: SpriteCanvas, p: BearPose, a: BodyAxis, time: number): void {
  const [cx, cy] = a.at(0.66, -3.2);
  const [bx, by] = a.at(0.5, -3.6);
  const pulse = 0.5 + Math.sin(time * (3 + p.sac * 9)) * 0.5;
  const r = 2.4 + p.sac * 1.2 + pulse * 0.4;
  const tone = p.sac > 0.5 ? BEAR.sac[4] : BEAR.sac[3];
  s.begin();
  s.dot(cx, cy, 4.6, BEAR.maw);
  s.dot(bx, by, 3.6, BEAR.maw);
  s.commit(false);
  s.begin();
  s.dot(cx - a.d[0] * 0.8, cy - a.d[1] * 0.8, r, tone);
  s.shadeEdges(tone, BEAR.sac[5], BEAR.sac[2]);
  s.set(cx - 1.5, cy - 1.2, BEAR.sac[5]);
  s.hairline(cx - r * 0.7, cy + 0.6, cx + r * 0.4, cy - 0.4, BEAR.vein[1]);
  s.hairline(cx - r * 0.2, cy - r * 0.6, cx + r * 0.1, cy + r * 0.5, BEAR.vein[1]);
  s.commit(false);
  s.begin();
  for (let i = 0; i < 3; i++) {
    const u = 0.46 + i * 0.13;
    const [x0, y0] = a.at(u, 0.6);
    const [x1, y1] = a.at(u + 0.05, -3.6);
    const [x2, y2] = a.at(u + 0.02, -7.2);
    s.hairline(x0, y0, x1, y1, BEAR.bone[2]);
    s.hairline(x1, y1, x2, y2, BEAR.bone[2]);
    s.set(x0, y0, BEAR.bone[3]);
  }
  s.commit(false);
}
