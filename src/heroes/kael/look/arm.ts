import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawArm } from "../../../rig";
import type { Vec } from "../../../types/rig";

/** the shared arm, and on the arm in front a crystal set in the pauldron */
export function drawKaelArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  drawArm(s, shoulder, elbow, hand, front);
  if (!front) return;
  s.begin();
  s.dot(shoulder[0] + 0.2, shoulder[1] + 0.1, 0.45, HC.blade);
  s.set(shoulder[0], shoulder[1] - 0.15, HC.bladeEdge);
  s.commit(false);
}
