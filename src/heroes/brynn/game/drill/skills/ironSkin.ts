import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { game, hero } from "../../../../../game/state";
import { CRIMSON } from "../../../constants/colors";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";

const ID = "br_ironskin";
const RING = 34;
const skin = { dashing: false, after: 0 };

export const IRON_SKIN_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  slashed(strike, _landed, { values }) {
    if (strike === "warp" && values.warp) {
      hero.inv = Math.max(hero.inv, values.warp);
    }
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
    if (dashing && !skin.dashing) {
      if (h.airDashActive && values.refresh) {
        h.airSlashes = 0;
      }
      if (evolved) {
        game.fx.push(createFloorRing(h.x, h.y, RING, CRIMSON, 0.35));
        for (const foe of foesNear(h.x, h.y - 12, RING)) {
          skillStrike(foe, values.ring, ID);
        }
      }
    }
    skin.dashing = dashing;
  },
};
