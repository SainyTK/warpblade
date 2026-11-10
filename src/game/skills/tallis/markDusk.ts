import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { isMarked } from "../../hero/tallis/marks";
import { skillEvolved } from "../query";

const ID = "t_markDusk";
/** Death Sentence: a marked foe under this share of its HP dies; a mini boss under it takes this many times the blow */
const SENTENCE = { under: 0.3, mini: 2 } as const;

/** Mark of Dusk marks in his kit; once evolved, a blow on a marked foe that falls under 30% HP finishes it (Death Sentence) */
export const markDuskSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, event) {
      const e = event.foe;
      if (!skillEvolved(ID) || e.hp <= 0 || !isMarked(e) || e.hp > e.max * SENTENCE.under || e.rank === "boss") return;
      dealDamage(e, e.rank === "mini" ? event.damage * SENTENCE.mini : e.hp * 4, { source: ID });
    },
  },
};
