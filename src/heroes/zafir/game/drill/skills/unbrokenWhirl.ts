import { drillSession } from "../../../../../drill";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { gainWhirl } from "../../whirl";

export const UNBROKEN_WHIRL_DRILL: ZafirDrillSkill = {
  id: "za_unbroken",
  modify(m, { values }) {
    m.preparation *= values.preparation ?? 1;
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
    if (book.preparation && values.shorten) {
      book.preparation.remaining = Math.max(0, book.preparation.remaining - values.shorten);
    }
    if (evolved && values.ready) {
      book.preparation = { duration: 0, remaining: 0, readyAge: 0 };
    }
  },
};
