import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { skin } from "../../../../../game/hero/skin";
import { game, hero } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { sheathe } from "../sheathe";
import { foesNear, skillStrike } from "../targets";

const fall = { slashed: false, grounded: true };
const DRIVE = 260;

export const FALLING_MOON_DRILL: SayaDrillSkill = {
  id: SKILL.falling,
  modify(m, { values }) {
    m.airSlashes += values.air ?? 0;
  },
  swordHit(foe, blow, _infusion, { values }) {
    if (blow !== "air") {
      return;
    }
    skillStrike(foe, values.power ?? 0, SKILL.falling);
    if (values.drive) {
      foe.vy = Math.max(foe.vy, DRIVE);
    }
  },
  slashed(blow) {
    if (blow === "air") {
      fall.slashed = true;
    }
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const landed = h.grounded && !fall.grounded;
    fall.grounded = h.grounded;
    if (!landed || !fall.slashed) {
      return;
    }
    fall.slashed = false;
    if (values.ring || evolved) {
      game.fx.push(createFloorRing(hero.x, hero.y, evolved ? 48 : 34, skin.ramp, 0.3));
      for (const foe of foesNear(hero.x, hero.y - 12, evolved ? 48 : 34)) {
        skillStrike(foe, evolved ? values.crash : values.ring, SKILL.falling, evolved ? { stun: 0.8 } : {});
      }
    }
    if (values.land) {
      sheathe();
    }
  },
};
