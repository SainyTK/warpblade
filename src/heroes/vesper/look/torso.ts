import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";

/**
 * Vesper's torso: a fitted plum top with a high collar, a thin silver-grey strap crossing the chest from the near shoulder to
 * the far hip with a silver buckle, and a violet sash at the waist tied at the near hip. From the back: the seam and the strap.
 */
export function drawVesperTorso(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  s.begin();
  s.poly(
    [atNeck(p, -3.3, 0), atNeck(p, 2.9, 0), atChest(p, 2.9), atHip(p, 2.8, 0.5), atHip(p, -3.3, 0.5), atChest(p, -3.4)],
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  // the high collar
  s.begin();
  const [c0, c1] = [atNeck(p, -2.6, 0.2), atNeck(p, 2.2, 0.2)];
  s.stroke(c0[0], c0[1], c1[0], c1[1], 0.75, HC.coatDark);
  s.shadeEdges(HC.coatDark, HC.coatLight, HC.coatDeep);
  s.commit();
  const strapFrom: Vec = rig.back ? atNeck(p, -2.4, 1.2) : atNeck(p, 2, 1.2);
  const strapTo: Vec = rig.back ? atHip(p, 2.4, -1.8) : atHip(p, -2.8, -1.8);
  s.begin();
  s.stroke(strapFrom[0], strapFrom[1], strapTo[0], strapTo[1], 0.4, HC.trimDark);
  s.shadeEdges(HC.trimDark, HC.trim, HC.coatDeep);
  s.commit();
  if (!rig.back) {
    const buckle = atChest(p, 0.2);
    s.begin();
    s.dot(buckle[0], buckle[1], 0.65, HC.trim);
    s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
    s.commit();
  } else {
    s.begin();
    const [a, b] = [atNeck(p, -0.3, 1), atHip(p, -0.3, -1)];
    s.stroke(a[0], a[1], b[0], b[1], 0.3, HC.coatDeep);
    s.commit();
  }
  // the sash, and its knot at the near hip
  const [l, r] = [atHip(p, -3.3, -1), atHip(p, 3, -1)];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 0.75, HC.scarfDark);
  s.shadeEdges(HC.scarfDark, HC.scarf, HC.coatDeep);
  s.commit();
  const knot = atHip(p, rig.back ? -2.4 : 2.2, -1.1);
  s.begin();
  s.dot(knot[0], knot[1], 0.7, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
}
