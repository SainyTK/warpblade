import { drillFighter } from "../../../../../drill";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { sheathe } from "../sheathe";
import { foesNear, skillStrike } from "../targets";

const pass = { clock: 0, resetAt: 0 };
const SWEEP = 30;

export const PASSING_DRAW_DRILL: SayaDrillSkill = {
  id: SKILL.pass,
  modify(m, { values }) {
    m.warpCooldown *= values.cooldown;
    m.warpDamage *= 1 + values.damage;
  },
  store: (blow, { values }) => (blow === "warp" ? (values.store ?? 1) - 1 : 0),
  tick(dt) {
    pass.clock += dt;
  },
  slashed(blow, _landed, { values, evolved }) {
    const h = drillFighter();
    if (blow !== "warp" || !h) {
      return;
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
    if (values.sweep) {
      for (const foe of foesNear(h.x, h.y - 16, SWEEP)) {
        skillStrike(foe, values.sweep, SKILL.pass);
      }
    }
    if (values.release) {
      later(0.3, () => sheathe());
    }
    if (evolved && pass.clock >= pass.resetAt) {
      pass.resetAt = pass.clock + values.reset;
      h.warpReadyIn = 0;
    }
  },
};
