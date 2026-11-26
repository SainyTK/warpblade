import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { createInkWave } from "../../effects/inkWave";
import { sheathe } from "../sheathe";
import { skillStrike } from "../targets";

export const HONED_DRAW_DRILL: SayaDrillSkill = {
  id: SKILL.edge,
  modify(m, { values }) {
    m.strikeReach *= 1 + (values.reach ?? 0);
  },
  store: (blow, { values }) => (blow === "first" ? values.store : 0),
  swordHit(foe, blow, _infusion, { values }) {
    if (blow !== "first") {
      return;
    }
    skillStrike(foe, values.first, SKILL.edge, { sureCrit: !!values.crit });
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
  },
  slashed(blow, _landed, { values, evolved }) {
    if (blow !== "first" || !values.wave) {
      return;
    }
    const power = progress.stats.ad * values.wave;
    game.fx.push(createInkWave(hero.x + hero.face * 10, hero.y, hero.face, { now: power * 0.4, store: power }));
    if (evolved) {
      game.fx.push(createInkWave(hero.x + hero.face * 10, hero.y - 12, hero.face, { now: power * 0.4, store: power }));
      sheathe("attacks", { factor: 0.5 });
    }
  },
};
