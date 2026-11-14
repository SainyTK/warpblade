import type { Situation } from "../../../types/move";
import type { ZafirMoveId } from "../types/moves";

/** the ground string in order before its last blow; the last blow a combo allows is always the cyclone */
const GROUND_CHAIN: readonly ZafirMoveId[] = ["sweepTurn", "risingTurn", "twinTurn"];
/** spinning descents per jump */
const AIR_LIMIT = 1;

/** the move J starts now: the next spin of the string, the cyclone last, or the spinning descent in the air; the same
 *  wherever the foes stand */
export function chooseMove(s: Situation): ZafirMoveId | null {
  if (!s.ground) return s.airHits >= AIR_LIMIT ? null : "spinDrop";
  if (s.next >= s.limit) return "duneCyclone";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
