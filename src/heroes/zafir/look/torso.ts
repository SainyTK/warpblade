import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";

/**
 * Zafir's torso: a cream under-tunic, a saffron wrap crossing it from the near shoulder to the far hip with a fold down
 * it, and a wide turquoise sash at the waist knotted at the front. From the back the wrap covers it all.
 */
export function drawZafirTorso(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  s.begin();
  s.poly(
    [atNeck(p, -3.4, 0), atNeck(p, 3, 0), atChest(p, 3.1), atHip(p, 3.1, 0.5), atHip(p, -3.4, 0.5), atChest(p, -3.5)],
    rig.back ? HC.coat : HC.pants,
  );
  if (rig.back) s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  else s.shadeEdges(HC.pants, HC.pantsLight, HC.pantsDark, 2);
  s.commit();
  const wrap: Vec[] = rig.back
    ? [atNeck(p, -1.2, 0), atNeck(p, 0.6, 0), atHip(p, 2.2, -1.5), atHip(p, 0.4, -1.5)]
    : [
        atNeck(p, -3.4, 0),
        atNeck(p, 0.4, 0),
        atChest(p, 2.2),
        atHip(p, 3.1, -1.5),
        atHip(p, -0.2, -1.5),
        atChest(p, -3.5),
      ];
  s.begin();
  s.poly(wrap, HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  s.begin();
  const [f0, f1] = [atNeck(p, -1.2, 1.2), atHip(p, rig.back ? 1.2 : 1, -2)];
  s.stroke(f0[0], f0[1], f1[0], f1[1], 0.25, HC.coatDark);
  if (!rig.back) {
    const [e0, e1] = [atNeck(p, 0.4, 0.4), atChest(p, 2.2)];
    s.stroke(e0[0], e0[1], e1[0], e1[1], 0.3, HC.trim);
  }
  s.commit(false);
  const [l, r] = [atHip(p, -3.5, -0.8), atHip(p, 3.2, -0.8)];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 1, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  if (rig.back) return;
  const knot = atHip(p, 1.6, -0.8);
  s.begin();
  s.dot(knot[0], knot[1], 0.8, HC.scarfLight);
  s.set(knot[0] - 0.3, knot[1] - 0.4, HC.trimLight);
  s.commit();
}
