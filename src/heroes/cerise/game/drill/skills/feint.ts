import { drillFighter } from "../../../../../drill";
import { markFoe } from "../../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { createGlassRapier } from "../../effects/glassRapier";
import { atFoe, atHero, ceriseFx } from "../../fx";
import { foesAhead, skillStrike } from "./strike";

const ID = "ce_feint";

export const FEINT_DRILL: CeriseDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values, evolved }) {
    const h = drillFighter();
    if (h?.swing?.kind !== "second") {
      return;
    }
    markFoe(foe, ID, values.openTime, values.open);
    const damage = progress.stats.ad * (1 + values.open + (evolved ? values.phantom : 0));
    ceriseFx(ID, "slash", { ...atHero(18), face: hero.face }, { damage, sigil: "thrust" });
    if (evolved) ceriseFx(ID, "slash", atFoe(foe, 16, -hero.face), { damage, quiet: true, delay: 0.08 });
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (values.refresh) {
      h.dashReadyIn = 0;
    }
    if (evolved) {
      game.fx.push(createGlassRapier(foe, foe.x < hero.x ? 1 : -1, 0.08, progress.stats.ad * values.phantom, ID));
    }
  },
  slashed(strike, landed, { values }) {
    if (strike !== "second" || !landed || !values.behind) {
      return;
    }
    for (const foe of foesAhead(36, hero.face === 1 ? -1 : 1)) {
      skillStrike(foe, values.behind, ID);
    }
  },
};
