import { drillFighter } from "../../../../../drill";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { skillFx } from "../../../../../game/skillFx";
import { hero, progress } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { foesNear, skillStrike } from "../strike";

const ID = "k_blink";
const blink = { dashing: false };
rememberPerSeat(hostMemory(blink));

export const BLINK_STEP_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const dashing = h.dashTime > 0;
    if (dashing) {
      hero.inv = Math.max(hero.inv, values.inv);
    }
    if (dashing && !blink.dashing) {
      const at = { x: h.x, y: h.y - 15, face: h.face, toX: h.x + h.face * 46, toY: h.y - 15 };
      skillFx(ID, "trail", at, { damage: progress.stats.ad * (values.after ?? 0.5), quiet: !values.after });
      if (h.airDashActive && values.refresh) {
        h.airSlashes = 0;
      }
      if (values.after) {
        const x = h.x;
        const y = h.y - 16;
        const radius = evolved ? values.shadow : 24;
        const cut = () => {
          skillFx(
            ID,
            "slash",
            { x, y, face: h.face, reach: radius * 0.7 },
            { damage: progress.stats.ad * values.after },
          );
          for (const foe of foesNear(x, y, radius)) {
            skillStrike(foe, values.after, ID);
          }
        };
        later(0.25, cut);
        if (evolved) {
          later(0.45, cut);
        }
      }
    }
    blink.dashing = dashing;
  },
};
