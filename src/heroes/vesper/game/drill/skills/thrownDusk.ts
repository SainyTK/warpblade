import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { later } from "../later";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_warp";

export const THROWN_DUSK_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpCooldown *= values.cooldown;
    m.warpDamage *= 1 + values.damage;
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "warp" || !h) {
      return;
    }
    const x = h.x;
    const y = h.y - 16;
    const crosses = (values.crossPower ?? 0) * (evolved ? 2 : 1);
    vesperFx(
      ID,
      { x: h.x, y: h.y, face: h.face },
      { damage: progress.stats.ad * (1 + (values.damage ?? 0) + crosses) },
    );
    const cross = () => {
      for (const foe of foesNear(x, y, values.cross ?? 0)) {
        skillStrike(foe, values.crossPower, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    };
    cross();
    if (evolved) {
      later(0.22, cross);
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
  },
};
