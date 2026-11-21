import { drillFighter } from "../../../../../drill";
import { launchEnemy } from "../../../../../game/enemies/airborne";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { skillStrike } from "../strike";

const ID = "br_launch";
const CRASH_AFTER = 0.45;

export const SKYWARD_HEAVE_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes ?? 0;
  },
  swordHit(foe, _infusion, { values, evolved }) {
    const strike = drillFighter()?.swing?.kind;
    if (foe.air && strike !== "second") {
      skillStrike(foe, values.air ?? 0, ID);
    }
    if (strike !== "second") {
      return;
    }
    launchEnemy(foe, -values.launch);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (evolved) {
      later(CRASH_AFTER, () => skillStrike(foe, values.crash, ID, { spike: true }));
    }
  },
};
