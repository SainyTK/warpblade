import type { SkillBehavior } from "../../../types/skillBehavior";
import { soundRing } from "../../hero/jory/soundRing";
import { hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "j_leap";
/** Skybeat's blast lands this far under him, this wide */
const SKYBEAT = { below: 26, radius: 26, power: 0.7 } as const;

/**
 * Downbeat Leap: landing after a leap rings out round his feet, and with Skybeat each air jump drops a blast below him.
 * The leaps themselves live in his kit.
 */
export const leapSkill: SkillBehavior = {
  create: () => ({ leapt: false }),
  update(m) {
    if (!m.leapt || !hero.ground) return;
    m.leapt = false;
    const v = skillValues(ID);
    if (!v.ring) return;
    soundRing(hero.x, hero.y, withCharms("area", v.ring), {
      damage: progress.stats.ad * (v.power ?? 0),
      stagger: true,
      stun: v.stun,
    });
  },
  on: {
    jump(m, event) {
      if (!event.air) return;
      m.leapt = true;
      if (!skillValues(ID).skybeat) return;
      soundRing(hero.x, hero.y + SKYBEAT.below, withCharms("area", SKYBEAT.radius), {
        damage: progress.stats.ad * SKYBEAT.power,
        stagger: true,
      });
    },
  },
};
