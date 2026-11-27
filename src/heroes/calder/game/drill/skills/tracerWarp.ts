import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { createTracerLine } from "../../effects/tracerLine";
import { tracerFx } from "../../tracerFx";
import { fireRound } from "../round";
import { skillStrike } from "../strike";
import { struckThisSwing } from "../trigger";

const ID = "ca_tracer";
const warpFrom = { x: 0, y: 0, armed: false };
rememberPerSeat(hostMemory(warpFrom));

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
    const f = h ?? hero;
    const x0 = warpFrom.armed ? warpFrom.x : f.x - f.face * 60;
    warpFrom.armed = false;
    const [lo, hi] = x0 < f.x ? [x0, f.x] : [f.x, x0];
    const y0 = warpFrom.y || f.y - 18;
    tracerFx(x0, y0, f.x, f.y - 18, progress.stats.ad * ((values.line ?? 0) + values.damage + 0.6));
    if (values.line) {
      game.fx.push(createTracerLine(x0, y0, f.x, f.y - 18));
      for (const foe of game.enemies.filter((e) => e.hp > 0 && e.x >= lo && e.x <= hi && Math.abs(e.y - f.y) < 40)) {
        skillStrike(foe, values.line, ID, { kx: f.face * 30 });
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
