import { drillSession } from "../../../../../drill";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";

export const INK_FLOW_DRILL: SayaDrillSkill = {
  id: SKILL.flow,
  modify(m, { values }) {
    m.preparation *= values.preparation ?? 1;
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
    if (book.preparation && values.hasten) {
      book.preparation.remaining = Math.max(0, book.preparation.remaining - values.hasten);
    }
    if (evolved && !book.preparation) {
      book.preparation = { duration: 0, remaining: 0, readyAge: 0 };
    }
  },
};
