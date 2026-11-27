import { enemyCenter } from "../../../../../game/enemies/enemy";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createDawnGround } from "../../effects/dawnGround";
import { aldricFx } from "../../fx";
import { lay } from "../../skills/penance";
import { abilityStrike } from "../strike";

const ID = "al_mend";
const GROUND_WIDTH = 36;
const cast = { laid: false };
rememberPerSeat(hostMemory(cast));

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
    if (!cast.laid) {
      aldricFx(
        ID,
        "nova",
        { x: hero.x, y: surfaceBelow(hero.x, hero.y - 2), face: hero.face, reach: 22 },
        {
          damage: progress.stats.ap * (spell.damage / 10 + (values.extra ?? 0)),
          sigil: "shield",
          lift: 20,
        },
      );
      const [mx, my] = enemyCenter(foe);
      aldricFx(ID, "mark", { x: mx, y: my }, { quiet: true });
    }
    abilityStrike(foe, values.extra ?? 0, ID);
    if (values.knock) {
      foe.vx += (foe.x > hero.x ? 1 : -1) * values.knock;
    }
    if (evolved) {
      lay(foe, values.penance);
    }
    const first = !cast.laid;
    cast.laid = true;
    if (values.ground && first) {
      game.fx.push(createDawnGround(enemyCenter(foe)[0], GROUND_WIDTH, values.time, progress.stats.ap * values.ground));
    }
  },
};
