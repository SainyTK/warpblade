import { stacksOf } from "../../../game/enemies/skillStatus";
import { skillValues } from "../../../game/skills/query";
import type { Enemy } from "../../../types/enemy";

/** Sunbrand: a branded foe takes more from every source */
export function brandBonus(e: Enemy): number {
  const bonus = skillValues("al_brand").bonus;
  return bonus && stacksOf(e, "al_brand") > 0 ? bonus : 0;
}
