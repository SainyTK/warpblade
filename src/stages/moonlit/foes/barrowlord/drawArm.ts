import type { SpriteCanvas } from "../../../../engine/sprite";
import { LORD_COLORS as L } from "./colors";
import type { LordPose } from "./pose";

const S = L.steel;
const D = L.dark;

export function drawArm(s: SpriteCanvas, p: LordPose, shoulderX: number, near: boolean): void {
  const [gx, gy] = p.grip;
  const sx = shoulderX + p.lean;
  const sy = -28 + p.crouch;
  const ex = (sx + gx) / 2 - 1;
  const ey = (sy + gy) / 2 + 2;
  const base = near ? S[2] : D[2];
  const light = near ? S[3] : D[3];
  const shade = near ? S[1] : D[1];
  s.begin();
  s.taper(sx, sy, ex, ey, 2, 1.8, base);
  s.taper(ex, ey, gx, gy, 1.8, 1.7, base);
  s.shadeEdges(base, light, shade, 2);
  s.commit();
  s.begin();
  s.dot(ex, ey, 1.8, near ? S[3] : D[3]);
  s.shadeEdges(near ? S[3] : D[3], near ? S[4] : S[2], shade);
  s.commit();
  s.begin();
  s.dot(gx, gy, 2.1, near ? S[3] : D[3]);
  s.shadeEdges(near ? S[3] : D[3], near ? S[4] : S[2], shade, 2);
  s.hairline(gx - 1.4, gy - 1, gx + 1.4, gy - 1, near ? S[5] : S[2]);
  s.hairline(gx - 1.2, gy + 0.6, gx + 1.2, gy + 0.6, shade);
  s.commit();
}
