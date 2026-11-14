import type { MoveDef } from "../../../../types/move";
import type { KaelMoveId } from "../../types/moves";
import { AIR_MOVES } from "./air";
import { CHAIN_MOVES } from "./chain";
import { FINISHER_MOVES } from "./finishers";
import { SKILL_MOVES } from "./skills";

/** every combo move of Kael by id: the ground string, the skill moves, the air string and the finishers */
export const KAEL_MOVES: Record<KaelMoveId, MoveDef> = {
  ...CHAIN_MOVES,
  ...SKILL_MOVES,
  ...AIR_MOVES,
  ...FINISHER_MOVES,
};
