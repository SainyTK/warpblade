import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { skillStrike } from "../strike";

const ID = "k_passing";

export const PASSING_CUT_DRILL: KaelDrillSkill = {
  id: ID,
  dashed(foes, { values, evolved }) {
    for (const foe of foes) {
      skillStrike(foe, values.cut, ID, { sureCrit: !!values.crit });
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (evolved) {
        later(0.3, () => skillStrike(foe, values.cut * values.phantom, ID));
      }
    }
    const h = drillFighter();
    if (h && foes.length > 0 && values.refund) {
      h.dashReadyIn = 0;
    }
  },
};
