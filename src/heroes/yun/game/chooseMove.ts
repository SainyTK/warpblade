import type { Situation } from "../../../types/move";
import type { YunMoveId } from "../types/moves";
import { airLimit } from "./skills/petalStorm";

/** the ground string in order before its last blow; the last blow a combo allows is always Returning Tide */
const GROUND_CHAIN: readonly YunMoveId[] = ["willowCut", "turningLeaf", "craneWheel"];
/** the air string in order; a longer air string with Petal Storm goes round it again */
const AIR_CHAIN: readonly YunMoveId[] = ["driftingCut", "fallingPetal"];

/** the move J starts now, the same wherever the foes stand; null once the air string is spent until he lands */
export function chooseMove(s: Situation): YunMoveId | null {
  if (!s.ground) return s.airHits >= airLimit() ? null : AIR_CHAIN[s.airHits % AIR_CHAIN.length];
  if (s.next === s.limit) return "returningTide";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
