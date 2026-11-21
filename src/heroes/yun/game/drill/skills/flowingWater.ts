import { drillFighter } from "../../../../../drill";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { sendWave } from "./qiWave";

const ID = "yu_flow";

export const FLOWING_WATER_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.strikeReach *= values.reachShare ?? 1;
  },
  slashed(strike, landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "first" || !landed || !h) {
      return;
    }
    const reach = evolved ? values.still : values.reach;
    const stun = evolved ? values.halt : (values.stagger ?? 0);
    sendWave({ x: h.x, y: h.y - 16, face: h.face, reach, power: values.wave, source: ID, stun });
    if (values.behind) {
      sendWave({ x: h.x, y: h.y - 16, face: -h.face, reach: reach * 0.6, power: values.wave * 0.5, source: ID });
    }
    if (values.twin) {
      sendWave({ x: h.x, y: h.y - 28, face: h.face, reach, power: values.wave * 0.6, source: ID });
    }
  },
};
