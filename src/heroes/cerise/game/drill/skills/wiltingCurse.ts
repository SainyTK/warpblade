import { drillFighter } from "../../../../../drill";
import { consumeStacks, stacksOf } from "../../../../../game/enemies/skillStatus";
import { progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFloor, atFoe, ceriseFx } from "../../fx";
import { curse } from "../../skills/wiltingCurse";
import { skillStrike } from "./strike";

const ID = "ce_curse";

export const WILTING_CURSE_DRILL: CeriseDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values, evolved }) {
    if (evolved && drillFighter()?.swing?.kind === "third") {
      const n = consumeStacks(foe, ID);
      skillStrike(foe, n * values.tear, ID);
      const blow = progress.stats.ad * Math.max(1, n) * values.tear;
      ceriseFx(ID, "burst", atFoe(foe, 16), { damage: blow, sigil: "rose" });
      ceriseFx(ID, "spikes", atFloor(foe.x, foe.y, 24), { damage: blow, quiet: true });
      return;
    }
    if (values.thrust && stacksOf(foe, ID)) {
      curse(foe, values.thrust);
      ceriseFx(ID, "mark", atFoe(foe, 12), { damage: progress.stats.ad * values.thrust * 3, sigil: "rose", lift: 6 });
    }
  },
};
