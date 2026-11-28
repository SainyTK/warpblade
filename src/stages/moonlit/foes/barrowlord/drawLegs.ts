import type { SpriteCanvas } from "../../../../engine/sprite";
import { LORD_COLORS as L } from "./colors";
import type { LordPose } from "./pose";

const S = L.steel;
const D = L.dark;

function leg(s: SpriteCanvas, hipX: number, footX: number, c: number, near: boolean): void {
  const base = near ? S[2] : D[2];
  const light = near ? S[3] : D[3];
  const shade = near ? S[1] : D[1];
  const kneeX = (hipX + footX) / 2 + 1.2;
  const kneeY = -8 + c * 0.5;
  s.begin();
  s.taper(hipX, -15 + c, kneeX, kneeY, 2.6, 2.1, base);
  s.shadeEdges(base, light, shade, 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [kneeX - 2.2, kneeY + 1],
      [kneeX + 2.4, kneeY + 1],
      [footX + 2.2, -2.5],
      [footX - 2, -2.5],
    ],
    base,
  );
  s.shadeEdges(base, light, shade, 2);
  s.hairline(kneeX - 0.6, kneeY + 2, footX - 0.4, -3, light);
  s.commit();
  s.begin();
  s.poly(
    [
      [footX - 2.6, -3],
      [footX + 2.4, -3],
      [footX + 5.2, -0.6],
      [footX + 5, 0],
      [footX - 2.8, 0],
    ],
    base,
  );
  s.shadeEdges(base, light, shade);
  s.hairline(footX - 2, -2.2, footX + 3, -2.2, shade);
  s.commit();
  s.begin();
  s.dot(kneeX, kneeY, 2.2, near ? S[3] : D[3]);
  s.shadeEdges(near ? S[3] : D[3], near ? S[4] : S[2], shade);
  s.set(kneeX - 0.8, kneeY - 1, near ? S[5] : S[3]);
  s.commit();
}

export function drawLegs(s: SpriteCanvas, p: LordPose, near: boolean): void {
  const stride = p.step * 2.5;
  if (near) leg(s, 3 + p.lean * 0.3, 3.5 + stride, p.crouch, true);
  else leg(s, -3 + p.lean * 0.3, -3.5 - stride, p.crouch, false);
}
