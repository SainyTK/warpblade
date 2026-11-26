import { drillSession, hastenSpells, readySpell } from "../../../../../drill";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";

export const INK_FLOW_DRILL: SayaDrillSkill = {
  id: SKILL.flow,
  modify(m, { values }) {
    m.spellCooldown *= values.preparation ?? 1;
    m.infusionHits += values.infusion ?? 0;
  },
  slashed(blow, _landed, { values, evolved }) {
    const session = drillSession();
    if (blow !== "warp" || !session) {
      return;
    }
    const h = session.fighter;
    const book = h.spellBook;
    if (!h.swordInfusion && values.charge) {
      h.swordInfusion = { spell: book.selected, remainingHits: values.charge, age: 0 };
    }
    if (values.hasten) {
      hastenSpells(book, values.hasten);
    }
    if (evolved) {
      readySpell(book, book.selected);
    }
  },
};
