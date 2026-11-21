import { drillFighter } from "../../../../../drill";
import { game, hero, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createQuake } from "../../effects/quake";
import { foesNear, skillStrike } from "../strike";

const ID = "br_heavy";
const RING = 32;
const landing = { slammed: false, grounded: true };

export const HEAVY_HANDS_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes ?? 0;
  },
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind !== "air") {
      return;
    }
    skillStrike(foe, values.cut, ID, values.spike ? { spike: true, launch: 260 } : {});
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "air") {
      return;
    }
    landing.slammed = (values.ring ?? 0) > 0;
    if (evolved) {
      game.fx.push(
        createQuake({
          x: hero.x,
          y: hero.y,
          reach: 40,
          damage: progress.stats.ad * values.quake,
          delay: 0.12,
          launch: -200,
          height: 200,
          source: ID,
        }),
      );
    }
  },
  tick(_dt, { values }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    if (h.grounded && !landing.grounded && landing.slammed) {
      landing.slammed = false;
      for (const foe of foesNear(h.x, h.y - 8, RING)) {
        skillStrike(foe, values.ring, ID);
      }
    }
    landing.grounded = h.grounded;
  },
};
