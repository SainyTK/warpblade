import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { CRESCENTS, isLead, yunFx } from "../../fx";
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
    const at = { x: foe.x - face * 6, y: foe.y - 16, face, reach: 18 };
    yunFx(ID, "slash", at, { damage: progress.stats.ap * values.bonus, quiet: !isLead(ID), signature: CRESCENTS });
    if (values.chain) {
      sendWave({ x: foe.x, y: foe.y - 16, face, reach: 90, power: values.chain, source: ID });
      yunFx(
        ID,
        "wave",
        { x: foe.x, y: foe.y, face, reach: 45 },
        { quiet: true, damage: progress.stats.ad * values.chain },
      );
    }
    if (evolved) {
      yunFx(
        ID,
        "slash",
        { x: foe.x, y: foe.y - 18, face, reach: 26 },
        { damage: progress.stats.ad * values.moon * 2, delay: 0.05, signature: CRESCENTS },
      );
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
    yunFx(
      ID,
      "slash",
      { x: h.x + h.face * 8, y: h.y - 18, face: h.face, reach: 12 },
      { quiet: true, signature: CRESCENTS },
    );
  },
};
