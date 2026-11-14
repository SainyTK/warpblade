import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { createShade } from "../effects/shade";
import { gainSwords } from "../swords";

/** how far the answered foe may be, and how long the shade's mark lasts */
const SHADE_REACH = 70;
const MARK_TIME = 3;

/** the shade steps out behind the foe nearest Yun and cuts it; its whole payoff is on that one foe */
function callShade(): void {
  const foe = nearestFoe(hero.x, hero.y - 16);
  if (!foe || Math.abs(foe.x - hero.x) > SHADE_REACH) return;
  const v = skillValues(SKILL.shade);
  game.fx.push(
    createShade({
      foe,
      cuts: v.cuts,
      damage: progress.stats.ad * v.power,
      source: SKILL.shade,
      done: () => {
        if (v.sword) gainSwords(1);
        if (v.mark) markFoe(foe, SKILL.shade, withCharms("duration", MARK_TIME), v.mark);
      },
    }),
  );
}

/** Sage's Shade: a parry, and from level 3 a perfect dodge, calls a shade of Yun behind the foe for heavy cuts */
export const sagesShade: SkillBehavior = {
  create: () => ({}),
  on: {
    parry() {
      callShade();
    },
    perfectDodge() {
      if (skillValues(SKILL.shade).dodge) callShade();
    },
  },
};
