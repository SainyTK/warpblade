import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { roseMark } from "../../mark";

export const WEEPING_MARK_DRILL: CeriseDrillSkill = {
  id: "ce_weep",
  spellHit(foe, _spell, { values }) {
    if (values.spells) {
      roseMark(foe);
    }
  },
};
