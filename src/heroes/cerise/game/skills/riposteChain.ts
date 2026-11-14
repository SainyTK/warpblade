import { skillValues } from "../../../../game/skills/query";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { releaseRoseLine } from "../abilities/roseLine";
import { roseMark } from "../mark";

/** Riposte Chain: links set the Rose mark, and every third link sends a Rose Line */
export const riposteChain: SkillBehavior = {
  create: () => ({}),
  on: {
    riposteLink(_m, event) {
      const v = skillValues("ce_riposte");
      if (v.mark && event.foe && event.foe.hp > 0) roseMark(event.foe);
      if (v.line && event.link % v.line === 0) releaseRoseLine(v.linePower, false);
    },
  },
};
