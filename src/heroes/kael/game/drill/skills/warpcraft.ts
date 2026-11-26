import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";

const ID = "k_warpcraft";
const walker = { readyIn: 0 };

export const WARPCRAFT_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpCooldown *= values.cooldown;
    m.warpDamage *= 1 + values.damage;
  },
  tick(dt) {
    walker.readyIn = Math.max(0, walker.readyIn - dt);
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "warp" || !h) {
      return;
    }
    if (values.blast) {
      for (const foe of foesNear(h.x, h.y - 16, values.blast)) {
        skillStrike(foe, values.blastPower, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
    if (evolved && walker.readyIn === 0) {
      walker.readyIn = values.every;
      h.warpReadyIn = 0;
      hero.warpCd = 0;
    }
  },
};
