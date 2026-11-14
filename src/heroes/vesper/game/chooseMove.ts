import { skillValues } from "../../../game/skills/query";
import type { Situation } from "../../../types/move";
import { AIR_HITS } from "../constants/string";
import type { VesperMoveId } from "../types/moves";

/** the ground string in order; the last press a combo allows is always the moonrise */
const GROUND_CHAIN: readonly VesperMoveId[] = ["duskCross", "risingPair", "scissorTurn"];
/** the air string in order; the nightfall dive is always its last press */
const AIR_CHAIN: readonly VesperMoveId[] = ["swallowCut", "wingCut", "twinWheel"];

/** air blows before she lands: four, and Ascending Step's more */
export const airHits = (): number => AIR_HITS + (skillValues("ve_ascend").air ?? 0);

/** the next air blow: the swoop, the undercut and the wheel repeat until the last, which is always the dive */
function airMove(s: Situation): VesperMoveId | null {
  const most = airHits();
  if (s.airHits >= most) return null;
  if (s.airHits === most - 1) return "nightfall";
  return AIR_CHAIN[s.airHits % AIR_CHAIN.length];
}

/** the move J starts now: the same string wherever the foes stand; null once the air string is spent */
export function chooseMove(s: Situation): VesperMoveId | null {
  if (!s.ground) return airMove(s);
  if (s.next === s.limit) return "moonrise";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
