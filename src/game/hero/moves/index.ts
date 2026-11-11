import type { MoveDef, MoveId } from "../../../types/move";
import { GLAIVE_MOVES } from "../ysra/glaive/moves";
import { STANCE_MOVES } from "../ysra/stance/moves";
import { AIR_MOVES } from "./air";
import { CHAIN_MOVES } from "./chain";
import { FINISHER_MOVES } from "./finishers";
import { SKILL_MOVES } from "./skills";

export const MOVES: Record<MoveId, MoveDef> = {
  ...CHAIN_MOVES,
  ...SKILL_MOVES,
  ...AIR_MOVES,
  ...FINISHER_MOVES,
  ...GLAIVE_MOVES,
  ...STANCE_MOVES,
};
