import { drillFighter } from "../../../../../drill";
import { hero } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { leaveMirage } from "../../mirage";
import { openWounds } from "../../wounds";
import { blindMinion } from "../strike";

const UNTOUCHABLE = 0.05;
const start = { x: 0, y: 0, dashing: false };

export const SAND_SLIP_DRILL: ZafirDrillSkill = {
  id: "za_slip",
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
    }
  },
};
