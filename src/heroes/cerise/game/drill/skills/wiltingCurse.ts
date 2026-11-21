import { drillFighter } from "../../../../../drill";
import { consumeStacks, stacksOf } from "../../../../../game/enemies/skillStatus";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { curse } from "../../skills/wiltingCurse";
import { skillStrike } from "./strike";

const ID = "ce_curse";

export const WILTING_CURSE_DRILL: CeriseDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values, evolved }) {
    if (evolved && drillFighter()?.swing?.kind === "third") {
      skillStrike(foe, consumeStacks(foe, ID) * values.tear, ID);
      return;
    }
    if (values.thrust && stacksOf(foe, ID)) {
      curse(foe, values.thrust);
    }
  },
};
