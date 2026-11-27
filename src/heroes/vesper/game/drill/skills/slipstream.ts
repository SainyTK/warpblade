import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
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
    if (h && foes.length > 0) {
      const extra = (values.echo ?? 0) + (evolved ? (values.current ?? 0) * 2 : 0);
      vesperFx(
        ID,
        { x: h.x - h.face * 44, y: h.y - 16, face: h.face, toX: h.x, toY: h.y - 16 },
        { damage: progress.stats.ad * ((values.cut ?? 0) + extra) * foes.length },
      );
    }
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
