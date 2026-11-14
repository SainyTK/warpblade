import type { GuardStyle } from "../../../types/moveset";
import { SAYA_BLOCK } from "../constants/guard";
import { startCounter } from "./counter";

/** Saya's scabbard block: average, a quarter through; her parry is the counter draw */
export const SAYA_GUARD: GuardStyle = {
  chip: SAYA_BLOCK.chip,
  blockCost: SAYA_BLOCK.cost,
  parried: () => startCounter(),
};
