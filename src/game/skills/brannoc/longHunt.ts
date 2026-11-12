import { WOLF_ROAD } from "../../../constants/brannoc/skills";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { createWolfRun } from "../../effects/brannoc/wolfRun";
import { game, hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "b_hunt";

/**
 * Long Hunt: his kit runs its reach, chop, launch, mark and stamina. Wolf's Road sends a red wolf running down the lane
 * ahead from where each Hunt lands, striking every foe it passes.
 */
export const longHuntSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    hunt(_m, event) {
      if (!skillValues(ID).wolves) return;
      game.fx.push(
        createWolfRun({
          x: hero.x,
          floor: hero.y,
          dir: Math.sign(hero.x - event.from) || hero.face,
          reach: withCharms("area", WOLF_ROAD.reach),
          speed: WOLF_ROAD.speed,
          damage: progress.stats.ad * WOLF_ROAD.power,
          source: ID,
        }),
      );
    },
  },
};
