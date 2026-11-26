import { drillSession, hastenSpells, readySpell } from "../../../../../drill";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { gainWhirl } from "../../whirl";

export const UNBROKEN_WHIRL_DRILL: ZafirDrillSkill = {
  id: "za_unbroken",
  modify(m, { values }) {
    m.spellCooldown *= values.preparation ?? 1;
  },
  slashed(strike, _landed, { values, evolved }) {
    const session = drillSession();
    if (strike !== "warp" || !session) {
      return;
    }
    gainWhirl(values.whirl);
    const { fighter } = session;
    const book = fighter.spellBook;
    if (values.infuse && !fighter.swordInfusion) {
      fighter.swordInfusion = { spell: book.selected, remainingHits: values.infuse, age: 0 };
    }
    if (values.shorten) {
      hastenSpells(book, values.shorten);
    }
    if (evolved && values.ready) {
      readySpell(book, book.selected);
    }
  },
};
