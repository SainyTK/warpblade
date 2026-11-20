import { clampStageX } from "../../../game/adventure";
import { moveHeroX } from "../../../game/hero/terrain";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { MIRAGE, SAND_VEIL } from "../constants/guard";
import { sandBurst } from "./effects/spout";
import { leaveMirage } from "./mirage";
import { gainWhirl } from "./whirl";

/** Sand Veil: a block throws sand in the attacker's eyes */
function blindAttacker(foe: Enemy | null): void {
  const blind = skillValues("za_veil").blind;
  if (!blind || !foe || foe.rank !== "minion") return;
  foe.blind = Math.max(foe.blind, blind);
  sandBurst(foe.x, foe.y - 14, 6);
}

/** Zafir's veil of sand: a middling block that Sand Veil hardens, and a parry that slips him out of the blow and leaves a
 *  mirage in his place, which minions strike at and which bursts into sand blades; his next blow is Keen */
export const ZAFIR_GUARD: GuardStyle = {
  get chip() {
    return skillValues("za_veil").chip ?? SAND_VEIL.chip;
  },
  get blockCost() {
    return skillValues("za_veil").cost ?? SAND_VEIL.cost;
  },
  blocked(_fromX, foe) {
    blindAttacker(foe);
    const whirl = skillValues("za_veil").blockWhirl;
    if (whirl) gainWhirl(whirl);
  },
  parried() {
    leaveMirage(hero.x, hero.y);
    if (skillEvolved("za_veil")) leaveMirage(clampStageX(hero.x + hero.face * MIRAGE.slip * 2, 8), hero.y);
    hero.x = moveHeroX(hero.x, hero.y, hero.x - hero.face * MIRAGE.slip);
    hero.keenNext = true;
  },
};
