import { drillFighter } from "../../../../../drill";
import { hero } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";

const ID = "ce_poise";
const poise = { empowered: false, wasDashing: false };

export const POISE_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes;
    if (poise.empowered) {
      m.strikeDamage *= 1 + values.empower;
    }
  },
  slashed() {
    poise.empowered = false;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const dashing = h.dashTime > 0;
    if (dashing && values.untouchable) {
      hero.inv = Math.max(hero.inv, 0.05);
    }
    if (dashing && !poise.wasDashing) {
      poise.empowered = values.empower > 0;
      if (evolved) {
        h.warpReadyIn = 0;
      }
    }
    poise.wasDashing = dashing;
  },
  moment(moment, { values }) {
    const h = drillFighter();
    if (moment === "airDash" && values.airReset && h) {
      h.airSlashes = 0;
    }
  },
};
