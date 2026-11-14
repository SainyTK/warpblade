import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame, Vec } from "../../../../types/rig";
import { atChest, atHip, atNeck } from "../../../../utils/poseFrame";

/**
 * A cropped slate jacket that ends above the waist, over a dark fitted top, with a bronze-buckled strap across the chest
 * from the far shoulder and a wide belt. From the back: the jacket's seam and the strap.
 */
export function drawBrynnTorso(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  s.begin();
  s.poly(
    [atNeck(p, -3.2, 0), atNeck(p, 2.9, 0), atChest(p, 2.8), atHip(p, 2.6, 0.6), atHip(p, -3.2, 0.6)],
    HC.coatDeep,
  );
  s.shadeEdges(HC.coatDeep, HC.coatDark, HC.outline);
  s.commit();
  const hem: Vec[] = [atChest(p, 3.3), atChest(p, -3.9)];
  const lowHem: Vec[] = [atHip(p, -3.9, -3.6), atHip(p, 3.1, -3.2)];
  s.begin();
  s.poly([atNeck(p, -3.9, -0.3), atNeck(p, 3.4, -0.3), hem[0], lowHem[1], lowHem[0], hem[1]], HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  s.begin();
  if (rig.back) {
    const [a, b] = [atNeck(p, -0.3, 1), atHip(p, -0.3, -3.4)];
    s.hairline(a[0], a[1], b[0], b[1], HC.coatDeep);
  } else {
    const [a, b] = [atNeck(p, 1.4, 0.8), atHip(p, 1.6, -3.3)];
    s.stroke(a[0], a[1], b[0], b[1], 0.55, HC.coatDeep);
    const [c, d] = [atNeck(p, 0.6, 0.3), atNeck(p, 2.6, 2.2)];
    s.hairline(c[0], c[1], d[0], d[1], HC.coatLight);
  }
  s.commit(false);
  const strapA = rig.back ? atNeck(p, 2.4, 0.6) : atNeck(p, -2.6, 0.6);
  const strapB = rig.back ? atHip(p, -2.6, -1.6) : atHip(p, 2.3, -1.6);
  s.begin();
  s.stroke(strapA[0], strapA[1], strapB[0], strapB[1], 0.5, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  const strapBuckle = atChest(p, rig.back ? 0.6 : -0.4);
  s.begin();
  s.dot(strapBuckle[0], strapBuckle[1], 0.6, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
  const [l, r] = [atHip(p, -3.4, -1), atHip(p, 3, -1)];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 0.75, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  const buckle = atHip(p, rig.back ? -0.6 : 1.1, -1.2);
  s.begin();
  s.dot(buckle[0], buckle[1], 0.8, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
