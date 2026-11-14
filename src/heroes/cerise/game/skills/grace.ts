import { skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";

/** Grace: parries, riposte links and perfect dodges heal her, and evolved a parry gives MP */
export const grace: SkillBehavior = {
  create: () => ({}),
  on: {
    parry() {
      const v = skillValues("ce_grace");
      hero.hp = Math.min(progress.stats.hp, hero.hp + v.parry);
      if (v.parryMp) hero.mp = Math.min(progress.stats.mp, hero.mp + v.parryMp);
    },
    riposteLink() {
      const v = skillValues("ce_grace");
      if (v.link) hero.hp = Math.min(progress.stats.hp, hero.hp + v.link);
    },
    perfectDodge() {
      const v = skillValues("ce_grace");
      if (v.dodge) hero.hp = Math.min(progress.stats.hp, hero.hp + v.dodge);
    },
  },
};
