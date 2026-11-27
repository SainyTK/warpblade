import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { createInkWave } from "../../effects/inkWave";
import { sayaFx } from "../../skillFx";
import { sheathe } from "../sheathe";
import { skillStrike } from "../targets";

export const HONED_DRAW_DRILL: SayaDrillSkill = {
  id: SKILL.edge,
  modify(m, { values }) {
    m.strikeReach *= 1 + (values.reach ?? 0);
  },
  store: (blow, { values }) => (blow === "first" ? values.store : 0),
  swordHit(foe, blow, _infusion, { values, evolved }) {
    if (blow !== "first") {
      return;
    }
    const [x, y] = enemyCenter(foe);
    const waves = (values.wave ?? 0) * (evolved ? 2 : 1);
    sayaFx(
      SKILL.edge,
      { x, y, face: hero.face },
      { damage: progress.stats.ad * (1 + (values.first ?? 0) + (values.store ?? 0) + waves) },
    );
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
