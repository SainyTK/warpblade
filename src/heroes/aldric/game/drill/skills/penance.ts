import { drillFighter } from "../../../../../drill";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { lay } from "../../skills/penance";

export const PENANCE_DRILL: AldricDrillSkill = {
  id: "al_penance",
  swordHit(foe, _infusion, { values }) {
    if (values.bash && drillFighter()?.swing?.kind === "second") {
      lay(foe, 1);
    }
  },
};
