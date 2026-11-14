import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { DUSK_SPARKS } from "../../look/colors";

const ID = "ve_night";
/** seconds between night's ticks */
const EVERY = 0.5;

/** lay `n` night on a foe at the skill's numbers */
function layNight(e: Enemy, n: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks: n,
    max: withCharms("amount", v.max),
    damage: progress.stats.ad * v.damage,
    every: EVERY,
    duration: withCharms("duration", v.duration),
  });
}

/** the nightfall landed on these foes: more night on each, or as Starless Night all of it at once */
export function nightLanding(foes: readonly Enemy[]): void {
  if (!skillLevel(ID)) return;
  const v = skillValues(ID);
  for (const e of foes) {
    if (skillEvolved(ID)) {
      const n = consumeStacks(e, ID);
      if (!n) continue;
      const [x, y] = enemyCenter(e);
      game.fx.push(createImpact(x, y, hero.face, true, DUSK_SPARKS));
      dealDamage(e, progress.stats.ad * v.consume * n, { fromX: hero.x, source: ID });
    } else if (v.landStacks) layNight(e, v.landStacks);
  }
}

/**
 * Falling Night: a blow of hers on a foe in the air lays night on it, ticking until it fades; the nightfall's landing and
 * launches lay more, a foe with night takes more while airborne, and as Starless Night the landing takes all its night at
 * once.
 */
export const fallingNight: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, ev) {
      if (ev.airborne && ev.source === "attacks") layNight(ev.foe, 1);
    },
    launch(_m, ev) {
      const n = skillValues(ID).launchStacks;
      if (n) layNight(ev.foe, n);
    },
  },
};
