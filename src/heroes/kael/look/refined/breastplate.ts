import { HERO_COLORS as C } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame } from "../../../../types/rig";
import { atChest, atHip, atNeck } from "../../../../utils/poseFrame";

export function drawKaelBreastplate(s: SpriteCanvas, { pose, back }: RigFrame): void {
  const collar = (x: number, y: number) => atNeck(pose, x, y);
  const chest = (x: number) => atChest(pose, x);
  const waist = (x: number, y: number) => atHip(pose, x, y);

  s.begin();
  s.poly([collar(-3.8, 0), collar(3.5, 0), chest(3.9), waist(3, 0.7), waist(-3.4, 0.7), chest(-4)], C.coat);
  s.shadeEdges(C.coat, C.coatLight, C.coatDeep, 2);
  s.commit();

  s.begin();
  if (back) {
    s.poly([collar(-2.8, 0), collar(2.7, 0), chest(1.9), waist(0, -2.3), chest(-2.3)], C.coatDark);
    s.shadeEdges(C.coatDark, C.coatLight, C.coatDeep);
    s.stroke(...collar(-0.6, 1), ...waist(-0.6, -1), 0.23, C.coatDeep);
  } else {
    s.poly([collar(-1.2, 0.5), collar(3.1, 0.4), chest(3), waist(2.5, -1), waist(0.1, -0.7), chest(-0.6)], C.steelDark);
    s.poly([collar(-0.4, 1.1), collar(2.7, 0.8), chest(2.8), chest(0.4)], C.steel);
    s.stroke(...collar(0, 1.2), ...collar(2.5, 0.9), 0.35, C.steelLight);
    s.stroke(...chest(0.3), ...waist(0.8, -1.7), 0.25, C.steel);
  }
  s.commit(false);

  s.begin();
  s.stroke(...collar(-3.3, 0.1), ...chest(-1.7), 0.34, C.trim);
  s.stroke(...chest(-1.7), ...waist(-2.5, -1.1), 0.26, C.trimDark);
  s.stroke(...waist(-3, -1), ...waist(2.8, -1.1), 0.68, C.glove);
  s.shadeEdges(C.glove, C.gloveLight, C.hilt);
  s.poly([waist(0, -1.8), waist(1.9, -1.8), waist(1.6, -0.4), waist(0.3, -0.4)], C.trim);
  s.set(...waist(0.8, -1.5), C.trimLight);
  s.commit(false);
}
