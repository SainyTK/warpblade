import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { createRoseLine } from "../../effects/roseLine";
import { roseMark } from "../../mark";

const ID = "ce_lunge";

export const LONG_LUNGE_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.finisherDamage *= 1 + values.power;
  },
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind !== "third") {
      return;
    }
    if (values.pin) {
      foe.pinned = Math.max(foe.pinned, values.pin);
    }
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
  },
  slashed(strike, landed, { values, evolved }) {
    if (strike !== "third") {
      return;
    }
    if (values.streak) {
      game.fx.push(createRoseLine(hero.x, hero.y - 17, hero.face, progress.stats.ad * values.streak, ID, roseMark));
    }
    if (values.twin) {
      game.fx.push(createRoseLine(hero.x, hero.y - 27, hero.face, progress.stats.ad * values.streak, ID));
    }
    const h = drillFighter();
    if (evolved && landed && h) {
      h.warpReadyIn = 0;
      h.dashReadyIn = 0;
    }
  },
};
