import { drillFighter } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { LEAVES, yunFx } from "../../fx";
import { skillStrike } from "../strike";

const DASH = 48;

const ID = "yu_drift";
const MARK_TIME = 3;

export const DRIFTING_LEAF_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  dashed(foes, { values, evolved }) {
    const d = drillFighter();
    if (d) {
      const at = { x: d.x - d.face * DASH, y: d.y - 16, face: d.face, toX: d.x - d.face * 14, toY: d.y - 16 };
      const damage = progress.stats.ad * values.cut * (evolved ? 2 : 1) * Math.max(1, foes.length);
      yunFx(ID, "trail", at, { damage, quiet: !foes.length, signature: LEAVES });
    }
    for (const foe of foes.slice(0, 3)) {
      const [x, y] = enemyCenter(foe);
      yunFx(ID, "mark", { x, y, face: d?.face ?? 1 }, { quiet: true, signature: LEAVES });
    }
    for (const foe of foes) {
      skillStrike(foe, values.cut * (evolved ? 2 : 1), ID);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (values.mark) {
        markFoe(foe, ID, MARK_TIME, values.mark);
      }
    }
    const h = drillFighter();
    if (h && foes.length && values.refund) {
      h.dashReadyIn = 0;
    }
  },
};
