import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atNeck, headCenter } from "../../../utils/poseFrame";
import { skin } from "../skin";

/** the head on top of the spine, face or back of the head, then the scarf wrapped at the neck */
export function drawHead(s: SpriteCanvas, p: Pose, back: boolean): void {
  const [cx, cy] = headCenter(p);
  const map = { d: HC.hairDark, h: HC.hair, H: HC.hairLight, s: HC.skin, S: HC.skinShade, E: HC.eye, r: HC.scarfLight };
  s.begin();
  s.pixels(back ? skin.headBack : skin.head, map, Math.round(cx) - 5, Math.round(cy) - 5);
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
