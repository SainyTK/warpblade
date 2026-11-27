import { drillFighter } from "../../../../../drill";
import { hero, progress } from "../../../../../game/state";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { roundBlast } from "../../effects/roundBlast";
import { calderFx } from "../../skillFx";
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
    const streak = { x: hero.x - hero.face * 56, y: hero.y - 15, face: hero.face, toX: hero.x, toY: hero.y - 15 };
    calderFx(ID, "trail", streak, { damage: progress.stats.ad * values.round * Math.max(1, foes.length) });
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
      calderFx(
        ID,
        "burst",
        { x, y: hero.y - 14, face: -hero.face, reach: 10 },
        { damage: progress.stats.ad * values.backfire },
      );
      for (const foe of foesNear(x, hero.y - 14, 36)) {
        skillStrike(foe, values.backfire, ID, { kx: -hero.face * 120, ky: -40 });
      }
    }
  },
};
