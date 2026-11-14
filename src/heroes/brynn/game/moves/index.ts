import type { MoveDef } from "../../../../types/move";
import type { BrynnMoveId } from "../../types/moves";
import { slamStarts } from "../slam";
import { AIR_MOVES } from "./air";
import { STRING_MOVES } from "./string";

/** every combo move of Brynn by id: the ground string and the falling slam */
export const BRYNN_MOVES: Record<BrynnMoveId, MoveDef> = {
  ...STRING_MOVES,
  slam: { ...STRING_MOVES.slam, enter: slamStarts },
  ...AIR_MOVES,
};
