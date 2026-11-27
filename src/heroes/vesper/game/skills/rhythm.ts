import { skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { vesperFx } from "../skillFx";

const ID = "ve_rhythm";

/** Unbroken Rhythm: reaching the top of Tempo gives back MP from its sixth level; the rest of it is read by her Tempo */
export const unbrokenRhythm: SkillBehavior = {
  create: () => ({}),
  on: {
    tempoTop() {
      vesperFx(ID, { x: hero.x, y: hero.y, face: hero.face }, { damage: progress.stats.ad * 1.6 });
      const mp = skillValues(ID).topMp;
      if (mp) hero.mp = Math.min(progress.stats.mp, hero.mp + mp);
    },
  },
};
