import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFloor, atHero, ceriseFx } from "../../fx";
import { roseMark } from "../../mark";
import { foesNear, skillStrike } from "./strike";

const ID = "ce_markwarp";

export const ROSE_MARK_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpDamage *= 1 + values.warp;
    m.warpCooldown *= 1 - values.recharge;
  },
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.warp?.phase !== "arrival") {
      return;
    }
    roseMark(foe);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
  },
  moment(moment, { values, evolved }) {
    const h = drillFighter();
    if (moment !== "arrival" || !h) {
      return;
    }
    const damage = progress.stats.ad * (1 + values.warp + (values.pierce ?? 0)) * 2;
    ceriseFx(ID, "mark", atHero(14, 18), { damage, sigil: "rose" });
    ceriseFx(ID, "nova", atFloor(hero.x, hero.y, evolved ? values.garden : 22), { damage, quiet: true });
    if (values.pierce) {
      for (const foe of foesNear(hero.x + hero.face * 40, hero.y - 16, 30)) {
        skillStrike(foe, values.pierce, ID);
      }
    }
    if (values.restore) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
    if (evolved) {
      for (const foe of foesNear(hero.x, hero.y - 16, values.garden)) {
        roseMark(foe);
      }
    }
  },
};
