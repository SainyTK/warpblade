import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero } from "../../../../../game/state";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { createTracerLine } from "../../effects/tracerLine";
import { fireRound } from "../round";
import { skillStrike } from "../strike";
import { struckThisSwing } from "../trigger";

const ID = "ca_tracer";
const warpFrom = { x: 0, y: 0, armed: false };

export const TRACER_WARP_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpCooldown *= 1 - values.cooldown;
    m.warpDamage *= 1 + values.damage;
  },
  tick() {
    const warp = drillFighter()?.warp;
    if (warp?.phase === "throw" && !warpFrom.armed) {
      Object.assign(warpFrom, { x: hero.x, y: hero.y - 18, armed: true });
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "warp") {
      return;
    }
    const h = drillFighter();
    const x0 = warpFrom.armed ? warpFrom.x : hero.x - hero.face * 60;
    warpFrom.armed = false;
    const [lo, hi] = x0 < hero.x ? [x0, hero.x] : [hero.x, x0];
    if (values.line) {
      game.fx.push(createTracerLine(x0, warpFrom.y, hero.x, hero.y - 18));
      for (const foe of game.enemies.filter((e) => e.hp > 0 && e.x >= lo && e.x <= hi && Math.abs(e.y - hero.y) < 40)) {
        skillStrike(foe, values.line, ID, { kx: hero.face * 30 });
        if (evolved) {
          fireRound(foe, { power: values.line, kind: "warp", source: ID });
        }
      }
    }
    for (const foe of struckThisSwing()) {
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    if (values.refresh && h) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
  },
};
