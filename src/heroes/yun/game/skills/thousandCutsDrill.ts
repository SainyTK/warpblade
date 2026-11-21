import { SPELL_IMPACT_TIME } from "../../../../drill";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { YUN_SPELLS } from "../drill/spells";
import { lotusEnded, thousandCuts } from "./thousandCuts";

interface Memory extends SkillMemory {
  lotusEnds: number[];
}

const LOTUS = YUN_SPELLS.find((spell) => spell.id === "lotus");
const LOTUS_LIFE = (LOTUS?.delay ?? 0) + SPELL_IMPACT_TIME;

export const thousandCutsDrill: SkillBehavior = {
  create: (): Memory => ({ lotusEnds: [] }),
  update(memory, _s, dt) {
    const m = memory as Memory;
    m.lotusEnds = m.lotusEnds.map((left) => left - dt);
    for (const left of m.lotusEnds) {
      if (left <= 0) lotusEnded();
    }
    m.lotusEnds = m.lotusEnds.filter((left) => left > 0);
  },
  on: {
    ...thousandCuts.on,
    cast(memory, e) {
      if (e.ability === LOTUS?.id) (memory as Memory).lotusEnds.push(LOTUS_LIFE);
    },
  },
};
