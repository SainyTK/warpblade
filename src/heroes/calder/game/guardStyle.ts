import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { GUARD } from "../constants/guard";
import { counterShot } from "./counterShot";

/** Calder's guard on the spine of the blade: an average block, and a parry that answers with a point-blank counter shot,
 *  loads rounds and makes his next J a Trigger */
export const CALDER_GUARD: GuardStyle = {
  chip: GUARD.chip,
  blockCost: GUARD.blockCost,
  parried(_fromX: number, foe: Enemy | null) {
    counterShot(foe);
  },
};
