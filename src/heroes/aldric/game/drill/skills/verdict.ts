import { drillFighter } from "../../../../../drill";
import { game } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createVerdictSword } from "../../skills/verdict";
import { attackStrike } from "../strike";

const ID = "al_verdict";
const GAP = 0.12;

export const VERDICT_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes;
  },
  swordHit(foe, _infusion, { values, evolved }) {
    const kind = drillFighter()?.swing?.kind;
    const air = kind === "air";
    if (!air && !(evolved && kind)) {
      return;
    }
    if (air) {
      attackStrike(foe, values.extra ?? 0, ID);
    }
    const swords = air ? (values.swords ?? 0) : 1;
    for (let i = 0; i < swords; i++) {
      game.fx.push(createVerdictSword(foe, i * GAP));
    }
  },
};
