import { enemyCenter } from "../../../../../game/enemies/enemy";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { hero } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { linger } from "../../abilities/pillars";

const cast = { laid: false };
rememberPerSeat(hostMemory(cast));

export const LINGERING_DAWN_DRILL: AldricDrillSkill = {
  id: "al_dawn",
  tick() {
    cast.laid = false;
  },
  spellHit(foe, spell) {
    if (spell.id === "pillar" && !cast.laid) {
      cast.laid = true;
      linger(enemyCenter(foe)[0]);
    }
  },
  slashed(strike, landed, { values }) {
    if ((strike === "warp" && values.arrival) || (strike === "third" && landed && values.crest)) {
      linger(hero.x + hero.face * 10);
    }
  },
};
