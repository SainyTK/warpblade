import { drillFighter } from "../../../../../drill";
import { addStacks } from "../../../../../game/enemies/skillStatus";
import { skillValues } from "../../../../../game/skills/query";
import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { brynnFx, PLANTED } from "../../fx";

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
    const at = { x: foe.x, y: surfaceBelow(foe.x, foe.y - 4), reach: 14 };
    const third = strike === "third";
    brynnFx(ID, "spikes", at, {
      damage: progress.stats.ad * v.damage * 6,
      quiet: !third,
      signature: third ? PLANTED : undefined,
    });
    if (v.halt) {
      foe.halt = Math.max(foe.halt, v.every);
    }
  },
};
