import type { MoveDef, MoveId } from "../../../types/move";
import { AIR_MOVES } from "../../hero/moves/air";
import { CHAIN_MOVES } from "../../hero/moves/chain";
import { FINISHER_MOVES } from "../../hero/moves/finishers";
import { SKILL_MOVES } from "../../hero/moves/skills";

/** Kael's own moves; read from their own files, so a skill does not load the other heroes' moves with them */
const KAEL_MOVES: Partial<Record<MoveId, MoveDef>> = {
  ...CHAIN_MOVES,
  ...SKILL_MOVES,
  ...AIR_MOVES,
  ...FINISHER_MOVES,
};

/** the attack damage multiple a copy of a blow repeats: the move's own power, with no skill's bonus (balance rule G2);
 *  a blow outside one of Kael's moves (a dash cut, the warp's arrival) counts as 1 */
export function copyPower(move: MoveId | null): number {
  const hits = (move && KAEL_MOVES[move]?.hits) || [];
  if (!hits.length) return 1;
  return hits.reduce((sum, h) => sum + h.power, 0) / hits.length;
}
