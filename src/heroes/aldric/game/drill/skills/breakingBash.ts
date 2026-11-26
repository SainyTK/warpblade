import { drillFighter } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { markFoe, stacksOf } from "../../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_breaker";

export const BREAKING_BASH_DRILL: AldricDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values, evolved }) {
    if (drillFighter()?.swing?.kind !== "second") {
      return;
    }
    staggerFoe(foe, values.stagger);
    if (values.knock) {
      foe.vx += hero.face * values.knock;
    }
    attackStrike(foe, values.extra ?? 0, ID);
    if (values.mark) {
      markFoe(foe, ID, 3, values.mark);
    }
    if (!values.shock) {
      return;
    }
    const [x, y] = enemyCenter(foe);
    for (const near of foesNear(x + hero.face * values.reach * 0.5, y, values.reach)) {
      if (near === foe || (near.x - foe.x) * hero.face < 0) {
        continue;
      }
      attackStrike(near, values.shock, ID, { kx: hero.face * 60 });
      if (evolved) {
        attackStrike(near, values.shatter * stacksOf(near, "al_brand"), ID);
      }
    }
  },
};
