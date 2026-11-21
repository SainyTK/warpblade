import { drillFighter, drillSession, SPELL_PREPARATION } from "../../../../../drill";
import { hero } from "../../../../../game/state";
import type { VesperDrillSkill } from "../../../types/drillSkill";

const ID = "ve_rhythm";

export const UNBROKEN_RHYTHM_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.infusionHits += values.infusion ?? 0;
  },
  slashed(strike, landed, { values, evolved }) {
    const h = drillFighter();
    const session = drillSession();
    if (!h || !session) {
      return;
    }
    if (strike === "warp") {
      const book = session.fighter.spellBook;
      if (evolved) {
        book.preparation = { remaining: 0, duration: SPELL_PREPARATION, readyAge: book.preparation?.readyAge ?? 0 };
      } else if (book.preparation) {
        book.preparation.remaining = Math.max(0, book.preparation.remaining - (values.prepare ?? 0));
      }
      if (values.dash) {
        h.dashReadyIn = 0;
      }
      return;
    }
    if (!landed) {
      return;
    }
    const finisher = session.profile.strikes[strike].finisher;
    h.warpReadyIn = finisher && values.finisher ? 0 : Math.max(0, h.warpReadyIn - values.warp);
    hero.warpCd = h.warpReadyIn;
  },
};
