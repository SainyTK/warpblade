import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { atFloor, ceriseFx } from "../fx";

/** Grace: parries, riposte links and perfect dodges heal her, and evolved a parry gives MP */
export const grace: SkillBehavior = {
  create: () => ({}),
  on: {
    parry() {
      const v = skillValues("ce_grace");
      hero.hp = Math.min(progress.stats.hp, hero.hp + v.parry);
      const damage = progress.stats.ad * (1 + v.parry * 0.1);
      ceriseFx("ce_grace", "pillar", atFloor(hero.x, hero.y, 26), { damage, sigil: "rose", lift: 30 });
      if (skillEvolved("ce_grace")) ceriseFx("ce_grace", "nova", atFloor(hero.x, hero.y, 30), { damage, quiet: true });
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
