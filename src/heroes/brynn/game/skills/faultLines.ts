import { skillValues } from "../../../../game/skills/query";
import { game } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import "../../types/events";
import { createCrack } from "../effects/crack";

const ID = "br_fault";

export const faultLines: SkillBehavior = {
  create: () => ({}),
  on: {
    floorWave(_m, e) {
      if (e.kind !== "shock" && !skillValues(ID).fissure) return;
      game.fx.push(createCrack(e.x0, e.x1, e.y));
    },
  },
};
