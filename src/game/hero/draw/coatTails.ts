import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atHip } from "../../../utils/poseFrame";

/** the coat below the belt, hanging down the line of the spine and flaring back with speed, with two folds and a trim hem */
export function drawCoatTails(s: SpriteCanvas, p: Pose, flare: number): void {
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  const fl = flare;
  s.begin();
  s.poly([at(-3.6, -2), at(3.1, -2), at(3.6 + fl * 0.2, 7.2), at(-4.8 - fl, 8.8 - fl * 0.4)], HC.coatDark);
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  s.begin();
  const folds: [number, number, number, number][] = [
    [-1.5, -1, -2.6 - fl * 0.7, 7.6 - fl * 0.4],
    [1.2, -1, 1 - fl * 0.3, 7.2 - fl * 0.2],
  ];
  for (const [x0, y0, x1, y1] of folds) {
    const [a, b] = [at(x0, y0), at(x1, y1)];
    s.stroke(a[0], a[1], b[0], b[1], 0.3, HC.coatDeep);
    s.stroke(a[0] - 0.5, a[1], b[0] - 0.5, b[1], 0.25, HC.coat);
  }
  s.commit(false);
  const [c, d] = [at(3.6 + fl * 0.2, 7.5), at(-4.8 - fl, 9 - fl * 0.4)];
  s.begin();
  s.stroke(c[0], c[1], d[0], d[1], 0.45, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
