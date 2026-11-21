import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { game } from "../../../../../game/state";
import { DUSK_RAMP } from "../../../look/colors";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { liftFoe } from "../statuses";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_ascend";
const step = { kicking: false, grounded: true };

export const ASCENDING_STEP_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDash ?? 0;
    m.airSlashes += values.air ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const kicking = h.wallLock > 0;
    const took = step.grounded && !h.grounded && h.vy < 0 && !h.swing;
    if ((kicking && !step.kicking) || (took && values.jumpCut)) {
      const reach = evolved ? values.reach : 26;
      for (const foe of foesNear(h.x, h.y - 14, reach)) {
        skillStrike(foe, kicking ? values.kick : values.jumpCut, ID);
        if (values.lift) {
          liftFoe(foe, -values.lift);
        }
      }
      if (evolved) {
        game.fx.push(createFloorRing(h.x, h.y, reach, DUSK_RAMP, 0.3));
      }
    }
    step.kicking = kicking;
    step.grounded = h.grounded;
  },
};
