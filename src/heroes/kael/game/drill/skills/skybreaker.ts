import { ENEMY_AIR } from "../../../../../constants/combat";
import { drillFighter } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { skillFx } from "../../../../../game/skillFx";
import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";

const ID = "k_skyward";

export const SKYBREAKER_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values }) {
    if (drillFighter()?.grounded === false) {
      m.strikeDamage *= 1 + (values.air ?? 0);
    }
  },
  swordHit(foe, _infusion, { values, evolved }) {
    const h = drillFighter();
    const strike = h?.swing?.kind;
    if (strike === "third") {
      skillStrike(foe, values.lift, ID, { launch: values.launch });
      const floor = surfaceBelow(foe.x, foe.y - 2);
      skillFx(ID, "pillar", { x: foe.x, y: floor, reach: 34 }, { damage: progress.stats.ad * values.lift });
    }
    if (strike === "air" && values.spike && foe.air) {
      skillStrike(foe, values.spike, ID, { spike: true, heavy: true });
      const [sx, sy] = enemyCenter(foe);
      skillFx(ID, "bolt", { x: sx, y: sy, reach: 40 }, { damage: progress.stats.ad * values.spike });
      foe.vy = ENEMY_AIR.spike;
      if (evolved) {
        const [x, y] = enemyCenter(foe);
        const quake = { x, y: surfaceBelow(x, y), reach: values.quake };
        skillFx(ID, "nova", quake, { damage: progress.stats.ad * values.spike * 2 });
        for (const near of foesNear(x, y + 20, values.quake)) {
          if (near !== foe) {
            skillStrike(near, values.spike, ID, { stun: 0.4 });
          }
        }
      }
    }
  },
};
