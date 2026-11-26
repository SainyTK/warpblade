import type { YunDrillSkill } from "../../../types/drillSkill";
import { woundFoe } from "../../skills/lingeringQi";

export const LINGERING_QI_DRILL: YunDrillSkill = {
  id: "yu_wound",
  swordHit(foe) {
    woundFoe(foe);
  },
  spellHit(foe, _spell, { values }) {
    if (values.spells) {
      woundFoe(foe);
    }
  },
};
