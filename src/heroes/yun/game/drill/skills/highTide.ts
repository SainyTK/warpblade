import { drillFighter } from "../../../../../drill";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { sendWave } from "./qiWave";

const ID = "yu_tide";
const TWIN_DELAY = 0.12;

export const HIGH_TIDE_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.finisherDamage *= values.finisher ?? 1;
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "third" || !h) {
      return;
    }
    const shot = {
      x: h.x,
      y: h.y - 6,
      reach: values.reach,
      power: values.wave,
      source: ID,
      stun: values.stun,
      launch: values.launch,
      half: 7,
    };
    const faces = evolved ? [h.face, -h.face] : [h.face];
    for (const face of faces) {
      sendWave({ ...shot, face });
      if (values.twin) {
        sendWave({ ...shot, face, x: h.x - face * TWIN_DELAY * 280, power: shot.power * 0.7 });
      }
    }
  },
};
