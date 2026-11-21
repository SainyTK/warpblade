import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { createInkStroke } from "../../effects/inkStroke";
import { storeCut } from "../../store";
import { cutAngle, foesAlong, skillStrike } from "../targets";

const STROKE = 46;

export const LONG_STROKE_DRILL: SayaDrillSkill = {
  id: SKILL.stroke,
  dashed(foes, { values, evolved }) {
    const struck = evolved ? [...new Set([...foes, ...foesAlong(0, values.horizon)])] : foes;
    if (!struck.length) {
      return;
    }
    for (const foe of struck) {
      skillStrike(foe, values.cut, SKILL.stroke);
      if (values.store) {
        storeCut(foe, progress.stats.ad * values.store, cutAngle(foe));
      }
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    if (values.line) {
      game.fx.push(createInkStroke(hero.x - hero.face * STROKE, hero.x, hero.y));
    }
    const h = drillFighter();
    if (values.refresh && h) {
      h.dashReadyIn = 0;
    }
  },
};
