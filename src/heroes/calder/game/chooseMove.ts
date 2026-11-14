import { skillValues } from "../../../game/skills/query";
import type { Situation } from "../../../types/move";
import type { CalderMoveId } from "../types/moves";

/** the ground string in order before its last blow; the last blow a combo allows is always Breaker */
const GROUND_CHAIN: readonly CalderMoveId[] = ["hew", "rip"];
/** the air string in order: Air hew, then Drop cut, which takes him down to the floor */
const AIR_CHAIN: readonly CalderMoveId[] = ["airHew", "dropCut"];

/** air blows before landing: the shared limit, and one more with Blast Jump */
const airLimit = (s: Situation): number => s.airLimit + (skillValues("ca_blastjump").air ?? 0);

/**
 * The move J starts now: Breaker as the string's last blow, otherwise the string's next blow, the same wherever the
 * foes stand. In the air, Air hew until the last air blow, which is Drop cut. Null once the air string is spent.
 */
export function chooseMove(s: Situation): CalderMoveId | null {
  if (!s.ground) {
    const limit = airLimit(s);
    if (s.airHits >= limit) return null;
    return s.airHits === limit - 1 ? AIR_CHAIN[1] : AIR_CHAIN[0];
  }
  if (s.next >= s.limit) return "breaker";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
