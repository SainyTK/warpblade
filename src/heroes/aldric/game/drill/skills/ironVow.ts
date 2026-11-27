import { drillSession, hastenSpells, readySpell } from "../../../../../drill";
import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { aldricFx } from "../../fx";
import { foesNear } from "../../strike";
import { abilityStrike } from "../strike";

const ID = "al_vow";

export const IRON_VOW_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= values.preparation;
    m.infusionHits += values.infusion ?? 0;
  },
  slashed(strike, _landed, { values, evolved }) {
    const session = drillSession();
    if (strike !== "warp" || !session) {
      return;
    }
    const h = session.fighter;
    const floor = surfaceBelow(h.x, h.y - 2);
    aldricFx(
      ID,
      "pillar",
      { x: h.x, y: floor, face: h.face, reach: 24 },
      {
        damage: progress.stats.ap * (1 + (values.burst ?? 0)) * 2,
        sigil: "sword",
        lift: 14,
      },
    );
    if (evolved) {
      aldricFx(ID, "nova", { x: h.x, y: floor, reach: 30 }, { quiet: true, delay: 0.06 });
    }
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
      const x = h.x + h.face * 12;
      session.elementImpacts.push({ spell, x, y: h.y - 16, face: h.face, age: 0, fromSword: false });
      for (const foe of foesNear(x, h.y - 16, spell.radius * 1.4)) {
        abilityStrike(foe, (spell.damage / 10) * values.burst, ID);
        spell.status?.(foe);
      }
    }
  },
};
