import { dealDamage } from "../../../../game/damage";
import { skillValues } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skills/ids";
import { createInkBurst } from "../effects/inkBurst";
import { trailCenters } from "../trail";

/** Lingering Line's evolution, Ink Sea: every release bursts on the foes standing in her trails. The trails themselves
 *  are laid by Brushline and Moonrise and ticked by the kit */
export const lingeringLine: SkillBehavior = {
  create: () => ({}),
  on: {
    release() {
      const burst = skillValues(SKILL.trail).burst;
      if (!burst) return;
      for (const [e, x, y] of trailCenters()) {
        game.fx.push(createInkBurst(x, y, [0], false));
        dealDamage(e, progress.stats.ap * burst, { fromX: x, source: SKILL.trail });
      }
    },
  },
};
