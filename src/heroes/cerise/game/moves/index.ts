import type { MoveDef } from "../../../../types/move";
import type { CeriseMoveId } from "../../types/moves";
import { AIR_MOVES } from "./air";
import { STRING_MOVES } from "./string";

/** every combo move of Cerise by id: the five blows of the string and the air thrusts */
export const CERISE_MOVES: Record<CeriseMoveId, MoveDef> = { ...STRING_MOVES, ...AIR_MOVES };
