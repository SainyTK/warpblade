import { enemyCenter } from "../../../../../game/enemies/enemy";
import { addStacks } from "../../../../../game/enemies/skillStatus";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { sayaFx } from "../../skillFx";

const EVERY = 0.5;

export const LINGERING_LINE_DRILL: SayaDrillSkill = {
  id: SKILL.trail,
  store(_blow, { values }) {
    return values.store ?? 0;
  },
  swordHit(foe, _blow, infusion, { values, evolved }) {
    if (!infusion && !evolved) {
      return;
    }
    const [x, y] = enemyCenter(foe);
    const ticks = (values.time ?? 0) / EVERY;
    sayaFx(
      SKILL.trail,
      { x: x - hero.face * 20, y: surfaceBelow(x, y), face: hero.face },
      { damage: progress.stats.ap * (values.bleed ?? 0) * ticks * (values.stacks ?? 1) },
    );
    addStacks(foe, SKILL.trail, {
      stacks: 1,
      max: values.stacks ?? 1,
      damage: progress.stats.ap * values.bleed,
      every: EVERY,
      duration: values.time,
    });
  },
};
