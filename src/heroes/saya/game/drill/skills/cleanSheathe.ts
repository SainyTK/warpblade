import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";

export const CLEAN_SHEATHE_DRILL: SayaDrillSkill = {
  id: SKILL.clean,
  modify(m, { values }) {
    m.finisherDamage *= 1 + values.finisher;
  },
  sheathe(options, { values }) {
    options.factor *= 1 + values.release;
    options.clean ||= !!values.crit;
    options.stagger = Math.max(options.stagger, values.stagger ?? 0);
    options.mp += values.mp ?? 0;
    options.echo = Math.max(options.echo, values.echo ?? 0);
  },
};
