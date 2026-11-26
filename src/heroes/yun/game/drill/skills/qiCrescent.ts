import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { spellStrike } from "../strike";
import { sendWave } from "./qiWave";

const ID = "yu_crescent";
const SPLIT_HEIGHTS = [-8, -30] as const;

export const QI_CRESCENT_DRILL: YunDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "crescent") {
      return;
    }
    spellStrike(foe, values.bonus, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (values.launch) {
      foe.vy = Math.min(foe.vy, -220);
    }
    const face = Math.sign(foe.x - (drillFighter()?.x ?? foe.x)) || 1;
    if (values.chain) {
      sendWave({ x: foe.x, y: foe.y - 16, face, reach: 90, power: values.chain, source: ID });
    }
    if (evolved) {
      for (const height of SPLIT_HEIGHTS) {
        sendWave({ x: foe.x, y: foe.y + height, face, reach: 120, power: values.moon, source: ID });
      }
    }
  },
  swordHit(_foe, infusion, { values }) {
    const h = drillFighter();
    if (infusion?.id !== "crescent" || !values.edge || !h) {
      return;
    }
    sendWave({ x: h.x, y: h.y - 18, face: h.face, reach: 80, power: values.edge, source: ID });
  },
};
