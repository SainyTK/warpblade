import type { Situation } from "../../../types/move";
import type { CeriseMoveId } from "../types/moves";

/** the ground string in order; the last blow a combo allows is always the long lunge */
const GROUND_CHAIN: readonly CeriseMoveId[] = ["leadThrust", "secondThrust", "risingThrust", "twinFlick"];

/** the air thrusts a jump allows: the dive alone, or with Swallow Dive's second level an air thrust before it */
function airMove(s: Situation): CeriseMoveId | null {
  const own = (s.skills.ce_dive ?? 0) >= 2 ? 2 : 1;
  const limit = Math.min(own, s.airLimit);
  if (s.airHits >= limit) return null;
  return s.airHits + 1 < limit ? "airThrust" : "dive";
}

/**
 * The move J starts now: on the ground the string's next blow, the same wherever the foes stand, and the long lunge as
 * the last blow; in the air the dive. Null when the air thrusts are spent.
 */
export function chooseMove(s: Situation): CeriseMoveId | null {
  if (!s.ground) return airMove(s);
  if (s.next >= s.limit) return "longLunge";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
