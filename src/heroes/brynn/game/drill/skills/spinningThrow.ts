import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import { CRIMSON } from "../../../constants/colors";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createQuake } from "../../effects/quake";
import { foesNear, skillStrike } from "../strike";

const ID = "br_spin";

export const SPINNING_THROW_DRILL: BrynnDrillSkill = {
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
    if (values.ring) {
      game.fx.push(createFloorRing(h.x, h.y, values.radius, CRIMSON, 0.35));
      for (const foe of foesNear(h.x, h.y - 12, values.radius)) {
        skillStrike(foe, values.ring, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
    if (evolved) {
      game.fx.push(
        createQuake({
          x: h.x,
          y: h.y,
          reach: 60,
          damage: progress.stats.ad * values.quake,
          delay: 0.05,
          launch: -240,
          height: 30,
          source: ID,
        }),
      );
    }
  },
};
