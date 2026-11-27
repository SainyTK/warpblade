import { clampStageX } from "../../../game/adventure";
import { moveHeroX } from "../../../game/hero/terrain";
import { skillEvolved, skillLevel, skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { MIRAGE, SAND_VEIL } from "../constants/guard";
import { sandBurst } from "./effects/spout";
import { leaveMirage } from "./mirage";
import { zafirFx } from "./skillFx";
import { gainWhirl } from "./whirl";

/** Sand Veil: a block throws sand in the attacker's eyes */
function blindAttacker(foe: Enemy | null): void {
  const blind = skillValues("za_veil").blind;
  if (!blind || !foe || foe.rank !== "minion") return;
  foe.blind = Math.max(foe.blind, blind);
  sandBurst(foe.x, foe.y - 14, 6);
}

/** Sand Veil: a block or a parry throws a dune of sand at the attacker; evolved, a parry throws one each way */
function veilWave(fromX: number, power: number, quiet: boolean): void {
  if (!skillLevel("za_veil")) return;
  const face = Math.sign(fromX - hero.x) || hero.face;
  const dune = { x: hero.x + face * 6, y: hero.y, face, reach: 24 };
  zafirFx("za_veil", "wave", dune, { damage: progress.stats.ad * power, quiet });
  if (quiet || !skillEvolved("za_veil")) return;
  zafirFx(
    "za_veil",
    "wave",
    { ...dune, x: hero.x - face * 6, face: -face },
    { damage: progress.stats.ad * power, delay: 0.05 },
  );
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
  blocked(fromX, foe) {
    blindAttacker(foe);
    veilWave(fromX, 0.5, true);
    const whirl = skillValues("za_veil").blockWhirl;
    if (whirl) gainWhirl(whirl);
  },
  parried(fromX) {
    veilWave(fromX, MIRAGE.power + (skillValues("za_veil").miragePower ?? 0), false);
    leaveMirage(hero.x, hero.y);
    if (skillEvolved("za_veil")) leaveMirage(clampStageX(hero.x + hero.face * MIRAGE.slip * 2, 8), hero.y);
    hero.x = moveHeroX(hero.x, hero.y, hero.x - hero.face * MIRAGE.slip);
    hero.keenNext = true;
  },
};
