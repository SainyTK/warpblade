import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame } from "../../../types/rig";
import { atHip } from "../../../utils/poseFrame";

/** pixels the duster's back flap hangs below the hip, and the front flap */
const HEM = { back: 15, front: 12.5 } as const;

/**
 * The duster below the belt: two long flaps split at the back, hanging to the shins and flaring back with speed, each
 * with a fold, a dark hem and a ragged corner. The back flap flies farther than the front one.
 */
export function drawDuster(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  const fl = rig.flare;
  const back = [
    at(-3.7, -2),
    at(0.2, -2),
    at(-1 - fl * 0.8, HEM.back - fl * 0.6),
    at(-5.4 - fl * 1.5, HEM.back - 1 - fl),
  ];
  s.begin();
  s.poly(back, HC.coatDark);
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  const front = [
    at(-0.6, -2),
    at(3.2, -2),
    at(3.9 + fl * 0.2, HEM.front - fl * 0.2),
    at(-0.4 - fl * 0.7, HEM.front + 0.6 - fl * 0.4),
  ];
  s.begin();
  s.poly(front, HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  s.begin();
  const folds: [number, number, number, number][] = [
    [-2.2, 0, -3.2 - fl * 1.1, HEM.back - 1.5 - fl * 0.8],
    [1.6, 0, 1.6 - fl * 0.3, HEM.front - 1 - fl * 0.2],
  ];
  for (const [x0, y0, x1, y1] of folds) {
    const [a, b] = [at(x0, y0), at(x1, y1)];
    s.stroke(a[0], a[1], b[0], b[1], 0.28, HC.coatDeep);
  }
  s.commit(false);
  s.begin();
  for (const [a, b] of [
    [back[2], back[3]],
    [front[2], front[3]],
  ])
    s.stroke(a[0], a[1], b[0], b[1], 0.4, HC.coatDeep);
  s.commit(false);
}
