import { enemyCenter } from "../../../../../game/enemies/enemy";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { game, progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createDelayed } from "../../effects/delayed";
import { createQiRing } from "../../effects/qiRing";
import { CAGE, isLead, yunFx } from "../../fx";
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
    const floor = foe.air ? y + 10 : foe.y;
    yunFx(
      ID,
      "nova",
      { x: foe.x, y: floor, reach: 16 },
      { damage: progress.stats.ap * values.bonus, quiet: !isLead(ID), signature: CAGE },
    );
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
          yunFx(
            ID,
            "spikes",
            { x, y: floor, reach: spell.radius * 0.6 },
            { quiet: i > 0 || !evolved, damage: progress.stats.ap * (values.second ?? values.bonus), signature: CAGE },
          );
          for (const near of foesNear(x, y, spell.radius)) {
            spellStrike(near, values.second ?? values.bonus, ID);
          }
        }),
      );
    }
  },
};
