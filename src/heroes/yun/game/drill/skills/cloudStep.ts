import { drillFighter } from "../../../../../drill";
import { game, progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createQiRing } from "../../effects/qiRing";
import { CLOUD, yunFx } from "../../fx";
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
      const kick = { x: h.x - h.face * 8, y: h.y - 16, face: h.face, reach: KICK_RADIUS * 0.4 };
      yunFx(ID, "burst", kick, { damage: progress.stats.ad * values.kick, signature: CLOUD });
      for (const foe of foesNear(h.x - h.face * 8, h.y - 16, KICK_RADIUS)) {
        skillStrike(foe, values.kick, ID);
      }
    }
    if (h.swing?.kind === "air" && !step.slashed && !h.grounded) {
      yunFx(ID, "burst", { x: h.x, y: h.y + 2, face: h.face, reach: 8 }, { signature: CLOUD });
    }
    if (h.swing?.kind === "air") {
      step.slashed = true;
    }
    if (h.grounded && !step.grounded && step.slashed && values.land) {
      const radius = evolved ? values.walker : 34;
      game.fx.push(createQiRing(h.x, h.y - 4, radius));
      const ring = { x: h.x, y: h.y, face: h.face, reach: radius * 0.6 };
      yunFx(ID, "nova", ring, { damage: progress.stats.ad * values.land, signature: CLOUD });
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
