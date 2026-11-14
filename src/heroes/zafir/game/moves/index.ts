import type { MoveDef } from "../../../../types/move";
import type { ZafirMoveId } from "../../types/moves";
import { AIR_MOVES } from "./air";
import { STRING_MOVES } from "./string";

/** every combo move of Zafir by id: the four spins of the ground string and the spinning descent */
export const ZAFIR_MOVES: Record<ZafirMoveId, MoveDef> = { ...STRING_MOVES, ...AIR_MOVES };
