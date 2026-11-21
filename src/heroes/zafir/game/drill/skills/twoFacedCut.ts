import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { openWounds } from "../../wounds";
import { blindMinion, fighterAt, foesAround, isBehind, skillStrike, swingKind } from "../strike";

const ID = "za_twofaced";
const MIRROR_REACH = 44;

export const TWO_FACED_CUT_DRILL: ZafirDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values }) {
    if (values.wounds && isBehind(foe)) {
      openWounds(foe, values.wounds);
    }
    if (swingKind() !== "second") {
      return;
    }
    skillStrike(foe, values.second, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    blindMinion(foe, values.blind ?? 0);
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "second" || !evolved) {
      return;
    }
    const { x, face } = fighterAt();
    for (const foe of foesAround(MIRROR_REACH, 30)) {
      if (Math.sign(foe.x - x) === -face) {
        skillStrike(foe, values.mirror, ID);
      }
    }
  },
};
