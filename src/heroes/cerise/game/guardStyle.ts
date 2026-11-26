import { usesDrill } from "../../../drill";
import { skillValues } from "../../../game/skills/query";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { CERISE_BLOCK } from "../constants/guard";
import { POINTS } from "../constants/points";
import { gainPoints } from "./points";
import { openRiposte } from "./riposte";

/**
 * Cerise's guard: a thin block that lets nearly half a blow through at a high stamina price, and the best parry in the
 * roster: a riposte at once and a Point, then a chain of ripostes for as long as J keeps the beat. Grace firms the
 * block, and with Endless Riposte a block starts the chain too.
 */
export const CERISE_GUARD: GuardStyle = {
  get chip() {
    return CERISE_BLOCK.chip - (usesDrill() ? 0 : (skillValues("ce_grace").chip ?? 0));
  },
  get blockCost() {
    return CERISE_BLOCK.cost - (usesDrill() ? 0 : (skillValues("ce_grace").cost ?? 0));
  },
  blocked(_fromX: number, _foe: Enemy | null) {
    if (!usesDrill() && skillValues("ce_riposte").fromBlock) openRiposte();
  },
  parried(_fromX: number, _foe: Enemy | null) {
    if (usesDrill()) return;
    gainPoints(skillValues("ce_riposte").parryPoints ?? POINTS.parry);
    openRiposte();
  },
};
