import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Pose } from "../../../types/pose";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";
import type { Vec } from "./reach";

/**
 * The torso along the spine, bent at the chest and lit from the top left. From the front: open coat with a brass edge,
 * dark shirt and belt. From the back: the coat's seam down the middle and the belt across.
 */
export function drawTorso(s: SpriteCanvas, p: Pose, back: boolean): void {
  const segment = (a: Vec, b: Vec, r: number, c: Color) => s.stroke(a[0], a[1], b[0], b[1], r, c);
  /** a line down the torso from the neck, through the chest, to the hip */
  const spineLine = (dxNeck: number, dyNeck: number, dxHip: number, dyHip: number, r: number, c: Color) => {
    const chest = atChest(p, (dxNeck + dxHip) / 2);
    segment(atNeck(p, dxNeck, dyNeck), chest, r, c);
    segment(chest, atHip(p, dxHip, dyHip), r, c);
  };
  s.begin();
  s.poly(
    [atNeck(p, -3.5, 0), atNeck(p, 3, 0), atChest(p, 3), atHip(p, 3, 0.5), atHip(p, -3.5, 0.5), atChest(p, -3.5)],
    HC.coat,
  );
  spineLine(-2.6, 0.8, -2.8, -1.5, 0.5, HC.coatLight);
  if (back) {
    spineLine(-0.2, 1.2, -0.2, -1.5, 0.5, HC.coatDark);
    segment(atNeck(p, -2, 0.6), atNeck(p, 2, 0.6), 0.6, HC.coatDark);
  } else {
    segment(atNeck(p, -1.5, 0.6), atNeck(p, 1, 0.6), 0.5, HC.coatLight);
    spineLine(1.6, 1.2, 1.9, -1.5, 0.6, HC.shirt);
    spineLine(0.4, 1, 0.6, -0.5, 0.5, HC.trim);
  }
  segment(atHip(p, -3, -1), atHip(p, 2.6, -1), 0.55, HC.glove);
  const buckle = atHip(p, back ? -0.5 : 1, -1.5);
  s.set(buckle[0], buckle[1], HC.trim);
  s.commit();
}
