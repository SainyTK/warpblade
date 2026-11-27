import { drillFighter } from "../../../../../drill";
import { game, hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { createGlassRapier } from "../../effects/glassRapier";
import { atFloor, atFoe, ceriseFx } from "../../fx";
import { roseMark } from "../../mark";
import { skillStrike } from "./strike";

const ID = "ce_measure";

export const MEASURED_TOUCH_DRILL: CeriseDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values, evolved }) {
    if (drillFighter()?.swing?.kind !== "first") {
      return;
    }
    skillStrike(foe, values.first, ID, { sureCrit: values.crit > 0 });
    const damage = progress.stats.ad * (values.first + (values.echo ?? 0));
    ceriseFx(ID, "burst", atFoe(foe, 10, hero.face), { damage, sigil: "thrust" });
    if (evolved) ceriseFx(ID, "spikes", atFloor(foe.x, foe.y, 18), { damage, quiet: true, delay: 0.05 });
    if (values.hold) {
      foe.halt = Math.max(foe.halt, values.hold);
    }
    if (values.mark) {
      roseMark(foe);
    }
    if (values.echo) {
      skillStrike(foe, values.echo, ID);
    }
    if (evolved) {
      game.fx.push(createGlassRapier(foe, -1, 0.06, progress.stats.ad * values.star, ID));
    }
  },
};
