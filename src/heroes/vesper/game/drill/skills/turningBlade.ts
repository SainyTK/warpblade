import { drillFighter } from "../../../../../drill";
import { createSlash } from "../../../../../game/effects/slash";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { nearestFoe } from "../../../../../game/skills/targets";
import { game, hero, progress } from "../../../../../game/state";
import { NIGHT_RAMP } from "../../../look/colors";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_turn";
const SPIN = { cx: 0, cy: -18, R: 30, sy: 0.35, rot: 0, a0: -3.14, a1: 3.14, W: 8, trail: 0.24, ramp: NIGHT_RAMP };

export const TURNING_BLADE_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.parryWindow *= values.window;
  },
  parried(_cue, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const near = foesNear(h.x, h.y - 16, values.wide ? 50 : 40);
    const first = nearestFoe(h.x, h.y - 16);
    const struck = values.wide ? near : near.filter((foe) => foe === first);
    const spin = evolved ? (values.spinPower ?? 0) : 0;
    vesperFx(
      ID,
      { x: h.x + h.face * 8, y: h.y - 18, face: h.face },
      { damage: progress.stats.ad * (1 + (values.cut ?? 0) * 2 + spin) },
    );
    for (const foe of struck) {
      skillStrike(foe, values.cut ?? 0, ID, { sureCrit: true });
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    if (values.warp) {
      h.warpReadyIn = 0;
      hero.warpCd = 0;
      h.airDashes = Math.max(h.airDashes, 1);
    }
    if (evolved) {
      game.fx.push(createSlash(h.x, h.y, h.face, SPIN));
      for (const foe of foesNear(h.x, h.y - 16, values.spin)) {
        skillStrike(foe, values.spinPower, ID);
      }
    }
  },
};
