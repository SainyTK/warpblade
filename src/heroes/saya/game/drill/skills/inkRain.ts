import { markFoe } from "../../../../../game/enemies/skillStatus";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { sayaFx } from "../../skillFx";
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
    const showers = 1 + (values.second ? 1 : 0) + (evolved ? (values.showers ?? 0) : 0);
    sayaFx(
      SKILL.rain,
      { x: foe.x, y: surfaceBelow(foe.x, foe.y - 4), face: hero.face },
      { damage: (spell.damage / 10) * progress.stats.ap * (1 + (values.power ?? 0)) * showers },
    );
    foe.halt = Math.max(foe.halt, 0.9 + values.hold);
    spellBonus(foe, spell, values.power ?? 0, SKILL.rain);
    if (values.mark) {
      markFoe(foe, SKILL.rain, MARK_TIME, values.mark);
    }
    for (let i = 1; i < showers; i++) {
      later(SHOWER_GAP * i, () => spellBonus(foe, spell, values.second ?? 0.5, SKILL.rain));
    }
  },
};
