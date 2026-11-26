import { markFoe } from "../../../../../game/enemies/skillStatus";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { fireRound } from "../round";
import { struckThisSwing } from "../trigger";

const ID = "ca_trigger";

export const HAIR_TRIGGER_DRILL: CalderDrillSkill = {
  id: ID,
  slashed(strike, landed, { values, evolved }) {
    const foe = struckThisSwing()[0];
    if (!landed || !foe || !(strike === "first" || (strike === "second" && values.second))) {
      return;
    }
    const shots = evolved ? 2 : 1;
    for (let i = 0; i < shots; i++) {
      fireRound(foe, { power: values.round, kind: "trigger", hot: !!values.hot, stagger: values.stagger, source: ID });
    }
    if (values.mark && foe.hp > 0) {
      markFoe(foe, ID, 3, values.mark);
    }
  },
};
