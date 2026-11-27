import { enemyCenter } from "../../../../game/enemies/enemy";
import { stacksOf } from "../../../../game/enemies/skillStatus";
import { skillValues } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { isHeroSource } from "../../../../utils/sources";
import { WOUND_SOURCE } from "../../constants/wounds";
import { sandBurst } from "../effects/spout";
import { zafirFx } from "../skillFx";
import { callHawk } from "../summons/hawk";
import { openWounds } from "../wounds";

const ID = "za_thirst";
/** how far a felled foe's burst reaches */
const BURST_REACH = 32;

/** Desert Thirst: bleeding foes take more (in the kit's `takenBonus`); a bleeding foe he fells gives back HP, bursts
 *  into wounds on the foes beside it, and evolved calls a desert hawk */
export const desertThirst: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_memory, ev, state) {
      if (!stacksOf(ev.foe, WOUND_SOURCE)) return;
      const v = skillValues(ID);
      if (v.heal && isHeroSource(ev.source)) hero.hp = Math.min(progress.stats.hp, hero.hp + v.heal);
      const [x, y] = enemyCenter(ev.foe);
      const damage = progress.stats.ad * (1 + (v.taken ?? 0) * 4);
      zafirFx(ID, "burst", { x, y, reach: v.burst ? BURST_REACH * 0.28 : 8 }, { mark: "bleed", damage });
      const drink = { x, y, face: Math.sign(hero.x - x) || 1, toX: hero.x, toY: hero.y - 16 };
      zafirFx(ID, "trail", drink, { quiet: true, delay: 0.08 });
      if (v.burst) {
        for (const f of foesOnScreen())
          if (f !== ev.foe && Math.abs(f.x - ev.foe.x) <= BURST_REACH) openWounds(f, v.burst);
        sandBurst(ev.foe.x, ev.foe.y - 10, 8);
      }
      if (state.evolved) callHawk(ev.foe.x, ev.foe.y - 20);
    },
  },
};
