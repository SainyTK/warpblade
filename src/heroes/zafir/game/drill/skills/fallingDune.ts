import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { createSpout, sandBurst } from "../../effects/spout";
import { foesAround, skillStrike } from "../strike";

const ID = "za_falling";
const RING = { reach: 30, height: 20, spout: 0.5 };
const air = { slashed: false, grounded: true };

export const FALLING_DUNE_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.slashes;
    m.airDashes += values.airDashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    if (!h.grounded && h.airSlashes > 0) {
      air.slashed = true;
    }
    const landed = h.grounded && !air.grounded;
    air.grounded = h.grounded;
    if (!landed || !air.slashed) {
      return;
    }
    air.slashed = false;
    if (!values.ring) {
      return;
    }
    for (const foe of foesAround(values.reach ?? RING.reach, RING.height)) {
      skillStrike(foe, values.ring, ID);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    sandBurst(h.x, h.y - 2, 14);
    if (evolved) {
      for (const dir of [-1, 1]) {
        game.fx.push(
          createSpout(h.x, h.y, dir, { damage: progress.stats.ad * values.ring * RING.spout, range: 1, source: ID }),
        );
      }
    }
  },
};
