import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { skillStrike } from "../strike";

const ID = "k_reap";

export const REAPING_SWEEP_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.strikeReach *= 1 + (values.reach ?? 0);
  },
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind !== "first") {
      return;
    }
    foe.vx += (hero.x - foe.x > 0 ? 1 : -1) * values.pull;
    skillStrike(foe, values.sweep ?? 0, ID);
    if (values.trip) {
      staggerFoe(foe, values.trip);
    }
    if (values.chill) {
      foe.chill = Math.max(foe.chill, values.chill);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "first" || !values.behind) {
      return;
    }
    const reach = evolved ? values.harvest : 34;
    for (const foe of game.enemies) {
      const behind = (hero.x - foe.x) * hero.face;
      const ahead = -behind;
      const caught = evolved ? ahead > 40 && ahead <= reach : behind > 0 && behind <= reach;
      if (foe.hp > 0 && caught && Math.abs(foe.y - hero.y) <= 20) {
        foe.vx += (hero.x - foe.x > 0 ? 1 : -1) * values.pull;
        skillStrike(foe, values.sweep ?? values.behind, ID);
      }
    }
  },
};
