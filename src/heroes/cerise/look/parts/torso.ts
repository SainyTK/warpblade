import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame, Vec } from "../../../../types/rig";
import { atChest, atHip, atNeck } from "../../../../utils/poseFrame";

/** silver buttons down the bias closure, from the near collar to the far hip, as shares of the line */
const BUTTONS = [0.18, 0.42, 0.66] as const;

/**
 * The fitted white fencing coat from neck to hip: lit from the top left, closed on the bias from the near collar down to
 * the far side of the waist with silver buttons, a standing collar lined in rose, and a plum sash at the waist with a
 * silver buckle. From the back: the coat's seam and the sash.
 */
export function drawCeriseTorso(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  s.begin();
  s.poly(
    [atNeck(p, -3.3, 0), atNeck(p, 3, 0), atChest(p, 3.1), atHip(p, 2.7, 0.5), atHip(p, -3.1, 0.5), atChest(p, -3.4)],
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  if (rig.back) {
    const [a, b] = [atNeck(p, -0.3, 1), atHip(p, -0.3, -1)];
    s.begin();
    s.stroke(a[0], a[1], b[0], b[1], 0.3, HC.coatDark);
    s.commit(false);
  } else {
    const top = atNeck(p, 2.2, 0.8);
    const bottom = atHip(p, -1.4, -1.6);
    s.begin();
    s.stroke(top[0], top[1], bottom[0], bottom[1], 0.3, HC.coatDark);
    s.commit(false);
    s.begin();
    for (const u of BUTTONS) {
      const at: Vec = [top[0] + (bottom[0] - top[0]) * u - 0.4, top[1] + (bottom[1] - top[1]) * u];
      s.dot(at[0], at[1], 0.42, HC.steel);
    }
    s.shadeEdges(HC.steel, HC.steelLight, HC.steelDark);
    s.commit();
  }
  const [c0, c1] = [atNeck(p, -2.6, 0.3), atNeck(p, 2.4, 0.3)];
  s.begin();
  s.stroke(c0[0], c0[1], c1[0], c1[1], 0.75, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  s.begin();
  s.stroke(c0[0], c0[1] - 0.5, c1[0], c1[1] - 0.5, 0.4, HC.coatLight);
  s.commit(false);
  const [l, r] = [atHip(p, -3.2, -1), atHip(p, 2.8, -1)];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 0.65, HC.pants);
  s.shadeEdges(HC.pants, HC.pantsLight, HC.pantsDark);
  s.commit();
  const buckle = atHip(p, rig.back ? -0.6 : 0.8, -1.1);
  s.begin();
  s.dot(buckle[0], buckle[1], 0.6, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDark);
  s.commit();
}
