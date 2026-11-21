import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { echo, twinWaves } from "../effects";
import { skillStrike } from "../strike";

const ID = "ve_edge";

export const RISING_EDGE_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.strikeReach *= 1 + (values.reach ?? 0);
  },
  swordHit(foe, _infusion, strike, { values }) {
    if (strike !== "first") {
      return;
    }
    skillStrike(foe, values.bonus, ID);
    echo(foe, values.echo ?? 0, ID);
    if (values.twice) {
      echo(foe, values.echo, ID, 0.18);
    }
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (evolved && strike === "first") {
      twinWaves(values.wave, ID);
    }
  },
};
