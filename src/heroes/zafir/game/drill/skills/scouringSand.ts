import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { grind } from "../../skills/scouringSand";
import { swingKind } from "../strike";

export const SCOURING_SAND_DRILL: ZafirDrillSkill = {
  id: "za_scour",
  swordHit(foe, _infusion, { values, evolved }) {
    if (swingKind() === "third" && values.third) {
      grind(foe, values.third);
    }
    if (evolved && values.slash) {
      grind(foe, values.slash);
    }
  },
};
