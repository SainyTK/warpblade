import { hero } from "../../../game/state";
import type { MoveHit } from "../../../types/move";
import { HEAVY } from "../constants/string";

/** a heavy swing (a Keen press) reaches farther ahead and breaks guards */
export function shapeHit(_id: string, hit: MoveHit): MoveHit {
  if (!hero.keen) return hit;
  const [x0, y0, x1, y1] = hit.box;
  return { ...hit, box: [x0, y0, x1 * HEAVY.reach, y1], big: true };
}
