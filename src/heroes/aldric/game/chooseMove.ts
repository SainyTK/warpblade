import type { Situation } from "../../../types/move";
import type { AldricMoveId } from "../types/moves";

/** the ground string in order; the last hit a combo allows is always Crest breaker */
const GROUND_CHAIN: readonly AldricMoveId[] = ["oathCut", "shieldBash"];
const AIR_CHAIN: readonly AldricMoveId[] = ["skyCut", "shieldFall"];

/** the move J starts now: the same string wherever the foes stand; null once the air string is spent */
export function chooseMove(s: Situation): AldricMoveId | null {
  if (!s.ground) return s.airHits >= s.airLimit ? null : AIR_CHAIN[Math.min(s.airHits, AIR_CHAIN.length - 1)];
  if (s.next >= s.limit) return "crestBreaker";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
