import { CRIMSON_MOON } from "../../../constants/brannoc/skills";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { createBloodCrescent } from "../../effects/brannoc/bloodCrescent";
import { game, hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "b_redEdge";

/**
 * Red Edge: his kit pays off its Bloodied Cleave. Crimson Moon throws a crimson arc along the floor both ways from each
 * Bloodied Cleave.
 */
export const redEdgeSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    cleave(_m, event) {
      if (!event.bloodied || !skillValues(ID).moon) return;
      for (const dir of [hero.face, -hero.face])
        game.fx.push(
          createBloodCrescent({
            x: hero.x + dir * 8,
            floor: hero.y,
            dir,
            reach: withCharms("area", CRIMSON_MOON.reach),
            speed: CRIMSON_MOON.speed,
            damage: progress.stats.ad * CRIMSON_MOON.power,
            height: CRIMSON_MOON.height,
            source: ID,
          }),
        );
    },
  },
};
