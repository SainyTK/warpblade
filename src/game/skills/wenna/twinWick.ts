import type { SkillBehavior } from "../../../types/skillBehavior";
import { spawnWick } from "../../hero/wenna/wicks";
import { rng } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "w_twinWick";
/** a twin rises this far beside the Wick it twins */
const BESIDE = 9;

/**
 * Twin Wick: a Wick lit from her lamp may light a second beside it, past the cap and shorter lived; with its levels more
 * often, biting faster, living longer and two twins. Candelabra lights three with every press.
 */
export const twinWickSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    wick(_m, event) {
      if (!event.lit || event.cause !== "light") return;
      const v = skillValues(ID);
      const twins = v.candelabra ? 2 : rng.chance(v.chance) ? Math.round(v.count ?? 1) : 0;
      const life = withCharms("duration", v.life);
      for (let i = 0; i < twins; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        spawnWick(event.x + side * BESIDE * (1 + Math.floor(i / 2)), event.y, "twin", { extra: true, life });
      }
    },
  },
};
