import { GROUND } from "../../../../constants/stage";
import { ULT_LEVELS } from "../../../../constants/ultimate";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import { RAIN } from "../../constants/rain";
import { createRainSword, type RainMark } from "../effects/rainSword";

/** the side each sword of a foe's three slants in from, so they converge on it */
const LEANS = [-34, 34, 0] as const;

/**
 * Jade Rain, Yun's ultimate: spirit swords fall from high above on the foes on screen and converge on them, three to a
 * foe, nearest foes first. Each foe struck takes about the shared ultimate blow of the charge level in three cuts.
 */
export function castJadeRain(level: number): void {
  const blow = ULT_LEVELS[level - 1].power * progress.stats.ad * RAIN.share;
  const each = blow / RAIN.perFoe;
  const foes = foesOnScreen()
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, RAIN.foes);
  const marks: RainMark[] = foes.length
    ? foes.map((foe) => ({ foe }))
    : RAIN.empty.map((d) => ({ x: hero.x + hero.face * d, y: Math.min(hero.y, GROUND) }));
  marks.forEach((mark, f) => {
    for (let i = 0; i < RAIN.perFoe; i++)
      game.fx.push(createRainSword(mark, (f + i * marks.length) * RAIN.gap, LEANS[i], each, "ultimate"));
  });
}
