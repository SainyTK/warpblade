import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame } from "../../../types/rig";
import { headCenter } from "../../../utils/poseFrame";

/** the head from its pixel rows, placed to the image pixel; the robe's collar sits at her neck, so no scarf is drawn */
export function drawSayaHead(s: SpriteCanvas, rig: RigFrame, rows: readonly string[]): void {
  const [cx, cy] = headCenter(rig.pose);
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
  s.pixels(rows, map, snap(cx) - 7, snap(cy) - 6);
  s.commit();
}
