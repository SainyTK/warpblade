import type { MoveDef } from "../../../../types/move";
import type { YunMoveId } from "../../types/moves";
import { AIR_MOVES } from "./air";
import { STRING_MOVES } from "./string";

/** every combo move of Yun by id: the ground string and the air string */
export const YUN_MOVES: Record<YunMoveId, MoveDef> = { ...STRING_MOVES, ...AIR_MOVES };
