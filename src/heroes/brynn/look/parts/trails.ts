import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame, Vec } from "../../../../types/rig";

/** the headband's tails use the first points of the ponytail's rope; the sash the first points of the scarf's */
const RIBBON_POINTS = 3;
const SASH_POINTS = 5;

/** a strip of crimson cloth along a rope, tapering, with a split end that splays as it flies */
function drawStrip(s: SpriteCanvas, rope: readonly Vec[], n: number, width: number, split: number): void {
  const count = Math.min(rope.length, n);
  s.begin();
  for (let i = 1; i < count; i++) {
    const [a, b] = [rope[i - 1], rope[i]];
    s.stroke(a[0], a[1], b[0], b[1], width - (i * width * 0.45) / count, HC.scarf);
    if (i < count - 1) continue;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.hypot(dx, dy) || 1;
    s.stroke(b[0], b[1], b[0] + dx / d - (dy / d) * split, b[1] + dy / d + (dx / d) * split, 0.4, HC.scarf);
    s.stroke(b[0], b[1], b[0] + dx / d + (dy / d) * split, b[1] + dy / d - (dx / d) * split, 0.4, HC.scarf);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}

/** the headband's two short tails from the knot at the back of her head, and the sash from her belt */
export function drawBrynnTrails(s: SpriteCanvas, rig: RigFrame): void {
  drawStrip(s, rig.tail, RIBBON_POINTS, 0.9, 0.9);
  drawStrip(s, rig.scarf, SASH_POINTS, 1.25, 0.9);
}
