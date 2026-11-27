import { game, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { createPetalRing } from "../../effects/petals";
import { atFloor, atFoe, ceriseFx } from "../../fx";
import { bindWithBloom } from "../statuses";
import { foesNear, spellStrike } from "./strike";

const ID = "ce_bloom";

export const ROSE_BLOOM_DRILL: CeriseDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "bloom") {
      return;
    }
    spellStrike(foe, values.bloom, ID);
    const blow = progress.stats.ap * values.bloom * 2;
    ceriseFx(ID, "burst", atFoe(foe, 14), { damage: blow, sigil: "rose" });
    if (values.linger || evolved) {
      ceriseFx(ID, "nova", atFloor(foe.x, foe.y, evolved ? values.full * 0.6 : values.ring), {
        damage: blow,
        quiet: true,
      });
    }
    if (values.linger) {
      game.fx.push(createPetalRing(foe.x, foe.y - 12, values.ring, values.linger, progress.stats.ap * values.tick, ID));
    }
    if (values.launch && !foe.air) {
      foe.vy = -180;
    }
    if (evolved) {
      for (const near of foesNear(foe.x, foe.y - 12, values.full).filter((other) => other !== foe)) {
        spellStrike(near, values.bloom, ID);
        bindWithBloom(near);
      }
    }
  },
  swordHit(foe, infusion, { values }) {
    if (infusion?.id === "bloom" && values.edge) {
      spellStrike(foe, values.edge, ID);
    }
  },
};
