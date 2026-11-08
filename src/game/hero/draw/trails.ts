import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { skin } from "../skin";
import type { Vec } from "./reach";

/** a sash uses the first points of the scarf's rope: a short tail of cloth, not a scarf's long streamer */
const SASH_POINTS = 6;

/** the sash: a strip of cloth that tapers from the belt, with small folds across it and a split end */
function drawSash(s: SpriteCanvas, rope: readonly Vec[]): void {
  const n = Math.min(rope.length, SASH_POINTS);
  s.begin();
  for (let i = 1; i < n; i++) {
    const [a, b] = [rope[i - 1], rope[i]];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.hypot(dx, dy) || 1;
    // each fold sits a little to one side of the rope, then the other
    const fold = (i % 2 === 0 ? 0.35 : -0.35) * (i / n);
    const bx = b[0] - (dy / d) * fold;
    const by = b[1] + (dx / d) * fold;
    s.stroke(a[0], a[1], bx, by, 1.05 - i * 0.11, HC.scarf);
    if (i === n - 1) {
      // the end splits into two short tails
      s.stroke(bx, by, bx + dx / d - (dy / d) * 0.8, by + dy / d + (dx / d) * 0.8, 0.45, HC.scarf);
      s.stroke(bx, by, bx + dx / d + (dy / d) * 0.8, by + dy / d - (dx / d) * 0.8, 0.45, HC.scarf);
    }
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}

/** the ponytail in lit strands, then the scarf with a light top edge and a shadowed underside, behind everything else */
export function drawTrails(s: SpriteCanvas, tail: readonly Vec[], scarf: readonly Vec[]): void {
  s.begin();
  for (let i = 1; i < tail.length; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0], a[1], b[0], b[1], i < 2 ? 1.4 : i < 3 ? 1.1 : 0.75, HC.hairDark);
  }
  s.shadeEdges(HC.hairDark, HC.hair, HC.hairDeep, 2);
  s.commit(false);
  if (skin.sash) return drawSash(s, scarf);
  s.begin();
  for (let i = 1; i < scarf.length; i++) {
    const [a, b] = [scarf[i - 1], scarf[i]];
    s.stroke(a[0], a[1], b[0], b[1], 1.3 - i * 0.07, HC.scarf);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}
