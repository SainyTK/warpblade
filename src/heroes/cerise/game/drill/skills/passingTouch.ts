import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { roseMark } from "../../mark";
import { foesAhead, skillStrike } from "./strike";

const ID = "ce_step";

export const PASSING_TOUCH_DRILL: CeriseDrillSkill = {
  id: ID,
  dashed(foes, { values, evolved }) {
    for (const foe of foes) {
      skillStrike(foe, values.cut, ID);
      if (evolved) {
        skillStrike(foe, values.cut * 0.5, ID);
        skillStrike(foe, values.cut * 0.5, ID);
      }
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (values.mark) {
        roseMark(foe);
      }
    }
    const h = drillFighter();
    if (values.refresh && foes.length && h) {
      h.dashReadyIn = 0;
    }
    if (values.thrust) {
      for (const foe of foesAhead(34)) {
        skillStrike(foe, values.thrust, ID);
      }
    }
  },
};
