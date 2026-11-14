import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "../../../types/rig";

/** a strip of cloth along a rope, tapering from `r0` to `r1`, with its folds turning one way then the other */
function cloth(s: SpriteCanvas, rope: readonly Vec[], r0: number, r1: number, side: number): void {
  for (let i = 1; i < rope.length; i++) {
    const [a, b] = [rope[i - 1], rope[i]];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.hypot(dx, dy) || 1;
    const fold = (i % 2 === 0 ? 0.35 : -0.35) * side * (i / rope.length);
    s.stroke(a[0], a[1], b[0] - (dy / d) * fold, b[1] + (dx / d) * fold, r0 + ((r1 - r0) * i) / rope.length, HC.scarf);
  }
}

/**
 * Behind everything: the head wrap's long tail streaming from the back of his head, and the sash's two long ends from
 * the belt, one a little shorter, turquoise with a lit top edge.
 */
export function drawZafirTrails(s: SpriteCanvas, tail: readonly Vec[], sash: readonly Vec[]): void {
  s.begin();
  for (let i = 1; i < tail.length; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0], a[1], b[0], b[1], 1.1 - i * 0.12, HC.coat);
  }
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDeep, 2);
  s.commit(false);
  s.begin();
  cloth(s, sash, 1, 0.55, 1);
  const short = sash.slice(0, -2).map(([x, y], i): Vec => [x + 0.8, y + 0.6 + i * 0.15]);
  cloth(s, short, 0.9, 0.5, -1);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}
