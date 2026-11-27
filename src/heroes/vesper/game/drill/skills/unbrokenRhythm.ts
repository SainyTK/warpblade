import { drillFighter, drillSession, hastenSpells, readySpell } from "../../../../../drill";
import { hero, progress } from "../../../../../game/state";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";

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
      vesperFx(ID, { x: h.x, y: h.y, face: h.face }, { damage: progress.stats.ad * (1 + (values.prepare ?? 0)) });
      const book = session.fighter.spellBook;
      if (evolved) {
        readySpell(book, book.selected);
      } else {
        hastenSpells(book, values.prepare ?? 0);
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
    if (finisher) {
      vesperFx(ID, { x: h.x + h.face * 10, y: h.y, face: h.face }, { damage: progress.stats.ad * 1.6 });
    }
    h.warpReadyIn = finisher && values.finisher ? 0 : Math.max(0, h.warpReadyIn - values.warp);
    hero.warpCd = h.warpReadyIn;
  },
};
