import { drillFighter } from "../../../../../drill";
import { hero } from "../../../../../game/state";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_grace";
const grace = { dashing: false };

export const WANDERERS_GRACE_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const dashing = h.dashTime > 0;
    if (dashing) {
      hero.inv = Math.max(hero.inv, values.inv);
    }
    if (dashing && !grace.dashing) {
      if (h.airDashActive && values.refresh) {
        h.airSlashes = 0;
      }
      if (values.shade) {
        const x = h.x;
        const y = h.y - 16;
        const cut = () => {
          for (const foe of foesNear(x, y, evolved ? 48 : 26)) {
            skillStrike(foe, values.shade, ID);
          }
        };
        later(0.22, cut);
        if (evolved) {
          later(0.4, cut);
        }
      }
    }
    grace.dashing = dashing;
  },
};
