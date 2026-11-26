import { drillSession, hastenSpells, readySpell } from "../../../../../drill";
import type { YunDrillSkill } from "../../../types/drillSkill";

const ID = "yu_harmony";

export const HARMONY_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= values.preparation ?? 1;
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
    if (values.shorten) {
      hastenSpells(book, values.shorten);
    }
    if (evolved) {
      readySpell(book, book.selected);
    }
  },
};
