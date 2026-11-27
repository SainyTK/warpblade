import { HERO_MOVE } from "../../../../constants/combat";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { zafirFx } from "../skillFx";
import { zafir } from "../state";

const ID = "za_slip";

/** Sand Slip from level 5: a perfect dodge fills the Whirl to its top ring; the dodge's cut and cloud are in the kit */
export const sandSlip: SkillBehavior = {
  create: () => ({}),
  on: {
    dash(_memory, ev) {
      const v = skillValues(ID);
      const length = HERO_MOVE.dashSpeed * progress.stats.move * HERO_MOVE.dashTime;
      const streak = {
        x: hero.x - ev.dir * length,
        y: hero.y - 15,
        face: ev.dir,
        toX: hero.x - ev.dir * 8,
        toY: hero.y - 15,
      };
      zafirFx(ID, "trail", streak, { damage: progress.stats.ad * (v.passCut ?? 0.5), quiet: !ev.foes.length });
      if (skillEvolved(ID)) zafirFx(ID, "pillar", { x: streak.x, y: hero.y, reach: 24 }, { quiet: true });
    },
    perfectDodge() {
      const fill = skillValues(ID).perfectWhirl;
      if (!fill) return;
      zafir.whirl = Math.max(zafir.whirl, fill);
      zafir.whirlIdle = 0;
    },
  },
};
