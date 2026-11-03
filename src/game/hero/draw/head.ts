import { HEAD, HEAD_BACK, HEAD_MAP } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atNeck, headCenter } from "../../../utils/poseFrame";

/** the head on top of the spine, face or back of the head, then the scarf wrapped at the neck */
export function drawHead(s: SpriteCanvas, p: Pose, back: boolean): void {
  const [cx, cy] = headCenter(p);
  s.begin();
  s.pixels(back ? HEAD_BACK : HEAD, HEAD_MAP, Math.round(cx) - 5, Math.round(cy) - 5);
  s.commit();
  const a = atNeck(p, -2.6, 0.4);
  const b = atNeck(p, 2.4, 0.4);
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], 0.9, HC.scarf);
  if (!back) {
    const knot = atNeck(p, 0, -0.6);
    s.set(knot[0], knot[1], HC.scarfLight);
    s.set(knot[0] + 1, knot[1], HC.scarfLight);
  }
  s.commit();
}
