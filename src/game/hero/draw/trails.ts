import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { skin } from "../skin";
import type { Vec } from "./reach";

/** a sash uses the first points of the scarf's rope: a short tail of cloth, not a scarf's long streamer */
const SASH_POINTS = 6;

/** a hood's point hangs along the first points of the ponytail's rope */
const HOOD_POINTS = 3;

/** a headband's two short ends ride the first points of the ponytail's rope, in the scarf colours */
const HEADBAND_POINTS = 4;

/** a scarf end under a hood uses the first points of the scarf's rope */
const SCARF_END_POINTS = 5;

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

/** a low bun at the nape where the ponytail starts, with two pins through it like the hands of a clock */
function drawBun(s: SpriteCanvas, tail: readonly Vec[]): void {
  if (tail.length < 2) return;
  const [a, b] = [tail[0], tail[1]];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.hypot(dx, dy) || 1;
  const [cx, cy] = [a[0] + (dx / d) * 0.9, a[1] + (dy / d) * 0.9 + 0.6];
  s.begin();
  s.dot(cx, cy, 1.45, HC.hairDark);
  s.shadeEdges(HC.hairDark, HC.hair, HC.hairDeep, 2);
  s.commit(false);
  s.begin();
  s.stroke(cx - 1.6, cy - 1.4, cx + 0.8, cy + 0.6, 0.3, HC.trim);
  s.stroke(cx - 1.8, cy + 0.2, cx + 1, cy - 0.2, 0.3, HC.trimDark);
  s.set(cx - 1.6, cy - 1.4, HC.trimLight);
  s.commit(false);
}

/** a hood's point: the cowl gathered at the back of the head, tapering down the first stretch of the ponytail's rope */
function drawHoodPoint(s: SpriteCanvas, tail: readonly Vec[]): void {
  const n = Math.min(tail.length, HOOD_POINTS);
  s.begin();
  for (let i = 1; i < n; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0], a[1] + 0.8, b[0], b[1] + 0.8, 1.5 - i * 0.45, HC.coatDark);
  }
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit(false);
}

/** the scarf along its rope, or its first `points`, with a light top edge and a shadowed underside */
function drawScarf(s: SpriteCanvas, scarf: readonly Vec[], points = scarf.length): void {
  const n = Math.min(scarf.length, points);
  s.begin();
  for (let i = 1; i < n; i++) {
    const [a, b] = [scarf[i - 1], scarf[i]];
    s.stroke(a[0], a[1], b[0], b[1], 1.3 - i * 0.07, HC.scarf);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}

/** the ponytail in lit strands, then the scarf, behind everything else; a hood hides the ponytail, and the scarf unless a
 *  short end of it trails from under the hood */
export function drawTrails(s: SpriteCanvas, tail: readonly Vec[], scarf: readonly Vec[]): void {
  if (skin.hood) {
    drawHoodPoint(s, tail);
    if (skin.scarfEnd) drawScarf(s, scarf, SCARF_END_POINTS);
    return;
  }
  if (skin.bun) return drawBun(s, tail);
  if (skin.headband) {
    drawScarf(s, tail, HEADBAND_POINTS);
    return drawSash(s, scarf);
  }
  s.begin();
  for (let i = 1; i < tail.length; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0], a[1], b[0], b[1], i < 2 ? 1.4 : i < 3 ? 1.1 : 0.75, HC.hairDark);
  }
  s.shadeEdges(HC.hairDark, HC.hair, HC.hairDeep, 2);
  s.commit(false);
  if (skin.sash) return drawSash(s, scarf);
  drawScarf(s, scarf);
}
