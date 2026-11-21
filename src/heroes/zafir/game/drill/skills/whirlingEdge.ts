import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { throwCrescents } from "../crescents";
import { pullFoe, skillStrike, swingKind } from "../strike";

const ID = "za_whirling";

export const WHIRLING_EDGE_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { evolved, values }) {
    if (evolved) {
      m.strikeReach *= 1 + values.reach;
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (swingKind() !== "first") {
      return;
    }
    skillStrike(foe, values.first, ID);
    if (values.drag) {
      pullFoe(foe, values.drag);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike === "first" && values.crescent) {
      throwCrescents(values.crescent, ID, !!values.pierce, evolved ? 2 : 1);
    }
  },
};
