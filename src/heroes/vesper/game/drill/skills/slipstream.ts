import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { echo, twinWaves } from "../effects";
import { skillStrike } from "../strike";

const ID = "ve_slip";

export const SLIPSTREAM_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDash ?? 0;
  },
  dashed(foes, { values, evolved }) {
    const h = drillFighter();
    for (const foe of foes) {
      skillStrike(foe, values.cut, ID);
      echo(foe, values.echo ?? 0, ID);
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    if (h && foes.length > 0 && values.refund) {
      h.dashReadyIn = 0;
    }
    if (h && evolved) {
      twinWaves(values.current, ID, h.face);
    }
  },
};
