import { drillFighter } from "../../../../../drill";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFloor, ceriseFx } from "../../fx";

const ID = "ce_poise";
const poise = { empowered: false, wasDashing: false };
rememberPerSeat(hostMemory(poise));

export const POISE_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes;
    if (poise.empowered) {
      m.strikeDamage *= 1 + values.empower;
    }
  },
  slashed() {
    poise.empowered = false;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const dashing = h.dashTime > 0;
    if (dashing && values.untouchable) {
      hero.inv = Math.max(hero.inv, 0.05);
    }
    if (dashing && !poise.wasDashing) {
      const damage = progress.stats.ad * (1 + values.empower) * 2;
      ceriseFx(ID, "wave", atFloor(hero.x - hero.face * 6, hero.y, 16), { damage, sigil: "thrust", lift: 16 });
      if (evolved) ceriseFx(ID, "nova", atFloor(hero.x, hero.y, 26), { damage, quiet: true });
      poise.empowered = values.empower > 0;
      if (evolved) {
        h.warpReadyIn = 0;
      }
    }
    poise.wasDashing = dashing;
  },
  moment(moment, { values }) {
    const h = drillFighter();
    if (moment === "airDash" && values.airReset && h) {
      h.airSlashes = 0;
    }
  },
};
