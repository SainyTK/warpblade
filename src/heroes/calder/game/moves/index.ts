import type { MoveDef } from "../../../../types/move";
import type { CalderMoveId } from "../../types/moves";
import { AIR_MOVES } from "./air";
import { STRING_MOVES } from "./string";

/** every combo move of Calder by id: the ground string and the air string */
export const CALDER_MOVES: Record<CalderMoveId, MoveDef> = { ...STRING_MOVES, ...AIR_MOVES };
