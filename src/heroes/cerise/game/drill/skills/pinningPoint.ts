import { drillFighter } from "../../../../../drill";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { hero } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "./strike";

const ID = "ce_pin";

export const PINNING_POINT_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes ?? 0;
  },
  swordHit(foe, _infusion, { values, evolved }) {
    if (drillFighter()?.swing?.kind !== "air") {
      return;
    }
    foe.pinned = Math.max(foe.pinned, values.pin);
    foe.halt = Math.max(foe.halt, values.pin);
    skillStrike(foe, values.air, ID);
    if (values.held) {
      markFoe(foe, ID, values.pin + 1, values.held);
    }
    if (evolved) {
      for (const below of foesNear(hero.x + hero.face * 12, hero.y + 30, 44)) {
        skillStrike(below, values.skewer, ID);
      }
    }
  },
};
