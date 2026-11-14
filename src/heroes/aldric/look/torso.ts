import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawTorso } from "../../../rig";
import type { RigFrame } from "../../../types/rig";
import { atChest } from "../../../utils/poseFrame";

/** the shared plate over the tabard, with the gold sun of the dawn guard on the breastplate */
export function drawAldricTorso(s: SpriteCanvas, rig: RigFrame): void {
  drawTorso(s, rig.pose, rig.back);
  if (rig.back) return;
  const sun = atChest(rig.pose, 1.4);
  s.begin();
  s.dot(sun[0], sun[1], 0.8, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
