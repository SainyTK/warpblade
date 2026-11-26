import { drillFighter, hastenSpells, readySpell } from "../../../../../drill";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { heal } from "./heal";

const ID = "ce_grace";

export const GRACE_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= 1 - values.preparation;
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
    if (evolved) {
      readySpell(h.spellBook, h.spellBook.selected);
    } else if (values.hasten) {
      hastenSpells(h.spellBook, values.hasten);
    }
  },
};
