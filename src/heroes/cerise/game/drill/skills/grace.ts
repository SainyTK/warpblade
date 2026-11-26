import { drillFighter, SPELL_PREPARATION } from "../../../../../drill";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { heal } from "./heal";

const ID = "ce_grace";

export const GRACE_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.preparation *= 1 - values.preparation;
    m.infusionHits += values.hits;
  },
  swordHit(_foe, infusion, { values }) {
    if (infusion) {
      heal(values.infusedHeal ?? 0);
    }
  },
  moment(moment, { values, evolved }) {
    const h = drillFighter();
    if (moment !== "arrival" || !h) {
      return;
    }
    if (!h.swordInfusion) {
      h.swordInfusion = { spell: h.spellBook.selected, remainingHits: values.infuse, age: 0 };
    }
    heal(values.heal ?? 0);
    const preparation = h.spellBook.preparation;
    if (evolved) {
      h.spellBook.preparation = { remaining: 0, duration: preparation?.duration ?? SPELL_PREPARATION, readyAge: 0 };
    } else if (preparation && values.hasten) {
      preparation.remaining = Math.max(0, preparation.remaining - values.hasten);
    }
  },
};
