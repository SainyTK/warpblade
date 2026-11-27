import { drillFighter } from "../../../../../drill";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { createInkBurst } from "../../effects/inkBurst";
import { sayaFx } from "../../skillFx";
import { storeCut } from "../../store";
import { later } from "../later";
import { cutAngle, foesNear, skillStrike } from "../targets";

const step = { dashing: false };
rememberPerSeat(hostMemory(step));

export const SHADOW_STEP_DRILL: SayaDrillSkill = {
  id: SKILL.step,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const dashing = h.dashTime > 0;
    if (dashing) {
      hero.inv = Math.max(hero.inv, values.inv);
    }
    if (dashing && !step.dashing) {
      const after = (values.after ?? 0) * (evolved ? 2 : 1);
      sayaFx(
        SKILL.step,
        { x: h.x, y: h.y - 16, face: h.face, toX: h.x + h.face * 40, toY: h.y - 16 },
        { damage: progress.stats.ad * (0.6 + after) },
      );
      if (h.airDashActive && values.refresh) {
        h.airSlashes = 0;
      }
      if (values.after) {
        const x = h.x;
        const y = h.y - 16;
        const radius = evolved ? values.shadow : 24;
        const cut = () => {
          game.fx.push(createInkBurst(x, y, [0.4, -0.4], false));
          for (const foe of foesNear(x, y, radius)) {
            skillStrike(foe, values.after, SKILL.step);
            if (values.afterStore) {
              storeCut(foe, progress.stats.ad * values.after, cutAngle(foe));
            }
          }
        };
        later(0.22, cut);
        if (evolved) {
          later(0.4, cut);
        }
      }
    }
    step.dashing = dashing;
  },
};
