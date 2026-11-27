import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { zafirFx } from "../../skillFx";
import { openWounds, woundsOf } from "../../wounds";
import { foesNear, skillStrike, swingKind } from "../strike";

const ID = "za_veins";
const SPLASH_REACH = 26;

export const OPENED_VEINS_DRILL: ZafirDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values, evolved }) {
    const [x, y] = enemyCenter(foe);
    if (evolved && woundsOf(foe)) {
      skillStrike(foe, values.red, ID);
      zafirFx(ID, "slash", { x, y, face: hero.face, reach: 10 }, { mark: "bleed", quiet: true });
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
    const damage = progress.stats.ad * (wounds * values.perWound + tear + 1);
    zafirFx(ID, "slash", { x, y, face: hero.face, reach: 14 }, { mark: "bleed", damage });
    if (values.splash && tear > 0) {
      zafirFx(ID, "burst", { x, y, reach: SPLASH_REACH * 0.5 }, { mark: "bleed", quiet: true, damage });
      for (const near of foesNear(x, y, SPLASH_REACH)) {
        if (near !== foe) {
          skillStrike(near, tear * values.splash, ID);
        }
      }
    }
  },
};
