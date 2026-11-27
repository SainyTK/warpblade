import { drillFighter, hastenSpells, readySpell } from "../../../../../drill";
import { hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFloor, ceriseFx } from "../../fx";
import { heal } from "./heal";

const ID = "ce_grace";

export const GRACE_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= 1 - values.preparation;
    m.infusionHits += values.hits;
  },
  swordHit(_foe, infusion, { values }) {
    if (infusion) {
      heal(values.infusedHeal ?? 0);
    }
  },
  moment(moment, { values, evolved }) {
    const h = drillFighter();
    if (moment !== "arrival" || !h) {
      return;
    }
    if (!h.swordInfusion) {
      h.swordInfusion = { spell: h.spellBook.selected, remainingHits: values.infuse, age: 0 };
    }
    heal(values.heal ?? 0);
    const damage = progress.stats.ap * (1 + values.infuse * 0.5);
    ceriseFx(ID, "pillar", atFloor(hero.x, hero.y, 26), { damage, sigil: "rose", lift: 30 });
    if (evolved) ceriseFx(ID, "nova", atFloor(hero.x, hero.y, 30), { damage, quiet: true, delay: 0.05 });
    if (evolved) {
      readySpell(h.spellBook, h.spellBook.selected);
    } else if (values.hasten) {
      hastenSpells(h.spellBook, values.hasten);
    }
  },
};
