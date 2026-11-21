import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { openWounds, woundsOf } from "../../wounds";
import { foesNear, skillStrike, swingKind } from "../strike";

const ID = "za_veins";
const SPLASH_REACH = 26;

export const OPENED_VEINS_DRILL: ZafirDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values, evolved }) {
    if (evolved && woundsOf(foe)) {
      skillStrike(foe, values.red, ID);
    }
    if (swingKind() !== "third") {
      return;
    }
    const wounds = woundsOf(foe);
    skillStrike(foe, wounds * values.perWound, ID);
    openWounds(foe, values.open ?? 0);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    const tear = wounds * (values.tear ?? 0);
    skillStrike(foe, tear, ID);
    if (values.splash && tear > 0) {
      const [x, y] = enemyCenter(foe);
      for (const near of foesNear(x, y, SPLASH_REACH)) {
        if (near !== foe) {
          skillStrike(near, tear * values.splash, ID);
        }
      }
    }
  },
};
