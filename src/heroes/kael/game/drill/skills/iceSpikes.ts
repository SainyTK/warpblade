import { enemyCenter } from "../../../../../game/enemies/enemy";
import { skillFx } from "../../../../../game/skillFx";
import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
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
    const row = { x: foe.x, y: surfaceBelow(foe.x, foe.y - 2), face: 1, reach: 22 };
    skillFx(ID, "spikes", row, { damage: progress.stats.ad * ((values.spike ?? 0) + 1) * 2 });
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
    skillFx(ID, "burst", { x, y, reach: values.splash ? 14 : 10 }, { damage: progress.stats.ad * values.shatter });
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
