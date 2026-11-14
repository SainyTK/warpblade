import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { RigFrame, Vec } from "../../../types/rig";

/** how far past the rope's last point the tail and the scarf run, as a share of the rope's last two segments */
const TAIL_REACH = 1.3;
/** the scarf's second end leaves the first at this rope point */
const SCARF_SPLIT = 3;

/** the rope's points with one more beyond the end, along the way the last segments run */
function extended(rope: readonly Vec[], reach: number): Vec[] {
  const n = rope.length;
  if (n < 3) return [...rope];
  const [a, b] = [rope[n - 3], rope[n - 1]];
  return [...rope, [b[0] + (b[0] - a[0]) * reach * 0.5, b[1] + (b[1] - a[1]) * reach * 0.5]];
}

/** the long tied tail of hair: thick at the tie, tapering to a point, with a crystal cyan band where it is tied */
function drawHairTail(s: SpriteCanvas, rope: readonly Vec[]): void {
  const tail = extended(rope, TAIL_REACH);
  const last = tail.length - 1;
  s.begin();
  for (let i = 1; i <= last; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.taper(a[0], a[1], b[0], b[1], 1.9 - (i - 1) * 0.36, 1.9 - i * 0.36, HC.hairDark);
  }
  s.shadeEdges(HC.hairDark, HC.hair, HC.hairDeep, 2);
  s.commit(false);
  s.begin();
  for (let i = 1; i < last; i++)
    s.hairline(tail[i][0], tail[i][1] - 0.4, tail[i + 1][0], tail[i + 1][1] - 0.4, HC.hairLight);
  s.commit(false);
  if (tail.length < 2) return;
  const tie: Vec = [(tail[0][0] + tail[1][0]) / 2, (tail[0][1] + tail[1][1]) / 2];
  s.begin();
  s.dot(tie[0], tie[1], 1, HC.blade);
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeBack);
  s.commit();
}

/** a strip of cloth along points, narrowing toward its end */
function strip(s: SpriteCanvas, points: readonly Vec[], width: number, color: Color): void {
  for (let i = 1; i < points.length; i++) {
    const [a, b] = [points[i - 1], points[i]];
    s.stroke(a[0], a[1], b[0], b[1], width - i * 0.08, color);
  }
}

/**
 * Kael's red scarf: a wide band from the neck that splits into two ends, the shorter one under the longer, both on the
 * scarf's rope so they trail and settle together
 */
function drawScarf(s: SpriteCanvas, rope: readonly Vec[]): void {
  if (rope.length > SCARF_SPLIT + 1) {
    const under = rope.slice(SCARF_SPLIT, -1).map(([x, y], i): Vec => [x + i * 0.15, y + 0.6 + i * 0.45]);
    s.begin();
    strip(s, under, 1.15, HC.scarfDark);
    s.shadeEdges(HC.scarfDark, HC.scarf, HC.outline, 2);
    s.commit(false);
  }
  s.begin();
  strip(s, extended(rope, 0.5), 1.45, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}

/** Kael's long tied tail of hair, then his split scarf, behind everything else */
export function drawKaelTrails(s: SpriteCanvas, rig: RigFrame): void {
  drawHairTail(s, rig.tail);
  drawScarf(s, rig.scarf);
}
