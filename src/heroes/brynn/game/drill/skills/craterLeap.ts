import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { launchEnemy } from "../../../../../game/enemies/airborne";
import { game, progress } from "../../../../../game/state";
import { CRIMSON } from "../../../constants/colors";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createFloorWave } from "../../effects/floorWave";
import { brynnFx, PLANTED } from "../../fx";
import { foesNear, skillStrike } from "../strike";

const ID = "br_crater";
const HARD_FALL = 300;
const PULL = 110;
const KICK_RADIUS = 28;
const crater = { fall: 0, grounded: true, kicked: false };

export const CRATER_LEAP_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
    m.airSlashes += values.airSlashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const kicked = h.wallLock > 0;
    if (kicked && !crater.kicked && values.kick) {
      brynnFx(ID, "burst", { x: h.x, y: h.y - 12, face: h.face, reach: 8 }, { quiet: true });
      for (const foe of foesNear(h.x, h.y - 12, KICK_RADIUS)) {
        skillStrike(foe, values.kick, ID);
      }
    }
    crater.kicked = kicked;
    if (h.grounded && !crater.grounded && crater.fall >= HARD_FALL) {
      game.fx.push(createFloorRing(h.x, h.y, values.radius, CRIMSON, 0.4));
      const damage = progress.stats.ad * values.ring;
      brynnFx(ID, "spikes", { x: h.x, y: h.y, face: h.face, reach: 22 }, { damage, quiet: true });
      brynnFx(ID, "nova", { x: h.x, y: h.y, reach: values.radius * 0.7 }, { damage, signature: PLANTED });
      for (const foe of foesNear(h.x, h.y - 8, values.radius)) {
        if (evolved) {
          foe.vx += Math.sign(h.x - foe.x) * PULL;
        }
        skillStrike(foe, values.ring, ID);
        if (values.launch) {
          launchEnemy(foe, -200);
        }
      }
      if (evolved) {
        for (const face of [-1, 1]) {
          brynnFx(
            ID,
            "wave",
            { x: h.x, y: h.y, face, reach: 100 },
            { quiet: true, damage: progress.stats.ad * values.fissure },
          );
          game.fx.push(
            createFloorWave({
              x: h.x,
              y: h.y,
              face,
              reach: 100,
              speed: 320,
              damage: progress.stats.ad * values.fissure,
              kind: "fissure",
              source: ID,
            }),
          );
        }
      }
    }
    crater.fall = h.grounded ? 0 : Math.max(crater.fall, h.vy);
    crater.grounded = h.grounded;
  },
};
