import { drillFighter, drillSession, hastenSpells, readySpell } from "../../../../../drill";
import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { calderRing } from "../../skillFx";
import { fireRound } from "../round";
import { foesNear } from "../targets";

const ID = "ca_speedload";

export const SPEED_LOADER_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= 1 - (values.prep ?? 0);
    m.infusionHits += values.hits ?? 0;
  },
  slashed(strike, _landed, { values, evolved }) {
    const session = drillSession();
    const h = drillFighter();
    if (strike !== "warp" || !session || !h) {
      return;
    }
    const book = h.spellBook;
    const ring = {
      x: h.x,
      y: surfaceBelow(h.x, h.y - 2),
      face: h.face,
      reach: 12 + values.infuse,
    };
    calderRing(ID, "wave", ring, { damage: progress.stats.ad * (values.burst ?? 0.6) * 2 });
    if (!h.swordInfusion) {
      h.swordInfusion = { spell: book.selected, remainingHits: values.infuse, age: 0 };
    }
    if (values.shorten) {
      hastenSpells(book, values.shorten);
    }
    if (evolved) {
      readySpell(book, book.selected);
    }
    if (values.burst) {
      for (const foe of foesNear(h.x + h.face * 12, h.y - 16, book.selected.radius + 10)) {
        fireRound(foe, { power: values.burst, kind: "shot", source: ID });
      }
    }
  },
};
