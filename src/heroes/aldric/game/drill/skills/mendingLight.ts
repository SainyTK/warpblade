import { enemyCenter } from "../../../../../game/enemies/enemy";
import { game, hero, progress } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createDawnGround } from "../../effects/dawnGround";
import { lay } from "../../skills/penance";
import { abilityStrike } from "../strike";

const ID = "al_mend";
const GROUND_WIDTH = 36;
const cast = { laid: false };

export const MENDING_LIGHT_DRILL: AldricDrillSkill = {
  id: ID,
  tick() {
    cast.laid = false;
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "mend") {
      return;
    }
    hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * values.heal);
    abilityStrike(foe, values.extra ?? 0, ID);
    if (values.knock) {
      foe.vx += (foe.x > hero.x ? 1 : -1) * values.knock;
    }
    if (evolved) {
      lay(foe, values.penance);
    }
    if (values.ground && !cast.laid) {
      cast.laid = true;
      game.fx.push(createDawnGround(enemyCenter(foe)[0], GROUND_WIDTH, values.time, progress.stats.ap * values.ground));
    }
  },
};
