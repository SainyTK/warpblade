import type { Situation } from "../../../types/move";
import type { BrynnMoveId } from "../types/moves";

/** the ground string in order; the last hit a combo allows is always the slam */
const GROUND_CHAIN: readonly BrynnMoveId[] = ["sweep", "heave"];
/** the falling slam, once per jump */
const AIR_LIMIT = 1;

/** the move J starts now: the same string wherever foes stand, or the falling slam in the air */
export function chooseMove(s: Situation): BrynnMoveId | null {
  if (!s.ground) return s.airHits < AIR_LIMIT ? "airSlam" : null;
  if (s.next >= s.limit) return "slam";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
