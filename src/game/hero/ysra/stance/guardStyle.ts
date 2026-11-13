import { EMBER } from "../../../../constants/characters/ysra/look";
import { GUARD } from "../../../../constants/ysra/stance";
import type { GuardStyle } from "../../../../types/moveset";
import { createGlint } from "../../../effects/flash";
import { skillValues } from "../../../skills/query";
import { game, hero } from "../../../state";
import { emitYsra } from "../events";
import { stance } from "./memory";

/** stamina one block costs: Counter Thrust and Haft Ward take shares off */
const blockCost = (): number =>
  GUARD.blockCost * (1 - (skillValues("y_counter").firm ?? 0)) * (skillValues("y_ward").cost ?? 1);

/**
 * Ysra's guard: the haft planted upright, a firm block that lets little through and costs little stamina, and a parry
 * that builds Heat and opens Counter Thrust, J along the line within a moment.
 */
export const YSRA_GUARD: GuardStyle = {
  chip: GUARD.chip,
  get blockCost(): number {
    return blockCost();
  },
  blocked(fromX) {
    emitYsra("block", { fromX });
  },
  parried(fromX) {
    stance.counter = skillValues("y_counter").time ?? GUARD.counterTime;
    // the point flares white: the counter is ready
    game.fx.push(createGlint(hero.x + hero.face * 20, hero.y - 30, EMBER[5]));
    emitYsra("parry", { fromX });
  },
};
