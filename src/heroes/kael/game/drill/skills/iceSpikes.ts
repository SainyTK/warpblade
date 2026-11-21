import { enemyCenter } from "../../../../../game/enemies/enemy";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";

const ID = "k_frost";

export const ICE_SPIKES_DRILL: KaelDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values }) {
    if (spell.id !== "ice") {
      return;
    }
    foe.frozen += values.freeze;
    skillStrike(foe, values.spike ?? 0, ID);
    if (values.chill) {
      const [x, y] = enemyCenter(foe);
      for (const near of foesNear(x, y, 40)) {
        near.chill = Math.max(near.chill, values.chill);
      }
    }
  },
  swordHit(foe, _infusion, { values, evolved }) {
    if (!values.shatter || foe.frozen <= 0) {
      return;
    }
    const [x, y] = enemyCenter(foe);
    foe.frozen = 0;
    skillStrike(foe, values.shatter, ID, { heavy: true });
    if (values.splash) {
      for (const near of foesNear(x, y, 32)) {
        if (near !== foe) {
          skillStrike(near, values.splash, ID);
          if (evolved) {
            near.frozen = Math.max(near.frozen, values.bloom);
          }
        }
      }
    }
  },
};
