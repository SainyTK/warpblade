import type { SpriteCanvas } from "../../../../engine/sprite";
import { BLIGHT } from "../../colors";
import { HYPHA_TONES } from "./colors";
import type { HyphaPose, Pt } from "./pose";

const H = HYPHA_TONES.husk;
const B = HYPHA_TONES.bulb;
const T = HYPHA_TONES.thread;

export const bulbOf = (p: HyphaPose): Pt => {
  const len = Math.hypot(p.tip[0] - p.foot[0], p.tip[1] - p.foot[1]) || 1;
  return [p.tip[0] + ((p.tip[0] - p.foot[0]) / len) * 2.5, p.tip[1] + ((p.tip[1] - p.foot[1]) / len) * 2.5];
};

export function staff(s: SpriteCanvas, p: HyphaPose): void {
  const [fx, fy] = p.foot;
  const [tx, ty] = p.tip;
  const len = Math.hypot(tx - fx, ty - fy) || 1;
  const nx = -(ty - fy) / len;
  const ny = (tx - fx) / len;
  s.begin();
  let px = fx;
  let py = fy;
  for (let i = 1; i <= 5; i++) {
    const u = i / 5;
    const kink = i < 5 ? (i % 2 ? 0.9 : -0.7) : 0;
    const qx = fx + (tx - fx) * u + nx * kink;
    const qy = fy + (ty - fy) * u + ny * kink;
    s.stroke(px, py, qx, qy, 0.75, H[2]);
    px = qx;
    py = qy;
  }
  for (let i = 0; i < 3; i++) {
    const a = -1.2 + i * 1.2;
    const cx = tx + Math.cos(Math.atan2(ty - fy, tx - fx) + a) * 3.5;
    const cy = ty + Math.sin(Math.atan2(ty - fy, tx - fx) + a) * 3.5;
    s.taper(tx, ty, cx, cy, 0.6, 0.2, H[2], i - 1);
  }
  s.shadeEdges(H[2], H[4], H[1]);
  s.commit();
  s.begin();
  s.hairline(fx + nx * 0.5 + (tx - fx) * 0.3, fy + (ty - fy) * 0.3, fx + (tx - fx) * 0.45, fy + (ty - fy) * 0.45, T[3]);
  s.set(fx + (tx - fx) * 0.62 + nx, fy + (ty - fy) * 0.62 + ny, BLIGHT.fungus[3]);
  s.commit(false);
}

export function bulb(s: SpriteCanvas, p: HyphaPose, time: number): void {
  const [bx, by] = bulbOf(p);
  const pulse = Math.sin(time * 6) * 0.2 * p.bulb;
  const r = 2.2 + p.bulb * 0.9 + pulse;
  const lit = p.bulb > 0.5;
  s.begin();
  s.dot(bx, by, r, lit ? B[3] : B[2]);
  s.shadeEdges(lit ? B[3] : B[2], B[4], B[1]);
  s.commit();
  s.begin();
  s.dot(bx - r * 0.3, by - r * 0.3, r * 0.4, B[4]);
  s.set(bx - r * 0.4, by - r * 0.45, BLIGHT.eyeHot);
  s.set(bx + r * 0.5, by + r * 0.2, B[1]);
  s.commit(false);
}

export function frontArm(s: SpriteCanvas, p: HyphaPose): void {
  const sx = 3 + p.lean;
  const [hx, hy] = p.hand;
  const ex = (sx + hx) / 2 - 0.5;
  const ey = Math.max(-25, hy) + 3;
  s.begin();
  s.stroke(sx, -24.5, ex, ey, 1.1, T[2]);
  s.stroke(ex, ey, hx - 1, hy, 0.9, T[2]);
  s.shadeEdges(T[2], T[3], T[1]);
  s.commit();
  s.begin();
  s.dot(hx, hy, 1.3, HYPHA_TONES.bone[2]);
  s.shadeEdges(HYPHA_TONES.bone[2], HYPHA_TONES.bone[3], HYPHA_TONES.bone[1]);
  s.commit();
}
