import { createFloorRing } from "../../../../game/effects/floorRing";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { refundWarp } from "../../../../game/hero/warp";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { ROSE_RAMP } from "../../look/rose";
import { isMarked, roseMark } from "../mark";

/** Rose Mark: a marked foe that falls gives the warp back, and evolved, marks every foe round it */
export const roseMarkSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_m, { foe }) {
      if (!isMarked(foe)) return;
      const v = skillValues("ce_markwarp");
      if (v.refund) refundWarp();
      if (!skillEvolved("ce_markwarp")) return;
      const [x, y] = enemyCenter(foe);
      game.fx.push(createFloorRing(x, foe.y, v.seal, ROSE_RAMP, 0.4));
      for (const e of game.enemies) {
        if (e === foe || e.hp <= 0) continue;
        const [ex, ey] = enemyCenter(e);
        if (Math.hypot(ex - x, ey - y) < v.seal) roseMark(e);
      }
    },
  },
};
