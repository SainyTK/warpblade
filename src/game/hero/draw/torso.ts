import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";
import { skin } from "../skin";
import { drawBareChest } from "./bareChest";
import type { Vec } from "./reach";

/**
 * The torso along the spine, bent at the chest and lit from the top left, with a fold down the back of the coat.
 * From the front: an open coat over a breastplate with a trim edge. From the back: the coat's seam.
 * Both ways a belt with a buckle.
 */
export function drawTorso(s: SpriteCanvas, p: Pose, back: boolean): void {
  if (skin.bareChest) return drawBareChest(s, p, back);
  /** a line down the torso from the neck, through the chest, to the hip */
  const spineLine = (dxNeck: number, dyNeck: number, dxHip: number, dyHip: number, r: number, c: number) => {
    const points: Vec[] = [atNeck(p, dxNeck, dyNeck), atChest(p, (dxNeck + dxHip) / 2), atHip(p, dxHip, dyHip)];
    for (let i = 1; i < points.length; i++)
      s.stroke(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1], r, c);
  };
  s.begin();
  s.poly(
    [atNeck(p, -3.6, 0), atNeck(p, 3.1, 0), atChest(p, 3.1), atHip(p, 3.1, 0.5), atHip(p, -3.6, 0.5), atChest(p, -3.6)],
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  s.begin();
  spineLine(-1.6, 1.4, -2, -1.5, 0.25, HC.coatDark);
  s.commit(false);
  if (back) {
    s.begin();
    spineLine(-0.3, 1, -0.3, -1, 0.3, HC.coatDeep);
    s.commit();
  } else {
    s.begin();
    s.poly(
      [atNeck(p, -0.2, 0.6), atNeck(p, 2.7, 0.6), atChest(p, 2.8), atHip(p, 2.6, -1.2), atHip(p, 0.4, -1.2)],
      HC.steel,
    );
    s.shadeEdges(HC.steel, HC.steelLight, HC.steelDark, 2);
    const glint = atNeck(p, 0.9, 1.8);
    s.set(glint[0], glint[1], HC.steelGlint);
    s.set(glint[0] + 0.5, glint[1], HC.steelGlint);
    s.commit();
    s.begin();
    spineLine(-0.3, 0.6, 0.2, -1, 0.35, HC.trim);
    s.commit();
  }
  const [l, r] = [atHip(p, -3.2, -1), atHip(p, 2.9, -1)];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 0.6, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  const buckle = atHip(p, back ? -0.6 : 1, -1.3);
  s.begin();
  s.dot(buckle[0], buckle[1], 0.7, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
