import { drillFighter } from "../../../../../drill";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { skillStrike } from "../strike";

const ID = "yu_drift";
const MARK_TIME = 3;

export const DRIFTING_LEAF_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  dashed(foes, { values, evolved }) {
    for (const foe of foes) {
      skillStrike(foe, values.cut * (evolved ? 2 : 1), ID);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (values.mark) {
        markFoe(foe, ID, MARK_TIME, values.mark);
      }
    }
    const h = drillFighter();
    if (h && foes.length && values.refund) {
      h.dashReadyIn = 0;
    }
  },
};
