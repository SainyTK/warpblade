import type { MoveDef, MoveId } from "../../../types/move";
import { AIR_MOVES } from "./air";
import { FINISHER_MOVES } from "./finishers";
import { GROUND_MOVES } from "./ground";

export const MOVES: Record<MoveId, MoveDef> = { ...GROUND_MOVES, ...AIR_MOVES, ...FINISHER_MOVES };
/** light cuts of the ground string in order; the last hit a combo allows is always the smash */
export const GROUND_LIGHTS: readonly MoveId[] = ["cut1", "cut2", "cut3", "cut4", "cut5"];
