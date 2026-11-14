import { GROUND } from "../../../../constants/stage";
import { ULT_LEVELS } from "../../../../constants/ultimate";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import { RAIN } from "../../constants/rain";
import { createDelayed } from "../effects/delayed";
import { createLingeringRain } from "../effects/lingeringRain";
import { createRainSword, type RainMark } from "../effects/rainSword";
import { fillSwords } from "../swords";

/** the side each of a foe's swords slants in from, so they converge on it */
const LEANS = [-34, 34, 0, -18, 18] as const;

/** one fall of swords on the foes on screen, nearest first, `perFoe` to a foe, each `each` damage */
function fall(foes: number, perFoe: number, each: number): void {
  const near = foesOnScreen()
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, foes);
  const marks: RainMark[] = near.length
    ? near.map((foe) => ({ foe }))
    : RAIN.empty.map((d) => ({ x: hero.x + hero.face * d, y: Math.min(hero.y, GROUND) }));
  marks.forEach((mark, f) => {
    for (let i = 0; i < perFoe; i++)
      game.fx.push(createRainSword(mark, (f + i * marks.length) * RAIN.gap, LEANS[i % LEANS.length], each, "ultimate"));
  });
}

/**
 * Jade Rain, Yun's ultimate: spirit swords fall from high above on the foes on screen and converge on them, three to a
 * foe, nearest foes first. Each foe struck takes about the shared ultimate blow of the charge level in three cuts. Its
 * skill (`yu_rain`) adds swords, foes, a second rain, the swords back in his hands, and a rain that keeps falling.
 */
export function castJadeRain(level: number): void {
  const v = ultimateValues();
  const blow = ULT_LEVELS[level - 1].power * progress.stats.ad * RAIN.share;
  const each = (blow / RAIN.perFoe) * (v.power ?? 1);
  const foes = v.foes ?? RAIN.foes;
  const perFoe = v.perFoe ?? RAIN.perFoe;
  fall(foes, perFoe, each);
  if (v.again) game.fx.push(createDelayed(RAIN.againDelay, () => fall(foes, perFoe, each * v.again)));
  if (v.fill) fillSwords();
  if (v.linger) game.fx.push(createLingeringRain(v.linger, each));
}
