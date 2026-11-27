import { walks } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { createShade } from "../effects/shade";
import { SHADE, yunFx } from "../fx";
import { gainSwords } from "../swords";

/** how far the answered foe may be, and how long the shade's mark lasts */
const SHADE_REACH = 70;
const MARK_TIME = 3;

type ShadeReward = (values: Readonly<Record<string, number>>) => void;

/** the shade steps out behind the foe nearest Yun and cuts it; its whole payoff is on that one foe */
function callShade(reward: ShadeReward): void {
  const foe = nearestFoe(hero.x, hero.y - 16);
  if (!foe || Math.abs(foe.x - hero.x) > SHADE_REACH) return;
  const v = skillValues(SKILL.shade);
  const side = Math.sign(foe.x - hero.x) || hero.face;
  const at = { x: foe.x + side * 12, y: walks(foe) ? foe.y : hero.y, face: -side, reach: 20 };
  yunFx(
    SKILL.shade,
    "slash",
    { ...at, y: at.y - 16 },
    { damage: progress.stats.ad * v.power * v.cuts, signature: SHADE },
  );
  game.fx.push(
    createShade({
      foe,
      cuts: v.cuts,
      damage: progress.stats.ad * v.power,
      source: SKILL.shade,
      done: () => {
        reward(v);
        if (v.mark) markFoe(foe, SKILL.shade, withBuild("duration", MARK_TIME), v.mark);
      },
    }),
  );
}

/** Sage's Shade: a parry, and from level 3 a perfect dodge, calls a shade of Yun behind the foe for heavy cuts; its
 *  last cut pays `reward` */
export const shadeAnswering = (reward: ShadeReward): SkillBehavior => ({
  create: () => ({}),
  on: {
    parry() {
      callShade(reward);
    },
    perfectDodge() {
      if (skillValues(SKILL.shade).dodge) callShade(reward);
    },
  },
});

export const sagesShade = shadeAnswering((v) => {
  if (v.sword) gainSwords(1);
});
