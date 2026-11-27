import { progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { zafirFx } from "../../skillFx";
import { throwCrescents } from "../crescents";
import { fighterAt, pullFoe, skillStrike, swingKind } from "../strike";

const ID = "za_whirling";

export const WHIRLING_EDGE_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { evolved, values }) {
    if (evolved) {
      m.strikeReach *= 1 + values.reach;
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (swingKind() !== "first") {
      return;
    }
    skillStrike(foe, values.first, ID);
    if (values.drag) {
      pullFoe(foe, values.drag);
    }
  },
  slashed(strike, landed, { values, evolved }) {
    if (strike !== "first") {
      return;
    }
    const { x, y, face } = fighterAt();
    const damage = progress.stats.ad * (1 + values.first);
    zafirFx(ID, "slash", { x: x + face * 10, y: y - 17, face, reach: 20 }, { damage, quiet: !landed });
    if (values.crescent) {
      throwCrescents(values.crescent, ID, !!values.pierce, evolved ? 2 : 1);
      const crescent = { x: x - face * 10, y: y - 15, face: -face, reach: 16 };
      zafirFx(ID, "slash", crescent, { damage: progress.stats.ad * values.crescent, quiet: true, delay: 0.05 });
    }
  },
};
