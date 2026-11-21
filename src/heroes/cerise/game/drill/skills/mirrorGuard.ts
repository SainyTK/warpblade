import { markFoe } from "../../../../../game/enemies/skillStatus";
import { game, hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { createRoseLine } from "../../effects/roseLine";
import { roseMark } from "../../mark";
import { foesNear, spellStrike } from "./strike";

const ID = "ce_mirrorguard";

export const MIRROR_GUARD_DRILL: CeriseDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "line") {
      return;
    }
    spellStrike(foe, values.line, ID);
    if (values.taken) {
      markFoe(foe, ID, 3, values.taken);
    }
    const damage = progress.stats.ap * values.line * 0.5;
    if (values.mirrors) {
      game.fx.push(createRoseLine(foe.x, foe.y - 14, foe.x > hero.x ? -1 : 1, damage, ID));
    }
    if (values.mirrors > 1) {
      game.fx.push(createRoseLine(foe.x, foe.y - 24, -1, damage, ID));
      game.fx.push(createRoseLine(foe.x, foe.y - 24, 1, damage, ID));
    }
    if (evolved) {
      for (const near of foesNear(foe.x, foe.y - 14, values.garden)) {
        roseMark(near);
      }
    }
  },
  swordHit(foe, infusion, { values }) {
    if (infusion?.id === "line" && values.edge) {
      spellStrike(foe, values.edge, ID);
    }
  },
};
