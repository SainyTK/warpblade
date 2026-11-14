import { HERO_COLORS as HC } from "../../../constants/palette";
import type { RigExtra } from "../../../types/rig";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";

/**
 * A leather strap across the breastplate from the near shoulder to the far hip, held by a crystal clasp at the chest;
 * from the back, the strap's other half
 */
export const KAEL_STRAP: RigExtra = {
  layer: "overTorso",
  draw(s, rig) {
    const p = rig.pose;
    const [a, b] = rig.back ? [atNeck(p, -2.6, 0.8), atHip(p, 2.2, -1.4)] : [atNeck(p, 2.4, 0.9), atHip(p, -2.8, -1.4)];
    s.begin();
    s.stroke(a[0], a[1], b[0], b[1], 0.55, HC.glove);
    s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
    s.commit();
    if (rig.back) return;
    const clasp = atChest(p, 0.5);
    s.begin();
    s.dot(clasp[0], clasp[1], 0.95, HC.trim);
    s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
    s.commit();
    s.begin();
    s.dot(clasp[0], clasp[1], 0.5, HC.blade);
    s.set(clasp[0] - 0.25, clasp[1] - 0.25, HC.bladeEdge);
    s.commit(false);
  },
};
