import { drillFighter } from "../../../../../drill";
import { addStacks } from "../../../../../game/enemies/skillStatus";
import { skillValues } from "../../../../../game/skills/query";
import { progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";

const ID = "br_crush";

export const CRUSHING_WEIGHT_DRILL: BrynnDrillSkill = {
  id: ID,
  swordHit(foe) {
    const strike = drillFighter()?.swing?.kind;
    if (strike !== "second" && strike !== "third") {
      return;
    }
    const v = skillValues(ID);
    addStacks(foe, ID, {
      stacks: strike === "third" ? 2 : 1,
      max: v.max,
      damage: progress.stats.ad * v.damage,
      every: v.every,
      duration: v.time,
    });
    if (v.halt) {
      foe.halt = Math.max(foe.halt, v.every);
    }
  },
};
