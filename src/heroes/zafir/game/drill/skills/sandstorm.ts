import { progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { stormFx } from "../../ultimate/sandstorm";
import { openWounds } from "../../wounds";
import { foesAround } from "../strike";

export const SANDSTORM_DRILL: ZafirDrillSkill = {
  id: "za_storm",
  modify(m, { values }) {
    m.tierDamage *= values.damage;
    m.chargeRate *= values.charge ?? 1;
    m.tierReach *= values.reach ?? 1;
  },
  released({ tier, x, y }, { values }) {
    stormFx(x, y, tier.level, tier.reach * (values.reach ?? 1), (tier.damage / 10) * progress.stats.ad);
    if (!values.wounds) {
      return;
    }
    for (const foe of foesAround(tier.reach * (values.reach ?? 1), tier.height)) {
      openWounds(foe, values.wounds);
    }
  },
};
