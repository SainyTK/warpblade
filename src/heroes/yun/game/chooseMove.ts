import type { Situation } from "../../../types/move";
import { AIR_LIMIT } from "../constants/string";
import type { YunMoveId } from "../types/moves";

/** the ground string in order before its last blow; the last blow a combo allows is always Returning Tide */
const GROUND_CHAIN: readonly YunMoveId[] = ["willowCut", "turningLeaf", "craneWheel"];
/** the air string in order */
const AIR_CHAIN: readonly YunMoveId[] = ["driftingCut", "fallingPetal"];

/** the move J starts now, the same wherever the foes stand; null once the air string is spent until he lands */
export function chooseMove(s: Situation): YunMoveId | null {
  if (!s.ground) return s.airHits >= AIR_LIMIT ? null : AIR_CHAIN[Math.min(s.airHits, AIR_CHAIN.length - 1)];
  if (s.next === s.limit) return "returningTide";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
