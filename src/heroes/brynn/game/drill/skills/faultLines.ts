import { game, hero } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createCrack } from "../../effects/crack";

const ID = "br_fault";

export const FAULT_LINES_DRILL: BrynnDrillSkill = {
  id: ID,
  slashed(strike, _landed, { values }) {
    if (strike !== "third") {
      return;
    }
    game.fx.push(createCrack(hero.x, hero.x + hero.face * values.reach, hero.y));
    if (values.both) {
      game.fx.push(createCrack(hero.x, hero.x - hero.face * values.reach, hero.y));
    }
  },
};
