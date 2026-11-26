import { drillSession } from "../../../../../drill";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { foesNear } from "../../strike";
import { abilityStrike } from "../strike";

const ID = "al_vow";

export const IRON_VOW_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.preparation *= values.preparation;
    m.infusionHits += values.infusion ?? 0;
  },
  slashed(strike, _landed, { values, evolved }) {
    const session = drillSession();
    if (strike !== "warp" || !session) {
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
    if (values.burst) {
      const spell = book.selected;
      const x = h.x + h.face * 12;
      session.elementImpacts.push({ spell, x, y: h.y - 16, face: h.face, age: 0, fromSword: false });
      for (const foe of foesNear(x, h.y - 16, spell.radius * 1.4)) {
        abilityStrike(foe, (spell.damage / 10) * values.burst, ID);
        spell.status?.(foe);
      }
    }
  },
};
