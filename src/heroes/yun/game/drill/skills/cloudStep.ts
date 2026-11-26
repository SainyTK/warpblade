import { drillFighter } from "../../../../../drill";
import { game } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createQiRing } from "../../effects/qiRing";
import { foesNear, skillStrike } from "../strike";

const ID = "yu_cloud";
const KICK_RADIUS = 30;
const step = { wallLock: 0, grounded: true, slashed: false };

export const CLOUD_STEP_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes ?? 0;
    m.airDashes += values.airDashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    if (h.wallLock > step.wallLock && values.kick) {
      game.fx.push(createQiRing(h.x - h.face * 8, h.y - 16, KICK_RADIUS));
      for (const foe of foesNear(h.x - h.face * 8, h.y - 16, KICK_RADIUS)) {
        skillStrike(foe, values.kick, ID);
      }
    }
    if (h.swing?.kind === "air") {
      step.slashed = true;
    }
    if (h.grounded && !step.grounded && step.slashed && values.land) {
      const radius = evolved ? values.walker : 34;
      game.fx.push(createQiRing(h.x, h.y - 4, radius));
      for (const foe of foesNear(h.x, h.y - 10, radius)) {
        skillStrike(foe, values.land, ID);
        if (evolved) {
          foe.halt = Math.max(foe.halt, 1);
        }
      }
    }
    if (h.grounded) {
      step.slashed = false;
    }
    step.wallLock = h.wallLock;
    step.grounded = h.grounded;
  },
};
