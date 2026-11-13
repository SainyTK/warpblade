import { BLOOD_ANSWER, BRANNOC_GUARD } from "../../../constants/brannoc/moves";
import { PAL } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { createFloorRing } from "../../effects/floorRing";
import { skillValues } from "../../skills/query";
import { game, hero, lights } from "../../state";
import { bleedThrough, repayAll } from "./debt";
import { forearmBurst, startFrenzy } from "./frenzy";

/**
 * Blood Answer: the whole debt comes back into his HP at once, out of the foe he turned aside, and Frenzy starts for
 * free; Forebear's level makes the Frenzy last longer
 */
function bloodAnswer(_fromX: number, foe: Enemy | null): void {
  repayAll(foe);
  startFrenzy(BLOOD_ANSWER.frenzy + (skillValues("b_ancestor").answer ?? 0));
  forearmBurst(BLOOD_ANSWER.sparks);
  game.fx.push(createFloorRing(hero.x, hero.y, BLOOD_ANSWER.ring, PAL.rage, 0.4));
  lights.add(hero.x, hero.y - 18, 36, PAL.rage[3], 0.4, 0.3);
  sfx.tone(90, 220, 0.12, "sawtooth", 0.06);
}

/**
 * Brannoc's guard: he takes the blow on the haft and half of it bleeds through, for a lot of stamina; what bleeds through
 * goes into his debt and the debt he owed stays. Its parry, Blood Answer, is the strongest reward in the roster.
 */
export const BRANNOC_GUARD_STYLE: GuardStyle = {
  chip: BRANNOC_GUARD.chip,
  blockCost: BRANNOC_GUARD.blockCost,
  blocked: bleedThrough,
  parried: bloodAnswer,
};
