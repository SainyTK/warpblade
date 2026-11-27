import { drillFighter } from "../../../../../drill";
import { skillFx } from "../../../../../game/skillFx";
import { progress } from "../../../../../game/state";
import { dust } from "../../../../../game/world";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";

const ID = "k_skydance";
const dance = { wallLock: 0, grounded: true, slashed: false, swing: null as unknown };

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
      const kick = { x: h.x - h.face * 8, y: h.y - 16, face: -h.face, reach: 10 };
      skillFx(ID, "burst", kick, { damage: progress.stats.ad * values.kick });
      for (const foe of foesNear(h.x - h.face * 10, h.y - 16, 30)) {
        skillStrike(foe, values.kick, ID);
      }
    }
    if (h.swing?.kind === "air") {
      dance.slashed = true;
      if (dance.swing !== h.swing) {
        const at = { x: h.x, y: h.y - 16, face: h.face, reach: 16 };
        skillFx(ID, "slash", at, { damage: progress.stats.ad * (1 + (values.airSlashes ?? 0) * 0.3) });
      }
    }
    dance.swing = h.swing;
    if (h.grounded && !dance.grounded && dance.slashed && values.stomp) {
      const reach = evolved ? values.comet : 34;
      skillFx(ID, "nova", { x: h.x, y: h.y, reach }, { damage: progress.stats.ad * values.stomp });
      skillFx(ID, "pillar", { x: h.x, y: h.y, reach: 26 }, { quiet: true, damage: progress.stats.ad * values.stomp });
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
