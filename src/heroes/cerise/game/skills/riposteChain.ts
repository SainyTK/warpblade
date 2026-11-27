import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { releaseRoseLine } from "../abilities/roseLine";
import { atHero, ceriseFx } from "../fx";
import { roseMark } from "../mark";

/** Riposte Chain: links set the Rose mark, and every third link sends a Rose Line */
export const riposteChain: SkillBehavior = {
  create: () => ({}),
  on: {
    riposteLink(_m, event) {
      const v = skillValues("ce_riposte");
      const damage = progress.stats.ad * (1 + event.link * 0.25) * (1 + (v.bonus ?? 0)) * 2;
      ceriseFx("ce_riposte", "slash", atHero(20, 18, 12), { damage, sigil: "thrust", quiet: event.link > 1 });
      if (event.link === 1 && skillEvolved("ce_riposte")) {
        ceriseFx("ce_riposte", "slash", { ...atHero(22, 18), face: -hero.face }, { damage, quiet: true, delay: 0.06 });
      }
      if (v.mark && event.foe && event.foe.hp > 0) roseMark(event.foe);
      if (v.line && event.link % v.line === 0) releaseRoseLine(v.linePower, false);
    },
  },
};
