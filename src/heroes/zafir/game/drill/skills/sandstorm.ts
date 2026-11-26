import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { openWounds } from "../../wounds";
import { foesAround } from "../strike";

export const SANDSTORM_DRILL: ZafirDrillSkill = {
  id: "za_storm",
  modify(m, { values }) {
    m.tierDamage *= values.damage;
    m.chargeRate *= values.charge ?? 1;
    m.tierReach *= values.reach ?? 1;
  },
  released({ tier }, { values }) {
    if (!values.wounds) {
      return;
    }
    for (const foe of foesAround(tier.reach * (values.reach ?? 1), tier.height)) {
      openWounds(foe, values.wounds);
    }
  },
};
