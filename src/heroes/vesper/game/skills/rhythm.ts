import { skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";

const ID = "ve_rhythm";

/** Unbroken Rhythm: reaching the top of Tempo gives back MP from its sixth level; the rest of it is read by her Tempo */
export const unbrokenRhythm: SkillBehavior = {
  create: () => ({}),
  on: {
    tempoTop() {
      const mp = skillValues(ID).topMp;
      if (mp) hero.mp = Math.min(progress.stats.mp, hero.mp + mp);
    },
  },
};
