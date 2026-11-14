import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigExtra, RigFrame } from "../../../types/rig";
import { headCenter } from "../../../utils/poseFrame";

/** the goggles pushed up on the hair: a strap round the head and two brass-rimmed lenses lit green over the brow */
function drawGoggles(s: SpriteCanvas, rig: RigFrame): void {
  const [cx, cy] = headCenter(rig.pose);
  s.begin();
  if (rig.back) s.stroke(cx - 5.2, cy - 2.4, cx + 5.4, cy - 2.6, 0.45, HC.hilt);
  else s.stroke(cx - 5.4, cy - 2.2, cx + 0.2, cy - 3.6, 0.45, HC.hilt);
  s.commit(false);
  if (rig.back) return;
  for (const [x, y, r] of [
    [cx + 0.9, cy - 3.9, 1.05],
    [cx + 3.2, cy - 3.6, 1.15],
  ] as const) {
    s.begin();
    s.dot(x, y, r, HC.trim);
    s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
    s.commit();
    s.begin();
    s.dot(x, y, r - 0.5, HC.iris);
    s.set(x - 0.25, y - 0.25, HC.eyeWhite);
    s.commit(false);
  }
}

/** Calder's goggles, over his head and under his sword arm */
export const GOGGLES: RigExtra = { layer: "overHead", draw: drawGoggles };
