import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame, Vec } from "../../../../types/rig";

/** the side tail runs on past the rope's last point by this many segments, falling a little more with each */
const TAIL_MORE = 4;
/** how much each extra segment falls, in pixels */
const TAIL_FALL = 1.1;
/** the tail's thickness from the tie to the tip */
const TAIL_WIDTH = [1.4, 1.6, 1.5, 1.3, 1.1, 0.85, 0.6, 0.4] as const;

/** the side tail's points: the rope, then a few more along its last direction, falling as they go */
function tailPoints(rope: readonly Vec[]): Vec[] {
  const points = [...rope];
  const n = rope.length;
  if (n < 2) return points;
  const [a, b] = [rope[n - 2], rope[n - 1]];
  let [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  for (let i = 0; i < TAIL_MORE; i++) {
    dy += TAIL_FALL;
    const last = points[points.length - 1];
    points.push([last[0] + dx, last[1] + dy]);
  }
  return points;
}

/** the rose ribbon tied round the tail: two loops and two short ends */
function drawRibbon(s: SpriteCanvas, at: Vec): void {
  const [x, y] = at;
  s.begin();
  s.dot(x - 1.1, y - 0.9, 0.75, HC.scarf);
  s.dot(x + 0.9, y - 1, 0.7, HC.scarf);
  s.stroke(x, y, x - 0.9, y + 2, 0.4, HC.scarf);
  s.stroke(x, y, x + 0.5, y + 2.2, 0.4, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  s.begin();
  s.dot(x, y, 0.5, HC.scarfDark);
  s.commit(false);
}

/** Cerise's long cherry side tail in lit strands, tied with a rose ribbon, behind everything else */
export function drawCeriseTrails(s: SpriteCanvas, rig: RigFrame): void {
  const tail = tailPoints(rig.tail);
  s.begin();
  for (let i = 1; i < tail.length; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0], a[1], b[0], b[1], TAIL_WIDTH[Math.min(i - 1, TAIL_WIDTH.length - 1)], HC.hair);
  }
  s.shadeEdges(HC.hair, HC.hairLight, HC.hairDeep, 2);
  s.commit(false);
  s.begin();
  for (let i = 2; i < tail.length - 1; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0] + 0.3, a[1], b[0] + 0.3, b[1], 0.25, HC.hairDark);
  }
  s.commit(false);
  if (tail.length > 1) drawRibbon(s, tail[1]);
}
