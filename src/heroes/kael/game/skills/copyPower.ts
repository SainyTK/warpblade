import { drillFighter, usesDrill } from "../../../../drill";
import type { MoveDef } from "../../../../types/move";
import { KAEL_STRIKES } from "../../constants/drill/strikes";
import type { KaelMoveId } from "../../types/moves";
import { AIR_MOVES } from "../moves/air";
import { CHAIN_MOVES } from "../moves/chain";
import { FINISHER_MOVES } from "../moves/finishers";
import { SKILL_MOVES } from "../moves/skills";

/** Kael's own moves; read from their own files, so a skill does not load the other heroes' moves with them */
const KAEL_MOVES: Partial<Record<KaelMoveId, MoveDef>> = {
  ...CHAIN_MOVES,
  ...SKILL_MOVES,
  ...AIR_MOVES,
  ...FINISHER_MOVES,
};

function drillStrikePower(): number {
  const kind = usesDrill() ? drillFighter()?.swing?.kind : undefined;
  return kind ? KAEL_STRIKES[kind].damage : 1;
}

/** the attack damage multiple a copy of a blow repeats: the move's own power, with no skill's bonus (balance rule G2);
 *  a blow outside one of Kael's moves (a dash cut, the warp's arrival) counts as 1 */
export function copyPower(move: KaelMoveId | null): number {
  const hits = (move && KAEL_MOVES[move]?.hits) || [];
  if (!hits.length) return drillStrikePower();
  return hits.reduce((sum, h) => sum + h.power, 0) / hits.length;
}
