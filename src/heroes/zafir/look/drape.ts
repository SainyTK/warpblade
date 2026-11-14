import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame } from "../../../types/rig";
import { atNeck } from "../../../utils/poseFrame";

/**
 * A short saffron shoulder drape over the far shoulder, hanging down the back with a gold edge: the one asymmetric layer
 * that breaks his silhouette. With his back turned it lies over the near side.
 */
export function drawShoulderDrape(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const side = rig.back ? 1 : -1;
  const top = atNeck(p, side * 2.2, 0.6);
  const out = atNeck(p, side * 4.6, 2.2);
  const low = atNeck(p, side * 4.2 - 1.4 - rig.flare * 0.4, 7.2);
  const inner = atNeck(p, side * 1.2 - 0.6, 5.4);
  s.begin();
  s.poly([top, out, low, inner], HC.coatDark);
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  s.begin();
  s.stroke(out[0], out[1], low[0], low[1], 0.35, HC.trim);
  s.commit();
}
