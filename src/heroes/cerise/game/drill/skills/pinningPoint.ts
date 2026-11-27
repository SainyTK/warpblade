import { drillFighter } from "../../../../../drill";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFloor, ceriseFx } from "../../fx";
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
    const damage = progress.stats.ad * (values.air + (evolved ? values.skewer : 0)) * 2;
    ceriseFx(ID, "spikes", atFloor(foe.x, foe.y, 16), { damage, sigil: "needle", lift: 22 });
    if (evolved) ceriseFx(ID, "pillar", atFloor(foe.x, foe.y, 30), { damage, quiet: true });
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
