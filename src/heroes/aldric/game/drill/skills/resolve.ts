import { drillFighter } from "../../../../../drill";
import { game, hero, progress } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createDawnGround } from "../../effects/dawnGround";
import { attackStrike } from "../strike";

const ID = "al_resolve";
const AFTER_DASH = 0.6;
const GROUND = { width: 30, time: 2.5 } as const;
const resolve = { since: Infinity, airDashing: false };

export const RESOLVE_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes;
  },
  tick(dt, { values }) {
    resolve.since += dt;
    const h = drillFighter();
    const airDashing = Boolean(h?.airDashActive);
    if (h && airDashing && !resolve.airDashing && values.restore) {
      h.airSlashes = 0;
    }
    resolve.airDashing = airDashing;
  },
  dashed(_foes, { values, evolved }) {
    resolve.since = 0;
    if (values.heal) {
      hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * values.heal);
    }
    if (values.guard) {
      hero.inv = Math.max(hero.inv, values.guard);
    }
    if (evolved) {
      game.fx.push(createDawnGround(hero.x, GROUND.width, GROUND.time, progress.stats.ap * values.ground));
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (values.after && resolve.since <= AFTER_DASH) {
      resolve.since = Infinity;
      attackStrike(foe, values.after, ID);
    }
  },
};
