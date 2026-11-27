import { progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFoe, ceriseFx } from "../../fx";
import { roseMark } from "../../mark";

export const WEEPING_MARK_DRILL: CeriseDrillSkill = {
  id: "ce_weep",
  spellHit(foe, _spell, { values }) {
    if (values.spells) {
      roseMark(foe);
      ceriseFx("ce_weep", "mark", atFoe(foe, 12), {
        damage: progress.stats.ad * values.spells * 4,
        sigil: "rose",
        lift: 6,
      });
    }
  },
};
