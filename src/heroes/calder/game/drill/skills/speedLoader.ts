import { drillFighter, drillSession } from "../../../../../drill";
import { hero } from "../../../../../game/state";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { fireRound } from "../round";
import { foesNear } from "../targets";

const ID = "ca_speedload";

export const SPEED_LOADER_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.preparation *= 1 - (values.prep ?? 0);
    m.infusionHits += values.hits ?? 0;
  },
  slashed(strike, _landed, { values, evolved }) {
    const session = drillSession();
    const h = drillFighter();
    if (strike !== "warp" || !session || !h) {
      return;
    }
    const book = h.spellBook;
    if (!h.swordInfusion) {
      h.swordInfusion = { spell: book.selected, remainingHits: values.infuse, age: 0 };
    }
    if (book.preparation && values.shorten) {
      book.preparation.remaining = Math.max(0, book.preparation.remaining - values.shorten);
    }
    if (evolved) {
      book.preparation = { duration: 0.01, remaining: 0, readyAge: 0 };
    }
    if (values.burst) {
      for (const foe of foesNear(hero.x + hero.face * 12, hero.y - 16, book.selected.radius + 10)) {
        fireRound(foe, { power: values.burst, kind: "shot", source: ID });
      }
    }
  },
};
