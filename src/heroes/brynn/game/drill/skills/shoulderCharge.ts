import { drillFighter } from "../../../../../drill";
import { ignite } from "../../../../../game/enemies/burn";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createFloorWave } from "../../effects/floorWave";
import { brynnFx, CREST, RAM } from "../../fx";
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
    const from = { x: h.x - h.face * 48, y: h.y - 14, face: h.face, toX: h.x - h.face * 8, toY: h.y - 14 };
    brynnFx(ID, "trail", from, { damage: progress.stats.ad * values.power, signature: RAM });
    for (const foe of foes) {
      skillStrike(foe, values.power, ID);
      const [fx, fy] = enemyCenter(foe);
      brynnFx(ID, "burst", { x: fx, y: fy, face: h.face, reach: 8 }, { quiet: true });
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
      const wave = { x: h.x, y: h.y, face: h.face, reach: 110 };
      brynnFx(ID, "wave", wave, { damage: progress.stats.ad * values.wave, quiet: true, signature: CREST });
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
