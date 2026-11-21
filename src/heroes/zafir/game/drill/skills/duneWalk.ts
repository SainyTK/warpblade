import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { gainWhirl } from "../../whirl";
import { openWounds } from "../../wounds";
import { throwCrescents } from "../crescents";
import { skillStrike } from "../strike";

const ID = "za_dune";

export const DUNE_WALK_DRILL: ZafirDrillSkill = {
  id: ID,
  dashed(foes, { values, evolved }) {
    for (const foe of foes) {
      skillStrike(foe, values.cut, ID, { melee: true });
      openWounds(foe, values.wounds ?? 0);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    if (foes.length && values.whirl) {
      gainWhirl(values.whirl);
    }
    if (evolved) {
      throwCrescents(values.crescent, ID, true);
    }
  },
};
