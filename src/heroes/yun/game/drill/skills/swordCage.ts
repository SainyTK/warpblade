import { enemyCenter } from "../../../../../game/enemies/enemy";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { game } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createDelayed } from "../../effects/delayed";
import { createQiRing } from "../../effects/qiRing";
import { foesNear, spellStrike } from "../strike";

const ID = "yu_cage";
const CAGE_MARK = 3;
const PULL = 140;
const SECOND_CUT = 0.4;
const PRISON_EVERY = 0.35;

export const SWORD_CAGE_DRILL: YunDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "lotus") {
      return;
    }
    foe.halt = Math.max(foe.halt, values.halt);
    spellStrike(foe, values.bonus, ID);
    if (values.pin) {
      foe.pinned = Math.max(foe.pinned, values.halt);
    }
    if (values.mark) {
      markFoe(foe, ID, CAGE_MARK, values.mark);
    }
    const [x, y] = enemyCenter(foe);
    if (values.pull) {
      for (const near of foesNear(x, y, values.pull)) {
        near.vx += Math.sign(x - near.x) * PULL;
      }
    }
    const cuts = (values.second ? 1 : 0) + (evolved ? values.prison : 0);
    for (let i = 0; i < cuts; i++) {
      game.fx.push(
        createDelayed(SECOND_CUT + i * PRISON_EVERY, () => {
          game.fx.push(createQiRing(x, y, spell.radius));
          for (const near of foesNear(x, y, spell.radius)) {
            spellStrike(near, values.second ?? values.bonus, ID);
          }
        }),
      );
    }
  },
};
