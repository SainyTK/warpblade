import type { MoveDef } from "../../../../types/move";
import type { SayaMoveId } from "../../types/moves";
import { AIR_MOVES } from "./air";
import { STRING_MOVES } from "./string";

/** every combo move of Saya's by id: the string and the falling draw */
export const SAYA_MOVES: Record<SayaMoveId, MoveDef> = { ...STRING_MOVES, ...AIR_MOVES };
