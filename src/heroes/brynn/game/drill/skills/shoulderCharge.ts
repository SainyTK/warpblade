import { drillFighter } from "../../../../../drill";
import { ignite } from "../../../../../game/enemies/burn";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createFloorWave } from "../../effects/floorWave";
import { skillStrike } from "../strike";

const ID = "br_charge";

export const SHOULDER_CHARGE_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  dashed(foes, { values, evolved }) {
    const h = drillFighter();
    if (!h || foes.length === 0) {
      return;
    }
    for (const foe of foes) {
      skillStrike(foe, values.power, ID);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (values.knock) {
        foe.vx += h.face * values.knock;
      }
      if (values.burn) {
        ignite(foe, values.burn);
      }
    }
    if (evolved) {
      game.fx.push(
        createFloorWave({
          x: h.x,
          y: h.y,
          face: h.face,
          reach: 110,
          speed: 320,
          damage: progress.stats.ad * values.wave,
          kind: "shock",
          source: ID,
        }),
      );
    }
  },
};
