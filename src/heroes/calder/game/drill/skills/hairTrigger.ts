import { enemyCenter } from "../../../../../game/enemies/enemy";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { hero, progress } from "../../../../../game/state";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { calderFx } from "../../skillFx";
import { fireRound } from "../round";
import { struckThisSwing } from "../trigger";

const ID = "ca_trigger";

export const HAIR_TRIGGER_DRILL: CalderDrillSkill = {
  id: ID,
  slashed(strike, landed, { values, evolved }) {
    const foe = struckThisSwing()[0];
    if (!landed || !foe || !(strike === "first" || (strike === "second" && values.second))) {
      return;
    }
    const shots = evolved ? 2 : 1;
    const damage = progress.stats.ad * values.round * shots;
    const cut = { x: hero.x + hero.face * 16, y: hero.y - 18, face: hero.face, reach: 14 };
    calderFx(ID, "slash", cut, { damage });
    const [x, y] = enemyCenter(foe);
    calderFx(ID, "burst", { x, y, face: hero.face, reach: 7 }, { damage, quiet: true, delay: 0.04 });
    for (let i = 0; i < shots; i++) {
      fireRound(foe, { power: values.round, kind: "trigger", hot: !!values.hot, stagger: values.stagger, source: ID });
    }
    if (values.mark && foe.hp > 0) {
      markFoe(foe, ID, 3, values.mark);
    }
  },
};
