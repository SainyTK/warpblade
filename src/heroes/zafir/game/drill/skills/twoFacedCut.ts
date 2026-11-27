import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { zafirFx } from "../../skillFx";
import { openWounds } from "../../wounds";
import { blindMinion, fighterAt, foesAround, isBehind, skillStrike, swingKind } from "../strike";

const ID = "za_twofaced";
const MIRROR_REACH = 44;

export const TWO_FACED_CUT_DRILL: ZafirDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values }) {
    if (values.wounds && isBehind(foe)) {
      openWounds(foe, values.wounds);
    }
    if (swingKind() !== "second") {
      return;
    }
    skillStrike(foe, values.second, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    blindMinion(foe, values.blind ?? 0);
  },
  slashed(strike, landed, { values, evolved }) {
    if (strike !== "second") {
      return;
    }
    const { x, y, face } = fighterAt();
    const back = { x: x - face * 14, y: y - 18, face: -face, reach: 20 };
    zafirFx(ID, "slash", back, { damage: progress.stats.ad * (1 + values.second), quiet: !landed });
    if (!evolved) {
      return;
    }
    const mirror = { x: x - face * 26, y: y - 18, face: -face, reach: MIRROR_REACH * 0.28 };
    zafirFx(ID, "burst", mirror, { damage: progress.stats.ad * values.mirror, delay: 0.06 });
    for (const foe of foesAround(MIRROR_REACH, 30)) {
      if (Math.sign(foe.x - x) === -face) {
        skillStrike(foe, values.mirror, ID);
      }
    }
  },
};
