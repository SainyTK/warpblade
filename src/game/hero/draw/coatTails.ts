import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { clamp } from "../../../utils/math";
import { atHip } from "../../../utils/poseFrame";
import { skin } from "../skin";
import { CLOAK_CLEAR, CLOAK_DROP, drawCloakLining, drawHemDrips } from "./cloak";

/** pixels the coat tails hang below the hip at the back */
const TAILS = 8.8;

/** how much further a cloak hangs, shortened as the hips sink so its hem never reaches the floor */
const cloakDrop = (p: Pose): number => (skin.cloak ? clamp(-p.hy - TAILS - CLOAK_CLEAR, 0, CLOAK_DROP) : 0);

/**
 * The coat below the belt, hanging down the line of the spine and flaring back with speed, with two folds and a trim
 * hem. A cloak hangs longer, its lining showing along the back edge and drips of wax along the hem.
 */
export function drawCoatTails(s: SpriteCanvas, p: Pose, flare: number): void {
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  const fl = flare;
  const drop = cloakDrop(p);
  const hem = TAILS + drop;
  s.begin();
  s.poly([at(-3.6, -2), at(3.1, -2), at(3.6 + fl * 0.2, 7.2 + drop), at(-4.8 - fl, hem - fl * 0.4)], HC.coatDark);
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  if (skin.cloak) drawCloakLining(s, at, fl, hem);
  s.begin();
  const folds: [number, number, number, number][] = [
    [-1.5, -1, -2.6 - fl * 0.7, 7.6 + drop - fl * 0.4],
    [1.2, -1, 1 - fl * 0.3, 7.2 + drop - fl * 0.2],
  ];
  for (const [x0, y0, x1, y1] of folds) {
    const [a, b] = [at(x0, y0), at(x1, y1)];
    s.stroke(a[0], a[1], b[0], b[1], 0.3, HC.coatDeep);
    s.stroke(a[0] - 0.5, a[1], b[0] - 0.5, b[1], 0.25, HC.coat);
  }
  s.commit(false);
  const [c, d] = [at(3.6 + fl * 0.2, 7.5 + drop), at(-4.8 - fl, hem + 0.2 - fl * 0.4)];
  s.begin();
  s.stroke(c[0], c[1], d[0], d[1], 0.45, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
  if (skin.cloak) drawHemDrips(s, c, d);
}
