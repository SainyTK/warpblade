import { drillFighter } from "../../../../../drill";
import { hero, progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { leaveMirage } from "../../mirage";
import { zafirFx } from "../../skillFx";
import { openWounds } from "../../wounds";
import { blindMinion } from "../strike";

const UNTOUCHABLE = 0.05;
const start = { x: 0, y: 0, dashing: false };

const ID = "za_slip";

export const SAND_SLIP_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes;
  },
  tick(_dt, { values }) {
    const h = drillFighter();
    const dashing = !!h && h.dashTime > 0;
    if (h && dashing && !start.dashing) {
      start.x = h.x;
      start.y = h.y;
    }
    start.dashing = dashing;
    if (dashing && values.untouchable) {
      hero.inv = Math.max(hero.inv, UNTOUCHABLE);
    }
  },
  dashed(foes, { values, evolved }) {
    if (!foes.length) {
      return;
    }
    const f = drillFighter();
    if (f) {
      const streak = { x: start.x, y: start.y - 15, face: f.face, toX: f.x - f.face * 8, toY: f.y - 15 };
      zafirFx(ID, "trail", streak, { damage: progress.stats.ad * (1 + (values.cloud ?? 0)) });
    }
    for (const foe of foes) {
      blindMinion(foe, values.cloud ?? 0);
      openWounds(foe, values.wounds ?? 0);
    }
    const h = drillFighter();
    if (h && values.refresh) {
      h.dashReadyIn = 0;
      if (!h.grounded) {
        h.airDashes++;
      }
    }
    if (evolved) {
      leaveMirage(start.x, start.y);
      zafirFx(ID, "pillar", { x: start.x, y: start.y, reach: 24 }, { quiet: true });
    }
  },
};
