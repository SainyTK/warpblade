import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigExtra, RigFrame, Vec } from "../../../../types/rig";
import { atNeck } from "../../../../utils/poseFrame";

/** how far the cape hangs below the shoulder, and how much of the rope's sway its hem follows */
const CAPE = { drop: 7, sway: 0.55, swayMost: 5 } as const;

/** how far the hem swings back, from the scarf rope that the cape rides on: it trails in motion and settles at rest */
function sway(rig: RigFrame): Vec {
  const rope = rig.scarf;
  if (rope.length < 5) return [0, 0];
  const dx = (rope[4][0] - rope[0][0]) * CAPE.sway;
  const dy = (rope[4][1] - rope[0][1]) * CAPE.sway * 0.4;
  const d = Math.hypot(dx, dy);
  const k = d > CAPE.swayMost ? CAPE.swayMost / d : 1;
  return [dx * k, dy * k];
}

/**
 * The short cape over the sword-side shoulder: white outside, its rose lining showing along the back edge and hem,
 * pinned at the collar with a silver clasp. It rides the scarf rope, so it trails behind her as she moves and settles.
 */
function drawCape(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const [sx, sy] = sway(rig);
  const neck = atNeck(p, -1.6, 0.4);
  const shoulder = atNeck(p, 3.4, 1.6);
  const hemFront = atNeck(p, 3.2, CAPE.drop);
  const hemBack = atNeck(p, -3.2, CAPE.drop - 1.5);
  const front: Vec = [hemFront[0] + sx * 0.6, hemFront[1] + sy];
  const back: Vec = [hemBack[0] + sx, hemBack[1] + sy];
  const mid: Vec = [(front[0] + back[0]) / 2 + sx * 0.2, Math.max(front[1], back[1]) + 1];
  s.begin();
  s.poly([neck, shoulder, front, mid, back], HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  s.begin();
  s.stroke(neck[0], neck[1], back[0], back[1], 0.45, HC.scarf);
  s.stroke(back[0], back[1], mid[0], mid[1], 0.45, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit(false);
  const clasp = atNeck(p, 0.6, 0.6);
  s.begin();
  s.dot(clasp[0], clasp[1], 0.55, HC.steel);
  s.shadeEdges(HC.steel, HC.steelGlint, HC.steelDark);
  s.commit();
}

/** the cape, over the torso and head's neck and under the sword arm */
export const CAPE_EXTRA: RigExtra = { layer: "overHead", draw: drawCape };
