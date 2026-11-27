import { GROUND } from "../../../../../constants/stage";
import { game, progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createLingeringRain } from "../../effects/lingeringRain";
import { createRainSword } from "../../effects/rainSword";
import { RAIN, yunFx } from "../../fx";

const ID = "yu_rain";
const SCREEN = 170;
const LEANS = [-24, 24, 0] as const;

export const HEAVENS_GROVE_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.tierDamage *= 1 + values.damage;
    m.chargeRate *= values.charge ?? 1;
    m.tierReach *= values.reach ?? 1;
  },
  released({ x, tier }, { values, evolved }) {
    const damage = progress.stats.ap * values.power * tier.level;
    const blow = progress.stats.ap * tier.level * (1 + values.damage);
    const near = game.enemies.filter((foe) => foe.hp > 0 && Math.abs(foe.x - x) < SCREEN).slice(0, 4);
    const marks = near.length ? near.map((foe) => foe.x) : [x + 40];
    marks.forEach((mx, i) => {
      yunFx(
        ID,
        "pillar",
        { x: mx, y: GROUND, reach: 40 },
        { damage: blow, quiet: i > 0, delay: i * 0.05, signature: RAIN },
      );
    });
    if (values.swords) {
      const foes = game.enemies.filter((foe) => foe.hp > 0 && Math.abs(foe.x - x) < SCREEN);
      for (const foe of foes) {
        for (let i = 0; i < values.swords; i++) {
          game.fx.push(createRainSword({ foe }, 0.1 + i * 0.08, LEANS[i % LEANS.length], damage, ID));
        }
      }
    }
    const linger = evolved ? values.endless : (values.linger ?? 0);
    if (linger) {
      game.fx.push(createLingeringRain(linger, damage * 0.5));
    }
  },
};
