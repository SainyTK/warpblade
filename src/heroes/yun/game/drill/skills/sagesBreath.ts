import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, progress } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createEchoThrust } from "../../effects/echoThrust";
import { createQiRing } from "../../effects/qiRing";
import { BREATH, VOLLEY, yunFx } from "../../fx";
import { hoverPlace } from "../../hover";
import { foesNear, skillStrike } from "../strike";

const ID = "yu_breath";
const RING = 30;
const breath = { dashing: false, air: false };
rememberPerSeat(hostMemory(breath));

export const SAGES_BREATH_DRILL: YunDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const dashing = h.dashTime > 0;
    if (dashing && !breath.dashing) {
      breath.air = h.airDashActive;
      yunFx(ID, "burst", { x: h.x, y: h.y - 2, face: h.face, reach: 8 }, { quiet: !breath.air, signature: BREATH });
      if (breath.air && values.restore) {
        h.airSlashes = 0;
      }
      if (breath.air && evolved) {
        const sea = { x: h.x, y: h.y - 22, face: h.face, toX: h.x + h.face * 70, toY: h.y - 22 };
        yunFx(ID, "trail", sea, { damage: progress.stats.ad * values.ring * values.sea, signature: VOLLEY });
        for (let i = 0; i < values.sea; i++) {
          game.fx.push(
            createEchoThrust({
              from: hoverPlace(i),
              delay: i * 0.05,
              reach: 70,
              height: -14 - i * 6,
              power: values.ring,
              crit: false,
              back: 0,
              chill: 0,
            }),
          );
        }
      }
    }
    if (!dashing && breath.dashing && values.ring) {
      game.fx.push(createQiRing(h.x, h.y - 14, RING));
      yunFx(
        ID,
        "nova",
        { x: h.x, y: h.y, face: h.face, reach: RING * 0.6 },
        { damage: progress.stats.ad * values.ring, signature: BREATH },
      );
      for (const foe of foesNear(h.x, h.y - 14, RING)) {
        skillStrike(foe, values.ring, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    breath.dashing = dashing;
  },
};
