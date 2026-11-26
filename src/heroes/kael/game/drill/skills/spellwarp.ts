import { drillSession, hastenSpells, readySpell } from "../../../../../drill";
import { dealDamage } from "../../../../../game/damage";
import { progress } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesNear } from "../strike";

const ID = "k_spellwarp";

export const SPELLWARP_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= values.preparation ?? 1;
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
    if (values.hasten) {
      hastenSpells(book, values.hasten);
    }
    if (evolved) {
      readySpell(book, book.selected);
    }
    if (values.burst) {
      const spell = book.selected;
      session.elementImpacts.push({ spell, x: h.x + h.face * 12, y: h.y - 16, face: h.face, age: 0, fromSword: false });
      for (const foe of foesNear(h.x + h.face * 12, h.y - 16, spell.radius * 1.4)) {
        dealDamage(foe, (spell.damage / 10) * progress.stats.ap * values.burst, { fromX: h.x, source: ID });
        foe.frozen = Math.max(foe.frozen, spell.freeze);
      }
    }
  },
};
