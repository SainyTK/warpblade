import type { GuardStyle } from "../../../types/moveset";
import { SAYA_BLOCK } from "../constants/guard";
import { calmChip } from "./calm";
import { startParryCounter } from "./counter";

/** Saya's scabbard block: average, a quarter through (less while calm); her parry is the counter draw */
export const SAYA_GUARD: GuardStyle = {
  get chip() {
    return SAYA_BLOCK.chip * calmChip();
  },
  blockCost: SAYA_BLOCK.cost,
  parried: () => startParryCounter(),
};
