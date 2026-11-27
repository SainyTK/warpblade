import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFoe, ceriseFx } from "../../fx";
import { roseMark } from "../../mark";
import { foesAhead, skillStrike } from "./strike";

const ID = "ce_step";

export const PASSING_TOUCH_DRILL: CeriseDrillSkill = {
  id: ID,
  dashed(foes, { values, evolved }) {
    if (foes.length || values.thrust) {
      const damage = progress.stats.ad * (values.cut * (evolved ? 2 : 1) + (values.thrust ?? 0)) * 2;
      const y = hero.y - 15;
      ceriseFx(
        ID,
        "trail",
        { x: hero.x - hero.face * 50, y, face: hero.face, toX: hero.x, toY: y },
        {
          damage,
          sigil: "thrust",
        },
      );
      for (const foe of evolved ? foes : []) ceriseFx(ID, "slash", atFoe(foe, 12), { damage, quiet: true });
    }
    for (const foe of foes) {
      skillStrike(foe, values.cut, ID);
      if (evolved) {
        skillStrike(foe, values.cut * 0.5, ID);
        skillStrike(foe, values.cut * 0.5, ID);
      }
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (values.mark) {
        roseMark(foe);
      }
    }
    const h = drillFighter();
    if (values.refresh && foes.length && h) {
      h.dashReadyIn = 0;
    }
    if (values.thrust) {
      for (const foe of foesAhead(34)) {
        skillStrike(foe, values.thrust, ID);
      }
    }
  },
};
