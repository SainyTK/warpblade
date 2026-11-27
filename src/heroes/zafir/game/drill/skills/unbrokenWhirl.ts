import { drillSession, hastenSpells, readySpell } from "../../../../../drill";
import { progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { zafirFx } from "../../skillFx";
import { gainWhirl } from "../../whirl";

const ID = "za_unbroken";

export const UNBROKEN_WHIRL_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellCooldown *= values.preparation ?? 1;
  },
  slashed(strike, _landed, { values, evolved }) {
    const session = drillSession();
    if (strike !== "warp" || !session) {
      return;
    }
    gainWhirl(values.whirl);
    const { fighter } = session;
    const ring = { x: fighter.x, y: fighter.y, face: fighter.face, reach: 18 + (values.infuse ?? 0) * 4 };
    zafirFx(ID, "nova", ring, { damage: progress.stats.ad * (1 + (values.infuse ?? 0)) });
    if (evolved) {
      zafirFx(ID, "pillar", { x: fighter.x, y: fighter.y, reach: 26 }, { quiet: true, delay: 0.05 });
    }
    const book = fighter.spellBook;
    if (values.infuse && !fighter.swordInfusion) {
      fighter.swordInfusion = { spell: book.selected, remainingHits: values.infuse, age: 0 };
    }
    if (values.shorten) {
      hastenSpells(book, values.shorten);
    }
    if (evolved && values.ready) {
      readySpell(book, book.selected);
    }
  },
};
