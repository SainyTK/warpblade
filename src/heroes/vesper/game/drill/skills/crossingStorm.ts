import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { echo, twinWaves } from "../effects";
import { liftFoe } from "../statuses";
import { foesNear } from "../strike";

const ID = "ve_storm";

export const CROSSING_STORM_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.finisherDamage *= 1 + values.finisher;
  },
  swordHit(foe, _infusion, strike, { values, evolved }) {
    if (strike !== "third") {
      return;
    }
    if (values.lift) {
      liftFoe(foe, -values.lift);
    }
    if (evolved) {
      echo(foe, values.wave, ID, 0.12);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "third" || !h) {
      return;
    }
    const waves = (values.wave ?? 0) * (evolved ? 4 : values.both ? 2 : 1) * 2;
    vesperFx(
      ID,
      { x: h.x + h.face * 14, y: h.y - 18, face: h.face },
      { damage: progress.stats.ad * (1 + (values.finisher ?? 0) + waves) },
    );
    if (values.wave) {
      twinWaves(values.wave, ID);
      if (values.both || evolved) {
        twinWaves(values.wave, ID, -h.face);
      }
      if (evolved) {
        twinWaves(values.wave, ID, h.face, h.y - 30);
        twinWaves(values.wave, ID, -h.face, h.y - 30);
      }
    }
    if (values.stagger) {
      for (const foe of foesNear(h.x, h.y - 16, 50)) {
        staggerFoe(foe, values.stagger);
      }
    }
  },
};
