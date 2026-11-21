import { drillFighter } from "../../../../../drill";
import { hero } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { foesNear, skillStrike } from "../strike";

const ID = "k_blink";
const blink = { dashing: false };

export const BLINK_STEP_DRILL: KaelDrillSkill = {
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
    if (dashing && !blink.dashing) {
      if (h.airDashActive && values.refresh) {
        h.airSlashes = 0;
      }
      if (values.after) {
        const x = h.x;
        const y = h.y - 16;
        const radius = evolved ? values.shadow : 24;
        const cut = () => {
          for (const foe of foesNear(x, y, radius)) {
            skillStrike(foe, values.after, ID);
          }
        };
        later(0.25, cut);
        if (evolved) {
          later(0.45, cut);
        }
      }
    }
    blink.dashing = dashing;
  },
};
