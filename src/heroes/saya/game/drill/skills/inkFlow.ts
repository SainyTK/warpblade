import { drillSession, hastenSpells, readySpell } from "../../../../../drill";
import { progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { sayaFx } from "../../skillFx";

export const INK_FLOW_DRILL: SayaDrillSkill = {
  id: SKILL.flow,
  modify(m, { values }) {
    m.spellCooldown *= values.preparation ?? 1;
    m.infusionHits += values.infusion ?? 0;
  },
  slashed(blow, _landed, { values, evolved }) {
    const session = drillSession();
    if (blow !== "warp" || !session) {
      return;
    }
    const h = session.fighter;
    sayaFx(
      SKILL.flow,
      { x: h.x, y: h.y, face: h.face },
      { damage: progress.stats.ap * (1 + (values.charge ?? 0)) * (evolved ? 2 : 1) },
    );
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
  },
};
