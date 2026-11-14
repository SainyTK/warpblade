import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";

/** the tail is tied this far above and ahead of where the rig's rope hangs from, and drawn this much longer than it */
const TAIL = { tieUp: 4.2, tieAhead: 1.2, length: 2.7 } as const;
/** the sash's two cord ends: how far apart they hang and how long they are drawn along the rope */
const CORD = { apart: 0.9, length: 1.6 } as const;

/** a point of a rope drawn `k` times as long, from the same start */
const stretch = (rope: readonly Vec[], i: number, k: number): Vec => [
  rope[0][0] + (rope[i][0] - rope[0][0]) * k,
  rope[0][1] + (rope[i][1] - rope[0][1]) * k,
];

/** the long tail tied high at the crown, in lit strands that taper to a point and swing with the rope */
function drawTail(s: SpriteCanvas, rope: readonly Vec[]): void {
  if (rope.length < 2) return;
  const tie: Vec = [rope[0][0] + TAIL.tieAhead, rope[0][1] - TAIL.tieUp];
  const points: Vec[] = [tie, ...rope.slice(1).map((_, i) => stretch(rope, i + 1, TAIL.length))];
  s.begin();
  for (let i = 1; i < points.length; i++) {
    const [a, b] = [points[i - 1], points[i]];
    const r0 = 1.7 - (i - 1) * 0.42;
    s.taper(a[0], a[1], b[0], b[1], Math.max(0.5, r0), Math.max(0.35, r0 - 0.42), HC.hairDark, i % 2 ? 0.6 : -0.6);
  }
  s.shadeEdges(HC.hairDark, HC.hair, HC.hairDeep, 2);
  s.commit(false);
  s.begin();
  for (let i = 1; i < points.length - 1; i++) {
    const [a, b] = [points[i - 1], points[i]];
    s.hairline(a[0] + 0.3, a[1] - 0.2, b[0] + 0.3, b[1] - 0.2, i === 1 ? HC.hairLight : HC.hair);
  }
  s.commit(false);
  s.begin();
  s.dot(tie[0], tie[1] + 0.4, 0.7, HC.scarf);
  s.set(tie[0] - 0.2, tie[1], HC.scarfLight);
  s.commit();
}

/** the two cord ends of the sash, hanging from the back of the belt along the rope, each ending in a small tassel */
function drawCords(s: SpriteCanvas, rope: readonly Vec[]): void {
  if (rope.length < 2) return;
  const n = Math.min(rope.length, 5);
  s.begin();
  for (const side of [-1, 1]) {
    for (let i = 1; i < n; i++) {
      const [a, b] = [stretch(rope, i - 1, CORD.length), stretch(rope, i, CORD.length)];
      const spread = side * CORD.apart * (i / n);
      s.stroke(a[0] + spread * 0.6, a[1], b[0] + spread, b[1], 0.32, HC.scarf);
    }
    const end = stretch(rope, n - 1, CORD.length);
    s.dot(end[0] + side * CORD.apart, end[1] + 0.6, 0.55, HC.scarfLight);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit(false);
}

/** the tail and the sash cords, behind everything else */
export function drawSayaTrails(s: SpriteCanvas, rig: RigFrame): void {
  drawTail(s, rig.tail);
  drawCords(s, rig.scarf);
}
