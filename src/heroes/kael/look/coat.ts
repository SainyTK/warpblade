import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";
import { clamp } from "../../../utils/math";
import { atHip } from "../../../utils/poseFrame";

/** how far below the hip the long back tail and the short front panel hang, in pixels */
const BACK_HEM = 12;
const FRONT_HEM = 6.5;
/** how much of the scarf's swing the long tail follows, and the most it swings either way */
const SWAY_SHARE = 0.22;
const SWAY_MOST = 3;
/** the scarf rope point whose lag behind the neck the tail follows */
const SWAY_POINT = 5;

/**
 * how far the long tail's hem swings, from how far the scarf trails behind the neck: the scarf runs on the rope, so the
 * coat trails behind travel and settles when the hero stops
 */
function sway(rope: readonly Vec[]): Vec {
  if (rope.length <= SWAY_POINT) return [0, 0];
  const [a, b] = [rope[0], rope[SWAY_POINT]];
  return [clamp((b[0] - a[0]) * SWAY_SHARE, -SWAY_MOST, SWAY_MOST * 0.5), clamp((b[1] - a[1]) * 0.08, -1, 1)];
}

/**
 * Kael's long coat below the belt, split in two: a long tail at the back that flares with speed and swings with the
 * scarf, lined in crystal cyan, and a short panel at the front over the near hip, both with a brass hem
 */
export function drawKaelCoatTails(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  const fl = rig.flare;
  const [sx, sy] = sway(rig.scarf);
  const corner: Vec = ((q) => [q[0] + sx, q[1] + sy])(at(-5.6 - fl * 1.2, BACK_HEM - fl * 0.6));
  const inner: Vec = ((q) => [q[0] + sx * 0.5, q[1] + sy * 0.5])(at(-0.6 - fl * 0.5, BACK_HEM - 1.6 - fl * 0.4));
  s.begin();
  s.poly([at(-3.8, -2), at(-0.2, -2), at(0.2, 4), inner, corner], HC.bladeBack);
  s.shadeEdges(HC.bladeBack, HC.blade, HC.bladeDeep);
  s.commit();
  s.begin();
  s.poly(
    [at(-3.6, -2), at(-0.6, -2), at(-0.2, 4), [inner[0] - 0.6, inner[1] - 0.7], [corner[0] + 0.4, corner[1] - 0.9]],
    HC.coatDark,
  );
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  s.begin();
  const fold = at(-1.9, -1);
  s.stroke(fold[0], fold[1], (inner[0] + corner[0]) / 2, (inner[1] + corner[1]) / 2 - 1, 0.3, HC.coatDeep);
  s.commit(false);
  s.begin();
  s.stroke(inner[0] - 0.3, inner[1] - 0.4, corner[0] + 0.3, corner[1] - 0.6, 0.4, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
  const front: Vec = at(3.4 + fl * 0.2, FRONT_HEM);
  s.begin();
  s.poly([at(0.4, -2), at(3.1, -2), front, at(0.8, FRONT_HEM - 0.8)], HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  s.begin();
  const hem = at(0.8, FRONT_HEM - 0.6);
  s.stroke(hem[0], hem[1], front[0], front[1] + 0.2, 0.4, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
