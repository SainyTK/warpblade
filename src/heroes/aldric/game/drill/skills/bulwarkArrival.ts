import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { aldricFx } from "../../fx";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_bulwark";
const walker = { readyIn: 0 };
rememberPerSeat(hostMemory(walker));

export const BULWARK_ARRIVAL_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpCooldown *= values.cooldown;
    m.warpDamage *= 1 + values.damage;
  },
  tick(dt) {
    walker.readyIn = Math.max(0, walker.readyIn - dt);
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "warp" || !h) {
      return;
    }
    const floor = surfaceBelow(h.x, h.y - 2);
    aldricFx(
      ID,
      "pillar",
      { x: h.x + h.face * 6, y: floor, face: h.face, reach: 28 },
      {
        damage: progress.stats.ad * 2 * (1 + values.damage),
        sigil: "sword",
        lift: 12,
      },
    );
    aldricFx(ID, "nova", { x: h.x, y: floor, reach: values.blast || 24 }, { quiet: true, delay: 0.04 });
    if (evolved) {
      aldricFx(ID, "pillar", { x: h.x - h.face * 14, y: floor, reach: 24 }, { quiet: true, delay: 0.1 });
    }
    if (values.blast) {
      for (const foe of foesNear(h.x, h.y - 16, values.blast)) {
        attackStrike(foe, values.blastPower, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    if (values.heal) {
      hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * values.heal);
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
    if (evolved && walker.readyIn === 0) {
      walker.readyIn = values.every;
      h.warpReadyIn = 0;
      hero.warpCd = 0;
    }
  },
};
