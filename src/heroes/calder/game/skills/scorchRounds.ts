import { dealDamage } from "../../../../game/damage";
import { createBlastCore } from "../../../../game/effects/flash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { PHOSPHOR } from "../../constants/colors";
import { layStacks } from "./stacks";

const SKILL = "ca_scorch";

const burn = (e: Enemy, n = 1): void => {
  const v = skillValues(SKILL);
  layStacks(e, SKILL, n, progress.stats.ad * v.damage, v.max);
};

/** Phosphor Heart: a Trigger on a foe burning hot enough consumes the fire in one burst */
function consume(e: Enemy): boolean {
  const v = skillValues(SKILL);
  if (!skillEvolved(SKILL) || stacksOf(e, SKILL) < v.at) return false;
  const n = consumeStacks(e, SKILL);
  game.fx.push(createBlastCore(...enemyCenter(e), PHOSPHOR[5]));
  dealDamage(e, progress.stats.ad * v.consume * n, { fromX: e.x, kx: 0, ky: -60, source: SKILL });
  return true;
}

/** Scorch Rounds: a Trigger's round sets its foe burning green; the splash and every other round burn from levels 3 and 4, the
 *  fire spreads from a fallen foe, and Phosphor Heart consumes a hot fire in a burst */
export const scorchRounds: SkillBehavior = {
  create: () => ({}),
  on: {
    calderTrigger(_m, event) {
      if (event.foe && event.foe.hp > 0 && !consume(event.foe)) burn(event.foe);
    },
    calderBlast(_m, event) {
      const v = skillValues(SKILL);
      const splash = event.kind === "trigger" && v.splash;
      const other = event.kind !== "trigger" && v.shots;
      if (!splash && !other) return;
      for (const e of event.foes.slice(splash ? 1 : 0)) if (e.hp > 0) burn(e);
    },
    kill(_m, event) {
      const n = stacksOf(event.foe, SKILL);
      if (!n || !skillValues(SKILL).spread) return;
      const [x, y] = enemyCenter(event.foe);
      const next = nearestFoe(x, y, [event.foe]);
      if (next) burn(next, n);
    },
  },
};
