import type { Situation } from "../../../types/move";
import type { ZafirMoveId } from "../types/moves";

/** the ground string in order before its last blow; the last blow a combo allows is always the cyclone */
const GROUND_CHAIN: readonly ZafirMoveId[] = ["sweepTurn", "risingTurn", "twinTurn"];
/** spinning descents per jump: one, or Falling Dune's */
const airLimit = (s: Situation): number => ((s.skills.za_falling ?? 0) >= FALLING_TWICE ? 2 : 1);
/** the level of Falling Dune from which he descends twice a jump */
const FALLING_TWICE = 4;

/** the move J starts now: the next spin of the string, the cyclone last, or the spinning descent in the air; the same
 *  wherever the foes stand */
export function chooseMove(s: Situation): ZafirMoveId | null {
  if (!s.ground) return s.airHits >= airLimit(s) ? null : "spinDrop";
  if (s.next >= s.limit) return "duneCyclone";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
