import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";
import { sendWave } from "./qiWave";

const ID = "yu_petal";
const PETAL_REACH = 40;
const dance = { grounded: true, slashed: false };

export const PETAL_STORM_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes ?? 0;
  },
  slashed(strike, landed, { values }) {
    const h = drillFighter();
    if (strike !== "air" || !h) {
      return;
    }
    dance.slashed = true;
    if (!landed) {
      return;
    }
    for (const foe of foesNear(h.x + h.face * 10, h.y + 4, PETAL_REACH)) {
      skillStrike(foe, values.petal, ID);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
    }
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    if (h.grounded && !dance.grounded && dance.slashed && evolved) {
      for (const face of [-1, 1]) {
        sendWave({ x: h.x, y: h.y - 6, face, reach: 110, power: values.bloom, source: ID });
      }
    }
    if (h.grounded) {
      dance.slashed = false;
    }
    dance.grounded = h.grounded;
  },
};
