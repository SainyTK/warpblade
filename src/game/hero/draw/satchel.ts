import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atHip } from "../../../utils/poseFrame";

/** the candle tips standing out of the satchel: across the waist, how high above its mouth, and their lean */
const CANDLES: readonly (readonly [number, number, number])[] = [
  [1.6, 1.9, -0.25],
  [2.6, 2.5, 0],
  [3.5, 1.6, 0.3],
];

/**
 * A leather satchel hung from the belt at the front of the hip, its flap shut over the mouth with a wax-pale clasp,
 * and three candle tips of pale wax with dark wicks standing out of it.
 */
export function drawSatchel(s: SpriteCanvas, p: Pose): void {
  s.begin();
  for (const [dx, tall, lean] of CANDLES) {
    const [a, b] = [atHip(p, dx, 0.6), atHip(p, dx + lean, 0.6 - tall)];
    s.stroke(a[0], a[1], b[0], b[1], 0.32, HC.trim);
  }
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
  s.begin();
  for (const [dx, tall, lean] of CANDLES) {
    const wick = atHip(p, dx + lean * 1.2, 0.1 - tall);
    s.set(wick[0], wick[1], HC.bootDark);
  }
  s.commit(false);
  s.begin();
  s.poly(
    [atHip(p, 0.9, 0.4), atHip(p, 4.3, 0.4), atHip(p, 4.6, 4.1), atHip(p, 3.6, 4.9), atHip(p, 1.2, 4.5)],
    HC.glove,
  );
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt, 2);
  s.commit();
  s.begin();
  s.poly([atHip(p, 0.8, 0.2), atHip(p, 4.4, 0.2), atHip(p, 4.2, 1.9), atHip(p, 1, 1.9)], HC.gloveLight);
  s.shadeEdges(HC.gloveLight, HC.gloveLight, HC.glove);
  s.commit();
  const clasp = atHip(p, 2.7, 2);
  s.begin();
  s.dot(clasp[0], clasp[1], 0.45, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
