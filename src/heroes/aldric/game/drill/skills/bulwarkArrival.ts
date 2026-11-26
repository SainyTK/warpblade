import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_bulwark";
const walker = { readyIn: 0 };

export const BULWARK_ARRIVAL_DRILL: AldricDrillSkill = {
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
        attackStrike(foe, values.blastPower, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    if (values.heal) {
      hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * values.heal);
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
