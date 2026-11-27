import { drillFighter } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { nearestFoe } from "../../../../../game/skills/targets";
import { game, hero, progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createArrivalSword } from "../../effects/arrivalSword";
import { RAIN, VOLLEY, yunFx } from "../../fx";

const ID = "yu_ride";
const REACH = 60;
const GAP = 0.05;
const walker = { readyIn: 0 };

export const SWORD_RIDING_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpCooldown *= values.cooldown;
    m.warpDamage *= 1 + values.damage;
  },
  tick(dt) {
    walker.readyIn = Math.max(0, walker.readyIn - dt);
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "warp" || !h) {
      return;
    }
    const foe = nearestFoe(h.x, h.y - 16);
    const ride = { x: h.x - h.face * 50, y: h.y - 18, face: h.face, toX: h.x - h.face * 14, toY: h.y - 18 };
    yunFx(ID, "trail", ride, { damage: progress.stats.ad * (1 + values.damage), signature: VOLLEY });
    if (values.swords && foe && Math.abs(foe.x - h.x) < REACH) {
      const [, ey] = enemyCenter(foe);
      yunFx(
        ID,
        "pillar",
        { x: foe.x, y: foe.air ? ey + 10 : foe.y, reach: 30 },
        { damage: progress.stats.ad * values.power * values.swords, delay: 0.05, signature: RAIN },
      );
      for (let i = 0; i < values.swords; i++) {
        const fromX = h.x - h.face * (8 + i * 5);
        game.fx.push(createArrivalSword(foe, fromX, ey - 26 - i * 4, i * GAP, progress.stats.ad * values.power));
      }
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
    if (evolved && walker.readyIn === 0) {
      walker.readyIn = values.every;
      h.warpReadyIn = 0;
      hero.warpCd = 0;
    }
  },
};
