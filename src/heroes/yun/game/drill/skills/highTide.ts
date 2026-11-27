import { drillFighter } from "../../../../../drill";
import { progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { TIDE, yunFx } from "../../fx";
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
      const at = { x: h.x + face * 14, y: h.y, face, reach: values.reach * 0.5 };
      yunFx(ID, "wave", at, { damage: progress.stats.ad * values.wave, quiet: face !== h.face, signature: TIDE });
      if (values.twin) {
        sendWave({ ...shot, face, x: h.x - face * TWIN_DELAY * 280, power: shot.power * 0.7 });
      }
    }
  },
};
