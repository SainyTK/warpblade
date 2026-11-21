import { drillFighter } from "../../../../../drill";
import { dust } from "../../../../../game/world";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";

const ID = "k_skydance";
const dance = { wallLock: 0, grounded: true, slashed: false };

export const SKY_DANCE_DRILL: KaelDrillSkill = {
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
    if (h.wallLock > dance.wallLock && values.kick) {
      for (const foe of foesNear(h.x - h.face * 10, h.y - 16, 30)) {
        skillStrike(foe, values.kick, ID);
      }
    }
    if (h.swing?.kind === "air") {
      dance.slashed = true;
    }
    if (h.grounded && !dance.grounded && dance.slashed && values.stomp) {
      const reach = evolved ? values.comet : 34;
      for (const foe of foesNear(h.x, h.y - 10, reach)) {
        skillStrike(foe, values.stomp, ID, { stun: 0.5 });
        if (evolved) {
          foe.vx += (h.x - foe.x > 0 ? 1 : -1) * 120;
        }
      }
      dust(h.x, h.y, 8, 0);
    }
    if (h.grounded) {
      dance.slashed = false;
    }
    dance.wallLock = h.wallLock;
    dance.grounded = h.grounded;
  },
};
