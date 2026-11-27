import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { zafirFx } from "../../skillFx";
import { gainWhirl } from "../../whirl";
import { openWounds } from "../../wounds";
import { throwCrescents } from "../crescents";
import { fighterAt, skillStrike } from "../strike";

const ID = "za_dune";

export const DUNE_WALK_DRILL: ZafirDrillSkill = {
  id: ID,
  dashed(foes, { values, evolved }) {
    const { x, y, face } = fighterAt();
    if (foes.length) {
      const from = { x: x - face * 48, y: y - 14, face, toX: x - face * 8, toY: y - 14 };
      zafirFx(ID, "trail", from, { damage: progress.stats.ad * values.cut, mark: "both" });
    }
    for (const foe of foes) {
      skillStrike(foe, values.cut, ID, { melee: true });
      openWounds(foe, values.wounds ?? 0);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    if (foes.length && values.whirl) {
      gainWhirl(values.whirl);
    }
    if (evolved) {
      throwCrescents(values.crescent, ID, true);
      for (const dir of [-1, 1]) {
        const crescent = { x, y: y - 14, face: dir, reach: 16 };
        zafirFx(ID, "slash", crescent, { quiet: true, damage: progress.stats.ad * values.crescent });
      }
    }
  },
};
