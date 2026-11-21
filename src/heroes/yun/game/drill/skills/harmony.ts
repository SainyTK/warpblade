import { drillSession } from "../../../../../drill";
import type { YunDrillSkill } from "../../../types/drillSkill";

const ID = "yu_harmony";

export const HARMONY_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.preparation *= values.preparation ?? 1;
    m.infusionHits += values.infusionHits ?? 0;
  },
  slashed(strike, _landed, { values, evolved }) {
    const session = drillSession();
    if (strike !== "warp" || !session) {
      return;
    }
    const h = session.fighter;
    const book = h.spellBook;
    if (!h.swordInfusion && values.infuse) {
      h.swordInfusion = { spell: book.selected, remainingHits: values.infuse, age: 0 };
    }
    if (book.preparation && values.shorten) {
      book.preparation.remaining = Math.max(0, book.preparation.remaining - values.shorten);
    }
    if (evolved && !book.preparation) {
      book.preparation = { duration: 0, remaining: 0, readyAge: 0 };
    }
  },
};
