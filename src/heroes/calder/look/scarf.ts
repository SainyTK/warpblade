import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame } from "../../../types/rig";

/** the scarf's tails use the first points of its rope: a short neck scarf, worn loose */
const TAIL_POINTS = 5;

/** Calder's neck scarf: two short rust tails off the knot, a lit top edge and a shadowed underside, and no ponytail */
export function drawNeckScarf(s: SpriteCanvas, rig: RigFrame): void {
  const rope = rig.scarf;
  const n = Math.min(rope.length, TAIL_POINTS);
  s.begin();
  for (let i = 1; i < n; i++) {
    const [a, b] = [rope[i - 1], rope[i]];
    s.stroke(a[0], a[1], b[0], b[1], 1.25 - i * 0.1, HC.scarf);
    // the second tail hangs a little under the first and ends sooner
    if (i < n - 2) s.stroke(a[0] - 0.4, a[1] + 1, b[0] - 0.4, b[1] + 1.2, 0.85 - i * 0.08, HC.scarfDark);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}
