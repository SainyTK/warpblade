import { drillFighter } from "../../../../../drill";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { liftFoe } from "../statuses";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_keen";

export const TWIN_KEEN_DRILL: VesperDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, strike, { values }) {
    if (strike !== "second") {
      return;
    }
    const sureCrit = !!values.crit;
    later(0.06, () => skillStrike(foe, values.follow, ID, { sureCrit }));
    if (values.again) {
      later(0.14, () => skillStrike(foe, values.follow, ID, { sureCrit }));
    }
    if (values.lift) {
      liftFoe(foe, -values.lift);
    }
    if (values.mark) {
      markFoe(foe, ID, 2, values.mark);
    }
  },
  slashed(strike, landed, { values, evolved }) {
    const h = drillFighter();
    if (!evolved || strike !== "second" || !landed || !h) {
      return;
    }
    for (const foe of foesNear(h.x, h.y - 16, values.pair)) {
      later(0.1, () => skillStrike(foe, values.follow, ID, { sureCrit: true }));
      later(0.2, () => skillStrike(foe, values.follow, ID, { sureCrit: true }));
    }
  },
};
