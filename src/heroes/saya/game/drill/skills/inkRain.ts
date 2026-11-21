import { markFoe } from "../../../../../game/enemies/skillStatus";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { spellBonus } from "./spellPower";

const MARK_TIME = 3;
const SHOWER_GAP = 0.3;

export const INK_RAIN_DRILL: SayaDrillSkill = {
  id: SKILL.rain,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "rain") {
      return;
    }
    foe.halt = Math.max(foe.halt, 0.9 + values.hold);
    spellBonus(foe, spell, values.power ?? 0, SKILL.rain);
    if (values.mark) {
      markFoe(foe, SKILL.rain, MARK_TIME, values.mark);
    }
    const showers = (values.second ? 1 : 0) + (evolved ? values.showers : 0);
    for (let i = 1; i <= showers; i++) {
      later(SHOWER_GAP * i, () => spellBonus(foe, spell, values.second ?? 0.5, SKILL.rain));
    }
  },
};
