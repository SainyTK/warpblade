import { drillFighter } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createQuake } from "../../effects/quake";
import { brynnFx, CRESCENT, PLANTED } from "../../fx";
import { foesNear, skillStrike } from "../strike";

const ID = "br_heavy";
const RING = 32;
const landing = { slammed: false, grounded: true };
rememberPerSeat(hostMemory(landing));

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
    const [x, y] = enemyCenter(foe);
    brynnFx(ID, "burst", { x, y, face: hero.face, reach: 9 }, { damage: progress.stats.ad * values.cut, quiet: true });
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "air") {
      return;
    }
    landing.slammed = (values.ring ?? 0) > 0;
    const swing = { x: hero.x + hero.face * 12, y: hero.y - 14, face: hero.face, reach: 20 };
    brynnFx(ID, "slash", swing, { damage: progress.stats.ad * values.cut, signature: CRESCENT });
    if (evolved) {
      brynnFx(
        ID,
        "spikes",
        { x: hero.x, y: hero.y, face: hero.face, reach: 30 },
        {
          damage: progress.stats.ad * values.quake,
          delay: 0.12,
          signature: PLANTED,
        },
      );
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
      brynnFx(
        ID,
        "nova",
        { x: h.x, y: h.y, reach: RING * 0.7 },
        { damage: progress.stats.ad * values.ring, quiet: true },
      );
      for (const foe of foesNear(h.x, h.y - 8, RING)) {
        skillStrike(foe, values.ring, ID);
      }
    }
    landing.grounded = h.grounded;
  },
};
