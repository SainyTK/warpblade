import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createEchoThrust } from "../../effects/echoThrust";
import { createQiRing } from "../../effects/qiRing";
import { hoverPlace } from "../../hover";
import { foesNear, skillStrike } from "../strike";

const ID = "yu_breath";
const RING = 30;
const breath = { dashing: false, air: false };

export const SAGES_BREATH_DRILL: YunDrillSkill = {
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
    if (dashing && !breath.dashing) {
      breath.air = h.airDashActive;
      if (breath.air && values.restore) {
        h.airSlashes = 0;
      }
      if (breath.air && evolved) {
        for (let i = 0; i < values.sea; i++) {
          game.fx.push(
            createEchoThrust({
              from: hoverPlace(i),
              delay: i * 0.05,
              reach: 70,
              height: -14 - i * 6,
              power: values.ring,
              crit: false,
              back: 0,
              chill: 0,
            }),
          );
        }
      }
    }
    if (!dashing && breath.dashing && values.ring) {
      game.fx.push(createQiRing(h.x, h.y - 14, RING));
      for (const foe of foesNear(h.x, h.y - 14, RING)) {
        skillStrike(foe, values.ring, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    breath.dashing = dashing;
  },
};
