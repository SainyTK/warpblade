import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame } from "../../../../types/rig";
import { atHip } from "../../../../utils/poseFrame";

/** under the cropped jacket there are no coat tails: a leather pouch hangs at the back of her belt */
export function drawBrynnPouch(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const [a, b] = [atHip(p, -3.4, -0.4), atHip(p, -3.6, 2.2)];
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], 1.2, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  const flap = atHip(p, -3.2, 0);
  s.begin();
  s.dot(flap[0], flap[1], 0.45, HC.trim);
  s.commit();
}
