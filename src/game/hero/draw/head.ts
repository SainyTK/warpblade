import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atNeck, headCenter } from "../../../utils/poseFrame";
import { skin } from "../skin";

/** the head on top of the spine, face or back of the head (or a hood) placed to the image pixel, then the scarf and its knot */
export function drawHead(s: SpriteCanvas, p: Pose, back: boolean): void {
  const [cx, cy] = headCenter(p);
  const snap = (v: number) => Math.round(v * s.res) / s.res;
  const map = {
    D: HC.hairDeep,
    d: HC.hairDark,
    h: HC.hair,
    H: HC.hairLight,
    W: HC.hairGlint,
    r: HC.scarfLight,
    L: HC.skinLight,
    s: HC.skin,
    S: HC.skinShade,
    m: HC.skinDeep,
    w: HC.eyeWhite,
    I: HC.iris,
    P: HC.pupil,
    K: HC.coatDeep,
    k: HC.coatDark,
    c: HC.coat,
    C: HC.coatLight,
    v: HC.scarf,
    V: HC.scarfDark,
  };
  s.begin();
  s.pixels(back ? skin.headBack : skin.head, map, snap(cx) - 7, snap(cy) - 6);
  s.commit();
  const [a, b] = [atNeck(p, -2.7, 0.4), atNeck(p, 2.5, 0.4)];
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], 1, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  if (back) return;
  const knot = atNeck(p, 0.4, -0.4);
  s.begin();
  s.dot(knot[0], knot[1], 0.75, HC.scarfLight);
  s.commit();
}
