import { drillFighter } from "../../../../../drill";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import { shake, surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createSunPillar } from "../../abilities/pillar";
import { aldricFx } from "../../fx";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_skyfall";
const KICK_REACH = 30;
const sky = { grounded: true, wallLock: 0, slashed: false };
rememberPerSeat(hostMemory(sky));

export const SKYFALL_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes;
    m.airDashes += values.airDashes ?? 0;
  },
  slashed(strike) {
    if (strike === "air") {
      sky.slashed = true;
    }
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    if (values.kick && h.wallLock > sky.wallLock) {
      for (const foe of foesNear(h.x - h.face * 8, h.y - 16, KICK_REACH)) {
        attackStrike(foe, values.kick, ID, { kx: h.face * 70 });
      }
    }
    sky.wallLock = h.wallLock;
    if (h.grounded && !sky.grounded && sky.slashed) {
      const floor = surfaceBelow(h.x, h.y - 2);
      aldricFx(
        ID,
        "nova",
        { x: h.x, y: floor, face: h.face, reach: values.radius || 26 },
        {
          damage: progress.stats.ad * (1 + (values.slam ?? 0)),
          sigil: "shield",
          lift: 18,
        },
      );
      if (evolved) {
        aldricFx(ID, "pillar", { x: h.x, y: floor, reach: 30 }, { quiet: true, delay: 0.05 });
      }
    }
    if (h.grounded && !sky.grounded && sky.slashed && values.slam) {
      shake(0.1, 2);
      for (const foe of foesNear(h.x, h.y - 6, values.radius)) {
        attackStrike(foe, values.slam, ID, { ky: -50 });
      }
      if (evolved) {
        game.fx.push(
          createSunPillar({
            x: hero.x,
            delay: 0.05,
            damage: progress.stats.ad * values.pillar,
            stun: 0.6,
            half: 14,
            source: ID,
          }),
        );
      }
    }
    if (h.grounded) {
      sky.slashed = false;
    }
    sky.grounded = h.grounded;
  },
};
