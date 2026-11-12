import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atHip } from "../../../utils/poseFrame";

/** the pelt's ragged lower edge behind the hips, from the side to the back: [across the waist, down from the hip] */
const RAGS: readonly [number, number][] = [
  [0.6, 3.2],
  [-0.6, 5],
  [-1.8, 3.8],
  [-2.9, 5.6],
  [-4.1, 4.2],
];

/**
 * A wolf pelt hung from the back of the belt in place of coat tails: short, dark fur with a ragged lower edge that
 * flies back with speed, its tips lit, so the legs stay clear.
 */
export function drawFurTails(s: SpriteCanvas, p: Pose, flare: number): void {
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  const rags = RAGS.map(([x, y], i) => at(x - flare * (0.2 + i * 0.25), y - flare * 0.3));
  s.begin();
  s.poly([at(1.2, -2), at(-3.8, -2), at(-4.4 - flare, 2), ...[...rags].reverse()], HC.coatDark);
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  s.begin();
  rags.forEach(([x, y], i) => {
    if (i % 2 === 1) s.set(x, y - 0.6, HC.coatLight);
  });
  s.commit(false);
}
