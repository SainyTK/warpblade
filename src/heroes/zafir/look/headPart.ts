import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame } from "../../../types/rig";
import { atNeck, headCenter } from "../../../utils/poseFrame";

/** the head from its pixel rows, over a cream neck cloth tucked into the wrap */
export function drawZafirHead(s: SpriteCanvas, rig: RigFrame, rows: readonly string[]): void {
  const p = rig.pose;
  const [cx, cy] = headCenter(p);
  const snap = (v: number) => Math.round(v * s.res) / s.res;
  const [a, b] = [atNeck(p, -2.6, 0.4), atNeck(p, 2.4, 0.4)];
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], 1.05, HC.pants);
  s.shadeEdges(HC.pants, HC.pantsLight, HC.pantsDark);
  s.commit();
  const map = {
    D: HC.hairDeep,
    d: HC.hairDark,
    h: HC.hair,
    H: HC.hairLight,
    W: HC.hairGlint,
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
