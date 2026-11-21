import { drillFighter } from "../../../../../drill";
import { hero } from "../../../../../game/state";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { roundBlast } from "../../effects/roundBlast";
import { fireRound } from "../round";
import { skillStrike } from "../strike";
import { foesNear } from "../targets";

const ID = "ca_recoil";

export const RECOIL_DASH_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  dashed(foes, { values, evolved }) {
    for (const foe of foes) {
      fireRound(foe, { power: values.round, kind: "shot", hot: !!values.hot, source: ID });
      if (values.launch && foe.hp > 0) {
        foe.vy = Math.min(foe.vy, -160);
      }
    }
    const h = drillFighter();
    if (values.refund && foes.length > 0 && h && !h.grounded) {
      h.airDashes++;
    }
    if (evolved) {
      const x = hero.x - hero.face * 18;
      roundBlast(x, hero.y - 14, -hero.face, true, true);
      for (const foe of foesNear(x, hero.y - 14, 36)) {
        skillStrike(foe, values.backfire, ID, { kx: -hero.face * 120, ky: -40 });
      }
    }
  },
};
