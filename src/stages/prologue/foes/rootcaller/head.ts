import type { SpriteCanvas } from "../../../../engine/sprite";
import { glowEye } from "../../../../game/enemies/day/paint";
import { WHITE } from "../../../../utils/color";
import { ROOTCALLER_COLORS as C } from "./colors";
import type { RootcallerPose } from "./pose";

const A = C.antler;

function antlers(s: SpriteCanvas, x: number, y: number): void {
  s.begin();
  s.taper(x - 1, y - 2, x - 6, y - 10, 0.9, 0.4, A[1], 1);
  s.taper(x - 4, y - 7, x - 9, y - 9, 0.6, 0.3, A[1]);
  s.taper(x - 5.5, y - 9, x - 5, y - 14, 0.6, 0.3, A[1]);
  s.taper(x + 1, y - 2.5, x + 3, y - 11, 0.9, 0.4, A[2], -1);
  s.taper(x + 2.2, y - 7, x + 6, y - 9.5, 0.6, 0.3, A[2]);
  s.taper(x + 3, y - 10, x + 1.5, y - 14, 0.5, 0.3, A[2]);
  s.shadeEdges(A[1], A[2], A[0]);
  s.shadeEdges(A[2], A[3], A[1]);
  s.set(x + 1.5, y - 14, A[3]);
  s.set(x - 5, y - 14, A[3]);
  s.commit();
  s.begin();
  s.dot(x - 5, y - 9.5, 0.9, C.leaf[3]);
  s.dot(x + 5.5, y - 9.5, 0.8, C.leaf[2]);
  s.set(x - 5.5, y - 10, C.leaf[4]);
  s.commit();
}

export function drawHead(s: SpriteCanvas, p: RootcallerPose, glare: boolean): void {
  const x = 2 + p.lean;
  const y = -32 + p.bob;
  antlers(s, x, y);
  s.begin();
  s.dot(x - 0.5, y, 3.4, C.bark[1]);
  s.shadeEdges(C.bark[1], C.bark[2], C.bark[0], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [x + 0.5, y - 3],
      [x + 4, y - 2.5],
      [x + 4.5, y + 1],
      [x + 3, y + 4.5],
      [x + 1, y + 2.5],
    ],
    C.mask[2],
  );
  s.shadeEdges(C.mask[2], C.mask[3], C.mask[0]);
  s.hairline(x + 2, y + 1.5, x + 3, y + 3.5, C.mask[0]);
  s.set(x + 1.5, y - 2.5, C.mask[3]);
  s.block(x + 2.5, y - 1, C.bark[0], 1.5, 1);
  glowEye(s, x + 3, y - 1, glare ? C.crackHot : C.crack, glare ? WHITE : C.eye);
  s.commit();
}
