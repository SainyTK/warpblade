import { dealDamage } from "../../../../game/damage";
import { skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skills/ids";
import { createInkBurst } from "../effects/inkBurst";
import { sayaFx } from "../skillFx";
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
        sayaFx(
          SKILL.trail,
          { x: x - hero.face * 16, y: y + 16, face: hero.face },
          { damage: progress.stats.ap * burst },
        );
        dealDamage(e, progress.stats.ap * burst, { fromX: x, source: SKILL.trail });
      }
    },
  },
};
