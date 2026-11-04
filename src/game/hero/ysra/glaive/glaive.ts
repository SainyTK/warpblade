import type { MoveId, Situation } from "../../../../types/move";
import { pressAttack } from "../../combo";
import type { YsraPart } from "../part";

/** J: the glaive. Placeholder: the shared combo engine with a one-move string. */
export function pressGlaive(): boolean {
  return pressAttack();
}

/** the move J starts now. Placeholder. */
export function chooseGlaive(_s: Situation): MoveId | null {
  return "glaiveThrust";
}

export const GLAIVE_PART: YsraPart = {};
