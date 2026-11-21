import { drillFighter } from "../../../../../drill";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { roseMark } from "../../mark";
import { foesAhead, skillStrike } from "./strike";

const ID = "ce_riposte";
const riposte = { clock: 0, until: 0 };

export const RIPOSTE_CHAIN_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values, evolved }) {
    m.parryWindow *= 1 + values.window;
    if (evolved && riposte.clock < riposte.until) {
      m.strikeDamage *= 1 + values.flow;
    }
  },
  tick(dt) {
    riposte.clock += dt;
  },
  moment(moment, { values, evolved }) {
    if (moment !== "parry") {
      return;
    }
    const targets = foesAhead(values.pierce ? 64 : 44);
    for (const foe of values.pierce ? targets : targets.slice(0, 1)) {
      skillStrike(foe, values.riposte, ID, { sureCrit: true });
      if (values.mark) {
        roseMark(foe);
      }
    }
    const h = drillFighter();
    if (values.refresh && h) {
      h.dashReadyIn = 0;
      h.airDashes = Math.max(h.airDashes, 1);
    }
    if (evolved) {
      riposte.until = riposte.clock + values.flowTime;
    }
  },
};
