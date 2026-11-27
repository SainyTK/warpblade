import { game, lights, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import { SAND_RAMP } from "../../../constants/palette";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { createSandWave } from "../../effects/sandWave";
import { sandBurst } from "../../effects/spout";
import { zafirFx } from "../../skillFx";
import { openWounds } from "../../wounds";
import { fighterAt, foesNear, skillStrike, swingKind } from "../strike";

const ID = "za_sirocco";
const NOON_REACH = 40;
const NOON_AHEAD = 18;

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
    const floor = surfaceBelow(x, y - 2);
    const air = { x: x + face * 16, y: floor, face, reach: 26 };
    zafirFx(ID, "pillar", air, { damage: progress.stats.ad * (1 + values.air), quiet: !landed || evolved });
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
      const noon = { x: x + face * NOON_AHEAD, y: floor, face, reach: NOON_REACH };
      zafirFx(ID, "nova", noon, { damage: progress.stats.ad * values.noon, delay: 0.08 });
      lights.add(x + face * NOON_AHEAD, y - 14, NOON_REACH, SAND_RAMP[4], 0.45, 0.3);
    }
  },
};
