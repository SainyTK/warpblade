import { PAL } from "../../../constants/palette";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { consumeStacks, stacksOf } from "../../enemies/skillStatus";
import { game, progress } from "../../state";
import { skillEvolved, skillValues } from "../query";

const ID = "t_openVeins";
/** Exsanguinate's burst reaches this far, and deals this share of attack damage per stack */
const BURST = { reach: 30, power: 1 } as const;

/** Open Veins lays its Bleed in his kit; once evolved, a foe at most Bleed bursts on the next hit (Exsanguinate) */
export const openVeinsSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, event) {
      if (!skillEvolved(ID)) return;
      const e = event.foe;
      const max = skillValues(ID).max ?? 10;
      if (stacksOf(e, ID) < max) return;
      const n = consumeStacks(e, ID);
      const [cx, cy] = enemyCenter(e);
      game.fx.push(createFloorRing(cx, e.y, BURST.reach, PAL.gloam, 0.3));
      for (const o of game.enemies) {
        if (o.hp <= 0 || Math.hypot(enemyCenter(o)[0] - cx, enemyCenter(o)[1] - cy) > BURST.reach) continue;
        dealDamage(o, progress.stats.ad * BURST.power * n, { fromX: cx, kx: Math.sign(o.x - cx) * 60, source: ID });
      }
    },
  },
};
