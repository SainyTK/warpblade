import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";
import { headCenter } from "../../../utils/poseFrame";

/** where the long ends leave the topknot, from the middle of the head (facing right) */
const KNOT: Vec = [-1.5, -8];
/** the sash: the first points of its rope, and its width at the belt */
const SASH_POINTS = 5;

/**
 * The long ends of hair that fall from the topknot and trail along the rope behind the head, two strands that part
 * toward their tips, then the two ends of the jade sash from the belt
 */
export function drawYunTrails(s: SpriteCanvas, rig: RigFrame): void {
  const [cx, cy] = headCenter(rig.pose);
  const mirror = rig.pose.mr >= 0.5 ? -1 : 1;
  const knot: Vec = [cx * mirror + KNOT[0] * mirror, cy + KNOT[1]];
  const rope: Vec[] = [knot, ...rig.tail];
  s.begin();
  for (let i = 1; i < rope.length; i++) {
    const [a, b] = [rope[i - 1], rope[i]];
    const w = i < 2 ? 1.2 : i < 4 ? 0.95 : 0.65;
    s.stroke(a[0], a[1], b[0], b[1], w, HC.hairDark);
    if (i >= 3) s.stroke(a[0] + 0.6, a[1] + 0.4, b[0] + 0.9, b[1] + 0.8, 0.45, HC.hairDark);
  }
  s.shadeEdges(HC.hairDark, HC.hairLight, HC.hairDeep, 2);
  s.commit(false);
  const sash = rig.scarf.slice(0, SASH_POINTS);
  s.begin();
  for (let i = 1; i < sash.length; i++) {
    const [a, b] = [sash[i - 1], sash[i]];
    s.stroke(a[0], a[1], b[0], b[1], 0.8 - i * 0.08, HC.scarf);
    if (i > 1) s.stroke(a[0] + 1, a[1], b[0] + 1.6, b[1], 0.45, HC.scarf);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}
