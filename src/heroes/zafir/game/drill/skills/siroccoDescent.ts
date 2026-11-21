import { game, lights, progress } from "../../../../../game/state";
import { SAND_RAMP } from "../../../constants/palette";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { createSandWave } from "../../effects/sandWave";
import { sandBurst } from "../../effects/spout";
import { openWounds } from "../../wounds";
import { fighterAt, foesNear, skillStrike, swingKind } from "../strike";

const ID = "za_sirocco";
const NOON_REACH = 40;

export const SIROCCO_DESCENT_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.slashes ?? 0;
  },
  swordHit(foe, _infusion, { values }) {
    if (swingKind() !== "air") {
      return;
    }
    skillStrike(foe, values.air * 0.8, ID);
    openWounds(foe, values.wounds ?? 0);
  },
  slashed(strike, landed, { values, evolved }) {
    if (strike !== "air") {
      return;
    }
    const { x, y, face } = fighterAt();
    if (values.gust) {
      game.fx.push(
        createSandWave({
          x,
          y: y - 6,
          dir: face,
          damage: progress.stats.ad * values.gust,
          range: 120,
          pierce: true,
          wounds: 0,
          source: ID,
        }),
      );
    }
    if (evolved && landed) {
      for (const foe of foesNear(x, y - 14, NOON_REACH)) {
        skillStrike(foe, values.noon, ID);
      }
      sandBurst(x, y - 14, 14);
      lights.add(x, y - 14, NOON_REACH, SAND_RAMP[5], 1, 0.3);
    }
  },
};
