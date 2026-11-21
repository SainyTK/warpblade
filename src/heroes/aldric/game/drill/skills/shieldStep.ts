import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_step";
const RING = 36;

export const SHIELD_STEP_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  dashed(foes, { values, evolved }) {
    const h = drillFighter();
    for (const foe of foes) {
      attackStrike(foe, values.bash, ID, { kx: hero.face * (values.knock ?? 30) });
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (values.warp && h) {
        h.warpReadyIn = Math.max(0, h.warpReadyIn - values.warp);
      }
    }
    if (evolved) {
      for (const foe of foesNear(hero.x, hero.y - 14, RING)) {
        attackStrike(foe, values.ring, ID, { ky: -50 });
      }
    }
  },
};
