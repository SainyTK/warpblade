import type { MoveDef } from "../../../../types/move";
import type { VesperMoveId } from "../../types/moves";
import { AIR_MOVES } from "./air";
import { STRING_MOVES } from "./string";

/** every combo move of Vesper by id: the ground string and the air string */
export const VESPER_MOVES: Record<VesperMoveId, MoveDef> = { ...STRING_MOVES, ...AIR_MOVES };
