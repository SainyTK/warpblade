import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame } from "../../../../types/rig";
import { atNeck, headCenter } from "../../../../utils/poseFrame";
import { BRYNN_HEAD, BRYNN_HEAD_BACK } from "../head";

/** the head from its pixel rows, placed to the image pixel, over the jacket's raised collar */
export function drawBrynnHead(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const [a, b] = [atNeck(p, -3, 0.6), atNeck(p, 2.2, 0.6)];
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], 1.05, HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark);
  s.commit();
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
    v: HC.scarf,
    V: HC.scarfDark,
  };
  s.begin();
  s.pixels(rig.back ? BRYNN_HEAD_BACK : BRYNN_HEAD, map, snap(cx) - 7, snap(cy) - 6);
  s.commit();
}
