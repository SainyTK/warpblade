import type { SpriteCanvas } from "../../../../engine/sprite";
import { FORGE } from "../../colors";
import type { TitanPose } from "./pose";

type Pt = readonly [number, number];
const I = FORGE.iron;
const S = FORGE.steel;
const B = FORGE.brass;
const M = FORGE.molten;

export function drawArm(s: SpriteCanvas, p: TitanPose, near: boolean): void {
  const c = p.crouch;
  const shoulder: Pt = near ? [12, -48 + c] : [-12, -48 + c];
  const fist = near ? p.near : p.far;
  const elbow: Pt = [(shoulder[0] + fist[0]) / 2 + (near ? 3 : -3), (shoulder[1] + fist[1]) / 2 + 3];
  const tone = near ? I[2] : I[1];
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 3.2, tone);
  s.shadeEdges(tone, near ? I[3] : I[2], I[0], 2);
  s.commit();
  s.begin();
  s.stroke(elbow[0], elbow[1], fist[0], fist[1], 4.2, tone);
  s.shadeEdges(tone, near ? I[4] : I[3], I[0], 2);
  s.commit();
  s.begin();
  const bx = elbow[0] + (fist[0] - elbow[0]) * 0.55;
  const by = elbow[1] + (fist[1] - elbow[1]) * 0.55;
  s.dot(bx, by, 4.4, near ? S[2] : S[1]);
  s.shadeEdges(near ? S[2] : S[1], S[3], S[0], 2);
  s.commit();
  s.begin();
  s.dot(shoulder[0], shoulder[1], 5.2, near ? S[2] : S[1]);
  s.shadeEdges(near ? S[2] : S[1], S[4], S[0], 2);
  s.commit();
  s.begin();
  s.set(shoulder[0] - 2.5, shoulder[1] - 3, FORGE.steelGlint);
  s.set(bx - 2.5, by - 2, FORGE.steelGlint);
  for (const a of [0.6, 2.2, 3.8, 5.4]) s.set(bx + Math.cos(a) * 3.2, by + Math.sin(a) * 3.2, B[3]);
  s.commit(false);
  const [fx, fy] = fist;
  const knuckle = near ? I[3] : I[2];
  s.begin();
  s.poly(
    [
      [fx - 7, fy - 5],
      [fx - 5.5, fy - 6.5],
      [fx + 5.5, fy - 6.5],
      [fx + 7, fy - 5],
      [fx + 7.5, fy + 4],
      [fx + 6, fy + 5.5],
      [fx - 6, fy + 5.5],
      [fx - 7.5, fy + 4],
    ],
    knuckle,
  );
  s.shadeEdges(knuckle, I[4], I[0], 2);
  s.commit();
  s.begin();
  s.block(fx - 7, fy - 1.5, near ? B[2] : B[1], 14.5, 1.6);
  s.commit();
  s.begin();
  s.hairline(fx - 5.5, fy - 6.5, fx + 5.5, fy - 6.5, FORGE.ironGlint);
  s.hairline(fx - 7, fy - 5, fx - 7, fy + 3.5, I[4]);
  for (const x of [-4.5, -1.5, 1.5, 4.5]) {
    s.hairline(fx + x, fy + 0.5, fx + x, fy + 5, I[1]);
    s.set(fx + x, fy - 4, B[3]);
  }
  s.hairline(fx - 6, fy + 5.2, fx + 6, fy + 5.2, p.heat > 0.4 ? M[4] : M[2]);
  s.set(fx - 6.5, fy - 1.5, FORGE.brassGlint);
  s.commit(false);
}
