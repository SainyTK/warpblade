import { drillFighter } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { skillFx } from "../../../../../game/skillFx";
import { progress } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { skillStrike } from "../strike";

const ID = "k_passing";

export const PASSING_CUT_DRILL: KaelDrillSkill = {
  id: ID,
  dashed(foes, { values, evolved }) {
    const h = drillFighter();
    if (h && foes.length > 0) {
      const damage = progress.stats.ad * values.cut * foes.length;
      skillFx(ID, "trail", { x: h.x - h.face * 56, y: h.y - 15, face: h.face, toX: h.x, toY: h.y - 15 }, { damage });
      for (const foe of foes) {
        const [x, y] = enemyCenter(foe);
        const cut = { x: x - h.face * 6, y, face: h.face, reach: 12 };
        skillFx(ID, "slash", cut, { quiet: true, damage: progress.stats.ad * values.cut });
        if (evolved) {
          skillFx(ID, "slash", { x: x + h.face * 6, y, face: -h.face, reach: 12 }, { quiet: true, delay: 0.3 });
        }
      }
    }
    for (const foe of foes) {
      skillStrike(foe, values.cut, ID, { sureCrit: !!values.crit });
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (evolved) {
        later(0.3, () => skillStrike(foe, values.cut * values.phantom, ID));
      }
    }
    if (h && foes.length > 0 && values.refund) {
      h.dashReadyIn = 0;
    }
  },
};
