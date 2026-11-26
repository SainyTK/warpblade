import { drillFighter, hastenSpells, readySpell } from "../../../../../drill";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { showEcho } from "../../phantom";

const ID = "br_cry";
const ECHO_LIFE = 0.3;

export const WAR_CRY_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= values.prepare ?? 1;
    m.infusionHits += values.infusion ?? 0;
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "warp" || !h) {
      return;
    }
    const book = h.spellBook;
    if (evolved) {
      readySpell(book, book.selected);
    } else if (values.hasten) {
      hastenSpells(book, values.hasten);
    }
    h.swordInfusion = { spell: book.selected, remainingHits: values.hits, age: 0 };
    showEcho(h.x, h.y, h.face, ECHO_LIFE);
  },
};
