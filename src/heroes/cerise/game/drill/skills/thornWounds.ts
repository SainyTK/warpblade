import { drillFighter } from "../../../../../drill";
import { addStacks, consumeStacks } from "../../../../../game/enemies/skillStatus";
import { progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { CeriseDrillSkill, SkillNumbers } from "../../../types/drillSkill";
import { atFloor, atFoe, ceriseFx } from "../../fx";
import { skillStrike } from "./strike";

const ID = "ce_thorns";

function thorn(foe: Enemy, stacks: number, values: SkillNumbers): void {
  addStacks(foe, ID, { stacks, max: values.max, damage: progress.stats.ad * values.damage, every: 0.5, duration: 3 });
}

export const THORN_WOUNDS_DRILL: CeriseDrillSkill = {
  id: ID,
  swordHit(foe, infusion, { values, evolved }) {
    const kind = drillFighter()?.swing?.kind;
    if (evolved && kind === "third") {
      const n = consumeStacks(foe, ID);
      skillStrike(foe, n * values.burst, ID);
      const blow = progress.stats.ad * Math.max(1, n) * values.burst;
      ceriseFx(ID, "burst", atFoe(foe, 16), { damage: blow, sigil: "rose" });
      ceriseFx(ID, "spikes", atFloor(foe.x, foe.y, 22), { damage: blow, quiet: true });
    } else {
      const stacks = kind === "third" ? values.lunge : 1;
      ceriseFx(ID, "slash", atFoe(foe, 12), {
        damage: progress.stats.ad * values.damage * stacks * 6,
        sigil: "thrust",
      });
    }
    thorn(foe, kind === "third" ? values.lunge : 1, values);
    if (infusion && values.infused) {
      thorn(foe, values.infused, values);
    }
  },
};
