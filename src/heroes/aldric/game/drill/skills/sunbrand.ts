import { drillFighter } from "../../../../../drill";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { brand } from "../../skills/sunbrand";

export const SUNBRAND_DRILL: AldricDrillSkill = {
  id: "al_brand",
  swordHit(foe, _infusion, { values }) {
    const kind = drillFighter()?.swing?.kind;
    if ((kind === "second" && values.bash) || (kind === "first" && values.cut)) {
      brand(foe);
    }
  },
  spellHit(foe, spell, { values }) {
    if (spell.id === "pillar" && values.pillar) {
      brand(foe);
    }
  },
};
